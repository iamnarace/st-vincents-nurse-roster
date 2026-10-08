import React, { useState } from 'react';
import { Search, Heart, User, Sparkles } from 'lucide-react';
import { StaffMember } from '../types/roster';

interface StaffSelectorProps {
  staffMembers: StaffMember[];
  selectedStaffId: string;
  onSelectStaff: (id: string) => void;
  wifeStaffId: string;
}

export const StaffSelector: React.FC<StaffSelectorProps> = ({
  staffMembers,
  selectedStaffId,
  onSelectStaff,
  wifeStaffId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = staffMembers.filter((s) => {
    const q = searchTerm.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.section.toLowerCase().includes(q);
  });

  const selectedStaff = staffMembers.find((s) => s.id === selectedStaffId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>Select Staff Member</span>
          </h2>
          <p className="text-xs text-slate-500">
            Switch between nurses to see their personal shift schedule and request swaps
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search nurse or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Staff Grid/Pills */}
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
        {filteredStaff.map((staff) => {
          const isSelected = staff.id === selectedStaffId;
          const isWife = staff.id === wifeStaffId;

          return (
            <button
              key={staff.id}
              onClick={() => onSelectStaff(staff.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-[1.02]'
                  : isWife
                  ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : isWife
                    ? 'bg-rose-200 text-rose-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {staff.name.charAt(0)}
              </div>
              <span className="font-semibold">{staff.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {staff.role}
              </span>
              {isWife && <Heart className={`w-3 h-3 fill-rose-500 ${isSelected ? 'text-white fill-white' : 'text-rose-500'}`} />}
            </button>
          );
        })}
      </div>

      {/* Active Selection Banner */}
      {selectedStaff && (
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Currently Viewing:</span>
            <span className="font-bold text-slate-900">{selectedStaff.name}</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200 text-[10px]">
              {selectedStaff.role} • FTE: {selectedStaff.fte}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">{selectedStaff.section}</span>
          </div>
          {selectedStaff.notes && (
            <div className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-[11px] font-medium">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{selectedStaff.notes}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
