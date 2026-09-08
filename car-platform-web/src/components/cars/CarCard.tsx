import Link from 'next/link';

import type { Car } from '@/types/car';
import React from 'react';

type CarCardProps = {
  car: Car;
  action?: React.ReactNode;
};

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:5050';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMileage(mileage?: number) {
  if (typeof mileage !== 'number') return null;

  return `${mileage.toLocaleString()} km`;
}

export default function CarCard({ car, action }: CarCardProps) {
  const rawImage = car.mainImage || car.images?.[0] || '';

  const imageSrc = rawImage.startsWith('/uploads')
    ? `${API_ORIGIN}${rawImage}`
    : rawImage || '';

  const carHref = `/cars/${car._id}`;
  const mileageText = formatMileage(car.mileage);

  return (
    <article className='group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-lg'>
      <Link href={carHref} className='block'>
        <div className='relative h-56 overflow-hidden bg-black/30'>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={car.title}
              className='h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]'
            />
          ) : (
            <div className='flex h-full items-center justify-center text-sm text-zinc-400'>
              No image yet
            </div>
          )}

          <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent' />

          {car.condition ? (
            <div className='absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white backdrop-blur'>
              {car.condition}
            </div>
          ) : null}
        </div>

        <div className='space-y-4 p-5'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <h3 className='text-lg font-semibold text-white'>{car.title}</h3>

              {(car.brand || car.location) && (
                <p className='mt-1 text-sm text-zinc-400'>
                  {[car.brand, car.location].filter(Boolean).join(' • ')}
                </p>
              )}
            </div>

            <div className='shrink-0 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-sm font-medium text-white'>
              {formatPrice(car.price)}
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {car.year ? (
              <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300'>
                {car.year}
              </span>
            ) : null}

            {mileageText ? (
              <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300'>
                {mileageText}
              </span>
            ) : null}

            {car.fuelType ? (
              <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300'>
                {car.fuelType}
              </span>
            ) : null}

            {car.transmission ? (
              <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300'>
                {car.transmission}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      {action ? (
        <div className='border-t border-white/10 bg-white/10 p-5'>{action}</div>
      ) : null}
    </article>
  );
}
