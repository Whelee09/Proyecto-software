'use client';

import { use, useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskModal } from '@/components/TaskModal';
import { api } from '@/lib/api';
import { Task } from '@/lib/types';

export default function ProjectTasksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [key, setKey] = useState(0);
  const load = () => api.get<Task[]>(`/tasks/project/${id}`).then(({ data }) => { setTasks(data); setKey((value) => value + 1); });
  useEffect(() => { load(); }, [id]);
  return (
    <AppShell>
      <TaskModal projectId={id} onCreated={load} />
      <KanbanBoard key={key} initialTasks={tasks} />
    </AppShell>
  );
}
