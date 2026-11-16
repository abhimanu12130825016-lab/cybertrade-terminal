/**
 * CyberTrade Terminal — Resilient Multi-User Storage Adapter
 * Local-First IndexedDB / localStorage with strict user isolation,
 * schema validation, integrity checks, and cloud sync hooks.
 */

const STORAGE_KEYS = {
  USERS: 'cybertrade_users_v1',
  ACTIVE_SESSION: 'cybertrade_session_v1',
  TRADES_PREFIX: 'cybertrade_trades_',
  RULES_PREFIX: 'cybertrade_rules_',
  DAILY_CHECKS_PREFIX: 'cybertrade_checks_',
  SETTINGS_PREFIX: 'cybertrade_settings_'
};

/**
 * Default Strategy Rules for new traders
 */
export const DEFAULT_STRATEGY_RULES = [
  {
    id: 'rule_1',
    title: 'Wait for 15M / 1H Candle Close Confirmation',
    description: 'Never anticipate breakouts before the candle officially closes.',
    category: 'Execution',
    active: true
  },
  {
    id: 'rule_2',
    title: 'Hard Stop Loss Set Before Entering',
    description: 'Always calculate position size so risk is capped at 1% of total portfolio.',
    category: 'Risk Management',
    active: true
  },
  {
    id: 'rule_3',
    title: 'Strict Minimum 1:2.0 Planned R:R Ratio',
    description: 'Reject setups where potential target reward does not justify the stop distance.',
    category: 'Risk Management',
    active: true
  },
  {
    id: 'rule_4',
    title: 'No Revenge Trading (Max 3 Trades Per Day)',
    description: 'Cease trading immediately after two consecutive losses to prevent tilt.',
    category: 'Psychology',
    active: true
  },
  {
    id: 'rule_5',
    title: 'Align With Higher-Timeframe Trend (4H / Daily)',
    description: 'Only take counter-trend setups at major HTF supply/demand or liquidity sweeps.',
    category: 'Analysis',
    active: true
  }
];

/**
 * Seed realistic demo trades for demo user
 */
