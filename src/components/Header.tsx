import React from 'react';
import { 
  Calendar, 
  TableProperties, 
  FileSpreadsheet, 
  Download, 
  Info,
  UserCheck
} from 'lucide-react';
import { WARD_INFO } from '../data/rosterData';
import { StaffMember } from '../types/roster';

interface HeaderProps {
  activeTab: 'personal' | 'master';
  setActiveTab: (tab: 'personal' | 'master') => void;
  selectedStaff: StaffMember;
  onSelectStaff: (id: string) => void;
  wifeStaffId: string;
  onOpenLegend: () => void;
  onOpenUpload: () => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedStaff,
  onSelectStaff,
  wifeStaffId,
  onOpenLegend,
  onOpenUpload,
  onExport,
}) => {
  const isRichaActive = selectedStaff.id === wifeStaffId;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Wireframe Header (🏥 St. V Hospital | Ward 9 North, 👤 Profile: Registered Nurse) */}
        <div className="flex items-center gap-3">
          <img
            src="/icon.svg"
            alt="St. V Hospital App Icon"
            className="w-10 h-10 rounded-2xl p-1 bg-sky-50 border border-sky-200 shadow-xs shrink-0 object-contain"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                <span>🏥 St. V Hospital</span>
                <span className="text-slate-300">|</span>
                <span className="text-sky-700 font-bold">Ward 9 North</span>
              </h1>
            </div>
            <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
              <span>👤 <b>Profile:</b> {selectedStaff.role} ({selectedStaff.name}{isRichaActive ? ' ❤️' : ''})</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Quick Return to Richa if viewing someone else */}
          {!isRichaActive && (
            <button
              onClick={() => {
                onSelectStaff(wifeStaffId);
                setActiveTab('personal');
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition shadow-2xs"
            >
              <span>Back to Richa ❤️</span>
            </button>
          )}

          {/* View Mode Toggle Switch */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'personal'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>My Roster</span>
            </button>
            <button
              onClick={() => setActiveTab('master')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'master'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Ward Directory</span>
            </button>
          </div>

          {/* Tools */}
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenLegend}
              className="p-2 text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-xl transition"
              title="Shift Legend"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenUpload}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition"
              title="Upload Roster"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            </button>
            <button
              onClick={onExport}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition"
              title="Export Roster"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
