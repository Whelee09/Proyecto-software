'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EventItem } from '@/lib/types';

const projectColors = [
  { bg: 'bg-blue-600', soft: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800' },
  { bg: 'bg-emerald-600', soft: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800' },
  { bg: 'bg-amber-500', soft: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800' },
  { bg: 'bg-rose-600', soft: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800' },
  { bg: 'bg-violet-600', soft: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800' },
  { bg: 'bg-cyan-600', soft: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-800' },
  { bg: 'bg-slate-600', soft: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-800' },
];

const weekdays = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function eventDayKey(event: EventItem) {
  const date = new Date(event.startDate);
  return dayKey(date);
}

function eventTime(event: EventItem) {
  return new Date(event.startDate).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

export function GlobalCalendar({ events }: { events: EventItem[] }) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const today = dayKey(new Date());

  const projectIds = useMemo(() => {
    return Array.from(new Set(events.map((event) => event.project?.id ?? 'team').filter(Boolean)));
  }, [events]);

  const colorByProject = useMemo(() => {
    return new Map(projectIds.map((id, index) => [id, projectColors[index % projectColors.length]]));
  }, [projectIds]);

  const eventsByDay = useMemo(() => {
    return events.reduce<Record<string, EventItem[]>>((acc, event) => {
      const key = eventDayKey(event);
      acc[key] = [...(acc[key] ?? []), event];
      return acc;
    }, {});
  }, [events]);

  const calendarDays = useMemo(() => {
    const first = startOfMonth(currentMonth);
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + index);
      return date;
    });
  }, [currentMonth]);

  const legend = useMemo(() => {
    const byProject = new Map<string, { name: string; color: (typeof projectColors)[number] }>();
    events.forEach((event) => {
      const id = event.project?.id ?? 'team';
      if (!byProject.has(id)) {
        byProject.set(id, {
          name: event.project?.name ?? 'Eventos de equipo',
          color: colorByProject.get(id) ?? projectColors[0],
        });
      }
    });
    return Array.from(byProject.entries());
  }, [events, colorByProject]);

  const todayEvents = useMemo(() => {
    return events
      .filter((event) => eventDayKey(event) === today)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [events, today]);

  return (
    <div className="space-y-5">
      <section className="card p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="label">Hoy</p>
            <h2 className="text-xl font-bold">Eventos del dia</h2>
          </div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-app-primary">{todayEvents.length} eventos</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {todayEvents.map((event) => {
            const color = colorByProject.get(event.project?.id ?? 'team') ?? projectColors[0];
            return (
              <article key={event.id} className={`rounded-md border p-3 ${color.soft} ${color.border}`}>
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${color.bg}`} />
                  <p className={`font-semibold ${color.text}`}>{event.title}</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">{eventTime(event)} · {event.project?.name ?? event.team?.name ?? 'Equipo'}</p>
              </article>
            );
          })}
          {!todayEvents.length && <p className="text-sm text-slate-500">No tienes eventos programados para hoy.</p>}
        </div>
      </section>

      <section className="card p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="label">Calendario personal</p>
            <h2 className="text-2xl font-bold capitalize">
              {currentMonth.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} aria-label="Mes anterior">
              <ChevronLeft size={18} />
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentMonth(startOfMonth(new Date()))}>Hoy</button>
            <button className="btn btn-secondary" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} aria-label="Mes siguiente">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {legend.map(([id, item]) => (
            <span key={id} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color.bg}`} />
              {item.name}
            </span>
          ))}
          {!legend.length && <span className="text-sm text-slate-500">No tienes eventos programados.</span>}
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {weekdays.map((day) => (
            <div key={day} className="px-2 py-3 text-center text-xs font-bold uppercase text-slate-500 md:text-sm">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7">
          {calendarDays.map((date) => {
            const key = dayKey(date);
            const dayEvents = eventsByDay[key] ?? [];
            const outside = date.getMonth() !== currentMonth.getMonth();
            return (
              <div key={key} className={`min-h-32 border-b border-slate-200 p-2 md:border-r ${outside ? 'bg-slate-50/70 text-slate-400' : 'bg-white'}`}>
                <div className="mb-2 flex items-center justify-between">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${key === today ? 'bg-app-primary text-white' : ''}`}>
                    {date.getDate()}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 md:hidden">
                    {date.toLocaleDateString('es-CO', { weekday: 'short' })}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 4).map((event) => {
                    const color = colorByProject.get(event.project?.id ?? 'team') ?? projectColors[0];
                    return (
                      <article key={event.id} className={`rounded-md border px-2 py-1 ${color.soft} ${color.border}`}>
                        <div className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${color.bg}`} />
                          <p className={`truncate text-xs font-semibold ${color.text}`}>{event.title}</p>
                        </div>
                        <p className="mt-0.5 truncate text-[11px] text-slate-500">
                          {eventTime(event)} · {event.project?.name ?? event.team?.name ?? 'Equipo'}
                        </p>
                      </article>
                    );
                  })}
                  {dayEvents.length > 4 && <p className="text-[11px] font-semibold text-slate-500">+{dayEvents.length - 4} mas</p>}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
