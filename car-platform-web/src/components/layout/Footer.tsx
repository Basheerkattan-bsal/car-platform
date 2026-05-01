import Link from 'next/link';

import { brand } from '@/lib/constants/brand';
import Container from '@/components/ui/Container';

const footerLinks = [
  { label: 'Browse Cars', href: '/cars' },
  { label: 'Log In', href: '/login' },
  { label: 'Get Started', href: '/register' },
] as const;

export default function Footer() {
  return (
    <footer className='border-t border-white/10 bg-black'>
      <Container className='flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between'>
        <div className='max-w-md'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-semibold tracking-[0.2em] text-white'>
              CV
            </div>

            <div className='flex flex-col'>
              <span className='text-xs uppercase tracking-[0.35em] text-zinc-500'>
                Luxury Marketplace
              </span>
              <span className='text-lg font-semibold tracking-[0.18em] text-white'>
                {brand.name}
              </span>
            </div>
          </div>

          <p className='mt-4 text-sm leading-6 text-zinc-400'>
            {brand.description}
          </p>
        </div>

        <div className='flex flex-col gap-4 md:items-end'>
          <nav className='flex flex-wrap items-center gap-5'>
            {footerLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className='text-sm text-zinc-400 transition hover:text-white'
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className='text-xs text-zinc-500'>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
