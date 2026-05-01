import Link from 'next/link';

import CarCard from '@/components/cars/CarCard';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { featuredCars } from '@/lib/constants/home';

export default function FeaturedCarsSection() {
  return (
    <section className='bg-[#07090d] py-16 sm:py-20'>
      <Container>
        <div className='flex flex-col gap-8'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
            <SectionHeading
              title='Featured Cars'
              subtitle='Explore curated selection of premium vehicles available now on Carvia.'
            />

            <Link
              href='/cars'
              className='text-sm font-medium text zinc-300 transition hover:text-white'
            >
              View All Cars
            </Link>
          </div>

          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
            {featuredCars.map(car => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
