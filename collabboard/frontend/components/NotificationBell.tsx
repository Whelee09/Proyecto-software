'use client';

import { Bell, CalendarDays, CheckCheck, MessageSquare, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { NotificationItem } from '@/lib/types';

function notificationHref(notification: NotificationItem) {
  if (notification.type === 'MESSAGE' && notification.channelId) return `/chat/${notification.channelId}`;
  if (notification.type === 'PROJECT_CREATED' && notification.projectId) return `/projects/${notification.projectId}/tasks`;
  if (notification.type === 'TEAM_MEMBER_ADDED' && notification.teamId) return `/teams/${notification.teamId}`;
  return '/calendar';
}

function NotificationIcon({ type }: { type: NotificationItem['type'] }) {
  if (type === 'MESSAGE') return <MessageSquare size={16} />;
  if (type === 'EVENT_TODAY') return <CalendarDays size={16} />;
  return <Users size={16} />;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const router = useRouter();

  const load = async () => {
    const { data } = await api.get<{ items: NotificationItem[]; unread: number }>('/notifications');
    setItems(data.items);
    setUnread(data.unread);
  };

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 10000);
    return () => window.clearInterval(timer);
  }, []);

  const todayEvents = useMemo(() => items.filter((item) => item.type === 'EVENT_TODAY'), [items]);

  const openNotification = async (notification: NotificationItem) => {
    if (!notification.readAt) {
      await api.patch(`/notifications/${notification.id}/read`);
      setUnread((value) => Math.max(0, value - 1));
      setItems((prev) => prev.map((item) => item.id === notification.id ? { ...item, readAt: new Date().toISOString() } : item));
    }
    setOpen(false);
    router.push(notificationHref(notification));
  };

  const markAll = async () => {
    await api.post('/notifications/read-all');
    setUnread(0);
    setItems((prev) => prev.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() })));
  };

  return (
    <div className="relative">
      <button className="btn btn-secondary relative h-10 w-10 p-0" onClick={() => setOpen((value) => !value)} aria-label="Notificaciones">
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-app-ink bg-app-error px-1 text-[11px] font-black text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-30 mt-2 w-[min(92vw,420px)] overflow-hidden rounded-lg border border-app-ink bg-white shadow-tactile">
          <div className="surface-grid flex items-center justify-between border-b border-app-border p-3">
            <div>
              <p className="text-sm font-black">Notificaciones</p>
              <p className="text-xs font-semibold text-app-muted">{todayEvents.length} eventos para hoy</p>
            </div>
            <button className="btn btn-secondary px-2 py-1 text-xs" onClick={markAll}>
              <CheckCheck size={14} /> Leer todo
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.map((item) => (
              <button key={item.id} onClick={() => openNotification(item)} className="flex w-full gap-3 border-b border-app-border p-3 text-left transition hover:bg-app-surfaceTint">
                <span className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${item.readAt ? 'border-app-border bg-white text-app-muted' : 'border-app-primary bg-app-primary text-white'}`}>
                  <NotificationIcon type={item.type} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-black">{item.title}</span>
                    {!item.readAt && <span className="live-dot shrink-0" />}
                  </span>
                  <span className="mt-1 line-clamp-2 text-xs font-medium text-app-muted">{item.body}</span>
                  <span className="mt-1 block text-[11px] font-semibold text-slate-400">{new Date(item.createdAt).toLocaleString('es-CO')}</span>
                </span>
              </button>
            ))}
            {!items.length && <p className="p-4 text-sm font-semibold text-app-muted">No tienes notificaciones.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

