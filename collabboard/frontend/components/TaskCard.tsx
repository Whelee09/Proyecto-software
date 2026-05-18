import { Task } from '@/lib/types';

export function TaskCard({ task, onClick }: { task: Task; onClick?: () => void }) {
  const priority = { LOW: 'bg-slate-100 text-slate-700', MEDIUM: 'bg-blue-100 text-blue-700', HIGH: 'bg-amber-100 text-amber-700', URGENT: 'bg-red-100 text-red-700' }[task.priority];
  return (
    <button onClick={onClick} className="w-full rounded-md border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-blue-200">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold">{task.title}</h4>
        <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${priority}`}>{task.priority}</span>
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-slate-500">{task.description || 'Sin descripcion'}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {task.labels?.map((label) => <span key={label} className="rounded bg-slate-100 px-2 py-1 text-[11px] text-slate-600">{label}</span>)}
      </div>
    </button>
  );
}

