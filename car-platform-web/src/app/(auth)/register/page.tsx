'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { registerBrowser } from '@/lib/api/auth.browser';
import type { RegisterBrowserPayload } from '@/lib/api/auth.browser';
import { useAuth } from '@/lib/store/auth';

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuth(s => s.setUser);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<RegisterBrowserPayload['role']>('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const data = await registerBrowser({
        name,
        email,
        password,
        role,
      });

      if (data.user) {
        const id = data.user.id ?? data.user._id;
        if (id) {
          setUser({
            id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
          });
        }
      }

      router.push(role === 'dealer' ? '/dealer/onboarding' : '/cars');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className='flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12'>
      <section className='w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
        <div>
          <p className='text-sm font-medium uppercase tracking-[0.2em] text-zinc-500'>
            Join Carvia
          </p>
          <h1 className='mt-2 text-3xl font-bold text-zinc-950'>
            Create your account
          </h1>
          <p className='mt-2 text-sm leading-6 text-zinc-600'>
            Register as a buyer or dealer and continue into Carvia.
          </p>
        </div>

        {error ? (
          <p className='mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
            {error}
          </p>
        ) : null}

        <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
          <label className='block'>
            <span className='text-sm font-medium text-zinc-700'>Name</span>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className='mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-950'
              placeholder='Your name'
            />
          </label>

          <label className='block'>
            <span className='text-sm font-medium text-zinc-700'>Email</span>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className='mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-950'
              placeholder='you@example.com'
            />
          </label>

          <label className='block'>
            <span className='text-sm font-medium text-zinc-700'>Password</span>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className='mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-950'
              placeholder='At least 6 characters'
            />
          </label>

          <label className='block'>
            <span className='text-sm font-medium text-zinc-700'>Role</span>
            <select
              value={role}
              onChange={e =>
                setRole(e.target.value as RegisterBrowserPayload['role'])
              }
              className='mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-950'
            >
              <option value='buyer'>Buyer</option>
              <option value='dealer'>Dealer</option>
            </select>
          </label>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60'
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-zinc-600'>
          Already have an account?{' '}
          <Link href='/login' className='font-medium text-zinc-950 underline'>
            Log in
          </Link>
        </p>
      </section>
    </main>
  );
}
