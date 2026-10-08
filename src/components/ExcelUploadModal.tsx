import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { parseRosterFile } from '../utils/excelParser';
import { StaffMember } from '../types/roster';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedStaff: StaffMember[]) => void;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setSuccessInfo(null);

    const result = await parseRosterFile(file);
    setIsLoading(false);

    if (result.errors.length > 0 && result.staffMembers.length === 0) {
      setError(result.errors.join(' '));
    } else {
      setSuccessInfo(`Successfully imported ${result.staffMembers.length} staff members from ${file.name}!`);
      setTimeout(() => {
        onImportSuccess(result.staffMembers);
        onClose();
      }, 1200);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Upload Hospital Roster File</h3>
              <p className="text-xs text-slate-500">Supports Excel (.xlsx, .xls) and CSV (.csv)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
            dragActive ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
          }`}
          onClick={() => document.getElementById('roster-file-input')?.click()}
        >
          <input
            id="roster-file-input"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleChange}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-800">
            {isLoading ? 'Parsing Spreadsheet...' : 'Click to browse or drag & drop'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Standard Ward 9 North monthly Excel export or CSV file
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successInfo && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successInfo}</span>
          </div>
        )}

        {/* Hints */}
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Expected Hospital Columns</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Column A: Staff Name • Column B: FTE • Column C: Role (NUM, RN, CNE, etc.) • Columns D+: Daily shift codes (M, E, N, AL, ADO, D).
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
