import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  CalendarDays,
  ShieldAlert,
  Sliders,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Cpu
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
      badge: 'Active'
    },
    {
      id: 'history',
      label: 'Date-Grouped History',
      shortLabel: 'History',
      icon: CalendarDays,
      badge: metrics.totalTrades > 0 ? metrics.totalTrades : null
    },
    {
      id: 'rules',
      label: 'Strategy Rules Engine',
      shortLabel: 'Rules',
      icon: ShieldAlert,
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
      className={`hidden md:flex flex-col border-r border-cyan-500/20 bg-[#080911]/80 backdrop-blur-xl transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar header toggle */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
        {!isCollapsed && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 tracking-wider">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">SYSTEM MODULES</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 rounded-lg transition-colors ml-auto"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-mono transition-all text-left group ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-neon-cyan font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
              title={item.label}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'
                }`}
              />

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                        item.id === 'rules'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                          : 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mini Discipline Telemetry Footer */}
      {!isCollapsed && (
        <div className="p-4 m-3 bg-[#0D0E15] border border-cyan-500/20 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Discipline Edge:
            </span>
            <span className="text-emerald-400 font-bold cyber-num">
              {disciplineAnalytics.overallDisciplineScore}%
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${disciplineAnalytics.overallDisciplineScore}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>TOTAL TRADES: {metrics.totalTrades}</span>
            <span>WIN: {metrics.winRate}%</span>
          </div>
        </div>
      )}
    </aside>
  );
}
