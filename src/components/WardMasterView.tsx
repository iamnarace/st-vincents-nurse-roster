import React, { useState } from 'react';
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
  Users
} from 'lucide-react';
import { StaffMember, DayInfo, ShiftCode, StaffSection } from '../types/roster';
import { SHIFT_DEFINITIONS, ROSTER_DAYS } from '../data/rosterData';

interface WardMasterViewProps {
  staffMembers: StaffMember[];
  onSelectStaff: (id: string) => void;
  onInitiateSwap: (dayInfo: DayInfo, currentShift: ShiftCode, staff: StaffMember) => void;
  wifeStaffId: string;
}

export const WardMasterView: React.FC<WardMasterViewProps> = ({
  staffMembers,
  onSelectStaff,
  onInitiateSwap,
  wifeStaffId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<StaffSection | 'All'>('All');
  const [filterDateStr, setFilterDateStr] = useState<string>('all');
  const [filterDutyType, setFilterDutyType] = useState<'all' | 'Morning' | 'Evening' | 'Night'>('all');

  // Filter staff list
  const filteredStaff = staffMembers.filter((staff) => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSection = selectedSection === 'All' || staff.section === selectedSection;

    // Filter by specific date & shift type if selected
    let matchesDateAndDuty = true;
    if (filterDateStr !== 'all') {
      const code = staff.shifts[filterDateStr] || 'OFF';
      const meta = SHIFT_DEFINITIONS[code] || SHIFT_DEFINITIONS.OFF;
      if (filterDutyType !== 'all') {
        matchesDateAndDuty = meta.category === filterDutyType;
      } else {
        matchesDateAndDuty = meta.category !== 'Off';
      }
    }

    return matchesSearch && matchesSection && matchesDateAndDuty;
  });

  const sections: (StaffSection | 'All')[] = [
    'All',
    'RN In charge',
    'RN',
    'Management',
    'Registered Nurse Transition Program (TSPRN)',
    'EEN'
  ];

  // Calculate live headcounts for each day across all staff
  const getDayHeadcounts = (dateStr: string) => {
    let amCount = 0;
    let pmCount = 0;
    let ndCount = 0;

    staffMembers.forEach((s) => {
      const code = s.shifts[dateStr];
      if (['M', 'M1', 'MI', 'M10'].includes(code)) amCount++;
      else if (['E', 'E1', 'EI', 'E6', 'E10'].includes(code)) pmCount++;
      else if (['N', 'N1', 'NI'].includes(code)) ndCount++;
    });

    return { amCount, pmCount, ndCount };
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden space-y-4">
      {/* Top Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/70 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>Ward 9 North / GSS • Master Roster Matrix</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                {filteredStaff.length} Nurses Shown
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Full ward roster view with authentic colors. Click nurse name for personal view or click any cell to swap.
            </p>
          </div>

          {/* Quick Date Inspector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <select
                value={filterDateStr}
                onChange={(e) => setFilterDateStr(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 focus:outline-none"
              >
                <option value="all">All Dates (Full View)</option>
                {ROSTER_DAYS.map((d) => (
                  <option key={d.dateStr} value={d.dateStr}>
                    {d.dayName} Oct {d.dayNumber}
                  </option>
                ))}
              </select>
            </div>

            {filterDateStr !== 'all' && (
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 text-xs">
                <button
                  onClick={() => setFilterDutyType('all')}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${
                    filterDutyType === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600'
                  }`}
                >
                  All Active
                </button>
                <button
                  onClick={() => setFilterDutyType('Morning')}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                    filterDutyType === 'Morning' ? 'bg-amber-500 text-white' : 'text-slate-600'
                  }`}
                >
                  <Sun className="w-3 h-3" /> AM
                </button>
                <button
                  onClick={() => setFilterDutyType('Evening')}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                    filterDutyType === 'Evening' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                  }`}
                >
                  <Sunset className="w-3 h-3" /> PM
                </button>
                <button
                  onClick={() => setFilterDutyType('Night')}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                    filterDutyType === 'Night' ? 'bg-purple-600 text-white' : 'text-slate-600'
                  }`}
                >
                  <Moon className="w-3 h-3" /> ND
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search & Section Filter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search nurse or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {sections.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedSection === sec
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sec === 'All' ? 'All Roles' : sec.replace('Registered Nurse Transition Program (TSPRN)', 'TSPRN')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spreadsheet Matrix Table */}
      <div className="overflow-x-auto max-h-[66vh] relative">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header */}
          <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 z-20 shadow-xs border-b border-slate-200">
            <tr>
              <th className="p-3 sticky left-0 bg-slate-100 z-30 min-w-[200px] border-r border-slate-200 font-bold">
                Staff Name & Role
              </th>
              <th className="p-2 text-center w-14 border-r border-slate-200">FTE</th>
              {ROSTER_DAYS.map((day) => (
                <th
                  key={day.dateStr}
                  className={`p-2 text-center min-w-[44px] border-r border-slate-200/80 ${
                    day.isWeekend ? 'bg-slate-200/60 font-bold text-slate-900' : ''
                  } ${filterDateStr === day.dateStr ? 'bg-blue-100 ring-2 ring-blue-500 ring-inset' : ''}`}
                >
                  <div className="text-[10px] text-slate-500 font-medium">{day.dayName}</div>
                  <div className="font-extrabold text-xs">{day.dayNumber}</div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {filteredStaff.map((staff) => {
              const isWife = staff.id === wifeStaffId;

              return (
                <tr
                  key={staff.id}
                  className={`hover:bg-blue-50/40 transition-colors ${
                    isWife ? 'bg-rose-50/30' : ''
                  }`}
                >
                  {/* Sticky Staff Name Column */}
                  <td className={`p-2.5 sticky left-0 z-10 border-r border-slate-200 backdrop-blur-xs ${
                    isWife ? 'bg-rose-50/95 font-bold' : 'bg-white/95'
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
                      {isWife && (
                        <span className="p-1 rounded-full bg-rose-100 text-rose-600 shrink-0" title="Barsha's Profile">
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
                        } ${filterDateStr === day.dateStr ? 'bg-blue-50/60' : ''}`}
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

          {/* Sticky Headcount Row at Bottom (matching hospital sheet) */}
          <tfoot className="bg-slate-100/90 font-bold text-slate-800 sticky bottom-0 z-20 border-t-2 border-slate-300 shadow-md">
            {/* AM Team */}
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
            {/* PM Team */}
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
            {/* ND Team */}
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
  );
};
