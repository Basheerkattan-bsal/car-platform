
import Link from "next/link";

const actions = [
  {
    title : 'Manage Cars',
    description: 'View, edit, publish, and delete your vehicle inventory.',
    href: '/dealer/cars',
  },
  {
    title: 'Add New Car',
    description : 'create a new vehicle listing for the marketplace',
    href : 'dealer/cars/new',
  }
  {
    title : 'View Marketplace',
    description: 'See how published cars appear to buyers',
    href: '/cars',
  },
]

export default function DealerDashboardPage(){
  return(
    <main className='mx-auto max-w-6xl space-y-8 p-6'>
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
          Dealer Dashboard
        </p>

        <h1 className="text-4xl font-bold text-zinc-950">
          Manage your Carvia inventory 
        </h1>

        <p className="max-w-2xl text-sm leading-6 text-zinc-600">
          Controle your vehicle listing, publish cars to the marketplace and keep your inventory ready for buyers.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols3">
      {actions.map(action =>(
        <Link key= {action.href} href={action.href} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transaction hover:-translate-y-0.5 hover:shadow-md">

          <h2 className="text-lg font-semibold text-zinc-950">
            {action.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {action.description}
          </p>

          <span className="mt-6 inline-block text-sm font-medium text-zinc-950 underline">
            Open
          </span>
          
        </Link>
      ))}
      </section>
    </main>
  )
}