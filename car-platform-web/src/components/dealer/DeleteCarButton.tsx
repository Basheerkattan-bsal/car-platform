'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { deleteDealerCarBrowser } from '@/lib/api/dealerCars.browser';

type Props = {
  carId: string;
};

export default function DeleteCarButton({ carId }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this Car?',
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      await deleteDealerCarBrowser(carId);

      router.refresh();
    } catch (error) {
      console.error('Failed to delete car', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type='button'
      onClick={handleDelete}
      disabled={loading}
      className='w-full rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disable:opacity-60'
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  );
}
