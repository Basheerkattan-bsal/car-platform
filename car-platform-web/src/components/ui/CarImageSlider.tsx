'use client';

// PERMANENT — Image slider for car cards
// Owns: current index state, auto-play, arrow navigation, dot indicators
// Must never own: car data fetching, card layout, action buttons

import { useState, useEffect, useCallback } from 'react';

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:5050';

// Resolves a stored path like /uploads/xyz.jpg into a full URL
// If no image exists, falls back to the Carvia placeholder
function resolveImageSrc(path: string | undefined): string {
  if (!path) return '/carvia.png';
  if (path.startsWith('/uploads')) return `${API_ORIGIN}${path}`;
  return path;
}

type Props = {
  images: string[];
  mainImage?: string;
  alt: string;
};

export default function CarImageSlider({ images, mainImage, alt }: Props) {
  // Build the ordered list: mainImage first, then the rest, deduplicated
  // Array.from(new Set(...)) removes duplicates — e.g. mainImage also appears in images[]
  const orderedImages: string[] =
    images && images.length > 0
      ? Array.from(new Set([...(mainImage ? [mainImage] : []), ...images]))
      : [];

  const hasMultiple = orderedImages.length > 1;

  // currentIndex tracks which image is visible
  // useState<number>(0) — starts at first image
  const [currentIndex, setCurrentIndex] = useState(0);

  // paused becomes true on hover — stops auto-play while user inspects
  const [paused, setPaused] = useState(false);

  // useCallback memoizes the function so the useEffect dependency doesn't
  // create a new reference on every render, which would restart the interval
  const next = useCallback(() => {
    // % wraps back to 0 after the last image — circular navigation
    setCurrentIndex(i => (i + 1) % orderedImages.length);
  }, [orderedImages.length]);

  const prev = useCallback(() => {
    // Adding length before subtracting prevents going negative
    setCurrentIndex(i => (i - 1 + orderedImages.length) % orderedImages.length);
  }, [orderedImages.length]);

  // Auto-play: advances every 3 seconds unless paused or only 1 image
  useEffect(() => {
    if (!hasMultiple || paused) return;

    const interval = setInterval(next, 3000);

    // Cleanup: clears the interval when component unmounts or deps change
    // Without this, old intervals pile up and cause bugs
    return () => clearInterval(interval);
  }, [hasMultiple, paused, next]);

  // No images at all — show branded placeholder
  if (orderedImages.length === 0) {
    return (
      <div className='h-48 w-full overflow-hidden bg-zinc-900'>
        <img
          src='/carvia.png'
          alt='No image available'
          className='h-full w-full object-cover'
        />
      </div>
    );
  }

  return (
    <div
      className='relative h-48 w-full overflow-hidden bg-zinc-900'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Image — switches based on currentIndex */}
      <img
        src={resolveImageSrc(orderedImages[currentIndex])}
        alt={`${alt} — photo ${currentIndex + 1}`}
        className='h-full w-full object-cover transition-opacity duration-300'
      />

      {/* Arrows — only rendered when there are multiple images */}
      {hasMultiple && (
        <>
          <button
            type='button'
            onClick={e => {
              e.preventDefault(); // prevents card link navigation if wrapped in <Link>
              prev();
            }}
            className='absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors'
            aria-label='Previous image'
          >
            {/* Left chevron SVG */}
            <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
            </svg>
          </button>

          <button
            type='button'
            onClick={e => {
              e.preventDefault();
              next();
            }}
            className='absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors'
            aria-label='Next image'
          >
            {/* Right chevron SVG */}
            <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
            </svg>
          </button>

          {/* Dot indicators — one dot per image, filled dot = current */}
          <div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5'>
            {orderedImages.map((_, i) => (
              <button
                key={i}
                type='button'
                onClick={e => {
                  e.preventDefault();
                  setCurrentIndex(i);
                }}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Image counter — top right, e.g. "2 / 5" */}
      {hasMultiple && (
        <div className='absolute top-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white'>
          {currentIndex + 1} / {orderedImages.length}
        </div>
      )}
    </div>
  );
}
