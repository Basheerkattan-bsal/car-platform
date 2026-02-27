import Link from 'next/link';

type Props = {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
};

export function Pagination({ page, totalPages, makeHref }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav className='mt-6 flex items-center justify-center gap-2'>
      <Link
        className={`rounded-lg border px-3 py-1 text-sm ${
          page <= 1 ? 'pointer-events-none opacity-40' : ''
        } `}
        href={makeHref(page - 1)}
      >
        Prev
      </Link>

      <span className='px-2 text-sm opacity-70'>
        Page {page} / {totalPages}
      </span>
      <Link
        className={`rounded-lg border px-3 py-1 text-sm ${
          page >= totalPages ? 'pointer-events-none opacity-40' : ''
        }`}
        href={makeHref(page + 1)}
      >
        Next
      </Link>
    </nav>
  );
}
