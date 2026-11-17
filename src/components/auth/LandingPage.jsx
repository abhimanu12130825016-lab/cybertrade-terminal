import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Calendar,
  BarChart3,
  Lock,
  ArrowRight,
  Zap,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
  AlertCircle,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function LandingPage() {
  const { login, register, loginAsDemo, evaluatePasswordStrength } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const strength = evaluatePasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = login(email, password);
        if (!res.success) setError(res.error);
      } else {
        if (!name.trim()) {
          setError('Please provide your name or callsign.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        const res = register(name, email, password);
        if (!res.success) setError(res.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInstantDemo = () => {
    loginAsDemo();
  };

  return (
    <div className="min-h-screen bg-[#0A0C14] text-slate-100 flex flex-col justify-between selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-[#0E111C]/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="font-orbitron font-bold text-base tracking-wider text-white">
              CYBER<span className="text-cyan-400">TRADE</span>
            </span>
            <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hidden sm:inline">
              TERMINAL
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="p-2 text-slate-400 hover:text-lime-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleInstantDemo}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Instant Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero & Authentication Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Product Information & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Next-Generation Trading Journal & Discipline Engine</span>
            </div>

            <h1 className="font-orbitron text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Master Your Edge. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                Quantify Your Discipline.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              A clean, distraction-free trading journal built for serious traders. Auto-calculate risk-to-reward ratios, enforce daily strategy checklists, track psychological adherence, and visualize performance across any timeframe.
            </p>

            {/* Quick Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Date-grouped trade entries</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Real-time R:R & inversion alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strategy discipline correlation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Air-gapped privacy & 1-click backups</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Authentication Box */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-7 bg-[#111420] border border-slate-800 rounded-2xl shadow-xl">
              {/* Tab Selector */}
              <div className="flex p-1 bg-slate-900/90 rounded-lg border border-slate-800 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    mode === 'login'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    mode === 'register'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/30 rounded-lg flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                {mode === 'register' && (
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Full Name / Callsign
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Mercer"
                      className="w-full px-3 py-2 bg-[#090B12] border border-slate-800 focus:border-cyan-400 focus:outline-none rounded-lg text-slate-200"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="trader@cybertrade.io"
                    className="w-full px-3 py-2 bg-[#090B12] border border-slate-800 focus:border-cyan-400 focus:outline-none rounded-lg text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-[#090B12] border border-slate-800 focus:border-cyan-400 focus:outline-none rounded-lg text-slate-200"
                  />

                  {password.length > 0 && mode === 'register' && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Security:</span>
                        <span className={strength.color}>{strength.label}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.bg} transition-all`}
                          style={{ width: `${strength.percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-2.5 rounded-lg btn-primary text-xs font-bold transition-all shadow"
                >
                  {mode === 'login' ? 'Sign In to Terminal' : 'Create Free Account'}
                </button>
              </form>

              {/* Instant Test Pilot / Demo Mode */}
              <div className="mt-4 pt-4 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={handleInstantDemo}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700/80 hover:border-cyan-500/40 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-all"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Launch Demo (Pre-Loaded Sample Trades)</span>
                </button>
                <p className="text-[11px] text-slate-500 mt-2">
                  No sign up required to preview all features and charts.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Showcase */}
        <div className="mt-20 pt-10 border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-orbitron text-xl font-bold text-white">
              ENGINEERED FOR EXECUTION DISCIPLINE
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Designed to help traders eliminate emotional decisions through rigorous tracking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-[#111420] border border-slate-800 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-orbitron text-sm font-bold text-white">
                Date-Grouped Trades
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log multiple positions taken on any single trading date, showing daily trade counts and realized PnL.
              </p>
            </div>

            <div className="p-5 bg-[#111420] border border-slate-800 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-orbitron text-sm font-bold text-white">
                Real-Time R:R Engine
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instantly computes planned Risk-to-Reward and risk percentages, warning you if stop/target logic is inverted.
              </p>
            </div>

            <div className="p-5 bg-[#111420] border border-slate-800 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-orbitron text-sm font-bold text-white">
                Psychology Correlation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Checklist your rules daily to uncover statistical proof of higher win rates on disciplined days.
              </p>
            </div>

            <div className="p-5 bg-[#111420] border border-slate-800 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-orbitron text-sm font-bold text-white">
                Multi-Timeframe Analytics
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter your stats, equity curves, and PnL distributions by 7D, 30D, 1Y, All-Time, or custom date ranges.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 font-mono">
        <p>CyberTrade Terminal &copy; 2026. Built with React & Tailwind CSS for high-performance traders.</p>
      </footer>
    </div>
  );
}
