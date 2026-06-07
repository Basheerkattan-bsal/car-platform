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

// PERMANENT — uploads one or more image files to a car's image collection
// Uses FormData (multipart/form-data) because JSON cannot carry binary file data
export async function uploadCarImagesBrowser(carId: string, files: File[]) {
  const formData = new FormData();

  // Append each file under the key 'images' — multer on the server reads this key
  for (const file of files) {
    formData.append('images', file);
  }

  // NOTE: Do NOT set Content-Type header manually.
  // When you pass FormData, the browser sets it automatically including the boundary string.
  // Setting it manually breaks multipart parsing on the server.
  const res = await fetch(`${API_BASE_URL}/dealer/cars/${carId}/images`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to upload images');
  }

  return data.data; // returns updated Car object
}

// PERMANENT — removes a single image from a car by its URL path
// The image URL is sent in the request body as JSON (DELETE with a body is valid HTTP)
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

// PERMANENT — sets which image is the main/cover image for the car
// Sends the image URL in the body; server validates it exists in car.images first
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
