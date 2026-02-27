'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/store/auth';
import type { Role } from '@/lib/auth/types';
/* import { handleBuildComplete } from 'next/dist/build/adapter/build-complete'; */

export default function RequireAuth({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuth(s => s.user);
  const hasHydrated = useAuth(s => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (!allow.includes(user.role)) {
      router.replace('/login');
    }
  }, [hasHydrated, user, allow, router]);

  if (!hasHydrated) return null; //Don't render until hydration is complete
  if (!user) return null;

  return <>{children}</>;
}
