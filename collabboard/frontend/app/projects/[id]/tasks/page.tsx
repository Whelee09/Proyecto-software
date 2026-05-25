'use client';

import { use, useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { KanbanBoard } from '@/components/KanbanBoard';
import { TaskModal } from '@/components/TaskModal';
import { api } from '@/lib/api';
import { Project, Task } from '@/lib/types';

export default function ProjectTasksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [key, setKey] = useState(0);
  const load = () => api.get<Task[]>(`/tasks/project/${id}`).then(({ data }) => { setTasks(data); setKey((value) => value + 1); });
  useEffect(() => {
    load();
    api.get<Project>(`/projects/${id}`).then(({ data }) => setProject(data));
  }, [id]);
  return (
    <AppShell>
      <TaskModal projectId={id} projectName={project?.name} onCreated={load} />
      <KanbanBoard key={key} initialTasks={tasks} />
    </AppShell>
  );
}
