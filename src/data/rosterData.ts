import { ShiftCode, ShiftDefinition, StaffMember, DayInfo } from '../types/roster';

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
    description: 'ADO (4h accrual credit)'
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
    description: 'ADO (6h accrual credit)'
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
    description: 'ADO (10h accrual credit)'
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
    description: 'Paid Hospital Training / CPD Study Day'
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

export const ROSTER_DAYS: DayInfo[] = [
  // Week 1 (Oct 12 - Oct 18)
  { dateStr: '2026-10-12', dayNumber: '12', dayName: 'M', fullDayName: 'Monday', isWeekend: false, weekIndex: 1 },
  { dateStr: '2026-10-13', dayNumber: '13', dayName: 'T', fullDayName: 'Tuesday', isWeekend: false, weekIndex: 1 },
  { dateStr: '2026-10-14', dayNumber: '14', dayName: 'W', fullDayName: 'Wednesday', isWeekend: false, weekIndex: 1 },
  { dateStr: '2026-10-15', dayNumber: '15', dayName: 'T', fullDayName: 'Thursday', isWeekend: false, weekIndex: 1 },
  { dateStr: '2026-10-16', dayNumber: '16', dayName: 'F', fullDayName: 'Friday', isWeekend: false, weekIndex: 1 },
  { dateStr: '2026-10-17', dayNumber: '17', dayName: 'S', fullDayName: 'Saturday', isWeekend: true, weekIndex: 1 },
  { dateStr: '2026-10-18', dayNumber: '18', dayName: 'S', fullDayName: 'Sunday', isWeekend: true, weekIndex: 1 },

  // Week 2 (Oct 19 - Oct 25)
  { dateStr: '2026-10-19', dayNumber: '19', dayName: 'M', fullDayName: 'Monday', isWeekend: false, weekIndex: 2 },
  { dateStr: '2026-10-20', dayNumber: '20', dayName: 'T', fullDayName: 'Tuesday', isWeekend: false, weekIndex: 2 },
  { dateStr: '2026-10-21', dayNumber: '21', dayName: 'W', fullDayName: 'Wednesday', isWeekend: false, weekIndex: 2 },
  { dateStr: '2026-10-22', dayNumber: '22', dayName: 'T', fullDayName: 'Thursday', isWeekend: false, weekIndex: 2 },
  { dateStr: '2026-10-23', dayNumber: '23', dayName: 'F', fullDayName: 'Friday', isWeekend: false, weekIndex: 2 },
  { dateStr: '2026-10-24', dayNumber: '24', dayName: 'S', fullDayName: 'Saturday', isWeekend: true, weekIndex: 2 },
  { dateStr: '2026-10-25', dayNumber: '25', dayName: 'S', fullDayName: 'Sunday', isWeekend: true, weekIndex: 2 },

  // Week 3 (Oct 26 - Nov 01)
  { dateStr: '2026-10-26', dayNumber: '26', dayName: 'M', fullDayName: 'Monday', isWeekend: false, weekIndex: 3 },
  { dateStr: '2026-10-27', dayNumber: '27', dayName: 'T', fullDayName: 'Tuesday', isWeekend: false, weekIndex: 3 },
  { dateStr: '2026-10-28', dayNumber: '28', dayName: 'W', fullDayName: 'Wednesday', isWeekend: false, weekIndex: 3 },
  { dateStr: '2026-10-29', dayNumber: '29', dayName: 'T', fullDayName: 'Thursday', isWeekend: false, weekIndex: 3 },
  { dateStr: '2026-10-30', dayNumber: '30', dayName: 'F', fullDayName: 'Friday', isWeekend: false, weekIndex: 3 },
  { dateStr: '2026-10-31', dayNumber: '31', dayName: 'S', fullDayName: 'Saturday', isWeekend: true, weekIndex: 3 },
  { dateStr: '2026-11-01', dayNumber: '01', dayName: 'S', fullDayName: 'Sunday', isWeekend: true, weekIndex: 3 },

  // Week 4 (Nov 02 - Nov 08)
  { dateStr: '2026-11-02', dayNumber: '02', dayName: 'M', fullDayName: 'Monday', isWeekend: false, weekIndex: 4 },
  { dateStr: '2026-11-03', dayNumber: '03', dayName: 'T', fullDayName: 'Tuesday', isWeekend: false, weekIndex: 4 },
  { dateStr: '2026-11-04', dayNumber: '04', dayName: 'W', fullDayName: 'Wednesday', isWeekend: false, weekIndex: 4 },
  { dateStr: '2026-11-05', dayNumber: '05', dayName: 'T', fullDayName: 'Thursday', isWeekend: false, weekIndex: 4 },
  { dateStr: '2026-11-06', dayNumber: '06', dayName: 'F', fullDayName: 'Friday', isWeekend: false, weekIndex: 4 },
  { dateStr: '2026-11-07', dayNumber: '07', dayName: 'S', fullDayName: 'Saturday', isWeekend: true, weekIndex: 4 },
  { dateStr: '2026-11-08', dayNumber: '08', dayName: 'S', fullDayName: 'Sunday', isWeekend: true, weekIndex: 4 }
];

