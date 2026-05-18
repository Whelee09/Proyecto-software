export function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    ADMIN: 'bg-blue-100 text-blue-700',
    MEMBER: 'bg-slate-100 text-slate-700',
    OWNER: 'bg-emerald-100 text-emerald-700',
    MANAGER: 'bg-amber-100 text-amber-700',
  };
  return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${styles[role] ?? styles.MEMBER}`}>{role}</span>;
}

