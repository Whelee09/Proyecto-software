'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { GlobalCalendar } from '@/components/GlobalCalendar';
import { api } from '@/lib/api';
import { EventItem } from '@/lib/types';

export default function CalendarPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<EventItem[]>('/events/me')
      .then(({ data }) => setEvents(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      {loading ? (
        <div className="workspace-panel surface-grid p-6 text-sm font-black uppercase text-app-muted">Cargando calendario...</div>
      ) : (
        <GlobalCalendar events={events} />
      )}
    </AppShell>
  );
}

