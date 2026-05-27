'use client';

import { useEffect, useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { TeamCard } from '@/components/TeamCard';
import { api } from '@/lib/api';
import { Team } from '@/lib/types';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState('');
  const load = () => api.get<Team[]>('/teams').then(({ data }) => setTeams(data));
  useEffect(() => { load(); }, []);
  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    await api.post('/teams', { name });
    setName('');
    load();
  };
  return (
    <AppShell>
      <section className="mb-5 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="workspace-panel surface-grid p-5">
          <p className="label">Equipos</p>
          <h2 className="mt-2 text-3xl font-black text-app-ink">Nucleos de trabajo.</h2>
          <p className="mt-3 text-sm font-medium leading-6 text-app-muted">Proyectos, canales y calendario compartido.</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-app-border bg-white px-3 py-1 text-xs font-black text-app-ink">
            <span className="live-dot" /> {teams.length} equipos activos
          </div>
        </div>
        <form onSubmit={create} className="workspace-panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-app-primary text-white shadow-tactile">
            <Users size={20} />
          </span>
        <input className="input" placeholder="Nombre del equipo" value={name} onChange={(event) => setName(event.target.value)} required />
          <button className="btn btn-primary"><Plus size={16} /> Crear equipo</button>
        </form>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{teams.map((team) => <TeamCard key={team.id} team={team} />)}</div>
      {!teams.length && <p className="mt-4 rounded-lg border border-dashed border-app-border bg-white p-5 text-sm font-semibold text-app-muted">Crea el primer equipo para abrir el espacio de trabajo.</p>}
    </AppShell>
  );
}

