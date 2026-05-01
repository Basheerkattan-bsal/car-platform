import Image from 'next/image';

import { brand } from '@/lib/constants/brand';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

export default function HeroSection() {
  return (
    <section className='relative overflow-hidden bg-[#07090d]'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.14),transparent_28%)]' />

      <div className='absolute inset-0 opacity-10 mix-blend-soft-light'>
        <Image src='/noise.png' alt='' fill className='object-cover' priority />
      </div>

      <Container className='relative z-10 py-16 sm:py-20 lg:py-24'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          <div className='max-w-2xl'>
            <p className='text-sm uppercase tracking-[0.35em] text-zinc-400'>
              Luxury Automotive Marketplace
            </p>

            <h1 className='mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl'>
              {brand.tagline}
            </h1>

            <p className='mt-6 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg'>
              {brand.description}
            </p>

            <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
              <Button href='/cars'>Browse Cars</Button>
              <Button href='/register' variant='secondary'>
                Sell With Carvia
              </Button>
            </div>
          </div>

          <div className='relative'>
            <div className='absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-blue-500/10 via-transparent to-orange-400/10 blur-2xl' />

            <div className='relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl'>
              <div className='absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent' />

              <Image
                src='/hero-car.jpg'
                alt='Luxury performance car featured by Carvia'
                width={1400}
                height={900}
                priority
                className='h-full w-full object-cover'
              />

              <div className='absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6'>
                <div>
                  <p className='text-xs uppercase tracking-[0.3em] text-zinc-300'>
                    Featured Drive
                  </p>
                  <h2 className='mt-2 text-2xl font-semibold text-white'>
                    BMW M5 Competition
                  </h2>
                </div>

                <div className='rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur'>
                  From €64,900
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
