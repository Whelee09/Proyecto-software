'use client';

import { useEffect, useState } from 'react';
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
      <form onSubmit={create} className="card space-y-3 p-4">
        <h3 className="font-semibold">Nuevo evento</h3>
        <input className="input" placeholder="Titulo" value={title} onChange={(event) => setTitle(event.target.value)} required />
        <input className="input" type="datetime-local" value={startDate} onChange={(event) => setStartDate(event.target.value)} required />
        <button className="btn btn-primary w-full">Crear evento</button>
      </form>
      <div className="card p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <article key={event.id} className="rounded-md border border-slate-200 p-3">
              <p className="text-sm font-semibold">{event.title}</p>
              <p className="mt-1 text-xs text-slate-500">{new Date(event.startDate).toLocaleString('es-CO')}</p>
              <span className="mt-3 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">{event.type}</span>
            </article>
          ))}
          {!events.length && <p className="text-sm text-slate-500">No hay eventos para mostrar.</p>}
        </div>
      </div>
    </div>
  );
}
