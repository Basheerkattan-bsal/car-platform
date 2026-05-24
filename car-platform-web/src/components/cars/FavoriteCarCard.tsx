'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Car } from '@/types/car';
import { toggleFavoriteBrowser } from '@/lib/api/favorites';

type Props = {
  car: Car;
};

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:5050';

export default function FavoriteCarCard({ car }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [removed, setRemoved] = useState(false);

  const rawImage = car.mainImage || car.images?.[0] || '';

  const safeImage =
    rawImage.startsWith('/uploads') && !rawImage.includes('$(ext')
      ? `${API_ORIGIN}${rawImage}`
      : '';

  async function handleRemove(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);

      await toggleFavoriteBrowser(car._id);

      setRemoved(true);
      router.refresh();
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    } finally {
      setLoading(false);
    }
  }

  if (removed) {
    return null;
  }

  return (
    <article className='overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5'>
      <div className='h-56 overflow-hidden bg-black/30'>
        {safeImage ? (
          <img
            src={safeImage}
            alt={car.title}
            className='h-full w-full object-cover'
          />
        ) : (
          <div className='flex h-full items-center justify-center text-sm text-zinc-400'>
            No image yet
          </div>
        )}
      </div>

      <div className='space-y-2 p-5'>
        <Link href={`/cars/${car._id}`} className='block'>
          <h3 className='text-lg font-semibold text-white'>{car.title}</h3>
        </Link>

        <p className='text-sm text-zinc-400'>
          {car.brand ?? 'Unknown brand'}
          {car.year ? ` · ${car.year}` : ''}
        </p>

        <p className='text-sm font-medium text-white'>
          {car.price.toLocaleString()} €
        </p>

        <button
          type='button'
          onClick={handleRemove}
          disabled={loading}
          className='mt-4 w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-white hover:bg-white/10 disabled:opacity-60'
        >
          {loading ? 'Removing...' : 'Remove from favorites'}
        </button>
      </div>
    </article>
  );
}
