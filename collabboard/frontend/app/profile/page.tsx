'use client';

import { useEffect, useState } from 'react';
import { Save, UserCircle } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const { user, refreshMe } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');
  useEffect(() => {
    setName(user?.name ?? '');
    setAvatarUrl(user?.avatarUrl ?? '');
  }, [user]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    await api.patch(`/users/${user.id}`, { name, avatarUrl });
    await refreshMe();
  };
  return (
    <AppShell>
      <form onSubmit={save} className="workspace-panel max-w-xl space-y-4 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-lg bg-app-primary text-white shadow-tactile">
            <UserCircle size={21} />
          </span>
          <div>
            <p className="label">Cuenta</p>
            <h2 className="text-xl font-black">Perfil</h2>
          </div>
        </div>
        <input className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre" />
        <input className="input" value={avatarUrl ?? ''} onChange={(event) => setAvatarUrl(event.target.value)} placeholder="URL de foto" />
        <p className="rounded-lg border border-app-border bg-app-surfaceTint p-3 text-sm font-semibold text-app-muted">Correo: {user?.email}</p>
        <button className="btn btn-primary"><Save size={16} /> Guardar cambios</button>
      </form>
    </AppShell>
  );
}
