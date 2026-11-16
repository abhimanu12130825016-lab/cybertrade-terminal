import React, { useState, useRef } from 'react';
import {
  Sliders,
  Database,
  Download,
  Upload,
  Cloud,
  ShieldCheck,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJournal } from '../../context/JournalContext';
import ConfirmModal from '../common/ConfirmModal';

export default function SettingsBackupView() {
  const { currentUser, isCloudConfigured, updateProfile } = useAuth();
  const {
    exportBackupJSON,
    exportCSV,
    importBackupJSON,
    seedDemoData,
    clearAllData,
    currency,
    setCurrency
  } = useJournal();

  const [callsign, setCallsign] = useState(currentUser?.name || '');
  const [profileSaved, setProfileSaved] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const fileInputRef = useRef(null);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (callsign.trim()) {
      updateProfile({ name: callsign.trim() });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    }
  };

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
          message: `Restore Success! Synced ${res.tradesCount} trades and ${res.rulesCount} rules.`
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

  const sampleEnvConfig = `# CYBERTRADE TERMINAL CLOUD SYNC CONFIG (.env.local)
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
# OR FIREBASE
VITE_FIREBASE_API_KEY=AIzaSy...`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(sampleEnvConfig);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-4 sm:p-5 bg-[#0D0E15]/90 border border-cyan-500/20 rounded-2xl cyber-panel flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-orbitron text-lg font-bold text-white tracking-wide">
              OPERATIVE SETTINGS & DATA VAULT
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Account telemetry, cloud adapter configuration, and zero-loss snapshot controls
            </p>
          </div>
        </div>
      </div>

      {importStatus && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-mono border ${
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

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="p-5 bg-[#0D0E15]/90 border border-cyan-500/20 rounded-2xl cyber-panel space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="font-orbitron text-sm font-bold text-white">
              OPERATIVE IDENTITY
            </h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">CALL SIGN / NAME</label>
              <input
                type="text"
                required
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">AUTHENTICATED EMAIL</label>
              <input
                type="text"
                disabled
                value={currentUser?.email || 'trader@cybertrade.io'}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">BASE CURRENCY SYMBOL</label>
              <div className="flex gap-2">
                {['$', '₹', '€'].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => setCurrency(sym)}
                    className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                      currency === sym
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-neon-cyan'
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {sym} ({sym === '$' ? 'USD' : sym === '₹' ? 'INR' : 'EUR'})
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 cyber-btn-cyan rounded-lg uppercase font-bold text-xs mt-2"
            >
              {profileSaved ? 'Profile Updated!' : 'Update Operative Profile'}
            </button>
          </form>
        </div>

        {/* Persistence Engine Status */}
        <div className="p-5 bg-[#0D0E15]/90 border border-purple-500/30 rounded-2xl cyber-panel space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-purple-400" />
              <h3 className="font-orbitron text-sm font-bold text-white">
                PERSISTENCE ADAPTER STATUS
              </h3>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isCloudConfigured
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                  : 'bg-cyan-950 text-cyan-400 border-cyan-500/40'
              }`}
            >
              {isCloudConfigured ? 'CLOUD CONNECTED' : 'LOCAL-FIRST ACTIVE'}
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            CyberTrade Terminal is currently persisting data via{' '}
            <strong className="text-cyan-400">Isolated Local Storage & IndexedDB</strong>. To enable cross-device cloud persistence, add your Supabase or Firebase keys to <code className="text-purple-300 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">.env</code>.
          </p>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-400 space-y-2">
            <div className="flex justify-between items-center text-[10px] text-slate-500">
              <span>ENVIRONMENT TEMPLATE</span>
              <button
                onClick={handleCopyEnv}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                {copiedEnv ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEnv ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-[11px] text-slate-300 overflow-x-auto">
              {sampleEnvConfig}
            </pre>
          </div>
        </div>
      </div>

      {/* Snapshot Vault Actions */}
      <div className="p-5 bg-[#0D0E15]/90 border border-cyan-500/20 rounded-2xl cyber-panel space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Database className="w-5 h-5 text-cyan-400" />
          <h3 className="font-orbitron text-sm font-bold text-white">
            SNAPSHOT VAULT & DATA INTEGRITY
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-300 block">
                FULL JSON BACKUP
              </span>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Zero-loss complete snapshot of all trades, custom rules, and daily checklist adherence.
              </p>
            </div>
            <button
              onClick={handleDownloadJSON}
              className="w-full py-2 cyber-btn-cyan rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON Snapshot</span>
            </button>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-300 block">
                TRADING SPREADSHEET (CSV)
              </span>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Tabular format export for external spreadsheet modeling, taxes, or machine learning.
              </p>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="w-full py-2 cyber-btn-emerald rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV File</span>
            </button>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-purple-300 block">
                RESTORE FROM BACKUP
              </span>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Upload a verified JSON backup snapshot to instantly restore account records.
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
                className="w-full py-2 cyber-btn-magenta rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5"
              >
                <Upload className="w-4 h-4" />
                <span>Upload JSON Backup</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-5 bg-rose-950/20 border border-rose-500/30 rounded-2xl cyber-panel space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-rose-500/30">
          <Trash2 className="w-5 h-5 text-rose-400" />
          <h3 className="font-orbitron text-sm font-bold text-rose-300">
            MAINTENANCE & DANGER ZONE
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div>
            <span className="font-bold text-white block">Seed Demonstration History</span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Populate account with 8 realistic multi-asset trades and psychological checklist history.
            </p>
          </div>
          <button
            onClick={seedDemoData}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 rounded-lg flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Load Demo Data</span>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div>
            <span className="font-bold text-rose-400 block">Purge All Trade Records</span>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Permanently wipe all trades and daily checklist entries for this operative account.
            </p>
          </div>
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-4 py-2 cyber-btn-crimson rounded-lg font-bold flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Purge Everything</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="PURGE OPERATIVE DATA VAULT"
        message="Are you completely sure? This will wipe all trade logs, statistics, and daily strategy checklists for your current profile. We strongly advise taking an Export Backup first."
        confirmText="Execute Complete Purge"
        cancelText="Abort"
        onConfirm={() => {
          clearAllData();
          setIsResetConfirmOpen(false);
        }}
        onClose={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
