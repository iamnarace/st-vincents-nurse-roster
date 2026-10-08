import React, { useState } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  Copy, 
  MessageSquareShare,
  Check
} from 'lucide-react';
import { StaffMember, DayInfo, ShiftCode, SwapCandidate } from '../types/roster';
import { SHIFT_DEFINITIONS, WARD_INFO } from '../data/rosterData';
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

  // WhatsApp / SMS text generator
  const getSwapMessageText = (candidateName: string) => {
    return `Hi ${candidateName}, are you open to swapping your schedule on ${dayInfo.fullDayName} Oct ${dayInfo.dayNumber} for my ${currentShiftMeta.label} (${currentShift}, ${currentShiftMeta.time}) at St. Vincent's Ward 9 North? Let me know, thanks!`;
  };

  const handleCopyMessage = (candidate: SwapCandidate) => {
    const text = getSwapMessageText(candidate.staff.name);
    navigator.clipboard.writeText(text);
    setCopiedId(candidate.staff.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleWhatsAppDirect = (candidate: SwapCandidate) => {
    const text = encodeURIComponent(getSwapMessageText(candidate.staff.name));
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleInstantSwap = (candidate: SwapCandidate) => {
    onConfirmInstantSwap(staff.id, candidate.staff.id, dayInfo.dateStr);
    setSuccessMessage(`Shift successfully swapped with ${candidate.staff.name}! Roster updated in real-time.`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1500);
  };

  const handleSendAppRequest = (candidate: SwapCandidate) => {
    onSendSwapRequest(staff.id, candidate.staff.id, dayInfo.dateStr, 'WhatsApp/App Swap Request');
    setSuccessMessage(`Swap request logged and sent to ${candidate.staff.name}.`);
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <ArrowLeftRight className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Shift Swap Finder</h3>
              <p className="text-xs text-blue-100">
                Hospital Fatigue & Safe Work Filtered Coverage
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
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm border shadow-xs ${currentShiftMeta.badgeBg} ${currentShiftMeta.badgeText} ${currentShiftMeta.badgeBorder}`}
            >
              {currentShift}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{staff.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                  {staff.role}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{dayInfo.fullDayName}, Oct {dayInfo.dayNumber} 2026</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentShiftMeta.time}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 inline-block">
              {currentShiftMeta.label}
            </span>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="m-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Filter controls */}
        <div className="px-4 sm:px-5 pt-3 pb-1 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Available Colleagues:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {candidates.filter((c) => c.isEligible).length} Available
            </span>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 font-medium select-none">
            <input
              type="checkbox"
              checked={filterEligibleOnly}
              onChange={(e) => setFilterEligibleOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Available Only</span>
          </label>
        </div>

        {/* Candidates List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5 flex-1">
          {displayedCandidates.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No matching staff available</p>
              <p className="text-xs text-slate-500 mt-1">
                Colleagues are either rostered on active duty, on annual leave, or restricted by the 10-hour fatigue break policy.
              </p>
            </div>
          ) : (
            displayedCandidates.map((candidate) => {
              const candShiftDef = SHIFT_DEFINITIONS[candidate.currentShift] || SHIFT_DEFINITIONS.OFF;
              const isCopied = copiedId === candidate.staff.id;

              return (
                <div
                  key={candidate.staff.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    candidate.isEligible
                      ? 'bg-white border-slate-200/90 hover:border-blue-400 hover:shadow-md'
                      : 'bg-slate-50/70 border-slate-200/50 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 border ${candShiftDef.badgeBg} ${candShiftDef.badgeText} ${candShiftDef.badgeBorder}`}
                    >
                      {candidate.currentShift}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {candidate.staff.name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                          {candidate.staff.role}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 flex items-center gap-1 font-medium ${
                        candidate.isEligible ? 'text-emerald-700' : 'text-slate-500'
                      }`}>
                        {candidate.isEligible ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}
                        <span>{candidate.reason}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions for eligible staff */}
                  {candidate.isEligible && (
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                      {/* Copy WhatsApp text */}
                      <button
                        onClick={() => handleCopyMessage(candidate)}
                        className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center gap-1"
                        title="Copy pre-written message for WhatsApp / SMS"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copied' : 'Copy Text'}</span>
                      </button>

                      {/* Open WhatsApp Web / App */}
                      <button
                        onClick={() => handleWhatsAppDirect(candidate)}
                        className="p-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition"
                        title="Open in WhatsApp"
                      >
                        <MessageSquareShare className="w-4 h-4 text-emerald-600" />
                      </button>

                      {/* Instant test swap */}
                      <button
                        onClick={() => handleInstantSwap(candidate)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        title="Instantly swap this shift on the live roster"
                      >
                        <Zap className="w-3 h-3 fill-white" />
                        <span>Swap Now</span>
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
            <span>Hospital 10-Hour Fatigue Safe Compliance</span>
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
