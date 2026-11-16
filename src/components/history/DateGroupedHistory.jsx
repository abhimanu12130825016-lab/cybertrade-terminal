import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { formatCurrency } from '../../utils/calculations';
import ConfirmModal from '../common/ConfirmModal';

export default function DateGroupedHistory() {
  const { filteredTrades, deleteTrade, dailyChecks, rules, currency, setActiveTab } = useJournal();

  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');
  const [expandedDates, setExpandedDates] = useState({});
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Filter trades by search & outcome
  const displayedTrades = useMemo(() => {
    return filteredTrades.filter((trade) => {
      const matchSearch =
        !searchQuery ||
        trade.asset?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trade.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trade.date?.includes(searchQuery);

      const matchOutcome =
        outcomeFilter === 'ALL' || trade.outcome === outcomeFilter;

      return matchSearch && matchOutcome;
    });
  }, [filteredTrades, searchQuery, outcomeFilter]);

  // Group trades by date
  const groupedByDate = useMemo(() => {
    const groups = {};
    displayedTrades.forEach((trade) => {
      const d = trade.date || 'Unspecified Date';
      if (!groups[d]) {
        groups[d] = {
          date: d,
          trades: [],
          totalPnl: 0,
          wins: 0,
          losses: 0,
          breakevens: 0
        };
      }
      groups[d].trades.push(trade);
      const val = parseFloat(trade.pnl) || 0;
      groups[d].totalPnl += val;
      if (trade.outcome === 'SUCCEEDED' || val > 0) groups[d].wins++;
      else if (trade.outcome === 'FAILED' || val < 0) groups[d].losses++;
      else groups[d].breakevens++;
    });

    // Sort dates descending (newest first)
    return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [displayedTrades]);

  // Auto expand all dates initially
  React.useEffect(() => {
    const initial = {};
    groupedByDate.forEach((g) => {
      initial[g.date] = true;
    });
    setExpandedDates(initial);
  }, [groupedByDate.length]);

  const toggleDateAccordion = (date) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const expandAll = () => {
    const all = {};
    groupedByDate.forEach((g) => (all[g.date] = true));
    setExpandedDates(all);
  };

  const collapseAll = () => {
    setExpandedDates({});
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="p-4 sm:p-5 bg-[#0D0E15]/90 border border-cyan-500/20 rounded-2xl cyber-panel flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-orbitron text-lg font-bold text-white tracking-wide">
              DATE-GROUPED TRADE ARCHIVE
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              {displayedTrades.length} Trades across {groupedByDate.length} Active Trading Days
            </p>
          </div>
        </div>

        {/* Search & Outcome Filter */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticker, notes, date..."
              className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none rounded-lg text-slate-200 w-44 sm:w-56"
            />
          </div>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            {['ALL', 'SUCCEEDED', 'FAILED', 'BREAKEVEN'].map((o) => (
              <button
                key={o}
                onClick={() => setOutcomeFilter(o)}
                className={`px-2 py-1 rounded text-[10px] transition-all ${
                  outcomeFilter === o
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {o === 'SUCCEEDED' ? 'WINS' : o === 'FAILED' ? 'LOSSES' : o}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={expandAll}
              className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded text-[11px]"
            >
              Expand
            </button>
            <button
              onClick={collapseAll}
              className="px-2 py-1 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded text-[11px]"
            >
              Collapse
            </button>
          </div>
        </div>
      </div>

      {/* Date Grouped List */}
      {groupedByDate.length === 0 ? (
        <div className="p-12 text-center bg-[#0D0E15]/80 border border-dashed border-slate-800 rounded-2xl">
          <CalendarDays className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
          <h3 className="font-orbitron text-base text-slate-300 font-bold">
            NO TRADE EXECUTIONS FOUND
          </h3>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Try adjusting your search query, outcome filter, or timeframe selector.
          </p>
          <button
            onClick={() => setActiveTab('logger')}
            className="mt-4 px-4 py-2 cyber-btn-cyan rounded-lg text-xs font-mono font-bold"
          >
            Log New Trade
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {groupedByDate.map((group) => {
            const isExpanded = expandedDates[group.date] !== false;
            const dayCheck = dailyChecks[group.date];
            const followedCount = Object.values(dayCheck?.rulesFollowed || {}).filter(Boolean).length;
            const hasCheckRecord = Boolean(dayCheck && Object.keys(dayCheck.rulesFollowed || {}).length > 0);

            return (
              <div
                key={group.date}
                className="bg-[#0D0E15]/90 border border-slate-800/80 hover:border-cyan-500/30 rounded-2xl overflow-hidden cyber-panel transition-all"
              >
                {/* Accordion Date Header */}
                <div
                  onClick={() => toggleDateAccordion(group.date)}
                  className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer bg-gradient-to-r from-slate-900/60 to-transparent hover:bg-slate-900/80 transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-cyan-400">
                      <CalendarDays className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-orbitron font-bold text-base text-white tracking-wide">
                          {group.date}
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                          {group.trades.length} {group.trades.length === 1 ? 'Trade' : 'Trades'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                        <span className="text-[#00FF9D] font-semibold">{group.wins} Wins</span>
                        <span>•</span>
                        <span className="text-[#FF2A5F] font-semibold">{group.losses} Losses</span>
                        {group.breakevens > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-slate-400">{group.breakevens} BE</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badges: Net PnL & Discipline Status */}
                  <div className="flex items-center gap-3 font-mono">
                    {/* Strategy Rules Adherence Badge */}
                    {hasCheckRecord && (
                      <span
                        className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border ${
                          followedCount === Object.keys(dayCheck.rulesFollowed).length
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{followedCount}/{Object.keys(dayCheck.rulesFollowed).length} Rules Followed</span>
                      </span>
                    )}

                    {/* Daily Net PnL Badge */}
                    <div
                      className={`px-3 py-1.5 rounded-xl border text-sm font-bold cyber-num ${
                        group.totalPnl >= 0
                          ? 'bg-emerald-950/40 border-[#00FF9D]/40 text-[#00FF9D] shadow-neon-emerald'
                          : 'bg-rose-950/40 border-[#FF2A5F]/40 text-[#FF2A5F] shadow-neon-crimson'
                      }`}
                    >
                      {formatCurrency(group.totalPnl, currency)}
                    </div>

                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Individual Trade Cards */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/80 space-y-3">
                    {dayCheck?.notes && (
                      <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs font-mono text-purple-300 italic mb-3">
                        <span className="font-bold uppercase text-[10px] tracking-wider block text-purple-400 mb-0.5">
                          Daily Session Rationale & Psychology:
                        </span>
                        "{dayCheck.notes}"
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3">
                      {group.trades.map((trade, idx) => {
                        const isWin = trade.outcome === 'SUCCEEDED' || trade.pnl > 0;
                        const isLoss = trade.outcome === 'FAILED' || trade.pnl < 0;

                        return (
                          <div
                            key={trade.id}
                            className="p-4 bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/30 rounded-xl transition-all space-y-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 text-xs font-mono bg-slate-950 text-cyan-400 rounded border border-slate-800 font-bold">
                                  Trade #{idx + 1}
                                </span>
                                <span className="font-orbitron font-bold text-white text-base">
                                  {trade.asset}
                                </span>
                                <span
                                  className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded flex items-center gap-1 ${
                                    trade.direction === 'LONG'
                                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                                      : 'bg-purple-950 text-purple-300 border border-purple-500/40'
                                  }`}
                                >
                                  {trade.direction === 'LONG' ? (
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  ) : (
                                    <ArrowDownRight className="w-3.5 h-3.5" />
                                  )}
                                  {trade.direction}
                                </span>

                                <span
                                  className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded ${
                                    isWin
                                      ? 'bg-emerald-950 text-[#00FF9D] border border-emerald-500/40'
                                      : isLoss
                                      ? 'bg-rose-950 text-[#FF2A5F] border border-rose-500/40'
                                      : 'bg-slate-800 text-slate-300'
                                  }`}
                                >
                                  {trade.outcome || (isWin ? 'WIN' : 'LOSS')}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 font-mono">
                                <div className="text-right">
                                  <span className="text-[10px] text-slate-500 block">REALIZED</span>
                                  <span
                                    className={`text-base font-bold cyber-num ${
                                      trade.pnl >= 0 ? 'text-[#00FF9D]' : 'text-[#FF2A5F]'
                                    }`}
                                  >
                                    {formatCurrency(trade.pnl, currency)}
                                  </span>
                                </div>

                                <button
                                  onClick={() => setDeleteTargetId(trade.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                                  title="Purge trade record"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Execution Pricing Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg text-xs font-mono">
                              <div>
                                <span className="text-slate-500 text-[10px] block">ENTRY</span>
                                <span className="font-semibold text-slate-200 cyber-num">
                                  {trade.entryPrice}
                                </span>
                              </div>
                              <div>
                                <span className="text-rose-500 text-[10px] block">STOP LOSS</span>
                                <span className="font-semibold text-rose-300 cyber-num">
                                  {trade.stopLoss}
                                </span>
                              </div>
                              <div>
                                <span className="text-emerald-500 text-[10px] block">TARGET (TP)</span>
                                <span className="font-semibold text-emerald-300 cyber-num">
                                  {trade.targetPrice}
                                </span>
                              </div>
                              <div>
                                <span className="text-purple-400 text-[10px] block">PLANNED R:R</span>
                                <span className="font-bold text-purple-300 cyber-num">
                                  {trade.plannedRR}
                                </span>
                              </div>
                            </div>

                            {/* Notes */}
                            {trade.notes && (
                              <p className="text-xs text-slate-300 font-mono italic leading-relaxed">
                                "{trade.notes}"
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Delete Action */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="PURGE TRADE EXECUTION"
        message="Are you sure you wish to delete this trade from history? This action is irreversible and will immediately recalculate all cumulative statistics."
        confirmText="Confirm Purge"
        cancelText="Abort"
        onConfirm={() => {
          if (deleteTargetId) deleteTrade(deleteTargetId);
          setDeleteTargetId(null);
        }}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
