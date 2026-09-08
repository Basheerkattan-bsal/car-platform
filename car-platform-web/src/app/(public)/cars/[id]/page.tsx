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

type DealerProfile = {
  companyName?: string;
  phone?: string;
  address?: string;
};

type Car = {
  _id: string;
  title: string;
  price: number;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  owner?: string;
  condition?: string;
  description?: string;
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
  const dealerProfile: DealerProfile | null = res.dealerProfile ?? null;
  const dealer =
    car.dealer && typeof car.dealer === 'object' ? car.dealer : null;
  const backHref = buildBackHref(resolveSearchParams);
  const firstRegistration = car.year ? `01/${car.year}` : null;
  const monthlyPayment = Math.max(1, Math.round((car.price * 0.85) / 60));
  const downPayment = Math.round(car.price * 0.15);

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

          <div className='text-3xl font-semibold'>
            {car.price.toLocaleString()} €
          </div>
        </div>
      </header>

      <section className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        {car.mileage !== undefined ? (
          <SummaryFact
            icon='KM'
            label='Mileage'
            value={`${car.mileage.toLocaleString()} km`}
          />
        ) : null}
        {firstRegistration ? (
          <SummaryFact
            icon='FR'
            label='First registration'
            value={firstRegistration}
          />
        ) : null}
        {car.condition ? (
          <SummaryFact icon='CO' label='Condition' value={car.condition} />
        ) : null}
        {car.owner ? (
          <SummaryFact icon='OW' label='Owner' value={car.owner} />
        ) : null}
      </section>

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
          <div className='space-y-4 lg:sticky lg:top-6'>
            <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
              <div className='text-sm font-medium text-zinc-500'>Dealer</div>

              {dealer ? (
                <div className='mt-4 space-y-3'>
                  <div>
                    <div className='text-xs text-zinc-500'>Company</div>
                    <div className='font-medium text-zinc-950'>
                      {dealerProfile?.companyName || dealer.name}
                    </div>
                  </div>

                  {dealerProfile?.address ? (
                    <div>
                      <div className='text-xs text-zinc-500'>Address</div>
                      <div className='font-medium text-zinc-950'>
                        {dealerProfile.address}
                      </div>
                    </div>
                  ) : null}

                  <div>
                    <div className='text-xs text-zinc-500'>Email</div>
                    <div className='font-medium break-all text-zinc-950'>
                      {dealer.email}
                    </div>
                  </div>
                </div>
              ) : (
                <div className='mt-4 text-sm text-zinc-600'>
                  Dealer info not available
                </div>
              )}

              <div className='mt-6 space-y-3'>
                {dealer?.email ? (
                  <a
                    href={`mailto:${dealer.email}?subject=${encodeURIComponent(
                      `Question about ${car.title}`
                    )}`}
                    className='block w-full rounded-xl bg-zinc-950 px-4 py-3 text-center text-sm font-medium text-white hover:bg-zinc-800'
                  >
                    Send email
                  </a>
                ) : null}

                {dealerProfile?.phone ? (
                  <a
                    href={`tel:${dealerProfile.phone}`}
                    className='block w-full rounded-xl border border-zinc-300 px-4 py-3 text-center text-sm font-medium text-zinc-950 hover:bg-zinc-100'
                  >
                    Show number: {dealerProfile.phone}
                  </a>
                ) : (
                  <button
                    type='button'
                    className='w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-500'
                    disabled
                  >
                    Phone number not available
                  </button>
                )}
              </div>
            </section>

            <section className='rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm'>
              <div className='text-sm font-medium text-red-700'>Financing</div>
              <div className='mt-2 text-2xl font-semibold text-zinc-950'>
                from {monthlyPayment.toLocaleString()} € / month
              </div>
              <p className='mt-2 text-sm text-zinc-700'>
                Example estimate with {downPayment.toLocaleString()} € down
                payment over 60 months.
              </p>
              <button
                type='button'
                className='mt-4 w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700'
              >
                Request financing
              </button>
            </section>

            <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
              <div className='text-sm font-medium text-zinc-500'>
                Quick facts
              </div>

              <ul className='mt-4 space-y-2 text-sm'>
                {car.brand ? (
                  <li className='flex justify-between gap-4'>
                    <span className='text-zinc-500'>Brand</span>
                    <span className='font-medium'>{car.brand}</span>
                  </li>
                ) : null}

                {car.model ? (
                  <li className='flex justify-between gap-4'>
                    <span className='text-zinc-500'>Model</span>
                    <span className='font-medium'>{car.model}</span>
                  </li>
                ) : null}

                {car.year ? (
                  <li className='flex justify-between gap-4'>
                    <span className='text-zinc-500'>First registration</span>
                    <span className='font-medium'>{car.year}</span>
                  </li>
                ) : null}

                {car.mileage !== undefined ? (
                  <li className='flex justify-between gap-4'>
                    <span className='text-zinc-500'>Mileage</span>
                    <span className='font-medium'>
                      {car.mileage.toLocaleString()} km
                    </span>
                  </li>
                ) : null}

                {car.owner ? (
                  <li className='flex justify-between gap-4'>
                    <span className='text-zinc-500'>Owner</span>
                    <span className='font-medium'>{car.owner}</span>
                  </li>
                ) : null}

                {car.condition ? (
                  <li className='flex justify-between gap-4'>
                    <span className='text-zinc-500'>Condition</span>
                    <span className='font-medium'>{car.condition}</span>
                  </li>
                ) : null}
              </ul>
            </section>

            <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
              <FavoriteButton
                carId={car._id}
                initialIsFavorite={initialIsFavorite}
              />

              <RemoveFavoriteButton carId={car._id} />
            </section>
          </div>
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

      {/* Full details */}
      <section className='rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'>
        <div className='mb-4 text-sm font-medium text-zinc-500'>
          Full details
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {car.brand ? (
            <SpecItem icon='BR' label='Brand' value={car.brand} />
          ) : null}
          {car.model ? (
            <SpecItem icon='MO' label='Model' value={car.model} />
          ) : null}
          {firstRegistration ? (
            <SpecItem
              icon='FR'
              label='First registration'
              value={firstRegistration}
            />
          ) : null}
          {car.mileage !== undefined ? (
            <SpecItem
              icon='KM'
              label='Mileage'
              value={`${car.mileage.toLocaleString()} km`}
            />
          ) : null}
          {car.owner ? (
            <SpecItem icon='OW' label='Owner' value={car.owner} />
          ) : null}
          {car.condition ? (
            <SpecItem icon='CO' label='Condition' value={car.condition} />
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

function SummaryFact({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className='flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm'>
      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-xs font-semibold text-white'>
        {icon}
      </div>
      <div>
        <div className='text-xs text-zinc-500'>{label}</div>
        <div className='font-medium text-zinc-950'>{value}</div>
      </div>
    </div>
  );
}

function SpecItem({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className='flex items-center gap-3 rounded-xl border border-zinc-200 p-4'>
      <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700'>
        {icon}
      </div>
      <div>
        <div className='text-xs text-zinc-500'>{label}</div>
        <div className='mt-1 font-medium text-zinc-950'>{value}</div>
      </div>
    </div>
  );
}
