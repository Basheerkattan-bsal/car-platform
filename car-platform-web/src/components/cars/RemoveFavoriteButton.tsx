'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { toggleFavoriteBrowser } from '@/lib/api/favorites';

type Props = {
  carId: string;
};

export default function RemoveFavoriteButton({ carId }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleRemove(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    console.log('Removing favorite for car ID:', carId);
    try {
      setLoading(true);

      await toggleFavoriteBrowser(carId);

      router.refresh();
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type='button'
      onClick={handleRemove}
      disabled={loading}
      className='mt-3 rounded-xl border px-3 py-2 text-sm hover:bg-black/5 disabled:opacity-60'
    >
      {loading ? 'Removing...' : 'Remove'}
    </button>
  );
}
