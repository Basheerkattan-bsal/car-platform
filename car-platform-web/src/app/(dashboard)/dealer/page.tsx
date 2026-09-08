
import Link from 'next/link';

import { getDealerDashboardStatsServer } from '@/lib/api/dealerDashboard.server';

const actions = [
  {
    title: 'Manage Cars',
    description: 'View, edit, publish, and delete your vehicle inventory.',
    href: '/dealer/cars',
  },
  {
    title: 'Add New Car',
    description: 'Create a new vehicle listing for the marketplace.',
    href: '/dealer/cars/new',
  },
  {
    title: 'View Marketplace',
    description: 'See how published cars appear to buyers.',
    href: '/cars',
  },
];

export default async function DealerDashboardPage() {
  const stats = await getDealerDashboardStatsServer();

  const statCards = [
    {
      label: 'Total Cars',
      value: stats.totalCars,
      description: 'All vehicles currently saved in your inventory.',
    },
    {
      label: 'Published Cars',
      value: stats.publishedCars,
      description: 'Live listings visible to marketplace buyers.',
    },
    {
      label: 'Draft Cars',
      value: stats.draftCars,
      description: 'Cars that still need images, details, or publishing.',
    },
  ];

  return (
    <main className='mx-auto max-w-6xl space-y-8 p-6'>
      <header className='space-y-3'>
        <p className='text-sm font-medium uppercase tracking-[0.25em] text-zinc-500'>
          Dealer Dashboard
        </p>

        <h1 className='text-4xl font-bold text-zinc-950'>
          Dealer command center
        </h1>

        <p className='max-w-2xl text-sm leading-6 text-zinc-600'>
          Track inventory health, publish cars to the marketplace, and keep your
          listings ready for serious buyers.
        </p>
      </header>

      <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {statCards.map(card => (
          <article
            key={card.label}
            className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'
          >
            <p className='text-sm font-medium text-zinc-500'>{card.label}</p>
            <div className='mt-3 text-4xl font-semibold text-zinc-950'>
              {card.value}
            </div>
            <p className='mt-3 text-sm leading-6 text-zinc-600'>
              {card.description}
            </p>
          </article>
        ))}
      </section>

      <section className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {actions.map(action => (
          <Link
            key={action.href}
            href={action.href}
            className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'
          >
            <h2 className='text-lg font-semibold text-zinc-950'>
              {action.title}
            </h2>

            <p className='mt-2 text-sm leading-6 text-zinc-600'>
              {action.description}
            </p>

            <span className='mt-6 inline-block text-sm font-medium text-zinc-950 underline'>
              Open
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
