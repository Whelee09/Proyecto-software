'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export function TaskModal({ projectId, projectName, onCreated }: { projectId: string; projectName?: string; onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await api.post('/tasks', { projectId, title, priority, description, labels: [] });
    setTitle('');
    setDescription('');
    onCreated();
  };
  return (
    <form onSubmit={submit} className="card mb-5 grid gap-3 p-4 md:grid-cols-[1fr_160px_auto]">
      {projectName && <p className="text-sm font-semibold text-slate-600 md:col-span-3">Proyecto: {projectName}</p>}
      <input className="input" placeholder="Nueva tarea" value={title} onChange={(event) => setTitle(event.target.value)} required />
      <select className="input" value={priority} onChange={(event) => setPriority(event.target.value)}>
        <option value="LOW">Baja</option>
        <option value="MEDIUM">Media</option>
        <option value="HIGH">Alta</option>
        <option value="URGENT">Urgente</option>
      </select>
      <button className="btn btn-primary">Crear tarea</button>
      <input className="input md:col-span-3" placeholder="Descripcion" value={description} onChange={(event) => setDescription(event.target.value)} />
    </form>
  );
}

