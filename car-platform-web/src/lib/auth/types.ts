export type Role = 'buyer' | 'dealer' | 'admin';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type AuthSession = {
  user: AuthUser;
};
