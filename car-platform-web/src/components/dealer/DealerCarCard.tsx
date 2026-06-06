import Link from 'next/link';
import type { Car } from '@/types/car';
import PublishToggleButton from './PublishToggleButton';
import DeleteCarButton from './DeleteCarButton';

type Props = {
  car: Car;
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

export default function DealerCarCard({ car }: Props) {
  const rawImage = car.mainImage || car.images?.[0] || '';

  const imageSrc = rawImage.startsWith('/uploads')
    ? `${API_ORIGIN}${rawImage}`
    : rawImage;

  const isPublished = Boolean(car.isPublished);

  return (
    <article className='flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm'>
      <div className='h-48 overflow-hidden bg-black/30'>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={car.title}
            className='h-full w-full object-cover'
          />
        ) : (
          <div className='flex h-full items-center justify-center text-sm text-zinc-400'>
            No image
          </div>
        )}
      </div>
      <div className='flex flex-1 flex-col space-y-4 p-5'>
        <div className='flex items-start justify-between gap-4'>
          <div>
            <h3 className='text-lg font-semibold text-zinc-950'>{car.title}</h3>

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

        <div className='mt-auto space-y-2'>
          <div className='grid gap-2 sm:grid-cols-2'>
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
        </div>
      </div>
    </article>
  );
}
