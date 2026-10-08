import { StaffMember, ShiftCode, SwapCandidate, SwapAnalysisSummary } from '../types/roster';

/**
 * Checks whether a staff member is working an active duty shift.
 */
export function isDutyShift(shift: ShiftCode | undefined): boolean {
  if (!shift) return false;
  return ['M', 'M1', 'MI', 'M10', 'E', 'E1', 'EI', 'E6', 'E10', 'N', 'N1', 'NI', 'D', 'SD'].includes(shift);
}

export function isNightShift(shift: ShiftCode | undefined): boolean {
  if (!shift) return false;
  return ['N', 'N1', 'NI'].includes(shift);
}

export function isMorningShift(shift: ShiftCode | undefined): boolean {
  if (!shift) return false;
  return ['M', 'M1', 'MI', 'M10'].includes(shift);
}

export function isEveningShift(shift: ShiftCode | undefined): boolean {
  if (!shift) return false;
  return ['E', 'E1', 'EI', 'E6', 'E10'].includes(shift);
}

export function isLeave(shift: ShiftCode | undefined): boolean {
  if (!shift) return false;
  return ['AL', 'AL6'].includes(shift);
}

export function isOffOrAdo(shift: ShiftCode | undefined): boolean {
  if (!shift || shift === 'OFF') return true;
  return ['ADO', 'ADO4', 'ADO6', 'ADO10'].includes(shift);
}

/**
 * Helper to get adjacent date string (YYYY-MM-DD)
 */
function getOffsetDateStr(dateStr: string, offsetDays: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d + offsetDays);
  const targetY = targetDate.getFullYear();
  const targetM = String(targetDate.getMonth() + 1).padStart(2, '0');
  const targetD = String(targetDate.getDate()).padStart(2, '0');
  return `${targetY}-${targetM}-${targetD}`;
}

/**
 * Analyze swap candidates and calculate exact metrics:
 * - How many colleagues are OFF / ADO today
 * - How many CAN take the shift (fatigue compliant)
 * - How many CANNOT take the shift (fatigue turnaround conflicts)
 */
