import { StaffMember, ShiftCode, SwapCandidate, SwapAnalysisSummary } from '../types/roster';
import { SHIFT_DEFINITIONS } from '../data/rosterData';

/** Minimum break between the end of one shift and the start of the next. */
export const MIN_REST_HOURS = 9;

const WORK_CATEGORIES = ['Morning', 'Evening', 'Night', 'Day', 'Study'];
const IN_CHARGE = ['MI', 'EI', 'NI'];

/** Checks whether a staff member is working an active duty shift. */
export function isDutyShift(shift: ShiftCode | undefined): boolean {
  if (!shift) return false;
  const def = SHIFT_DEFINITIONS[shift];
  return !!def && WORK_CATEGORIES.includes(def.category) && def.durationHours > 0;
}

export function isNightShift(shift: ShiftCode | undefined): boolean {
  return !!shift && SHIFT_DEFINITIONS[shift]?.category === 'Night';
}

export function isMorningShift(shift: ShiftCode | undefined): boolean {
  return !!shift && SHIFT_DEFINITIONS[shift]?.category === 'Morning';
}

export function isEveningShift(shift: ShiftCode | undefined): boolean {
  return !!shift && SHIFT_DEFINITIONS[shift]?.category === 'Evening';
}

export function isLeave(shift: ShiftCode | undefined): boolean {
  if (!shift) return false;
  return ['AL', 'AL4', 'AL6', 'AL10', 'SICK'].includes(shift);
}

export function isOffOrAdo(shift: ShiftCode | undefined): boolean {
  if (!shift || shift === 'OFF') return true;
  return ['ADO', 'ADO4', 'ADO6', 'ADO10'].includes(shift);
}

function getOffsetDateStr(dateStr: string, offsetDays: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const t = new Date(y, m - 1, d + offsetDays);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}

/** Real start / end timestamps of a shift on a date (null for leave / days off). */
function windowOf(dateStr: string, code: ShiftCode | undefined) {
  if (!code || !isDutyShift(code)) return null;
  const m = SHIFT_DEFINITIONS[code].time.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const [y, mo, d] = dateStr.split('-').map(Number);
  const start = new Date(y, mo - 1, d, +m[1], +m[2]);
  const end = new Date(y, mo - 1, d, +m[3], +m[4]);
  if (end <= start) end.setDate(end.getDate() + 1);
  return { start, end };
}

const hoursBetween = (a: Date, b: Date) => (b.getTime() - a.getTime()) / 3.6e6;

/**
 * Could this person safely work `code` on `dateStr`, given their own shifts the day
 * before and the day after? Checks the real gap in hours.
 */
function restCheck(staff: StaffMember, dateStr: string, code: ShiftCode) {
  const prevDate = getOffsetDateStr(dateStr, -1);
  const nextDate = getOffsetDateStr(dateStr, 1);
  const prevShift = (staff.shifts[prevDate] || 'OFF') as ShiftCode;
  const nextShift = (staff.shifts[nextDate] || 'OFF') as ShiftCode;
  const win = windowOf(dateStr, code);
  if (!win) return { ok: true, reason: '', prevShift, nextShift };

  const prevWin = windowOf(prevDate, prevShift);
  if (prevWin) {
    const gap = hoursBetween(prevWin.end, win.start);
    if (gap < MIN_REST_HOURS) {
      return {
        ok: false,
        reason: `only ${gap.toFixed(1)}h rest after ${prevShift} the day before`,
        prevShift,
        nextShift,
      };
    }
  }
  const nextWin = windowOf(nextDate, nextShift);
  if (nextWin) {
    const gap = hoursBetween(win.end, nextWin.start);
    if (gap < MIN_REST_HOURS) {
      return {
        ok: false,
        reason: `only ${gap.toFixed(1)}h rest before ${nextShift} the day after`,
        prevShift,
        nextShift,
      };
    }
  }
  return { ok: true, reason: '', prevShift, nextShift };
}

/**
 * Every colleague, classed for one shift:
 * - available_off: off / ADO that day and rested enough to take it
 * - mutual_duty:   working a different shift; a two-way trade is safe for BOTH people
 * - fatigue_conflict: would break the minimum rest break
 * - on_leave / same_shift / not_eligible: cannot help
 */
