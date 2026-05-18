'use client';

import { useEffect, useState } from 'react';
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
      <form onSubmit={create} className="card mb-5 flex gap-3 p-4">
        <input className="input" placeholder="Nombre del equipo" value={name} onChange={(event) => setName(event.target.value)} required />
        <button className="btn btn-primary">Crear equipo</button>
      </form>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{teams.map((team) => <TeamCard key={team.id} team={team} />)}</div>
    </AppShell>
  );
}

