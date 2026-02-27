import Link from 'next/link';
const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:5050';

type carCardProps = {
  id: string;
  title: string;
  price: number;
  year?: number;
  mainImage?: string | null;
};

export function CarCard({ id, title, price, year, mainImage }: carCardProps) {
  return (
    <li className='rounded-2xl border bg-white/50 shadow-sm transition hover:shadow-md'>
      <Link href={`/cars/${id}`} className='block p-4'>
        <div className='aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/5'>
          {mainImage ? (
            <img
              src={`${API_ORIGIN}${mainImage}`}
              alt={title}
              className='h-full object-cover'
            />
          ) : null}
        </div>

        <div className='mt-3 flex items-start justify-between gap-3'>
          <div className='min-w-0'>
            <div className='truncate front-semibold'>{title}</div>
            <div className='text-sm opacity-70'>
              {year ? `Year ${year}` : ' '}
            </div>
          </div>
          <div className='shrink-0 text-right font-semibold'>
            {price.toLocaleString()} €
          </div>
        </div>
      </Link>
    </li>
  );
}
