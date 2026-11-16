import React, { useState } from 'react';
import {
  TrendingUp,
  Database,
  User,
  LogOut,
  SlidersHorizontal,
  ChevronDown,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJournal } from '../../context/JournalContext';
import BackupExportModal from '../common/BackupExportModal';

export default function Navbar() {
  const { currentUser, logout, isCloudConfigured } = useAuth();
  const { currency, setCurrency, activeTab, setActiveTab } = useJournal();

  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0E111C]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Terminal Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <span className="font-orbitron font-bold text-base tracking-wider text-white">
                  CYBER<span className="text-cyan-400">TRADE</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  TERMINAL
                </span>
              </div>
            </button>

            {/* Storage Mode Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{isCloudConfigured ? 'Cloud Sync' : 'Local Storage'}</span>
            </div>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
              {['$', '₹', '€'].map((sym) => (
                <button
                  key={sym}
                  onClick={() => setCurrency(sym)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    currency === sym
                      ? 'bg-slate-800 text-cyan-400 font-bold'
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
              title="Open Data Vault & Export"
              className="px-3 py-1.5 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-mono"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Data Vault</span>
            </button>

            {/* User Profile & Logout Button */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors text-xs font-mono"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">
                  {currentUser?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="max-w-[90px] truncate text-slate-200 hidden sm:inline">
                  {currentUser?.name || 'Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 py-1 bg-[#111420] border border-slate-800 rounded-xl shadow-2xl z-50 text-xs font-mono">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="font-bold text-white truncate">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab('settings');
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:text-white hover:bg-slate-850 flex items-center gap-2"
                  >
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Settings & Vault</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full px-3 py-2 text-left text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 border-t border-slate-800/80"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Backup Modal */}
      <BackupExportModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />
    </>
  );
}
