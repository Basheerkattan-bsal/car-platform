'use client';
import { useMemo, useState } from 'react';

type Props = {
  title: string;
  apiOrigin: string; //localhost:5050
  mainImage?: string | null;
  images?: string[] | null;
};

function normalizeUrls(mainImage?: string | null, images?: string[] | null) {
  const list = Array.isArray(images) ? images : [];
  const main =
    typeof mainImage === 'string' && mainImage.trim() ? mainImage.trim() : '';

  //? Put main first, then rest, then remove duplicates, remove empties

  const merged = [main, ...list]
    .map(s => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean);

  return Array.from(new Set(merged));
}

export function CarGallery({ title, apiOrigin, mainImage, images }: Props) {
  const urls = useMemo(
    () => normalizeUrls(mainImage, images),
    [mainImage, images]
  );
  const [active, setActive] = useState(urls[0] ?? '');

  if (!urls.length) {
    return (
      <section className='rounded-2xl border p-4 text-sm opacity-70'>
        No image yet
      </section>
    );
  }

  const activeSrc = `${apiOrigin}${active}`;

  return (
    <section className='rounded-2xl border p-4 space-y-4'>
      {/* Main */}
      <img
        src={activeSrc}
        alt={title}
        className='h-80 w-full rounded-xl object-cover'
      />
      {/* Thumbnails */}
      {urls.length > 1 ? (
        <div className='grid grid-cols-4 gap-3 sm:grid-cols-6'>
          {urls.map(u => {
            const src = `${apiOrigin}${u}`;
            const isActive = u === active;
            return (
              <button
                key={u}
                type='button'
                onClick={() => setActive(u)}
                className={`overflow-hidden rounded-lg border ${
                  isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
                aria-label='Select image'
              >
                <img src={src} alt='' className='h-16 w-full object-cover' />
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
