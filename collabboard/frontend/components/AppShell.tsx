'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, CalendarDays, LogOut, Shield, Users, UserCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { UserAvatar } from './UserAvatar';
import { NotificationBell } from './NotificationBell';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/teams', label: 'Equipos', icon: Users },
  { href: '/calendar', label: 'Calendario', icon: CalendarDays },
  { href: '/profile', label: 'Perfil', icon: UserCircle },
  { href: '/admin', label: 'Admin', icon: Shield },
];

export function AppShell({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  return (
    <ProtectedRoute adminOnly={adminOnly}>
      <div className="min-h-screen bg-app-bg md:flex">
        <aside className="bg-app-sidebar text-white md:fixed md:inset-y-0 md:w-64">
          <div className="flex h-16 items-center border-b border-white/10 px-5">
            <div>
              <p className="text-lg font-bold">CollabBoard</p>
              <p className="text-xs text-slate-300">Trabajo en equipo</p>
            </div>
          </div>
          <nav className="flex gap-2 overflow-auto px-3 py-3 md:block md:space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href.replace('/demo', ''));
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={`flex min-w-max items-center gap-3 rounded-md px-3 py-2 text-sm ${active ? 'bg-white text-app-sidebar' : 'text-slate-200 hover:bg-white/10'}`}>
                  <Icon size={18} /> {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="md:ml-64 md:min-h-screen md:flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-8">
            <div>
              <p className="text-sm text-slate-500">Plataforma de colaboracion</p>
              <h1 className="text-lg font-semibold text-app-text">Panel de trabajo</h1>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              {user && <UserAvatar user={user} />}
              <button className="btn btn-secondary" onClick={logout}><LogOut size={16} /> Salir</button>
            </div>
          </header>
          <section className="p-4 md:p-8">{children}</section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
