'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { RoleBadge } from '@/components/RoleBadge';
import { api } from '@/lib/api';
import { User } from '@/lib/types';

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => { api.get<User[]>('/users').then(({ data }) => setUsers(data)); }, []);
  return (
    <AppShell adminOnly>
      <div className="workspace-panel overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="surface-grid text-xs uppercase text-app-muted">
            <tr><th className="p-3">Usuario</th><th className="p-3">Correo</th><th className="p-3">Rol</th></tr>
          </thead>
          <tbody>
            {users.map((user) => <tr className="border-t border-app-border transition hover:bg-app-surfaceTint" key={user.id}><td className="p-3 font-black">{user.name}</td><td className="p-3 font-semibold text-app-muted">{user.email}</td><td className="p-3"><RoleBadge role={user.role} /></td></tr>)}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

