const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050/api';

type UpdateDealerCarInput = {
  title: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  owner: 'Dealer' | 'Private';
  condition: string;
  description: 'Smoker' | 'Non-Smoker';
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

export async function uploadCarImagesBrowser(carId: string, files: File[]) {
  const formData = new FormData();

  // Append each file under the key 'images' — multer on the server reads this key
  for (const file of files) {
    formData.append('images', file);
  }

  const res = await fetch(`${API_BASE_URL}/dealer/cars/${carId}/images`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to upload images');
  }

  return data.data;
}

export async function deleteCarImageBrowser(carId: string, imageUrl: string) {
  const res = await fetch(`${API_BASE_URL}/dealer/cars/${carId}/images`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: imageUrl }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to delete image');
  }

  return data.data; // returns updated Car object
}

export async function setCarMainImageBrowser(carId: string, imageUrl: string) {
  const res = await fetch(`${API_BASE_URL}/dealer/cars/${carId}/main-image`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: imageUrl }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to set main image');
  }

  return data.data; // returns updated Car object
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
