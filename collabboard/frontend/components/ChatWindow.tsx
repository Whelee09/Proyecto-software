'use client';

import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '@/lib/api';
import { Message } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { MessageBubble } from './MessageBubble';

export function ChatWindow({ channelId, initialMessages }: { channelId: string; initialMessages: Message[] }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState(initialMessages);
  const [content, setContent] = useState('');
  const socket = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return io(process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000', { auth: { token: localStorage.getItem('collabboard_token') } });
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit('join_channel', { channelId });
    socket.on('new_message', (message: Message) => setMessages((prev) => [...prev, message]));
    return () => {
      socket.emit('leave_channel', { channelId });
      socket.disconnect();
    };
  }, [socket, channelId]);

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
    <div className="card flex h-[70vh] flex-col overflow-hidden">
      <div className="border-b border-slate-200 p-4">
        <h2 className="font-semibold">Chat del canal</h2>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => <MessageBubble key={message.id} message={message} mine={message.user.id === user?.id} />)}
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-slate-200 p-4">
        <input className="input" placeholder="Escribe un mensaje" value={content} onChange={(event) => setContent(event.target.value)} />
        <button className="btn btn-primary">Enviar</button>
      </form>
    </div>
  );
}