export const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  // 1. Wife Profile - Richa Budhathoki (Priority #1)
  {
    id: 'staff-richa-budhathoki',
    name: 'Richa Budhathoki',
    role: 'RN',
    fte: 0.8,
    section: 'RN',
    isFavorite: true,
    notes: 'Wife Profile • Priority View',
    shifts: {
      '2026-10-12': 'E',
      '2026-10-13': 'E',
      '2026-10-14': 'OFF',
      '2026-10-15': 'M',
      '2026-10-16': 'M',
      '2026-10-17': 'N',
      '2026-10-18': 'N',
      '2026-10-19': 'OFF',
      '2026-10-20': 'E',
      '2026-10-21': 'E',
      '2026-10-22': 'OFF',
      '2026-10-23': 'E',
      '2026-10-24': 'OFF',
      '2026-10-25': 'OFF',
      '2026-10-26': 'E',
      '2026-10-27': 'E',
      '2026-10-28': 'E',
      '2026-10-29': 'OFF',
      '2026-10-30': 'ADO',
      '2026-10-31': 'OFF',
      '2026-11-01': 'OFF',
      '2026-11-02': 'OFF',
      '2026-11-03': 'N',
      '2026-11-04': 'N',
      '2026-11-05': 'OFF',
      '2026-11-06': 'OFF',
      '2026-11-07': 'OFF',
      '2026-11-08': 'OFF'
    }
  },

  // 2. Management
  {
    id: 'staff-helen-white',
    name: 'Helen White',
    role: 'NUM',
    fte: 1.0,
    section: 'Management',
    shifts: {
      '2026-10-12': 'D', '2026-10-13': 'D', '2026-10-14': 'D', '2026-10-15': 'D', '2026-10-16': 'D',
      '2026-10-19': 'D', '2026-10-20': 'D', '2026-10-21': 'D', '2026-10-22': 'D', '2026-10-23': 'D',
      '2026-10-26': 'D', '2026-10-27': 'D', '2026-10-28': 'D', '2026-10-29': 'D', '2026-10-30': 'ADO',
      '2026-11-02': 'D', '2026-11-03': 'D', '2026-11-04': 'D', '2026-11-05': 'D', '2026-11-06': 'D'
    }
  },
  {
    id: 'staff-kate-wheatley',
    name: 'Kate Wheatley',
    role: 'CNE',
    fte: 1.0,
    section: 'Management',
    shifts: {
      '2026-10-12': 'D', '2026-10-13': 'D', '2026-10-14': 'D', '2026-10-15': 'D', '2026-10-16': 'D',
      '2026-10-19': 'D', '2026-10-20': 'D', '2026-10-21': 'D', '2026-10-22': 'D', '2026-10-23': 'D',
      '2026-10-26': 'D', '2026-10-27': 'D', '2026-10-28': 'D', '2026-10-29': 'D', '2026-10-30': 'D',
      '2026-11-02': 'D', '2026-11-03': 'D', '2026-11-04': 'D', '2026-11-05': 'D', '2026-11-06': 'ADO'
    }
  },
  {
    id: 'staff-heather-mackrory',
    name: 'Heather Mackrory',
    role: 'CareC',
    fte: 1.0,
    section: 'Management',
    shifts: {
      '2026-10-12': 'D', '2026-10-13': 'D', '2026-10-14': 'D', '2026-10-15': 'D', '2026-10-16': 'ADO',
      '2026-10-19': 'D', '2026-10-20': 'D', '2026-10-21': 'D', '2026-10-22': 'D', '2026-10-23': 'D',
      '2026-10-26': 'D', '2026-10-27': 'D', '2026-10-28': 'D', '2026-10-29': 'D', '2026-10-30': 'D',
      '2026-11-02': 'D', '2026-11-03': 'D', '2026-11-04': 'D', '2026-11-05': 'D', '2026-11-06': 'D'
    }
  },
  {
    id: 'staff-sasi-piksultong',
    name: 'Sasi Piksultong',
    role: 'CSO',
    fte: 1.0,
    section: 'Management',
    shifts: {
      '2026-10-12': 'D', '2026-10-13': 'D', '2026-10-14': 'D', '2026-10-15': 'D', '2026-10-16': 'D',
      '2026-10-19': 'D', '2026-10-20': 'D', '2026-10-21': 'D', '2026-10-22': 'D', '2026-10-23': 'D',
      '2026-10-26': 'D', '2026-10-27': 'D', '2026-10-28': 'ADO', '2026-10-29': 'D', '2026-10-30': 'D',
      '2026-11-02': 'D', '2026-11-03': 'D', '2026-11-04': 'D', '2026-11-05': 'D', '2026-11-06': 'D'
    }
  },

  // 3. RN In Charge
  {
    id: 'staff-barsha-bhattarai',
    name: 'Barsha Bhattarai',
    role: 'RN',
    fte: 1.0,
    section: 'RN In charge',
    shifts: {
      '2026-10-12': 'EI', '2026-10-13': 'EI', '2026-10-14': 'M', '2026-10-15': 'M', '2026-10-16': 'M1',
      '2026-10-17': 'MI', '2026-10-18': 'E', '2026-10-20': 'ADO', '2026-10-21': 'M', '2026-10-22': 'M',
      '2026-10-23': 'M', '2026-10-24': 'M', '2026-10-25': 'M', '2026-10-27': 'M', '2026-10-28': 'M',
      '2026-10-29': 'M', '2026-10-30': 'M', '2026-10-31': 'M', '2026-11-01': 'M', '2026-11-03': 'M',
      '2026-11-04': 'M', '2026-11-05': 'M', '2026-11-06': 'M', '2026-11-07': 'M', '2026-11-08': 'AL'
    }
  },
  {
    id: 'staff-sodanneychow',
    name: 'Sodanney Chow',
    role: 'RN',
    fte: 1.0,
    section: 'RN In charge',
    shifts: {
      '2026-10-14': 'N1', '2026-10-15': 'N', '2026-10-16': 'N', '2026-10-17': 'N',
      '2026-10-21': 'ADO', '2026-10-22': 'EI', '2026-10-23': 'EI', '2026-10-24': 'EI', '2026-10-25': 'EI',
      '2026-10-28': 'N1', '2026-10-29': 'N', '2026-10-30': 'N', '2026-10-31': 'N1',
      '2026-11-04': 'E', '2026-11-05': 'E', '2026-11-06': 'EI', '2026-11-07': 'EI'
    }
  },
  {
    id: 'staff-very-cristiano',
    name: 'Very Cristiano',
    role: 'RN',
    fte: 1.0,
    section: 'RN In charge',
    shifts: {
      '2026-10-13': 'ADO4', '2026-10-14': 'M', '2026-10-15': 'M', '2026-10-16': 'NI', '2026-10-17': 'N',
      '2026-10-18': 'N', '2026-10-20': 'N', '2026-10-21': 'N', '2026-10-22': 'M', '2026-10-23': 'M',
      '2026-10-27': 'M', '2026-10-28': 'M', '2026-10-29': 'E', '2026-10-30': 'E',
      '2026-11-03': 'E', '2026-11-04': 'EI', '2026-11-05': 'EI', '2026-11-06': 'E', '2026-11-07': 'E'
    }
  },
  {
    id: 'staff-chloe-greenwood',
    name: 'Chloe Greenwood',
    role: 'RN',
    fte: 1.0,
    section: 'RN In charge',
    shifts: {
      '2026-10-12': 'M', '2026-10-13': 'D', '2026-10-14': 'MI', '2026-10-15': 'MI', '2026-10-16': 'ADO',
      '2026-10-20': 'M', '2026-10-21': 'M', '2026-10-22': 'MI', '2026-10-23': 'MI', '2026-10-24': 'M',
      '2026-10-27': 'MI', '2026-10-28': 'MI', '2026-10-29': 'MI', '2026-10-30': 'MI', '2026-10-31': 'M',
      '2026-11-03': 'M', '2026-11-04': 'M', '2026-11-05': 'M', '2026-11-06': 'M', '2026-11-07': 'M'
    }
  },
  {
    id: 'staff-kanchan-khadka',
    name: 'Kanchan Khadka',
    role: 'RN',
    fte: 1.0,
    section: 'RN In charge',
    shifts: {
      '2026-10-12': 'M', '2026-10-13': 'M', '2026-10-14': 'M', '2026-10-15': 'M', '2026-10-16': 'AL',
      '2026-10-17': 'AL', '2026-10-18': 'M', '2026-10-19': 'M', '2026-10-20': 'M', '2026-10-21': 'M',
      '2026-10-28': 'ADO', '2026-10-29': 'MI', '2026-10-30': 'M', '2026-10-31': 'MI',
      '2026-11-04': 'M', '2026-11-05': 'MI', '2026-11-06': 'M', '2026-11-07': 'M'
    }
  },
  {
    id: 'staff-pisey-ly',
    name: 'Pisey Ly',
    role: 'RN',
    fte: 1.0,
    section: 'RN In charge',
    shifts: {
      '2026-10-12': 'ADO4', '2026-10-13': 'E', '2026-10-14': 'EI', '2026-10-15': 'EI', '2026-10-16': 'N',
      '2026-10-17': 'N', '2026-10-19': 'AL', '2026-10-20': 'AL', '2026-10-21': 'M', '2026-10-22': 'M',
      '2026-10-25': 'AL', '2026-10-26': 'AL', '2026-10-27': 'AL', '2026-10-28': 'AL', '2026-10-29': 'AL',
      '2026-10-30': 'AL', '2026-11-01': 'AL', '2026-11-02': 'AL', '2026-11-03': 'AL', '2026-11-04': 'AL'
    }
  },
  {
    id: 'staff-reshmi-nayabhari',
    name: 'Reshmi Nayabhari',
    role: 'RN',
    fte: 1.0,
    section: 'RN In charge',
    notes: 'SPLIT NIGHTS',
    shifts: {
      '2026-10-12': 'M', '2026-10-14': 'ADO6', '2026-10-15': 'EI', '2026-10-16': 'EI', '2026-10-17': 'EI',
      '2026-10-20': 'E', '2026-10-21': 'E', '2026-10-22': 'E', '2026-10-23': 'E', '2026-10-25': 'N',
      '2026-10-27': 'M', '2026-10-29': 'N1', '2026-10-30': 'N', '2026-11-02': 'M', '2026-11-03': 'M',
      '2026-11-04': 'M', '2026-11-05': 'M', '2026-11-06': 'M'
    }
  },
  {
    id: 'staff-ivanka-peric',
    name: 'Ivanka Peric',
    role: 'RN',
    fte: 1.0,
    section: 'RN In charge',
    shifts: {
      '2026-10-12': 'AL', '2026-10-13': 'AL', '2026-10-14': 'AL', '2026-10-15': 'AL', '2026-10-16': 'AL',
      '2026-10-19': 'E', '2026-10-20': 'E', '2026-10-21': 'E', '2026-10-22': 'E', '2026-10-23': 'E',
      '2026-10-27': 'E', '2026-10-28': 'E', '2026-10-29': 'E', '2026-10-31': 'ADO6', '2026-11-01': 'N',
      '2026-11-02': 'N', '2026-11-03': 'N', '2026-11-04': 'N'
    }
  },
  {
    id: 'staff-sarista-paudel',
    name: 'Sarista Paudel',
    role: 'RN',
    fte: 1.0,
    section: 'RN In charge',
    notes: 'Split Nights',
    shifts: {
      '2026-10-12': 'AL', '2026-10-13': 'AL', '2026-10-14': 'AL', '2026-10-15': 'AL', '2026-10-16': 'AL',
      '2026-10-17': 'AL', '2026-10-18': 'AL', '2026-10-19': 'AL', '2026-10-20': 'AL', '2026-10-21': 'AL',
      '2026-10-22': 'AL', '2026-10-23': 'AL', '2026-10-24': 'AL', '2026-10-25': 'AL', '2026-10-26': 'AL',
      '2026-10-27': 'AL', '2026-10-28': 'AL', '2026-10-29': 'AL', '2026-10-30': 'AL', '2026-10-31': 'AL',
      '2026-11-01': 'AL', '2026-11-02': 'AL', '2026-11-04': 'N', '2026-11-05': 'N'
    }
  },
  {
    id: 'staff-sapana-pun',
    name: 'Sapana Pun',
    role: 'RN',
    fte: 1.0,
    section: 'RN In charge',
    notes: 'Split night = no wed/thurs',
    shifts: {
      '2026-10-12': 'EI', '2026-10-13': 'N', '2026-10-15': 'ADO', '2026-10-16': 'E', '2026-10-17': 'NI',
      '2026-10-18': 'N', '2026-10-20': 'M', '2026-10-21': 'M', '2026-10-23': 'EI', '2026-10-24': 'EI',
      '2026-10-26': 'M1', '2026-10-27': 'M1', '2026-10-30': 'EI', '2026-10-31': 'EI',
      '2026-11-02': 'MI', '2026-11-03': 'MI', '2026-11-06': 'N', '2026-11-07': 'N'
    }
  },
  {
    id: 'staff-anita-rai',
    name: 'Anita Rai',
    role: 'RN',
    fte: 1.0,
    section: 'RN In charge',
    notes: 'SPLIT NIGHTS',
    shifts: {
      '2026-10-12': 'E', '2026-10-13': 'E10', '2026-10-15': 'M', '2026-10-16': 'ADO10', '2026-10-17': 'N1',
      '2026-10-18': 'NI', '2026-10-20': 'E', '2026-10-21': 'E', '2026-10-23': 'NI', '2026-10-24': 'NI',
      '2026-10-26': 'E', '2026-10-27': 'E', '2026-10-29': 'M', '2026-10-30': 'E',
      '2026-11-03': 'E', '2026-11-04': 'M', '2026-11-06': 'E', '2026-11-07': 'E'
    }
  },

  // 4. RN (Staff Nurses)
  {
    id: 'staff-nisha-bohara',
    name: 'Nisha Bohara',
    role: 'RN',
    fte: 1.0,
    section: 'RN',
    notes: 'SPLIT NIGHT',
    shifts: {
      '2026-10-12': 'E', '2026-10-13': 'E', '2026-10-15': 'M', '2026-10-16': 'M', '2026-10-17': 'N',
      '2026-10-18': 'N', '2026-10-20': 'E', '2026-10-21': 'E', '2026-10-23': 'E', '2026-10-24': 'E',
      '2026-10-26': 'E', '2026-10-27': 'E', '2026-10-28': 'N', '2026-10-30': 'E6', '2026-10-31': 'E',
      '2026-11-02': 'ADO', '2026-11-04': 'N', '2026-11-05': 'N'
    }
  },
  {
    id: 'staff-anuj-dhakal',
    name: 'Anuj Dhakal',
    role: 'RN',
    fte: 1.0,
    section: 'RN',
    shifts: {
      '2026-10-12': 'E', '2026-10-13': 'E', '2026-10-14': 'E', '2026-10-15': 'E', '2026-10-16': 'E',
      '2026-10-19': 'E', '2026-10-20': 'E', '2026-10-21': 'E', '2026-10-22': 'E', '2026-10-23': 'E',
      '2026-10-26': 'E', '2026-10-27': 'E', '2026-10-28': 'E', '2026-10-29': 'E', '2026-10-30': 'E',
      '2026-11-04': 'N', '2026-11-05': 'N'
    }
  },
  {
    id: 'staff-quimey-hocking',
    name: 'Quimey Hocking',
    role: 'RN',
    fte: 1.0,
    section: 'RN',
    shifts: {
      '2026-10-12': 'N', '2026-10-13': 'N', '2026-10-15': 'M', '2026-10-16': 'M',
      '2026-10-19': 'ADO', '2026-10-20': 'M', '2026-10-21': 'M', '2026-10-22': 'M', '2026-10-23': 'M',
      '2026-10-26': 'M', '2026-10-27': 'M', '2026-10-28': 'M', '2026-10-29': 'M', '2026-10-30': 'M',
      '2026-11-02': 'M', '2026-11-03': 'M', '2026-11-04': 'M', '2026-11-05': 'M', '2026-11-06': 'M'
    }
  },
  {
    id: 'staff-gigi-innocent',
    name: 'Gigi Innocent',
    role: 'RN',
    fte: 1.0,
    section: 'RN',
    notes: 'SPLIT NIGHTS',
    shifts: {
      '2026-10-14': 'ADO', '2026-10-15': 'M', '2026-10-16': 'M', '2026-10-17': 'N', '2026-10-18': 'N',
      '2026-10-20': 'M', '2026-10-21': 'M', '2026-10-22': 'M', '2026-10-23': 'M',
      '2026-10-26': 'E', '2026-10-27': 'E', '2026-10-28': 'E', '2026-10-29': 'E',
      '2026-11-02': 'E', '2026-11-03': 'E', '2026-11-04': 'E', '2026-11-05': 'E'
    }
  },
  {
    id: 'staff-sushmita-rana-magar',
    name: 'Sushmita Rana Magar',
    role: 'RN',
    fte: 1.0,
    section: 'RN',
    shifts: {
      '2026-10-12': 'E', '2026-10-13': 'E', '2026-10-14': 'E', '2026-10-15': 'E', '2026-10-16': 'E',
      '2026-10-19': 'ADO', '2026-10-20': 'E', '2026-10-21': 'E', '2026-10-22': 'E', '2026-10-23': 'E',
      '2026-10-26': 'E', '2026-10-27': 'E', '2026-10-28': 'E', '2026-10-29': 'E', '2026-10-30': 'E',
      '2026-11-02': 'E', '2026-11-03': 'E', '2026-11-04': 'E', '2026-11-05': 'E', '2026-11-06': 'E'
    }
  },
  {
    id: 'staff-kalpana-neupane',
    name: 'Kalpana Neupane',
    role: 'RN',
    fte: 1.0,
    section: 'RN',
    notes: 'Split Nights',
    shifts: {
      '2026-10-12': 'M', '2026-10-13': 'M', '2026-10-14': 'N', '2026-10-15': 'N', '2026-10-17': 'ADO4',
      '2026-10-20': 'E', '2026-10-21': 'E', '2026-10-22': 'M', '2026-10-23': 'M',
      '2026-10-26': 'M', '2026-10-27': 'M', '2026-10-29': 'E', '2026-10-30': 'E',
      '2026-11-02': 'M', '2026-11-03': 'M', '2026-11-05': 'E', '2026-11-06': 'E'
    }
  },
  {
    id: 'staff-neelam-thapa',
    name: 'Neelam Thapa',
    role: 'RN',
    fte: 1.0,
    section: 'RN',
    notes: 'Split Nights (no late early)',
    shifts: {
      '2026-10-12': 'M', '2026-10-13': 'M', '2026-10-14': 'N', '2026-10-15': 'N', '2026-10-17': 'E',
      '2026-10-18': 'E', '2026-10-20': 'M', '2026-10-21': 'M', '2026-10-23': 'ADO',
      '2026-10-26': 'E', '2026-10-27': 'E', '2026-10-29': 'M', '2026-10-30': 'M',
      '2026-11-04': 'ADO', '2026-11-05': 'M', '2026-11-06': 'M'
    }
  },
  {
    id: 'staff-yashna-shrestha',
    name: 'Yashna Shrestha',
    role: 'RN',
    fte: 1.0,
    section: 'RN',
    shifts: {
      '2026-10-12': 'M', '2026-10-13': 'M', '2026-10-14': 'N', '2026-10-15': 'N',
      '2026-10-16': 'AL', '2026-10-17': 'AL', '2026-10-18': 'AL', '2026-10-19': 'AL', '2026-10-20': 'AL',
      '2026-10-21': 'AL', '2026-10-22': 'AL', '2026-10-23': 'AL', '2026-10-24': 'AL', '2026-10-25': 'AL',
      '2026-10-26': 'AL', '2026-10-28': 'ADO4', '2026-10-29': 'E', '2026-10-30': 'E', '2026-10-31': 'E',
      '2026-11-02': 'E', '2026-11-03': 'E', '2026-11-04': 'E'
    }
  },

  // 5. TSPRN / Transition Program
  {
    id: 'staff-matilda-aller',
    name: 'Matilda Aller',
    role: 'TSPRN',
    fte: 1.0,
    section: 'Registered Nurse Transition Program (TSPRN)',
    notes: '2nd rotation to 07/2/27',
    shifts: {
      '2026-10-12': 'M', '2026-10-13': 'M', '2026-10-14': 'M', '2026-10-15': 'M', '2026-10-16': 'N',
      '2026-10-17': 'N', '2026-10-20': 'SD', '2026-10-21': 'M', '2026-10-23': 'ADO',
      '2026-10-27': 'E', '2026-10-28': 'E', '2026-10-29': 'E',
      '2026-11-02': 'E', '2026-11-03': 'E', '2026-11-04': 'E', '2026-11-05': 'E'
    }
  },
  {
    id: 'staff-nitesh-shrestha',
    name: 'Nitesh Shrestha',
    role: 'TSPRN',
    fte: 1.0,
    section: 'Registered Nurse Transition Program (TSPRN)',
    notes: '7/2/27',
    shifts: {
      '2026-10-12': 'M', '2026-10-13': 'M', '2026-10-14': 'N', '2026-10-15': 'N',
      '2026-10-18': 'E', '2026-10-19': 'E', '2026-10-20': 'M', '2026-10-21': 'M',
      '2026-10-24': 'N', '2026-10-25': 'N', '2026-10-28': 'ADO', '2026-10-29': 'M', '2026-10-30': 'M',
      '2026-11-03': 'E', '2026-11-04': 'ADO', '2026-11-05': 'M', '2026-11-06': 'M'
    }
  },
  {
    id: 'staff-sabrina-thapa-magar',
    name: 'Sabrina Thapa Magar',
    role: 'TSPRN',
    fte: 1.0,
    section: 'Registered Nurse Transition Program (TSPRN)',
    notes: '7/2/27',
    shifts: {
      '2026-10-12': 'N', '2026-10-13': 'N', '2026-10-15': 'E', '2026-10-16': 'E',
      '2026-10-19': 'M', '2026-10-20': 'M', '2026-10-22': 'E', '2026-10-23': 'E',
      '2026-10-27': 'ADO', '2026-10-28': 'M', '2026-10-29': 'M',
      '2026-11-03': 'M', '2026-11-04': 'M', '2026-11-05': 'E', '2026-11-06': 'E'
    }
  },

  // 6. EENs
  {
    id: 'staff-shine-richardson',
    name: 'Shine Richardson',
    role: 'EEN',
    fte: 1.0,
    section: 'EEN',
    shifts: {
      '2026-10-12': 'E', '2026-10-13': 'M', '2026-10-14': 'M', '2026-10-15': 'N', '2026-10-16': 'N',
      '2026-10-19': 'M', '2026-10-20': 'E', '2026-10-22': 'M', '2026-10-23': 'M',
      '2026-10-26': 'M', '2026-10-27': 'M', '2026-10-28': 'ADO',
      '2026-11-02': 'M', '2026-11-03': 'M', '2026-11-05': 'E', '2026-11-06': 'E'
    }
  },
  {
    id: 'staff-aliyah-walker',
    name: 'Aliyah Walker',
    role: 'EEN',
    fte: 1.0,
    section: 'EEN',
    shifts: {
      '2026-10-12': 'OFF', '2026-10-13': 'ADO', '2026-10-14': 'M', '2026-10-15': 'M',
      '2026-10-17': 'E', '2026-10-18': 'N', '2026-10-20': 'N', '2026-10-21': 'N', '2026-10-22': 'ADO',
      '2026-10-25': 'M', '2026-10-26': 'M', '2026-10-27': 'M',
      '2026-11-02': 'N', '2026-11-03': 'N', '2026-11-04': 'N', '2026-11-05': 'N'
    }
  }
];

// Hospital Ward metadata
export const WARD_INFO = {
  hospitalName: "St. Vincent's Public Hospital",
  wardName: '9 North / GSS',
  periodTitle: '12th October - 8th November 2026',
  takeDownNotice: 'Ward 9 North Roster',
  totalBeds: 28,
  nurseLeadContact: 'Helen White (NUM) - Ext 4902'
};
