export type ShiftCode =
  | 'M'
  | 'M1'
  | 'MI'
  | 'M10'
  | 'E'
  | 'E1'
  | 'EI'
  | 'E6'
  | 'E10'
  | 'N'
  | 'N1'
  | 'NI'
  | 'D'
  | 'AL'
  | 'AL6'
  | 'ADO'
  | 'ADO4'
  | 'ADO6'
  | 'ADO10'
  | 'SD'
  | 'OFF';

export interface ShiftDefinition {
  code: ShiftCode;
  label: string;
  category: 'Morning' | 'Evening' | 'Night' | 'Day' | 'Leave' | 'Off' | 'Study';
  time: string;
  durationHours: number;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardBg: string;
  description: string;
}

export type StaffSection =
  | 'Management'
  | 'RN In charge'
  | 'RN'
  | 'Registered Nurse Transition Program (TSPRN)'
  | 'Pathways to Practice RN'
  | 'EEN';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  fte: number;
  section: StaffSection;
  notes?: string;
  isFavorite?: boolean;
  shifts: Record<string, ShiftCode>; // "2026-10-12": "M"
}

export interface DayInfo {
  dateStr: string;
  dayNumber: string;
  dayName: 'M' | 'T' | 'W' | 'T' | 'F' | 'S' | 'S';
  fullDayName: string;
  isWeekend: boolean;
  weekIndex: number;
}

export interface SwapCandidate {
  staff: StaffMember;
  currentShift: ShiftCode;
  isEligible: boolean;
  reason: string;
  restHoursOK: boolean;
}

export interface SwapRequest {
  id: string;
  fromStaffId: string;
  toStaffId: string;
  dateStr: string;
  originalShift: ShiftCode;
  targetShift: ShiftCode;
  status: 'pending' | 'accepted' | 'declined';
  notes?: string;
  timestamp: string;
}
