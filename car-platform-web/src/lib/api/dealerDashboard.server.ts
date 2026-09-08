import { cookies } from 'next/headers';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050/api';

export type DealerDashboardStats = {
  totalCars: number;
  publishedCars: number;
  draftCars: number;
};

export async function getDealerDashboardStatsServer(): Promise<DealerDashboardStats> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await fetch(`${API_BASE_URL}/dealers/me/stats`, {
    method: 'GET',
    headers: {
      Cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to fetch dealer dashboard stats');
  }

  const stats = data.data ?? data.stats ?? data;

  return {
    totalCars: stats.totalCars ?? 0,
    publishedCars: stats.publishedCars ?? 0,
    draftCars: stats.draftCars ?? 0,
  };
}
