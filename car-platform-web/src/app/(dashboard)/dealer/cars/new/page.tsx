import DealerCarCreateForm from '@/components/dealer/DealerCarCreateForm';

export default function DealerCarCreatePage() {
  return (
    <main className='mx-auto max-w-4xl space-y-6 p-6'>
      <header className='space-y-2'>
        <h1 className='text-3xl font-bold text-zinc-950'>Add New Car</h1>

        <p className='text-sm text-zinc-600'>
          Create a new vehicle listing for your inventory.
        </p>
      </header>

      <DealerCarCreateForm />
    </main>
  );
}
