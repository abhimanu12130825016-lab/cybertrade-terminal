import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Flame,
  Award,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import ConfirmModal from '../common/ConfirmModal';
import { DEFAULT_STRATEGY_RULES } from '../../services/storage';

export default function StrategyRulesManager() {
  const {
    rules,
    addRule,
    editRule,
    deleteRule,
    toggleRuleActive,
    disciplineAnalytics
  } = useJournal();

  const { ruleStats, overallDisciplineScore, correlation } = disciplineAnalytics;

  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Execution');
  const [formError, setFormError] = useState(null);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const categories = ['Execution', 'Risk Management', 'Psychology', 'Analysis'];

  const resetForm = () => {
    setIsCreating(false);
    setEditingRuleId(null);
    setTitle('');
    setDescription('');
    setCategory('Execution');
    setFormError(null);
  };

  const handleStartEdit = (rule) => {
    setEditingRuleId(rule.id);
    setTitle(rule.title);
    setDescription(rule.description || '');
    setCategory(rule.category || 'Execution');
    setIsCreating(true);
  };

  const handleSaveRule = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Rule title is mandatory.');
      return;
    }

    if (editingRuleId) {
      editRule(editingRuleId, {
        title: title.trim(),
        description: description.trim(),
        category
      });
    } else {
      addRule({
        title: title.trim(),
        description: description.trim(),
        category,
        active: true
      });
    }

    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header & Overall Discipline KPI */}
      <div className="p-4 sm:p-5 bg-[#0D0E15]/90 border border-purple-500/30 rounded-2xl cyber-panel flex flex-wrap items-center justify-between gap-4 shadow-neon-magenta">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-orbitron text-lg font-bold text-white tracking-wide">
              TRADING STRATEGY RULES ENGINE
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Quantitative strategy guidelines & adherence probability analytics
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsCreating(true);
          }}
          className="px-4 py-2 cyber-btn-magenta rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-neon-magenta"
        >
          <Plus className="w-4 h-4" />
          <span>New Strategy Rule</span>
        </button>
      </div>

      {/* Discipline Score & Psychological Correlation Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/60 border border-amber-500/30 rounded-xl space-y-1 font-mono text-xs">
          <span className="text-slate-400 block">OVERALL DISCIPLINE SCORE:</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-orbitron font-black text-amber-400 cyber-num">
              {overallDisciplineScore}%
            </span>
            <span className="text-slate-400 text-[11px]">Across All Days</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${overallDisciplineScore}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-emerald-500/30 rounded-xl space-y-1 font-mono text-xs">
          <span className="text-slate-400 block">DISCIPLINED SESSIONS WIN RATE:</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-orbitron font-black text-[#00FF9D] cyber-num glow-text-emerald">
              {correlation.disciplinedWinRate}%
            </span>
            <span className="text-slate-400 text-[11px]">
              ({correlation.disciplinedTradeCount} Trades)
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">
            Win rate when 100% of strategy rules were obeyed
          </p>
        </div>

        <div className="p-4 bg-slate-900/60 border border-rose-500/30 rounded-xl space-y-1 font-mono text-xs">
          <span className="text-slate-400 block">BROKEN-RULE SESSIONS WIN RATE:</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-orbitron font-black text-[#FF2A5F] cyber-num glow-text-crimson">
              {correlation.undisciplinedWinRate}%
            </span>
            <span className="text-slate-400 text-[11px]">
              ({correlation.undisciplinedTradeCount} Trades)
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">
            Win rate when impulsive or broken rules occurred
          </p>
        </div>
      </div>

      {/* Create / Edit Rule Form Modal / Collapsible */}
      {isCreating && (
        <div className="p-5 bg-[#0D0E15] border border-cyan-500/40 rounded-2xl cyber-panel-elevated shadow-neon-cyan animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
            <h3 className="font-orbitron text-sm font-bold text-white tracking-wide">
              {editingRuleId ? 'MODIFY STRATEGY RULE' : 'DEFINE NEW STRATEGY RULE'}
            </h3>
            <button
              onClick={resetForm}
              className="text-xs font-mono text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          {formError && (
            <div className="mb-4 p-3 bg-rose-950/50 border border-rose-500/40 rounded-lg text-xs text-rose-300 font-mono">
              {formError}
            </div>
          )}

          <form onSubmit={handleSaveRule} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">
                  RULE TITLE (PRE-TRADE DIRECTIVE)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Wait for 15M candle close confirmation"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">CATEGORY</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-200"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                RULE DESCRIPTION & PSYCHOLOGICAL RATIONALE
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why is this rule vital? What trap does it prevent?"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-200"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg uppercase"
              >
                Abort
              </button>
              <button
                type="submit"
                className="px-5 py-2 cyber-btn-cyan rounded-lg uppercase font-bold"
              >
                {editingRuleId ? 'Update Rule' : 'Deploy Rule to Terminal'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rules List with Individual Adherence Stats */}
      <div className="space-y-3">
        {rules.map((rule) => {
          const stats = ruleStats.find((s) => s.id === rule.id) || {
            adherencePct: 100,
            followedDays: 0,
            totalEvaluatedDays: 0
          };

          const isHigh = stats.adherencePct >= 80;
          const isMedium = stats.adherencePct >= 60 && stats.adherencePct < 80;
          const badgeColor = isHigh
            ? 'text-[#00FF9D] border-emerald-500/40 bg-emerald-950/30'
            : isMedium
            ? 'text-amber-400 border-amber-500/40 bg-amber-950/30'
            : 'text-[#FF2A5F] border-rose-500/40 bg-rose-950/30';

          return (
            <div
              key={rule.id}
              className={`p-5 rounded-2xl border transition-all ${
                rule.active !== false
                  ? 'bg-[#0D0E15]/90 border-slate-800/80 hover:border-cyan-500/30 cyber-panel'
                  : 'bg-slate-950/60 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-[240px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-orbitron font-bold text-sm text-white">
                      {rule.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                      {rule.category || 'Discipline'}
                    </span>
                    {!rule.active && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-500 uppercase">
                        Inactive
                      </span>
                    )}
                  </div>

                  {rule.description && (
                    <p className="mt-1.5 text-xs text-slate-400 font-mono leading-relaxed">
                      {rule.description}
                    </p>
                  )}
                </div>

                {/* Adherence Badge & Action Controls */}
                <div className="flex items-center gap-4 font-mono">
                  {/* Exact Adherence % Tag */}
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">
                      Adherence
                    </span>
                    <span
                      className={`text-sm font-bold cyber-num px-2.5 py-0.5 rounded-lg border ${badgeColor}`}
                    >
                      {stats.adherencePct}%
                    </span>
                  </div>

                  {/* Toggle Active Button */}
                  <button
                    onClick={() => toggleRuleActive(rule.id)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                    title={rule.active ? 'Deactivate rule' : 'Activate rule'}
                  >
                    {rule.active !== false ? (
                      <ToggleRight className="w-6 h-6 text-cyan-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-slate-600" />
                    )}
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleStartEdit(rule)}
                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                    title="Edit Rule"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeleteTargetId(rule.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Adherence Progress Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <span>
                    Followed on {stats.followedDays} of {stats.totalEvaluatedDays} trading days
                  </span>
                  <span className="font-semibold text-slate-300">
                    Target: 100% Strict Adherence
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      isHigh
                        ? 'bg-[#00FF9D]'
                        : isMedium
                        ? 'bg-amber-400'
                        : 'bg-[#FF2A5F]'
                    } rounded-full transition-all duration-500`}
                    style={{ width: `${stats.adherencePct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal for Delete Action */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="DELETE STRATEGY RULE"
        message="Are you sure you wish to delete this strategy rule? Past daily logs will retain record history, but this rule will no longer appear on future trading checklists."
        confirmText="Confirm Delete"
        cancelText="Abort"
        onConfirm={() => {
          if (deleteTargetId) deleteRule(deleteTargetId);
          setDeleteTargetId(null);
        }}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
