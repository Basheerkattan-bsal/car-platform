'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Car } from '@/types/car';
import { updateDealerCarBrowser } from '@/lib/api/dealerCars.browser';

type Props = {
  car: Car;
};

export default function DealerCarEditForm({ car }: Props) {
  const router = useRouter();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: car.title ?? '',
    price: car.price ?? 0,
    brand: car.brand ?? '',
    model: car.model ?? '',
    year: car.year ?? new Date().getFullYear(),
    mileage: car.mileage ?? 0,
    owner: car.owner ?? 'Dealer',
    condition: car.condition ?? '',
    description: car.description ?? '',
    images: car.images ?? [],
  });

  function updateFiled(key: keyof typeof form, value: string) {
    setForm(current => ({
      ...current,
      [key]:
        key === 'price' || key === 'year' || key === 'mileage'
          ? Number(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      await updateDealerCarBrowser(car._id, form);

      router.push('/dealer/cars');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update Car');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'
    >
      {error ? (
        <p className='rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
          {error}
        </p>
      ) : null}

      <input
        value={form.title}
        onChange={e => updateFiled('title', e.target.value)}
        className='w-full rounded-xl border border-zinc-300 px-4 py-3'
        placeholder='Title'
      />

      <input
        type='number'
        value={form.price}
        onChange={e => updateFiled('price', e.target.value)}
        className='w-full rounded-xl border border-zinc-300 px-4 py-3'
        placeholder='Price'
      />

      <input
        value={form.brand}
        onChange={e => updateFiled('brand', e.target.value)}
        className='w-full rounded-xl border border-zinc-300 px-4 py-3'
        placeholder='Brand'
      />

      <input
        type='number'
        value={form.year}
        onChange={e => updateFiled('year', e.target.value)}
        className='w-full rounded-xl border border-zinc-300 px-4 py-3'
        placeholder='Year'
      />

      <input
        type='number'
        value={form.mileage}
        onChange={e => updateFiled('mileage', e.target.value)}
        className='w-full rounded-xl border border-zinc-300 px-4 py-3'
        placeholder='Mileage'
      />

      <select
        value={form.owner}
        onChange={e => updateFiled('owner', e.target.value)}
        className='w-full rounded-xl border border-zinc-300 px-4 py-3'
      >
        <option value='Dealer'>Dealer</option>
        <option value='Private'>Private</option>
      </select>

      <select
        value={form.condition}
        onChange={e => updateFiled('condition', e.target.value)}
        className='w-full rounded-xl border border-zinc-300 px-4 py-3'
      >
        <option value='Smoker'>Smoker</option>
        <option value='Non-Smoker'>Non-Smoker</option>
      </select>

      <button
        type='submit'
        disabled={loading}
        className='w-full rounded-xl bg-zinc-950 px-4 py-3 text-sm font medium text-white disabled:opacity-60'
      >
        {loading ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  );
}
