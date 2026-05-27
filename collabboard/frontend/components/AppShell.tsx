'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, BarChart3, CalendarDays, LogOut, Shield, Users, UserCircle } from 'lucide-react';
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

function currentSection(pathname: string) {
  if (pathname.startsWith('/teams')) return { kicker: 'Equipos', title: 'Equipos y proyectos' };
  if (pathname.startsWith('/calendar')) return { kicker: 'Calendario', title: 'Eventos y fechas' };
  if (pathname.startsWith('/chat')) return { kicker: 'Chat', title: 'Mensajes del canal' };
  if (pathname.startsWith('/projects')) return { kicker: 'Proyecto', title: 'Tareas del proyecto' };
  if (pathname.startsWith('/admin')) return { kicker: 'Control de acceso', title: 'Administracion' };
  if (pathname.startsWith('/profile')) return { kicker: 'Cuenta', title: 'Perfil' };
  return { kicker: 'Resumen', title: 'Dashboard' };
}

export function AppShell({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const section = currentSection(pathname);

  return (
    <ProtectedRoute adminOnly={adminOnly}>
      <div className="min-h-screen md:flex">
        <aside className="border-b border-white/10 bg-app-sidebar text-white md:fixed md:inset-y-0 md:w-72 md:border-b-0 md:border-r md:border-white/10">
          <div className="flex min-h-20 items-center justify-between gap-4 px-5">
            <Link href="/dashboard" className="group flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg border border-white/20 bg-white text-app-ink shadow-tactile transition group-hover:-translate-y-0.5">
                <Activity size={21} />
              </span>
              <span>
                <span className="block text-lg font-black leading-tight">CollabBoard</span>
                <span className="block text-xs font-semibold text-white/65">Gestion de equipos</span>
              </span>
            </Link>
          </div>
          <nav className="flex gap-2 overflow-auto px-3 pb-4 md:block md:space-y-2 md:px-4">
            {nav.map((item) => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex min-w-max items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-bold transition md:min-w-0 ${
                    active
                      ? 'border-white bg-white text-app-ink shadow-tactile'
                      : 'border-transparent text-white/72 hover:border-white/15 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className={`grid h-8 w-8 place-items-center rounded-md transition ${active ? 'bg-app-primary text-white' : 'bg-white/10 text-white/80 group-hover:bg-white group-hover:text-app-ink'}`}>
                    <Icon size={17} />
                  </span>
                  <span>{item.label}</span>
                  {active && <span className="ml-auto hidden h-2 w-2 rounded-full bg-app-presence md:block" />}
                </Link>
              );
            })}
          </nav>
          <div className="hidden px-4 pb-5 md:block">
            <div className="surface-grid rounded-lg border border-white/10 bg-white/[0.06] p-4">
              <p className="text-xs font-black uppercase text-white/60">Datos locales</p>
              <p className="mt-3 text-sm font-semibold leading-5 text-white/82">Backend y base de datos conectados para pruebas.</p>
            </div>
          </div>
        </aside>
        <main className="md:ml-72 md:min-h-screen md:flex-1">
          <header className="sticky top-0 z-20 border-b border-app-border bg-app-bg/90 px-4 backdrop-blur-xl md:px-8">
            <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="label">{section.kicker}</p>
                <h1 className="truncate text-xl font-black text-app-text md:text-2xl">{section.title}</h1>
              </div>
              <div className="hidden items-center gap-2 lg:flex">
                <span className="status-chip">Datos demo</span>
              </div>
              <div className="flex shrink-0 items-center gap-2 md:gap-3">
                <NotificationBell />
                {user && <UserAvatar user={user} />}
                <button className="btn btn-secondary px-3" onClick={logout} aria-label="Salir">
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            </div>
          </header>
          <section className="mx-auto max-w-7xl animate-floatIn p-4 md:p-8">{children}</section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
