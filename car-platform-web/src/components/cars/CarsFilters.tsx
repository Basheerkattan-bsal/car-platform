'use client';

import { init } from 'next/dist/compiled/webpack/webpack';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

type Props = {
  brands: string[];
  initial: {
    brand: string;
    minPrice: string;
    maxPrice: string;
    minYear: string;
    maxYear: string;
    sort: string;
  };
};

function sanitizeText(v: string) {
  return v.trim();
}

function sanitizeNum(v: string) {
  const s = v.trim();
  if (s === '') return '';
  const n = Number(s);
  return Number.isFinite(n) ? String(n) : '';
}

export function CarsFilters({ initial, brands }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // Controlled inputs (client state)
  const [brand, setBrand] = useState(initial.brand);
  const [minPrice, setMinPrice] = useState(initial.minPrice);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);
  const [minYear, setMinYear] = useState(initial.minYear);
  const [maxYear, setMaxYear] = useState(initial.maxYear);
  // Expanding Props.initial
  const [sort, setSort] = useState(initial.sort);

  // BUilding safe query string (NO GHOSTS)
  const nextQuery = useMemo(() => {
    const params = new URLSearchParams(sp.toString());

    const s = sanitizeText(sort);
    if (s && s !== 'newest') params.set('sort', s);
    else params.delete('sort');

    //Reset page when filters change (critical)
    params.delete('page');

    const b = sanitizeText(brand);
    const pMin = sanitizeNum(minPrice);
    const pMax = sanitizeNum(maxPrice);
    const yMin = sanitizeNum(minYear);
    const yMax = sanitizeNum(maxYear);

    if (b) params.set('brand', b);
    else params.delete('brand');

    if (pMin) params.set('minPrice', pMin);
    else params.delete('minPrice');

    if (pMax) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');

    if (yMin) params.set('minYear', yMin);
    else params.delete('minYear');

    if (yMax) params.set('maxYear', yMax);
    else params.delete('maxYear');
    const q = params.toString();
    return q ? `?${q}` : '';
  }, [sp, brand, minPrice, maxPrice, minYear, maxYear]);

  function apply() {
    router.push(
      `${pathname}${nextQuery.startsWith('?') ? nextQuery : `?${nextQuery}`}`
    );
  }

  function clear() {
    setBrand('');
    setMaxPrice('');
    setMinPrice('');
    setMinYear('');
    setMaxYear('');
    router.push(pathname); //wipe query
  }

  return (
    <section className='mt-6 rounded-2xl border bg-white/50 p-4'>
      <div className='grid gap-3 md:grid-cols-5'>
        <div className='md:col-span-1'>
          <label className='text-xs font-medium opacity-70'>Brand</label>
          <select
            onKeyDown={e => {
              if (e.key === 'Enter') apply();
            }}
            value={brand}
            onChange={e => setBrand(e.target.value)}
            className='mt-1 w-full rounded-xl border px-3 py-2 text-sm'
          >
            <option value=''>All brands</option>
            {brands.map(b => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div className='md:col-span-1'>
          <label className='text-xs font-medium opacity-70'>Sort</label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className='mt-1 w-full rounded-xl border px-3 py-2 text-sm'
          >
            <option value='newest'>Newest</option>
            <option value='price_asc'>Price: Low → High</option>
            <option value='price_desc'>Price: High → Low</option>
            <option value='year_desc'>Year: Newest</option>
          </select>
        </div>
        <div className='md:col-span-1'>
          <label className='text-xs font-medium opacity-70'>Min price</label>
          <input
            onKeyDown={e => {
              if (e.key === 'Enter') apply();
            }}
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            inputMode='numeric'
            placeholder='0'
            className='mt-1 w-full rounded-xl border px-3 py-2 text-sm'
          />
        </div>

        <div className='md:col-span-1'>
          <label className='text-xs font-medium opacity-70'>Max price</label>
          <input
            onKeyDown={e => {
              if (e.key === 'Enter') apply();
            }}
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            inputMode='numeric'
            placeholder='100000'
            className='mt-1 w-full rounded-xl border px-3 py-2 text-sm'
          />
        </div>

        <div className='md:col-span-1'>
          <label className='text-xs font-medium opacity-70'>Min year</label>
          <input
            onKeyDown={e => {
              if (e.key === 'Enter') apply();
            }}
            value={minYear}
            onChange={e => setMinYear(e.target.value)}
            inputMode='numeric'
            placeholder='2015'
            className='mt-1 w-full rounded-xl border px-3 py-2 text-sm'
          />
        </div>

        <div className='md:col-span-1'>
          <label className='text-xs font-medium opacity-70'>Max year</label>
          <input
            onKeyDown={e => {
              if (e.key === 'Enter') apply();
            }}
            value={maxYear}
            onChange={e => setMaxYear(e.target.value)}
            inputMode='numeric'
            placeholder='2026'
            className='mt-1 w-full rounded-xl border px-3 py-2 text-sm'
          />
        </div>
      </div>

      <div className='mt-4 flex items-center gap-2'>
        <button
          onClick={apply}
          className='rounded-xl border px-4 py-2 text-sm font-medium hover:bg-black/5'
        >
          Apply
        </button>
        <button
          onClick={clear}
          className='rounded-xl border px-4 py-2 text-sm font-medium hover:bg-black/5'
        >
          Clear
        </button>

        <div className='mt-4 flex flex-wrap gap-2'>
          {brand && (
            <Chip label={`Brand: ${brand}`} onRemove={() => setBrand('')} />
          )}

          {minPrice && (
            <Chip
              label={`Min €: ${minPrice}`}
              onRemove={() => setMinPrice('')}
            />
          )}

          {maxPrice && (
            <Chip
              label={`Max €: ${maxPrice}`}
              onRemove={() => setMaxPrice('')}
            />
          )}

          {minYear && (
            <Chip
              label={`Min Year: ${minYear}`}
              onRemove={() => setMinYear('')}
            />
          )}

          {maxYear && (
            <Chip
              label={`Max Year: ${maxYear}`}
              onRemove={() => setMaxYear('')}
            />
          )}

          {sort && sort !== 'newest' ? (
            <Chip label={`Sort: ${sort}`} onRemove={() => setSort('newest')} />
          ) : null}
        </div>

        <div className='ml-auto text-sm opacity-60'>
          URL preview:
          <span className='font-mono'>{nextQuery || '(none)'}</span>
        </div>
      </div>
    </section>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      onClick={onRemove}
      className='flex items-center-gap-2 rounded-full border px-3 py-1 text-xs hover:bg-black/5'
    >
      <span className='truncate'>{label}</span>
      <span className='opacity-60'>x</span>
    </button>
  );
}
