'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (!loading && adminOnly && user?.role !== 'ADMIN') router.push('/dashboard');
  }, [loading, user, adminOnly, router]);

  if (loading) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Cargando...</div>;
  if (!user) return null;
  return <>{children}</>;
}