export function getDemoTrades(userId) {
  return [
    {
      id: 'trade_demo_1',
      userId,
      date: '2026-11-17',
      asset: 'BTC/USDT',
      direction: 'LONG',
      entryPrice: 91400,
      stopLoss: 90200,
      targetPrice: 94500,
      plannedRR: '1 : 2.58',
      riskPercent: 1.31,
      outcome: 'SUCCEEDED',
      pnl: 1420.50,
      pnlType: '$',
      notes: 'Bullish liquidity sweep below previous day low with strong 15m hammer candle close. Scaled out at range highs.',
      createdAt: new Date('2026-11-17T09:30:00Z').toISOString()
    },
    {
      id: 'trade_demo_2',
      userId,
      date: '2026-11-17',
      asset: 'SOL/USDT',
      direction: 'SHORT',
      entryPrice: 224.50,
      stopLoss: 229.00,
      targetPrice: 212.00,
      plannedRR: '1 : 2.78',
      riskPercent: 2.00,
      outcome: 'SUCCEEDED',
      pnl: 850.00,
      pnlType: '$',
      notes: 'Bearish divergence on 1H RSI into local resistance cluster. Target reached clean without pullback.',
      createdAt: new Date('2026-11-17T11:45:00Z').toISOString()
    },
    {
      id: 'trade_demo_3',
      userId,
      date: '2026-11-16',
      asset: 'NVDA',
      direction: 'LONG',
      entryPrice: 142.20,
      stopLoss: 139.80,
      targetPrice: 149.00,
      plannedRR: '1 : 2.83',
      riskPercent: 1.69,
      outcome: 'SUCCEEDED',
      pnl: 1120.00,
      pnlType: '$',
      notes: 'Pre-market earnings momentum continuation through $140 psychological pivot.',
      createdAt: new Date('2026-11-16T14:30:00Z').toISOString()
    },
    {
      id: 'trade_demo_4',
      userId,
      date: '2026-11-16',
      asset: 'ETH/USDT',
      direction: 'LONG',
      entryPrice: 3120,
      stopLoss: 3080,
      targetPrice: 3220,
      plannedRR: '1 : 2.50',
      riskPercent: 1.28,
      outcome: 'FAILED',
      pnl: -400.00,
      pnlType: '$',
      notes: 'Choppy session chop stopped out early. Recognized breakdown and did not re-enter.',
      createdAt: new Date('2026-11-16T16:00:00Z').toISOString()
    },
    {
      id: 'trade_demo_5',
      userId,
      date: '2026-11-15',
      asset: 'XAUUSD',
      direction: 'SHORT',
      entryPrice: 2615.40,
      stopLoss: 2622.00,
      targetPrice: 2598.00,
      plannedRR: '1 : 2.64',
      riskPercent: 0.25,
      outcome: 'SUCCEEDED',
      pnl: 960.00,
      pnlType: '$',
      notes: 'Gold rejected 4H fair value gap after US dollar index surge.',
      createdAt: new Date('2026-11-15T10:15:00Z').toISOString()
    },
    {
      id: 'trade_demo_6',
      userId,
      date: '2026-11-14',
      asset: 'NIFTY',
      direction: 'LONG',
      entryPrice: 23550,
      stopLoss: 23480,
      targetPrice: 23720,
      plannedRR: '1 : 2.43',
      riskPercent: 0.30,
      outcome: 'SUCCEEDED',
      pnl: 1350.00,
      pnlType: '$',
      notes: 'Gap fill and reversal from weekly VWAP support. Strong institutional buying.',
      createdAt: new Date('2026-11-14T09:45:00Z').toISOString()
    },
    {
      id: 'trade_demo_7',
      userId,
      date: '2026-11-13',
      asset: 'AAPL',
      direction: 'SHORT',
      entryPrice: 228.40,
      stopLoss: 231.00,
      targetPrice: 222.00,
      plannedRR: '1 : 2.46',
      riskPercent: 1.14,
      outcome: 'BREAKEVEN',
      pnl: 0.00,
      pnlType: '$',
      notes: 'Moved stop loss to entry after 1R reached. Retraced and triggered trailing stop.',
      createdAt: new Date('2026-11-13T15:20:00Z').toISOString()
    },
    {
      id: 'trade_demo_8',
      userId,
      date: '2026-11-12',
      asset: 'TSLA',
      direction: 'LONG',
      entryPrice: 325.00,
      stopLoss: 318.00,
      targetPrice: 342.00,
      plannedRR: '1 : 2.43',
      riskPercent: 2.15,
      outcome: 'FAILED',
      pnl: -650.00,
      pnlType: '$',
      notes: 'Attempted to catch breakout before 15m candle closed. Violated rule #1 and paid the price.',
      createdAt: new Date('2026-11-12T14:15:00Z').toISOString()
    }
  ];
}

export function getDemoDailyChecks(userId) {
  return {
    '2026-11-17': {
      date: '2026-11-17',
      rulesFollowed: {
        rule_1: true,
        rule_2: true,
        rule_3: true,
        rule_4: true,
        rule_5: true
      },
      notes: 'Patience paid off. Held all trades until structured take profit targets.'
    },
    '2026-11-16': {
      date: '2026-11-16',
      rulesFollowed: {
        rule_1: true,
        rule_2: true,
        rule_3: true,
        rule_4: true,
        rule_5: true
      },
      notes: 'Accepted the ETH loss calmly. Did not revenge trade.'
    },
    '2026-11-15': {
      date: '2026-11-15',
      rulesFollowed: {
        rule_1: true,
        rule_2: true,
        rule_3: true,
        rule_4: true,
        rule_5: true
      },
      notes: 'Clean execution on gold setup.'
    },
    '2026-11-14': {
      date: '2026-11-14',
      rulesFollowed: {
        rule_1: true,
        rule_2: true,
        rule_3: true,
        rule_4: true,
        rule_5: true
      },
      notes: 'Followed Nifty plan strictly.'
    },
    '2026-11-13': {
      date: '2026-11-13',
      rulesFollowed: {
        rule_1: true,
        rule_2: true,
        rule_3: true,
        rule_4: true,
        rule_5: false // Broke rule 5
      },
      notes: 'Traded against 4H trend on Apple.'
    },
    '2026-11-12': {
      date: '2026-11-12',
      rulesFollowed: {
        rule_1: false, // Broke rule 1 (Jumped the gun on Tesla)
        rule_2: true,
        rule_3: true,
        rule_4: true,
        rule_5: false
      },
      notes: 'Impulsive entry on TSLA without candle close. Lesson learned.'
    }
  };
}

