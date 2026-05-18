'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Task } from '@/lib/types';
import { TaskCard } from './TaskCard';

const columns = [
  { status: 'PENDING', label: 'Pendiente' },
  { status: 'IN_PROGRESS', label: 'En progreso' },
  { status: 'COMPLETED', label: 'Completada' },
] as const;

export function KanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const move = async (task: Task, status: Task['status']) => {
    const { data } = await api.patch<Task>(`/tasks/${task.id}`, { status });
    setTasks((prev) => prev.map((item) => (item.id === data.id ? data : item)));
  };
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {columns.map((column) => (
        <section key={column.status} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">{column.label}</h3>
            <span className="text-xs text-slate-500">{tasks.filter((task) => task.status === column.status).length}</span>
          </div>
          <div className="space-y-3">
            {tasks.filter((task) => task.status === column.status).map((task) => (
              <div key={task.id}>
                <TaskCard task={task} />
                <div className="mt-2 flex gap-1">
                  {columns.filter((target) => target.status !== task.status).map((target) => (
                    <button className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] text-slate-600" key={target.status} onClick={() => move(task, target.status)}>{target.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

