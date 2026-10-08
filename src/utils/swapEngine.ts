import { StaffMember, ShiftCode, SwapCandidate } from '../types/roster';

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

export function isLeave(shift: ShiftCode | undefined): boolean {
  if (!shift) return false;
  return ['AL', 'AL6'].includes(shift);
}

export function isOffOrAdo(shift: ShiftCode | undefined): boolean {
  if (!shift || shift === 'OFF') return true;
  return ['ADO', 'ADO4', 'ADO6', 'ADO10'].includes(shift);
}

/**
 * Find eligible colleagues who can swap or cover a specific shift on a specific date.
 */
export function findSwapCandidates(
  requestingStaff: StaffMember,
  dateStr: string,
  targetShiftCode: ShiftCode,
  allStaff: StaffMember[]
): SwapCandidate[] {
  // Determine previous day and next day date strings
  const currDate = new Date(dateStr);
  const prevDate = new Date(currDate);
  prevDate.setDate(currDate.getDate() - 1);
  const prevDateStr = prevDate.toISOString().split('T')[0];

  const nextDate = new Date(currDate);
  nextDate.setDate(currDate.getDate() + 1);
  const nextDateStr = nextDate.toISOString().split('T')[0];

  const candidates: SwapCandidate[] = [];

  for (const staff of allStaff) {
    if (staff.id === requestingStaff.id) continue;

    const currentShift = staff.shifts[dateStr] || 'OFF';
    const prevShift = staff.shifts[prevDateStr] || 'OFF';
    const nextShift = staff.shifts[nextDateStr] || 'OFF';

    // Rule 1: Cannot swap if candidate is on Annual Leave
    if (isLeave(currentShift)) {
      candidates.push({
        staff,
        currentShift,
        isEligible: false,
        reason: 'On Annual Leave (AL)',
        restHoursOK: false
      });
      continue;
    }

    // Rule 2: If requesting shift is Morning (07:00 start), candidate cannot have worked Night shift on the night before!
    if (['M', 'M1', 'MI', 'M10'].includes(targetShiftCode) && isNightShift(prevShift)) {
      candidates.push({
        staff,
        currentShift,
        isEligible: false,
        reason: 'Fatigue Rule: Worked Night shift on previous night (No adequate rest break)',
        restHoursOK: false
      });
      continue;
    }

    // Rule 3: If requesting shift is Night (ends 07:30 next morning), candidate cannot have Morning shift next morning!
    if (isNightShift(targetShiftCode) && ['M', 'M1', 'MI', 'M10'].includes(nextShift)) {
      candidates.push({
        staff,
        currentShift,
        isEligible: false,
        reason: 'Fatigue Rule: Scheduled for Morning shift the next morning',
        restHoursOK: false
      });
      continue;
    }

    // Rule 4: Currently OFF or on ADO (Prime swap candidate - can cover or pick up)
    if (isOffOrAdo(currentShift)) {
      candidates.push({
        staff,
        currentShift,
        isEligible: true,
        reason: currentShift.startsWith('ADO') 
          ? 'Available (Scheduled ADO - Can swap off-duty credit)' 
          : 'Available (Rostered Day Off - Ready to cover)',
        restHoursOK: true
      });
      continue;
    }

    // Rule 5: Candidate already working the same shift
    if (currentShift === targetShiftCode) {
      candidates.push({
        staff,
        currentShift,
        isEligible: false,
        reason: `Already assigned to ${currentShift} on this day`,
        restHoursOK: true
      });
      continue;
    }

    // Rule 6: Candidate working different active shift (Potential Mutual / Bilateral Swap)
    if (isDutyShift(currentShift)) {
      candidates.push({
        staff,
        currentShift,
        isEligible: true,
        reason: `Mutual Swap Option (Currently working ${currentShift} - Bilateral exchange possible)`,
        restHoursOK: true
      });
      continue;
    }

    candidates.push({
      staff,
      currentShift,
      isEligible: false,
      reason: 'Not eligible under ward scheduling rules',
      restHoursOK: false
    });
  }

  // Sort: Eligible first (OFF/ADO at top, then mutual duty swaps), then ineligible
  return candidates.sort((a, b) => {
    if (a.isEligible && !b.isEligible) return -1;
    if (!a.isEligible && b.isEligible) return 1;
    if (isOffOrAdo(a.currentShift) && !isOffOrAdo(b.currentShift)) return -1;
    if (!isOffOrAdo(a.currentShift) && isOffOrAdo(b.currentShift)) return 1;
    return a.staff.name.localeCompare(b.staff.name);
  });
}
