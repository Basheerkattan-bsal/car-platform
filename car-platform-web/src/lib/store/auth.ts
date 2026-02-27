import { create } from 'zustand';
import type { AuthUser } from '@/lib/auth/types';

type AuthState = {
  user: AuthUser | null;
  hasHydrated: boolean;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  setHydrated: () => void;
};

export const useAuth = create<AuthState>(set => ({
  user: null,
  hasHydrated: false,
  setUser: user => set({ user }),
  clearUser: () => set({ user: null }),
  setHydrated: () => set({ hasHydrated: true }),
}));
