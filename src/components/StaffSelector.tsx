import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  User, 
  ChevronDown, 
  Check, 
  Sparkles,
  Shield,
  Stethoscope,
  X
} from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentStaff = staffMembers.find((s) => s.id === selectedStaffId) || staffMembers[0];
  const wifeStaff = staffMembers.find((s) => s.id === wifeStaffId);
  const isWifeSelected = selectedStaffId === wifeStaffId;

  // Filtered staff members for the search dropdown
  const filteredStaff = staffMembers.filter((s) => {
    const q = searchTerm.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.section.toLowerCase().includes(q);
  });

  const handleSelect = (id: string) => {
    onSelectStaff(id);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5 relative" ref={dropdownRef}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left: Active Staff Info Card */}
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-sm transition-transform ${
            isWifeSelected
              ? 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-rose-500/25 ring-4 ring-rose-100 scale-105'
              : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/20'
          }`}>
            {isWifeSelected ? (
              <Heart className="w-6 h-6 fill-white text-white animate-pulse" />
            ) : (
              currentStaff.name.charAt(0)
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {currentStaff.name}
              </h2>
              {isWifeSelected && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-700 border border-rose-200 shadow-2xs">
                  <Sparkles className="w-3 h-3 text-rose-500" />
                  Richa (Wife)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
              <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                {currentStaff.role}
              </span>
              <span>•</span>
              <span>FTE {currentStaff.fte}</span>
              <span>•</span>
              <span className="text-slate-600">{currentStaff.section}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Switch to Richa + Search & Select Dropdown Trigger */}
        <div className="flex items-center gap-2.5 self-start sm:self-center w-full sm:w-auto">
          {/* Quick 1-click Return to Richa if someone else is selected */}
          {!isWifeSelected && wifeStaff && (
            <button
              onClick={() => onSelectStaff(wifeStaffId)}
              className="px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs shrink-0"
              title="Return to Richa Budhathoki's personal roster"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Richa's Roster</span>
            </button>
          )}

          {/* Sleek Combobox Trigger Button */}
          <div className="relative w-full sm:w-72">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-800 rounded-2xl px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between gap-2 transition shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  {isOpen ? 'Search nurse...' : 'Change Nurse / View Colleague'}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Modal */}
            {isOpen && (
              <div className="absolute right-0 top-full mt-2 w-full sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-2.5 space-y-2 animate-in fade-in zoom-in-95">
                {/* Search Bar inside Dropdown */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search nurse or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-8 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Pinned Top Card: Richa Budhathoki (Wife) */}
                {wifeStaff && (!searchTerm || wifeStaff.name.toLowerCase().includes(searchTerm.toLowerCase())) && (
                  <div className="pt-1">
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider px-2 mb-1">
                      Priority Profile
                    </p>
                    <button
                      onClick={() => handleSelect(wifeStaff.id)}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition ${
                        selectedStaffId === wifeStaff.id
                          ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-2xs font-bold'
                          : 'bg-rose-50/50 hover:bg-rose-50 border-rose-200/80 text-rose-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                          <Heart className="w-3.5 h-3.5 fill-white text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold flex items-center gap-1.5">
                            <span>{wifeStaff.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-200/80 text-rose-800">
                              Wife
                            </span>
                          </div>
                          <span className="text-[10px] text-rose-600">{wifeStaff.role} • FTE {wifeStaff.fte}</span>
                        </div>
                      </div>
                      {selectedStaffId === wifeStaff.id && (
                        <Check className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  </div>
                )}

                {/* Rest of Staff List */}
                <div className="pt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                    Ward Colleagues ({filteredStaff.filter((s) => s.id !== wifeStaffId).length})
                  </p>
                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                    {filteredStaff
                      .filter((s) => s.id !== wifeStaffId)
                      .map((staff) => {
                        const isSelected = selectedStaffId === staff.id;

                        return (
                          <button
                            key={staff.id}
                            onClick={() => handleSelect(staff.id)}
                            className={`w-full p-2 rounded-xl text-left flex items-center justify-between text-xs transition ${
                              isSelected
                                ? 'bg-blue-50 text-blue-900 font-bold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                                {staff.name.charAt(0)}
                              </div>
                              <div className="truncate">
                                <span className="font-semibold block truncate">{staff.name}</span>
                                <span className="text-[10px] text-slate-400 font-normal">
                                  {staff.role} • {staff.section}
                                </span>
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
