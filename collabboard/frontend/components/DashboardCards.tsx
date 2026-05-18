import { CalendarClock, CheckCircle2, FolderKanban, ListTodo, Users } from 'lucide-react';

export function DashboardCards({ summary }: { summary: any }) {
  const cards = [
    { label: 'Equipos', value: summary?.teamCount ?? 0, icon: Users, color: 'text-app-primary' },
    { label: 'Proyectos activos', value: summary?.activeProjects ?? 0, icon: FolderKanban, color: 'text-app-success' },
    { label: 'Tareas pendientes', value: summary?.pendingTasks ?? 0, icon: ListTodo, color: 'text-app-warning' },
    { label: 'Tareas completadas', value: summary?.completedTasks ?? 0, icon: CheckCircle2, color: 'text-app-success' },
    { label: 'Usuarios', value: summary?.userCount ?? 0, icon: CalendarClock, color: 'text-app-primary' },
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div className="card p-4" key={card.label}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{card.label}</p>
              <Icon className={card.color} size={20} />
            </div>
            <p className="mt-3 text-3xl font-bold">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}

