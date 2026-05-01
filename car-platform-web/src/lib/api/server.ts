import 'server-only';

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

const BASE_URL = requireEnv('NEXT_PUBLIC_API_BASE_URL');

/*If BASE_URL ends with / and path starts with /, will get //.

So I used:
	•	remove trailing slashes from base
	•	ensure path starts with one slash  */
function joinUrl(base: string, p: string) {
  const b = base.replace(/\/+$/, '');
  const s = p.startsWith('/') ? p : `/${p}`;
  return `${b}${s}`;
}

export async function api<T>(
  path: string,
  opts: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, signal, headers: customHeaders = {} } = opts;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...customHeaders,
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const url = joinUrl(BASE_URL, path);

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
    credentials: 'include',
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const msg =
      (data && (data as any).message) ||
      (data && (data as any).error) ||
      `Request failed (${res.status})`;
    throw new ApiError(msg, res.status, data);
  }

  return data as T;
}
