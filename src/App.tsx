import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  StaffSelector 
} from './components/StaffSelector';
import { 
  PersonalCalendarView 
} from './components/PersonalCalendarView';
import { 
  WardMasterView 
} from './components/WardMasterView';
import { 
  ShiftSwapModal 
} from './components/ShiftSwapModal';
import { 
  ShiftLegend 
} from './components/ShiftLegend';
import { 
  ExcelUploadModal 
} from './components/ExcelUploadModal';
import { 
  SwapRequestsTracker 
} from './components/SwapRequestsTracker';
import { 
  INITIAL_STAFF_MEMBERS, 
  WARD_INFO,
  ROSTER_DAYS 
} from './data/rosterData';
import { 
  StaffMember, 
  DayInfo, 
  ShiftCode, 
  SwapRequest 
} from './types/roster';
import { exportRosterToExcel } from './utils/excelParser';
import { 
  RotateCcw, 
  Calendar, 
  TableProperties, 
  Info, 
  FileSpreadsheet,
  Download
} from 'lucide-react';

const WIFE_STAFF_ID = 'staff-richa-budhathoki';
const STORAGE_KEY = 'st_vincents_roster_data_v4';
const REQUESTS_KEY = 'st_vincents_swap_requests_v4';

export function App() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached roster', e);
      }
    }
    return INITIAL_STAFF_MEMBERS;
  });

  const [selectedStaffId, setSelectedStaffId] = useState<string>(WIFE_STAFF_ID);
  const [activeTab, setActiveTab] = useState<'personal' | 'master'>('personal');
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const [swapModalState, setSwapModalState] = useState<{
    isOpen: boolean;
    staff: StaffMember | null;
    dayInfo: DayInfo | null;
    currentShift: ShiftCode;
  }>({
    isOpen: false,
    staff: null,
    dayInfo: null,
    currentShift: 'OFF',
  });

  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(() => {
    const saved = localStorage.getItem(REQUESTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached requests', e);
      }
    }
    return [
      {
        id: 'req-demo-1',
        fromStaffId: WIFE_STAFF_ID,
        toStaffId: 'staff-sushmita-rana-magar',
        dateStr: '2026-10-18',
        originalShift: 'N',
        targetShift: 'OFF',
        status: 'pending',
        notes: 'Requested Sunday night shift coverage via WhatsApp',
        timestamp: 'Today 19:30'
      }
    ];
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staffMembers));
  }, [staffMembers]);

  useEffect(() => {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(swapRequests));
  }, [swapRequests]);

  const activeStaff = staffMembers.find((s) => s.id === selectedStaffId) || staffMembers[0];

  // Initiate shift swap modal from Personal or Master views
  const handleOpenSwapModal = (dayInfo: DayInfo, currentShift: ShiftCode, specificStaff?: StaffMember) => {
    const targetStaff = specificStaff || activeStaff;
    setSwapModalState({
      isOpen: true,
      staff: targetStaff,
      dayInfo,
      currentShift,
    });
  };

  // Immediate swap execution in live memory & localStorage
  const handleConfirmInstantSwap = (fromStaffId: string, toStaffId: string, dateStr: string) => {
    setStaffMembers((prevList) => {
      const fromStaff = prevList.find((s) => s.id === fromStaffId);
      const toStaff = prevList.find((s) => s.id === toStaffId);
      if (!fromStaff || !toStaff) return prevList;

      const fromShift = fromStaff.shifts[dateStr] || 'OFF';
      const toShift = toStaff.shifts[dateStr] || 'OFF';

      return prevList.map((s) => {
        if (s.id === fromStaffId) {
          return {
            ...s,
            shifts: {
              ...s.shifts,
              [dateStr]: toShift,
            },
          };
        }
        if (s.id === toStaffId) {
          return {
            ...s,
            shifts: {
              ...s.shifts,
              [dateStr]: fromShift,
            },
          };
        }
        return s;
      });
    });
  };

  const handleSendSwapRequest = (
    fromStaffId: string,
    toStaffId: string,
    dateStr: string,
    notes: string
  ) => {
    const fromStaff = staffMembers.find((s) => s.id === fromStaffId);
    const newReq: SwapRequest = {
      id: `req-${Date.now()}`,
      fromStaffId,
      toStaffId,
      dateStr,
      originalShift: fromStaff?.shifts[dateStr] || 'M',
      targetShift: 'OFF',
      status: 'pending',
      notes,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setSwapRequests((prev) => [newReq, ...prev]);
  };

  const handleRemoveSwapRequest = (id: string) => {
    setSwapRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleExport = () => {
    exportRosterToExcel(staffMembers);
  };

  const handleResetRoster = () => {
    if (window.confirm('Reset roster back to official schedule?')) {
      setStaffMembers(INITIAL_STAFF_MEMBERS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-20 md:pb-6">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedStaff={activeStaff}
        onSelectStaff={setSelectedStaffId}
        wifeStaffId={WIFE_STAFF_ID}
        onOpenLegend={() => setIsLegendOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
        onExport={handleExport}
      />

      {/* Main Workspace */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        {/* Sleek Staff Selector (Search Dropdown with Richa highlighted) */}
        <StaffSelector
          staffMembers={staffMembers}
          selectedStaffId={selectedStaffId}
          onSelectStaff={setSelectedStaffId}
          wifeStaffId={WIFE_STAFF_ID}
        />

        {/* Swap Tracker (shows pending / active requests) */}
        <SwapRequestsTracker
          requests={swapRequests}
          staffMembers={staffMembers}
          onRemoveRequest={handleRemoveSwapRequest}
        />

        {/* Active View: Personal Calendar vs Master Roster */}
        {activeTab === 'personal' ? (
          activeStaff ? (
            <PersonalCalendarView
              staff={activeStaff}
              onInitiateSwap={(dayInfo, shiftCode) => handleOpenSwapModal(dayInfo, shiftCode)}
            />
          ) : (
            <div className="p-8 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
              No nurse selected.
            </div>
          )
        ) : (
          <WardMasterView
            staffMembers={staffMembers}
            onSelectStaff={(id) => {
              setSelectedStaffId(id);
              setActiveTab('personal');
            }}
            onInitiateSwap={(dayInfo, shiftCode, specificStaff) =>
              handleOpenSwapModal(dayInfo, shiftCode, specificStaff)
            }
            wifeStaffId={WIFE_STAFF_ID}
          />
        )}

        {/* Bottom Helper Bar (Clean minimal text) */}
        <div className="p-4 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">
              Ward 9 North Nurse Shift & Swap Companion
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetRoster}
              className="text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Schedule</span>
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => {
            setSelectedStaffId(WIFE_STAFF_ID);
            setActiveTab('personal');
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition ${
            selectedStaffId === WIFE_STAFF_ID && activeTab === 'personal'
              ? 'text-rose-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="text-base leading-none">❤️</span>
          <span>Richa</span>
        </button>

        <button
          onClick={() => setActiveTab('personal')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition ${
            activeTab === 'personal' && selectedStaffId !== WIFE_STAFF_ID
              ? 'text-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab('master')}
          className={`flex flex-col items-center gap-1 text-[11px] font-bold transition ${
            activeTab === 'master' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <TableProperties className="w-5 h-5" />
          <span>Ward Master</span>
        </button>

        <button
          onClick={() => setIsLegendOpen(true)}
          className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <Info className="w-5 h-5" />
          <span>Legend</span>
        </button>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
          <span>Upload</span>
        </button>
      </nav>

      {/* Modals */}
      {swapModalState.isOpen && swapModalState.staff && swapModalState.dayInfo && (
        <ShiftSwapModal
          isOpen={swapModalState.isOpen}
          onClose={() =>
            setSwapModalState((prev) => ({ ...prev, isOpen: false }))
          }
          staff={swapModalState.staff}
          dayInfo={swapModalState.dayInfo}
          currentShift={swapModalState.currentShift}
          allStaff={staffMembers}
          onConfirmInstantSwap={handleConfirmInstantSwap}
          onSendSwapRequest={handleSendSwapRequest}
        />
      )}

      <ShiftLegend
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
      />

      <ExcelUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onImportSuccess={(importedStaff) => {
          setStaffMembers(importedStaff);
          if (importedStaff.length > 0) {
            setSelectedStaffId(importedStaff[0].id);
          }
        }}
      />
    </div>
  );
}

export default App;
