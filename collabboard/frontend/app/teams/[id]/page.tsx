'use client';

import { use, useEffect, useState } from 'react';
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
        <section className="card p-5">
          <h2 className="text-xl font-bold">{team?.name}</h2>
          <p className="mt-2 text-sm text-slate-500">{team?.description}</p>
          <div className="mt-4 space-y-2">{team?.members?.map((member) => <div className="flex items-center justify-between rounded-md bg-slate-50 p-2" key={member.user.id}><span>{member.user.name}</span><RoleBadge role={member.role} /></div>)}</div>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <p className="label mb-2">Canales</p>
            <div className="flex flex-wrap gap-2">{team?.channels?.filter((channel) => channel.type === 'TEAM').map((channel) => <Link className="btn btn-secondary" key={channel.id} href={`/chat/${channel.id}`}>{channel.name}</Link>)}</div>
          </div>
        </section>
        <section className="space-y-3">
          <form onSubmit={addMember} className="card flex gap-3 p-4"><input className="input" placeholder="Correo del usuario" value={email} onChange={(event) => setEmail(event.target.value)} /><button className="btn btn-primary">Agregar</button></form>
          <form onSubmit={createProject} className="card flex gap-3 p-4"><input className="input" placeholder="Nuevo proyecto" value={projectName} onChange={(event) => setProjectName(event.target.value)} /><button className="btn btn-primary">Crear</button></form>
        </section>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
    </AppShell>
  );
}
