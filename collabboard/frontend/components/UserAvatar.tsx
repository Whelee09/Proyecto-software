import { User } from '@/lib/types';

export function UserAvatar({ user }: { user: Pick<User, 'name' | 'avatarUrl' | 'email'> }) {
  const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center gap-2">
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full border-2 border-app-presence object-cover shadow-tactile" />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-app-presence bg-white text-sm font-black text-app-ink shadow-tactile">{initials}</div>
      )}
      <div className="hidden text-sm md:block">
        <p className="font-black leading-tight">{user.name}</p>
        <p className="max-w-40 truncate text-xs font-semibold text-app-muted">{user.email}</p>
      </div>
    </div>
  );
}

