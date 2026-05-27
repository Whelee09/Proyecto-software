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

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="workspace-panel surface-grid w-full max-w-sm p-6 text-center">
        <span className="mx-auto mb-4 block h-3 w-3 rounded-full bg-app-presence animate-pulseSoft" />
        <p className="text-sm font-black uppercase text-app-muted">Cargando workspace...</p>
      </div>
    </div>
  );
  if (!user) return null;
  return <>{children}</>;
}

