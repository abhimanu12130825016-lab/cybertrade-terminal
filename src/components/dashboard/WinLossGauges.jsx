import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Target, ArrowUpRight, ArrowDownRight, Award } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';

export default function WinLossGauges() {
  const { metrics } = useJournal();

  const outcomeData = [
    { name: 'Wins', value: metrics.wins, color: '#10B981' },
    { name: 'Losses', value: metrics.losses, color: '#F43F5E' },
    { name: 'Breakeven', value: metrics.breakevens, color: '#64748B' }
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Outcome Distribution Donut */}
      <div className="p-4 sm:p-5 bg-[#111420] border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <h3 className="font-orbitron text-xs font-bold tracking-wide text-white">
              OUTCOME DISTRIBUTION
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {metrics.totalTrades} Trades
          </span>
        </div>

        {outcomeData.length === 0 ? (
          <div className="h-44 flex items-center justify-center text-slate-500 font-mono text-xs">
            No data logged
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="w-1/2 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D101B',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '11px',
                      color: '#E2E8F0'
                    }}
                  />
                  <Pie
                    data={outcomeData}
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {outcomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#111420" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-1/2 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Wins:
                </span>
                <span className="font-bold text-emerald-400 font-tabular">
                  {metrics.wins} ({metrics.winRate}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" /> Losses:
                </span>
                <span className="font-bold text-rose-400 font-tabular">
                  {metrics.losses} ({metrics.lossRate}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-500" /> Even:
                </span>
                <span className="font-bold text-slate-400 font-tabular">
                  {metrics.breakevens} ({metrics.breakevenRate}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Long vs Short Performance Matrix */}
      <div className="p-4 sm:p-5 bg-[#111420] border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <h3 className="font-orbitron text-xs font-bold tracking-wide text-white">
              LONG VS SHORT METRICS
            </h3>
          </div>
          <span className="text-[11px] font-mono text-purple-400">
            Profit Factor: {metrics.profitFactor}x
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="flex items-center gap-1 font-bold">
                <ArrowUpRight className="w-4 h-4" /> LONG
              </span>
              <span className="font-tabular">{metrics.longCount} Trades</span>
            </div>
            <div className="text-xl font-bold font-orbitron text-white font-tabular">
              {metrics.longWinRate}%
            </div>
            <div className="text-[11px] text-slate-400">
              Win Rate
            </div>
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <div className="flex items-center justify-between text-purple-400">
              <span className="flex items-center gap-1 font-bold">
                <ArrowDownRight className="w-4 h-4" /> SHORT
              </span>
              <span className="font-tabular">{metrics.shortCount} Trades</span>
            </div>
            <div className="text-xl font-bold font-orbitron text-white font-tabular">
              {metrics.shortWinRate}%
            </div>
            <div className="text-[11px] text-slate-400">
              Win Rate
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-[11px] font-mono text-slate-400">
          <span>Target R:R: 1:2.0+</span>
          <span className="text-cyan-400">Avg Realized: {metrics.avgRR}</span>
        </div>
      </div>
    </div>
  );
}
