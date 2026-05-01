import Link from 'next/link';

import { CarGallery } from '@/components/cars/CarGallery';
import { getCarByIdServer } from '@/lib/api/car';
import FavoriteButton from '@/components/cars/FavoriteButton';
import RemoveFavoriteButton from '@/components/cars/RemoveFavoriteButton';
import { getMyFavoritesServer } from '@/lib/api/favorites.server';

type Dealer = {
  _id: string;
  name: string;
  email: string;
  role: 'buyer' | 'dealer' | 'admin';
};

type Car = {
  _id: string;
  title: string;
  price: number;
  brand?: string;
  year?: number;
  mileage?: number;
  owner?: string;
  condition?: string;
  mainImage?: string;
  images?: string[];
  dealer?: string | Dealer;
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:5050';

function asString(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function buildBackHref(sp?: Record<string, string | string[] | undefined>) {
  if (!sp) return '/cars';
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const s = asString(v);
    if (s) qs.set(k, s);
  }
  const q = qs.toString();
  return q ? `/cars?${q}` : '/cars';
}
export default async function CarDetailsPage({ params, searchParams }: Props) {
  const { id: rawId } = await params;
  const resolveSearchParams = searchParams ? await searchParams : undefined;

  const id = decodeURIComponent(String(rawId)).trim();
  if (!id || id === 'undefined') {
    throw new Error('Bad car id in URL');
  }

  const res = await getCarByIdServer(id);

  const car = res.data;
  const similarCars = Array.isArray(res.similarCars) ? res.similarCars : [];
  const dealer =
    car.dealer && typeof car.dealer === 'object' ? car.dealer : null;
  const backHref = buildBackHref(resolveSearchParams);

  // Favorite logic

  let initialIsFavorite = false;

  try {
    const favRes = await getMyFavoritesServer();

    if (favRes.success) {
      initialIsFavorite = favRes.data.some(fav => fav._id === car._id);
    }
  } catch (error) {
    //User not logged in or request failed
    initialIsFavorite = false;
  }

  return (
    <main className='mx-auto max-w-6xl space-y-6 p-6'>
      <header className='space-y-2'>
        <Link href={backHref} className='text-sm underline opacity-70'>
          ← Back to results
        </Link>

        <div className='flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <h1 className='text-3xl font-bold'>{car.title}</h1>
            <div className='mt-1 text-sm opacity-70'>
              {car.brand ? (
                <span className='mr-3'>Brand: {car.brand}</span>
              ) : null}
              {car.year ? <span className='mr-3'>Year: {car.year}</span> : null}
              {car.mileage !== undefined ? (
                <span>Mileage: {car.mileage.toLocaleString()} km</span>
              ) : null}
            </div>
          </div>

          <div className='text-2xl font-semibold'>
            {car.price.toLocaleString()} €
          </div>
        </div>
      </header>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Left: gallery */}
        <section className='lg:col-span-2'>
          <CarGallery
            title={car.title}
            apiOrigin={API_ORIGIN}
            mainImage={car.mainImage ?? null}
            images={car.images ?? []}
          />
        </section>

        {/* Right: summary / CTA */}
        <aside className='lg:col-span-1'>
          <div className='rounded-2xl border p-4 lg:sticky lg:top-6'>
            <div className='text-sm font-medium opacity-70'>Dealer</div>

            {dealer ? (
              <div className='mt-4 space-y-3'>
                <div>
                  <div className='text-xs opacity-60'>Name</div>
                  <div className='font-medium'>{dealer.name}</div>
                </div>

                <div>
                  <div className='text-xs opacity-60'>Email</div>
                  <div className='font-medium break-all'>{dealer.email}</div>
                </div>

                <div>
                  <div className='text-xs opacity-60'>Role</div>
                  <div className='font-medium capitalize'>{dealer.role}</div>
                </div>
              </div>
            ) : (
              <div className='mt-4 text-sm opacity-70'>
                Dealer info not available
              </div>
            )}

            <div className='mt-6 border-t pt-4'>
              <div className='text-sm font-medium opacity-70'>Quick facts</div>

              <ul className='mt-4 space-y-2 text-sm'>
                {car.brand ? (
                  <li className='flex justify-between gap-4'>
                    <span className='opacity-70'>Brand</span>
                    <span className='font-medium'>{car.brand}</span>
                  </li>
                ) : null}

                {car.year ? (
                  <li className='flex justify-between gap-4'>
                    <span className='opacity-70'>Year</span>
                    <span className='font-medium'>{car.year}</span>
                  </li>
                ) : null}

                {car.mileage !== undefined ? (
                  <li className='flex justify-between gap-4'>
                    <span className='opacity-70'>Mileage</span>
                    <span className='font-medium'>
                      {car.mileage.toLocaleString()} km
                    </span>
                  </li>
                ) : null}

                {car.owner ? (
                  <li className='flex justify-between gap-4'>
                    <span className='opacity-70'>Owner</span>
                    <span className='font-medium'>{car.owner}</span>
                  </li>
                ) : null}

                {car.condition ? (
                  <li className='flex justify-between gap-4'>
                    <span className='opacity-70'>Condition</span>
                    <span className='font-medium'>{car.condition}</span>
                  </li>
                ) : null}
              </ul>
            </div>

            <div className='mt-6 space-y-3'>
              <FavoriteButton
                carId={car._id}
                initialIsFavorite={initialIsFavorite}
              />

              <RemoveFavoriteButton carId={car._id} />
              <button
                type='button'
                className='w-full rounded-xl border px-4 py-3 text-sm font-medium hover:bg-black/5'
              >
                Contact dealer
              </button>

              <button
                type='button'
                className='w-full rounded-xl border px-4 py-3 text-sm font-medium hover:bg-black/5'
              >
                Book service
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Full details */}
      <section className='rounded-2xl border p-4'>
        <div className='mb-4 text-sm font-medium'>Full details</div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {car.brand ? <SpecItem label='Brand' value={car.brand} /> : null}
          {car.year ? <SpecItem label='Year' value={car.year} /> : null}
          {car.mileage !== undefined ? (
            <SpecItem
              label='Mileage'
              value={`${car.mileage.toLocaleString()} km`}
            />
          ) : null}
          {car.owner ? <SpecItem label='Owner' value={car.owner} /> : null}
          {car.condition ? (
            <SpecItem label='Condition' value={car.condition} />
          ) : null}
        </div>
      </section>
      {similarCars.length > 0 ? (
        <section className='rounded-2xl border p-4'>
          <div className='mb-4 text-sm font-medium'>Similar cars</div>

          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {similarCars.map(c => (
              <Link
                key={c._id}
                href={`/cars/${c._id}`}
                className='rounded-xl border p-3 hover:bg-black/5'
              >
                {c.mainImage ? (
                  <img
                    src={`${API_ORIGIN}${c.mainImage}`}
                    alt={c.title}
                    className='h-32 w-full rounded-lg object-cover'
                  />
                ) : (
                  <div className='flex h-32 w-full items-center justify-center rounded-lg border text-sm opacity-60'>
                    No image
                  </div>
                )}

                <div className='mt-3 font-medium'>{c.title}</div>
                <div className='text-sm opacity-70'>{c.price} €</div>

                <div className='mt-1 text-xs opacity-60'>
                  {c.brand ? `${c.brand}` : ''}
                  {c.year ? ` • ${c.year}` : ''}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}

function SpecItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className='rounded-xl border p-4'>
      <div className='text-xs opacity-60'>{label}</div>
      <div className='mt-1 font-medium'>{value}</div>
    </div>
  );
}
