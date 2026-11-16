import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Destructive Action',
  message = 'Are you sure you want to proceed? This action cannot be reversed.',
  confirmText = 'Execute Purge',
  cancelText = 'Abort',
  variant = 'crimson', // 'crimson' | 'amber' | 'cyan'
  onConfirm,
  onClose
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 bg-[#0D0E15] border border-[#FF2A5F]/40 shadow-neon-crimson rounded-xl cyber-panel-elevated">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#FF2A5F]/15 border border-[#FF2A5F]/40 rounded-lg text-[#FF2A5F]">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>

          <div className="flex-1">
            <h3 className="font-orbitron text-lg font-bold text-slate-100 tracking-wide">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold text-white bg-[#FF2A5F] hover:bg-[#FF2A5F]/80 shadow-neon-crimson rounded-lg transition-all"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
