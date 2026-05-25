import Link from 'next/link';
import { Project } from '@/lib/types';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{project.name}</h3>
          <p className="mt-2 text-sm text-slate-500">{project.description || 'Sin descripcion'}</p>
        </div>
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">{project.status}</span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link className="btn btn-primary" href={`/projects/${project.id}/tasks`}>Tareas</Link>
        <Link className="btn btn-secondary" href={`/projects/${project.id}/calendar`}>Calendario</Link>
        <Link className="btn btn-secondary" href={`/projects/${project.id}/files`}>Archivos</Link>
        {project.channels?.map((channel) => (
          <Link className="btn btn-secondary" key={channel.id} href={`/chat/${channel.id}`}>Chat</Link>
        ))}
      </div>
    </div>
  );
}

