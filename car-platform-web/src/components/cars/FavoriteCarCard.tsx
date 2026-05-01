'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Car } from '@/types/car';

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

  const imageSrc = car.mainImage || car.images?.[0] || '/hero-car.jpg';

  async function handleRemove(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked');

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
      <div>
        <Link href={`/cars/${car._id}`} className='group block'>
          <div className='relative aspect-[4/3] overflow-hidden'>
            <Image
              src={
                imageSrc.startsWith('/uploads')
                  ? `${API_ORIGIN}${imageSrc}`
                  : imageSrc
              }
              alt={car.title}
              fill
              className='object-cover transition duration-500 group-hover:scale-[1.03]'
            />
          </div>

          <div className='space-y-2 p-5'>
            <h3 className='text-lg font-semibold text-white'>{car.title}</h3>

            <p className='text-sm text-zinc-400'>
              {car.brand ?? 'Unknown brand'}

              {car.year ? ` · ${car.year}` : ''}
            </p>

            <p className='text-sm font-medium text-white'>
              {car.price.toLocaleString()} €
            </p>
          </div>
        </Link>
      </div>

      <p className='mb-2 text-xs text-red-400'>ACTION AREA</p>

      <div className='border-t border-white/10 p-5'>
        <button
          type='button'
          onClick={handleRemove}
          disabled={loading}
          className='w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-white hover:bg-white/10 disabled:opacity-60'
        >
          {loading ? 'Removing...' : 'Remove from favorites'}
        </button>
      </div>
    </article>
  );
}
