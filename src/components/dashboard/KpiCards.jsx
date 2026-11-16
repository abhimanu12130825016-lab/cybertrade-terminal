import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  XCircle,
  Crosshair,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { formatCurrency } from '../../utils/calculations';

export default function KpiCards() {
  const { metrics, disciplineAnalytics, currency } = useJournal();

  const isNetProfit = metrics.netPnl >= 0;

  const cards = [
    {
      id: 'net_pnl',
      title: 'NET CUMULATIVE PnL',
      value: formatCurrency(metrics.netPnl, currency),
      subtext: isNetProfit ? 'Positive Expectancy' : 'Drawdown Phase',
      icon: isNetProfit ? TrendingUp : TrendingDown,
      textColor: isNetProfit ? 'text-[#00FF9D]' : 'text-[#FF2A5F]',
      glowColor: isNetProfit ? 'glow-text-emerald' : 'glow-text-crimson',
      borderColor: isNetProfit ? 'border-[#00FF9D]/30' : 'border-[#FF2A5F]/30',
      shadowColor: isNetProfit ? 'shadow-neon-emerald' : 'shadow-neon-crimson',
      tag: `Gross +${formatCurrency(metrics.grossProfit, currency)} | -${formatCurrency(metrics.grossLoss, currency)}`
    },
    {
      id: 'total_trades',
      title: 'TOTAL EXECUTIONS',
      value: metrics.totalTrades,
      subtext: `Long: ${metrics.longCount} | Short: ${metrics.shortCount}`,
      icon: Activity,
      textColor: 'text-cyan-400',
      glowColor: 'glow-text-cyan',
      borderColor: 'border-cyan-500/30',
      shadowColor: 'shadow-neon-cyan',
      tag: metrics.totalTrades > 0 ? 'Statistical Sample' : 'No Trades Yet'
    },
    {
      id: 'win_rate',
      title: 'TRADES SUCCEEDED (WINS)',
      value: `${metrics.winRate}%`,
      subtext: `${metrics.wins} of ${metrics.totalTrades} Winning Trades`,
      icon: CheckCircle2,
      textColor: 'text-[#00FF9D]',
      glowColor: 'glow-text-emerald',
      borderColor: 'border-[#00FF9D]/30',
      shadowColor: 'shadow-neon-emerald',
      tag: `Long WR: ${metrics.longWinRate}% | Short: ${metrics.shortWinRate}%`
    },
    {
      id: 'loss_rate',
      title: 'TRADES FAILED (LOSSES)',
      value: `${metrics.lossRate}%`,
      subtext: `${metrics.losses} Losses (${metrics.breakevens} Breakeven)`,
      icon: XCircle,
      textColor: 'text-[#FF2A5F]',
      glowColor: 'glow-text-crimson',
      borderColor: 'border-[#FF2A5F]/30',
      shadowColor: 'shadow-neon-crimson',
      tag: `Risk Managed: ${metrics.lossRate < 45 ? 'Optimal' : 'Caution'}`
    },
    {
      id: 'avg_rr',
      title: 'AVERAGE RISK-TO-REWARD',
      value: metrics.avgRR,
      subtext: `Profit Factor: ${metrics.profitFactor}x`,
      icon: Scale,
      textColor: 'text-[#B829EA]',
      glowColor: 'glow-text-magenta',
      borderColor: 'border-[#B829EA]/30',
      shadowColor: 'shadow-neon-magenta',
      tag: metrics.avgRRValue >= 2 ? 'Asymmetric Edge' : 'Under 1:2.0 Target'
    },
    {
      id: 'discipline_score',
      title: 'STRATEGY DISCIPLINE SCORE',
      value: `${disciplineAnalytics.overallDisciplineScore}%`,
      subtext: `${disciplineAnalytics.ruleStats.length} Active System Rules Evaluated`,
      icon: ShieldCheck,
      textColor: 'text-amber-400',
      glowColor: 'text-amber-300 drop-shadow-[0_0_8px_#F59E0B]',
      borderColor: 'border-amber-500/30',
      shadowColor: 'shadow-[0_0_15px_rgba(245,158,11,0.25)]',
      tag: disciplineAnalytics.overallDisciplineScore >= 80 ? 'Fortified Psychology' : 'Rules Breached'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`p-5 rounded-2xl bg-[#0D0E15]/90 border ${card.borderColor} ${card.shadowColor} cyber-panel transition-all duration-300 hover:translate-y-[-2px]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider text-slate-400 font-semibold uppercase">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg bg-slate-900/80 border border-slate-800 ${card.textColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className={`font-orbitron text-2xl sm:text-3xl font-black cyber-num ${card.textColor} ${card.glowColor}`}>
                {card.value}
              </div>
              <div className="mt-1 text-xs text-slate-300 font-mono">
                {card.subtext}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="truncate">{card.tag}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 animate-pulse shrink-0 ml-2" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
