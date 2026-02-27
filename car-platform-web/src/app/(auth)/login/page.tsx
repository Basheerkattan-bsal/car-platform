'use client';

import { useEffect, useState } from 'react';
import { login } from '@/lib/auth/api';
import { useAuth } from '@/lib/store/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuth(s => s.setUser);
  const [error, setError] = useState('');
  const user = useAuth(s => s.user);
  const hasHydrated = useAuth(s => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) return;

    if (user.role === 'admin') router.replace('/admin');
    else if (user.role === 'dealer') router.replace('/dealer');
    else router.replace('/');
  }, [hasHydrated, user, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    try {
      const user = await login({ email, password });
      setUser(user); //Stopped Here 07.02.26 (Wiring LOGIN page) //TODO: Complete the login page logic!!

      if (user.role === 'admin') router.push('/admin');
      if (user.role === 'dealer') router.push('/dealer');
      else router.push('/');
    } catch (err: any) {
      setError(err.message);
    }
  }
  return (
    <main className='min-h-screen flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='w-96 space-y-4'>
        <h1 className='' text-2x1>
          Login
        </h1>
        {error && <p className='text-red-500'>{error}</p>}
        <input name='email' placeholder='Email' className='w-full border p-2' />
        <input
          name='password'
          type='password'
          placeholder='Password'
          className='w-full border p-2'
        />
        <button className='w-full bg-black text-white py-2'>Login</button>
      </form>
    </main>
  );
}
