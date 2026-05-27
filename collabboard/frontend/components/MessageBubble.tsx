import { Message } from '@/lib/types';

export function MessageBubble({ message, mine }: { message: Message; mine: boolean }) {
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[78%] rounded-lg border px-3 py-2 shadow-soft ${mine ? 'border-app-ink bg-app-primary text-white' : 'border-app-border bg-white text-app-ink'}`}>
        <p className={`text-xs font-black ${mine ? 'text-white/80' : 'text-app-presence'}`}>{message.user.name}</p>
        <p className="mt-1 text-sm font-medium leading-6">{message.content}</p>
      </div>
    </div>
  );
}

