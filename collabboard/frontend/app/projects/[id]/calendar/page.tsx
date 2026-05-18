'use client';

import { use, useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { CalendarView } from '@/components/CalendarView';
import { api } from '@/lib/api';
import { EventItem, Project } from '@/lib/types';

export default function ProjectCalendarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  useEffect(() => {
    api.get<Project>(`/projects/${id}`).then(({ data }) => setProject(data));
    api.get<EventItem[]>(`/events/project/${id}`).then(({ data }) => setEvents(data));
  }, [id]);
  return (
    <AppShell>
      {project ? <CalendarView projectId={id} teamId={project.teamId} initialEvents={events} /> : <p>Cargando calendario...</p>}
    </AppShell>
  );
}
