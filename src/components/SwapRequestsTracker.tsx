import React from 'react';
import { Clock, CheckCircle2, ArrowLeftRight, User, Trash2 } from 'lucide-react';
import { SwapRequest, StaffMember } from '../types/roster';

interface SwapRequestsTrackerProps {
  requests: SwapRequest[];
  staffMembers: StaffMember[];
  onRemoveRequest: (id: string) => void;
}

export const SwapRequestsTracker: React.FC<SwapRequestsTrackerProps> = ({
  requests,
  staffMembers,
  onRemoveRequest,
}) => {
  if (requests.length === 0) return null;

  const getStaffName = (id: string) => {
    return staffMembers.find((s) => s.id === id)?.name || id;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-blue-600" />
          <span>Active Shift Swap Requests ({requests.length})</span>
        </h3>
        <span className="text-[11px] text-slate-500 font-medium">Auto-synced with ward roster</span>
      </div>

      <div className="space-y-2">
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <span>{getStaffName(req.fromStaffId)}</span>
                  <span className="text-slate-400">➔</span>
                  <span>{getStaffName(req.toStaffId)}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Date: <b className="text-slate-700">{req.dateStr}</b> • Shift: <span className="font-mono font-bold text-blue-600">{req.originalShift}</span> • Note: {req.notes || 'No note'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <CheckCircle2 className="w-3 h-3 text-amber-600" />
                <span>{req.status.toUpperCase()}</span>
              </span>
              <button
                onClick={() => onRemoveRequest(req.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition hover:bg-slate-200"
                title="Cancel Request"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
