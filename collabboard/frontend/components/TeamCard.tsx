import Link from 'next/link';
import { Team } from '@/lib/types';

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link href={`/teams/${team.id}`} className="card block p-5 transition hover:-translate-y-0.5 hover:border-blue-200">
      <h3 className="font-semibold">{team.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-slate-500">{team.description || 'Sin descripcion'}</p>
      <p className="mt-4 text-xs font-semibold text-slate-500">{team.members?.length ?? 0} miembros</p>
    </Link>
  );
}

