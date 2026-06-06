const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050/api';

type UpdateDealerCarInput = {
  title: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  owner: string;
  condition: string;
  description: string;
  images: string[];
};

export async function updateDealerCarBrowser(
  carId: string,
  payload: UpdateDealerCarInput,
) {
  const res = await fetch(`${API_BASE_URL}/dealer/cars/${carId}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to update car');
  }
  return data;
}

export async function deleteDealerCarBrowser(carId: string) {
  const res = await fetch(`${API_BASE_URL}/dealer/cars/${carId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Failed to delete Car ');
  }

  return data;
}
