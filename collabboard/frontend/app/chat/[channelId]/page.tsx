'use client';

import { use, useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { ChatWindow } from '@/components/ChatWindow';
import { api } from '@/lib/api';
import { Message } from '@/lib/types';

export default function ChatPage({ params }: { params: Promise<{ channelId: string }> }) {
  const { channelId } = use(params);
  const [messages, setMessages] = useState<Message[] | null>(null);
  useEffect(() => {
    if (channelId === 'demo') {
      setMessages([]);
      return;
    }
    api.get<Message[]>(`/messages/channel/${channelId}`).then(({ data }) => setMessages(data));
  }, [channelId]);
  return (
    <AppShell>
      {channelId === 'demo' ? <div className="workspace-panel p-5 text-sm font-semibold text-app-muted">Abre un canal real desde un equipo o proyecto para usar el chat.</div> : messages && <ChatWindow channelId={channelId} initialMessages={messages} />}
    </AppShell>
  );
}
