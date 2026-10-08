import { StaffMember, DayInfo, ShiftCode } from '../types/roster';
import { SHIFT_DEFINITIONS, ROSTER_DAYS, WARD_INFO } from '../data/rosterData';

/**
 * Generates an iCalendar (.ics) string for a staff member's shifts.
 * Can be imported into Apple Calendar, Google Calendar, Outlook, etc.
 */
export function generateIcsCalendar(staff: StaffMember): string {
  const events: string[] = [];

  ROSTER_DAYS.forEach((day: DayInfo) => {
    const shiftCode: ShiftCode = staff.shifts[day.dateStr] || 'OFF';
    const meta = SHIFT_DEFINITIONS[shiftCode];

    // Only export active shifts or designated ADO/AL
    if (!meta || shiftCode === 'OFF') return;

    const [year, month, dayNum] = day.dateStr.split('-');
    const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const uid = `shift-${staff.id}-${day.dateStr}@stvincents.health`;

    let dtStart = '';
    let dtEnd = '';

    if (meta.category === 'Morning') {
      dtStart = `${year}${month}${dayNum}T070000`;
      dtEnd = `${year}${month}${dayNum}T153000`;
    } else if (meta.category === 'Evening') {
      dtStart = `${year}${month}${dayNum}T130000`;
      dtEnd = `${year}${month}${dayNum}T213000`;
    } else if (meta.category === 'Night') {
      dtStart = `${year}${month}${dayNum}T210000`;
      // Night ends the next morning
      const nextDate = new Date(`${year}-${month}-${dayNum}`);
      nextDate.setDate(nextDate.getDate() + 1);
      const nextY = nextDate.getFullYear();
      const nextM = String(nextDate.getMonth() + 1).padStart(2, '0');
      const nextD = String(nextDate.getDate()).padStart(2, '0');
      dtEnd = `${nextY}${nextM}${nextD}T073000`;
    } else if (meta.category === 'Day') {
      dtStart = `${year}${month}${dayNum}T080000`;
      dtEnd = `${year}${month}${dayNum}T163000`;
    } else {
      // Full day event for ADO or AL
      dtStart = `${year}${month}${dayNum}`;
      dtEnd = `${year}${month}${dayNum}`;
    }

    const isAllDay = meta.category === 'Leave' || meta.category === 'Off';

    events.push([
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtStamp}`,
      isAllDay ? `DTSTART;VALUE=DATE:${dtStart}` : `DTSTART:${dtStart}`,
      isAllDay ? `DTEND;VALUE=DATE:${dtEnd}` : `DTEND:${dtEnd}`,
      `SUMMARY:🏥 ${staff.name} - ${meta.label} (${shiftCode})`,
      `DESCRIPTION:Hospital Ward: ${WARD_INFO.wardName}\\nShift Code: ${shiftCode}\\nTimings: ${meta.time}\\nNurse: ${staff.name} (${staff.role})`,
      `LOCATION:${WARD_INFO.hospitalName}, ${WARD_INFO.wardName}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    ].join('\r\n'));
  });

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//St Vincents Hospital//Ward 9 North Nurse Roster//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:St. Vincent's Shifts - ${staff.name}`,
    'X-WR-TIMEZONE:Australia/Sydney',
    ...events,
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Triggers a download of the .ics file directly in browser.
 */
export function downloadIcsFile(staff: StaffMember) {
  const icsData = generateIcsCalendar(staff);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${staff.name.replace(/\s+/g, '_')}_Shifts_OctNov2026.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
