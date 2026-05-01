import { cookies } from 'next/headers';
import { endpoints } from './endpoints';
import { api as serverApi } from './server';
import type { Car } from '@/types/car';

export type MyFavoritesResponse = {
  success: boolean;
  data: Car[];
};
export async function getMyFavoritesServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  return serverApi<MyFavoritesResponse>(endpoints.favorites.me, {
    headers: token ? { cookie: `access_token=${token}` } : {},
  });
}
