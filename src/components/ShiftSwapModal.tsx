import React, { useState, useMemo } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Copy, 
  MessageSquareShare, 
  Check, 
  User, 
  MessageCircle,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { StaffMember, DayInfo, ShiftCode, SwapCandidate } from '../types/roster';
import { SHIFT_DEFINITIONS } from '../data/rosterData';
import { analyzeSwapEligibility } from '../utils/swapEngine';

interface ShiftSwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember;
  dayInfo: DayInfo;
  currentShift: ShiftCode;
  allStaff: StaffMember[];
  onConfirmInstantSwap: (fromStaffId: string, toStaffId: string, dateStr: string) => void;
  onSendSwapRequest: (fromStaffId: string, toStaffId: string, dateStr: string, note: string) => void;
}

export const ShiftSwapModal: React.FC<ShiftSwapModalProps> = ({
  isOpen,
  onClose,
  staff,
  dayInfo,
  currentShift,
  allStaff,
  onConfirmInstantSwap,
  onSendSwapRequest,
}) => {
  const [filterTab, setFilterTab] = useState<'can_do' | 'conflicts' | 'mutual' | 'all'>('can_do');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Run comprehensive swap analysis with exact fatigue and turnaround rules
  const analysis = useMemo(() => {
    return analyzeSwapEligibility(staff, dayInfo.dateStr, currentShift, allStaff);
  }, [staff, dayInfo.dateStr, currentShift, allStaff]);

  const { totalOff, canDoShift, fatigueConflictCount, mutualDutyCount, candidates } = analysis;

  const currentShiftMeta = SHIFT_DEFINITIONS[currentShift] || SHIFT_DEFINITIONS.OFF;
  const monthName = dayInfo.dateStr.startsWith('2026-11') ? 'Nov' : 'Oct';

  // Filter candidates based on selected tab
  const filteredCandidates = useMemo(() => {
    switch (filterTab) {
      case 'can_do':
        return candidates.filter((c) => c.category === 'available_off');
      case 'conflicts':
        return candidates.filter((c) => c.category === 'fatigue_conflict');
      case 'mutual':
        return candidates.filter((c) => c.category === 'mutual_duty');
      case 'all':
      default:
        return candidates;
    }
  }, [candidates, filterTab]);

  // Exact WhatsApp pre-filled text
  const getWireframeText = (candidateName: string) => {
    return `Hi ${candidateName}, I noticed you're off this ${dayInfo.fullDayName}, ${monthName} ${dayInfo.dayNumber}. Would you be open to swapping shifts with me for my ${currentShiftMeta.label} (${currentShift})?`;
  };

  const handleTextToSwap = (candidate: SwapCandidate) => {
    const text = getWireframeText(candidate.staff.name);
    
    // Copy to clipboard
    navigator.clipboard.writeText(text);
    setCopiedId(candidate.staff.id);

    // Open WhatsApp
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');

    onSendSwapRequest(staff.id, candidate.staff.id, dayInfo.dateStr, 'WhatsApp Shift Swap Request');
    setSuccessMessage(`WhatsApp opened & text copied for ${candidate.staff.name}!`);
    setTimeout(() => {
      setCopiedId(null);
      setSuccessMessage(null);
    }, 3000);
  };

  const handleInstantSwap = (candidate: SwapCandidate) => {
    onConfirmInstantSwap(staff.id, candidate.staff.id, dayInfo.dateStr);
    setSuccessMessage(`Shift swapped with ${candidate.staff.name}! Schedule updated.`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-700 via-sky-700 to-indigo-800 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md">
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">Shift Swap Matcher</h3>
              <p className="text-xs text-blue-100">
                Hospital Fatigue & Safe Turnaround Compliance
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Shift Target Info */}
        <div className="p-4 bg-slate-50 border-b border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-900">
                Swap Request: {dayInfo.fullDayName.slice(0, 3)}, {monthName} {dayInfo.dayNumber} ({currentShiftMeta.label})
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {staff.name} • Shift Code: <b className="text-slate-800">{currentShift}</b> ({currentShiftMeta.time})
              </p>
            </div>
            <span className={`px-3 py-1 rounded-xl text-xs font-black border shadow-2xs ${currentShiftMeta.badgeBg} ${currentShiftMeta.badgeText} ${currentShiftMeta.badgeBorder}`}>
              {currentShift}
            </span>
          </div>

          {/* EXACT METRICS AS REQUESTED:
              - How many OFF
              - How many can do shift if swapped
              - How many cannot (turnaround conflict, e.g. night today can't do morning tomorrow)
          */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-2">
              <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">
                Off / ADO Today
              </span>
              <span className="text-lg font-black text-sky-950">
                {totalOff}
              </span>
              <span className="text-[10px] text-sky-600 block">Colleagues</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-2 ring-1 ring-emerald-400/50 shadow-2xs">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Can Do Shift
              </span>
              <span className="text-lg font-black text-emerald-950">
                {canDoShift}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold block">Fully Rested</span>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-2">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                Fatigue Blocked
              </span>
              <span className="text-lg font-black text-rose-950">
                {fatigueConflictCount}
              </span>
              <span className="text-[10px] text-rose-600 block">Turnaround Rule</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
            <button
              onClick={() => setFilterTab('can_do')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                filterTab === 'can_do'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Can Do Shift ({canDoShift})</span>
            </button>

            <button
              onClick={() => setFilterTab('conflicts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                filterTab === 'conflicts'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Fatigue Conflicts ({fatigueConflictCount})</span>
            </button>

            {mutualDutyCount > 0 && (
              <button
                onClick={() => setFilterTab('mutual')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                  filterTab === 'mutual'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Mutual Swaps ({mutualDutyCount})</span>
              </button>
            )}

            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                filterTab === 'all'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Colleagues ({candidates.length})
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="m-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Candidates List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1 divide-y divide-slate-100">
          {filteredCandidates.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No staff matching this filter</p>
              <p className="text-xs text-slate-500 mt-1">
                Select another filter tab above to view eligible colleagues or turnaround conflicts.
              </p>
            </div>
          ) : (
            filteredCandidates.map((candidate) => {
              const isCopied = copiedId === candidate.staff.id;
              const isCanDo = candidate.category === 'available_off';
              const isConflict = candidate.category === 'fatigue_conflict';
              const isMutual = candidate.category === 'mutual_duty';

              return (
                <div
                  key={candidate.staff.id}
                  className={`pt-2.5 first:pt-0 p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCanDo
                      ? 'bg-emerald-50/20 border-emerald-200/80 hover:border-emerald-400 hover:shadow-xs'
                      : isConflict
                        ? 'bg-rose-50/20 border-rose-200/60'
                        : isMutual
                          ? 'bg-blue-50/20 border-blue-200/80'
                          : 'bg-slate-50/50 border-slate-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      isCanDo 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : isConflict 
                          ? 'bg-rose-100 text-rose-800' 
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isCanDo ? '✅' : isConflict ? '⚠️' : '🔄'}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {candidate.staff.name}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                          Status: {candidate.currentShift === 'OFF' ? 'OFF' : candidate.currentShift}
                        </span>
                        {isCanDo && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Available to Swap
                          </span>
                        )}
                        {isConflict && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                            Turnaround Conflict
                          </span>
                        )}
                      </div>

                      {/* Explicit Fatigue Rationale */}
                      <p className={`text-xs font-medium ${
                        isCanDo ? 'text-emerald-700' : isConflict ? 'text-rose-700' : 'text-blue-700'
                      }`}>
                        {candidate.reason}
                      </p>
                    </div>
                  </div>

                  {/* Actions for eligible colleagues */}
                  {candidate.isEligible && (
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleTextToSwap(candidate)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                        title="Open WhatsApp with pre-filled swap text"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>{isCopied ? 'Copied & Sent' : '💬 Text to Swap'}</span>
                      </button>

                      <button
                        onClick={() => handleInstantSwap(candidate)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                        title="Simulate immediate shift swap"
                      >
                        <Zap className="w-3 h-3 text-blue-600 fill-blue-600" />
                        <span>Swap</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Hospital Fatigue Policy: Safe Rest Periods Enforced</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
