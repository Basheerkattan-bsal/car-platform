import type { AuthSession } from './types';

const KEY = 'car_platform_session';

export function saveSession(session: AuthSession) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function loadSession(): AuthSession | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
