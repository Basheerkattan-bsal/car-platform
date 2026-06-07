import DealerCarImagesManager from '@/components/dealer/DealerCarImagesManager';
import { getDealerCarByIdServer } from '@/lib/api/dealerCars.server';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
};

// PERMANENT — Server Component: fetches car data, passes to client image manager
// This page owns: data fetching, layout shell, back navigation
// It must never own: state, event handlers, browser APIs (those belong to DealerCarImagesManager)
export default async function DealerCarImagesPage({ params }: Props) {
  const { id } = await params;

  const car = await getDealerCarByIdServer(id);

  return (
    <main className='mx-auto max-w-4xl space-y-6 p-6'>
      <header className='space-y-2'>
        <Link
          href='/dealer/cars'
          className='text-sm text-zinc-500 hover:text-zinc-800'
        >
          ← Back to my cars
        </Link>

        <h1 className='text-3xl font-bold text-zinc-950'>Car Images</h1>

        <p className='text-sm text-zinc-600'>
          {car.title} — manage photos for this listing
        </p>
      </header>

      <DealerCarImagesManager car={car} />
    </main>
  );
}
