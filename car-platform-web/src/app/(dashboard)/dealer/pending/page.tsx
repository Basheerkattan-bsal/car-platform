import Link from 'next/link';

export default function DealerPendingPage() {
  return (
    <main className='flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12'>
      <section className='w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-sm'>
        <p className='text-sm font-medium uppercase tracking-[0.2em] text-zinc-500'>
          Dealer review
        </p>
        <h1 className='mt-2 text-3xl font-bold text-zinc-950'>
          Dealer application pending
        </h1>
        <p className='mt-4 text-sm leading-6 text-zinc-600'>
          An admin must approve your dealership before full inventory publishing
          access is enabled. You can still browse the marketplace while your
          application is reviewed.
        </p>

        <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
          <Link
            href='/cars'
            className='rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800'
          >
            Browse cars
          </Link>
          <Link
            href='/dealer'
            className='rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-zinc-100'
          >
            Dealer dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
