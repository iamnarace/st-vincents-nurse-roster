import React, { useEffect, useMemo, useState } from 'react';
import { Award, Pencil, Check, TrendingUp } from 'lucide-react';
import { StaffMember } from '../types/roster';
import { ROSTER_DAYS } from '../data/rosterData';
import { totalsFor } from '../utils/hours';
import { LEVELS, Progression, nextLevel, useProgression } from '../utils/progression';

interface Props {
  staff: StaffMember;
  now: Date;
}

const fmt = (n: number) => (Math.round(n * 10) / 10).toLocaleString('en-AU');

export const ProgressCard: React.FC<Props> = ({ staff, now }) => {
  const { value, configured, save } = useProgression(staff.id);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Progression>(value);

  useEffect(() => {
    setDraft(value);
    setEditing(false);
  }, [staff.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hours finished on the roster after the date the person last entered their total
  const added = useMemo(() => {
    const days = ROSTER_DAYS.filter((d) => d.dateStr > value.asOf);
    return totalsFor(staff, days, now, value.includeLeave).done;
  }, [staff, now, value.asOf, value.includeLeave]);

  const completed = value.baseHours + added;
  const target = Math.max(1, value.target);
  const pct = Math.min(100, (completed / target) * 100);
  const remaining = Math.max(0, target - completed);
  const nxt = nextLevel(value.level);
  const weeklyPace = staff.fte * 40;
  const weeksLeft = weeklyPace > 0 ? Math.ceil(remaining / weeklyPace) : 0;

  const commit = () => {
    save({
      ...draft,
      baseHours: Math.max(0, Number(draft.baseHours) || 0),
      target: Math.max(1, Number(draft.target) || 1),
    });
    setEditing(false);
  };

  const field = 'mt-1 w-full rounded-xl px-3 py-2.5 text-base font-semibold bg-white text-slate-900';

  return (
    <section
      aria-label="Level and hours progress"
      className="rounded-3xl p-5 text-white shadow-lg bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-white/25 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/80">Current level</p>
            <h3 className="text-xl font-black leading-tight truncate">
              {value.level || (configured ? staff.role : 'Set your level')}
            </h3>
          </div>
        </div>
        <button
          onClick={() => (editing ? commit() : setEditing(true))}
          className="shrink-0 flex items-center gap-1.5 rounded-xl bg-white text-orange-700 font-bold text-sm px-3.5 py-2 shadow hover:bg-orange-50 transition"
        >
          {editing ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          {editing ? 'Save' : 'Edit'}
        </button>
      </div>

      {editing ? (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-xs font-bold text-white/90">
            Level
            <select
              value={draft.level}
              onChange={(e) => setDraft({ ...draft, level: e.target.value })}
              className={field}
            >
              <option value="">Not set</option>
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-bold text-white/90">
            Hours needed for next level
            <input
              type="number"
              inputMode="decimal"
              min={1}
              value={draft.target}
              onChange={(e) => setDraft({ ...draft, target: Number(e.target.value) })}
              className={field}
            />
          </label>
          <label className="text-xs font-bold text-white/90">
            Hours I have completed so far
            <input
              type="number"
              inputMode="decimal"
              min={0}
              value={draft.baseHours}
              onChange={(e) => setDraft({ ...draft, baseHours: Number(e.target.value) })}
              className={field}
            />
          </label>
          <label className="text-xs font-bold text-white/90">
            …counted up to the end of
            <input
              type="date"
              value={draft.asOf}
              onChange={(e) => setDraft({ ...draft, asOf: e.target.value })}
              className={field}
            />
          </label>
          <label className="sm:col-span-2 flex items-center gap-2 text-sm font-semibold text-white">
            <input
              type="checkbox"
              checked={draft.includeLeave}
              onChange={(e) => setDraft({ ...draft, includeLeave: e.target.checked })}
              className="w-5 h-5 accent-white"
            />
            Count paid leave and ADO days as hours
          </label>
          <p className="sm:col-span-2 text-xs text-white/85">
            Enter your total once. After that the app adds each shift automatically as it finishes.
            Check the hours needed against your award or payslip.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <div className="text-4xl font-black tracking-tight leading-none">{fmt(completed)}</div>
              <div className="text-sm text-white/85 mt-1">of {fmt(target)} hours</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black leading-none">{Math.round(pct)}%</div>
              <div className="text-xs text-white/85 mt-1">{nxt ? `to ${nxt}` : 'to next level'}</div>
            </div>
          </div>
          <div
            className="mt-3 h-3.5 rounded-full bg-white/25 overflow-hidden"
            role="progressbar"
            aria-valuenow={Math.round(pct)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-white/20 py-2">
              <div className="text-lg font-black leading-none">{fmt(value.baseHours)}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/80 mt-1">Entered</div>
            </div>
            <div className="rounded-2xl bg-white/20 py-2">
              <div className="text-lg font-black leading-none">+{fmt(added)}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/80 mt-1">Added since</div>
            </div>
            <div className="rounded-2xl bg-white/20 py-2">
              <div className="text-lg font-black leading-none">{fmt(remaining)}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/80 mt-1">To go</div>
            </div>
          </div>
          {remaining > 0 && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-white/90">
              <TrendingUp className="w-4 h-4 shrink-0" />
              At {fmt(weeklyPace)} h a week that is about {weeksLeft} more week{weeksLeft === 1 ? '' : 's'}.
            </p>
          )}
          {!configured && (
            <p className="mt-3 text-sm font-semibold bg-white/20 rounded-xl px-3 py-2">
              Tap Edit to enter your level and the hours you have already done.
            </p>
          )}
        </>
      )}
    </section>
  );
};
