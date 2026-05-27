'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';
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
    <form onSubmit={submit} className="workspace-panel flex flex-col gap-3 p-4 md:flex-row md:items-center">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-app-presence text-white shadow-tactile">
        <UploadCloud size={21} />
      </span>
      <input className="input" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
      <button className="btn btn-primary"><UploadCloud size={16} /> Subir archivo</button>
    </form>
  );
}

