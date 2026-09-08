'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Car } from '@/types/car';
import PublishToggleButton from './PublishToggleButton';
import DeleteCarButton from './DeleteCarButton';
import CarImageSlider from '@/components/ui/CarImageSlider';

type Props = {
  car: Car;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function DealerCarCard({ car }: Props) {
  const router = useRouter();
  const isPublished = Boolean(car.isPublished);
  const detailsHref = `/dealer/cars/${car._id}`;

  function openDetails() {
    router.push(detailsHref);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (e.target instanceof HTMLElement && e.target.closest('a, button')) {
      return;
    }

    e.preventDefault();
    openDetails();
  }

  return (
    <article
      role='link'
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={handleKeyDown}
      className='flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2'
    >
      <CarImageSlider
        images={car.images || []}
        mainImage={car.mainImage}
        alt={car.title}
      />
      <div className='flex flex-1 flex-col space-y-4 p-5'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <Link
              href={detailsHref}
              className='text-lg font-semibold text-zinc-950 hover:underline'
            >
              {car.title}
            </Link>

            <p className='mt-1 text-sm text-zinc-600'>
              {car.brand ?? 'Unknown brand'}
              {car.year ? ` - ${car.year}` : ''}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs ${
              isPublished
                ? 'border-emerald-400/30 text-emerald-500'
                : 'border-yellow-400/30 text-yellow-600'
            }`}
          >
            {isPublished ? 'Published' : 'Draft'}
          </span>
        </div>

        <p className='text-sm font-medium text-zinc-900'>
          {formatPrice(car.price)}
        </p>

        <div className='mt-auto space-y-2' onClick={e => e.stopPropagation()}>
          <div className='grid gap-2 sm:grid-cols-3'>
            <Link
              href={detailsHref}
              className='rounded-xl border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-zinc-900 hover:bg-zinc-100'
            >
              Details
            </Link>

            <Link
              href={`/dealer/cars/${car._id}/edit`}
              className='rounded-xl border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-zinc-900 hover:bg-zinc-100'
            >
              Edit
            </Link>

            <Link
              href={`/dealer/cars/${car._id}/images`}
              className='rounded-xl border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-zinc-900 hover:bg-zinc-100'
            >
              Images
            </Link>
          </div>

          <PublishToggleButton
            carId={car._id}
            isPublished={Boolean(car.isPublished)}
          />

          <DeleteCarButton carId={car._id} />
        </div>
      </div>
    </article>
  );
}
