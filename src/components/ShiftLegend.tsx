import React from 'react';
import { X, Clock, AlertCircle } from 'lucide-react';
import { SHIFT_DEFINITIONS } from '../data/rosterData';
import { ShiftCode } from '../types/roster';

interface ShiftLegendProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShiftLegend: React.FC<ShiftLegendProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const categories = [
    { name: 'Morning Shifts', codes: ['M', 'M1', 'MI', 'M10'] as ShiftCode[] },
    { name: 'Evening Shifts', codes: ['E', 'E1', 'EI', 'E6', 'E10'] as ShiftCode[] },
    { name: 'Night Duty Shifts', codes: ['N', 'N1', 'NI'] as ShiftCode[] },
    { name: 'Management & Study', codes: ['D', 'SD'] as ShiftCode[] },
    { name: 'Leave & Days Off', codes: ['AL', 'AL6', 'ADO', 'ADO4', 'ADO6', 'ADO10', 'OFF'] as ShiftCode[] }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Hospital Shift Legend & Color Codes</h3>
            <p className="text-xs text-slate-500">Official Ward 9 North / GSS shift specifications & work hours</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {categories.map((cat) => (
            <div key={cat.name}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                {cat.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cat.codes.map((code) => {
                  const meta = SHIFT_DEFINITIONS[code];
                  if (!meta) return null;
                  return (
                    <div
                      key={code}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 flex items-center gap-3 transition"
                    >
                      <span
                        className={`w-12 h-9 flex items-center justify-center rounded-lg font-black text-xs border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder} shrink-0`}
                      >
                        {meta.code}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-800 truncate">{meta.label}</p>
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{meta.time}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Info Banner */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Hospital Fatigue & Safe Work Policies</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Staff finishing a Night Duty shift (07:30) cannot be rostered onto a Morning shift on that same or following morning. Minimum 10–12 hours mandatory rest applies between rotational shifts.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
