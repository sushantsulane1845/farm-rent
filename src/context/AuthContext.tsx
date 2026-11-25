import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppNotification, Language, User, UserRole } from '../types';
import { apiFetch, setInMemoryAuthToken } from '../lib/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  notifications: AppNotification[];
  unreadCount: number;
  refreshUser: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  loginDemo: (demoUserId: 'demo-farmer-1' | 'demo-owner-1') => Promise<User>;
  loginEmail: (email: string, password: string) => Promise<User>;
  registerEmail: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    roles: UserRole[];
    village?: string;
    taluka?: string;
    district?: string;
    preferredLang?: Language;
  }) => Promise<User>;
  requestDemoOtp: (phone: string) => Promise<{ previewOtpCode: string }>;
  verifyDemoOtp: (phone: string, otp: string, name?: string) => Promise<User>;
  resetDemoPassword: (email: string, newPassword: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const refreshNotifications = useCallback(async () => {
    try {
      const data = await apiFetch<{ notifications: AppNotification[] }>('/api/notifications');
      setNotifications(data.notifications);
    } catch {
      setNotifications([]);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch<{ user: User | null }>('/api/auth/me');
      setUser(data.user);
      if (data.user) {
        await refreshNotifications();
      } else {
        setNotifications([]);
      }
    } catch {
      setUser(null);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [refreshNotifications]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const loginDemo = async (demoUserId: 'demo-farmer-1' | 'demo-owner-1') => {
    const data = await apiFetch<{ user: User; token: string }>('/api/auth/demo', {
      method: 'POST',
      body: JSON.stringify({ demoUserId }),
    });
    setInMemoryAuthToken(data.token);
    setUser(data.user);
    await refreshNotifications();
    return data.user;
  };

  const loginEmail = async (email: string, password: string) => {
    const data = await apiFetch<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setInMemoryAuthToken(data.token);
    setUser(data.user);
    await refreshNotifications();
    return data.user;
  };

  const registerEmail = async (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    roles: UserRole[];
    village?: string;
    taluka?: string;
    district?: string;
    preferredLang?: Language;
  }) => {
    const data = await apiFetch<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setInMemoryAuthToken(data.token);
    setUser(data.user);
    await refreshNotifications();
    return data.user;
  };

  const requestDemoOtp = async (phone: string) => {
    return apiFetch<{ previewOtpCode: string }>('/api/auth/demo-otp/request', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  };

  const verifyDemoOtp = async (phone: string, otp: string, name?: string) => {
    const data = await apiFetch<{ user: User; token: string }>('/api/auth/demo-otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, name }),
    });
    setInMemoryAuthToken(data.token);
    setUser(data.user);
    await refreshNotifications();
    return data.user;
  };

  const resetDemoPassword = async (email: string, newPassword: string) => {
    await apiFetch('/api/auth/demo-reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword }),
    });
  };

  const updateProfile = async (updates: Partial<User>) => {
    const data = await apiFetch<{ user: User }>('/api/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    setUser(data.user);
    return data.user;
  };

  const markAllNotificationsRead = async () => {
    await apiFetch('/api/notifications/read-all', { method: 'POST' });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const logout = async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    setInMemoryAuthToken(null);
    setUser(null);
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        notifications,
        unreadCount,
        refreshUser,
        refreshNotifications,
        markAllNotificationsRead,
        loginDemo,
        loginEmail,
        registerEmail,
        requestDemoOtp,
        verifyDemoOtp,
        resetDemoPassword,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
