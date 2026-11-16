import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { useJournal } from '../../context/JournalContext';

export default function TimeframeSelector() {
  const { timeframe, setTimeframe, customRange, setCustomRange } = useJournal();
  const [showCustomModal, setShowCustomModal] = useState(false);

  const timeframes = [
    { id: '7D', label: '7D', full: 'Weekly (7 Days)' },
    { id: '30D', label: '30D', full: 'Monthly (30 Days)' },
    { id: '1Y', label: '1Y', full: 'Yearly (1 Year)' },
    { id: 'ALL', label: 'ALL', full: 'All-Time Records' },
    { id: 'CUSTOM', label: 'CUSTOM', full: 'Custom Interval' }
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customRange.startDate && customRange.endDate) {
      setTimeframe('CUSTOM');
      setShowCustomModal(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111420] border border-slate-800 rounded-xl">
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Filter className="w-4 h-4 text-cyan-400" />
        <span className="hidden sm:inline">Timeframe Window:</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {timeframes.map((tf) => {
          const isActive = timeframe === tf.id;
          return (
            <button
              key={tf.id}
              onClick={() => {
                if (tf.id === 'CUSTOM') {
                  setShowCustomModal(true);
                } else {
                  setTimeframe(tf.id);
                }
              }}
              title={tf.full}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tf.label}
              {tf.id === 'CUSTOM' && customRange.startDate && (
                <span className="ml-1 text-[10px] hidden sm:inline opacity-80">
                  ({customRange.startDate.slice(5)} to {customRange.endDate.slice(5)})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Date Range Picker Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-sm p-5 bg-[#121624] border border-slate-700 rounded-xl shadow-2xl">
            <button
              onClick={() => setShowCustomModal(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-orbitron text-sm font-bold text-white mb-4">
              Select Custom Date Range
            </h3>

            <form onSubmit={handleCustomSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  value={customRange.startDate}
                  onChange={(e) => setCustomRange({ ...customRange, startDate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090B12] border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">End Date</label>
                <input
                  type="date"
                  required
                  value={customRange.endDate}
                  onChange={(e) => setCustomRange({ ...customRange, endDate: e.target.value })}
                  className="w-full px-3 py-2 bg-[#090B12] border border-slate-800 focus:border-cyan-400 rounded-lg text-slate-200"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 btn-primary rounded-lg font-semibold"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
