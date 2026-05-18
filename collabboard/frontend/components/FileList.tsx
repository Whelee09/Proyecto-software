'use client';

import { api } from '@/lib/api';
import { ProjectFile } from '@/lib/types';

export function FileList({ files }: { files: ProjectFile[] }) {
  const download = async (file: ProjectFile) => {
    const response = await api.get(`/files/download/${file.id}`, { responseType: 'blob' });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.originalName;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr><th className="p-3">Archivo</th><th className="p-3">Tamano</th><th className="p-3">Fecha</th><th className="p-3">Accion</th></tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr className="border-t border-slate-100" key={file.id}>
              <td className="p-3 font-medium">{file.originalName}</td>
              <td className="p-3">{Math.round(file.size / 1024)} KB</td>
              <td className="p-3">{new Date(file.createdAt).toLocaleDateString('es-CO')}</td>
              <td className="p-3"><button className="btn btn-secondary" onClick={() => download(file)}>Descargar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {!files.length && <p className="p-4 text-sm text-slate-500">No hay archivos cargados.</p>}
    </div>
  );
}
