import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Restore active session only if user previously logged in
    const activeSession = StorageService.getActiveSession();
    if (activeSession) {
      setCurrentUser(activeSession);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    setAuthError(null);
    try {
      const user = StorageService.loginUser(email, password);
      StorageService.setActiveSession(user);
      setCurrentUser(user);
      return { success: true, user };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = (name, email, password) => {
    setAuthError(null);
    try {
      const newUser = StorageService.registerUser({ name, email, password });
      StorageService.setActiveSession(newUser);
      setCurrentUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, error: err.message };
    }
  };

  const loginAsDemo = () => {
    setAuthError(null);
    let demo = StorageService.findUserByEmail('demo@cybertrade.io');
    if (!demo) {
      demo = StorageService.registerUser({
        name: 'Demo Trader',
        email: 'demo@cybertrade.io',
        password: 'DemoPassword2026!'
      });
      StorageService.seedDemoEnvironment(demo.id);
    } else {
      // Ensure demo data exists
      const trades = StorageService.getTrades(demo.id);
      if (trades.length === 0) {
        StorageService.seedDemoEnvironment(demo.id);
      }
    }
    StorageService.setActiveSession(demo);
    setCurrentUser(demo);
    return { success: true, user: demo };
  };

  const logout = () => {
    StorageService.setActiveSession(null);
    setCurrentUser(null);
  };

  const updateProfile = (updates) => {
    if (!currentUser) return;
    const users = StorageService.getUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      StorageService.saveUsers(users);
      const updatedUser = users[idx];
      StorageService.setActiveSession(updatedUser);
      setCurrentUser(updatedUser);
    }
  };

  const evaluatePasswordStrength = (pass = '') => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { label: 'Weak', color: 'text-rose-400', bg: 'bg-rose-500', percent: 25 };
    if (score === 2) return { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-400', percent: 50 };
    if (score === 3) return { label: 'Good', color: 'text-cyan-400', bg: 'bg-cyan-400', percent: 75 };
    return { label: 'Strong', color: 'text-emerald-400', bg: 'bg-emerald-400', percent: 100 };
  };

  const isCloudConfigured = Boolean(
    import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_FIREBASE_API_KEY
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authError,
        login,
        register,
        loginAsDemo,
        logout,
        updateProfile,
        evaluatePasswordStrength,
        isCloudConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
