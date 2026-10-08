import React from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  TableProperties, 
  FileSpreadsheet, 
  Download, 
  Info,
  Heart,
  Hospital
} from 'lucide-react';
import { WARD_INFO } from '../data/rosterData';

interface HeaderProps {
  activeTab: 'personal' | 'master';
  setActiveTab: (tab: 'personal' | 'master') => void;
  selectedStaffId: string;
  onSelectStaff: (id: string) => void;
  wifeStaffId: string;
  onOpenLegend: () => void;
  onOpenUpload: () => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedStaffId,
  onSelectStaff,
  wifeStaffId,
  onOpenLegend,
  onOpenUpload,
  onExport,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Hospital Branding */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-sky-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Hospital className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                {WARD_INFO.hospitalName}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <ShieldCheck className="w-3 h-3 mr-1" /> Public Health
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <span className="font-semibold text-slate-700">Ward: {WARD_INFO.wardName}</span>
              <span>•</span>
              <span>Period: {WARD_INFO.periodTitle}</span>
            </p>
          </div>
        </div>

        {/* Center / Right: Tabs & Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Quick Wife Button */}
          <button
            onClick={() => {
              onSelectStaff(wifeStaffId);
              setActiveTab('personal');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
              selectedStaffId === wifeStaffId && activeTab === 'personal'
                ? 'bg-rose-500 text-white ring-2 ring-rose-300'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
            title="Jump directly to Barsha Bhattarai's personal calendar"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Barsha's Roster</span>
          </button>

          {/* View Mode Toggle Switch */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'master'
                  ? 'bg-white text-blue-700 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Ward Master</span>
            </button>
          </div>

          {/* Utility Tools Dropdown / Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenLegend}
              className="p-2 text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-lg transition"
              title="Shift Color Legend"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
              title="Upload New Excel/CSV Roster"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={onExport}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition"
              title="Export Current Roster to Excel (.xlsx)"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
