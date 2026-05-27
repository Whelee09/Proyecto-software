import Link from 'next/link';
import { ArrowUpRight, Users } from 'lucide-react';
import { Team } from '@/lib/types';

export function TeamCard({ team }: { team: Team }) {
  const memberCount = team.members?.length ?? 0;

  return (
    <Link href={`/teams/${team.id}`} className="group relative block overflow-hidden rounded-lg border border-app-border bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:border-app-ink hover:shadow-tactile">
      <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md border border-app-border bg-app-surfaceTint text-app-ink transition group-hover:-translate-y-0.5 group-hover:border-app-ink">
        <ArrowUpRight size={17} />
      </div>
      <p className="label">Equipo</p>
      <h3 className="mt-2 pr-12 text-xl font-black text-app-ink">{team.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-app-muted">{team.description || 'Sin descripcion'}</p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-app-border bg-app-surfaceTint px-3 py-1 text-xs font-black text-app-ink">
          <Users size={14} /> {memberCount} miembros
        </span>
        <span className="flex items-center gap-2 text-[11px] font-black uppercase text-app-presence"><span className="live-dot" /> activo</span>
      </div>
    </Link>
  );
}

