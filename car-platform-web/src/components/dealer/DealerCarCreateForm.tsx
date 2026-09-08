'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { createDealerCarBrowser } from '@/lib/api/dealerCars.browser';

type FormState = {
  title: string;
  price: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  owner: 'Dealer' | 'Private';
  description: string;
  condition: 'Smoker' | 'Non-Smoker';
};

export default function DealerCarCreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<FormState>({
    title: '',
    price: '',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    owner: 'Dealer',
    condition: 'Non-Smoker',
    description: '',
  });

  function updateField(key: keyof FormState, value: string) {
    setForm(current => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const createdCar = await createDealerCarBrowser({
        ...form,
        price: Number(form.price),
        year: Number(form.year),
        mileage: Number(form.mileage),
      });

      router.push(`/dealer/cars/${createdCar._id}/images`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create car');
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

      <label className='block space-y-2'>
        <span className='block text-sm font-medium text-zinc-950'>Title</span>
        <span className='block text-sm text-zinc-600'>
          Write the listing headline buyers will see first, like BMW 320i Sport
          2021.
        </span>
        <input
          value={form.title}
          onChange={e => updateField('title', e.target.value)}
          className='w-full rounded-xl border border-zinc-300 px-4 py-3'
          placeholder='Title'
        />
      </label>

      <label className='block space-y-2'>
        <span className='block text-sm font-medium text-zinc-950'>Price</span>
        <span className='block text-sm text-zinc-600'>
          Enter the full asking price using numbers only.
        </span>
        <input
          type='number'
          min='1'
          value={form.price}
          onChange={e => updateField('price', e.target.value)}
          className='w-full rounded-xl border border-zinc-300 px-4 py-3'
          placeholder='Price'
        />
      </label>

      <label className='block space-y-2'>
        <span className='block text-sm font-medium text-zinc-950'>Brand</span>
        <span className='block text-sm text-zinc-600'>
          Add the manufacturer name, such as Toyota, Mercedes, BMW, or Ford.
        </span>
        <input
          value={form.brand}
          onChange={e => updateField('brand', e.target.value)}
          className='w-full rounded-xl border border-zinc-300 px-4 py-3'
          placeholder='Brand'
        />
      </label>

      <label className='block space-y-2'>
        <span className='block text-sm font-medium text-zinc-950'>Model</span>
        <span className='block text-sm text-zinc-600'>
          Add the exact model or trim so buyers can identify the car.
        </span>
        <input
          value={form.model}
          onChange={e => updateField('model', e.target.value)}
          className='w-full rounded-xl border border-zinc-300 px-4 py-3'
          placeholder='Model'
        />
      </label>

      <label className='block space-y-2'>
        <span className='block text-sm font-medium text-zinc-950'>Year</span>
        <span className='block text-sm text-zinc-600'>
          Enter the car model year, for example 2021.
        </span>
        <input
          type='number'
          min='1900'
          max={new Date().getFullYear() + 1}
          value={form.year}
          onChange={e => updateField('year', e.target.value)}
          className='w-full rounded-xl border border-zinc-300 px-4 py-3'
          placeholder='Year'
        />
      </label>

      <label className='block space-y-2'>
        <span className='block text-sm font-medium text-zinc-950'>Mileage</span>
        <span className='block text-sm text-zinc-600'>
          Enter how many miles or kilometers the car has driven, using numbers
          only.
        </span>
        <input
          type='number'
          min='0'
          value={form.mileage}
          onChange={e => updateField('mileage', e.target.value)}
          className='w-full rounded-xl border border-zinc-300 px-4 py-3'
          placeholder='Mileage'
        />
      </label>

      <label className='block space-y-2'>
        <span className='block text-sm font-medium text-zinc-950'>Owner</span>
        <span className='block text-sm text-zinc-600'>
          Choose whether this listing is sold by your dealership or a private
          seller.
        </span>
        <select
          value={form.owner}
          onChange={e => updateField('owner', e.target.value)}
          className='w-full rounded-xl border border-zinc-300 px-4 py-3'
        >
          <option value='Dealer'>Dealer</option>
          <option value='Private'>Private</option>
        </select>
      </label>

      <label className='block space-y-2'>
        <span className='block text-sm font-medium text-zinc-950'>
          Smoking condition
        </span>
        <span className='block text-sm text-zinc-600'>
          Tell buyers whether the car has been used by a smoker.
        </span>
        <select
          value={form.condition}
          onChange={e => updateField('condition', e.target.value)}
          className='w-full rounded-xl border border-zinc-300 px-4 py-3'
        >
          <option value='Smoker'>Smoker</option>
          <option value='Non-Smoker'>Non-Smoker</option>
        </select>
      </label>

      <label className='block space-y-2'>
        <span className='block text-sm font-medium text-zinc-950'>
          Description
        </span>
        <span className='block text-sm text-zinc-600'>
          Add important details like service history, features, warranty, or
          recent repairs.
        </span>
        <textarea
          value={form.description}
          onChange={e => updateField('description', e.target.value)}
          className='min-h-28 w-full rounded-xl border border-zinc-300 px-4 py-3'
          placeholder='Description'
        />
      </label>

      <button
        type='submit'
        disabled={loading}
        className='w-full rounded-xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white disabled:opacity-60'
      >
        {loading ? 'Creating...' : 'Create car'}
      </button>
    </form>
  );
}
