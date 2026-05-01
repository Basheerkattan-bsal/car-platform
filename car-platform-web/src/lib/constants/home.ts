import type { Car } from '@/types/car';

export const homeCategories = [
  { label: 'SUVs', href: '/cars?bodyType = SUV' },
  { label: 'Sedans', href: '/cars?bodyType = Sedan' },
  { label: 'Electric', href: '/cars?bodyType= Electric' },
  { label: 'Luxury', href: '/cars?bodyType=Luxury' },
  { label: '2022+', href: '/cars?bodyType=2022' },
] as const;

export const trustItems = [
  {
    title: 'Verified Dealers',
    description: 'Browse vehicles listed by trusted sellers.',
  },
  {
    title: 'Premium Listings',
    description: 'Explore carefully presented cars with rich details.',
  },
  {
    title: 'Smart search',
    description: 'Find cars faster with focused filters and clean browsing.',
  },
] as const;

export const whyChooseItems = [
  {
    title: 'Exceptional Cars',
    description: 'Discover quality vehicles selected for modern buyers.',
  },
  {
    title: 'Guaranteed Clarity',
    description: 'Review pricing, specs, and visuals in a refined experience.',
  },
  {
    title: 'Modern Marketplace',
    description: 'Enjoy a premium platform built for trust and simplicity.',
  },
] as const;

export const featuredCars: Car[] = [
  {
    _id: '1',
    title: 'BMW M5 Competition',
    price: 64900,
    brand: 'BMW',
    model: 'M5 Competition',
    year: 2021,
    mileage: 18000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Hamburg',
    condition: 'Used',
    mainImage: '/hero-car.jpg',
    images: ['/hero-car.jpg'],
    description:
      'High-performance luxury sedan with a refined driving experience.',
  },
  {
    _id: '2',
    title: 'Audi RS7 Sportback',
    price: 71900,
    brand: 'Audi',
    model: 'RS7',
    year: 2022,
    mileage: 22000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: 'Berlin',
    condition: 'Used',
    mainImage: '/hero-car.jpg',
    images: ['/hero-car.jpg'],
    description:
      'A bold grand tourer combining performance, design, and comfort.',
  },
  {
    _id: '3',
    title: 'Mercedes-Benz E 53 AMG',
    price: 58900,
    brand: 'Mercedes-Benz',
    model: 'E 53 AMG',
    year: 2021,
    mileage: 26000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    location: 'Munich',
    condition: 'Used',
    mainImage: '/hero-car.jpg',
    images: ['/hero-car.jpg'],
    description: 'Elegant executive performance with premium cabin refinement.',
  },
  {
    _id: '4',
    title: 'Porsche Taycan 4S',
    price: 83900,
    brand: 'Porsche',
    model: 'Taycan 4S',
    year: 2023,
    mileage: 9000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    location: 'Frankfurt',
    condition: 'Used',
    mainImage: '/hero-car.jpg',
    images: ['/hero-car.jpg'],
    description:
      'All-electric performance and luxury engineered for modern driving.',
  },
];
