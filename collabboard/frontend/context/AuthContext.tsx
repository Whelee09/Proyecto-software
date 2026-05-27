'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/types';

const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const demoToken = process.env.NEXT_PUBLIC_DEMO_TOKEN ?? 'dev-demo-token';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ needsVerification: boolean }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshMe = async () => {
    if (demoMode) {
      localStorage.setItem('collabboard_token', demoToken);
      const { data } = await api.get<User>('/auth/me');
      setUser(data);
      setLoading(false);
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }
    const { data } = await api.get<User>('/auth/me');
    setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    refreshMe().catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data } = await api.get<User>('/auth/me');
        setUser(data);
        router.push('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    refreshMe,
    login: async (email, password) => {
      if (demoMode) {
        localStorage.setItem('collabboard_token', demoToken);
        const { data } = await api.get<User>('/auth/me');
        setUser(data);
        router.push('/dashboard');
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
    },
    register: async (name, email, password) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw new Error(error.message);
      return { needsVerification: true };
    },
    loginWithGoogle: async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) throw new Error(error.message);
    },
    logout: async () => {
      if (demoMode) {
        localStorage.removeItem('collabboard_token');
        setUser(null);
        router.push('/login');
        return;
      }
      await supabase.auth.signOut();
    },
  }), [user, loading, router]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
