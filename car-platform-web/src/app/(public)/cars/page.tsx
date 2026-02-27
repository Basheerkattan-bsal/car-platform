import { api } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import { CarCard } from '@/components/cars/CarCard';
import { Pagination } from '@/components/ui/Pagination';
import { CarsFilters } from '@/components/cars/CarsFilters';
import Link from 'next/link';

type Car = {
  _id: string;
  title: string;
  price: number;
  year: number;
  mainImage?: string;
};

type Search = {
  page?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  sort?: string;
};

function qs(params: Record<string, string | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && String(v).trim() !== '') sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : '';
}
const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const q = await searchParams;
  const page = Math.max(Number(q.page || '1') || 1, 1);
  const query = qs({
    page: String(page),
    brand: q.brand,
    minPrice: q.minPrice,
    maxPrice: q.maxPrice,
    minYear: q.minYear,
    maxYear: q.maxYear,
    sort: q.sort,
  });

  const [carsRes, brandsRes] = await Promise.all([
    api<{
      success: boolean;
      data: Car[];
      pagination: {
        page: number;
        limit: number;
        totalCars: number;
        totalPages: number;
      };
    }>(`${endpoints.cars.list}${query}`),

    api<{ success: boolean; data: string[] }>(endpoints.cars.brands),
  ]);

  const res = carsRes;
  const brands = brandsRes.data;

  const makeHref = (p: number) =>
    `/cars${qs({
      ...q,
      page: String(Math.max(p, 1)),
    })}`;

  const total = res.pagination.totalCars;

  return (
    <main className='mx-auto max-w-6xl p-6'>
      <header className='flex items-end justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>Cars</h1>
          <div className='mt-2 text-sm opacity-70'>
            {total === 0
              ? 'No cars found'
              : `${total} car${total > 1 ? 's' : ''} found`}
          </div>
          <p className='mt-1 text-sm opacity-70'>
            {res.pagination.totalCars} results
          </p>
        </div>
      </header>

      {/* Filters */}

      <CarsFilters
        brands={brands}
        initial={{
          brand: q.brand ?? '',
          minPrice: q.minPrice ?? '',
          maxPrice: q.maxPrice ?? '',
          minYear: q.minYear ?? '',
          maxYear: q.maxYear ?? '',
          sort: q.sort ?? 'newest',
        }}
      />

      <ul className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {res.data.map(c => (
          <CarCard
            key={c._id}
            id={c._id}
            title={c.title}
            price={c.price}
            year={c.year}
            mainImage={c.mainImage ?? null}
          />
        ))}
      </ul>

      <Pagination
        page={res.pagination.page}
        totalPages={res.pagination.totalPages}
        makeHref={makeHref}
      />
    </main>
  );
}