export function analyzeSwapEligibility(
  requestingStaff: StaffMember,
  dateStr: string,
  targetShiftCode: ShiftCode,
  allStaff: StaffMember[]
): SwapAnalysisSummary {
  const prevDateStr = getOffsetDateStr(dateStr, -1);
  const nextDateStr = getOffsetDateStr(dateStr, 1);

  const candidates: SwapCandidate[] = [];

  let totalOff = 0;
  let canDoShift = 0;
  let fatigueConflictCount = 0;
  let onLeaveCount = 0;
  let mutualDutyCount = 0;

  for (const staff of allStaff) {
    if (staff.id === requestingStaff.id) continue;

    const currentShift = (staff.shifts[dateStr] || 'OFF') as ShiftCode;
    const prevShift = (staff.shifts[prevDateStr] || 'OFF') as ShiftCode;
    const nextShift = (staff.shifts[nextDateStr] || 'OFF') as ShiftCode;

    // Track total off/ADO
    if (isOffOrAdo(currentShift)) {
      totalOff++;
    }

    // 1. Annual Leave Check
    if (isLeave(currentShift)) {
      onLeaveCount++;
      candidates.push({
        staff,
        currentShift,
        isEligible: false,
        reason: 'On Annual Leave (AL) - unavailable for ward swap',
        restHoursOK: false,
        category: 'on_leave',
        prevShift,
        nextShift
      });
      continue;
    }

    // 2. Candidate is OFF or ADO on target day
    if (isOffOrAdo(currentShift)) {
      // Rule A: Target shift is MORNING (07:00 - 15:30)
      // Anyone who worked NIGHT duty last night CANNOT work Morning today (0h break, night ends 07:30!)
      if (isMorningShift(targetShiftCode)) {
        if (isNightShift(prevShift)) {
          fatigueConflictCount++;
          candidates.push({
            staff,
            currentShift,
            isEligible: false,
            reason: 'Fatigue Violation: Worked Night duty yesterday (Ends 07:30, cannot start Morning at 07:00)',
            restHoursOK: false,
            category: 'fatigue_conflict',
            prevShift,
            nextShift
          });
          continue;
        }

        // Anyone who was OFF, or worked Morning, or worked Evening (9.5h turnaround) can work!
        canDoShift++;
        const prevDesc = isOffOrAdo(prevShift) 
          ? 'Off yesterday • Fully rested for Morning shift'
          : isEveningShift(prevShift)
            ? 'Evening yesterday • Available for Morning coverage (9.5h rest)'
            : 'Morning yesterday • Available for Morning coverage';

        candidates.push({
          staff,
          currentShift,
          isEligible: true,
          reason: `Eligible to cover: ${prevDesc}`,
          restHoursOK: true,
          category: 'available_off',
          prevShift,
          nextShift
        });
        continue;
      }

      // Rule B: Target shift is NIGHT (21:00 - 07:30 next morning)
      // Anyone who is rostered for MORNING tomorrow CANNOT work Night tonight (Night ends 07:30, collides with 07:00 Morning!)
      if (isNightShift(targetShiftCode)) {
        if (isMorningShift(nextShift)) {
          fatigueConflictCount++;
          candidates.push({
            staff,
            currentShift,
            isEligible: false,
            reason: 'Fatigue Violation: Rostered for Morning shift tomorrow (Night duty ends 07:30, collides with 07:00 start)',
            restHoursOK: false,
            category: 'fatigue_conflict',
            prevShift,
            nextShift
          });
          continue;
        }

        // Available to work Night shift
        canDoShift++;
        const nextDesc = isOffOrAdo(nextShift)
          ? 'Off tomorrow • Protected sleep day after Night shift'
          : `Rostered ${nextShift} tomorrow • Rest protected for Night duty`;

        candidates.push({
          staff,
          currentShift,
          isEligible: true,
          reason: `Eligible to cover: ${nextDesc}`,
          restHoursOK: true,
          category: 'available_off',
          prevShift,
          nextShift
        });
        continue;
      }

      // Rule C: Target shift is EVENING (13:00 - 21:30)
      // Anyone who worked Night last night has only 5.5h rest before 13:00 Evening
      if (isEveningShift(targetShiftCode)) {
        if (isNightShift(prevShift)) {
          fatigueConflictCount++;
          candidates.push({
            staff,
            currentShift,
            isEligible: false,
            reason: 'Fatigue Violation: Worked Night duty yesterday (Only 5.5h rest break before 13:00 Evening)',
            restHoursOK: false,
            category: 'fatigue_conflict',
            prevShift,
            nextShift
          });
          continue;
        }

        canDoShift++;
        candidates.push({
          staff,
          currentShift,
          isEligible: true,
          reason: 'Off duty today • Fully rested & eligible to cover Evening shift',
          restHoursOK: true,
          category: 'available_off',
          prevShift,
          nextShift
        });
        continue;
      }

      // Rule D: Day Admin / Study shift
      if (isNightShift(prevShift)) {
        fatigueConflictCount++;
        candidates.push({
          staff,
          currentShift,
          isEligible: false,
          reason: 'Fatigue Violation: Worked Night duty yesterday',
          restHoursOK: false,
          category: 'fatigue_conflict',
          prevShift,
          nextShift
        });
        continue;
      }

      canDoShift++;
      candidates.push({
        staff,
        currentShift,
        isEligible: true,
        reason: 'Off duty today • Available to cover scheduled duty',
        restHoursOK: true,
        category: 'available_off',
        prevShift,
        nextShift
      });
      continue;
    }

    // 3. Candidate already working the SAME shift
    if (currentShift === targetShiftCode) {
      candidates.push({
        staff,
        currentShift,
        isEligible: false,
        reason: `Already rostered on ${targetShiftCode} on this day`,
        restHoursOK: true,
        category: 'same_shift',
        prevShift,
        nextShift
      });
      continue;
    }

    // 4. Candidate working a DIFFERENT active duty (Mutual Shift Swap Option)
    if (isDutyShift(currentShift)) {
      mutualDutyCount++;
      candidates.push({
        staff,
        currentShift,
        isEligible: true,
        reason: `Mutual Swap Option (Currently working ${currentShift} - Direct trade possible)`,
        restHoursOK: true,
        category: 'mutual_duty',
        prevShift,
        nextShift
      });
      continue;
    }

    candidates.push({
      staff,
      currentShift,
      isEligible: false,
      reason: 'Not eligible under ward scheduling rules',
      restHoursOK: false,
      category: 'fatigue_conflict',
      prevShift,
      nextShift
    });
  }

  // Sort candidates:
  // 1. Available OFF colleagues (prime candidates)
  // 2. Mutual duty swap options
  // 3. Fatigue conflicted colleagues
  // 4. On leave / same shift
  candidates.sort((a, b) => {
    const score = (c: SwapCandidate) => {
      if (c.category === 'available_off') return 1;
      if (c.category === 'mutual_duty') return 2;
      if (c.category === 'fatigue_conflict') return 3;
      return 4;
    };
    const diff = score(a) - score(b);
    if (diff !== 0) return diff;
    return a.staff.name.localeCompare(b.staff.name);
  });

  return {
    totalOff,
    canDoShift,
    fatigueConflictCount,
    onLeaveCount,
    mutualDutyCount,
    candidates
  };
}

/**
 * Legacy wrapper for compatibility
 */
export function findSwapCandidates(
  requestingStaff: StaffMember,
  dateStr: string,
  targetShiftCode: ShiftCode,
  allStaff: StaffMember[]
): SwapCandidate[] {
  return analyzeSwapEligibility(requestingStaff, dateStr, targetShiftCode, allStaff).candidates;
}
