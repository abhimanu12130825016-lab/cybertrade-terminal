import React from 'react';
import { ShieldCheck, Flame, AlertOctagon, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';

export default function DisciplineCorrelationCard() {
  const { disciplineAnalytics, rules } = useJournal();
  const { correlation, overallDisciplineScore, ruleStats } = disciplineAnalytics;

  return (
    <div className="p-5 bg-[#0D0E15]/90 border border-purple-500/30 rounded-2xl cyber-panel shadow-neon-magenta">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-orbitron text-sm font-bold tracking-wider text-white">
              PSYCHOLOGICAL & DISCIPLINE CORRELATION
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Quantitative comparison: 100% Rule Adherence vs. Broken Rule Days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-purple-950/40 border border-purple-500/30 rounded-lg text-xs font-mono text-purple-300">
          <span>Overall Score:</span>
          <span className="font-bold text-white cyber-num">{overallDisciplineScore}%</span>
        </div>
      </div>

      {/* Correlation Insight Callout Banner */}
      <div className="p-4 bg-slate-900/80 border border-cyan-500/30 rounded-xl flex items-start gap-3 mb-6">
        <Flame className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
        <div>
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
            STATISTICAL PSYCHOLOGY TELEMETRY
          </span>
          <p className="text-xs text-slate-200 font-mono mt-1 leading-relaxed">
            {correlation.insight}
          </p>
        </div>
      </div>

      {/* Dual Comparative Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* 100% Rules Followed */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> 100% RULES FOLLOWED
            </span>
            <span className="text-slate-400">{correlation.disciplinedTradeCount} Trades</span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div className="font-orbitron text-3xl font-black text-[#00FF9D] cyber-num glow-text-emerald">
              {correlation.disciplinedWinRate}%
            </div>
            <span className="text-xs font-mono text-emerald-400/80 font-medium">
              Win Expectancy
            </span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-[#00FF9D] rounded-full transition-all duration-700 shadow-neon-emerald"
              style={{ width: `${correlation.disciplinedWinRate}%` }}
            />
          </div>
        </div>

        {/* Strategy Rules Broken */}
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
              <AlertOctagon className="w-4 h-4" /> RULES BREACHED / IMPULSIVE
            </span>
            <span className="text-slate-400">{correlation.undisciplinedTradeCount} Trades</span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div className="font-orbitron text-3xl font-black text-[#FF2A5F] cyber-num glow-text-crimson">
              {correlation.undisciplinedWinRate}%
            </div>
            <span className="text-xs font-mono text-rose-400/80 font-medium">
              Win Expectancy
            </span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-[#FF2A5F] rounded-full transition-all duration-700 shadow-neon-crimson"
              style={{ width: `${correlation.undisciplinedWinRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Individual Rules Adherence Progress Bars */}
      <div>
        <h4 className="text-xs font-mono text-slate-400 font-semibold uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Active Strategy Rules Adherence Breakdown</span>
          <span className="text-[10px] text-cyan-400 font-normal">
            {ruleStats.length} Rules Monitored
          </span>
        </h4>

        <div className="space-y-3">
          {ruleStats.map((rule) => {
            const isHigh = rule.adherencePct >= 80;
            const isMedium = rule.adherencePct >= 60 && rule.adherencePct < 80;
            const barColor = isHigh
              ? 'bg-[#00FF9D]'
              : isMedium
              ? 'bg-amber-400'
              : 'bg-[#FF2A5F]';

            return (
              <div
                key={rule.id}
                className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-200 font-medium truncate max-w-[70%]">
                    {rule.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 uppercase px-1.5 py-0.5 bg-slate-950 rounded border border-slate-800">
                      {rule.category}
                    </span>
                    <span
                      className={`font-bold cyber-num ${
                        isHigh ? 'text-[#00FF9D]' : isMedium ? 'text-amber-400' : 'text-[#FF2A5F]'
                      }`}
                    >
                      {rule.adherencePct}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full transition-all duration-500`}
                    style={{ width: `${rule.adherencePct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Followed: {rule.followedDays} trading days</span>
                  <span>Evaluated: {rule.totalEvaluatedDays} days</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
