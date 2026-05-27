export function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    ADMIN: 'bg-app-primary text-white border-app-primary',
    MEMBER: 'bg-app-surfaceTint text-app-ink border-app-border',
    OWNER: 'bg-app-presence text-white border-app-presence',
    MANAGER: 'bg-app-warning text-app-ink border-app-warning',
  };
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${styles[role] ?? styles.MEMBER}`}>{role}</span>;
}

