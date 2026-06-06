import DealerCarEditForm from '@/components/dealer/DealerCarEditForm';

import { getDealerCarByIdServer } from '@/lib/api/dealerCars.server';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DealerEditCarPage({ params }: Props) {
  const { id } = await params;

  const car = await getDealerCarByIdServer(id);

  return (
    <main className='mx-auto max-w-3xl space-y-6 p-6'>
      <header className='space-y-2'>
        <h1 className='text-3xl font-bold text-zinc-950'>Edit Car</h1>

        <p className='text-sm text-zinc-600'>
          Update your vehicle information.
        </p>
      </header>

      <DealerCarEditForm car={car} />
    </main>
  );
}
