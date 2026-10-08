import React, { useState } from 'react';
import { 
  Clock, 
  ArrowLeftRight, 
  Sun, 
  Sunset, 
  Moon, 
  CalendarDays, 
  CheckCircle2, 
  Sparkles, 
  Timer, 
  AlertTriangle, 
  ShieldCheck, 
  Palmtree, 
  Download, 
  HeartHandshake,
  CalendarCheck
} from 'lucide-react';
import { StaffMember, DayInfo, ShiftCode } from '../types/roster';
import { SHIFT_DEFINITIONS, ROSTER_DAYS } from '../data/rosterData';
import { downloadIcsFile } from '../utils/calendarSync';

interface PersonalCalendarViewProps {
  staff: StaffMember;
  onInitiateSwap: (dayInfo: DayInfo, currentShift: ShiftCode) => void;
}

export const PersonalCalendarView: React.FC<PersonalCalendarViewProps> = ({
  staff,
  onInitiateSwap,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [copiedSync, setCopiedSync] = useState(false);

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

  // Detect fatigue alerts for each day
  const getFatigueBadge = (dayIndex: number) => {
    const currentDay = ROSTER_DAYS[dayIndex];
    const prevDay = dayIndex > 0 ? ROSTER_DAYS[dayIndex - 1] : null;
    const nextDay = dayIndex < ROSTER_DAYS.length - 1 ? ROSTER_DAYS[dayIndex + 1] : null;

    const currShift = staff.shifts[currentDay.dateStr] || 'OFF';
    const prevShift = prevDay ? staff.shifts[prevDay.dateStr] || 'OFF' : 'OFF';
    const nextShift = nextDay ? staff.shifts[nextDay.dateStr] || 'OFF' : 'OFF';

    // 1. "Rest Protected": Day immediately following a Night Duty shift
    if (['N', 'N1', 'NI'].includes(prevShift)) {
      return {
        type: 'rest',
        label: 'Rest Protected',
        desc: 'Post-Night Duty mandatory recovery day',
        className: 'bg-purple-100 text-purple-900 border-purple-300'
      };
    }

    // 2. "Short Turnaround": Evening shift today followed by Morning shift tomorrow (only ~9.5 hrs rest)
    if (['E', 'E1', 'EI', 'E10'].includes(currShift) && ['M', 'M1', 'MI', 'M10'].includes(nextShift)) {
      return {
        type: 'warning',
        label: 'Short Turnaround',
        desc: 'Quick 9.5h turnaround (Finish 21:30 → Start 07:00)',
        className: 'bg-amber-100 text-amber-900 border-amber-300'
      };
    }

    return null;
  };

  const handleDownloadCalendar = () => {
    downloadIcsFile(staff);
    setCopiedSync(true);
    setTimeout(() => setCopiedSync(false), 3000);
  };

  // Filter days based on week selection
  const displayedDays = selectedWeek === 'all' 
    ? ROSTER_DAYS 
    : ROSTER_DAYS.filter((d) => d.weekIndex === selectedWeek);

  // Find next shift
  const firstActiveShiftDay = ROSTER_DAYS.find((d) => {
    const c = staff.shifts[d.dateStr];
    return c && !['OFF', 'ADO', 'ADO4', 'ADO6', 'ADO10', 'AL', 'AL6'].includes(c);
  });

  const nextShiftCode = firstActiveShiftDay ? staff.shifts[firstActiveShiftDay.dateStr] : 'M';
  const nextShiftDef = SHIFT_DEFINITIONS[nextShiftCode || 'M'];

  return (
    <div className="space-y-6">
      {/* Top Banner: Upcoming Shift Countdown & Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Next Shift Countdown Hero Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl shadow-blue-900/15 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-60 h-60 bg-white/10 rounded-full pointer-events-none blur-2xl" />
          
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-100 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md">
                <Timer className="w-3.5 h-3.5 text-blue-200" />
                Next Upcoming Shift
              </span>
              <span className="text-blue-200 text-xs font-medium">
                {firstActiveShiftDay ? `${firstActiveShiftDay.fullDayName}, Oct ${firstActiveShiftDay.dayNumber} 2026` : 'No upcoming shifts'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
                {nextShiftDef.label}
              </h3>
              <span className="text-xl sm:text-2xl font-black bg-white/20 text-white px-3 py-0.5 rounded-xl border border-white/30">
                {nextShiftCode}
              </span>
            </div>

            <p className="text-blue-100 text-xs sm:text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-300" />
              <span>Shift Timing: <b>{nextShiftDef.time}</b> • Duration: <b>{nextShiftDef.durationHours} Hours</b></span>
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-200">Ward:</span>
              <span className="text-xs font-bold text-white">9 North / GSS</span>
              <span className="text-blue-300">•</span>
              <span className="text-xs text-blue-200">Handover: 15 mins prior</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadCalendar}
                className="bg-white/15 hover:bg-white/25 text-white font-semibold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition border border-white/20"
                title="Download .ics file to import into Google or Apple Calendar"
              >
                <CalendarCheck className="w-3.5 h-3.5 text-blue-200" />
                <span>{copiedSync ? 'Exported!' : 'Sync to Calendar (.ics)'}</span>
              </button>

              {firstActiveShiftDay && (
                <button
                  onClick={() => onInitiateSwap(firstActiveShiftDay, nextShiftCode)}
                  className="bg-white hover:bg-blue-50 text-blue-900 font-bold px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5 text-xs"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-blue-700" />
                  <span>Swap Shift</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Milestone / Countdown & Shift Distribution Widget */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          {/* Milestone Widget */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/80">
            <div className="flex items-center justify-between text-xs text-sky-800 font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <Palmtree className="w-4 h-4 text-sky-600" />
                <span>Next Rest Milestone</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-sky-200 text-sky-900 text-[10px]">
                {nextOffOrLeaveDate}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              Only <b className="text-sky-900 font-extrabold text-sm">{shiftsUntilNextOffOrLeave} shifts</b> until next {nextOffOrLeaveType}!
            </p>
          </div>

          {/* Shift Counts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Roster Summary
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-sm">{morningCount}</span> Morning
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2">
                <Sunset className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-sm">{eveningCount}</span> Evening
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 flex items-center gap-2">
                <Moon className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-sm">{nightCount}</span> Night
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-sm">{offCount}</span> Days Off
                </div>
              </div>
            </div>
          </div>

          {/* Footer Total */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Rostered Hours:</span>
            <span className="font-black text-slate-900 text-sm">{totalHours} Hours</span>
          </div>
        </div>
      </div>

      {/* Week Selector Filters & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedWeek('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedWeek === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
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
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Week {wk}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCalendar}
            className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 transition border border-slate-200"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download Calendar (.ics)</span>
          </button>
        </div>
      </div>

      {/* Mobile-Friendly Cards Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {displayedDays.map((day, idx) => {
          const shiftCode = staff.shifts[day.dateStr] || 'OFF';
          const meta = SHIFT_DEFINITIONS[shiftCode] || SHIFT_DEFINITIONS.OFF;
          const fatigue = getFatigueBadge(idx);

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
                {/* Date Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {day.dayName}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Oct {day.dayNumber}
                    </span>
                  </div>
                  {day.isWeekend && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      Wknd
                    </span>
                  )}
                </div>

                {/* Shift Badge & Code */}
                <div className="my-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`px-2.5 py-1 rounded-xl text-sm font-black border tracking-wide shadow-2xs ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
                    >
                      {shiftCode}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs leading-tight">
                    {meta.label}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{meta.time}</span>
                  </p>
                </div>

                {/* Fatigue / Safe Work Alert Badges */}
                {fatigue && (
                  <div
                    className={`mt-2 p-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 ${fatigue.className}`}
                    title={fatigue.desc}
                  >
                    {fatigue.type === 'warning' ? (
                      <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                    ) : (
                      <ShieldCheck className="w-3 h-3 text-purple-600 shrink-0" />
                    )}
                    <span className="truncate">{fatigue.label}</span>
                  </div>
                )}
              </div>

              {/* Bottom Card Action / Swap Trigger */}
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">
                  {meta.durationHours > 0 ? `${meta.durationHours}h Shift` : meta.category}
                </span>
                <span className="inline-flex items-center gap-1 text-blue-600 group-hover:text-blue-700 font-bold group-hover:translate-x-0.5 transition-transform">
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>Swap</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
