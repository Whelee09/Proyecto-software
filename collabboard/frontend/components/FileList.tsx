'use client';

import { Download, FileText } from 'lucide-react';
import { api } from '@/lib/api';
import { ProjectFile } from '@/lib/types';

export function FileList({ files }: { files: ProjectFile[] }) {
  const download = async (file: ProjectFile) => {
    const { data } = await api.get<{ url: string }>(`/files/url/${file.id}`);
    window.open(data.url, '_blank');
  };
  return (
    <div className="workspace-panel overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="surface-grid text-xs uppercase text-app-muted">
          <tr><th className="p-3">Archivo</th><th className="p-3">Tamano</th><th className="p-3">Fecha</th><th className="p-3">Accion</th></tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr className="border-t border-app-border transition hover:bg-app-surfaceTint" key={file.id}>
              <td className="p-3 font-black">
                <span className="flex items-center gap-2">
                  <FileText size={16} className="text-app-primary" />
                  {file.originalName}
                </span>
              </td>
              <td className="p-3 font-semibold text-app-muted">{Math.round(file.size / 1024)} KB</td>
              <td className="p-3 font-semibold text-app-muted">{new Date(file.createdAt).toLocaleDateString('es-CO')}</td>
              <td className="p-3"><button className="btn btn-secondary" onClick={() => download(file)}><Download size={16} /> Descargar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {!files.length && <p className="p-4 text-sm font-semibold text-app-muted">No hay archivos cargados.</p>}
    </div>
  );
}
