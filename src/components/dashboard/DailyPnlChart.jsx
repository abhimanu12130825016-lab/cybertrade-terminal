import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine
} from 'recharts';
import { BarChart3, Activity } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { formatCurrency } from '../../utils/calculations';

function CustomTooltip({ active, payload, currency }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isProfit = data.pnl >= 0;

    return (
      <div className="p-3 bg-[#0D0E15]/95 border border-cyan-500/50 rounded-xl shadow-neon-cyan backdrop-blur-md text-xs font-mono space-y-1">
        <div className="text-cyan-400 font-bold tracking-wider">
          DATE: {data.date}
        </div>
        <div className="flex justify-between gap-4 text-slate-300">
          <span>DAILY NET PnL:</span>
          <span className={`font-bold ${isProfit ? 'text-[#00FF9D]' : 'text-[#FF2A5F]'}`}>
            {formatCurrency(data.pnl, currency)}
          </span>
        </div>
        <div className="flex justify-between gap-4 text-slate-400">
          <span>TRADES TAKEN:</span>
          <span className="text-white font-semibold">
            {data.count} ({data.wins}W / {data.losses}L)
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default function DailyPnlChart() {
  const { chartSeries, currency } = useJournal();
  const data = chartSeries.dailyPnlData;

  return (
    <div className="p-5 bg-[#0D0E15]/90 border border-cyan-500/20 rounded-2xl cyber-panel">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#00FF9D]" />
            <h3 className="font-orbitron text-sm font-bold tracking-wider text-white">
              DAILY REALIZED PnL DISTRIBUTION
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Emerald = Winning Day | Crimson = Loss Day
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-[#00FF9D]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#00FF9D]" /> Win Day
          </span>
          <span className="flex items-center gap-1.5 text-[#FF2A5F]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FF2A5F]" /> Loss Day
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl text-slate-500 font-mono text-xs">
          <Activity className="w-8 h-8 text-cyan-500/40 mb-2 animate-pulse" />
          <p>NO DAILY PnL LOGGED FOR THIS TIMEFRAME</p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" opacity={0.6} />

              <XAxis
                dataKey="date"
                stroke="#64748B"
                tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(str) => (str ? str.slice(5) : '')}
              />

              <YAxis
                stroke="#64748B"
                tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(val) => `${currency}${val}`}
              />

              <Tooltip content={<CustomTooltip currency={currency} />} />

              <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5} />

              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? '#00FF9D' : '#FF2A5F'}
                    stroke={entry.pnl >= 0 ? '#00FF9D' : '#FF2A5F'}
                    opacity={0.9}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
