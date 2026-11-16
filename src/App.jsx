import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { JournalProvider, useJournal } from './context/JournalContext';
import CyberBackground from './components/common/CyberBackground';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';
import MasterDashboard from './components/dashboard/MasterDashboard';
import DateTradeLogger from './components/tradeLogger/DateTradeLogger';
import DateGroupedHistory from './components/history/DateGroupedHistory';
import StrategyRulesManager from './components/rules/StrategyRulesManager';
import SettingsBackupView from './components/settings/SettingsBackupView';

function MainLayout() {
  const { activeTab } = useJournal();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#050508] text-slate-100 overflow-x-hidden">
      <CyberBackground />
      <Navbar />

      <div className="flex-1 flex w-full relative z-10 max-w-[1600px] mx-auto">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-full overflow-hidden">
          {activeTab === 'dashboard' && <MasterDashboard />}
          {activeTab === 'logger' && <DateTradeLogger />}
          {activeTab === 'history' && <DateGroupedHistory />}
          {activeTab === 'rules' && <StrategyRulesManager />}
          {activeTab === 'settings' && <SettingsBackupView />}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <JournalProvider>
        <MainLayout />
      </JournalProvider>
    </AuthProvider>
  );
}
