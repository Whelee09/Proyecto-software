'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';

const columns = [
  { status: 'PENDING', label: 'Pendiente', accent: 'bg-app-warning', soft: 'bg-amber-50' },
  { status: 'IN_PROGRESS', label: 'En progreso', accent: 'bg-app-primary', soft: 'bg-blue-50' },
  { status: 'COMPLETED', label: 'Completada', accent: 'bg-app-presence', soft: 'bg-emerald-50' },
] as const;

export function KanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const move = async (task: Task, status: Task['status']) => {
    const { data } = await api.patch<Task>(`/tasks/${task.id}`, { status });
    setTasks((prev) => prev.map((item) => (item.id === data.id ? data : item)));
  };
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((column, index) => {
        const columnTasks = tasks.filter((task) => task.status === column.status);
        return (
        <section key={column.status} className={`surface-grid rounded-lg border border-app-border p-3 shadow-soft ${column.soft}`}>
          <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-app-border bg-white p-3">
            <div className="flex items-center gap-3">
              <span className={`h-9 w-2 rounded-full ${column.accent}`} />
              <div>
                <p className="text-[11px] font-black uppercase text-app-muted">Linea {index + 1}</p>
                <h3 className="font-black text-app-ink">{column.label}</h3>
              </div>
            </div>
            <span className="grid h-8 min-w-8 place-items-center rounded-md border border-app-ink bg-white px-2 text-xs font-black text-app-ink shadow-tactile">{columnTasks.length}</span>
          </div>
          <div className="space-y-3">
            {columnTasks.map((task) => (
              <div key={task.id} className="animate-floatIn">
                <TaskCard task={task} />
                <div className="mt-2 flex gap-1">
                  {columns.filter((target) => target.status !== task.status).map((target) => (
                    <button className="rounded-md border border-app-border bg-white px-2 py-1 text-[11px] font-black text-app-muted transition hover:border-app-ink hover:text-app-ink" key={target.status} onClick={() => move(task, target.status)}>{target.label}</button>
                  ))}
                </div>
              </div>
            ))}
            {!columnTasks.length && (
              <div className="rounded-lg border border-dashed border-app-border bg-white/80 p-4 text-sm font-semibold text-app-muted">
                No hay tarjetas en esta linea.
              </div>
            )}
          </div>
        </section>
      );
      })}
    </div>
  );
}

