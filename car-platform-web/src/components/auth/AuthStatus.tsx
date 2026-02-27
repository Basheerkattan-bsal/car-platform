'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/auth';
import { logout } from '@/lib/auth/api';

export default function AuthStatus() {
  const router = useRouter();
  const user = useAuth(s => s.user);
  const hasHydrated = useAuth(s => s.hasHydrated);
  const clearUser = useAuth(s => s.clearUser);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      clearUser();
      router.replace('/login');
    }
  }

  if (!hasHydrated) return null;

  if (!user) {
    return (
      <div className='text-sm opacity-80'>
        <a className='underline' href='/login'>
          Login
        </a>
      </div>
    );
  }
  return (
    <div className='flex items-center gap-3 text-sm'>
      <div className='leading tight'>
        <div className='font-medium'>{user.name}</div>
        <div className='opacity-70'>{user.role}</div>
      </div>
      <button onClick={handleLogout} className='rounded-md border px-3 py-1'>
        Logout
      </button>
    </div>
  );
}
