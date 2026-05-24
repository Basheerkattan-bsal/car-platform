export default function DealerCarsLoading() {
  return (
    <main className='mx-auto max-w-6xl space-y-6 p-6'>
      <div className='space-y-2'>
        <div className='h-8 w-48 rounded bg-white/10' />
        <div className='h-4 w-72 rounded bg-white/10' />
      </div>

      <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className='h-80 rounded-2xl border border-white/10 bg-white/5'
          />
        ))}
      </section>
    </main>
  );
}
