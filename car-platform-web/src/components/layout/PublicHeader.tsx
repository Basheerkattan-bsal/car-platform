import Link from 'next/link';

export default function PublicHeader() {
  return (
    <header className='border-b'>
      <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
        <Link href='/' className='text-lg font-semibold'>
          Carvia
        </Link>

        <nav className='flex items-center gap-4 text-sm'>
          <Link href='/services' className='underline'>
            Services
          </Link>

          <Link href='/login' className='underline'>
            Login
          </Link>

          <Link href='/register' className='underline'>
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
}
