'use client';

import { use, useEffect, useState } from 'react';
import { MessageSquare, Plus, UserPlus, Users } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { ProjectCard } from '@/components/ProjectCard';
import { RoleBadge } from '@/components/RoleBadge';
import { api } from '@/lib/api';
import { Project, Team } from '@/lib/types';
import Link from 'next/link';

export default function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [team, setTeam] = useState<Team | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState('');
  const [email, setEmail] = useState('');
  const load = () => {
    api.get<Team>(`/teams/${id}`).then(({ data }) => setTeam(data));
    api.get<Project[]>(`/projects/team/${id}`).then(({ data }) => setProjects(data));
  };
  useEffect(() => { load(); }, [id]);
  const createProject = async (event: React.FormEvent) => { event.preventDefault(); await api.post('/projects', { teamId: id, name: projectName }); setProjectName(''); load(); };
  const addMember = async (event: React.FormEvent) => { event.preventDefault(); await api.post(`/teams/${id}/members`, { email, role: 'MEMBER' }); setEmail(''); load(); };
  return (
    <AppShell>
      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        <section className="workspace-panel p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label">Equipo</p>
              <h2 className="mt-1 text-3xl font-black text-app-ink">{team?.name}</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-app-muted">{team?.description || 'Sin descripcion'}</p>
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-app-primary text-white shadow-tactile">
              <Users size={22} />
            </span>
          </div>
          <div className="mt-5 space-y-2">
            {team?.members?.map((member) => (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-app-border bg-app-surfaceTint p-3" key={member.user.id}>
                <span className="font-black text-app-ink">{member.user.name}</span>
                <RoleBadge role={member.role} />
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-app-border pt-4">
            <p className="label mb-2">Canales</p>
            <div className="flex flex-wrap gap-2">
              {team?.channels?.filter((channel) => channel.type === 'TEAM').map((channel) => <Link className="btn btn-secondary" key={channel.id} href={`/chat/${channel.id}`}><MessageSquare size={16} /> {channel.name}</Link>)}
            </div>
          </div>
        </section>
        <section className="space-y-3">
          <form onSubmit={addMember} className="workspace-panel flex flex-col gap-3 p-4 sm:flex-row">
            <input className="input" placeholder="Correo del usuario" value={email} onChange={(event) => setEmail(event.target.value)} />
            <button className="btn btn-primary"><UserPlus size={16} /> Agregar</button>
          </form>
          <form onSubmit={createProject} className="workspace-panel flex flex-col gap-3 p-4 sm:flex-row">
            <input className="input" placeholder="Nuevo proyecto" value={projectName} onChange={(event) => setProjectName(event.target.value)} />
            <button className="btn btn-primary"><Plus size={16} /> Crear</button>
          </form>
        </section>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
      {!projects.length && <p className="mt-4 rounded-lg border border-dashed border-app-border bg-white p-5 text-sm font-semibold text-app-muted">Todavia no hay proyectos en este equipo.</p>}
    </AppShell>
  );
}