export function analyzeSwapEligibility(
  requestingStaff: StaffMember,
  dateStr: string,
  targetShiftCode: ShiftCode,
  allStaff: StaffMember[]
): SwapAnalysisSummary {
  const candidates: SwapCandidate[] = [];
  let totalOff = 0;
  let canDoShift = 0;
  let fatigueConflictCount = 0;
  let onLeaveCount = 0;
  let mutualDutyCount = 0;

  const needsInCharge = IN_CHARGE.includes(targetShiftCode);

  for (const staff of allStaff) {
    if (staff.id === requestingStaff.id) continue;
    // Management (NUM / CNE / CareC / CSO) are not part of the nursing allocation
    if (staff.section === 'Management') continue;

    const cur = (staff.shifts[dateStr] || 'OFF') as ShiftCode;
    const base = {
      staff,
      currentShift: cur,
      prevShift: (staff.shifts[getOffsetDateStr(dateStr, -1)] || 'OFF') as ShiftCode,
      nextShift: (staff.shifts[getOffsetDateStr(dateStr, 1)] || 'OFF') as ShiftCode,
    };

    if (isOffOrAdo(cur)) totalOff++;

    if (isLeave(cur)) {
      onLeaveCount++;
      candidates.push({
        ...base,
        isEligible: false,
        reason: cur === 'SICK' ? 'On sick leave' : `On annual leave (${cur})`,
        restHoursOK: false,
        category: 'on_leave',
      });
      continue;
    }

    // In-charge shifts need an RN, not an EEN / transition / pathways nurse
    if (needsInCharge && ['EEN', 'Registered Nurse Transition Program (TSPRN)', 'Pathways to Practice RN'].includes(staff.section)) {
      candidates.push({
        ...base,
        isEligible: false,
        reason: `${targetShiftCode} is an in-charge shift – needs a registered nurse`,
        restHoursOK: true,
        category: 'not_eligible',
      });
      continue;
    }

    if (cur === targetShiftCode) {
      candidates.push({
        ...base,
        isEligible: false,
        reason: `Already working ${targetShiftCode} that day`,
        restHoursOK: true,
        category: 'same_shift',
      });
      continue;
    }

    // Off / ADO: can they take it?
    if (isOffOrAdo(cur)) {
      const r = restCheck(staff, dateStr, targetShiftCode);
      if (r.ok) {
        canDoShift++;
        candidates.push({
          ...base,
          isEligible: true,
          reason: `Off that day – rested and free to take your ${targetShiftCode}`,
          restHoursOK: true,
          category: 'available_off',
        });
      } else {
        fatigueConflictCount++;
        candidates.push({
          ...base,
          isEligible: false,
          reason: `Rest rule: ${r.reason}`,
          restHoursOK: false,
          category: 'fatigue_conflict',
        });
      }
      continue;
    }

    // Working something else: two-way trade, both people must stay rested
    if (isDutyShift(cur)) {
      const theirSide = restCheck(staff, dateStr, targetShiftCode);
      const mySide = restCheck(requestingStaff, dateStr, cur);
      if (theirSide.ok && mySide.ok) {
        mutualDutyCount++;
        candidates.push({
          ...base,
          isEligible: true,
          reason: `Trade: you take their ${cur}, they take your ${targetShiftCode} – both stay rested`,
          restHoursOK: true,
          category: 'mutual_duty',
        });
      } else {
        fatigueConflictCount++;
        const why = !theirSide.ok
          ? `${staff.name.split(' ')[0]} would have ${theirSide.reason}`
          : `You would have ${mySide.reason}`;
        candidates.push({
          ...base,
          isEligible: false,
          reason: `Trade blocked: ${why}`,
          restHoursOK: false,
          category: 'fatigue_conflict',
        });
      }
      continue;
    }

    candidates.push({
      ...base,
      isEligible: false,
      reason: 'Not available for a swap that day',
      restHoursOK: false,
      category: 'not_eligible',
    });
  }

  const score = (c: SwapCandidate) =>
    c.category === 'available_off' ? 1 : c.category === 'mutual_duty' ? 2 : c.category === 'fatigue_conflict' ? 3 : 4;
  candidates.sort((a, b) => score(a) - score(b) || a.staff.name.localeCompare(b.staff.name));

  return { totalOff, canDoShift, fatigueConflictCount, onLeaveCount, mutualDutyCount, candidates };
}

/** Legacy wrapper for compatibility */
export function findSwapCandidates(
  requestingStaff: StaffMember,
  dateStr: string,
  targetShiftCode: ShiftCode,
  allStaff: StaffMember[]
): SwapCandidate[] {
  return analyzeSwapEligibility(requestingStaff, dateStr, targetShiftCode, allStaff).candidates;
}
