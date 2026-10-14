import { useCallback, useEffect, useState } from 'react';

export const LEVELS = [
  'RN Year 1',
  'RN Year 2',
  'RN Year 3',
  'RN Year 4',
  'RN Year 5',
  'RN Year 6',
  'RN Year 7',
  'RN Year 8',
  'Clinical Nurse Specialist',
  'Clinical Nurse Educator',
  'Nurse Unit Manager',
  'EEN',
  'TSPRN',
  'Pathways to Practice RN',
] as const;

export interface Progression {
  level: string; // '' until chosen
  baseHours: number; // hours already completed up to `asOf`
  asOf: string; // YYYY-MM-DD: hours entered include everything up to the end of this day
  target: number; // hours needed for the next level
  includeLeave: boolean; // count paid leave / ADO as hours
}

export const DEFAULT_TARGET = 1824;

const KEY = 'st_vincents_progression_v1';

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const defaultProgression = (): Progression => ({
  level: '',
  baseHours: 0,
  asOf: todayKey(),
  target: DEFAULT_TARGET,
  includeLeave: true,
});

const load = (): Record<string, Progression> => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
};

export const nextLevel = (level: string): string | null => {
  const i = LEVELS.indexOf(level as (typeof LEVELS)[number]);
  if (i < 0 || i >= 7) return null; // only RN Year 1..7 have an obvious next step
  return LEVELS[i + 1];
};

/** Per-person progression settings, stored on this device only. */
export function useProgression(staffId: string) {
  const [all, setAll] = useState<Record<string, Progression>>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(all));
    } catch {
      /* storage unavailable */
    }
  }, [all]);

  const value = all[staffId] || defaultProgression();
  const configured = !!all[staffId];
  const save = useCallback(
    (next: Progression) => setAll((prev) => ({ ...prev, [staffId]: next })),
    [staffId]
  );
  return { value, configured, save };
}
