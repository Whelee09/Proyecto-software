import { Message } from '@/lib/types';

export function MessageBubble({ message, mine }: { message: Message; mine: boolean }) {
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] rounded-lg px-3 py-2 ${mine ? 'bg-app-primary text-white' : 'bg-slate-100 text-slate-800'}`}>
        <p className="text-xs font-semibold opacity-80">{message.user.name}</p>
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}

