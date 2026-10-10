import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  User, 
  ArrowLeftRight, 
  Heart, 
  Calendar,
  Sun,
  Sunset,
  Moon,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Coffee,
  CheckCircle2,
  TableProperties,
  LayoutGrid,
  CalendarDays
} from 'lucide-react';
import { StaffMember, DayInfo, ShiftCode, StaffSection } from '../types/roster';
import { SHIFT_DEFINITIONS, ROSTER_DAYS } from '../data/rosterData';

interface WardMasterViewProps {
  staffMembers: StaffMember[];
  onSelectStaff: (id: string) => void;
  onInitiateSwap: (dayInfo: DayInfo, currentShift: ShiftCode, staff: StaffMember) => void;
  homeStaffId: string;
}

export const WardMasterView: React.FC<WardMasterViewProps> = ({
  staffMembers,
  onSelectStaff,
  onInitiateSwap,
  homeStaffId,
}) => {
  // Format current date YYYY-MM-DD to select today by default
  const getTodayStr = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = getTodayStr();

  // Find if today is in ROSTER_DAYS, otherwise default to first day (Oct 08)
  const defaultDateStr = ROSTER_DAYS.some(d => d.dateStr === todayStr) 
    ? todayStr 
    : (ROSTER_DAYS[0]?.dateStr || '2026-10-08');

  // View mode: 'daily' (mobile friendly day cards) vs 'matrix' (full spreadsheet)
  const [viewMode, setViewMode] = useState<'daily' | 'matrix'>('daily');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(defaultDateStr);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<StaffSection | 'All'>('All');
  const [matrixFilterDutyType, setMatrixFilterDutyType] = useState<'all' | 'Morning' | 'Evening' | 'Night'>('all');

  const selectedDayInfo = useMemo(() => {
    return ROSTER_DAYS.find(d => d.dateStr === selectedDateStr) || ROSTER_DAYS[0];
  }, [selectedDateStr]);

  const selectedDayIndex = useMemo(() => {
    return ROSTER_DAYS.findIndex(d => d.dateStr === selectedDateStr);
  }, [selectedDateStr]);

  const handlePrevDay = () => {
    if (selectedDayIndex > 0) {
      setSelectedDateStr(ROSTER_DAYS[selectedDayIndex - 1].dateStr);
    }
  };

  const handleNextDay = () => {
    if (selectedDayIndex < ROSTER_DAYS.length - 1) {
      setSelectedDateStr(ROSTER_DAYS[selectedDayIndex + 1].dateStr);
    }
  };

  // Group staff on selected date for the Day-by-Day mobile view
  const dailyGroups = useMemo(() => {
    const amList: { staff: StaffMember; code: ShiftCode }[] = [];
    const pmList: { staff: StaffMember; code: ShiftCode }[] = [];
    const ndList: { staff: StaffMember; code: ShiftCode }[] = [];
    const offList: { staff: StaffMember; code: ShiftCode }[] = [];

    staffMembers.forEach((staff) => {
      // Apply search query filter
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matches = staff.name.toLowerCase().includes(query) || staff.role.toLowerCase().includes(query);
        if (!matches) return;
      }

      // Apply section filter
      if (selectedSection !== 'All' && staff.section !== selectedSection) {
        return;
      }

      const code = (staff.shifts[selectedDateStr] || 'OFF') as ShiftCode;
      const def = SHIFT_DEFINITIONS[code] || SHIFT_DEFINITIONS.OFF;

      if (def.category === 'Morning' || def.category === 'Day' || def.category === 'Study') {
        amList.push({ staff, code });
      } else if (def.category === 'Evening') {
        pmList.push({ staff, code });
      } else if (def.category === 'Night') {
        ndList.push({ staff, code });
      } else {
        offList.push({ staff, code });
      }
    });

    return { amList, pmList, ndList, offList };
  }, [staffMembers, selectedDateStr, searchTerm, selectedSection]);

  // Matrix Filtered Staff List
  const matrixFilteredStaff = useMemo(() => {
    return staffMembers.filter((staff) => {
      const matchesSearch = 
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSection = selectedSection === 'All' || staff.section === selectedSection;

      let matchesDuty = true;
      if (matrixFilterDutyType !== 'all') {
        const code = (staff.shifts[selectedDateStr] || 'OFF') as ShiftCode;
        const meta = SHIFT_DEFINITIONS[code] || SHIFT_DEFINITIONS.OFF;
        matchesDuty = meta.category === matrixFilterDutyType;
      }

      return matchesSearch && matchesSection && matchesDuty;
    });
  }, [staffMembers, searchTerm, selectedSection, matrixFilterDutyType, selectedDateStr]);

  const sections: (StaffSection | 'All')[] = [
    'All',
    'RN In charge',
    'RN',
    'Management',
    'Registered Nurse Transition Program (TSPRN)',
    'EEN'
  ];

  // Headcounts helper
  const getDayHeadcounts = (dateStr: string) => {
    let amCount = 0;
    let pmCount = 0;
    let ndCount = 0;
    let offCount = 0;

    staffMembers.forEach((s) => {
      const code = s.shifts[dateStr] || 'OFF';
      const def = SHIFT_DEFINITIONS[code] || SHIFT_DEFINITIONS.OFF;
      if (def.category === 'Morning' || def.category === 'Day' || def.category === 'Study') amCount++;
      else if (def.category === 'Evening') pmCount++;
      else if (def.category === 'Night') ndCount++;
      else offCount++;
    });

    return { amCount, pmCount, ndCount, offCount };
  };

  const currentCounts = getDayHeadcounts(selectedDateStr);
  const monthName = selectedDateStr.startsWith('2026-11') ? 'November' : 'October';

  return (
    <div className="space-y-4">
      {/* Top Header & View Mode Switcher */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>Ward 9 North • Ward Directory</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                33 Rostered Staff
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse shifts by day or view the full hospital spreadsheet matrix.
            </p>
          </div>

          {/* View Toggle: Day View (Mobile) vs Full Matrix */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold self-start sm:self-center">
            <button
              onClick={() => setViewMode('daily')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                viewMode === 'daily'
                  ? 'bg-white text-blue-700 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <span>Day View (Mobile)</span>
            </button>

            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                viewMode === 'matrix'
                  ? 'bg-white text-blue-700 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableProperties className="w-4 h-4 text-blue-600" />
              <span>Full Matrix</span>
            </button>
          </div>
        </div>

        {/* Search & Section Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 border-t border-slate-100">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search nurse or role (e.g. Richa, RN)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Role pills */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {sections.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedSection === sec
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sec === 'All' ? 'All Roles' : sec.replace('Registered Nurse Transition Program (TSPRN)', 'TSPRN')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: DAY-BY-DAY MOBILE-FRIENDLY CARDS VIEW */}
      {viewMode === 'daily' ? (
        <div className="space-y-4">
          {/* Horizontal Date Picker Strip */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-3 sm:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevDay}
                  disabled={selectedDayIndex <= 0}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none text-slate-700 transition"
                  title="Previous Day"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {selectedDayInfo.fullDayName}, {monthName} {selectedDayInfo.dayNumber} 2026
                </div>
                <button
                  onClick={handleNextDay}
                  disabled={selectedDayIndex >= ROSTER_DAYS.length - 1}
                  className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none text-slate-700 transition"
                  title="Next Day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {selectedDateStr !== todayStr && (
                <button
                  onClick={() => setSelectedDateStr(defaultDateStr)}
                  className="text-xs text-blue-600 font-bold hover:underline px-2 py-1 rounded-lg bg-blue-50"
                >
                  Jump to Today
                </button>
              )}
            </div>

            {/* Scrollable Date Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-thin">
              {ROSTER_DAYS.map((day) => {
                const isSelected = day.dateStr === selectedDateStr;
                const isToday = day.dateStr === todayStr;
                const mLabel = day.dateStr.startsWith('2026-11') ? 'Nov' : 'Oct';

                return (
                  <button
                    key={day.dateStr}
                    onClick={() => setSelectedDateStr(day.dateStr)}
                    className={`flex flex-col items-center min-w-[56px] py-2 px-1.5 rounded-2xl border transition-all shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105'
                        : isToday
                          ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                          : day.isWeekend
                            ? 'bg-slate-100/70 border-slate-200 text-slate-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[10px] font-semibold uppercase">{day.dayName}</span>
                    <span className="text-base font-black leading-tight">{day.dayNumber}</span>
                    <span className="text-[9px] opacity-80">{mLabel}</span>
                    {isToday && (
                      <span className={`text-[8px] font-extrabold px-1 rounded-full mt-0.5 ${
                        isSelected ? 'bg-white text-blue-700' : 'bg-blue-600 text-white'
                      }`}>
                        TODAY
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Live Headcounts Summary Bar for the selected date */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 flex items-center justify-between text-amber-950 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-600" /> Morning (AM)
                </span>
                <span className="bg-amber-200 px-2 py-0.5 rounded-full font-black text-xs">
                  {currentCounts.amCount}
                </span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 flex items-center justify-between text-emerald-950 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sunset className="w-3.5 h-3.5 text-emerald-600" /> Evening (PM)
                </span>
                <span className="bg-emerald-200 px-2 py-0.5 rounded-full font-black text-xs">
                  {currentCounts.pmCount}
                </span>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-2.5 flex items-center justify-between text-purple-950 font-bold">
                <span className="flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-purple-600" /> Night (ND)
                </span>
                <span className="bg-purple-200 px-2 py-0.5 rounded-full font-black text-xs">
                  {currentCounts.ndCount}
                </span>
              </div>

              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-2.5 flex items-center justify-between text-sky-950 font-bold">
                <span className="flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-sky-600" /> Off / ADO
                </span>
                <span className="bg-sky-200 px-2 py-0.5 rounded-full font-black text-xs">
                  {currentCounts.offCount}
                </span>
              </div>
            </div>
          </div>

          {/* Group 1: 🟡 Morning Team (AM) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="bg-amber-50/80 px-4 py-3 border-b border-amber-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🟡</span>
                <h3 className="font-extrabold text-sm text-amber-950">
                  Morning Shift Team (07:00 – 15:30)
                </h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                {dailyGroups.amList.length} Rostered
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {dailyGroups.amList.length > 0 ? (
                dailyGroups.amList.map(({ staff, code }) => {
                  const isHomeStaff = staff.id === homeStaffId;
                  const meta = SHIFT_DEFINITIONS[code] || SHIFT_DEFINITIONS.M;

                  return (
                    <div
                      key={staff.id}
                      className={`p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition ${
                        isHomeStaff ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => onSelectStaff(staff.id)}
                          className="font-bold text-xs sm:text-sm text-slate-800 hover:text-blue-600 text-left truncate flex items-center gap-1.5"
                        >
                          <span className="truncate">{staff.name}</span>
                          {isHomeStaff && <Heart className="w-3.5 h-3.5 text-rose-500 fill-current shrink-0" />}
                        </button>
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                          {staff.role} • {staff.section}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-xl text-xs font-bold border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}>
                          {code}
                        </span>
                        <button
                          onClick={() => onInitiateSwap(selectedDayInfo, code, staff)}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-1"
                          title="Initiate swap with this colleague"
                        >
                          <ArrowLeftRight className="w-3 h-3 text-slate-500" />
                          <span className="hidden sm:inline">Swap</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No staff rostered on Morning shift matching filter.
                </div>
              )}
            </div>
          </div>

          {/* Group 2: 🟢 Evening Team (PM) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="bg-emerald-50/80 px-4 py-3 border-b border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🟢</span>
                <h3 className="font-extrabold text-sm text-emerald-950">
                  Evening Shift Team (13:00 – 21:30)
                </h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                {dailyGroups.pmList.length} Rostered
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {dailyGroups.pmList.length > 0 ? (
                dailyGroups.pmList.map(({ staff, code }) => {
                  const isHomeStaff = staff.id === homeStaffId;
                  const meta = SHIFT_DEFINITIONS[code] || SHIFT_DEFINITIONS.E;

                  return (
                    <div
                      key={staff.id}
                      className={`p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition ${
                        isHomeStaff ? 'bg-emerald-50/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => onSelectStaff(staff.id)}
                          className="font-bold text-xs sm:text-sm text-slate-800 hover:text-blue-600 text-left truncate flex items-center gap-1.5"
                        >
                          <span className="truncate">{staff.name}</span>
                          {isHomeStaff && <Heart className="w-3.5 h-3.5 text-rose-500 fill-current shrink-0" />}
                        </button>
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                          {staff.role} • {staff.section}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-xl text-xs font-bold border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}>
                          {code}
                        </span>
                        <button
                          onClick={() => onInitiateSwap(selectedDayInfo, code, staff)}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-1"
                        >
                          <ArrowLeftRight className="w-3 h-3 text-slate-500" />
                          <span className="hidden sm:inline">Swap</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No staff rostered on Evening shift matching filter.
                </div>
              )}
            </div>
          </div>

          {/* Group 3: 🟣 Night Duty Team (ND) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="bg-purple-50/80 px-4 py-3 border-b border-purple-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🟣</span>
                <h3 className="font-extrabold text-sm text-purple-950">
                  Night Duty Team (21:00 – 07:30)
                </h3>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                {dailyGroups.ndList.length} Rostered
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {dailyGroups.ndList.length > 0 ? (
                dailyGroups.ndList.map(({ staff, code }) => {
                  const isHomeStaff = staff.id === homeStaffId;
                  const meta = SHIFT_DEFINITIONS[code] || SHIFT_DEFINITIONS.N;

                  return (
                    <div
                      key={staff.id}
                      className={`p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition ${
                        isHomeStaff ? 'bg-purple-50/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => onSelectStaff(staff.id)}
                          className="font-bold text-xs sm:text-sm text-slate-800 hover:text-blue-600 text-left truncate flex items-center gap-1.5"
                        >
                          <span className="truncate">{staff.name}</span>
                          {isHomeStaff && <Heart className="w-3.5 h-3.5 text-rose-500 fill-current shrink-0" />}
                        </button>
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                          {staff.role} • {staff.section}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-xl text-xs font-bold border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}>
                          {code}
                        </span>
                        <button
                          onClick={() => onInitiateSwap(selectedDayInfo, code, staff)}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-1"
                        >
                          <ArrowLeftRight className="w-3 h-3 text-slate-500" />
                          <span className="hidden sm:inline">Swap</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No staff rostered on Night Duty matching filter.
                </div>
              )}
            </div>
          </div>

          {/* Group 4: 🔵 Off Duty & ADO Colleagues (Prime Swap Candidates) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="bg-sky-50/80 px-4 py-3 border-b border-sky-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🛋️</span>
                <div>
                  <h3 className="font-extrabold text-sm text-sky-950">
                    Off Duty & ADO (Available for Swap)
                  </h3>
                  <p className="text-[11px] text-sky-700">
                    Colleagues not scheduled to work on this day
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-200 text-sky-900">
                {dailyGroups.offList.length} Colleagues
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {dailyGroups.offList.length > 0 ? (
                dailyGroups.offList.map(({ staff, code }) => {
                  const isHomeStaff = staff.id === homeStaffId;
                  const isAdo = ['ADO', 'ADO4', 'ADO6', 'ADO10'].includes(code);
                  const isLeave = ['AL', 'AL6'].includes(code);

                  return (
                    <div
                      key={staff.id}
                      className={`p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition ${
                        isHomeStaff ? 'bg-sky-50/30' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => onSelectStaff(staff.id)}
                          className="font-bold text-xs sm:text-sm text-slate-800 hover:text-blue-600 text-left truncate flex items-center gap-1.5"
                        >
                          <span className="truncate">{staff.name}</span>
                          {isHomeStaff && <Heart className="w-3.5 h-3.5 text-rose-500 fill-current shrink-0" />}
                        </button>
                        <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                          {staff.role}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-xl text-xs font-bold border ${
                          isAdo 
                            ? 'bg-sky-100 text-sky-800 border-sky-300' 
                            : isLeave 
                              ? 'bg-amber-100 text-amber-800 border-amber-300' 
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {code}
                        </span>
                        <button
                          onClick={() => onInitiateSwap(selectedDayInfo, code, staff)}
                          className="px-2.5 py-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 transition flex items-center gap-1"
                          title="Ask to swap into this off day"
                        >
                          <ArrowLeftRight className="w-3 h-3 text-sky-600" />
                          <span>Request Swap</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No staff off duty matching filter.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: SPREADSHEET MATRIX TABLE */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>Scroll horizontally to view all 32 days. Tap any cell to view swap options.</span>
            <span className="font-semibold text-slate-700">{matrixFilteredStaff.length} Nurses</span>
          </div>

          <div className="overflow-x-auto max-h-[66vh] relative">
            <table className="w-full text-left text-xs border-collapse">
              {/* Table Header */}
              <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 z-20 shadow-xs border-b border-slate-200">
                <tr>
                  <th className="p-3 sticky left-0 bg-slate-100 z-30 min-w-[200px] border-r border-slate-200 font-bold">
                    Staff Name & Role
                  </th>
                  <th className="p-2 text-center w-14 border-r border-slate-200">FTE</th>
                  {ROSTER_DAYS.map((day) => {
                    const isToday = day.dateStr === todayStr;
                    return (
                      <th
                        key={day.dateStr}
                        className={`p-2 text-center min-w-[44px] border-r border-slate-200/80 ${
                          isToday ? 'bg-blue-100 ring-2 ring-blue-500 ring-inset' : day.isWeekend ? 'bg-slate-200/60 font-bold text-slate-900' : ''
                        }`}
                      >
                        <div className="text-[10px] text-slate-500 font-medium">{day.dayName}</div>
                        <div className="font-extrabold text-xs">{day.dayNumber}</div>
                        {isToday && <div className="text-[8px] font-black text-blue-700">TODAY</div>}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">
                {matrixFilteredStaff.map((staff) => {
                  const isHomeStaff = staff.id === homeStaffId;

                  return (
                    <tr
                      key={staff.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isHomeStaff ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* Sticky Staff Name Column */}
                      <td className={`p-2.5 sticky left-0 z-10 border-r border-slate-200 backdrop-blur-xs ${
                        isHomeStaff ? 'bg-rose-50/95 font-bold' : 'bg-white/95'
                      }`}>
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="min-w-0">
                            <button
                              onClick={() => onSelectStaff(staff.id)}
                              className="font-bold text-slate-800 hover:text-blue-600 text-left truncate block transition hover:underline"
                              title="Click to view personal schedule"
                            >
                              {staff.name}
                            </button>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              <span className="font-semibold text-slate-700">{staff.role}</span>
                              <span>•</span>
                              <span className="truncate">{staff.section}</span>
                            </div>
                          </div>
                          {isHomeStaff && (
                            <span className="p-1 rounded-full bg-rose-100 text-rose-600 shrink-0" title="Highlighted Profile">
                              <Heart className="w-3.5 h-3.5 fill-current" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* FTE column */}
                      <td className="p-2 text-center text-slate-500 border-r border-slate-200 font-mono text-[11px]">
                        {staff.fte}
                      </td>

                      {/* Day shift cells */}
                      {ROSTER_DAYS.map((day) => {
                        const shiftCode = staff.shifts[day.dateStr] || 'OFF';
                        const meta = SHIFT_DEFINITIONS[shiftCode] || SHIFT_DEFINITIONS.OFF;
                        const isBlank = shiftCode === 'OFF';

                        return (
                          <td
                            key={day.dateStr}
                            onClick={() => onInitiateSwap(day, shiftCode, staff)}
                            className={`p-1 text-center border-r border-slate-100 cursor-pointer transition hover:scale-105 hover:z-10 hover:shadow-sm ${
                              day.isWeekend && isBlank ? 'bg-slate-100/50' : ''
                            }`}
                            title={`${staff.name} on ${day.dayName} Oct ${day.dayNumber}: ${meta.label} (${meta.time}) - Click to swap`}
                          >
                            {!isBlank ? (
                              <span
                                className={`inline-flex items-center justify-center w-8 h-7 rounded text-[11px] font-bold border transition-transform ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
                              >
                                {shiftCode}
                              </span>
                            ) : (
                              <span className="inline-block w-8 h-7 rounded text-[10px] text-slate-300">
                                -
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>

              {/* Sticky Headcount Row at Bottom */}
              <tfoot className="bg-slate-100/90 font-bold text-slate-800 sticky bottom-0 z-20 border-t-2 border-slate-300 shadow-md">
                <tr className="border-b border-slate-200 bg-amber-50/70 text-amber-900">
                  <td className="p-2 sticky left-0 bg-amber-100/90 border-r border-slate-200 text-xs">
                    AM Team (Morning)
                  </td>
                  <td className="p-1 text-center border-r border-slate-200 text-[10px]">-</td>
                  {ROSTER_DAYS.map((day) => {
                    const count = getDayHeadcounts(day.dateStr).amCount;
                    return (
                      <td key={day.dateStr} className="p-1 text-center border-r border-slate-200 text-[11px] font-mono">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-amber-200/80 font-bold">
                          {count}
                        </span>
                      </td>
                    );
                  })}
                </tr>
                <tr className="border-b border-slate-200 bg-emerald-50/70 text-emerald-900">
                  <td className="p-2 sticky left-0 bg-emerald-100/90 border-r border-slate-200 text-xs">
                    PM Team (Evening)
                  </td>
                  <td className="p-1 text-center border-r border-slate-200 text-[10px]">-</td>
                  {ROSTER_DAYS.map((day) => {
                    const count = getDayHeadcounts(day.dateStr).pmCount;
                    return (
                      <td key={day.dateStr} className="p-1 text-center border-r border-slate-200 text-[11px] font-mono">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-200/80 font-bold">
                          {count}
                        </span>
                      </td>
                    );
                  })}
                </tr>
                <tr className="bg-purple-50/70 text-purple-900">
                  <td className="p-2 sticky left-0 bg-purple-100/90 border-r border-slate-200 text-xs">
                    ND Team (Night Duty)
                  </td>
                  <td className="p-1 text-center border-r border-slate-200 text-[10px]">-</td>
                  {ROSTER_DAYS.map((day) => {
                    const count = getDayHeadcounts(day.dateStr).ndCount;
                    return (
                      <td key={day.dateStr} className="p-1 text-center border-r border-slate-200 text-[11px] font-mono">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-purple-200/80 font-bold">
                          {count}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
