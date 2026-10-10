import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AUTH_KEY = 'careerhub-auth';
const LEGACY_KEYS = [
  'careerhub-user',
  'careerhub-registered-users',
  'careerhub-applications',
  'careerhub-interviews',
  'careerhub-profile',
  'careerhub-resumes'
];
const AuthContext = createContext(null);

const getInitialAuth = () => {
  try {
    const storedAuth = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
    if (storedAuth?.token && storedAuth?.user) return storedAuth;
  } catch {
    localStorage.removeItem(AUTH_KEY);
  }
  LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  return null;
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getInitialAuth);
  const [isLoading, setIsLoading] = useState(false);
  const user = auth?.user || null;

  useEffect(() => {
    if (auth?.token && auth?.user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
      return;
    }
    localStorage.removeItem(AUTH_KEY);
  }, [auth]);

  useEffect(() => {
    const clearExpiredAuth = () => setAuth(null);
    window.addEventListener('careerhub:auth-expired', clearExpiredAuth);
    return () => window.removeEventListener('careerhub:auth-expired', clearExpiredAuth);
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      const nextAuth = { token: response.token, user: response.user };
      setAuth(nextAuth);
      localStorage.setItem(AUTH_KEY, JSON.stringify(nextAuth));
      return response.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload) => {
    setIsLoading(true);
    try {
      const { fullName, email, password, college, degree, phone, graduationYear } = payload;
      return await authService.register({ fullName, email, password, college, degree, phone, graduationYear });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => setAuth(null);
  const updateUser = (updates) => {
    setAuth((current) => current ? { ...current, user: { ...current.user, ...updates } } : current);
  };

  const value = useMemo(
    () => ({ user, token: auth?.token || null, isAuthenticated: Boolean(auth?.token && user), isLoading, login, register, logout, updateUser }),
    [auth, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
