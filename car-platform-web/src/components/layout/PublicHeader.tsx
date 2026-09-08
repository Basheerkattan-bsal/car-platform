import Image from 'next/image';
import Link from 'next/link';

export default function PublicHeader() {
  return (
    <header className='border-b border-[#d4af37]/20 bg-[#080909] text-white'>
      <div className='mx-auto flex h-20 max-w-6xl items-center justify-between px-6'>
        <Link href='/' className='flex shrink-0 items-center'>
          <Image
            src='/brand/carvia-logo-navbar-5.png'
            alt='Carvia'
            width={240}
            height={80}
            priority
            className='h-16 w-auto object-contain'
          />
        </Link>

        <nav className='flex items-center gap-4 text-sm'>
          <Link href='/cars' className='text-zinc-300 hover:text-[#f3d675]'>
            Cars
          </Link>

          <Link href='/services' className='text-zinc-300 hover:text-[#f3d675]'>
            Services
          </Link>

          <Link href='/login' className='text-zinc-300 hover:text-[#f3d675]'>
            Login
          </Link>

          <Link
            href='/register'
            className='border border-[#d4af37]/50 px-4 py-2 text-[#f3d675] hover:bg-[#d4af37]/10'
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