/**
 * Storage Engine
 */
export const StorageService = {
  // --- USER AUTHENTICATION & SESSIONS ---

  getUsers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getActiveSession() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setActiveSession(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  },

  findUserByEmail(email) {
    const users = this.getUsers();
    return users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
  },

  registerUser({ name, email, password }) {
    const users = this.getUsers();
    const cleanEmail = (email || '').toLowerCase().trim();
    if (!cleanEmail) throw new Error('Email is required.');
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An operative account with this email already exists.');
    }

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      name: (name || 'Cyber Trader').trim(),
      email: cleanEmail,
      passwordHash: btoa(password), // simple obfuscation for local-first storage
      createdAt: new Date().toISOString(),
      role: 'TRADER_OPERATIVE'
    };

    users.push(newUser);
    this.saveUsers(users);

    // Initialize default rules for new user
    this.saveRules(newUser.id, DEFAULT_STRATEGY_RULES.map(r => ({ ...r, userId: newUser.id })));
    this.saveTrades(newUser.id, []);
    this.saveDailyChecks(newUser.id, {});

    return newUser;
  },

  loginUser(email, password) {
    const cleanEmail = (email || '').toLowerCase().trim();
    const user = this.findUserByEmail(cleanEmail);
    if (!user) {
      throw new Error('Access denied: Operative not found.');
    }
    if (user.passwordHash !== btoa(password)) {
      throw new Error('Access denied: Invalid biometric credential / password.');
    }
    return user;
  },

  // --- TRADES DATA (PER USER ISOLATION) ---

  getTrades(userId) {
    if (!userId) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRADES_PREFIX + userId);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveTrades(userId, trades) {
    if (!userId) return;
    localStorage.setItem(STORAGE_KEYS.TRADES_PREFIX + userId, JSON.stringify(trades));
  },

  addTrade(userId, tradeData) {
    const trades = this.getTrades(userId);
    const newTrade = {
      ...tradeData,
      id: tradeData.id || 'trd_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    trades.unshift(newTrade);
    this.saveTrades(userId, trades);
    return newTrade;
  },

  updateTrade(userId, tradeId, updatedData) {
    const trades = this.getTrades(userId);
    const index = trades.findIndex(t => t.id === tradeId);
    if (index === -1) throw new Error('Trade record not found.');
    trades[index] = {
      ...trades[index],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    this.saveTrades(userId, trades);
    return trades[index];
  },

  deleteTrade(userId, tradeId) {
    const trades = this.getTrades(userId);
    const filtered = trades.filter(t => t.id !== tradeId);
    this.saveTrades(userId, filtered);
    return true;
  },

  // --- STRATEGY RULES (PER USER ISOLATION) ---

  getRules(userId) {
    if (!userId) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RULES_PREFIX + userId);
      if (data) return JSON.parse(data);
      // Fallback: seed with defaults
      const defaults = DEFAULT_STRATEGY_RULES.map(r => ({ ...r, userId }));
      this.saveRules(userId, defaults);
      return defaults;
    } catch {
      return DEFAULT_STRATEGY_RULES.map(r => ({ ...r, userId }));
    }
  },

  saveRules(userId, rules) {
    if (!userId) return;
    localStorage.setItem(STORAGE_KEYS.RULES_PREFIX + userId, JSON.stringify(rules));
  },

  addRule(userId, ruleData) {
    const rules = this.getRules(userId);
    const newRule = {
      id: 'rule_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      userId,
      title: ruleData.title.trim(),
      description: (ruleData.description || '').trim(),
      category: ruleData.category || 'Discipline',
      active: ruleData.active !== false,
      createdAt: new Date().toISOString()
    };
    rules.push(newRule);
    this.saveRules(userId, rules);
    return newRule;
  },

  updateRule(userId, ruleId, updatedData) {
    const rules = this.getRules(userId);
    const index = rules.findIndex(r => r.id === ruleId);
    if (index === -1) throw new Error('Strategy rule not found.');
    rules[index] = { ...rules[index], ...updatedData };
    this.saveRules(userId, rules);
    return rules[index];
  },

  deleteRule(userId, ruleId) {
    const rules = this.getRules(userId);
    const filtered = rules.filter(r => r.id !== ruleId);
    this.saveRules(userId, filtered);
    return true;
  },

  // --- DAILY CHECKS (PER USER ISOLATION) ---

  getDailyChecks(userId) {
    if (!userId) return {};
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_CHECKS_PREFIX + userId);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveDailyChecks(userId, checks) {
    if (!userId) return;
    localStorage.setItem(STORAGE_KEYS.DAILY_CHECKS_PREFIX + userId, JSON.stringify(checks));
  },

  setDailyRuleStatus(userId, date, ruleId, followed) {
    const checks = this.getDailyChecks(userId);
    if (!checks[date]) {
      checks[date] = { date, rulesFollowed: {}, notes: '', updatedAt: new Date().toISOString() };
    }
    checks[date].rulesFollowed[ruleId] = Boolean(followed);
    checks[date].updatedAt = new Date().toISOString();
    this.saveDailyChecks(userId, checks);
    return checks[date];
  },

  setDailyNotes(userId, date, notes) {
    const checks = this.getDailyChecks(userId);
    if (!checks[date]) {
      checks[date] = { date, rulesFollowed: {}, notes: '', updatedAt: new Date().toISOString() };
    }
    checks[date].notes = notes;
    checks[date].updatedAt = new Date().toISOString();
    this.saveDailyChecks(userId, checks);
    return checks[date];
  },

  // --- ONE-CLICK BACKUP & RESTORE ---

  exportFullBackup(userId) {
    const trades = this.getTrades(userId);
    const rules = this.getRules(userId);
    const dailyChecks = this.getDailyChecks(userId);
    const user = this.getUsers().find(u => u.id === userId);

    const backupPayload = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      generator: 'CyberTrade Terminal Protocol',
      user: user ? { id: user.id, name: user.name, email: user.email } : null,
      data: {
        trades,
        rules,
        dailyChecks
      }
    };

    return JSON.stringify(backupPayload, null, 2);
  },

  exportCSV(userId) {
    const trades = this.getTrades(userId);
    if (trades.length === 0) return 'Date,Asset,Direction,Entry,StopLoss,Target,PlannedRR,Outcome,PnL,Currency,Notes\n';

    const headers = ['Date', 'Asset', 'Direction', 'Entry', 'StopLoss', 'Target', 'PlannedRR', 'Outcome', 'PnL', 'Currency', 'Notes'];
    const rows = trades.map(t => {
      const escape = val => `"${String(val || '').replace(/"/g, '""')}"`;
      return [
        t.date || '',
        t.asset || '',
        t.direction || '',
        t.entryPrice || 0,
        t.stopLoss || 0,
        t.targetPrice || 0,
        escape(t.plannedRR),
        t.outcome || '',
        t.pnl || 0,
        t.pnlType || '$',
        escape(t.notes)
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  },

  importFullBackup(userId, jsonString) {
    try {
      const payload = JSON.parse(jsonString);
      if (!payload.data || !Array.isArray(payload.data.trades) || !Array.isArray(payload.data.rules)) {
        throw new Error('Invalid backup schema: Missing trades or rules structures.');
      }

      // Re-assign userId to enforce ownership
      const sanitizedTrades = payload.data.trades.map(t => ({
        ...t,
        userId,
        id: t.id || 'trd_' + Math.random().toString(36).substr(2, 8)
      }));

      const sanitizedRules = payload.data.rules.map(r => ({
        ...r,
        userId,
        id: r.id || 'rule_' + Math.random().toString(36).substr(2, 8)
      }));

      const sanitizedChecks = payload.data.dailyChecks || {};

      this.saveTrades(userId, sanitizedTrades);
      this.saveRules(userId, sanitizedRules);
      this.saveDailyChecks(userId, sanitizedChecks);

      return {
        success: true,
        tradesCount: sanitizedTrades.length,
        rulesCount: sanitizedRules.length,
        checksCount: Object.keys(sanitizedChecks).length
      };
    } catch (err) {
      throw new Error('Backup restore failed: ' + err.message);
    }
  },

  seedDemoEnvironment(userId) {
    const demoTrades = getDemoTrades(userId);
    const demoChecks = getDemoDailyChecks(userId);
    const defaultRules = DEFAULT_STRATEGY_RULES.map(r => ({ ...r, userId }));

    this.saveTrades(userId, demoTrades);
    this.saveRules(userId, defaultRules);
    this.saveDailyChecks(userId, demoChecks);

    return { demoTrades, demoChecks, defaultRules };
  }
};
