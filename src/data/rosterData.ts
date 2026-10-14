import { ShiftCode, ShiftDefinition, StaffMember, DayInfo } from '../types/roster';
import { OFFICIAL_STAFF, ROSTER_DATES } from './officialRoster';

export const SHIFT_DEFINITIONS: Record<ShiftCode, ShiftDefinition> = {
  M: {
    code: 'M',
    label: 'Morning Shift',
    category: 'Morning',
    time: '07:00 - 15:30',
    durationHours: 8,
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-300',
    cardBg: 'bg-amber-50/70',
    description: 'Standard Morning Shift (Handover at 07:00)'
  },
  M1: {
    code: 'M1',
    label: 'Morning Shift 1',
    category: 'Morning',
    time: '07:00 - 15:30',
    durationHours: 8,
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-300',
    cardBg: 'bg-amber-50/70',
    description: 'Morning Shift (In-Charge / Medication)'
  },
  MI: {
    code: 'MI',
    label: 'Morning In-Charge',
    category: 'Morning',
    time: '07:00 - 15:30',
    durationHours: 8,
    badgeBg: 'bg-amber-200',
    badgeText: 'text-amber-950 font-black',
    badgeBorder: 'border-amber-400',
    cardBg: 'bg-amber-50',
    description: 'Morning Team Leader / In-Charge'
  },
  M10: {
    code: 'M10',
    label: 'Morning (10hr)',
    category: 'Morning',
    time: '07:00 - 17:30',
    durationHours: 10,
    badgeBg: 'bg-yellow-200',
    badgeText: 'text-yellow-900',
    badgeBorder: 'border-yellow-400',
    cardBg: 'bg-yellow-50',
    description: 'Extended Morning Shift (10 Hours)'
  },
  E: {
    code: 'E',
    label: 'Evening Shift',
    category: 'Evening',
    time: '13:00 - 21:30',
    durationHours: 8,
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    badgeBorder: 'border-emerald-300',
    cardBg: 'bg-emerald-50/70',
    description: 'Standard Evening Shift'
  },
  E1: {
    code: 'E1',
    label: 'Evening Shift 1',
    category: 'Evening',
    time: '13:00 - 21:30',
    durationHours: 8,
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    badgeBorder: 'border-emerald-300',
    cardBg: 'bg-emerald-50/70',
    description: 'Evening Ward Team 1'
  },
  EI: {
    code: 'EI',
    label: 'Evening In-Charge',
    category: 'Evening',
    time: '13:00 - 21:30',
    durationHours: 8,
    badgeBg: 'bg-emerald-200',
    badgeText: 'text-emerald-950 font-black',
    badgeBorder: 'border-emerald-400',
    cardBg: 'bg-emerald-50',
    description: 'Evening Ward In-Charge Lead'
  },
  E6: {
    code: 'E6',
    label: 'Evening (6hr)',
    category: 'Evening',
    time: '15:30 - 21:30',
    durationHours: 6,
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-900',
    badgeBorder: 'border-teal-300',
    cardBg: 'bg-teal-50',
    description: 'Short Evening Relief Shift'
  },
  E10: {
    code: 'E10',
    label: 'Evening (10hr)',
    category: 'Evening',
    time: '11:30 - 22:00',
    durationHours: 10,
    badgeBg: 'bg-green-200',
    badgeText: 'text-green-950 font-bold',
    badgeBorder: 'border-green-400',
    cardBg: 'bg-green-50',
    description: 'Extended Evening Shift'
  },
  N: {
    code: 'N',
    label: 'Night Shift',
    category: 'Night',
    time: '21:00 - 07:30',
    durationHours: 10,
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-900',
    badgeBorder: 'border-purple-300',
    cardBg: 'bg-purple-50/70',
    description: 'Night Duty Shift (Overnight)'
  },
  N1: {
    code: 'N1',
    label: 'Night Shift Lead',
    category: 'Night',
    time: '21:00 - 07:30',
    durationHours: 10,
    badgeBg: 'bg-fuchsia-100',
    badgeText: 'text-fuchsia-950 font-black',
    badgeBorder: 'border-fuchsia-300',
    cardBg: 'bg-fuchsia-50',
    description: 'Night Duty In-Charge / Senior RN'
  },
  NI: {
    code: 'NI',
    label: 'Night In-Charge',
    category: 'Night',
    time: '21:00 - 07:30',
    durationHours: 10,
    badgeBg: 'bg-purple-200',
    badgeText: 'text-purple-950 font-bold',
    badgeBorder: 'border-purple-400',
    cardBg: 'bg-purple-50',
    description: 'Night Ward Coordinator'
  },
  D: {
    code: 'D',
    label: 'Day / Admin Shift',
    category: 'Day',
    time: '08:00 - 16:30',
    durationHours: 8,
    badgeBg: 'bg-slate-200',
    badgeText: 'text-slate-800 font-bold',
    badgeBorder: 'border-slate-300',
    cardBg: 'bg-slate-100',
    description: 'NUM / CNE Management Day Duty'
  },
  AL: {
    code: 'AL',
    label: 'Annual Leave',
    category: 'Leave',
    time: 'All Day',
    durationHours: 0,
    badgeBg: 'bg-amber-500/20 text-amber-900',
    badgeText: 'text-amber-900 font-black',
    badgeBorder: 'border-amber-400 bg-amber-100',
    cardBg: 'bg-amber-50',
    description: 'Approved Annual Recreation Leave'
  },
  AL6: {
    code: 'AL6',
    label: 'Annual Leave (Partial)',
    category: 'Leave',
    time: 'Partial Day',
    durationHours: 0,
    badgeBg: 'bg-orange-200',
    badgeText: 'text-orange-900 font-bold',
    badgeBorder: 'border-orange-400',
    cardBg: 'bg-orange-50',
    description: 'Partial Annual Leave (6 Hours)'
  },
  ADO: {
    code: 'ADO',
    label: 'Allocated Day Off',
    category: 'Off',
    time: 'Off Duty',
    durationHours: 0,
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800 font-bold',
    badgeBorder: 'border-sky-300',
    cardBg: 'bg-sky-50',
    description: 'Accrued Rostered Day Off'
  },
  ADO4: {
    code: 'ADO4',
    label: 'Allocated Day Off (4hr)',
    category: 'Off',
    time: 'Off Duty',
    durationHours: 0,
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800 font-bold',
    badgeBorder: 'border-sky-300',
    cardBg: 'bg-sky-50',
    description: 'ADO (4h credit)'
  },
  ADO6: {
    code: 'ADO6',
    label: 'Allocated Day Off (6hr)',
    category: 'Off',
    time: 'Off Duty',
    durationHours: 0,
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800 font-bold',
    badgeBorder: 'border-sky-300',
    cardBg: 'bg-sky-50',
    description: 'ADO (6h credit)'
  },
  ADO10: {
    code: 'ADO10',
    label: 'Allocated Day Off (10hr)',
    category: 'Off',
    time: 'Off Duty',
    durationHours: 0,
    badgeBg: 'bg-sky-200',
    badgeText: 'text-sky-900 font-bold',
    badgeBorder: 'border-sky-400',
    cardBg: 'bg-sky-50',
    description: 'ADO (10h credit)'
  },
  SD: {
    code: 'SD',
    label: 'Study Day',
    category: 'Study',
    time: '08:00 - 16:30',
    durationHours: 8,
    badgeBg: 'bg-teal-200',
    badgeText: 'text-teal-950 font-bold',
    badgeBorder: 'border-teal-400',
    cardBg: 'bg-teal-50',
    description: 'Hospital Paid Study Day'
  },
  M6: {
    code: 'M6',
    label: 'Morning (6hr)',
    category: 'Morning',
    time: '07:00 - 13:00',
    durationHours: 6,
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-300',
    cardBg: 'bg-amber-50/70',
    description: 'Short Morning Shift (6 Hours)'
  },
  AL4: {
    code: 'AL4',
    label: 'Annual Leave (4hr)',
    category: 'Leave',
    time: 'Partial Day',
    durationHours: 0,
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-900',
    badgeBorder: 'border-sky-300',
    cardBg: 'bg-sky-50',
    description: 'Part-day annual leave (4 hours)'
  },
  AL10: {
    code: 'AL10',
    label: 'Annual Leave (10hr)',
    category: 'Leave',
    time: 'Partial Day',
    durationHours: 0,
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-900',
    badgeBorder: 'border-sky-300',
    cardBg: 'bg-sky-50',
    description: 'Annual leave (10 hours)'
  },
  SICK: {
    code: 'SICK',
    label: 'Sick Leave',
    category: 'Leave',
    time: 'All Day',
    durationHours: 0,
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-900',
    badgeBorder: 'border-rose-300',
    cardBg: 'bg-rose-50',
    description: 'Sick leave'
  },
  WO: {
    code: 'WO',
    label: 'Ward Orientation',
    category: 'Study',
    time: '07:00 - 15:30',
    durationHours: 8,
    badgeBg: 'bg-teal-100',
    badgeText: 'text-teal-900',
    badgeBorder: 'border-teal-300',
    cardBg: 'bg-teal-50',
    description: 'Ward orientation day'
  },
  SN: {
    code: 'SN',
    label: 'Supernumerary',
    category: 'Morning',
    time: '07:00 - 15:30',
    durationHours: 8,
    badgeBg: 'bg-lime-100',
    badgeText: 'text-lime-900',
    badgeBorder: 'border-lime-300',
    cardBg: 'bg-lime-50',
    description: 'Supernumerary (not counted in ward numbers)'
  },
  AOE: {
    code: 'AOE',
    label: 'Allocated (AOE)',
    category: 'Day',
    time: '08:00 - 16:30',
    durationHours: 8,
    badgeBg: 'bg-fuchsia-100',
    badgeText: 'text-fuchsia-900',
    badgeBorder: 'border-fuchsia-300',
    cardBg: 'bg-fuchsia-50',
    description: 'Allocated day (AOE) as rostered'
  },
  OFF: {
    code: 'OFF',
    label: 'Rostered Day Off',
    category: 'Off',
    time: 'Off Duty',
    durationHours: 0,
    badgeBg: 'bg-slate-50',
    badgeText: 'text-slate-400',
    badgeBorder: 'border-slate-200',
    cardBg: 'bg-white',
    description: 'Unscheduled Rest Day'
  }
};

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// 8 weeks, Monday 12 Oct - Sunday 6 Dec 2026 (two 4-week rosters)
export const ROSTER_DAYS: DayInfo[] = ROSTER_DATES.map((dateStr, i) => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  return {
    dateStr,
    dayNumber: String(d).padStart(2, '0'),
    dayName: DAY_LETTERS[dow],
    fullDayName: DAY_NAMES[dow],
    isWeekend: dow === 0 || dow === 6,
    weekIndex: Math.floor(i / 7) + 1,
  };
});

// Official ward rosters, transcribed from the published PDFs and hour-checked
export const INITIAL_STAFF_MEMBERS: StaffMember[] = OFFICIAL_STAFF;

export const WARD_INFO = {
  hospitalName: "St. Vincent's Public Hospital",
  wardName: '9 North / GSS',
  periodTitle: '12th October - 6th December 2026',
  takeDownNotice: 'Ward 9 North Roster',
  totalBeds: 28,
  nurseLeadContact: 'Helen White (NUM) - Ext 4902'
};
