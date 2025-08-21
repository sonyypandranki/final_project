import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'auth-regno';

type AuthContextValue = {
  regNo: string | null;
  isLoggedIn: boolean;
  login: (value: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [regNo, setRegNo] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setRegNo(saved);
  }, []);

  const login = (value: string) => {
    const trimmed = value.trim().toUpperCase();
    localStorage.setItem(STORAGE_KEY, trimmed);
    setRegNo(trimmed);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRegNo(null);
  };

  const value = useMemo<AuthContextValue>(() => ({
    regNo,
    isLoggedIn: Boolean(regNo),
    login,
    logout,
  }), [regNo]);

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};


