export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  city?: string;
  description?: string;
  telegram_id?: string;
  role: 'user' | 'seller' | 'admin';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  car_count?: number;
}

export interface CarImage {
  id: string;
  url: string;
  is_primary: boolean;
  order_index: number;
}

export interface Car {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  category_id?: string;
  fuel_type?: 'benzin' | 'dizel' | 'gaz' | 'elektro' | 'gibrid';
  transmission?: 'avtomat' | 'mexanik';
  body_type?: 'sedan' | 'hetchbek' | 'universall' | 'krossover' | 'dzhip' | 'pikap' | 'miniven' | 'kabriolet';
  color?: string;
  engine_volume?: number;
  mileage?: number;
  city: string;
  status: 'active' | 'sold' | 'inactive' | 'pending';
  views: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  profiles?: User;
  categories?: Category;
  car_images?: CarImage[];
  is_favorite?: boolean;
}

export interface Favorite {
  id: string;
  car_id: string;
  user_id: string;
  created_at: string;
  car?: Car;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface Filters {
  category_id?: string;
  brand?: string;
  model?: string;
  year_from?: number;
  year_to?: number;
  price_from?: number;
  price_to?: number;
  fuel_type?: string;
  transmission?: string;
  body_type?: string;
  color?: string;
  city?: string;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchFilters extends Filters {
  q?: string;
  min_mileage?: number;
  max_mileage?: number;
  engine_from?: number;
  engine_to?: number;
}
