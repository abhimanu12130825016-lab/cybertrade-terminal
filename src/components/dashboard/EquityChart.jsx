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

// Custom Cyber Tooltip
function CustomTooltip({ active, payload, label, currency }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isProfit = data.cumulativePnl >= 0;

    return (
      <div className="p-3 bg-[#0D0E15]/95 border border-cyan-500/50 rounded-xl shadow-neon-cyan backdrop-blur-md text-xs font-mono space-y-1">
        <div className="text-cyan-400 font-bold tracking-wider">
          DATE: {data.date}
        </div>
        <div className="flex justify-between gap-4 text-slate-300">
          <span>RUNNING EQUITY:</span>
          <span className={`font-bold ${isProfit ? 'text-[#00FF9D]' : 'text-[#FF2A5F]'}`}>
            {formatCurrency(data.cumulativePnl, currency)}
          </span>
        </div>
        <div className="flex justify-between gap-4 text-slate-400">
          <span>DAILY PnL:</span>
          <span className={`font-semibold ${data.dailyPnl >= 0 ? 'text-[#00FF9D]' : 'text-[#FF2A5F]'}`}>
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
    <div className="p-5 bg-[#0D0E15]/90 border border-cyan-500/20 rounded-2xl cyber-panel">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="font-orbitron text-sm font-bold tracking-wider text-white">
              CUMULATIVE EQUITY CURVE
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Running capital trajectory across executed trading dates
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">PEAK:</span>
          <span className={`font-bold cyber-num ${isNetPositive ? 'text-[#00FF9D]' : 'text-[#FF2A5F]'}`}>
            {formatCurrency(metrics.netPnl, currency)}
          </span>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl text-slate-500 font-mono text-xs">
          <Activity className="w-8 h-8 text-cyan-500/40 mb-2 animate-pulse" />
          <p>NO EXECUTIONS LOGGED FOR THIS TIMEFRAME</p>
          <p className="text-slate-600 mt-1">Add trades via the Logger to chart equity progression.</p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cyberCyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>

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

              <ReferenceLine y={0} stroke="#334155" strokeDasharray="3 3" />

              <Area
                type="monotone"
                dataKey="cumulativePnl"
                stroke="#00F0FF"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#cyberCyanGradient)"
                dot={{ stroke: '#00F0FF', strokeWidth: 2, r: 3, fill: '#050508' }}
                activeDot={{ stroke: '#00F0FF', strokeWidth: 3, r: 5, fill: '#FFFFFF' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
