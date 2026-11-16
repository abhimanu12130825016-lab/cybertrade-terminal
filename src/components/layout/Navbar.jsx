import React, { useState } from 'react';
import {
  Terminal,
  ShieldCheck,
  Database,
  User,
  Zap,
  Globe,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJournal } from '../../context/JournalContext';
import AuthModal from '../auth/AuthModal';
import BackupExportModal from '../common/BackupExportModal';

export default function Navbar() {
  const { currentUser, isCloudConfigured } = useAuth();
  const { currency, setCurrency, timeframe, setTimeframe, activeTab, setActiveTab } = useJournal();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#07080E]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Terminal Brand */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => setActiveTab('dashboard')}
              className="cursor-pointer flex items-center gap-2.5 group"
            >
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/40 rounded-lg group-hover:border-cyan-400 group-hover:shadow-neon-cyan transition-all">
                <Terminal className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <span className="font-orbitron font-extrabold text-lg tracking-wider text-white">
                  CYBER<span className="text-cyan-400 glow-text-cyan">TRADE</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-mono tracking-widest text-slate-400 uppercase bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                  v2.6 TERMINAL
                </span>
              </div>
            </div>

            {/* Cloud vs Local Status Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-400">STATUS:</span>
              <span className="text-emerald-400 font-semibold">
                {isCloudConfigured ? 'CLOUD SYNC' : 'AIR-GAPPED LOCAL'}
              </span>
            </div>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
              {['$', '₹', '€'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setCurrency(sym)}
                  className={`px-2 py-1 rounded transition-all ${
                    currency === sym
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>

            {/* Backup & Data Vault Modal Trigger */}
            <button
              onClick={() => setIsBackupOpen(true)}
              title="Open Encrypted Data Vault & Export"
              className="p-2 text-slate-300 hover:text-cyan-400 bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 rounded-lg transition-all flex items-center gap-1.5 text-xs font-mono"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline">Vault & Backup</span>
            </button>

            {/* User Profile / Auth Button */}
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 rounded-lg transition-all text-xs font-mono"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold">
                {currentUser?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="max-w-[100px] truncate text-slate-200 font-medium hidden sm:inline">
                {currentUser?.name || 'Sign In'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Auth and Backup Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <BackupExportModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />
    </>
  );
}
