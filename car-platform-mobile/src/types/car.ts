export type Car = {
  _id: string;
  title: string;
  price: number;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  description?: string;
  mainImage?: string;
  images?: string[];
  isPublished?: boolean;
};
