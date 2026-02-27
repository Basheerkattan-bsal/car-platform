import { api } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type { AuthUser } from './types';

export type LoginInput = {
  email: string;
  password: string;
};

type UserFromApi = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: 'buyer' | 'dealer' | 'admin';
};

// In case of unexpected backend role sending, TypeScript will be able to catch:
const allowedRoles = ['buyer', 'dealer', 'admin'] as const; //<====
type LoginResponse = { user: UserFromApi };
type MeResponse = { user: UserFromApi };

/* type AnyLoginResponse =
  | { token: string; user: any }
  | { data: { token: string; user: any } }; */

function toAuthUser(user: UserFromApi): AuthUser {
  const id = user.id ?? user._id;
  if (!id) throw new Error('Auth response missing user id');
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Auth response has invalid role');
  }

  return {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
export async function login(input: LoginInput): Promise<AuthUser> {
  const res = await api<LoginResponse>(endpoints.auth.login, {
    method: 'POST',
    body: input,
  });

  return toAuthUser(res.user);
}

export async function getMe(): Promise<AuthUser> {
  const res = await api<MeResponse>(endpoints.auth.me);

  return toAuthUser(res.user);
}

export async function logout(): Promise<void> {
  await api<{ success: Boolean; message?: string }>('/auth/logout', {
    method: 'POST',
  });
}
