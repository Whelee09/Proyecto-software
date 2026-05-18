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
      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr><th className="p-3">Usuario</th><th className="p-3">Correo</th><th className="p-3">Rol</th></tr>
          </thead>
          <tbody>
            {users.map((user) => <tr className="border-t border-slate-100" key={user.id}><td className="p-3 font-medium">{user.name}</td><td className="p-3">{user.email}</td><td className="p-3"><RoleBadge role={user.role} /></td></tr>)}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

