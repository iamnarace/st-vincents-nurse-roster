import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Search, X, Check, Link2, Users } from 'lucide-react';
import { StaffMember, ShiftCode } from '../types/roster';
import { SHIFT_DEFINITIONS } from '../data/rosterData';

interface StaffSelectorProps {
  staffMembers: StaffMember[];
  selectedStaffId: string;
  onSelectStaff: (id: string) => void;
  homeStaffId: string;
}

const todayKey = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');

const ShiftChip: React.FC<{ code: ShiftCode }> = ({ code }) => {
  const def = SHIFT_DEFINITIONS[code] || SHIFT_DEFINITIONS.OFF;
  return (
    <span
      className={`shrink-0 px-1.5 py-0.5 rounded-md border text-[10px] font-extrabold ${def.badgeBg} ${def.badgeText} ${def.badgeBorder}`}
      title={`Today: ${def.label}`}
    >
      {code}
    </span>
  );
};

export const StaffSelector: React.FC<StaffSelectorProps> = ({
  staffMembers,
  selectedStaffId,
  onSelectStaff,
  homeStaffId,
}) => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const today = todayKey();
  const current = staffMembers.find((s) => s.id === selectedStaffId) || staffMembers[0];
  const isHome = current?.id === homeStaffId;
  const open = focused;

  // Results: home nurse pinned first, then alphabetical. Matches name, role or section.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = staffMembers.filter((s) => {
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.section.toLowerCase().includes(q)
      );
    });
    return [...matches].sort((a, b) => {
      if (a.id === homeStaffId) return -1;
      if (b.id === homeStaffId) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [staffMembers, query, homeStaffId]);

  useEffect(() => setHighlight(0), [query, open]);

  // Close when tapping/clicking anywhere outside the picker
  useEffect(() => {
    const handler = (e: Event) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, []);

  const choose = (id: string) => {
    onSelectStaff(id);
    setQuery('');
    setFocused(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocused(true);
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[highlight]) choose(results[highlight].id);
    } else if (e.key === 'Escape') {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}?staff=${encodeURIComponent(
      current.id
    )}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this personal link:', url);
    }
  };

  if (!current) return null;

  return (
    <section
      ref={wrapRef}
      aria-label="Choose whose roster to view"
      className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-5"
    >
      {/* Who is being viewed */}
      <div className="flex items-center gap-3.5">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-sm shrink-0 ${
            isHome
              ? 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white ring-4 ring-rose-100'
              : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white'
          }`}
        >
          {isHome ? '❤️' : initials(current.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Roster for
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight truncate">
            {current.name} {isHome && <span className="text-sm">❤️</span>}
          </h2>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
              {current.role}
            </span>
            <span>FTE {current.fte}</span>
            <span className="truncate">{current.section}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={copyLink}
          className="shrink-0 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 transition"
          title="Copy a personal link to this roster"
          aria-label="Copy a personal link to this roster"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Search: results render inline so nothing can be hidden behind other cards */}
      <div className="mt-4">
        <label htmlFor="staff-search" className="sr-only">
          Find a colleague by name
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="staff-search"
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls="staff-results"
            aria-autocomplete="list"
            autoComplete="off"
            enterKeyHint="go"
            placeholder="Search your name or a colleague…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFocused(true);
            }}
            onFocus={() => setFocused(true)}
            onKeyDown={onKeyDown}
            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-2xl pl-10 pr-10 py-3 text-base sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15"
          />
          {(query || open) && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFocused(false);
                inputRef.current?.blur();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {open && (
          <div className="mt-2 rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              {results.length} {results.length === 1 ? 'colleague' : 'colleagues'} · today’s shift
            </div>
            <ul
              id="staff-results"
              role="listbox"
              aria-label="Staff"
              className="max-h-[50vh] overflow-y-auto overscroll-contain divide-y divide-slate-100"
            >
              {results.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-slate-500">
                  No one matches “{query}”. Try a first name or surname.
                </li>
              )}
              {results.map((s, i) => {
                const selected = s.id === current.id;
                const isHomeRow = s.id === homeStaffId;
                const code = (s.shifts[today] || 'OFF') as ShiftCode;
                return (
                  <li
                    key={s.id}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => choose(s.id)}
                    className={`flex items-center gap-3 px-3.5 py-3 cursor-pointer min-h-[56px] ${
                      i === highlight ? 'bg-blue-50' : 'bg-white'
                    } ${isHomeRow ? 'bg-rose-50/70' : ''}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isHomeRow ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isHomeRow ? '❤️' : initials(s.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {s.name} {isHomeRow && '❤️'}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {s.role} · {s.section}
                      </div>
                    </div>
                    <ShiftChip code={code} />
                    {selected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
