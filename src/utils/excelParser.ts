import * as XLSX from 'xlsx';
import { StaffMember, ShiftCode, DayInfo } from '../types/roster';
import { ROSTER_DAYS } from '../data/rosterData';

export interface ParseResult {
  staffMembers: StaffMember[];
  errors: string[];
}

/**
 * Parses uploaded Excel / CSV spreadsheet into StaffMember list.
 */
export async function parseRosterFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to json 2D array
        const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        
        if (!rows || rows.length < 5) {
          resolve({ staffMembers: [], errors: ['File does not contain sufficient roster rows.'] });
          return;
        }

        const newStaffList: StaffMember[] = [];
        const errors: string[] = [];

        // Scan for header row containing dates or day numbers
        let dateRowIndex = -1;
        for (let r = 0; r < Math.min(rows.length, 10); r++) {
          const rowStr = rows[r].join(' ');
          if (rowStr.includes('12') && rowStr.includes('13') && rowStr.includes('14')) {
            dateRowIndex = r;
            break;
          }
        }

        // Parse staff rows
        const startRow = dateRowIndex !== -1 ? dateRowIndex + 1 : 4;

        for (let r = startRow; r < rows.length; r++) {
          const row = rows[r];
          if (!row || row.length === 0) continue;

          const rawName = String(row[0] || '').trim();
          if (!rawName || rawName.toLowerCase().includes('team') || rawName.toLowerCase().includes('lead')) {
            continue;
          }

          const rawFte = parseFloat(String(row[1] || '1.0')) || 1.0;
          const rawRole = String(row[2] || 'RN').trim() || 'RN';

          const shifts: Record<string, ShiftCode> = {};
          // Assign shifts to standard ROSTER_DAYS by index
          ROSTER_DAYS.forEach((day: DayInfo, index: number) => {
            const colIndex = 3 + index;
            const cellValue = String(row[colIndex] || '').trim().toUpperCase();
            if (cellValue) {
              shifts[day.dateStr] = (cellValue as ShiftCode) || 'OFF';
            } else {
              shifts[day.dateStr] = 'OFF';
            }
          });

          newStaffList.push({
            id: `imported-${r}-${rawName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            name: rawName,
            role: rawRole,
            fte: rawFte,
            section: rawRole.includes('NUM') || rawRole.includes('CSO') ? 'Management' : 'RN',
            shifts
          });
        }

        if (newStaffList.length === 0) {
          errors.push('No valid staff roster rows could be automatically parsed. Please ensure staff names are in column A.');
        }

        resolve({ staffMembers: newStaffList, errors });
      } catch (err: any) {
        resolve({ staffMembers: [], errors: [`Failed to parse spreadsheet: ${err.message || err}`] });
      }
    };

    reader.onerror = () => {
      resolve({ staffMembers: [], errors: ['Error reading file.'] });
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Exports current active roster to Excel (.xlsx) file.
 */
export function exportRosterToExcel(staffList: StaffMember[], fileName = 'St_Vincents_9North_Roster.xlsx') {
  const header = ['Staff Name', 'FTE', 'Role', ...ROSTER_DAYS.map((d: DayInfo) => `${d.dayName} ${d.dayNumber}`)];
  const rows = staffList.map(staff => {
    return [
      staff.name,
      staff.fte,
      staff.role,
      ...ROSTER_DAYS.map((d: DayInfo) => staff.shifts[d.dateStr] || 'OFF')
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Ward 9 North Roster');
  XLSX.writeFile(wb, fileName);
}
