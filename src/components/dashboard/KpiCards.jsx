import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  XCircle,
  Scale,
  ShieldCheck
} from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { formatCurrency } from '../../utils/calculations';

export default function KpiCards() {
  const { metrics, disciplineAnalytics, currency } = useJournal();

  const isNetProfit = metrics.netPnl >= 0;

  const cards = [
    {
      id: 'net_pnl',
      title: 'Net Realized PnL',
      value: formatCurrency(metrics.netPnl, currency),
      subtext: isNetProfit ? 'Positive Expectancy' : 'Drawdown Phase',
      icon: isNetProfit ? TrendingUp : TrendingDown,
      textColor: isNetProfit ? 'text-emerald-400' : 'text-rose-400',
      tag: `Gross +${formatCurrency(metrics.grossProfit, currency)} | -${formatCurrency(metrics.grossLoss, currency)}`
    },
    {
      id: 'total_trades',
      title: 'Total Executions',
      value: metrics.totalTrades,
      subtext: `Long: ${metrics.longCount} | Short: ${metrics.shortCount}`,
      icon: Activity,
      textColor: 'text-cyan-400',
      tag: metrics.totalTrades > 0 ? 'Statistical Sample' : 'No Trades Yet'
    },
    {
      id: 'win_rate',
      title: 'Win Rate',
      value: `${metrics.winRate}%`,
      subtext: `${metrics.wins} Wins of ${metrics.totalTrades} Trades`,
      icon: CheckCircle2,
      textColor: 'text-emerald-400',
      tag: `Long: ${metrics.longWinRate}% | Short: ${metrics.shortWinRate}%`
    },
    {
      id: 'loss_rate',
      title: 'Loss Rate',
      value: `${metrics.lossRate}%`,
      subtext: `${metrics.losses} Losses (${metrics.breakevens} Even)`,
      icon: XCircle,
      textColor: 'text-rose-400',
      tag: `Risk Managed: ${metrics.lossRate < 45 ? 'Optimal' : 'Caution'}`
    },
    {
      id: 'avg_rr',
      title: 'Average Risk:Reward',
      value: metrics.avgRR,
      subtext: `Profit Factor: ${metrics.profitFactor}x`,
      icon: Scale,
      textColor: 'text-purple-400',
      tag: metrics.avgRRValue >= 2 ? 'Asymmetric Edge' : 'Under 1:2.0'
    },
    {
      id: 'discipline_score',
      title: 'Discipline Score',
      value: `${disciplineAnalytics.overallDisciplineScore}%`,
      subtext: `${disciplineAnalytics.ruleStats.length} Strategy Rules Monitored`,
      icon: ShieldCheck,
      textColor: 'text-amber-400',
      tag: disciplineAnalytics.overallDisciplineScore >= 80 ? 'Disciplined' : 'Rules Breached'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="p-4 rounded-xl bg-[#111420] border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 font-medium">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-md bg-slate-900 border border-slate-800 ${card.textColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2.5">
              <div className={`font-orbitron text-2xl font-bold font-tabular ${card.textColor}`}>
                {card.value}
              </div>
              <div className="mt-0.5 text-xs text-slate-400 font-mono">
                {card.subtext}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="truncate">{card.tag}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
