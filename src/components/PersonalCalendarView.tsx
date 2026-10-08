import React, { useState } from 'react';
import { 
  Clock, 
  ArrowLeftRight, 
  Sun, 
  Sunset, 
  Moon, 
  CheckCircle2, 
  Timer, 
  AlertTriangle, 
  ShieldCheck, 
  Palmtree, 
  Download, 
  CalendarCheck,
  CalendarDays,
  ListFilter,
  Sparkles
} from 'lucide-react';
import { StaffMember, DayInfo, ShiftCode } from '../types/roster';
import { SHIFT_DEFINITIONS, ROSTER_DAYS } from '../data/rosterData';
import { downloadIcsFile } from '../utils/calendarSync';

interface PersonalCalendarViewProps {
  staff: StaffMember;
  onInitiateSwap: (dayInfo: DayInfo, currentShift: ShiftCode) => void;
  onSyncCalendar?: () => void;
}

export const PersonalCalendarView: React.FC<PersonalCalendarViewProps> = ({
  staff,
  onInitiateSwap,
  onSyncCalendar,
}) => {
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed');
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [copiedSync, setCopiedSync] = useState(false);

  // Dynamic Greeting based on current hour
  const currentHour = new Date().getHours();
  let greeting = 'Good morning!';
  if (currentHour >= 12 && currentHour < 17) greeting = 'Good afternoon!';
  else if (currentHour >= 17) greeting = 'Good evening!';

  // Statistics calculation
  let morningCount = 0;
  let eveningCount = 0;
  let nightCount = 0;
  let offCount = 0;
  let leaveCount = 0;
  let totalHours = 0;

  ROSTER_DAYS.forEach((day) => {
    const code = staff.shifts[day.dateStr] || 'OFF';
    const def = SHIFT_DEFINITIONS[code] || SHIFT_DEFINITIONS.OFF;
    if (def.category === 'Morning') morningCount++;
    else if (def.category === 'Evening') eveningCount++;
    else if (def.category === 'Night') nightCount++;
    else if (def.category === 'Leave') leaveCount++;
    else if (def.category === 'Off') offCount++;

    totalHours += def.durationHours;
  });

  // Calculate shifts remaining until next ADO or Annual Leave
  let shiftsUntilNextOffOrLeave = 0;
  let nextOffOrLeaveDate = '';
  let nextOffOrLeaveType = '';

  for (let i = 0; i < ROSTER_DAYS.length; i++) {
    const day = ROSTER_DAYS[i];
    const code = staff.shifts[day.dateStr] || 'OFF';
    if (['ADO', 'ADO4', 'ADO6', 'ADO10', 'AL', 'AL6'].includes(code)) {
      nextOffOrLeaveDate = `Oct ${day.dayNumber}`;
      nextOffOrLeaveType = code.startsWith('AL') ? 'Annual Leave' : 'ADO Day';
      break;
    }
    if (!['OFF'].includes(code)) {
      shiftsUntilNextOffOrLeave++;
    }
  }

  // Find next upcoming active shift
  const firstActiveShiftDay = ROSTER_DAYS.find((d) => {
    const c = staff.shifts[d.dateStr];
    return c && !['OFF', 'ADO', 'ADO4', 'ADO6', 'ADO10', 'AL', 'AL6'].includes(c);
  });

  const nextShiftCode = firstActiveShiftDay ? staff.shifts[firstActiveShiftDay.dateStr] : 'M';
  const nextShiftDef = SHIFT_DEFINITIONS[nextShiftCode || 'M'];

  // Get contextual note for a shift
  const getShiftNote = (shiftCode: ShiftCode, dayIndex: number) => {
    const currentDay = ROSTER_DAYS[dayIndex];
    const prevDay = dayIndex > 0 ? ROSTER_DAYS[dayIndex - 1] : null;
    const nextDay = dayIndex < ROSTER_DAYS.length - 1 ? ROSTER_DAYS[dayIndex + 1] : null;

    const prevShift = prevDay ? staff.shifts[prevDay.dateStr] || 'OFF' : 'OFF';
    const nextShift = nextDay ? staff.shifts[nextDay.dateStr] || 'OFF' : 'OFF';

    if (['N', 'N1', 'NI'].includes(shiftCode)) {
      return {
        text: '⚠️ Night shift ahead. Protect your sleep schedule today.',
        className: 'text-purple-700 bg-purple-50/80 border-purple-200'
      };
    }
    if (['N', 'N1', 'NI'].includes(prevShift)) {
      return {
        text: '🛡️ Post-Night Duty rest protected day.',
        className: 'text-indigo-700 bg-indigo-50/80 border-indigo-200'
      };
    }
    if (['E', 'E1', 'EI', 'E10'].includes(shiftCode) && ['M', 'M1', 'MI', 'M10'].includes(nextShift)) {
      return {
        text: '⚠️ Short turnaround: Evening shift followed by early Morning tomorrow.',
        className: 'text-amber-700 bg-amber-50/80 border-amber-200'
      };
    }
    if (['ADO', 'ADO4', 'ADO6', 'ADO10'].includes(shiftCode)) {
      return {
        text: '🎉 Enjoy your allocated rest day off!',
        className: 'text-sky-700 bg-sky-50/80 border-sky-200'
      };
    }
    if (shiftCode === 'OFF') {
      return {
        text: '🛋️ Scheduled Rest Day',
        className: 'text-slate-600 bg-slate-100/70 border-slate-200'
      };
    }
    if (['AL', 'AL6'].includes(shiftCode)) {
      return {
        text: '🌴 Annual Recreation Leave',
        className: 'text-amber-800 bg-amber-50 border-amber-200'
      };
    }
    return null;
  };

  // Shift bullet emoji
  const getShiftDot = (category: string) => {
    switch (category) {
      case 'Morning': return '🟡';
      case 'Evening': return '🟢';
      case 'Night': return '🟣';
      case 'Off': return '🔵';
      case 'Leave': return '🟠';
      default: return '⚪';
    }
  };

  const handleDownloadCalendar = () => {
    if (onSyncCalendar) {
      onSyncCalendar();
    } else {
      downloadIcsFile(staff);
    }
    setCopiedSync(true);
    setTimeout(() => setCopiedSync(false), 3000);
  };

  // Filter days based on week selection
  const displayedDays = selectedWeek === 'all' 
    ? ROSTER_DAYS 
    : ROSTER_DAYS.filter((d) => d.weekIndex === selectedWeek);

  return (
    <div className="space-y-5">
      {/* 1. Welcome & Status Banner (Matching Mobile Screen Wireframe) */}
      <div className="bg-gradient-to-br from-blue-700 via-sky-800 to-indigo-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-blue-900/15 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-60 h-60 bg-white/10 rounded-full pointer-events-none blur-2xl" />
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <span>{greeting}</span>
            </h3>
            <span className="px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-md border border-white/20">
              Ward 9 North
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 space-y-2">
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold">
              <span>{getShiftDot(nextShiftDef.category)}</span>
              <span>Upcoming Shift:</span>
              <span className="underline decoration-sky-300 underline-offset-2">
                {nextShiftDef.label} ({nextShiftCode})
              </span>
              <span className="text-xs font-normal text-blue-200">
                ({nextShiftDef.time})
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-sky-200 font-medium pt-1 border-t border-white/10">
              <Timer className="w-4 h-4 text-sky-300 shrink-0" />
              <span>Shift starts in: <b className="text-white font-bold">1 hr 10 mins</b></span>
              <span className="text-white/40">•</span>
              <span className="text-blue-100 text-xs">
                {firstActiveShiftDay ? `${firstActiveShiftDay.fullDayName}, Oct ${firstActiveShiftDay.dayNumber}` : 'Scheduled'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs relative z-10">
          <span className="text-blue-200">
            Rostered to: <b className="text-white">{staff.name}</b>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCalendar}
              className="bg-white/15 hover:bg-white/25 text-white font-semibold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-blue-200" />
              <span>{copiedSync ? 'Synced!' : 'Sync Calendar'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Controls & View Toggle (Mobile Feed vs Grid) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            onClick={() => setSelectedWeek('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedWeek === 'all'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All 4 Weeks
          </button>
          {[1, 2, 3, 4].map((wk) => (
            <button
              key={wk}
              onClick={() => setSelectedWeek(wk)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedWeek === wk
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Week {wk}
            </button>
          ))}
        </div>

        {/* View Switcher: Mobile Feed vs Grid */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-semibold self-end sm:self-center">
          <button
            onClick={() => setViewMode('feed')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
              viewMode === 'feed'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Mobile Feed</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
              viewMode === 'grid'
                ? 'bg-white text-blue-700 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
        </div>
      </div>

      {/* 3. Upcoming Shifts (Matching Mobile Screen Wireframe) */}
      {viewMode === 'feed' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Upcoming Shifts: Oct 12 – Nov 08 2026
            </h4>
            <span className="text-xs text-slate-400 font-medium">
              Tap Find Swap to find colleagues
            </span>
          </div>

          <div className="space-y-3">
            {displayedDays.map((day, idx) => {
              const shiftCode = staff.shifts[day.dateStr] || 'OFF';
              const meta = SHIFT_DEFINITIONS[shiftCode] || SHIFT_DEFINITIONS.OFF;
              const note = getShiftNote(shiftCode, idx);
              const isWorkDuty = !['OFF', 'ADO', 'ADO4', 'ADO6', 'ADO10', 'AL', 'AL6'].includes(shiftCode);
              const dot = getShiftDot(meta.category);

              return (
                <div
                  key={day.dateStr}
                  className={`p-4 rounded-3xl border transition-all duration-200 bg-white ${
                    day.isWeekend ? 'ring-1 ring-slate-200/90' : ''
                  } border-slate-200/90 shadow-2xs hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
                >
                  <div className="space-y-1.5">
                    {/* Date Header */}
                    <div className="flex items-center gap-2">
                      <span className="text-base leading-none">📅</span>
                      <span className="font-extrabold text-sm sm:text-base text-slate-900">
                        {day.fullDayName}, Oct {day.dayNumber}
                      </span>
                      {day.isWeekend && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          Weekend
                        </span>
                      )}
                    </div>

                    {/* Shift Line */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700 font-medium pl-6">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{dot}</span>
                        <span>{meta.label} ({shiftCode})</span>
                      </span>
                      {meta.time !== 'Off Duty' && meta.time !== 'All Day' && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600 font-mono text-xs">{meta.time}</span>
                        </>
                      )}
                    </div>

                    {/* Note if available */}
                    {note && (
                      <div className="pl-6 pt-0.5">
                        <p className={`text-xs px-2.5 py-1 rounded-xl border font-semibold inline-block ${note.className}`}>
                          {note.text}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Button: [ 🔄 Find Swap ] (for active shifts) */}
                  {isWorkDuty ? (
                    <button
                      onClick={() => onInitiateSwap(day, shiftCode)}
                      className="self-start sm:self-center px-4 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs group"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5 text-sky-600 group-hover:rotate-180 transition-transform duration-300" />
                      <span>🔄 Find Swap</span>
                    </button>
                  ) : (
                    <div className="hidden sm:block text-right pr-2">
                      <span className="text-xs text-slate-400 font-medium">Off Duty</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Grid Calendar View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {displayedDays.map((day, idx) => {
            const shiftCode = staff.shifts[day.dateStr] || 'OFF';
            const meta = SHIFT_DEFINITIONS[shiftCode] || SHIFT_DEFINITIONS.OFF;
            const note = getShiftNote(shiftCode, idx);
            const isWorkDuty = !['OFF', 'ADO', 'ADO4', 'ADO6', 'ADO10', 'AL', 'AL6'].includes(shiftCode);

            return (
              <div
                key={day.dateStr}
                onClick={() => onInitiateSwap(day, shiftCode)}
                className={`rounded-2xl border p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:shadow-lg hover:-translate-y-0.5 ${
                  meta.cardBg
                } ${
                  day.isWeekend ? 'ring-1 ring-slate-300/80 shadow-2xs' : ''
                } border-slate-200/90 relative`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {day.dayName}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Oct {day.dayNumber}
                      </span>
                    </div>
                  </div>

                  <div className="my-2">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-sm font-black border tracking-wide shadow-2xs ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
                    >
                      {shiftCode}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs leading-tight mt-1.5">
                      {meta.label}
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{meta.time}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">
                    {meta.durationHours > 0 ? `${meta.durationHours}h` : meta.category}
                  </span>
                  {isWorkDuty && (
                    <span className="inline-flex items-center gap-1 text-blue-600 font-bold">
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Swap</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
