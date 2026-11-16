import React from 'react';
import { PlusCircle, Sparkles, TrendingUp } from 'lucide-react';
import TimeframeSelector from './TimeframeSelector';
import KpiCards from './KpiCards';
import EquityChart from './EquityChart';
import DailyPnlChart from './DailyPnlChart';
import DisciplineCorrelationCard from './DisciplineCorrelationCard';
import WinLossGauges from './WinLossGauges';
import { useJournal } from '../../context/JournalContext';

export default function MasterDashboard() {
  const { setActiveTab } = useJournal();

  return (
    <div className="space-y-6">
      {/* Global Timeframe Selector */}
      <TimeframeSelector />

      {/* 6 Live KPI Stat Cards */}
      <KpiCards />

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EquityChart />
        <DailyPnlChart />
      </div>

      {/* Outcome Distribution & Direction Matrix */}
      <WinLossGauges />

      {/* Psychology & Strategy Rules Discipline Correlation */}
      <DisciplineCorrelationCard />
    </div>
  );
}
