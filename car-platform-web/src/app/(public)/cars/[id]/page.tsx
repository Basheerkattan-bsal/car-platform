import { api } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

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
};

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? '';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function CarDetailsPage({ params }: Props) {
  const { id } = await params;
  if (!id || id === 'undefined') throw new Error('Bad car id in URL');
  const url = endpoints.cars.byId(id);
  console.log('DETAIL FETCH URL:', url);
  const res = await api<{ success: boolean; data: Car }>(
    endpoints.cars.byId(id)
  );

  const car = res.data;

  const images = Array.isArray(car.images) ? car.images : [];
  const main = car.mainImage || images[0] || null;
  return (
    <main className='space-y-6 p-6'>
      <header>
        <h1 className='text-2xl font-semibold'> {car.title}</h1>
        <div className='text-sm opacity-80'>{car.price}</div>
      </header>

      {main ? (
        <section className='rounded-xl border p-4'>
          <div className='text-sm font-medium mb-2'>Main image</div>
          <img
            src={`${API_ORIGIN}${main}`}
            alt={car.title}
            className='mt-3 h-40 w-full rounded-lg object-cover'
          />
        </section>
      ) : (
        <section className='rounded-xl border p-4 text-sm opacity-70'>
          No image yet
        </section>
      )}

      <section className='rounded-xl border p-4'>
        <div className='text-sm font-medium mb-3'>Details</div>
        <ul className='text-sm space-y-1 opacity-90'>
          {car.brand ? <li>Brand: {car.brand}</li> : null}
          {car.year ? <li>Year: {car.year}</li> : null}
          {car.mileage ? <li>Mileage : {car.mileage}</li> : null}
          {car.owner ? <li>Owner: {car.owner}</li> : null}
          {car.condition ? <li>Condition: {car.condition}</li> : null}
        </ul>
      </section>

      {images.length ? (
        <section className='rounded-xl border p-4'>
          <div className='text-sm font-medium mb-3'>
            All images ({images.length})
          </div>
          <ul className='text-xs space-y-1 opacity-80'>
            {images.map(url => (
              <li key={url} className='break-all'>
                <img src={`${API_ORIGIN}${url}`} alt={car.title} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
