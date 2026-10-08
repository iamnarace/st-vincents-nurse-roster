import React, { useState } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Copy, 
  MessageSquareShare,
  Check,
  User,
  MessageCircle
} from 'lucide-react';
import { StaffMember, DayInfo, ShiftCode, SwapCandidate } from '../types/roster';
import { SHIFT_DEFINITIONS } from '../data/rosterData';
import { findSwapCandidates } from '../utils/swapEngine';

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
  const [filterEligibleOnly, setFilterEligibleOnly] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const candidates: SwapCandidate[] = findSwapCandidates(staff, dayInfo.dateStr, currentShift, allStaff);
  const displayedCandidates = filterEligibleOnly ? candidates.filter((c) => c.isEligible) : candidates;

  const currentShiftMeta = SHIFT_DEFINITIONS[currentShift] || SHIFT_DEFINITIONS.OFF;

  // Exact WhatsApp text requested in the user's wireframe
  const getWireframeText = (candidateName: string) => {
    return `Hi ${candidateName}, I noticed you're off this ${dayInfo.fullDayName}, Oct ${dayInfo.dayNumber}. Would you be open to swapping shifts with me?`;
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
    setSuccessMessage(`WhatsApp opened & message copied for ${candidate.staff.name}!`);
    setTimeout(() => {
      setCopiedId(null);
      setSuccessMessage(null);
    }, 3000);
  };

  const handleInstantSwap = (candidate: SwapCandidate) => {
    onConfirmInstantSwap(staff.id, candidate.staff.id, dayInfo.dateStr);
    setSuccessMessage(`Shift instantly swapped with ${candidate.staff.name}! Schedule updated.`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header (Pop-Up Screen: Shift Swap Matcher) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-700 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-md">
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Shift Swap Matcher</h3>
              <p className="text-xs text-blue-100">
                Ward 9 North Safe Turnaround Matching
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

        {/* Selected Shift Target Info: Swap Request: Sat, Oct 17 (Night Shift) */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm sm:text-base font-black text-slate-900">
                Swap Request: {dayInfo.fullDayName.slice(0, 3)}, Oct {dayInfo.dayNumber} ({currentShiftMeta.label})
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {staff.name} • Shift Code: <span className="font-bold text-slate-700">{currentShift}</span> ({currentShiftMeta.time})
              </p>
            </div>
            <span className={`px-2.5 py-1 rounded-xl text-xs font-black border shadow-2xs ${currentShiftMeta.badgeBg} ${currentShiftMeta.badgeText} ${currentShiftMeta.badgeBorder}`}>
              {currentShift}
            </span>
          </div>

          <p className="text-xs text-slate-600 pt-1">
            *The following staff are marked <b>OFF</b> or <b>ADO</b> and have no safety turnaround conflicts:*
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="m-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Colleagues List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
          {displayedCandidates.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No matching staff available</p>
              <p className="text-xs text-slate-500 mt-1">
                All colleagues are either rostered on active duty, on annual leave, or restricted by the 10-hour rest break policy.
              </p>
            </div>
          ) : (
            displayedCandidates.map((candidate) => {
              const isCopied = copiedId === candidate.staff.id;
              const isOff = ['OFF', 'ADO', 'ADO4', 'ADO6', 'ADO10'].includes(candidate.currentShift);

              return (
                <div
                  key={candidate.staff.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    candidate.isEligible
                      ? 'bg-white border-slate-200/90 hover:border-blue-400 hover:shadow-sm'
                      : 'bg-slate-50/70 border-slate-200/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
                      👤
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {candidate.staff.name}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                          Status: {candidate.currentShift === 'OFF' ? 'OFF' : candidate.currentShift}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 font-medium mt-0.5">
                        {candidate.reason}
                      </p>
                    </div>
                  </div>

                  {/* Action: [ 💬 Text to Swap ] */}
                  {candidate.isEligible && (
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => handleTextToSwap(candidate)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                        title="Open WhatsApp with pre-filled message"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>{isCopied ? 'Copied & Opened' : '💬 Text to Swap'}</span>
                      </button>

                      <button
                        onClick={() => handleInstantSwap(candidate)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                        title="Instant test swap in local schedule"
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
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>10-Hour Fatigue Safe Compliance</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
