import { DayInfo, ShiftCode, StaffMember } from '../types/roster';
import { SHIFT_DEFINITIONS } from '../data/rosterData';

/** Paid hours per code. Verified against the fortnight totals printed on the ward roster. */
const PAID: Partial<Record<ShiftCode, number>> = {
  ADO: 8,
  ADO4: 4,
  ADO6: 6,
  ADO10: 10,
  AL: 8,
  AL4: 4,
  AL6: 6,
  AL10: 10,
  SICK: 8,
};

const WORK_CATEGORIES = ['Morning', 'Evening', 'Night', 'Day', 'Study'];

/** Hours physically worked on a shift (0 for leave / days off). */
export const workedHours = (code: ShiftCode): number => {
  const def = SHIFT_DEFINITIONS[code];
  return def && WORK_CATEGORIES.includes(def.category) ? def.durationHours : 0;
};

/** Hours the roster pays for (worked + leave + ADO). */
export const paidHours = (code: ShiftCode): number => workedHours(code) || PAID[code] || 0;

const parts = (dateStr: string) => dateStr.split('-').map(Number) as [number, number, number];

/** When a day's hours count as done: shift end time, or end of day for leave/ADO. */
export const dayEndsAt = (dateStr: string, code: ShiftCode): Date => {
  const [y, m, d] = parts(dateStr);
  const match = SHIFT_DEFINITIONS[code]?.time.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (match && workedHours(code) > 0) {
    const start = new Date(y, m - 1, d, +match[1], +match[2]);
    const end = new Date(y, m - 1, d, +match[3], +match[4]);
    if (end <= start) end.setDate(end.getDate() + 1);
    return end;
  }
  return new Date(y, m - 1, d + 1, 0, 0, 0);
};

export interface HourTotals {
  scheduled: number; // everything rostered in the period
  done: number; // already finished
  worked: number; // scheduled, worked shifts only
  shifts: number;
}

export const totalsFor = (
  staff: StaffMember,
  days: DayInfo[],
  now: Date,
  includeLeave = true
): HourTotals => {
  const t: HourTotals = { scheduled: 0, done: 0, worked: 0, shifts: 0 };
  days.forEach((d) => {
    const code = (staff.shifts[d.dateStr] || 'OFF') as ShiftCode;
    const w = workedHours(code);
    const h = includeLeave ? paidHours(code) : w;
    if (w > 0) {
      t.worked += w;
      t.shifts += 1;
    }
    t.scheduled += h;
    if (h > 0 && dayEndsAt(d.dateStr, code) <= now) t.done += h;
  });
  return t;
};

/** Expected hours for a period: FTE x 40h per week (matches the ward roster: FTE 1 = 80h per fortnight). */
export const expectedHours = (staff: StaffMember, weeks: number) => Math.round(staff.fte * 40 * weeks * 10) / 10;

export interface Period {
  id: string;
  label: string;
  days: DayInfo[];
  weeks: number;
}

export const buildPeriods = (all: DayInfo[], size: 7 | 14 | 28): Period[] => {
  const out: Period[] = [];
  for (let i = 0; i < all.length; i += size) {
    const days = all.slice(i, i + size);
    const first = days[0].dateStr.slice(5).split('-');
    const last = days[days.length - 1].dateStr.slice(5).split('-');
    const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fmt = (a: string[]) => `${+a[1]} ${M[+a[0] - 1]}`;
    out.push({
      id: `${size}-${i}`,
      label: `${fmt(first)} – ${fmt(last)}`,
      days,
      weeks: size / 7,
    });
  }
  return out;
};

export const currentPeriodIndex = (periods: Period[], now: Date): number => {
  const k = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const idx = periods.findIndex((p) => k >= p.days[0].dateStr && k <= p.days[p.days.length - 1].dateStr);
  if (idx >= 0) return idx;
  return k < periods[0].days[0].dateStr ? 0 : periods.length - 1;
};
