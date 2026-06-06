'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toggleFavoriteBrowser } from '@/lib/api/favorites';

type Props = {
  carId: string;
  initialIsFavorite: boolean;
};

function hasStatusCode(error: unknown, statusCode: number) {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof error.status === 'number' &&
    error.status === statusCode
  );
}

export default function FavoriteButton({ carId, initialIsFavorite }: Props) {
  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    try {
      setLoading(true);

      const res = await toggleFavoriteBrowser(carId);

      console.log('Toggle favorite response', res);

      setIsFavorite(res.isFavorite);
    } catch (error: unknown) {
      if (hasStatusCode(error, 401)) {
        router.push('/login');
        return;
      }

      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type='button'
      onClick={handleToggle}
      disabled={loading}
      className='rounded-xl border px-4 py-2 text-sm'
    >
      {loading ? 'Saving...' : isFavorite ? '🤎 Saved' : '🩵 Save'}
    </button>
  );
}
