import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import ConfirmModal from '../common/ConfirmModal';

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

  const [isCreating, setIsCreating] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Execution');
  const [formError, setFormError] = useState(null);

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
    <div className="space-y-5">
      {/* Header */}
      <div className="p-4 bg-[#111420] border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-orbitron text-sm font-bold text-white tracking-wide">
              STRATEGY RULES ENGINE
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Manage personal rules and track daily execution discipline
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsCreating(true);
          }}
          className="px-3.5 py-2 btn-primary rounded-lg text-xs font-semibold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Strategy Rule</span>
        </button>
      </div>

      {/* Discipline Score Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-[#111420] border border-slate-800 rounded-xl space-y-1 font-mono text-xs">
          <span className="text-slate-400 block">Overall Discipline Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-orbitron font-bold text-amber-400 font-tabular">
              {overallDisciplineScore}%
            </span>
            <span className="text-slate-500 text-[11px]">Across All Days</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${overallDisciplineScore}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 bg-[#111420] border border-slate-800 rounded-xl space-y-1 font-mono text-xs">
          <span className="text-slate-400 block">Disciplined Sessions Win Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-orbitron font-bold text-emerald-400 font-tabular">
              {correlation.disciplinedWinRate}%
            </span>
            <span className="text-slate-500 text-[11px]">
              ({correlation.disciplinedTradeCount} Trades)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            100% of rules strictly obeyed
          </p>
        </div>

        <div className="p-3.5 bg-[#111420] border border-slate-800 rounded-xl space-y-1 font-mono text-xs">
          <span className="text-slate-400 block">Broken-Rule Sessions Win Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-orbitron font-bold text-rose-400 font-tabular">
              {correlation.undisciplinedWinRate}%
            </span>
            <span className="text-slate-500 text-[11px]">
              ({correlation.undisciplinedTradeCount} Trades)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Impulsive or broken rules
          </p>
        </div>
      </div>

      {/* Create / Edit Rule Form */}
      {isCreating && (
        <div className="p-4 sm:p-5 bg-[#131726] border border-slate-700 rounded-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="font-orbitron text-xs font-bold text-white tracking-wide">
              {editingRuleId ? 'Edit Strategy Rule' : 'Create New Strategy Rule'}
            </h3>
            <button
              onClick={resetForm}
              className="text-xs font-mono text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          {formError && (
            <div className="mb-3 p-2.5 bg-rose-950/40 border border-rose-500/30 rounded-lg text-xs text-rose-300 font-mono">
              {formError}
            </div>
          )}

          <form onSubmit={handleSaveRule} className="space-y-3 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1">
                  Rule Title (Pre-Trade Directive)
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Wait for 15M candle close confirmation"
                  className="w-full px-3 py-2 bg-[#090B12] border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090B12] border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-200"
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
                Description & Psychological Rationale
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Why is this rule vital? What trap does it prevent?"
                className="w-full px-3 py-2 bg-[#090B12] border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-200"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={resetForm}
                className="px-3.5 py-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 btn-primary rounded-lg font-semibold"
              >
                {editingRuleId ? 'Update Rule' : 'Save Rule'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-2.5">
        {rules.map((rule) => {
          const stats = ruleStats.find((s) => s.id === rule.id) || {
            adherencePct: 100,
            followedDays: 0,
            totalEvaluatedDays: 0
          };

          const isHigh = stats.adherencePct >= 80;
          const isMedium = stats.adherencePct >= 60 && stats.adherencePct < 80;
          const badgeColor = isHigh
            ? 'text-emerald-400 bg-emerald-950/20 border-emerald-500/30'
            : isMedium
            ? 'text-amber-400 bg-amber-950/20 border-amber-500/30'
            : 'text-rose-400 bg-rose-950/20 border-rose-500/30';

          return (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border transition-colors ${
                rule.active !== false
                  ? 'bg-[#111420] border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-orbitron font-bold text-xs text-white">
                      {rule.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                      {rule.category || 'Discipline'}
                    </span>
                  </div>

                  {rule.description && (
                    <p className="mt-1 text-xs text-slate-400 font-mono">
                      {rule.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">
                      Adherence
                    </span>
                    <span
                      className={`text-xs font-bold font-tabular px-2 py-0.5 rounded border ${badgeColor}`}
                    >
                      {stats.adherencePct}%
                    </span>
                  </div>

                  <button
                    onClick={() => toggleRuleActive(rule.id)}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title={rule.active ? 'Deactivate' : 'Activate'}
                  >
                    {rule.active !== false ? (
                      <ToggleRight className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-slate-600" />
                    )}
                  </button>

                  <button
                    onClick={() => handleStartEdit(rule)}
                    className="p-1 text-slate-400 hover:text-white rounded"
                    title="Edit Rule"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteTargetId(rule.id)}
                    className="p-1 text-slate-400 hover:text-rose-400 rounded"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Adherence Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-800">
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Followed on {stats.followedDays} of {stats.totalEvaluatedDays} trading days</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      isHigh ? 'bg-emerald-400' : isMedium ? 'bg-amber-400' : 'bg-rose-400'
                    } rounded-full transition-all`}
                    style={{ width: `${stats.adherencePct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Strategy Rule"
        message="Are you sure you wish to delete this strategy rule?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (deleteTargetId) deleteRule(deleteTargetId);
          setDeleteTargetId(null);
        }}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
