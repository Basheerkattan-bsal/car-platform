'use client';

import { useEffect } from 'react';
import { getMe } from '@/lib/auth/api';
import { useAuth } from '@/lib/store/auth';

export default function AuthHydrator() {
  const user = useAuth(s => s.user);
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
        if (!cancelled) setHydrated;
      }
    }

    // Only hydrate if we don't already have a user //*That caused errors because of browser extensions injecting attributes in to the dom
    // So I am trying to hydrate from HttpOnly once, then mark hydration complete, So run once on first load cookie may exists even user===null
    /* if (!user) */ run();

    return () => {
      cancelled = true;
    };
  }, [setUser, clearUser, setHydrated]);

  return null;
}
