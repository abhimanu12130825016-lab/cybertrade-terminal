import React, { useState } from 'react';
import { ShieldCheck, User, KeyRound, Mail, Zap, AlertCircle, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { currentUser, login, register, loginAsDemo, logout, evaluatePasswordStrength } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const strength = evaluatePasswordStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const res = login(email, password);
        if (res.success) {
          onClose();
        } else {
          setError(res.error);
        }
      } else {
        if (!name.trim()) {
          setError('Operative Call Sign / Name is required.');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must contain at least 6 characters.');
          setIsSubmitting(false);
          return;
        }
        const res = register(name, email, password);
        if (res.success) {
          onClose();
        } else {
          setError(res.error);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAccess = () => {
    loginAsDemo();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-[#0D0E15] border border-cyan-500/30 rounded-2xl cyber-panel-elevated shadow-neon-cyan">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 mb-3 shadow-neon-cyan">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="font-orbitron text-xl font-bold tracking-wider text-white">
            CYBERTRADE ACCESS CONTROL
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {currentUser
              ? `AUTHENTICATED AS: ${currentUser.name.toUpperCase()}`
              : 'ISOLATED MULTI-USER ENCRYPTION PROTOCOL'}
          </p>
        </div>

        {/* Current User Logged In state */}
        {currentUser ? (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-slate-900/60 border border-cyan-500/20 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">OPERATIVE ID:</span>
                <span className="text-cyan-400">{currentUser.id}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">CALLSIGN:</span>
                <span className="font-semibold text-white">{currentUser.name}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">EMAIL:</span>
                <span className="text-slate-200">{currentUser.email}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">STORAGE ISOLATION:</span>
                <span className="text-emerald-400 font-bold">100% AIR-GAPPED</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  logout();
                  setMode('login');
                }}
                className="flex-1 py-2.5 text-xs font-mono font-bold uppercase tracking-wider cyber-btn-crimson rounded-lg"
              >
                Terminate Session (Logout)
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-mono uppercase tracking-wider bg-slate-800 text-slate-300 hover:text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mode Tabs */}
            <div className="flex mt-6 p-1 bg-slate-900/80 border border-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-mono font-medium rounded-md transition-all ${
                  mode === 'login'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-neon-cyan'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-mono font-medium rounded-md transition-all ${
                  mode === 'register'
                    ? 'bg-purple-600 text-white font-bold shadow-neon-magenta'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                REGISTER
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-rose-950/50 border border-rose-500/40 rounded-lg flex items-center gap-2 text-xs text-rose-300 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    OPERATIVE CALLSIGN / FULL NAME
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Neo Satoshi"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:outline-none rounded-lg text-sm text-slate-200 font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  SECURE EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="trader@cybertrade.io"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:outline-none rounded-lg text-sm text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  BIOMETRIC CIPHER / PASSWORD
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:outline-none rounded-lg text-sm text-slate-200 font-mono"
                  />
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-500">CIPHER STRENGTH:</span>
                      <span className={strength.color}>{strength.label}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.bg} transition-all duration-300`}
                        style={{ width: `${strength.percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-all ${
                  mode === 'login' ? 'cyber-btn-cyan' : 'cyber-btn-magenta'
                }`}
              >
                {mode === 'login' ? 'Authenticate & Enter' : 'Initialize Operative Vault'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full py-2 px-3 text-xs font-mono bg-cyan-950/30 hover:bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <span>Instant Test Pilot Mode (Pre-Loaded Demo)</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
