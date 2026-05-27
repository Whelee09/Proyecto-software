'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, FileText, MessageSquare } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { DashboardCards } from '@/components/DashboardCards';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  useEffect(() => { api.get('/dashboard/summary').then(({ data }) => setSummary(data)); }, []);
  const upcomingEvents = summary?.upcomingEvents ?? [];
  const latestFiles = summary?.latestFiles ?? [];
  const latestMessages = summary?.latestMessages ?? [];

  return (
    <AppShell>
      <DashboardCards summary={summary} />
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <section className="workspace-panel p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="label">Agenda</p>
              <h2 className="text-lg font-black">Eventos proximos</h2>
            </div>
            <CalendarDays className="text-app-primary" size={22} />
          </div>
          <div className="mt-4 space-y-3">
            {upcomingEvents.map((event: any) => (
              <article className="rounded-lg border border-app-border bg-app-surfaceTint p-3 text-sm transition hover:-translate-y-0.5 hover:border-app-primary" key={event.id}>
                <p className="font-black text-app-ink">{event.title}</p>
                {event.startDate && <p className="mt-1 text-xs font-semibold text-app-muted">{new Date(event.startDate).toLocaleString('es-CO')}</p>}
              </article>
            ))}
            {!upcomingEvents.length && <p className="rounded-lg border border-dashed border-app-border p-4 text-sm font-semibold text-app-muted">No hay eventos proximos.</p>}
          </div>
        </section>
        <section className="workspace-panel p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="label">Archivos</p>
              <h2 className="text-lg font-black">Ultimos archivos</h2>
            </div>
            <FileText className="text-app-presence" size={22} />
          </div>
          <div className="mt-4 space-y-3">
            {latestFiles.map((file: any) => (
              <article className="flex items-center gap-3 rounded-lg border border-app-border bg-white p-3 text-sm transition hover:-translate-y-0.5 hover:border-app-presence" key={file.id}>
                <span className="grid h-9 w-9 place-items-center rounded-md bg-app-presence text-xs font-black text-white">DOC</span>
                <p className="min-w-0 truncate font-black">{file.originalName}</p>
              </article>
            ))}
            {!latestFiles.length && <p className="rounded-lg border border-dashed border-app-border p-4 text-sm font-semibold text-app-muted">Todavia no hay archivos recientes.</p>}
          </div>
        </section>
        <section className="workspace-panel p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="label">Conversacion</p>
              <h2 className="text-lg font-black">Ultimos mensajes</h2>
            </div>
            <MessageSquare className="text-app-discovery" size={22} />
          </div>
          <div className="mt-4 space-y-3">
            {latestMessages.map((message: any) => (
              <article className="rounded-lg border border-app-border bg-white p-3 text-sm transition hover:-translate-y-0.5 hover:border-app-discovery" key={message.id}>
                <p className="font-black text-app-ink">{message.user.name}</p>
                <p className="mt-1 line-clamp-2 text-app-muted">{message.content}</p>
              </article>
            ))}
            {!latestMessages.length && <p className="rounded-lg border border-dashed border-app-border p-4 text-sm font-semibold text-app-muted">No hay mensajes recientes.</p>}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

