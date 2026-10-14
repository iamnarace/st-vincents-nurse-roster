import React, { useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { StaffMember } from '../types/roster';
import { ROSTER_DAYS } from '../data/rosterData';
import { buildPeriods, currentPeriodIndex, expectedHours, totalsFor } from '../utils/hours';

interface Props {
  staff: StaffMember;
  now: Date;
}

type Mode = 'week' | 'fortnight' | 'roster';
const SIZES: Record<Mode, 7 | 14 | 28> = { week: 7, fortnight: 14, roster: 28 };
const LABELS: Record<Mode, string> = { week: 'Week', fortnight: 'Fortnight', roster: '4-week roster' };
const fmt = (n: number) => (Math.round(n * 10) / 10).toLocaleString('en-AU');

const Bar: React.FC<{ done: number; scheduled: number; max: number }> = ({ done, scheduled, max }) => (
  <div className="relative h-3 rounded-full bg-slate-100 overflow-hidden">
    <div
      className="absolute inset-y-0 left-0 rounded-full bg-sky-300"
      style={{ width: `${Math.min(100, (scheduled / max) * 100)}%` }}
    />
    <div
      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
      style={{ width: `${Math.min(100, (done / max) * 100)}%` }}
    />
  </div>
);

export const HoursCard: React.FC<Props> = ({ staff, now }) => {
  const [mode, setMode] = useState<Mode>('fortnight');
  const [picked, setPicked] = useState<number | null>(null);
  const periods = useMemo(() => buildPeriods(ROSTER_DAYS, SIZES[mode]), [mode]);
  const currentIdx = currentPeriodIndex(periods, now);
  const activeIdx = picked !== null && picked < periods.length ? picked : currentIdx;
  const active = periods[activeIdx];

  const t = totalsFor(staff, active.days, now);
  const expected = expectedHours(staff, active.weeks);
  const max = Math.max(expected, t.scheduled, 1);
  const diff = t.scheduled - expected;

  const weeks = useMemo(() => buildPeriods(ROSTER_DAYS, 7), []);

  return (
    <section
      aria-label="Hours worked"
      className="rounded-3xl bg-white border border-emerald-100 shadow-sm overflow-hidden"
    >
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-5 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white/25 flex items-center justify-center">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-black leading-tight">My hours</h3>
          <p className="text-xs text-white/85">Finished vs rostered · FTE {staff.fte}</p>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 rounded-2xl p-1" role="tablist">
          {(Object.keys(SIZES) as Mode[]).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setPicked(null);
              }}
              className={`py-2 rounded-xl text-sm font-bold transition ${
                mode === m ? 'bg-white text-emerald-700 shadow' : 'text-slate-500'
              }`}
            >
              {LABELS[m]}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            disabled={activeIdx === 0}
            onClick={() => setPicked(activeIdx - 1)}
            className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 text-xl font-black disabled:opacity-30"
            aria-label="Previous period"
          >
            ‹
          </button>
          <div className="text-center">
            <div className="text-base font-black text-slate-900">{active.label}</div>
            {activeIdx === currentIdx && (
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                This {LABELS[mode].toLowerCase()}
              </div>
            )}
          </div>
          <button
            disabled={activeIdx === periods.length - 1}
            onClick={() => setPicked(activeIdx + 1)}
            className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 text-xl font-black disabled:opacity-30"
            aria-label="Next period"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-emerald-50 py-3">
            <div className="text-2xl font-black text-emerald-700 leading-none">{fmt(t.done)}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mt-1">Done</div>
          </div>
          <div className="rounded-2xl bg-sky-50 py-3">
            <div className="text-2xl font-black text-sky-700 leading-none">{fmt(t.scheduled)}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-600 mt-1">Rostered</div>
          </div>
          <div className="rounded-2xl bg-violet-50 py-3">
            <div className="text-2xl font-black text-violet-700 leading-none">{fmt(expected)}</div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-violet-600 mt-1">FTE target</div>
          </div>
        </div>

        <Bar done={t.done} scheduled={t.scheduled} max={max} />
        <p className="text-sm text-slate-600">
          {t.shifts} worked shift{t.shifts === 1 ? '' : 's'} · {fmt(t.worked)} h on the floor.{' '}
          {Math.abs(diff) < 0.05 ? (
            <b className="text-emerald-700">Exactly your FTE hours.</b>
          ) : diff > 0 ? (
            <b className="text-orange-600">{fmt(diff)} h over your FTE.</b>
          ) : (
            <b className="text-violet-700">{fmt(-diff)} h under your FTE.</b>
          )}
        </p>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Week by week</p>
          <ul className="space-y-2">
            {weeks.map((w) => {
              const wt = totalsFor(staff, w.days, now);
              return (
                <li key={w.id} className="flex items-center gap-3">
                  <span className="w-[96px] shrink-0 text-xs font-semibold text-slate-600">{w.label}</span>
                  <div className="flex-1">
                    <Bar
                      done={wt.done}
                      scheduled={wt.scheduled}
                      max={Math.max(expectedHours(staff, 1), wt.scheduled, 1)}
                    />
                  </div>
                  <span className="w-12 text-right text-xs font-black text-slate-700">{fmt(wt.scheduled)}h</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
