const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050/api';

export type CreateDealerProfileInput = {
  companyName: string;
  phone: string;
  address?: string;
};

export type DealerProfileResponse = {
  _id?: string;
  id?: string;
  companyName?: string;
  phone?: string;
  address?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'suspended';
};

export async function createDealerProfileBrowser(
  payload: CreateDealerProfileInput
): Promise<DealerProfileResponse> {
  const res = await fetch(`${API_BASE_URL}/dealers/profile`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'Failed to create dealer profile');
  }

  return data.data ?? data;
}
