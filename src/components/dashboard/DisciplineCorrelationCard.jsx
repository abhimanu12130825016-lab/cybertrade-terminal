import React from 'react';
import { ShieldCheck, CheckCircle2, AlertOctagon, Sparkles } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';

export default function DisciplineCorrelationCard() {
  const { disciplineAnalytics } = useJournal();
  const { correlation, overallDisciplineScore, ruleStats } = disciplineAnalytics;

  return (
    <div className="p-4 sm:p-5 bg-[#111420] border border-slate-800 rounded-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-orbitron text-xs font-bold tracking-wide text-white">
              STRATEGY DISCIPLINE CORRELATION
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Comparing 100% Rule Adherence vs. Broken Rule Days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
          <span className="text-slate-400">Discipline Score:</span>
          <span className="font-bold text-emerald-400 font-tabular">{overallDisciplineScore}%</span>
        </div>
      </div>

      {/* Correlation Insight Callout Banner */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-start gap-2.5 text-xs font-mono">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-slate-300 leading-relaxed">
          {correlation.insight}
        </p>
      </div>

      {/* Dual Comparative Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* 100% Rules Followed */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> 100% Rules Followed
            </span>
            <span className="text-slate-400">{correlation.disciplinedTradeCount} Trades</span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="font-orbitron text-2xl font-bold text-emerald-400 font-tabular">
              {correlation.disciplinedWinRate}%
            </div>
            <span className="text-xs font-mono text-slate-400">
              Win Rate
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all"
              style={{ width: `${correlation.disciplinedWinRate}%` }}
            />
          </div>
        </div>

        {/* Strategy Rules Broken */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-rose-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <AlertOctagon className="w-4 h-4" /> Rules Broken / Impulsive
            </span>
            <span className="text-slate-400">{correlation.undisciplinedTradeCount} Trades</span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <div className="font-orbitron text-2xl font-bold text-rose-400 font-tabular">
              {correlation.undisciplinedWinRate}%
            </div>
            <span className="text-xs font-mono text-slate-400">
              Win Rate
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-400 rounded-full transition-all"
              style={{ width: `${correlation.undisciplinedWinRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Individual Rules Adherence Progress Bars */}
      <div>
        <h4 className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Active Strategy Rules Adherence</span>
          <span className="text-slate-500 font-normal">
            {ruleStats.length} Rules
          </span>
        </h4>

        <div className="space-y-2">
          {ruleStats.map((rule) => {
            const isHigh = rule.adherencePct >= 80;
            const isMedium = rule.adherencePct >= 60 && rule.adherencePct < 80;
            const barColor = isHigh
              ? 'bg-emerald-400'
              : isMedium
              ? 'bg-amber-400'
              : 'bg-rose-400';

            return (
              <div
                key={rule.id}
                className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-medium truncate max-w-[70%]">
                    {rule.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 uppercase px-1.5 py-0.5 bg-slate-950 rounded border border-slate-800">
                      {rule.category}
                    </span>
                    <span
                      className={`font-bold font-tabular ${
                        isHigh ? 'text-emerald-400' : isMedium ? 'text-amber-400' : 'text-rose-400'
                      }`}
                    >
                      {rule.adherencePct}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all`}
                    style={{ width: `${rule.adherencePct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Followed {rule.followedDays} of {rule.totalEvaluatedDays} days</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
