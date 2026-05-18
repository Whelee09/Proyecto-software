'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export function FileUploader({ projectId, onUploaded }: { projectId: string; onUploaded: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    await api.post(`/files/upload/${projectId}`, data);
    setFile(null);
    onUploaded();
  };
  return (
    <form onSubmit={submit} className="card flex flex-col gap-3 p-4 md:flex-row md:items-center">
      <input className="input" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
      <button className="btn btn-primary">Subir archivo</button>
    </form>
  );
}

