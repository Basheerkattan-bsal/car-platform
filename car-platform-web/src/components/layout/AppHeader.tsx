import AuthStatus from '@/components/auth/AuthStatus';

export default function AppHeader() {
  return (
    <header className='border-b'>
      <div className='mx-auto max-w-5xl px-6 py-4 flex items-center justify-between'>
        <a href='/' className='font-semibold'>
          Car platform
        </a>
        <nav className='flex items-center gap-4'>
          <a className='text-sm underline' href='/cars'>
            Cars
          </a>
          <a className='text-sm underline' href='/services'>
            Services
          </a>
          <AuthStatus />
        </nav>
      </div>
    </header>
  );
}
