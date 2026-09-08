'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { createDealerProfileBrowser } from '@/lib/api/dealerProfile.browser';

export default function DealerOnboardingForm() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const profile = await createDealerProfileBrowser({
        companyName,
        phone,
        address: address.trim() || undefined,
      });

      router.push(profile.status === 'pending' ? '/dealer/pending' : '/dealer');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create dealer profile'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className='w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
      <div>
        <p className='text-sm font-medium uppercase tracking-[0.2em] text-zinc-500'>
          Dealer onboarding
        </p>
        <h1 className='mt-2 text-3xl font-bold text-zinc-950'>
          Tell us about your dealership
        </h1>
        <p className='mt-3 text-sm leading-6 text-zinc-600'>
          Your dealer application will be reviewed by admin before publishing
          access is enabled.
        </p>
      </div>

      {error ? (
        <p className='mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
          {error}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
        <label className='block'>
          <span className='text-sm font-medium text-zinc-700'>
            Company name
          </span>
          <input
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            required
            className='mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-950'
            placeholder='Your dealership name'
          />
        </label>

        <label className='block'>
          <span className='text-sm font-medium text-zinc-700'>Phone</span>
          <input
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            className='mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-950'
            placeholder='+49 ...'
          />
        </label>

        <label className='block'>
          <span className='text-sm font-medium text-zinc-700'>
            Address optional
          </span>
          <input
            value={address}
            onChange={e => setAddress(e.target.value)}
            className='mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-950 outline-none focus:border-zinc-950'
            placeholder='Street, city, country'
          />
        </label>

        <button
          type='submit'
          disabled={loading}
          className='w-full rounded-xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60'
        >
          {loading ? 'Submitting application...' : 'Submit dealer application'}
        </button>
      </form>
    </section>
  );
}
