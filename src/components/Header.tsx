import React from 'react';
import { CalendarDays, Users, Info, FileSpreadsheet, Download } from 'lucide-react';

interface HeaderProps {
  activeTab: 'personal' | 'master';
  setActiveTab: (tab: 'personal' | 'master') => void;
  onOpenLegend: () => void;
  onOpenUpload: () => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenLegend,
  onOpenUpload,
  onExport,
}) => {
  const tab = (id: 'personal' | 'master', label: string, Icon: typeof Users) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition ${
        activeTab === id ? 'bg-white text-violet-700' : 'text-white/90 hover:bg-white/15'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  const tool = (onClick: () => void, label: string, Icon: typeof Info) => (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="p-2.5 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition"
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-md sticky top-0 z-30">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img src="/icon.svg" alt="" className="w-9 h-9 rounded-xl shrink-0" />
          <div className="leading-tight min-w-0">
            <h1 className="text-base font-black text-white truncate">Ward 9 North</h1>
            <p className="text-xs text-white/80 truncate">St Vincent’s · Roster</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {tab('personal', 'Roster', CalendarDays)}
          {tab('master', 'Ward', Users)}
        </nav>

        <div className="flex items-center">
          {tool(onOpenLegend, 'Shift legend', Info)}
          {tool(onOpenUpload, 'Upload roster', FileSpreadsheet)}
          {tool(onExport, 'Export roster', Download)}
        </div>
      </div>
    </header>
  );
};
