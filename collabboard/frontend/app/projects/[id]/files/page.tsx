'use client';

import { use, useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { FileList } from '@/components/FileList';
import { FileUploader } from '@/components/FileUploader';
import { api } from '@/lib/api';
import { ProjectFile } from '@/lib/types';

export default function ProjectFilesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const load = () => api.get<ProjectFile[]>(`/files/project/${id}`).then(({ data }) => setFiles(data));
  useEffect(() => { load(); }, [id]);
  return (
    <AppShell>
      <div className="space-y-5">
        <section className="rounded-lg border border-app-ink bg-white p-5 shadow-tactile">
          <p className="label">Archivos</p>
          <h2 className="mt-1 text-3xl font-black text-app-ink">Mesa de artefactos</h2>
          <p className="mt-2 text-sm font-medium text-app-muted">Entregables, referencias y documentos del proyecto.</p>
        </section>
        <FileUploader projectId={id} onUploaded={load} />
        <FileList files={files} />
      </div>
    </AppShell>
  );
}
