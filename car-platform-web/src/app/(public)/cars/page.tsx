import Link from 'next/link';

import CarCard from '@/components/cars/CarCard';
import { getBrandsServer } from '@/lib/api/car';
import { getCarsServer } from '@/lib/api/car';
import { Car } from '@/types/car';

type Props = {
  searchParams?: Promise<{
    page?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    minYear?: string;
    maxYear?: string;
    sort?: string;
  }>;
};

export default async function CarsPage({ searchParams }: Props) {
  const params = (await searchParams) ?? {};

  const carResponse = await getCarsServer({
    page: params.page ? Number(params.page) : 1,
    brand: params.brand,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    minYear: params.minYear,
    maxYear: params.maxYear,
    sort: params.sort,
  });

  const brandsResponse = await getBrandsServer();

  const cars: Car[] = carResponse.data;
  const brands = brandsResponse.data;
  const pagination = carResponse.pagination;

  return (
    <main className='mx-auto max-w-6xl px-6 py-8'>
      <section className='mb-8'>
        <h1 className='text-3xl font-semibold'>Browse Cars</h1>

        <p className='mt-2 text-sm text-neutral-600'>
          Explore available listing on Carvia.
        </p>
      </section>

      <section className='mb-8'>
        <h2 className='mb-3 text-lg font-medium'>Brands</h2>

        <div className='flex flex-wrap gap-2'>
          {brands.map(brand => (
            <Link
              key={brand}
              href={`/cars?brand=${encodeURIComponent(brand)}`}
              className='rounded border px-3 py-1 text-sm'
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      <section className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {cars.map(car => (
          <CarCard key={car._id} car={car} />
        ))}
      </section>

      <section className='mt-8 text-sm text-neutral-600'>
        <p>
          Page {pagination.page} of {pagination.totalPages}
        </p>
        <p>Total cars : {pagination.totalCars}</p>
      </section>
    </main>
  );
}
