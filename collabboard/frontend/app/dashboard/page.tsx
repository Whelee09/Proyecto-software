'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { DashboardCards } from '@/components/DashboardCards';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  useEffect(() => { api.get('/dashboard/summary').then(({ data }) => setSummary(data)); }, []);
  return (
    <AppShell>
      <DashboardCards summary={summary} />
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <section className="card p-5">
          <h2 className="font-semibold">Eventos proximos</h2>
          <div className="mt-4 space-y-3">{summary?.upcomingEvents?.map((event: any) => <p className="rounded-md bg-slate-50 p-3 text-sm" key={event.id}>{event.title}</p>)}</div>
        </section>
        <section className="card p-5">
          <h2 className="font-semibold">Ultimos archivos</h2>
          <div className="mt-4 space-y-3">{summary?.latestFiles?.map((file: any) => <p className="rounded-md bg-slate-50 p-3 text-sm" key={file.id}>{file.originalName}</p>)}</div>
        </section>
        <section className="card p-5">
          <h2 className="font-semibold">Ultimos mensajes</h2>
          <div className="mt-4 space-y-3">{summary?.latestMessages?.map((message: any) => <p className="rounded-md bg-slate-50 p-3 text-sm" key={message.id}>{message.user.name}: {message.content}</p>)}</div>
        </section>
      </div>
    </AppShell>
  );
}

