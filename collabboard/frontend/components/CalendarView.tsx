'use client';

import { useEffect, useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import { api } from '@/lib/api';
import { EventItem } from '@/lib/types';

export function CalendarView({ projectId, teamId, initialEvents }: { projectId?: string; teamId: string; initialEvents: EventItem[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  useEffect(() => setEvents(initialEvents), [initialEvents]);
  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    const { data } = await api.post<EventItem>('/events', { teamId, projectId, title, type: 'MEETING', startDate, endDate: startDate });
    setEvents((prev) => [...prev, data].sort((a, b) => a.startDate.localeCompare(b.startDate)));
    setTitle('');
  };
  return (
    <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
      <form onSubmit={create} className="workspace-panel space-y-3 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-app-primary text-white shadow-tactile">
            <CalendarPlus size={19} />
          </span>
          <div>
            <p className="label">Agenda</p>
            <h3 className="font-black">Nuevo evento</h3>
          </div>
        </div>
        <input className="input" placeholder="Titulo" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <input className="input" type="datetime-local" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
        <button className="btn btn-primary w-full"><CalendarPlus size={16} /> Crear evento</button>
      </form>
      <div className="workspace-panel p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <article key={event.id} className="rounded-lg border border-app-border bg-white p-3 shadow-soft transition hover:-translate-y-0.5 hover:border-app-primary">
              <p className="text-sm font-black text-app-ink">{event.title}</p>
              <p className="mt-1 text-xs font-semibold text-app-muted">{new Date(event.startDate).toLocaleString('es-CO')}</p>
              <span className="mt-3 inline-block rounded-full bg-app-primary px-2 py-1 text-xs font-black text-white">{event.type}</span>
            </article>
          ))}
          {!events.length && <p className="rounded-lg border border-dashed border-app-border p-4 text-sm font-semibold text-app-muted">No hay eventos para mostrar.</p>}
        </div>
      </div>
    </div>
  );
}
