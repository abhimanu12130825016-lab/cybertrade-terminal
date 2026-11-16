import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  CalendarDays,
  ShieldCheck,
  Sliders,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useJournal } from '../../context/JournalContext';

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { activeTab, setActiveTab, metrics, disciplineAnalytics } = useJournal();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Performance Dashboard',
      shortLabel: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'logger',
      label: 'Log Date Trades',
      shortLabel: 'Logger',
      icon: PlusCircle,
      badge: null
    },
    {
      id: 'history',
      label: 'Date History',
      shortLabel: 'History',
      icon: CalendarDays,
      badge: metrics.totalTrades > 0 ? metrics.totalTrades : null
    },
    {
      id: 'rules',
      label: 'Strategy Rules',
      shortLabel: 'Rules',
      icon: ShieldCheck,
      badge: `${disciplineAnalytics.overallDisciplineScore}%`
    },
    {
      id: 'settings',
      label: 'Vault & Settings',
      shortLabel: 'Settings',
      icon: Sliders,
      badge: null
    }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-800 bg-[#0C0E17] transition-all duration-200 z-30 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Collapse Toggle */}
      <div className="p-3 flex items-center justify-between border-b border-slate-800/80">
        {!isCollapsed && (
          <span className="text-[11px] font-mono uppercase text-slate-400 font-bold tracking-wider px-2">
            Navigation
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-auto"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono transition-colors text-left ${
                isActive
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title={item.label}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? 'text-cyan-400' : 'text-slate-400'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mini Discipline Score Box */}
      {!isCollapsed && (
        <div className="p-3 m-2 bg-[#111420] border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Discipline Score</span>
            <span className="text-emerald-400 font-bold font-tabular">
              {disciplineAnalytics.overallDisciplineScore}%
            </span>
          </div>

          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${disciplineAnalytics.overallDisciplineScore}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-500">
            <span>{metrics.totalTrades} Trades</span>
            <span>{metrics.winRate}% Win</span>
          </div>
        </div>
      )}
    </aside>
  );
}
