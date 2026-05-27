'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, Signal } from 'lucide-react';
import { api, getAuthToken } from '@/lib/api';
import { Message } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { MessageBubble } from './MessageBubble';

export function ChatWindow({ channelId, initialMessages }: { channelId: string; initialMessages: Message[] }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => setMessages(initialMessages), [initialMessages]);

  useEffect(() => {
    let active = true;
    let nextSocket: Socket | null = null;
    setConnected(false);

    getAuthToken().then((token) => {
      if (!active || !token) return;
      nextSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000', { auth: { token } });
      setSocket(nextSocket);

      nextSocket.on('connect', () => {
        setConnected(true);
        nextSocket?.emit('join_channel', { channelId });
      });
      nextSocket.on('disconnect', () => setConnected(false));
      nextSocket.on('connect_error', () => setConnected(false));
      nextSocket.on('new_message', (message: Message) => {
        setMessages((prev) => (prev.some((item) => item.id === message.id) ? prev : [...prev, message]));
      });
    });

    return () => {
      active = false;
      if (nextSocket) {
        nextSocket.emit('leave_channel', { channelId });
        nextSocket.disconnect();
      }
      setSocket(null);
      setConnected(false);
    };
  }, [channelId]);

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return;
    if (socket?.connected) socket.emit('send_message', { channelId, content });
    else {
      const { data } = await api.post<Message>('/messages', { channelId, content });
      setMessages((prev) => [...prev, data]);
    }
    setContent('');
  };

  return (
    <div className="workspace-panel flex h-[72vh] min-h-[520px] flex-col overflow-hidden">
      <div className="surface-grid border-b border-app-border p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="label">Canal</p>
            <h2 className="text-lg font-black">Chat del canal</h2>
          </div>
          <span className="status-chip"><Signal size={14} /> {connected ? 'Conectado' : 'Reconectando'}</span>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto bg-app-bg/60 p-4">
        {messages.map((message) => <MessageBubble key={message.id} message={message} mine={message.user.id === user?.id} />)}
        {!messages.length && <p className="rounded-lg border border-dashed border-app-border bg-white p-4 text-sm font-semibold text-app-muted">Aun no hay mensajes en este canal.</p>}
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-app-border bg-white p-4">
        <input className="input" placeholder="Escribe un mensaje" value={content} onChange={(event) => setContent(event.target.value)} />
        <button className="btn btn-primary"><Send size={16} /> Enviar</button>
      </form>
    </div>
  );
}

