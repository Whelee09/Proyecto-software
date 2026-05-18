'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { User } from '@/lib/types';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshMe = async () => {
    const token = localStorage.getItem('collabboard_token');
    if (!token) {
      setLoading(false);
      return;
    }
    const { data } = await api.get<User>('/auth/me');
    setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshMe().catch(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    refreshMe,
    login: async (email, password) => {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('collabboard_token', data.accessToken);
      setUser(data.user);
      router.push('/dashboard');
    },
    register: async (name, email, password) => {
      const { data } = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('collabboard_token', data.accessToken);
      setUser(data.user);
      router.push('/dashboard');
    },
    logout: () => {
      localStorage.removeItem('collabboard_token');
      setUser(null);
      router.push('/login');
    },
  }), [user, loading, router]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}

