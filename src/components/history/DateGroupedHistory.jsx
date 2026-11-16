import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { formatCurrency } from '../../utils/calculations';
import ConfirmModal from '../common/ConfirmModal';

export default function DateGroupedHistory() {
  const { filteredTrades, deleteTrade, dailyChecks, currency, setActiveTab } = useJournal();

  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');
  const [expandedDates, setExpandedDates] = useState({});
  const [deleteTargetId, setDeleteTargetId] = useState(null);

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

    return Object.values(groups).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [displayedTrades]);

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

  return (
    <div className="space-y-5">
      {/* Header & Controls Bar */}
      <div className="p-4 bg-[#111420] border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-orbitron text-sm font-bold text-white tracking-wide">
              DATE-GROUPED TRADE ARCHIVE
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              {displayedTrades.length} Trades across {groupedByDate.length} Active Days
            </p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter ticker, notes..."
              className="pl-8 pr-3 py-1.5 bg-[#090B12] border border-slate-800 focus:border-cyan-400 focus:outline-none rounded-lg text-slate-200 w-44"
            />
          </div>

          <div className="flex items-center bg-[#090B12] border border-slate-800 rounded-lg p-0.5">
            {['ALL', 'SUCCEEDED', 'FAILED', 'BREAKEVEN'].map((o) => (
              <button
                key={o}
                onClick={() => setOutcomeFilter(o)}
                className={`px-2 py-1 rounded text-[10px] transition-colors ${
                  outcomeFilter === o
                    ? 'bg-slate-800 text-cyan-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {o === 'SUCCEEDED' ? 'WINS' : o === 'FAILED' ? 'LOSSES' : o}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date Grouped List */}
      {groupedByDate.length === 0 ? (
        <div className="p-8 text-center bg-[#111420] border border-dashed border-slate-800 rounded-xl">
          <CalendarDays className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-mono">No trade executions found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {groupedByDate.map((group) => {
            const isExpanded = expandedDates[group.date] !== false;
            const dayCheck = dailyChecks[group.date];
            const followedCount = Object.values(dayCheck?.rulesFollowed || {}).filter(Boolean).length;
            const hasCheckRecord = Boolean(dayCheck && Object.keys(dayCheck.rulesFollowed || {}).length > 0);

            return (
              <div
                key={group.date}
                className="bg-[#111420] border border-slate-800 rounded-xl overflow-hidden"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleDateAccordion(group.date)}
                  className="p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer bg-slate-900/60 hover:bg-slate-900 transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-orbitron font-bold text-sm text-white">
                      {group.date}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                      {group.trades.length} {group.trades.length === 1 ? 'Trade' : 'Trades'}
                    </span>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      <span className="text-emerald-400 font-medium">{group.wins}W</span>
                      <span>/</span>
                      <span className="text-rose-400 font-medium">{group.losses}L</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    {hasCheckRecord && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-slate-950 border border-slate-800 text-slate-300">
                        <ShieldCheck className="w-3 h-3 text-purple-400" />
                        <span>{followedCount}/{Object.keys(dayCheck.rulesFollowed).length} Rules</span>
                      </span>
                    )}

                    <div
                      className={`px-2.5 py-1 rounded-md border text-xs font-bold font-tabular ${
                        group.totalPnl >= 0
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
                      }`}
                    >
                      {formatCurrency(group.totalPnl, currency)}
                    </div>

                    <div className="text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Individual Trade Cards */}
                {isExpanded && (
                  <div className="p-3 sm:p-4 pt-3 border-t border-slate-800 space-y-2.5">
                    {dayCheck?.notes && (
                      <div className="p-2.5 bg-purple-950/20 border border-purple-500/20 rounded-lg text-xs font-mono text-purple-300 italic">
                        "{dayCheck.notes}"
                      </div>
                    )}

                    <div className="space-y-2">
                      {group.trades.map((trade, idx) => {
                        const isWin = trade.outcome === 'SUCCEEDED' || trade.pnl > 0;
                        const isLoss = trade.outcome === 'FAILED' || trade.pnl < 0;

                        return (
                          <div
                            key={trade.id}
                            className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2 font-mono text-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 bg-slate-950 text-slate-400 rounded text-[10px]">
                                  #{idx + 1}
                                </span>
                                <span className="font-bold text-white text-sm">
                                  {trade.asset}
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                    trade.direction === 'LONG'
                                      ? 'bg-cyan-950 text-cyan-300'
                                      : 'bg-purple-950 text-purple-300'
                                  }`}
                                >
                                  {trade.direction}
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                                    isWin
                                      ? 'bg-emerald-950 text-emerald-400'
                                      : isLoss
                                      ? 'bg-rose-950 text-rose-400'
                                      : 'bg-slate-800 text-slate-300'
                                  }`}
                                >
                                  {trade.outcome}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span
                                  className={`text-sm font-bold font-tabular ${
                                    trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                                  }`}
                                >
                                  {formatCurrency(trade.pnl, currency)}
                                </span>

                                <button
                                  onClick={() => setDeleteTargetId(trade.id)}
                                  className="p-1 text-slate-500 hover:text-rose-400 rounded"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 bg-[#090B12] rounded text-slate-400 text-[11px]">
                              <div>Entry: <span className="text-slate-200 font-semibold">{trade.entryPrice}</span></div>
                              <div>SL: <span className="text-rose-400 font-semibold">{trade.stopLoss}</span></div>
                              <div>TP: <span className="text-emerald-400 font-semibold">{trade.targetPrice}</span></div>
                              <div>R:R: <span className="text-purple-300 font-bold">{trade.plannedRR}</span></div>
                            </div>

                            {trade.notes && (
                              <p className="text-slate-400 text-[11px] italic">
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Trade Execution"
        message="Are you sure you wish to delete this trade from history? This action is permanent."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => {
          if (deleteTargetId) deleteTrade(deleteTargetId);
          setDeleteTargetId(null);
        }}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
