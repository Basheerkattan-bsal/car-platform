'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  carId: string;
  isPublished: boolean;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050/api';

export default function PublishToggleButton({ carId, isPublished }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    try {
      setLoading(true);

      const action = isPublished ? 'unpublish' : 'publish';

      const res = await fetch(
        `${API_BASE_URL}/dealer/cars/${carId}/${action}`,
        { method: 'PUT', credentials: 'include' },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update publish state');
      }

      router.refresh();
    } catch (error) {
      console.error('Publish toggle failed', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type='button'
      onClick={handleToggle}
      disabled={loading}
      className='w-full rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-60'
    >
      {loading ? 'updating...' : isPublished ? 'Unpublish' : 'Publish'}
    </button>
  );
}
