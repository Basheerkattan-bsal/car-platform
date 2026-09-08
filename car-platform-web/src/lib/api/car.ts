import { endpoints } from './endpoints';
import { api as browserApi } from './browser';
import { api as serverApi } from './server';
import { Car } from '@/types/car';

export type CarsSearchParams = {
  page?: number;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  minYear?: string;
  maxYear?: string;
  sort?: string;
};

export type CarsListResponse = {
  success: boolean;
  data: [];
  pagination: {
    page: number;
    limit: number;
    totalCars: number;
    totalPages: number;
  };
};

export type CarDetailsResponse = {
  success: boolean;
  data: Car;
  dealerProfile?: {
    companyName?: string;
    phone?: string;
    address?: string;
  } | null;
  similarCars?: Car[];
};

export type BrandsResponse = {
  success: boolean;
  data: string[];
};

function buildCarsQuery(params: CarsSearchParams = {}) {
  const search = new URLSearchParams();

  if (params.page !== undefined) {
    search.set('page', String(params.page));
  }

  if (params.brand) {
    search.set('brand', params.brand);
  }

  if (params.minPrice) {
    search.set('minPrice', params.minPrice);
  }

  if (params.maxPrice) {
    search.set('maxPrice', params.maxPrice);
  }

  if (params.minYear) {
    search.set('minYear', params.minYear);
  }

  if (params.maxYear) {
    search.set('maxYear', params.maxYear);
  }

  if (params.sort) {
    search.set('sort', params.sort);
  }

  const query = search.toString();

  if (!query) {
    return endpoints.cars.list;
  }

  return `${endpoints.cars.list}?${query}`;
}

export async function getCarsServer(params: CarsSearchParams = {}) {
  const path = buildCarsQuery(params);
  return serverApi<CarsListResponse>(path);
}

export async function getCarsBrowser(params: CarsSearchParams = {}) {
  const path = buildCarsQuery(params);
  return browserApi<CarDetailsResponse>(path);
}

export async function getCarByIdServer(id: string) {
  return serverApi<CarDetailsResponse>(endpoints.cars.byId(id));
}

export async function getCarByIdBrowser(id: string) {
  return browserApi<CarDetailsResponse>(endpoints.cars.byId(id));
}

export async function getBrandsServer() {
  return serverApi<BrandsResponse>(endpoints.cars.brands);
}

export async function getBrandsBrowser() {
  return browserApi<BrandsResponse>(endpoints.cars.brands);
}
