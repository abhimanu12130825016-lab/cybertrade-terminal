import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  CalendarDays,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { useJournal } from '../../context/JournalContext';

export default function BottomNav() {
  const { activeTab, setActiveTab, metrics } = useJournal();

  const navItems = [
    { id: 'dashboard', label: 'Dash', icon: LayoutDashboard },
    { id: 'logger', label: 'Log', icon: PlusCircle },
    { id: 'history', label: 'History', icon: CalendarDays, badge: metrics.totalTrades },
    { id: 'rules', label: 'Rules', icon: ShieldAlert },
    { id: 'settings', label: 'Vault', icon: Sliders }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07080E]/95 backdrop-blur-xl border-t border-cyan-500/20 px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg relative transition-all ${
              isActive
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_#00F0FF]' : ''}`} />
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1 text-[9px] font-mono bg-cyan-500 text-slate-950 font-black rounded-full min-w-[14px] text-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-mono mt-0.5 tracking-tight">
              {item.label}
            </span>
            {isActive && (
              <span className="w-1 h-1 rounded-full bg-cyan-400 mt-0.5 shadow-neon-cyan" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
