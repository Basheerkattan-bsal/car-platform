type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
};

export default function SectionHeading({
  title,
  subtitle,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const alignmentClasses =
    align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-2xl ${alignmentClasses} ${className}`}>
      <h2 className='text-3xl font-semibold tracking-right text-white sm:text-4xl'>
        {title}
      </h2>

      {subtitle ? (
        <p className='mt-4 text-sm leading-6 text-zinc-300 sm:text-base'>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
