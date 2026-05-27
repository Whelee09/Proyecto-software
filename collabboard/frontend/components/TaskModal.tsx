'use client';

import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
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
    <form onSubmit={submit} className="workspace-panel mb-5 grid gap-3 p-4 md:grid-cols-[1fr_160px_auto]">
      {projectName && (
        <div className="flex items-center gap-2 text-sm font-black text-app-ink md:col-span-3">
          <Sparkles size={16} className="text-app-primary" />
          Proyecto: {projectName}
        </div>
      )}
      <input className="input" placeholder="Nueva tarea" value={title} onChange={(event) => setTitle(event.target.value)} required />
      <select className="input" value={priority} onChange={(event) => setPriority(event.target.value)}>
        <option value="LOW">Baja</option>
        <option value="MEDIUM">Media</option>
        <option value="HIGH">Alta</option>
        <option value="URGENT">Urgente</option>
      </select>
      <button className="btn btn-primary"><Plus size={16} /> Crear tarea</button>
      <input className="input md:col-span-3" placeholder="Descripcion" value={description} onChange={(event) => setDescription(event.target.value)} />
    </form>
  );
}

