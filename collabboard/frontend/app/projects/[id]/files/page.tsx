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
        <FileUploader projectId={id} onUploaded={load} />
        <FileList files={files} />
      </div>
    </AppShell>
  );
}
