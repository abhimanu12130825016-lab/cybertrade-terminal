import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit2
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

  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const assetSuggestions = ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'NIFTY', 'NVDA', 'AAPL', 'TSLA', 'XAUUSD'];

  const dateTrades = useMemo(() => {
    return trades.filter((t) => t.date === selectedDate);
  }, [trades, selectedDate]);

  const dateTotalPnl = useMemo(() => {
    return dateTrades.reduce((acc, t) => acc + (parseFloat(t.pnl) || 0), 0);
  }, [dateTrades]);

  const activeRules = useMemo(() => {
    return rules.filter((r) => r.active !== false);
  }, [rules]);

  const dayCheckRecord = dailyChecks[selectedDate] || { rulesFollowed: {}, notes: '' };

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

  const handleDateShift = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

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

  const handleSubmitTrade = (e) => {
    e.preventDefault();
    setFormError(null);

    const numEntry = parseFloat(entryPrice);
    const numSl = parseFloat(stopLoss);
    const numTp = parseFloat(targetPrice);
    const numPnl = parseFloat(pnl) || 0;

    if (!asset.trim()) {
      setFormError('Asset / Ticker Symbol is required.');
      return;
    }
    if (isNaN(numEntry) || numEntry <= 0) {
      setFormError('Valid Entry Price is required.');
      return;
    }
    if (isNaN(numSl) || numSl <= 0) {
      setFormError('Valid Stop Loss Price is required.');
      return;
    }
    if (isNaN(numTp) || numTp <= 0) {
      setFormError('Valid Target (TP) Price is required.');
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
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#10B981', '#00D8F6']
        });
      }
      resetForm();
    }
  };

  return (
    <div className="space-y-5">
      {/* Date Header Controller */}
      <div className="p-4 bg-[#111420] border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-orbitron text-sm font-bold text-white tracking-wide">
              DATE-GROUPED TRADE LOGGER
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Log multiple executions and checklist your strategy rules per trading day
            </p>
          </div>
        </div>

        {/* Date Selector & Shift Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => handleDateShift(-1)}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:text-white rounded-lg transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-[#090B12] border border-slate-800 rounded-lg text-xs text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
          />

          <button
            onClick={() => handleDateShift(1)}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:text-white rounded-lg transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setSelectedDate(todayStr)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 rounded-lg"
          >
            Today
          </button>
        </div>
      </div>

      {/* Daily Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-[#111420] border border-slate-800 rounded-lg text-xs font-mono">
          <span className="text-slate-400 block">Date Executions</span>
          <span className="text-base font-bold text-cyan-400 font-tabular">
            {dateTrades.length} Trades
          </span>
        </div>

        <div className="p-3 bg-[#111420] border border-slate-800 rounded-lg text-xs font-mono">
          <span className="text-slate-400 block">Daily Realized PnL</span>
          <span
            className={`text-base font-bold font-tabular ${
              dateTotalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatCurrency(dateTotalPnl, currency)}
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3 bg-[#111420] border border-slate-800 rounded-lg text-xs font-mono">
          <span className="text-slate-400 block">Strategy Checklist</span>
          <span className="text-base font-bold text-purple-400 font-tabular">
            {Object.values(dayCheckRecord.rulesFollowed || {}).filter(Boolean).length} / {activeRules.length} Followed
          </span>
        </div>
      </div>

      {/* Main Split: Form (Left) & Daily Rules Checklist (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Trade Entry Form */}
        <div className="lg:col-span-7 bg-[#111420] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <h3 className="font-orbitron text-xs font-bold text-white tracking-wide">
                {editingTradeId ? 'EDIT EXECUTION RECORD' : 'LOG TRADE ENTRY'}
              </h3>
            </div>
            {editingTradeId && (
              <button
                onClick={resetForm}
                className="text-xs font-mono text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>

          {formError && (
            <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/30 rounded-lg flex items-center gap-2 text-xs text-rose-300 font-mono">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmitTrade} className="space-y-4 font-mono text-xs">
            {/* Ticker & Direction */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">
                  Ticker / Asset Symbol
                </label>
                <input
                  type="text"
                  required
                  value={asset}
                  onChange={(e) => setAsset(e.target.value.toUpperCase())}
                  placeholder="BTC/USDT, NIFTY, AAPL"
                  className="w-full px-3 py-2 bg-[#090B12] border border-slate-800 focus:border-cyan-400 focus:outline-none rounded-lg text-slate-100 font-bold uppercase"
                />
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {assetSuggestions.slice(0, 5).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setAsset(s)}
                      className="px-1.5 py-0.5 text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded border border-slate-800"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Direction</label>
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                  <button
                    type="button"
                    onClick={() => setDirection('LONG')}
                    className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      direction === 'LONG'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                    <span>LONG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDirection('SHORT')}
                    className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                      direction === 'SHORT'
                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
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
                <label className="block text-slate-400 mb-1">Entry Price</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-2.5 py-2 bg-[#090B12] border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-100 font-tabular text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-rose-400 mb-1">
                  Stop Loss (SL)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-2.5 py-2 bg-[#090B12] border border-slate-800 focus:border-rose-400 rounded-lg text-slate-100 font-tabular text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-emerald-400 mb-1">
                  Target (TP)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-2.5 py-2 bg-[#090B12] border border-slate-800 focus:border-emerald-400 rounded-lg text-slate-100 font-tabular text-sm font-semibold"
                />
              </div>
            </div>

            {/* Auto Calculated R:R */}
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Planned Risk:Reward:</span>
                <span
                  className={`text-sm font-bold font-orbitron font-tabular ${
                    rrCalculation.ratioValue >= 2
                      ? 'text-emerald-400'
                      : rrCalculation.ratioValue > 0
                      ? 'text-cyan-400'
                      : 'text-slate-500'
                  }`}
                >
                  {rrCalculation.ratioText}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-1.5">
                <span>Calculated Stop Risk:</span>
                <span className="text-rose-400 font-tabular font-semibold">
                  {rrCalculation.riskPercent}%
                </span>
              </div>

              {rrCalculation.warning && (
                <div className="p-2 bg-rose-950/40 border border-rose-500/40 rounded-lg text-[11px] text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{rrCalculation.warning}</span>
                </div>
              )}
            </div>

            {/* Outcome & Realized PnL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Outcome Status</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOutcome('SUCCEEDED')}
                    className={`py-2 px-1 rounded-lg font-bold text-center text-[11px] transition-colors ${
                      outcome === 'SUCCEEDED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    WIN
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutcome('FAILED')}
                    className={`py-2 px-1 rounded-lg font-bold text-center text-[11px] transition-colors ${
                      outcome === 'FAILED'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    LOSS
                  </button>

                  <button
                    type="button"
                    onClick={() => setOutcome('BREAKEVEN')}
                    className={`py-2 px-1 rounded-lg font-bold text-center text-[11px] transition-colors ${
                      outcome === 'BREAKEVEN'
                        ? 'bg-slate-800 text-slate-200 border border-slate-700'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    EVEN
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Realized Net PnL ({currency})
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
                    className="w-full pl-7 pr-3 py-2 bg-[#090B12] border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-100 font-tabular text-sm font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-slate-400 mb-1">
                Setup Rationale, Market Conditions & Emotional State
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key setup catalyst: 15m candle close, liquidity sweep, calm mindset, followed 1% risk..."
                className="w-full px-3 py-2 bg-[#090B12] border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-200 font-mono text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 btn-primary rounded-lg text-xs font-bold transition-all"
            >
              {editingTradeId ? 'Save Modifications' : `Save Trade Under Date [${selectedDate}]`}
            </button>
          </form>
        </div>

        {/* Right Column: Daily Strategy Checklist for this specific trading date */}
        <div className="lg:col-span-5 bg-[#111420] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <h3 className="font-orbitron text-xs font-bold text-white tracking-wide">
                DAILY STRATEGY CHECKLIST
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {selectedDate}
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono leading-relaxed">
            Mark which core rules you strictly obeyed or violated during today’s session.
          </p>

          <div className="space-y-2">
            {activeRules.map((rule) => {
              const isChecked = dayCheckRecord.rulesFollowed?.[rule.id] === true;

              return (
                <div
                  key={rule.id}
                  onClick={() => toggleDailyRule(selectedDate, rule.id, !isChecked)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-colors flex items-start gap-2.5 select-none ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold'
                        : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${isChecked ? 'text-emerald-300' : 'text-slate-300'}`}>
                        {rule.title}
                      </span>
                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-950 text-slate-400 uppercase">
                        {rule.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily Psychological Journal Note */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Session Reflection & Psychology
            </label>
            <textarea
              rows={3}
              value={dayCheckRecord.notes || ''}
              onChange={(e) => updateDailyNotes(selectedDate, e.target.value)}
              placeholder="How was emotional state today? Any FOMO, impatience, or hesitation experienced?"
              className="w-full px-3 py-2 bg-[#090B12] border border-slate-800 focus:border-purple-400 rounded-lg text-slate-200 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Trades Logged Under Selected Date */}
      <div className="bg-[#111420] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="font-orbitron text-xs font-bold text-white tracking-wide">
              EXECUTIONS FOR {selectedDate} ({dateTrades.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Net: <strong className={dateTotalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{formatCurrency(dateTotalPnl, currency)}</strong>
          </span>
        </div>

        {dateTrades.length === 0 ? (
          <div className="py-6 text-center text-slate-500 font-mono text-xs">
            No trades recorded on this date yet. Use the form above to log one.
          </div>
        ) : (
          <div className="space-y-2.5">
            {dateTrades.map((trade, idx) => (
              <div
                key={trade.id}
                className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-3 font-mono text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-1.5 py-0.5 bg-slate-950 text-slate-400 rounded text-[10px] font-bold">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{trade.asset}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          trade.direction === 'LONG'
                            ? 'bg-cyan-950 text-cyan-300'
                            : 'bg-purple-950 text-purple-300'
                        }`}
                      >
                        {trade.direction}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          trade.outcome === 'SUCCEEDED'
                            ? 'bg-emerald-950 text-emerald-400'
                            : trade.outcome === 'FAILED'
                            ? 'bg-rose-950 text-rose-400'
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

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-slate-500 text-[10px] block">PnL</span>
                    <span
                      className={`text-sm font-bold font-tabular ${
                        trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatCurrency(trade.pnl, currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEdit(trade)}
                      className="p-1.5 text-slate-400 hover:text-white rounded"
                      title="Edit Trade"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(trade.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded"
                      title="Delete Trade"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {trade.notes && (
                  <div className="w-full pt-1.5 border-t border-slate-800 text-slate-400 text-[11px] italic">
                    "{trade.notes}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Trade Execution"
        message="Are you sure you wish to delete this trade record? All corresponding statistics will be recalculated."
        confirmText="Confirm Delete"
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
