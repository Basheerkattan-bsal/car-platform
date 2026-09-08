// ?The file defines the frontend admin contract

export type AdminDealerStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended';

export type AdminDealerUser = {
  _id: string;
  name: string;
  email: string;
  role: 'dealer';
};

export type AdminDealerProfile = {
  _id: string;
  user: AdminDealerUser;
  companyName: string;
  phone?: string;
  address?: string;
  status: AdminDealerStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminStats = {
  totalUsers: number;
  totalDealers: number;
  pendingDealers: number;
  approvedDealers: number;
  rejectedDealers: number;
  totalCars: number;
};
