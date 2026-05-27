import { CalendarClock, CheckCircle2, FolderKanban, ListTodo, Users } from 'lucide-react';

export function DashboardCards({ summary }: { summary: any }) {
  const cards = [
    { label: 'Equipos', value: summary?.teamCount ?? 0, icon: Users, color: 'bg-app-primary', note: 'total' },
    { label: 'Proyectos activos', value: summary?.activeProjects ?? 0, icon: FolderKanban, color: 'bg-app-presence', note: 'activos' },
    { label: 'Tareas pendientes', value: summary?.pendingTasks ?? 0, icon: ListTodo, color: 'bg-app-warning', note: 'pendientes' },
    { label: 'Tareas completadas', value: summary?.completedTasks ?? 0, icon: CheckCircle2, color: 'bg-app-success', note: 'completadas' },
    { label: 'Usuarios', value: summary?.userCount ?? 0, icon: CalendarClock, color: 'bg-app-discovery', note: 'registrados' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article className="group relative overflow-hidden rounded-lg border border-app-border bg-white p-4 shadow-soft transition hover:-translate-y-1 hover:border-app-ink hover:shadow-tactile" key={card.label}>
            <div className="absolute inset-x-0 top-0 h-1 bg-app-ink" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase text-app-muted">{card.label}</p>
                <p className="mt-2 text-4xl font-black leading-none text-app-ink">{card.value}</p>
              </div>
              <span className={`grid h-11 w-11 place-items-center rounded-lg ${card.color} text-white shadow-tactile transition group-hover:-rotate-3 group-hover:scale-105`}>
                <Icon size={21} />
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-app-muted">{card.note}</span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

