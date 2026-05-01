import Link from 'next/link';

import { getMyFavoritesServer } from '@/lib/api/favorites.server';
import type { Car } from '@/types/car';
import FavoriteCarCard from '@/components/cars/FavoriteCarCard';

export default async function BuyerFavoritesPage() {
  const res = await getMyFavoritesServer();
  const favorites: Car[] = res.data ?? [];

  return (
    <main className='mx-auto max-w-6xl space-y-6 p-6'>
      <header className='space-y-2'>
        <h1 className='text-3xl font-bold'>My Favorites</h1>

        <p className='text-sm opacity-70'>Cars you saved for later.</p>
      </header>

      {favorites.length === 0 ? (
        <section className='rounded-2xl border p-6'>
          <p className='text-sm opacity-70'>
            You do not have any favorite cars yet.
          </p>

          <Link href='/cars' className='mt-4 inline-block text-sm underline'>
            Browse cars
          </Link>
        </section>
      ) : (
        <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {favorites.map(car => (
            <FavoriteCarCard key={car._id} car={car} />
          ))}
        </section>
      )}
    </main>
  );
}
