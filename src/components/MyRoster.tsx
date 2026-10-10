import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, CalendarPlus, Moon, Sun, Sunset, Coffee, Palmtree } from 'lucide-react';
import { StaffMember, DayInfo, ShiftCode } from '../types/roster';
import { SHIFT_DEFINITIONS, ROSTER_DAYS } from '../data/rosterData';

interface MyRosterProps {
  staff: StaffMember;
  onInitiateSwap: (dayInfo: DayInfo, currentShift: ShiftCode) => void;
  onSyncCalendar: () => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const keyOf = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const parseTimes = (dateStr: string, code: ShiftCode) => {
  const m = SHIFT_DEFINITIONS[code]?.time.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const [y, mo, d] = dateStr.split('-').map(Number);
  const start = new Date(y, mo - 1, d, +m[1], +m[2]);
  const end = new Date(y, mo - 1, d, +m[3], +m[4]);
  if (end <= start) end.setDate(end.getDate() + 1);
  return { start, end };
};

const fmtDur = (ms: number) => {
  const mins = Math.max(0, Math.round(ms / 60000));
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const mm = mins % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${mm}m`;
  return `${mm}m`;
};

const tone = (cat: string) => {
  switch (cat) {
    case 'Morning':
      return { bar: 'bg-amber-400', chip: 'bg-amber-100 text-amber-900', icon: Sun };
    case 'Evening':
      return { bar: 'bg-emerald-500', chip: 'bg-emerald-100 text-emerald-900', icon: Sunset };
    case 'Night':
      return { bar: 'bg-indigo-500', chip: 'bg-indigo-100 text-indigo-900', icon: Moon };
    case 'Leave':
      return { bar: 'bg-sky-400', chip: 'bg-sky-100 text-sky-900', icon: Palmtree };
    default:
      return { bar: 'bg-slate-300', chip: 'bg-slate-100 text-slate-600', icon: Coffee };
  }
};

export const MyRoster: React.FC<MyRosterProps> = ({ staff, onInitiateSwap, onSyncCalendar }) => {
  const [now, setNow] = useState(new Date());
  const [week, setWeek] = useState<number | 'all'>('all');

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const todayKey = keyOf(now);
  const codeOn = (dateStr: string) => (staff.shifts[dateStr] || 'OFF') as ShiftCode;

  // What is happening right now / next
  const status = useMemo(() => {
    const spans = ROSTER_DAYS.map((d) => {
      const code = codeOn(d.dateStr);
      const t = parseTimes(d.dateStr, code);
      return t ? { day: d, code, ...t } : null;
    }).filter(Boolean) as { day: DayInfo; code: ShiftCode; start: Date; end: Date }[];

    const current = spans.find((s) => s.start <= now && now < s.end) || null;
    const next = spans.find((s) => s.start > now) || null;
    const finishedToday =
      !current && spans.find((s) => s.day.dateStr === todayKey && s.end <= now) ? true : false;
    return { current, next, finishedToday };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staff, now]);

  const totals = useMemo(() => {
    let work = 0,
      hours = 0,
      nights = 0;
    ROSTER_DAYS.filter((d) => d.weekIndex > 0).forEach((d) => {
      const def = SHIFT_DEFINITIONS[codeOn(d.dateStr)];
      if (!def) return;
      if (def.durationHours > 0 && ['Morning', 'Evening', 'Night', 'Day'].includes(def.category)) {
        work++;
        hours += def.durationHours;
        if (def.category === 'Night') nights++;
      }
    });
    return { work, hours, nights };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staff]);

  const days = ROSTER_DAYS.filter((d) => (week === 'all' ? d.weekIndex > 0 || d.dateStr >= todayKey : d.weekIndex === week));
  const dateLabel = (dateStr: string) => {
    const [, m, d] = dateStr.split('-').map(Number);
    return `${d} ${MONTHS[m - 1]}`;
  };

  const hero = (() => {
    if (status.current) {
      const def = SHIFT_DEFINITIONS[status.current.code];
      return {
        eyebrow: 'On duty now',
        title: def.label,
        sub: `${def.time} · finishes in ${fmtDur(status.current.end.getTime() - now.getTime())}`,
        cat: def.category,
      };
    }
    if (status.next) {
      const def = SHIFT_DEFINITIONS[status.next.code];
      const when =
        status.next.day.dateStr === todayKey
          ? 'Today'
          : `${status.next.day.fullDayName} ${dateLabel(status.next.day.dateStr)}`;
      return {
        eyebrow: status.finishedToday ? 'Done for today · next up' : 'Next shift',
        title: `${def.label}`,
        sub: `${when} · ${def.time} · in ${fmtDur(status.next.start.getTime() - now.getTime())}`,
        cat: def.category,
      };
    }
    return { eyebrow: 'Roster', title: 'No upcoming shifts', sub: 'Check back when the next roster is published.', cat: 'Off' };
  })();
  const heroTone = tone(hero.cat);
  const HeroIcon = heroTone.icon;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-5 sm:p-6">
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${heroTone.bar}`} />
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <HeroIcon className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-white/60">{hero.eyebrow}</p>
            <h3 className="text-2xl font-black tracking-tight mt-0.5">{hero.title}</h3>
            <p className="text-sm text-white/75 mt-1">{hero.sub}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          {[
            ['Shifts', totals.work],
            ['Hours', totals.hours],
            ['Nights', totals.nights],
          ].map(([k, v]) => (
            <div key={k as string} className="rounded-2xl bg-white/10 py-2.5">
              <div className="text-xl font-black leading-none">{v}</div>
              <div className="text-[11px] uppercase tracking-wider text-white/60 mt-1">{k}</div>
            </div>
          ))}
        </div>
        <button
          onClick={onSyncCalendar}
          className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-white text-slate-900 font-bold text-sm py-3 hover:bg-slate-100 transition"
        >
          <CalendarPlus className="w-4 h-4" /> Add to my phone calendar
        </button>
      </section>

