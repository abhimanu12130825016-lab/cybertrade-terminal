import React, { useState, useRef } from 'react';
import {
  Sliders,
  Database,
  Download,
  Upload,
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

  const sampleEnvConfig = `# CYBERTRADE TERMINAL CLOUD SYNC (.env.local)
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
    <div className="space-y-5">
      {/* Title */}
      <div className="p-4 bg-[#111420] border border-slate-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-orbitron text-sm font-bold text-white tracking-wide">
              SETTINGS & DATA VAULT
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Account profile, cloud persistence configuration, and zero-loss backups
            </p>
          </div>
        </div>
      </div>

      {importStatus && (
        <div
          className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-mono border ${
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Profile Settings */}
        <div className="p-4 sm:p-5 bg-[#111420] border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="font-orbitron text-xs font-bold text-white">
              TRADER IDENTITY
            </h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3 font-mono text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Callsign / Name</label>
              <input
                type="text"
                required
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                className="w-full px-3 py-2 bg-[#090B12] border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-100 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Authenticated Email</label>
              <input
                type="text"
                disabled
                value={currentUser?.email || 'trader@cybertrade.io'}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Base Currency</label>
              <div className="flex gap-2">
                {['$', '₹', '€'].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => setCurrency(sym)}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-colors ${
                      currency === sym
                        ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40'
                        : 'bg-[#090B12] text-slate-400 border border-slate-800'
                    }`}
                  >
                    {sym} ({sym === '$' ? 'USD' : sym === '₹' ? 'INR' : 'EUR'})
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 btn-primary rounded-lg font-bold text-xs mt-2"
            >
              {profileSaved ? 'Profile Saved' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Persistence Status */}
        <div className="p-4 sm:p-5 bg-[#111420] border border-slate-800 rounded-xl space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-orbitron text-xs font-bold text-white">
              STORAGE PERSISTENCE
            </h3>
            <span
              className={`text-[10px] px-2 py-0.5 rounded border ${
                isCloudConfigured
                  ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
            >
              {isCloudConfigured ? 'Cloud Connected' : 'Local Storage Active'}
            </span>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed">
            Data is currently persisted in your browser's private storage. To sync across multiple machines, configure Supabase or Firebase in <code className="text-cyan-400 bg-[#090B12] px-1 py-0.5 rounded border border-slate-800">.env</code>.
          </p>

          <div className="p-3 bg-[#090B12] border border-slate-800 rounded-lg text-slate-400 space-y-1.5">
            <div className="flex justify-between items-center text-[10px] text-slate-500">
              <span>CONFIG TEMPLATE</span>
              <button
                onClick={handleCopyEnv}
                className="text-cyan-400 hover:text-white flex items-center gap-1"
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

      {/* Snapshot Vault */}
      <div className="p-4 sm:p-5 bg-[#111420] border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Database className="w-4 h-4 text-cyan-400" />
          <h3 className="font-orbitron text-xs font-bold text-white">
            SNAPSHOT EXPORTS & RESTORATION
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between space-y-2.5">
            <div>
              <span className="text-xs font-mono font-bold text-slate-200 block">
                Full JSON Backup
              </span>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Complete archive of trades, strategy rules, and daily checklist adherence.
              </p>
            </div>
            <button
              onClick={handleDownloadJSON}
              className="w-full py-2 btn-secondary rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between space-y-2.5">
            <div>
              <span className="text-xs font-mono font-bold text-slate-200 block">
                Spreadsheet (CSV)
              </span>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Export trade records for Excel, Google Sheets, or custom modeling.
              </p>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="w-full py-2 btn-secondary rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col justify-between space-y-2.5">
            <div>
              <span className="text-xs font-mono font-bold text-slate-200 block">
                Restore Snapshot
              </span>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Upload a verified JSON backup to instantly restore all data.
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
                className="w-full py-2 btn-secondary rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-4 sm:p-5 bg-rose-950/20 border border-rose-500/20 rounded-xl space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 pb-2.5 border-b border-rose-500/20">
          <Trash2 className="w-4 h-4 text-rose-400" />
          <h3 className="font-orbitron text-xs font-bold text-rose-300">
            MAINTENANCE & PURGE
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-white block">Seed Demo History</span>
            <p className="text-slate-400 text-[11px]">
              Load 8 sample multi-asset executions with strategy checklist history.
            </p>
          </div>
          <button
            onClick={seedDemoData}
            className="px-3.5 py-1.5 bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-200 rounded-lg flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Demo Data</span>
          </button>
        </div>

        <div className="pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-rose-400 block">Purge Current Account Data</span>
            <p className="text-slate-400 text-[11px]">
              Permanently wipe all trades and checklists for this profile.
            </p>
          </div>
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3.5 py-1.5 btn-danger rounded-lg text-xs font-semibold"
          >
            Purge Data
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Purge Account Data"
        message="Are you sure? This will wipe all trade logs and daily strategy checklists for your current profile."
        confirmText="Confirm Purge"
        cancelText="Cancel"
        onConfirm={() => {
          clearAllData();
          setIsResetConfirmOpen(false);
        }}
        onClose={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
