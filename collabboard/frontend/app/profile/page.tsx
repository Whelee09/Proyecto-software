'use client';

import { useEffect, useState } from 'react';
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
      <form onSubmit={save} className="card max-w-xl space-y-4 p-5">
        <h2 className="text-xl font-bold">Perfil</h2>
        <input className="input" value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre" />
        <input className="input" value={avatarUrl ?? ''} onChange={(event) => setAvatarUrl(event.target.value)} placeholder="URL de foto" />
        <p className="text-sm text-slate-500">Correo: {user?.email}</p>
        <button className="btn btn-primary">Guardar cambios</button>
      </form>
    </AppShell>
  );
}
