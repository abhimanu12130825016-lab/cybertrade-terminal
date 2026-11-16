import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  MinusCircle,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit2,
  DollarSign
} from 'lucide-react';
import { useJournal } from '../../context/JournalContext';
import { calculateRiskReward, formatCurrency } from '../../utils/calculations';
import ConfirmModal from '../common/ConfirmModal';

export default function DateTradeLogger() {
  const {
    trades,
    addTrade,
    editTrade,
    deleteTrade,
    rules,
    dailyChecks,
    toggleDailyRule,
    updateDailyNotes,
    currency
  } = useJournal();

  // Selected date defaults to local today (or current 2026-11-17)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  // Form State
  const [editingTradeId, setEditingTradeId] = useState(null);
  const [asset, setAsset] = useState('BTC/USDT');
  const [direction, setDirection] = useState('LONG');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [outcome, setOutcome] = useState('SUCCEEDED');
  const [pnl, setPnl] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState(null);

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Quick asset suggestions
  const assetSuggestions = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'NIFTY', 'NVDA', 'AAPL', 'TSLA', 'XAUUSD'];

  // Trades logged specifically under this date
  const dateTrades = useMemo(() => {
    return trades.filter((t) => t.date === selectedDate);
  }, [trades, selectedDate]);

  // Date totals
  const dateTotalPnl = useMemo(() => {
    return dateTrades.reduce((acc, t) => acc + (parseFloat(t.pnl) || 0), 0);
  }, [dateTrades]);

  // Active strategy rules for the daily checklist
  const activeRules = useMemo(() => {
    return rules.filter((r) => r.active !== false);
  }, [rules]);

  // Current day's checklist record
  const dayCheckRecord = dailyChecks[selectedDate] || { rulesFollowed: {}, notes: '' };

  // Calculate Real-Time Risk to Reward
  const rrCalculation = useMemo(() => {
    if (!entryPrice || !stopLoss || !targetPrice) {
      return {
        ratioValue: 0,
        ratioText: '1 : 0.00',
        riskPercent: 0,
        rewardPercent: 0,
        isValid: false,
        isInverted: false,
        warning: null
      };
    }
    return calculateRiskReward(entryPrice, stopLoss, targetPrice, direction);
  }, [entryPrice, stopLoss, targetPrice, direction]);

  // Navigate dates
  const handleDateShift = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  // Reset form
  const resetForm = () => {
    setEditingTradeId(null);
    setAsset('BTC/USDT');
    setDirection('LONG');
    setEntryPrice('');
    setStopLoss('');
    setTargetPrice('');
    setOutcome('SUCCEEDED');
    setPnl('');
    setNotes('');
    setFormError(null);
  };

  // Populate form for editing
  const handleStartEdit = (trade) => {
    setEditingTradeId(trade.id);
    setSelectedDate(trade.date);
    setAsset(trade.asset || '');
    setDirection(trade.direction || 'LONG');
    setEntryPrice(trade.entryPrice || '');
    setStopLoss(trade.stopLoss || '');
    setTargetPrice(trade.targetPrice || '');
    setOutcome(trade.outcome || 'SUCCEEDED');
    setPnl(trade.pnl !== undefined ? trade.pnl : '');
    setNotes(trade.notes || '');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  // Submit Trade
  const handleSubmitTrade = (e) => {
    e.preventDefault();
    setFormError(null);

    const numEntry = parseFloat(entryPrice);
    const numSl = parseFloat(stopLoss);
    const numTp = parseFloat(targetPrice);
    const numPnl = parseFloat(pnl) || 0;

    if (!asset.trim()) {
      setFormError('Asset / Ticker Symbol is mandatory.');
      return;
    }
    if (isNaN(numEntry) || numEntry <= 0) {
      setFormError('Valid Entry Price is mandatory.');
      return;
    }
    if (isNaN(numSl) || numSl <= 0) {
      setFormError('Valid Stop Loss Price is mandatory.');
      return;
    }
    if (isNaN(numTp) || numTp <= 0) {
      setFormError('Valid Target (TP) Price is mandatory.');
      return;
    }

    if (rrCalculation.isInverted) {
      setFormError(rrCalculation.warning || 'Stop loss and target logic is inverted.');
      return;
    }

    const tradePayload = {
      date: selectedDate,
      asset: asset.toUpperCase().trim(),
      direction,
      entryPrice: numEntry,
      stopLoss: numSl,
      targetPrice: numTp,
      plannedRR: rrCalculation.ratioText,
      riskPercent: rrCalculation.riskPercent,
      outcome,
      pnl: outcome === 'BREAKEVEN' ? 0 : numPnl,
      pnlType: currency,
      notes: notes.trim()
    };

    if (editingTradeId) {
      editTrade(editingTradeId, tradePayload);
      resetForm();
    } else {
      addTrade(tradePayload);
      if (outcome === 'SUCCEEDED' && numPnl > 0) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#00FF9D', '#00F0FF', '#B829EA']
        });
      }
      resetForm();
    }
  };

  return (
    <div className="space-y-6">
      {/* Date Header Controller */}
      <div className="p-4 sm:p-5 bg-[#0D0E15]/90 border border-cyan-500/20 rounded-2xl cyber-panel flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-orbitron text-lg font-bold text-white tracking-wide">
              DATE-GROUPED TRADE LOGGER
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Multiple executions & strategy adherence checklist per trading day
            </p>
          </div>
        </div>

        {/* Date Selector & Shift Controls */}
        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={() => handleDateShift(-1)}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-cyan-500/30 rounded-lg text-sm text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          />

          <button
            onClick={() => handleDateShift(1)}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white rounded-lg transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSelectedDate(todayStr)}
            className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-400 rounded-lg"
          >
            Today
          </button>
        </div>
      </div>

      {/* Daily Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs font-mono">
          <span className="text-slate-400 block">EXECUTIONS ON {selectedDate}:</span>
          <span className="text-lg font-bold text-cyan-400 cyber-num">
            {dateTrades.length} Trades Logged
          </span>
        </div>

        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs font-mono">
          <span className="text-slate-400 block">DAILY REALIZED PnL:</span>
          <span
            className={`text-lg font-bold cyber-num ${
              dateTotalPnl >= 0 ? 'text-[#00FF9D]' : 'text-[#FF2A5F]'
            }`}
          >
            {formatCurrency(dateTotalPnl, currency)}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs font-mono">
          <span className="text-slate-400 block">DISCIPLINE CHECKLIST:</span>
          <span className="text-lg font-bold text-purple-400 cyber-num">
            {Object.values(dayCheckRecord.rulesFollowed || {}).filter(Boolean).length} / {activeRules.length} Rules Followed
          </span>
        </div>
      </div>

      {/* Main 2-Column Split: Form (Left) & Daily Rules Checklist (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Trade Entry Form */}
        <div className="lg:col-span-7 bg-[#0D0E15]/90 border border-cyan-500/30 rounded-2xl p-5 cyber-panel">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <h3 className="font-orbitron text-sm font-bold text-white tracking-wide">
                {editingTradeId ? 'MODIFY EXECUTION RECORD' : 'LOG NEW TRADE ENTRY'}
              </h3>
            </div>
            {editingTradeId && (
              <button
                onClick={resetForm}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                Abort Edit
              </button>
            )}
          </div>

          {formError && (
            <div className="mb-4 p-3 bg-rose-950/50 border border-rose-500/40 rounded-lg flex items-center gap-2 text-xs text-rose-300 font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitTrade} className="space-y-4 font-mono text-xs">
            {/* Ticker & Direction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">
                  ASSET / TICKER SYMBOL
                </label>
                <input
                  type="text"
                  required
                  value={asset}
                  onChange={(e) => setAsset(e.target.value.toUpperCase())}
                  placeholder="BTC/USDT, NIFTY, AAPL"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 focus:outline-none rounded-lg text-slate-100 font-bold uppercase tracking-wider"
                />
                {/* Quick suggestions */}
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {assetSuggestions.slice(0, 5).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAsset(s)}
                      className="px-1.5 py-0.5 text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded border border-slate-800"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">EXECUTION DIRECTION</label>
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  <button
                    type="button"
                    onClick={() => setDirection('LONG')}
                    className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                      direction === 'LONG'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-neon-cyan'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                    <span>LONG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDirection('SHORT')}
                    className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                      direction === 'SHORT'
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-400 shadow-neon-magenta'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <ArrowDownRight className="w-4 h-4 text-purple-400" />
                    <span>SHORT</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Entry, Stop Loss, Target Prices */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-slate-400 mb-1">ENTRY PRICE</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-100 cyber-num text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 text-rose-400">
                  STOP LOSS (SL)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 focus:border-rose-400 rounded-lg text-slate-100 cyber-num text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 text-emerald-400">
                  TARGET (TP)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-lg text-slate-100 cyber-num text-sm font-semibold"
                />
              </div>
            </div>

            {/* Real-Time Auto-Calculated Risk:Reward & Inversion Alert */}
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">PLANNED RISK-TO-REWARD:</span>
                <span
                  className={`text-base font-bold font-orbitron cyber-num ${
                    rrCalculation.ratioValue >= 2
                      ? 'text-[#00FF9D] glow-text-emerald'
                      : rrCalculation.ratioValue > 0
                      ? 'text-cyan-400'
                      : 'text-slate-500'
                  }`}
                >
                  {rrCalculation.ratioText}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60 pt-1.5">
                <span>Calculated Stop Risk:</span>
                <span className="text-rose-400 cyber-num font-semibold">
                  {rrCalculation.riskPercent}%
                </span>
              </div>

              {rrCalculation.warning && (
                <div className="p-2 bg-rose-950/60 border border-rose-500/50 rounded-lg text-[11px] text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{rrCalculation.warning}</span>
                </div>
              )}
            </div>

            {/* Outcome & Realized Net PnL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">OUTCOME STATUS</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOutcome('SUCCEEDED')}
                    className={`py-2 px-1 rounded-lg font-bold text-center text-[11px] transition-all ${
                      outcome === 'SUCCEEDED'
                        ? 'bg-emerald-500/20 text-[#00FF9D] border border-[#00FF9D] shadow-neon-emerald'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    WIN
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutcome('FAILED')}
                    className={`py-2 px-1 rounded-lg font-bold text-center text-[11px] transition-all ${
                      outcome === 'FAILED'
                        ? 'bg-rose-500/20 text-[#FF2A5F] border border-[#FF2A5F] shadow-neon-crimson'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    LOSS
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutcome('BREAKEVEN')}
                    className={`py-2 px-1 rounded-lg font-bold text-center text-[11px] transition-all ${
                      outcome === 'BREAKEVEN'
                        ? 'bg-slate-700/40 text-slate-200 border border-slate-400'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    EVEN
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  REALIZED NET PnL ({currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 font-bold">
                    {currency}
                  </span>
                  <input
                    type="number"
                    step="any"
                    disabled={outcome === 'BREAKEVEN'}
                    value={outcome === 'BREAKEVEN' ? 0 : pnl}
                    onChange={(e) => setPnl(e.target.value)}
                    placeholder={outcome === 'FAILED' ? '-450.00' : '980.00'}
                    className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-100 cyber-num text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Rich Notes */}
            <div>
              <label className="block text-slate-400 mb-1">
                SETUP RATIONALE, MARKET CONDITIONS & EMOTIONAL STATE
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key setup catalyst: 15m candle close, liquidity sweep, calm mindset, followed 1% risk..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-200 font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 cyber-btn-cyan rounded-xl uppercase font-bold tracking-wider text-xs shadow-neon-cyan"
            >
              {editingTradeId ? 'Save Modifications' : `Save Trade Under Date [${selectedDate}]`}
            </button>
          </form>
        </div>

        {/* Right Column: Daily Strategy Checklist for this specific trading date */}
        <div className="lg:col-span-5 bg-[#0D0E15]/90 border border-purple-500/30 rounded-2xl p-5 cyber-panel">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
              <h3 className="font-orbitron text-sm font-bold text-white tracking-wide">
                DAILY STRATEGY CHECKLIST
              </h3>
            </div>
            <span className="text-[10px] font-mono text-purple-300">
              DATE: {selectedDate}
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono mb-4 leading-relaxed">
            Mark which core rules you strictly obeyed or violated during today’s session. This feeds the psychology correlation engine.
          </p>

          <div className="space-y-2.5 mb-5">
            {activeRules.map((rule) => {
              const isChecked = dayCheckRecord.rulesFollowed?.[rule.id] === true;

              return (
                <div
                  key={rule.id}
                  onClick={() => toggleDailyRule(selectedDate, rule.id, !isChecked)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-100 shadow-neon-emerald'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                      isChecked
                        ? 'bg-[#00FF9D] border-[#00FF9D] text-slate-950 font-black'
                        : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-4 h-4 text-slate-950" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isChecked ? 'text-[#00FF9D]' : 'text-slate-300'}`}>
                        {rule.title}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 uppercase">
                        {rule.category}
                      </span>
                    </div>
                    {rule.description && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {rule.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily Psychological Journal Note */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              DAILY SESSION REFLECTION & PSYCHOLOGY
            </label>
            <textarea
              rows={3}
              value={dayCheckRecord.notes || ''}
              onChange={(e) => updateDailyNotes(selectedDate, e.target.value)}
              placeholder="How was emotional state today? Any FOMO, impatience, or hesitation experienced?"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-purple-400 rounded-lg text-slate-200 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Trades Logged Under Selected Date */}
      <div className="bg-[#0D0E15]/90 border border-cyan-500/20 rounded-2xl p-5 cyber-panel">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="font-orbitron text-sm font-bold text-white tracking-wide">
              EXECUTIONS FOR {selectedDate} ({dateTrades.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Net: <strong className={dateTotalPnl >= 0 ? 'text-[#00FF9D]' : 'text-[#FF2A5F]'}>{formatCurrency(dateTotalPnl, currency)}</strong>
          </span>
        </div>

        {dateTrades.length === 0 ? (
          <div className="py-8 text-center text-slate-500 font-mono text-xs">
            NO TRADES RECORDED ON THIS DATE YET. USE THE FORM ABOVE TO LOG ONE.
          </div>
        ) : (
          <div className="space-y-3">
            {dateTrades.map((trade, idx) => (
              <div
                key={trade.id}
                className="p-4 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 rounded-xl transition-all flex flex-wrap items-center justify-between gap-4 font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-slate-950 text-cyan-400 font-bold rounded border border-slate-800 text-[11px]">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{trade.asset}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          trade.direction === 'LONG'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                            : 'bg-purple-950 text-purple-300 border border-purple-500/40'
                        }`}
                      >
                        {trade.direction}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          trade.outcome === 'SUCCEEDED'
                            ? 'bg-emerald-950 text-[#00FF9D] border border-emerald-500/40'
                            : trade.outcome === 'FAILED'
                            ? 'bg-rose-950 text-[#FF2A5F] border border-rose-500/40'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {trade.outcome}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 flex gap-3">
                      <span>Entry: {trade.entryPrice}</span>
                      <span>SL: {trade.stopLoss}</span>
                      <span>TP: {trade.targetPrice}</span>
                      <span className="text-purple-300">R:R {trade.plannedRR}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block">REALIZED PnL</span>
                    <span
                      className={`text-base font-bold cyber-num ${
                        trade.pnl >= 0 ? 'text-[#00FF9D]' : 'text-[#FF2A5F]'
                      }`}
                    >
                      {formatCurrency(trade.pnl, currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleStartEdit(trade)}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Trade"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(trade.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete Trade"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {trade.notes && (
                  <div className="w-full pt-2 border-t border-slate-800/60 text-slate-300 text-[11px] italic">
                    "{trade.notes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="PURGE TRADE EXECUTION"
        message="Are you sure you wish to permanently purge this trade record? All corresponding PnL and risk metrics will be recalculated."
        confirmText="Confirm Delete"
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
