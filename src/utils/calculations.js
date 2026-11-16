/**
 * CyberTrade Terminal — Advanced Calculation & Financial Risk Engine
 * Comprehensive calculations with edge-case protection against division by zero.
 */

/**
 * Calculates planned Risk-to-Reward ratio based on Entry, SL, and TP.
 * Formula: |Target - Entry| / |Entry - Stop Loss|
 * @param {number|string} entry
 * @param {number|string} stopLoss
 * @param {number|string} target
 * @param {'LONG'|'SHORT'} direction
 * @returns {{
 *   ratioValue: number,
 *   ratioText: string,
 *   riskPercent: number,
 *   rewardPercent: number,
 *   isValid: boolean,
 *   isInverted: boolean,
 *   warning: string|null
 * }}
 */
export function calculateRiskReward(entry, stopLoss, target, direction = 'LONG') {
  const e = parseFloat(entry);
  const sl = parseFloat(stopLoss);
  const tp = parseFloat(target);

  if (isNaN(e) || isNaN(sl) || isNaN(tp) || e <= 0 || sl <= 0 || tp <= 0) {
    return {
      ratioValue: 0,
      ratioText: '1 : 0.00',
      riskPercent: 0,
      rewardPercent: 0,
      isValid: false,
      isInverted: false,
      warning: 'Enter valid positive prices for Entry, Stop Loss, and Target.'
    };
  }

  const riskPerShare = Math.abs(e - sl);
  const rewardPerShare = Math.abs(tp - e);

  // Check division by zero
  if (riskPerShare <= 0.0000001) {
    return {
      ratioValue: 0,
      ratioText: '1 : 0.00',
      riskPercent: 0,
      rewardPercent: 0,
      isValid: false,
      isInverted: false,
      warning: 'Stop Loss cannot equal Entry price (infinite risk).'
    };
  }

  const ratio = rewardPerShare / riskPerShare;
  const riskPct = (riskPerShare / e) * 100;
  const rewardPct = (rewardPerShare / e) * 100;

  // Inversion checks based on trade direction
  let isInverted = false;
  let warning = null;

  if (direction === 'LONG') {
    if (sl >= e) {
      isInverted = true;
      warning = 'Logic Inverted: In a LONG trade, Stop Loss must be BELOW Entry price.';
    } else if (tp <= e) {
      isInverted = true;
      warning = 'Logic Inverted: In a LONG trade, Target must be ABOVE Entry price.';
    }
  } else if (direction === 'SHORT') {
    if (sl <= e) {
      isInverted = true;
      warning = 'Logic Inverted: In a SHORT trade, Stop Loss must be ABOVE Entry price.';
    } else if (tp >= e) {
      isInverted = true;
      warning = 'Logic Inverted: In a SHORT trade, Target must be BELOW Entry price.';
    }
  }

  return {
    ratioValue: Math.round(ratio * 100) / 100,
    ratioText: `1 : ${ratio.toFixed(2)}`,
    riskPercent: Math.round(riskPct * 100) / 100,
    rewardPercent: Math.round(rewardPct * 100) / 100,
    isValid: !isInverted,
    isInverted,
    warning
  };
}

/**
 * Filter trades and daily checks by timeframe
 * @param {Array} trades
 * @param {'7D'|'30D'|'1Y'|'ALL'|'CUSTOM'} timeframe
 * @param {{ startDate?: string, endDate?: string }} customRange
 * @returns {Array} Filtered trades
 */
