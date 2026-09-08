type Props = {
  label: string;
  value: number;
  description: string;
};

export default function DealerStatCard({ label, value, description }: Props) {
  return (
    <article className='rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
      <p className='text-sm font-medium text-zinc-500'>{label}</p>

      <p className='mt-3 text-4xl font-bold text-zinc-950'>{value}</p>

      <p className='mt-2 text-sm text-zinc-600'>{description}</p>
    </article>
  );
}
