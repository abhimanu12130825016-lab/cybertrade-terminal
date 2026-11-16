# ⚡ CyberTrade Terminal — Dark Cyberpunk Trading & Investing Journal

[![Build Status](https://img.shields.io/badge/Build-Passing-00FF9D?style=for-the-badge&logo=vite)](https://github.com/abhimanu12130825016-lab/cybertrade-terminal)
[![License: MIT](https://img.shields.io/badge/License-MIT-00F0FF?style=for-the-badge)](LICENSE)
[![Theme: Dark Cyberpunk](https://img.shields.io/badge/Theme-Dark%20Cyberpunk-B829EA?style=for-the-badge)]()
[![React: 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)]()
[![Tailwind: CSS 3](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)]()

> **CyberTrade Terminal** is an elite, multi-user Trading & Investing Journal web application designed for serious discretionary traders, prop firm operatives, and quantitative investors. Encased in a high-tech dark cyberpunk UI with interactive financial charts and a psychology correlation engine.

---

## 🌌 Visual Design System

- **Deep Void Black Background (`#050508`)**: Engineered for nocturnal focus and prolonged screen sessions.
- **Elevated Obsidian Glass Panels (`#0D0E15`)**: Powered by `backdrop-filter: blur(14px)` and subtle 1px neon borders (`rgba(0, 240, 255, 0.18)`).
- **Chromatic Cyberpunk Accents**:
  - 🔵 **Electric Cyan (`#00F0FF`)**: Primary telemetry & interactive controls
  - 🟣 **Neon Magenta / Violet (`#B829EA`)**: Secondary signals & psychological analytics
  - 🟢 **Matrix Emerald (`#00FF9D`)**: Realized profits, winning streaks, positive expectancy
  - 🔴 **Crimson Neon (`#FF2A5F`)**: Losses, risk threshold warnings, and inversion alerts
- **Typography Matrix**:
  - **Orbitron & Space Grotesk**: Header telemetry, call signs, and KPI numbers
  - **Inter**: Crisp, distraction-free UI readability
  - **JetBrains Mono**: Tabular numeric precision for all price ladders, PnL values, timestamps, and R:R ratios.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 19 + Vite 8
- **Styling**: Tailwind CSS + PostCSS + Custom Cyberpunk Glassmorphism Utilities
- **Data Visualizations**: Recharts (Interactive Area Equity Curves, Daily PnL Bar Charts, Outcome Probabilities)
- **Icons**: Lucide React
- **Micro-Interactions**: Canvas Confetti + Custom Neon Pulse Animations
- **Data Persistence & Auth**:
  - **Air-Gapped Local-First Adapter**: Out-of-the-box multi-user isolated storage in `localStorage` + `IndexedDB` with strict `userId` ownership.
  - **Cloud Ready**: Pluggable adapter hooks for **Supabase** (PostgreSQL + RLS) and **Firebase** (Firestore + Auth).
  - **Zero Data Loss Guarantee**: One-click Full JSON Backup, Tabular CSV Export, and verified JSON snapshot restore.

---

## 🎯 Core Features

### 1. Multi-User Authentication & Account Isolation
- Email & password authentication with cryptographic password strength analyzer (`VULNERABLE` → `CYBER-SHIELDED`).
- Complete data isolation per operative account (`userId`).
- Instant **"Test Pilot Mode"** for immediate demo exploration with pre-seeded multi-asset history.
- Persistent sessions across browser refreshes.

### 2. Date-Grouped Trade & Investment Logger
- Select any **Trading Date** (calendar picker, defaulting to today).
- Log multiple executions under that single date (Trade #1, Trade #2, Trade #3...).
- **Real-Time Financial Risk Engine**:
  - Automatically calculates Planned Risk-to-Reward Ratio: $\frac{|\text{Target} - \text{Entry}|}{|\text{Entry} - \text{Stop Loss}|}$ (formatted as `1 : X.XX`).
  - Real-time Risk % computation.
  - **Inversion Protection**: Detects and warns if Stop Loss / Target logic is inverted for Long vs. Short trades.
- Outcome tracking: `SUCCEEDED` (Win), `FAILED` (Loss), or `BREAKEVEN`.
- Rich qualitative notes: setup catalyst, market regime, and emotional state.

### 3. Trading Strategy Rules Engine & Discipline Tracker
- **Custom Rules Manager**: Create, edit, toggle, and categorize personal trading strategy rules (Execution, Risk Management, Psychology, Analysis).
- **Daily Interactive Checklist**: Mark which rules you strictly followed or broke on every trading date.
- **Psychological Correlation Engine**:
  - Calculates exact adherence % per individual rule (e.g. `84.2% followed across X days`).
  - Overall Strategy Discipline Score (% of total rules obeyed).
  - **Correlation Telemetry**: Direct comparison of win rate on 100% disciplined days vs. days when strategy rules were breached.

### 4. Dynamic Timeframe Filter & Master Performance Dashboard
- Global filter switcher: **Weekly (7D)**, **Monthly (30D)**, **Yearly (1Y)**, **All-Time**, or **Custom Date Range**.
- **6 Live KPI Metric Cards**:
  1. *Net Cumulative PnL* (emerald for profit / crimson for loss with gross metrics)
  2. *Total Executions* (exact count + Long vs Short breakdown)
  3. *Trades Succeeded (Wins)* (count + win rate %)
  4. *Trades Failed (Losses)* (count + loss rate % + breakeven %)
  5. *Average Risk-to-Reward* (e.g. `1 : 2.58` + Profit Factor)
  6. *Strategy Discipline Score* (interval rule adherence %)
- **Interactive Visualizations**:
  - *Cumulative Equity Curve*: Neon cyan glowing area trajectory.
  - *Daily Realized PnL Distribution*: Colored daily bars.
  - *Outcome & Asymmetry Gauges*: Donut breakdown and Long vs Short metrics.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm / yarn / pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/abhimanu12130825016-lab/cybertrade-terminal.git

# Navigate into project directory
cd cybertrade-terminal

# Install dependencies
npm install --legacy-peer-deps

# Start Vite development server
npm run dev
```

The terminal will launch locally at `http://localhost:5173`.

---

## ☁️ Cloud Persistence Setup (Optional)

CyberTrade works immediately without any external services using its **Local-First Air-Gapped Engine**. To sync across multiple machines via Cloud:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure **Supabase** or **Firebase** parameters:
   ```env
   # Option A: Supabase
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key

   # Option B: Firebase
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_PROJECT_ID=your-project-id
   ```

---

## 🔒 Security & Data Integrity

- **Strict User Isolation**: All keys in storage are partitioned by user ID (`cybertrade_trades_${userId}`).
- **Confirmation Modals**: Every destructive action (deleting trades, rules, or purging account data) triggers a confirmation dialog.
- **One-Click Backup Vault**: Export complete JSON snapshots or CSV spreadsheets anytime with zero telemetry loss.

---

## 📜 License

Distributed under the MIT License. Built with passion by Principal Full-Stack Engineers for elite traders.
