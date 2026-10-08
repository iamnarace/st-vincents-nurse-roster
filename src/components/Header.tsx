import React from 'react';
import { 
  Calendar, 
  TableProperties, 
  FileSpreadsheet, 
  Download, 
  Info,
  CalendarCheck,
  UserCheck
} from 'lucide-react';
import { WARD_INFO } from '../data/rosterData';
import { StaffMember } from '../types/roster';

interface HeaderProps {
  activeTab: 'personal' | 'master';
  setActiveTab: (tab: 'personal' | 'master') => void;
  selectedStaff: StaffMember;
  onSelectStaff: (id: string) => void;
  wifeStaffId: string;
  onOpenLegend: () => void;
  onOpenUpload: () => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedStaff,
  onSelectStaff,
  wifeStaffId,
  onOpenLegend,
  onOpenUpload,
  onExport,
}) => {
  const isRichaActive = selectedStaff.id === wifeStaffId;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Ward Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <CalendarCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                {WARD_INFO.hospitalName}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Ward {WARD_INFO.wardName}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Period: <span className="font-semibold text-slate-700">{WARD_INFO.periodTitle}</span>
            </p>
          </div>
        </div>

        {/* Center / Right: Dynamic Current User Status + Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Currently Viewing Pill */}
          {activeTab === 'personal' && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <span className="text-slate-400 font-normal">Active:</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                {selectedStaff.name}
                {isRichaActive && <span>❤️</span>}
              </span>
            </div>
          )}

          {/* Jump to Richa Shortcut button (if someone else is currently chosen) */}
          {!isRichaActive && (
            <button
              onClick={() => {
                onSelectStaff(wifeStaffId);
                setActiveTab('personal');
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition shadow-2xs"
              title="Switch back to Richa Budhathoki"
            >
              <span>Back to Richa ❤️</span>
            </button>
          )}

          {/* View Mode Toggle Switch */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'personal'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Personal View</span>
            </button>
            <button
              onClick={() => setActiveTab('master')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                activeTab === 'master'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Ward Master</span>
            </button>
          </div>

          {/* Utility Tools */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenLegend}
              className="p-2 text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-xl transition"
              title="Shift Color Legend"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition"
              title="Upload New Excel/CSV Roster"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={onExport}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition"
              title="Export Current Roster to Excel"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
