import Link from 'next/link';
import { CalendarDays, Files, ListChecks, MessageSquare } from 'lucide-react';
import { Project } from '@/lib/types';

export function ProjectCard({ project }: { project: Project }) {
  const status = {
    ACTIVE: 'bg-app-presence text-white',
    PAUSED: 'bg-app-warning text-app-ink',
    COMPLETED: 'bg-app-primary text-white',
  }[project.status];

  return (
    <article className="group relative overflow-hidden rounded-lg border border-app-border bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-app-ink hover:shadow-tactile">
      <div className="absolute inset-x-0 top-0 h-1 bg-app-primary" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase text-app-muted">Proyecto</p>
          <h3 className="mt-1 text-lg font-black text-app-ink">{project.name}</h3>
          <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-app-muted">{project.description || 'Sin descripcion'}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-black ${status}`}>{project.status}</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link className="btn btn-primary" href={`/projects/${project.id}/tasks`}><ListChecks size={16} /> Tareas</Link>
        <Link className="btn btn-secondary" href={`/projects/${project.id}/calendar`}><CalendarDays size={16} /> Calendario</Link>
        <Link className="btn btn-secondary" href={`/projects/${project.id}/files`}><Files size={16} /> Archivos</Link>
        {project.channels?.map((channel) => (
          <Link className="btn btn-secondary" key={channel.id} href={`/chat/${channel.id}`}><MessageSquare size={16} /> Chat</Link>
        ))}
      </div>
    </article>
  );
}

