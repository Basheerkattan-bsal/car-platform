'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import type { Car } from '@/types/car';
import {
  uploadCarImagesBrowser,
  deleteCarImageBrowser,
  setCarMainImageBrowser,
} from '@/lib/api/dealerCars.browser';

const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_ORIGIN || 'http://localhost:5050';

type Props = {
  car: Car;
  onImagesUpdated?: (car: Car) => void;
};

export default function DealerCarImagesManager({
  car,
  onImagesUpdated,
}: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [images, setImages] = useState<string[]>(car.images || []);
  const [mainImage, setMainImage] = useState(car.mainImage);
  const [dragOver, setDragOver] = useState(false);

  function getImageSrc(imagePath: string) {
    return imagePath.startsWith('/uploads')
      ? `${API_ORIGIN}${imagePath}`
      : imagePath;
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  async function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const fileArray = Array.from(files);

      // Validate files
      const maxSize = 5 * 1024 * 1024; // 5MB
      for (const file of fileArray) {
        if (!file.type.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }
        if (file.size > maxSize) {
          throw new Error(`Image size must be less than 5MB`);
        }
      }

      const result = await uploadCarImagesBrowser(car._id, fileArray);

      setImages(result.images || []);
      if (result.mainImage && !mainImage) {
        setMainImage(result.mainImage);
      }

      setSuccess(`${fileArray.length} image(s) uploaded successfully`);

      if (onImagesUpdated) {
        onImagesUpdated(result);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  async function handleDeleteImage(imageUrl: string) {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const result = await deleteCarImageBrowser(car._id, imageUrl);

      setImages(result.images || []);
      if (mainImage === imageUrl) {
        setMainImage(result.mainImage);
      }

      setSuccess('Image deleted successfully');
      if (onImagesUpdated) {
        onImagesUpdated(result);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    } finally {
      setLoading(false);
    }
  }

  async function handleSetMainImage(imageUrl: string) {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const result = await setCarMainImageBrowser(car._id, imageUrl);

      setMainImage(result.mainImage);
      setSuccess('Main image updated successfully');
      if (onImagesUpdated) {
        onImagesUpdated(result);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set main image');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
      {/* Header */}
      <div>
        <h2 className='text-2xl font-semibold text-zinc-950'>
          Manage Car Images
        </h2>
        <p className='mt-1 text-sm text-zinc-600'>
          Upload, organize, and set your car's images
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
          {error}
        </div>
      )}

      {success && (
        <div className='rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700'>
          {success}
        </div>
      )}

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? 'border-blue-400 bg-blue-50' : 'border-zinc-300 bg-zinc-50'
        } ${loading ? 'opacity-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type='file'
          multiple
          accept='image/*'
          onChange={e => handleFileSelect(e.target.files)}
          disabled={loading}
          className='hidden'
        />

        <div className='space-y-2'>
          <p className='text-sm font-medium text-zinc-900'>
            Drag images here or click to select
          </p>
          <p className='text-xs text-zinc-600'>
            PNG, JPG, GIF up to 5MB. Multiple files allowed.
          </p>
        </div>

        <button
          type='button'
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className='mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50'
        >
          {loading ? 'Uploading...' : 'Select Images'}
        </button>
      </div>

      {/* Images Grid */}
      <div>
        <h3 className='mb-4 text-lg font-semibold text-zinc-950'>
          Images ({images.length})
        </h3>

        {images.length === 0 ? (
          <div className='rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center'>
            <p className='text-sm text-zinc-600'>No images uploaded yet</p>
          </div>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {images.map(imageUrl => {
              const imageSrc = getImageSrc(imageUrl);
              const isMainImage = mainImage === imageUrl;

              return (
                <div
                  key={imageUrl}
                  className={`group relative overflow-hidden rounded-lg border-2 transition-colors ${
                    isMainImage
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-zinc-200'
                  }`}
                >
                  {/* Image */}
                  <div className='relative aspect-square w-full bg-zinc-100'>
                    <img
                      src={imageSrc}
                      alt='Car image'
                      className='h-full w-full object-cover'
                    />
                  </div>

                  {/* Overlay */}
                  <div className='absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40' />

                  {/* Main Image Badge */}
                  {isMainImage && (
                    <div className='absolute top-2 left-2 rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white'>
                      Main
                    </div>
                  )}

                  {/* Actions */}
                  <div className='absolute inset-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100'>
                    <button
                      type='button'
                      onClick={() => handleSetMainImage(imageUrl)}
                      disabled={loading || isMainImage}
                      className='flex-1 rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 disabled:opacity-50'
                    >
                      {isMainImage ? 'Main' : 'Set Main'}
                    </button>

                    <button
                      type='button'
                      onClick={() => handleDeleteImage(imageUrl)}
                      disabled={loading}
                      className='flex-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600 disabled:opacity-50'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className='border-t border-zinc-200 pt-6'>
        <button
          type='button'
          onClick={() => router.push('/dealer/cars')}
          className='w-full rounded-xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800'
        >
          Save and back to menu
        </button>
      </div>
    </div>
  );
}
