import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { formatCurrency } from '../../utils/calculations';

function CustomTooltip({ active, payload, currency }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isProfit = data.cumulativePnl >= 0;

    return (
      <div className="p-2.5 bg-[#0D101B] border border-slate-700 rounded-lg shadow-xl text-xs font-mono space-y-1">
        <div className="text-cyan-400 font-semibold">
          Date: {data.date}
        </div>
        <div className="flex justify-between gap-4 text-slate-300">
          <span>Running Equity:</span>
          <span className={`font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(data.cumulativePnl, currency)}
          </span>
        </div>
        <div className="flex justify-between gap-4 text-slate-400 text-[11px]">
          <span>Daily PnL:</span>
          <span className={data.dailyPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
            {formatCurrency(data.dailyPnl, currency)}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

export default function EquityChart() {
  const { chartSeries, currency, metrics } = useJournal();
  const data = chartSeries.equityCurveData;
  const isNetPositive = metrics.netPnl >= 0;

  return (
    <div className="p-4 sm:p-5 bg-[#111420] border border-slate-800 rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="font-orbitron text-xs font-bold tracking-wide text-white">
              CUMULATIVE EQUITY TRAJECTORY
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Running capital across selected dates
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Total:</span>
          <span className={`font-bold font-tabular ${isNetPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(metrics.netPnl, currency)}
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
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D8F6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00D8F6" stopOpacity={0.0} />
                </linearGradient>
              </defs>

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

              <ReferenceLine y={0} stroke="#334155" />

              <Area
                type="monotone"
                dataKey="cumulativePnl"
                stroke="#00D8F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#equityGradient)"
                dot={{ stroke: '#00D8F6', strokeWidth: 1.5, r: 2.5, fill: '#0A0C14' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
