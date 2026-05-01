import Link from 'next/link';

import { brand } from '@/lib/constants/brand';
import Button from '@/components/ui/Button';
import Container from '../ui/Container';

const navLinks = [
  { label: 'Browse Cars', href: '/car' },
  { label: 'For Dealers', href: '/dealers' },
  { label: 'How it works', href: '/how-it-works' },
] as const;

export default function Navbar() {
  return (
    <header className='sticky top-0 z-50 border-white/10 bg-black/30 backdrop-blur-md'>
      <Container className='flex min-h-20 items-center justify-between gap-6'>
        <Link href='/' className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-semibold tracking-[0.2em] text-white'>
            CV
          </div>

          <div className='flex flex-col'>
            <span className='text-xs uppercase tracking-[0.35em] text-zinc-400'>
              Luxury Marketplace
            </span>
            <span className=' text-lg font-semibold tracking-[0.18em] text-white'>
              {brand.name}
            </span>
          </div>
        </Link>

        <nav className='hidden items-center gap-8 md:flex'>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className='text-sm font-medium text-zinc-300 transition hover:text-white'
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className='hidden items-center gap-3 md:flex'>
          <Link
            href='/login'
            className='text-sm font-medium text-zinc-300 transition hover:text-white'
          >
            Log in
          </Link>
          <Button href='register'>Get Started</Button>
        </div>
      </Container>
    </header>
  );
}
