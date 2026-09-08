import Link from 'next/link';

import { CarGallery } from '@/components/cars/CarGallery';
import { getDealerCarByIdServer } from '@/lib/api/dealerCars.server';

type Props = {
  params: Promise<{ id: string }>;
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

export default async function DealerCarDetailsPage({ params }: Props) {
  const { id } = await params;
  const car = await getDealerCarByIdServer(id);
  const firstRegistration = car.year ? `01/${car.year}` : null;

  return (
    <main className='mx-auto max-w-6xl space-y-6 p-6'>
      <header className='space-y-4'>
        <Link
          href='/dealer/cars'
          className='text-sm text-zinc-500 hover:text-zinc-900'
        >
          ← Back to my cars
        </Link>

        <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <div
              className={`mb-3 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                car.isPublished
                  ? 'border-emerald-400/30 text-emerald-600'
                  : 'border-yellow-400/30 text-yellow-700'
              }`}
            >
              {car.isPublished ? 'Published' : 'Draft'}
            </div>
            <h1 className='text-3xl font-bold text-zinc-950'>{car.title}</h1>
            <p className='mt-2 text-sm text-zinc-600'>
              Review the listing details exactly as they are saved in your
              inventory.
            </p>
          </div>

          <div className='text-3xl font-semibold text-zinc-950'>
            {formatPrice(car.price)}
          </div>
        </div>
      </header>

      <section className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        {car.mileage !== undefined ? (
          <SummaryFact
            label='Mileage'
            value={`${car.mileage.toLocaleString()} km`}
          />
        ) : null}
        {firstRegistration ? (
          <SummaryFact label='First registration' value={firstRegistration} />
        ) : null}
        {car.condition ? (
          <SummaryFact label='Condition' value={car.condition} />
        ) : null}
        {car.owner ? <SummaryFact label='Owner' value={car.owner} /> : null}
      </section>

      <div className='grid gap-6 lg:grid-cols-3'>
        <section className='lg:col-span-2'>
          <CarGallery
            title={car.title}
            apiOrigin={API_ORIGIN}
            mainImage={car.mainImage ?? null}
            images={car.images ?? []}
          />
        </section>

        <aside className='space-y-4'>
          <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
            <div className='text-sm font-medium text-zinc-500'>Actions</div>
            <div className='mt-4 grid gap-3'>
              <Link
                href={`/dealer/cars/${car._id}/edit`}
                className='rounded-xl bg-zinc-950 px-4 py-3 text-center text-sm font-medium text-white hover:bg-zinc-800'
              >
                Edit details
              </Link>
              <Link
                href={`/dealer/cars/${car._id}/images`}
                className='rounded-xl border border-zinc-300 px-4 py-3 text-center text-sm font-medium text-zinc-950 hover:bg-zinc-100'
              >
                Manage images
              </Link>
            </div>
          </section>

          <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
            <div className='text-sm font-medium text-zinc-500'>Quick facts</div>
            <dl className='mt-4 space-y-3 text-sm'>
              <DetailRow label='Brand' value={car.brand} />
              <DetailRow label='Model' value={car.model} />
              <DetailRow label='Year' value={car.year} />
              <DetailRow
                label='Mileage'
                value={
                  car.mileage !== undefined
                    ? `${car.mileage.toLocaleString()} km`
                    : undefined
                }
              />
              <DetailRow label='Owner' value={car.owner} />
              <DetailRow label='Condition' value={car.condition} />
            </dl>
          </section>
        </aside>
      </div>

      {car.description ? (
        <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
          <div className='mb-3 text-sm font-medium text-zinc-500'>
            Description
          </div>
          <p className='whitespace-pre-line text-sm leading-6 text-zinc-800'>
            {car.description}
          </p>
        </section>
      ) : null}
    </main>
  );
}

function SummaryFact({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm'>
      <div className='text-xs text-zinc-500'>{label}</div>
      <div className='mt-1 font-medium text-zinc-950'>{value}</div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (value === undefined || value === '') return null;

  return (
    <div className='flex justify-between gap-4'>
      <dt className='text-zinc-500'>{label}</dt>
      <dd className='font-medium text-zinc-950'>{value}</dd>
    </div>
  );
}
