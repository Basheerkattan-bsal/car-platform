import { endpoints } from './endpoints';
import { api as browserApi } from './browser';
import type { Car } from '@/types/car';

export type ToggleFavoriteResponse = {
  success: boolean;
  isFavorite: boolean;
  favoritesCount: number;
  message: string;
};

export type MyFavoritesResponse = {
  success: boolean;
  data: Car[];
};

export async function toggleFavoriteBrowser(carId: string) {
  return browserApi<ToggleFavoriteResponse>(endpoints.favorites.toggle(carId), {
    method: 'POST',
  });
}
