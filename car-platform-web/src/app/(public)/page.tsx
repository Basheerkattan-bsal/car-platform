import Image from 'next/image';
import Link from 'next/link';

const categories = [
  ['SUVs', 'M10 6h4l2 6 4 4 2 4-4v10'],
  ['Sedans', 'M4 7h16v10H4z'],
  ['Electric', 'M13 2 6 10v6l-6 10V8z'],
  ['Luxury', 'M12 3l2.4 5.2 5.6.8 5.6-.8L12 3z'],
  ['Sports', 'M4 13c3-5 13-5 16-5 16 4 0 7-3 9-7'],
  ['Vans', 'M4 8h16v8H4z'],
] as const;

const trustCards = [
  ['Verified Dealers', 'Approved sellers and dealer profiles behind every listing.'],
  ['Secure Transactions', 'Clear contact paths and saved listings for confident decisions.'],
  ['Premium Listings', 'Large images, focused specs, pricing, and dealer details.'],
] as const;

const whyItems = [
  ['Verified Dealers', 'Shop from sellers with real business information and direct contact options.'],
  ['Transparent Pricing', 'Compare asking price, mileage, registration year, and condition quickly.'],
  ['Premium Inventory', 'Find luxury, electric, sport, and family vehicles in one refined place.'],
] as const;

const featuredVehicles = [
  {
    title: 'BMW M5 Competition',
    price: '64,900 EUR',
    location: 'Hamburg',
    mileage: '18,000 km',
    image: '/hero-car.jpg',
  },
  {
    title: 'Porsche Taycan 4S',
    price: '83,900 EUR',
    location: 'Frankfurt',
    mileage: '9,000 km',
    image: '/placeholder-car.jpg',
  },
  {
    title: 'Tesla Model 3 RWD',
    price: 'Financing ready',
    location: 'Berlin',
    mileage: '22,000 km',
    image: '/hero-car.jpg',
  },
] as const;

const brands = [
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Porsche',
  'Tesla',
  'Volkswagen',
] as const;

