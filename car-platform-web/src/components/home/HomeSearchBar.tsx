'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

const makeOptions = [
  'Any Make',
  'BMW',
  'Audi',
  'Mercedes-Benz',
  'Porsche',
  'Tesla',
];
const priceOptions = ['Any Price', '30000', '50000', '70000', '100000'];

export default function HomeSearchBar() {
  const router = useRouter();

  const [make, setMake] = useState('anyMake');
  const [model, setModel] = useState('');
  const [location, setLocation] = useState('');
  const [priceMax, setPriceMax] = useState('Any Price');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (make && make !== 'Any Make') {
      params.set('make', make);
    }

    if (model.trim()) {
      params.set('model', model.trim());
    }

    if (location.trim()) {
      params.set('location', location.trim());
    }

    if (priceMax && priceMax !== 'Any Price') {
      params.set('priceMax', priceMax);
    }

    const queryString = params.toString();
    const href = queryString ? `/cars?${queryString}` : '/cars';

    router.push(href);
  }
  return (
    <section className='relative -mt-8 z-20'>
      <Container>
        <div className='rounded-[2rem] border border-white/10 bg-black/70 p-4 shadow-2xl backdrop-blur-xl sm:p-6'>
          <form
            onSubmit={handleSubmit}
            className='grid gap-4 lg:grid-cols-[1.1fr_1.1fr_1fr_1fr_auto]'
          >
            <label className='flex flex-col gap-2'>
              <span className='text-xs uppercase tracking-[0.25em] text-zinc-400'>
                Make
              </span>
              <select
                value={make}
                onChange={e => setMake(e.target.value)}
                className='h-12 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20'
              >
                {makeOptions.map(option => (
                  <option
                    key={option}
                    value={option}
                    className='bg-[#111318] text-white'
                  >
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className='flex flex-col gap-2'>
              <span className='text-xs uppercase tracking-[0.25em] text-zinc-400'>
                Model
              </span>
              <input
                type='text'
                value={model}
                onChange={e => setModel(e.target.value)}
                placeholder='M5, RS7, Taycan...'
                className='h-12 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20'
              />
            </label>

            <label className='flex flex-col gap-2'>
              <span className='text-xs uppercase tracking-[0.25em] text-zinc-400'>
                Location
              </span>
              <input
                type='text'
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder='Hamburg'
                className='h-12 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20'
              />
            </label>

            <label className='flex flex-col gap-2'>
              <span className='text-xs uppercase tracking-[0.25em] text-zinc-400'>
                Max Price
              </span>
              <select
                value={priceMax}
                onChange={e => setPriceMax(e.target.value)}
                className='h-12 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white outline-none transition focus:border-white/20'
              >
                {priceOptions.map(option => (
                  <option
                    key={option}
                    value={option}
                    className='bg-[#111318] text-white'
                  >
                    {option === 'Any Price'
                      ? option
                      : `€${Number(option).toLocaleString()}`}
                  </option>
                ))}
              </select>
            </label>

            <div className='flex items-end'>
              <Button type='submit' className='h-12 w-full px-6 lg:w-auto'>
                Search
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}
