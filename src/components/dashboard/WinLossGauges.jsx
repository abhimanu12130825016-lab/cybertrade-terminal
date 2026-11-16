import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Target, ArrowUpRight, ArrowDownRight, Award } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';

export default function WinLossGauges() {
  const { metrics, currency } = useJournal();

  const outcomeData = [
    { name: 'Wins (Succeeded)', value: metrics.wins, color: '#00FF9D' },
    { name: 'Losses (Failed)', value: metrics.losses, color: '#FF2A5F' },
    { name: 'Breakeven', value: metrics.breakevens, color: '#94A3B8' }
  ].filter(d => d.value > 0);

  const directionData = [
    { name: 'Long', value: metrics.longCount, color: '#00F0FF' },
    { name: 'Short', value: metrics.shortCount, color: '#B829EA' }
  ].filter(d => d.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Outcome Distribution Donut */}
      <div className="p-5 bg-[#0D0E15]/90 border border-cyan-500/20 rounded-2xl cyber-panel">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <h3 className="font-orbitron text-xs font-bold tracking-wider text-white">
              OUTCOME PROBABILITY DISTRIBUTION
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">
            {metrics.totalTrades} EXECUTIONS
          </span>
        </div>

        {outcomeData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-slate-500 font-mono text-xs">
            NO DATA LOGGED
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="w-1/2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0D0E15',
                      border: '1px solid rgba(0,240,255,0.4)',
                      borderRadius: '8px',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '11px',
                      color: '#E2E8F0'
                    }}
                  />
                  <Pie
                    data={outcomeData}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {outcomeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#050508" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-1/2 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00FF9D]" /> Wins:
                </span>
                <span className="font-bold text-[#00FF9D] cyber-num">
                  {metrics.wins} ({metrics.winRate}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF2A5F]" /> Losses:
                </span>
                <span className="font-bold text-[#FF2A5F] cyber-num">
                  {metrics.losses} ({metrics.lossRate}%)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Breakeven:
                </span>
                <span className="font-bold text-slate-400 cyber-num">
                  {metrics.breakevens} ({metrics.breakevenRate}%)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Long vs Short Performance Matrix */}
      <div className="p-5 bg-[#0D0E15]/90 border border-cyan-500/20 rounded-2xl cyber-panel">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            <h3 className="font-orbitron text-xs font-bold tracking-wider text-white">
              LONG VS SHORT ASYMMETRY
            </h3>
          </div>
          <span className="text-[10px] font-mono text-purple-400">
            PROFIT FACTOR: {metrics.profitFactor}x
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 font-mono text-xs">
          {/* Long Stats */}
          <div className="p-3 bg-slate-900/60 border border-cyan-500/30 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-cyan-400">
              <span className="flex items-center gap-1 font-bold">
                <ArrowUpRight className="w-4 h-4" /> LONG
              </span>
              <span className="cyber-num">{metrics.longCount} Trades</span>
            </div>
            <div className="text-xl font-bold font-orbitron text-slate-100 cyber-num">
              {metrics.longWinRate}%
            </div>
            <div className="text-[10px] text-slate-400">
              Win Rate on Longs
            </div>
          </div>

          {/* Short Stats */}
          <div className="p-3 bg-slate-900/60 border border-purple-500/30 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-purple-400">
              <span className="flex items-center gap-1 font-bold">
                <ArrowDownRight className="w-4 h-4" /> SHORT
              </span>
              <span className="cyber-num">{metrics.shortCount} Trades</span>
            </div>
            <div className="text-xl font-bold font-orbitron text-slate-100 cyber-num">
              {metrics.shortWinRate}%
            </div>
            <div className="text-[10px] text-slate-400">
              Win Rate on Shorts
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-[11px] font-mono text-slate-400">
          <span>Target R:R Standard: 1:2.0+</span>
          <span className="text-cyan-400">Avg Achieved: {metrics.avgRR}</span>
        </div>
      </div>
    </div>
  );
}
