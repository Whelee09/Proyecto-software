import { Task } from '@/lib/types';

export function TaskCard({ task, onClick }: { task: Task; onClick?: () => void }) {
  const priority = {
    LOW: 'bg-slate-100 text-slate-700 border-slate-200',
    MEDIUM: 'bg-blue-50 text-app-primary border-blue-200',
    HIGH: 'bg-amber-50 text-amber-800 border-amber-200',
    URGENT: 'bg-red-50 text-red-700 border-red-200',
  }[task.priority];
  const accent = {
    LOW: 'bg-slate-400',
    MEDIUM: 'bg-app-primary',
    HIGH: 'bg-app-warning',
    URGENT: 'bg-app-error',
  }[task.priority];

  return (
    <button onClick={onClick} className="group relative w-full overflow-hidden rounded-lg border border-app-border bg-white p-3 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-app-ink hover:shadow-tactile focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-ink">
      <span className={`absolute left-0 top-0 h-full w-1 ${accent}`} />
      <div className="flex items-start justify-between gap-2">
        <h4 className="pl-1 text-sm font-black text-app-ink">{task.title}</h4>
        <span className={`shrink-0 rounded-full border px-2 py-1 text-[11px] font-black ${priority}`}>{task.priority}</span>
      </div>
      <p className="mt-2 line-clamp-2 pl-1 text-xs font-medium leading-5 text-app-muted">{task.description || 'Sin descripcion'}</p>
      {task.assignedTo && <p className="mt-3 pl-1 text-[11px] font-black uppercase text-app-presence">{task.assignedTo.name}</p>}
      <div className="mt-3 flex flex-wrap gap-1">
        {task.labels?.map((label) => <span key={label} className="rounded-md border border-app-border bg-app-surfaceTint px-2 py-1 text-[11px] font-bold text-app-ink">{label}</span>)}
      </div>
    </button>
  );
}