export default function HomePage() {
  return (
    <main className='bg-[#050608] text-white'>
      <section className='relative min-h-[90vh] overflow-hidden bg-[#050608]'>
        <Image
          src='/brand/carvia-hero-bg.png'
          alt=''
          fill
          priority
          className='object-cover'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-[#050608]/90 via-[#050608]/55 to-transparent' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(212,175,55,0.12),transparent_35%)]' />

        <div className='relative z-10 mx-auto flex min-h-[90vh] max-w-6xl items-center px-6 py-20'>
          <div className='max-w-2xl'>
            <p className='text-xs font-medium uppercase tracking-[0.3em] text-[#F3D675]'>
              Premium Automotive Marketplace
            </p>
            <h1 className='mt-6 text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl'>
              Drive Better Deals.
            </h1>
            <p className='mt-6 max-w-xl text-lg leading-8 text-zinc-200'>
              Discover premium vehicles from trusted dealers across Germany.
              Compare, save, and drive with confidence.
            </p>

            <div className='mt-9 flex flex-col gap-3 sm:flex-row'>
              <Link
                href='/cars'
                className='inline-flex justify-center bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#F3D675]'
              >
                Browse Cars
              </Link>
              <Link
                href='/register'
                className='inline-flex justify-center border border-[#D4AF37]/60 bg-black/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#D4AF37]/10'
              >
                Sell With Carvia
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className='relative z-20 -mt-16 px-6'>
        <form
          action='/cars'
          className='mx-auto grid max-w-6xl gap-3 border border-[#D4AF37]/20 bg-[#0B0D10]/95 p-4 shadow-2xl shadow-black/40 backdrop-blur md:grid-cols-[1fr_1fr_1fr_1fr_auto]'
        >
          <SearchSelect name='brand' label='Make' options={['All Makes', ...brands]} />
          <SearchSelect name='model' label='Model' options={['All Models', 'M5', 'Taycan', 'Model 3', 'A6']} />
          <SearchSelect name='maxPrice' label='Price' options={['Any Price', '50000', '75000', '100000']} />
          <label className='block'>
            <span className='text-xs uppercase tracking-[0.18em] text-zinc-500'>
              Location
            </span>
            <input
              name='location'
              placeholder='Germany'
              className='mt-2 h-12 w-full border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#D4AF37]/70'
            />
          </label>
          <button
            type='submit'
            className='h-12 self-end bg-[#D4AF37] px-7 text-sm font-semibold text-black transition hover:bg-[#F3D675]'
          >
            Search
          </button>
        </form>
      </section>

      <SectionShell eyebrow='Categories' title='Shop by body style'>
        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-6'>
          {categories.map(([label, path]) => (
            <Link
              key={label}
              href={`/cars?category=${encodeURIComponent(label)}`}
              className='group border border-white/10 bg-[#0B0D10] p-5 transition hover:border-[#D4AF37]/60'
            >
              <svg
                viewBox='0 0 24 24'
                className='h-7 w-7 text-[#D4AF37]'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
              >
                <path d={path} />
              </svg>
              <div className='mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-white'>
                {label}
              </div>
            </Link>
          ))}
        </div>
      </SectionShell>

      <SectionShell eyebrow='Trust' title='Built for serious buyers'>
        <div className='grid gap-5 md:grid-cols-3'>
          {trustCards.map(([title, description]) => (
            <LuxuryCard key={title} title={title} description={description} />
          ))}
        </div>
      </SectionShell>

      <SectionShell eyebrow='Why Carvia' title='A cleaner way to buy premium cars'>
        <div className='grid gap-5 md:grid-cols-3'>
          {whyItems.map(([title, description]) => (
            <article key={title} className='border-l border-[#D4AF37] bg-[#0B0D10] p-6'>
              <h3 className='text-lg font-semibold text-white'>{title}</h3>
              <p className='mt-4 text-sm leading-6 text-zinc-400'>{description}</p>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow='Featured Vehicles'
        title='Premium listings worth your time'
        action={<Link href='/cars' className='text-sm font-medium text-[#F3D675]'>View all vehicles</Link>}
      >
        <div className='grid gap-6 md:grid-cols-3'>
          {featuredVehicles.map(vehicle => (
            <article
              key={vehicle.title}
              className='group overflow-hidden border border-white/10 bg-[#0B0D10] transition hover:border-[#D4AF37]/60'
            >
              <div className='relative h-60'>
                <Image
                  src={vehicle.image}
                  alt={vehicle.title}
                  fill
                  className='object-cover transition duration-500 group-hover:scale-[1.03]'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent' />
                <button
                  type='button'
                  aria-label={`Save ${vehicle.title}`}
                  className='absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-[#F3D675] backdrop-blur transition hover:border-[#D4AF37]'
                >
                  <span aria-hidden='true'>♡</span>
                </button>
              </div>
              <div className='p-5'>
                <div className='flex items-start justify-between gap-4'>
                  <h3 className='text-lg font-semibold text-white'>{vehicle.title}</h3>
                  <span className='text-sm font-semibold text-[#F3D675]'>
                    {vehicle.price}
                  </span>
                </div>
                <div className='mt-5 flex items-center justify-between text-sm text-zinc-400'>
                  <span>{vehicle.location}</span>
                  <span>{vehicle.mileage}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <section className='border-b border-white/10 bg-[#050608] px-6 py-12'>
        <div className='mx-auto max-w-6xl'>
          <p className='mb-5 text-sm uppercase tracking-[0.22em] text-[#D4AF37]'>
            Premium Brands
          </p>
          <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-6'>
            {brands.map(brand => (
              <div
                key={brand}
                className='border border-white/10 bg-white/[0.03] px-4 py-5 text-center text-sm font-semibold uppercase tracking-[0.12em] text-zinc-300'
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative overflow-hidden border-b border-[#D4AF37]/20 bg-[#0B0D10] px-6 py-20'>
        <Image
          src='/placeholder-car.jpg'
          alt=''
          fill
          className='object-cover opacity-30'
        />
        <div className='absolute inset-0 bg-gradient-to-r from-[#050608] via-[#050608]/90 to-[#050608]/35' />
        <div className='relative z-10 mx-auto max-w-6xl'>
          <div className='max-w-xl'>
            <p className='text-sm uppercase tracking-[0.22em] text-[#D4AF37]'>
              For Dealers
            </p>
            <h2 className='mt-4 text-4xl font-semibold text-white'>
              Sell More Cars.
              <span className='block text-[#F3D675]'>Reach Serious Buyers.</span>
            </h2>
            <p className='mt-5 text-sm leading-7 text-zinc-300'>
              Present your inventory with premium images, trusted details, and
              a marketplace experience designed for buyers ready to act.
            </p>
            <Link
              href='/register'
              className='mt-8 inline-flex bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#F3D675]'
            >
              Become a Dealer
            </Link>
          </div>
        </div>
      </section>

      <section className='bg-[#050608] px-6 py-20 text-center'>
        <h2 className='text-4xl font-semibold text-white'>
          Ready to find your next drive?
        </h2>
        <Link
          href='/cars'
          className='mt-8 inline-flex bg-[#D4AF37] px-7 py-3 text-sm font-semibold text-black transition hover:bg-[#F3D675]'
        >
          Browse Cars
        </Link>
      </section>

      <footer className='border-t border-white/10 bg-black px-6 py-10'>
        <div className='mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <Image
            src='/brand/carvia-logo-navbar.png'
            alt='Carvia'
            width={180}
            height={64}
            className='h-12 w-auto object-contain'
          />
          <nav className='flex flex-wrap gap-5 text-sm text-zinc-400'>
            {['Cars', 'Services', 'Dealers', 'Company', 'Legal'].map(item => (
              <Link key={item} href={item === 'Cars' ? '/cars' : '#'} className='hover:text-white'>
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}

function SearchSelect({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: readonly string[];
}) {
  return (
    <label className='block'>
      <span className='text-xs uppercase tracking-[0.18em] text-zinc-500'>
        {label}
      </span>
      <select
        name={name}
        defaultValue=''
        className='mt-2 h-12 w-full border border-white/10 bg-black/30 px-4 text-sm text-white outline-none transition focus:border-[#D4AF37]/70'
      >
        {options.map((option, index) => (
          <option key={option} value={index === 0 ? '' : option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function LuxuryCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className='border border-white/10 bg-[#0B0D10] p-6'>
      <div className='flex h-11 w-11 items-center justify-center border border-[#D4AF37]/50 text-[#D4AF37]'>
        <svg
          viewBox='0 0 24 24'
          className='h-5 w-5'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.7'
        >
          <path d='M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7z' />
          <path d='M9 12l2 2 4-5' />
        </svg>
      </div>
      <h3 className='mt-6 text-lg font-semibold text-white'>{title}</h3>
      <p className='mt-4 text-sm leading-6 text-zinc-400'>{description}</p>
    </article>
  );
}

function SectionShell({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className='border-b border-white/10 bg-[#050608] px-6 py-16'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-sm uppercase tracking-[0.22em] text-[#D4AF37]'>
              {eyebrow}
            </p>
            <h2 className='mt-3 text-3xl font-semibold text-white'>{title}</h2>
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  );
}
