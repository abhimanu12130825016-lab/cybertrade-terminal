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
    a.download = `CyberTrade_Backup_${currentUser?.name?.replace(/\s+/g, '_') || 'Operative'}_${new Date().toISOString().split('T')[0]}.json`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg p-6 bg-[#0D0E15] border border-cyan-500/30 rounded-xl cyber-panel-elevated shadow-neon-cyan">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-orbitron text-lg font-bold text-white tracking-wide">
              DATA VAULT & BACKUPS
            </h2>
            <p className="text-xs text-slate-400">
              Zero-loss local encryption + JSON/CSV snapshot export
            </p>
          </div>
        </div>

        {importStatus && (
          <div
            className={`mt-4 p-3 rounded-lg flex items-center gap-3 text-xs font-mono border ${
              importStatus.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            {importStatus.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        <div className="mt-6 space-y-4">
          {/* JSON Full Backup */}
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-slate-200">
                  Full Journal Snapshot (JSON)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Complete schema: trades, custom rules, daily adherence & notes.
              </p>
            </div>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-2 text-xs font-mono font-medium cyber-btn-cyan rounded-lg flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {/* CSV Spreadsheet Export */}
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold text-slate-200">
                  Trading History (CSV)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Compatible with Excel, Google Sheets, and quantitative software.
              </p>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-2 text-xs font-mono font-medium cyber-btn-emerald rounded-lg flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Restore JSON Backup */}
          <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-slate-200">
                  Restore from JSON Backup
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Upload a previous snapshot to instantly recover all records.
              </p>
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
                className="px-3 py-2 text-xs font-mono font-medium cyber-btn-magenta rounded-lg flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
}
