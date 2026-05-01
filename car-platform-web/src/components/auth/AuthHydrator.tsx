'use client';

import { useEffect } from 'react';
import { getMe } from '@/lib/auth/api';
import { useAuth } from '@/lib/store/auth';

export default function AuthHydrator() {
  const setUser = useAuth(s => s.setUser);
  const clearUser = useAuth(s => s.clearUser);
  const setHydrated = useAuth(s => s.setHydrated);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const me = await getMe();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) clearUser();
      } finally {
        if (!cancelled) setHydrated();
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [setUser, clearUser, setHydrated]);

  return null;
}
