const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050/api';

export type RegisterBrowserPayload = {
  name: string;
  email: string;
  password: string;
  role: 'buyer' | 'dealer';
};

export type RegisterBrowserResponse = {
  message?: string;
  user?: {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    role: 'buyer' | 'dealer' | 'admin';
  };
};

export async function registerBrowser(
  payload: RegisterBrowserPayload
): Promise<RegisterBrowserResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as RegisterBrowserResponse;

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to register');
  }

  return data;
}