export function filterTradesByTimeframe(trades, timeframe = 'ALL', customRange = {}) {
  if (!Array.isArray(trades)) return [];
  if (timeframe === 'ALL') return [...trades];

  const now = new Date();
  let cutoffDate = new Date();

  if (timeframe === '7D') {
    cutoffDate.setDate(now.getDate() - 7);
    cutoffDate.setHours(0, 0, 0, 0);
    return trades.filter(t => {
      if (!t.date) return false;
      const tDate = new Date(t.date);
      return tDate >= cutoffDate;
    });
  }

  if (timeframe === '30D') {
    cutoffDate.setDate(now.getDate() - 30);
    cutoffDate.setHours(0, 0, 0, 0);
    return trades.filter(t => {
      if (!t.date) return false;
      const tDate = new Date(t.date);
      return tDate >= cutoffDate;
    });
  }

  if (timeframe === '1Y') {
    cutoffDate.setFullYear(now.getFullYear() - 1);
    cutoffDate.setHours(0, 0, 0, 0);
    return trades.filter(t => {
      if (!t.date) return false;
      const tDate = new Date(t.date);
      return tDate >= cutoffDate;
    });
  }

  if (timeframe === 'CUSTOM') {
    const start = customRange.startDate ? new Date(customRange.startDate) : new Date('1970-01-01');
    const end = customRange.endDate ? new Date(customRange.endDate) : new Date('2099-12-31');
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return trades.filter(t => {
      if (!t.date) return false;
      const tDate = new Date(t.date);
      return tDate >= start && tDate <= end;
    });
  }

  return [...trades];
}

/**
 * Compute Master KPI Performance Statistics
 * @param {Array} trades
 * @param {Array} rules
 * @param {Record<string, Object>} dailyChecks
 * @returns {Object} Comprehensive statistics
 */
export function computePerformanceMetrics(trades = [], rules = [], dailyChecks = {}) {
  const totalTrades = trades.length;

  if (totalTrades === 0) {
    return {
      netPnl: 0,
      totalTrades: 0,
      wins: 0,
      losses: 0,
      breakevens: 0,
      winRate: 0,
      lossRate: 0,
      breakevenRate: 0,
      avgRR: '1 : 0.00',
      avgRRValue: 0,
      profitFactor: 0,
      grossProfit: 0,
      grossLoss: 0,
      disciplineScore: 0,
      longCount: 0,
      shortCount: 0,
      longWinRate: 0,
      shortWinRate: 0
    };
  }

  let netPnl = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let wins = 0;
  let losses = 0;
  let breakevens = 0;
  let totalRR = 0;
  let validRRCount = 0;

  let longCount = 0;
  let longWins = 0;
  let shortCount = 0;
  let shortWins = 0;

  trades.forEach(t => {
    const pnl = parseFloat(t.pnl) || 0;
    netPnl += pnl;

    if (t.outcome === 'SUCCEEDED' || (!t.outcome && pnl > 0)) {
      wins++;
      grossProfit += pnl > 0 ? pnl : 0;
      if (t.direction === 'LONG') longWins++;
      if (t.direction === 'SHORT') shortWins++;
    } else if (t.outcome === 'FAILED' || (!t.outcome && pnl < 0)) {
      losses++;
      grossLoss += pnl < 0 ? Math.abs(pnl) : 0;
    } else {
      breakevens++;
    }

    if (t.direction === 'LONG') longCount++;
    if (t.direction === 'SHORT') shortCount++;

    if (t.plannedRR) {
      // Parse "1 : 2.50" or numeric
      const match = typeof t.plannedRR === 'string' ? t.plannedRR.match(/1\s*:\s*([\d.]+)/) : null;
      const val = match ? parseFloat(match[1]) : (parseFloat(t.plannedRR) || 0);
      if (val > 0) {
        totalRR += val;
        validRRCount++;
      }
    }
  });

  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
  const lossRate = totalTrades > 0 ? (losses / totalTrades) * 100 : 0;
  const breakevenRate = totalTrades > 0 ? (breakevens / totalTrades) * 100 : 0;

  const avgRRValue = validRRCount > 0 ? totalRR / validRRCount : 0;
  const avgRR = `1 : ${avgRRValue.toFixed(2)}`;

  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? 99.9 : 0);

  const longWinRate = longCount > 0 ? (longWins / longCount) * 100 : 0;
  const shortWinRate = shortCount > 0 ? (shortWins / shortCount) * 100 : 0;

  return {
    netPnl: Math.round(netPnl * 100) / 100,
    totalTrades,
    wins,
    losses,
    breakevens,
    winRate: Math.round(winRate * 10) / 10,
    lossRate: Math.round(lossRate * 10) / 10,
    breakevenRate: Math.round(breakevenRate * 10) / 10,
    avgRR,
    avgRRValue: Math.round(avgRRValue * 100) / 100,
    profitFactor: Math.round(profitFactor * 100) / 100,
    grossProfit: Math.round(grossProfit * 100) / 100,
    grossLoss: Math.round(grossLoss * 100) / 100,
    longCount,
    shortCount,
    longWinRate: Math.round(longWinRate * 10) / 10,
    shortWinRate: Math.round(shortWinRate * 10) / 10
  };
}

