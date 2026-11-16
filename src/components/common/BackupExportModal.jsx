import React, { useState, useRef } from 'react';
import { Download, Upload, FileText, CheckCircle2, AlertCircle, X, Database } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { useAuth } from '../../context/AuthContext';

export default function BackupExportModal({ isOpen, onClose }) {
  const { exportBackupJSON, exportCSV, importBackupJSON } = useJournal();
  const { currentUser } = useAuth();

  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDownloadJSON = () => {
    const jsonStr = exportBackupJSON();
    if (!jsonStr) return;
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberTrade_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = () => {
    const csvStr = exportCSV();
    if (!csvStr) return;
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CyberTrade_Trades_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const res = importBackupJSON(text);
        setImportStatus({
          type: 'success',
          message: `Backup Restored! Synced ${res.tradesCount} trades and ${res.rulesCount} rules.`
        });
      } catch (err) {
        setImportStatus({
          type: 'error',
          message: err.message || 'Corrupted or incompatible JSON file.'
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-6 bg-[#131726] border border-slate-700 rounded-xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-orbitron text-sm font-bold text-white tracking-wide">
              DATA VAULT & EXPORT
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Zero-loss local snapshots and CSV exports
            </p>
          </div>
        </div>

        {importStatus && (
          <div
            className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-xs font-mono border ${
              importStatus.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            {importStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        <div className="mt-5 space-y-3 font-mono text-xs">
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-200 block">Full JSON Snapshot</span>
              <p className="text-[11px] text-slate-400">Complete archive of trades, rules, and checklists.</p>
            </div>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 btn-primary rounded-lg font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-200 block">Trading History (CSV)</span>
              <p className="text-[11px] text-slate-400">Spreadsheet format for Excel or Google Sheets.</p>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 btn-secondary rounded-lg font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-200 block">Restore from Backup</span>
              <p className="text-[11px] text-slate-400">Upload a JSON backup to restore records.</p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 btn-secondary rounded-lg font-semibold flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
