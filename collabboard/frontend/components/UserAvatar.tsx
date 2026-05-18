import { User } from '@/lib/types';

export function UserAvatar({ user }: { user: Pick<User, 'name' | 'avatarUrl' | 'email'> }) {
  const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center gap-2">
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-app-primary">{initials}</div>
      )}
      <div className="hidden text-sm md:block">
        <p className="font-semibold">{user.name}</p>
        <p className="text-xs text-slate-500">{user.email}</p>
      </div>
    </div>
  );
}