/**
 * Compute Strategy Rules Adherence Analytics & Correlation
 * @param {Array} rules
 * @param {Record<string, { rulesFollowed: Record<string, boolean> }>} dailyChecks
 * @param {Array} trades
 * @returns {{
 *   overallDisciplineScore: number,
 *   ruleStats: Array<{ id: string, title: string, category: string, followedDays: number, totalEvaluatedDays: number, adherencePct: number }>,
 *   correlation: {
 *     disciplinedWinRate: number,
 *     disciplinedTradeCount: number,
 *     undisciplinedWinRate: number,
 *     undisciplinedTradeCount: number,
 *     winRateDelta: number,
 *     insight: string
 *   }
 * }}
 */
export function computeDisciplineAnalytics(rules = [], dailyChecks = {}, trades = []) {
  const activeRules = rules.filter(r => r.active !== false);
  const checkDates = Object.keys(dailyChecks);

  if (activeRules.length === 0 || checkDates.length === 0) {
    return {
      overallDisciplineScore: 100,
      ruleStats: activeRules.map(r => ({
        id: r.id,
        title: r.title,
        category: r.category || 'General',
        followedDays: 0,
        totalEvaluatedDays: 0,
        adherencePct: 100
      })),
      correlation: {
        disciplinedWinRate: 0,
        disciplinedTradeCount: 0,
        undisciplinedWinRate: 0,
        undisciplinedTradeCount: 0,
        winRateDelta: 0,
        insight: 'Log daily checklist checks to unlock psychological correlation telemetry.'
      }
    };
  }

  let totalFollowedChecks = 0;
  let totalEvaluatedChecks = 0;

  // Map per rule stats
  const ruleStats = activeRules.map(rule => {
    let followedDays = 0;
    let evaluatedDays = 0;

    checkDates.forEach(date => {
      const dayCheck = dailyChecks[date];
      if (dayCheck && dayCheck.rulesFollowed && rule.id in dayCheck.rulesFollowed) {
        evaluatedDays++;
        if (dayCheck.rulesFollowed[rule.id] === true) {
          followedDays++;
        }
      }
    });

    totalFollowedChecks += followedDays;
    totalEvaluatedChecks += evaluatedDays;

    const adherencePct = evaluatedDays > 0 ? (followedDays / evaluatedDays) * 100 : 100;

    return {
      id: rule.id,
      title: rule.title,
      category: rule.category || 'Discipline',
      followedDays,
      totalEvaluatedDays: evaluatedDays,
      adherencePct: Math.round(adherencePct * 10) / 10
    };
  });

  const overallDisciplineScore = totalEvaluatedChecks > 0
    ? Math.round((totalFollowedChecks / totalEvaluatedChecks) * 1000) / 10
    : 100;

  // Correlation: 100% disciplined days vs broken-rule days
  const disciplinedDates = new Set();
  const brokenRuleDates = new Set();

  checkDates.forEach(date => {
    const dayCheck = dailyChecks[date];
    if (!dayCheck || !dayCheck.rulesFollowed) return;

    let hasBrokenRule = false;
    let checkedCount = 0;

    activeRules.forEach(rule => {
      if (rule.id in dayCheck.rulesFollowed) {
        checkedCount++;
        if (dayCheck.rulesFollowed[rule.id] === false) {
          hasBrokenRule = true;
        }
      }
    });

    if (checkedCount > 0) {
      if (hasBrokenRule) {
        brokenRuleDates.add(date);
      } else {
        disciplinedDates.add(date);
      }
    }
  });

  // Calculate trades taken on disciplined days
  let disciplinedTrades = 0;
  let disciplinedWins = 0;
  let undisciplinedTrades = 0;
  let undisciplinedWins = 0;

  trades.forEach(trade => {
    if (disciplinedDates.has(trade.date)) {
      disciplinedTrades++;
      if (trade.outcome === 'SUCCEEDED' || parseFloat(trade.pnl) > 0) {
        disciplinedWins++;
      }
    } else if (brokenRuleDates.has(trade.date)) {
      undisciplinedTrades++;
      if (trade.outcome === 'SUCCEEDED' || parseFloat(trade.pnl) > 0) {
        undisciplinedWins++;
      }
    }
  });

  const disciplinedWinRate = disciplinedTrades > 0
    ? Math.round((disciplinedWins / disciplinedTrades) * 1000) / 10
    : 0;

  const undisciplinedWinRate = undisciplinedTrades > 0
    ? Math.round((undisciplinedWins / undisciplinedTrades) * 1000) / 10
    : 0;

  const winRateDelta = Math.round((disciplinedWinRate - undisciplinedWinRate) * 10) / 10;

  let insight = 'Maintain strict discipline across trading sessions.';
  if (disciplinedTrades > 0 && undisciplinedTrades > 0) {
    if (winRateDelta > 0) {
      insight = `Disciplined execution yields a +${winRateDelta}% edge over sessions with broken strategy rules!`;
    } else if (winRateDelta === 0) {
      insight = 'Rule adherence and broken sessions currently have identical win rates. Gather more sample size.';
    } else {
      insight = 'Analyze setup selection and stop-loss placement when following rules.';
    }
  } else if (disciplinedTrades > 0 && undisciplinedTrades === 0) {
    insight = `Flawless discipline! 100% adherence logged across all sessions with a ${disciplinedWinRate}% win rate.`;
  }

  return {
    overallDisciplineScore,
    ruleStats,
    correlation: {
      disciplinedWinRate,
      disciplinedTradeCount: disciplinedTrades,
      undisciplinedWinRate,
      undisciplinedTradeCount: undisciplinedTrades,
      winRateDelta,
      insight
    }
  };
}

