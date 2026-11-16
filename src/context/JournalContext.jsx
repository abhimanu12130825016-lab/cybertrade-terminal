import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { StorageService } from '../services/storage';
import {
  filterTradesByTimeframe,
  computePerformanceMetrics,
  computeDisciplineAnalytics,
  generateChartSeries
} from '../utils/calculations';

const JournalContext = createContext(null);

export function JournalProvider({ children }) {
  const { currentUser } = useAuth();

  const [trades, setTrades] = useState([]);
  const [rules, setRules] = useState([]);
  const [dailyChecks, setDailyChecks] = useState({});
  const [loading, setLoading] = useState(true);

  // Global Timeframe selection: '7D' | '30D' | '1Y' | 'ALL' | 'CUSTOM'
  const [timeframe, setTimeframe] = useState('ALL');
  const [customRange, setCustomRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Currency preference: '$' | '₹' | '€'
  const [currency, setCurrency] = useState('$');

  // Active view tab: 'dashboard' | 'logger' | 'history' | 'rules' | 'analytics' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load user data whenever currentUser changes
  useEffect(() => {
    if (currentUser?.id) {
      setLoading(true);
      const userTrades = StorageService.getTrades(currentUser.id);
      const userRules = StorageService.getRules(currentUser.id);
      const userChecks = StorageService.getDailyChecks(currentUser.id);

      setTrades(userTrades);
      setRules(userRules);
      setDailyChecks(userChecks);
      setLoading(false);
    } else {
      setTrades([]);
      setRules([]);
      setDailyChecks({});
      setLoading(false);
    }
  }, [currentUser]);

  // Dynamic Timeframe Filtered Trades
  const filteredTrades = useMemo(() => {
    return filterTradesByTimeframe(trades, timeframe, customRange);
  }, [trades, timeframe, customRange]);

  // Master KPI Metrics recalculated automatically
  const metrics = useMemo(() => {
    return computePerformanceMetrics(filteredTrades, rules, dailyChecks);
  }, [filteredTrades, rules, dailyChecks]);

  // Discipline & Rule Adherence Analytics
  const disciplineAnalytics = useMemo(() => {
    return computeDisciplineAnalytics(rules, dailyChecks, trades);
  }, [rules, dailyChecks, trades]);

  // Chart Series Data
  const chartSeries = useMemo(() => {
    return generateChartSeries(filteredTrades);
  }, [filteredTrades]);

  // --- ACTIONS ---

  const addTrade = (tradeData) => {
    if (!currentUser?.id) return null;
    const newTrade = StorageService.addTrade(currentUser.id, tradeData);
    setTrades(prev => [newTrade, ...prev]);
    return newTrade;
  };

  const editTrade = (id, tradeData) => {
    if (!currentUser?.id) return null;
    const updated = StorageService.updateTrade(currentUser.id, id, tradeData);
    setTrades(prev => prev.map(t => (t.id === id ? updated : t)));
    return updated;
  };

  const deleteTrade = (id) => {
    if (!currentUser?.id) return;
    StorageService.deleteTrade(currentUser.id, id);
    setTrades(prev => prev.filter(t => t.id !== id));
  };

  const addRule = (ruleData) => {
    if (!currentUser?.id) return null;
    const newRule = StorageService.addRule(currentUser.id, ruleData);
    setRules(prev => [...prev, newRule]);
    return newRule;
  };

  const editRule = (id, ruleData) => {
    if (!currentUser?.id) return null;
    const updated = StorageService.updateRule(currentUser.id, id, ruleData);
    setRules(prev => prev.map(r => (r.id === id ? updated : r)));
    return updated;
  };

  const toggleRuleActive = (id) => {
    if (!currentUser?.id) return;
    const rule = rules.find(r => r.id === id);
    if (!rule) return;
    const updated = StorageService.updateRule(currentUser.id, id, { active: !rule.active });
    setRules(prev => prev.map(r => (r.id === id ? updated : r)));
  };

  const deleteRule = (id) => {
    if (!currentUser?.id) return;
    StorageService.deleteRule(currentUser.id, id);
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const toggleDailyRule = (date, ruleId, followed) => {
    if (!currentUser?.id) return;
    const updatedDay = StorageService.setDailyRuleStatus(currentUser.id, date, ruleId, followed);
    setDailyChecks(prev => ({
      ...prev,
      [date]: updatedDay
    }));
  };

  const updateDailyNotes = (date, notes) => {
    if (!currentUser?.id) return;
    const updatedDay = StorageService.setDailyNotes(currentUser.id, date, notes);
    setDailyChecks(prev => ({
      ...prev,
      [date]: updatedDay
    }));
  };

  const exportBackupJSON = () => {
    if (!currentUser?.id) return null;
    return StorageService.exportFullBackup(currentUser.id);
  };

  const exportCSV = () => {
    if (!currentUser?.id) return null;
    return StorageService.exportCSV(currentUser.id);
  };

  const importBackupJSON = (jsonString) => {
    if (!currentUser?.id) throw new Error('Operative not authenticated');
    const result = StorageService.importFullBackup(currentUser.id, jsonString);
    // Reload state
    setTrades(StorageService.getTrades(currentUser.id));
    setRules(StorageService.getRules(currentUser.id));
    setDailyChecks(StorageService.getDailyChecks(currentUser.id));
    return result;
  };

  const seedDemoData = () => {
    if (!currentUser?.id) return;
    const { demoTrades, demoChecks, defaultRules } = StorageService.seedDemoEnvironment(currentUser.id);
    setTrades(demoTrades);
    setRules(defaultRules);
    setDailyChecks(demoChecks);
  };

  const clearAllData = () => {
    if (!currentUser?.id) return;
    StorageService.saveTrades(currentUser.id, []);
    StorageService.saveDailyChecks(currentUser.id, {});
    setTrades([]);
    setDailyChecks({});
  };

  return (
    <JournalContext.Provider
      value={{
        trades,
        filteredTrades,
        rules,
        dailyChecks,
        loading,
        timeframe,
        setTimeframe,
        customRange,
        setCustomRange,
        currency,
        setCurrency,
        activeTab,
        setActiveTab,
        metrics,
        disciplineAnalytics,
        chartSeries,
        addTrade,
        editTrade,
        deleteTrade,
        addRule,
        editRule,
        deleteRule,
        toggleRuleActive,
        toggleDailyRule,
        updateDailyNotes,
        exportBackupJSON,
        exportCSV,
        importBackupJSON,
        seedDemoData,
        clearAllData
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}