      {/* Week filter */}
      <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1" role="tablist" aria-label="Filter by week">
        {(['all', 1, 2, 3, 4] as const).map((w) => (
          <button
            key={w}
            role="tab"
            aria-selected={week === w}
            onClick={() => setWeek(w)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition ${
              week === w
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {w === 'all' ? 'All' : `Week ${w}`}
          </button>
        ))}
      </div>

      {/* Day list */}
      <ul className="bg-white rounded-3xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
        {days.map((d) => {
          const code = codeOn(d.dateStr);
          const def = SHIFT_DEFINITIONS[code] || SHIFT_DEFINITIONS.OFF;
          const t = tone(def.category);
          const isToday = d.dateStr === todayKey;
          const working = !!parseTimes(d.dateStr, code);
          return (
            <li
              key={d.dateStr}
              className={`flex items-center gap-3 px-4 py-3 ${isToday ? 'bg-blue-50/70' : ''}`}
            >
              <div className={`w-1.5 self-stretch rounded-full ${t.bar}`} />
              <div className="w-14 shrink-0">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {d.fullDayName.slice(0, 3)}
                </div>
                <div className="text-base font-black text-slate-900 leading-tight">{dateLabel(d.dateStr)}</div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-extrabold ${t.chip}`}>{code}</span>
                  <span className="text-sm font-semibold text-slate-800 truncate">{def.label}</span>
                  {isToday && (
                    <span className="text-[10px] font-extrabold uppercase bg-blue-600 text-white px-1.5 py-0.5 rounded">
                      Today
                    </span>
                  )}
                </div>
                {working && <div className="text-xs text-slate-500 mt-0.5">{def.time}</div>}
              </div>
              {working && (
                <button
                  onClick={() => onInitiateSwap(d, code)}
                  className="shrink-0 p-2.5 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition"
                  aria-label={`Find a swap for ${dateLabel(d.dateStr)}`}
                  title="Find a swap"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