/**
 * Prepares chart series data: Daily PnL and Cumulative Equity Curve
 * @param {Array} trades
 * @returns {{
 *   dailyPnlData: Array<{ date: string, pnl: number, count: number, isProfit: boolean }>,
 *   equityCurveData: Array<{ date: string, cumulativePnl: number, dailyPnl: number, tradeNumber: number }>
 * }}
 */
export function generateChartSeries(trades = []) {
  if (!Array.isArray(trades) || trades.length === 0) {
    return { dailyPnlData: [], equityCurveData: [] };
  }

  // Group by date
  const dateMap = {};
  trades.forEach(t => {
    const d = t.date || 'Unknown';
    if (!dateMap[d]) {
      dateMap[d] = { date: d, pnl: 0, count: 0, wins: 0, losses: 0 };
    }
    const val = parseFloat(t.pnl) || 0;
    dateMap[d].pnl += val;
    dateMap[d].count += 1;
    if (t.outcome === 'SUCCEEDED' || val > 0) dateMap[d].wins += 1;
    if (t.outcome === 'FAILED' || val < 0) dateMap[d].losses += 1;
  });

  // Sort dates chronologically
  const sortedDates = Object.keys(dateMap).sort((a, b) => new Date(a) - new Date(b));

  const dailyPnlData = [];
  const equityCurveData = [];
  let runningEquity = 0;

  sortedDates.forEach((d, idx) => {
    const day = dateMap[d];
    const roundedPnl = Math.round(day.pnl * 100) / 100;
    runningEquity += roundedPnl;
    const roundedEquity = Math.round(runningEquity * 100) / 100;

    dailyPnlData.push({
      date: d,
      pnl: roundedPnl,
      count: day.count,
      wins: day.wins,
      losses: day.losses,
      isProfit: roundedPnl >= 0
    });

    equityCurveData.push({
      date: d,
      cumulativePnl: roundedEquity,
      dailyPnl: roundedPnl,
      dayIndex: idx + 1
    });
  });

  return { dailyPnlData, equityCurveData };
}

/**
 * Format currency amounts nicely with neon color hints
 * @param {number} value
 * @param {string} currencySymbol ($, ₹, €)
 * @returns {string} Formatted string
 */
export function formatCurrency(value, currencySymbol = '$') {
  const num = parseFloat(value) || 0;
  const sign = num > 0 ? '+' : (num < 0 ? '-' : '');
  const absFormatted = Math.abs(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${sign}${currencySymbol}${absFormatted}`;
}
