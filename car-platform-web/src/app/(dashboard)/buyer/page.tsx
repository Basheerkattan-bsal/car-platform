import Link from 'next/link';

export default function BuyerPage() {
  return (
    <main className='mx-auto max-w-6xl p-6'>
      <h1 className='text-3xl font-bold'>Buyer Dashboard</h1>

      <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <Link
          href='/buyer/favorites'
          className='rounded-2xl border p-5 hover:bg-black/5'
        >
          <h2 className='text-lg font-semibold'>Saved Cars</h2>

          <p className='mt-2 text-sm opacity-70'>
            View the cars you saved for later.
          </p>
        </Link>
      </div>
    </main>
  );
}
