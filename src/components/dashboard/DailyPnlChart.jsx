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
      <div className="p-2.5 bg-[#0D101B] border border-slate-700 rounded-lg shadow-xl text-xs font-mono space-y-1">
        <div className="text-cyan-400 font-semibold">
          Date: {data.date}
        </div>
        <div className="flex justify-between gap-4 text-slate-300">
          <span>Daily Net PnL:</span>
          <span className={`font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(data.pnl, currency)}
          </span>
        </div>
        <div className="flex justify-between gap-4 text-slate-400 text-[11px]">
          <span>Trades:</span>
          <span>{data.count} ({data.wins}W / {data.losses}L)</span>
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
    <div className="p-4 sm:p-5 bg-[#111420] border border-slate-800 rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="font-orbitron text-xs font-bold tracking-wide text-white">
              DAILY REALIZED PnL
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Green = Profit Day | Red = Loss Day
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Profit
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400" /> Loss
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-lg text-slate-500 font-mono text-xs">
          <Activity className="w-6 h-6 text-slate-600 mb-2" />
          <p>No executions in this timeframe.</p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2436" vertical={false} />

              <XAxis
                dataKey="date"
                stroke="#475569"
                tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(str) => (str ? str.slice(5) : '')}
              />

              <YAxis
                stroke="#475569"
                tick={{ fill: '#94A3B8', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                tickFormatter={(val) => `${currency}${val}`}
              />

              <Tooltip content={<CustomTooltip currency={currency} />} />

              <ReferenceLine y={0} stroke="#475569" />

              <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? '#10B981' : '#F43F5E'}
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
