import Link from 'next/link';

import DealerCarCard from '@/components/dealer/DealerCarCard';
import { getDealerCarsServer } from '@/lib/api/dealerCars.server';
import type { Car } from '@/types/car';

export default async function DealerCarsPage() {
  const res = await getDealerCarsServer();
  const cars: Car[] = res.data ?? [];

  return (
    <main className='mx-auto max-w-6xl space-y-6 p-6'>
      <header className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-white'>My Cars</h1>

          <p className='mt-2 text-sm text-zinc-400'>
            Manage your listed vehicles.
          </p>
        </div>

        <Link
          href='/dealer/cars/new'
          className='rounded-xl border border-white/10 px-4 py-3 text-sm text-white hover:bg-white/10'
        >
          Add car
        </Link>
      </header>

      {cars.length === 0 ? (
        <section className='rounded-2xl border border-white/10 bg-white/5 p-6'>
          <p className='text-sm text-zinc-400'>
            You have not added any cars yet.
          </p>

          <Link
            href='/dealer/cars/new'
            className='mt-4 inline-block text-sm text-white underline'
          >
            Add your first car
          </Link>
        </section>
      ) : (
        <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {cars.map(car => (
            <DealerCarCard key={car._id} car={car} />
          ))}
        </section>
      )}
    </main>
  );
}
