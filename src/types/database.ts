// Sorena Marketplace Database Types

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type DiscountType = 'percentage' | 'fixed';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type UserRole = 'customer' | 'admin' | 'super_admin';

export interface Category {
  id: string;
  name: string;
  name_fa: string;
  slug: string;
  description?: string;
  icon?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Technology {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  title_fa: string;
  slug: string;
  description?: string;
  description_fa?: string;
  short_description?: string;
  short_description_fa?: string;
  price: number;
  discount_price?: number;
  discount_percent?: number;
  category_id?: string;
  difficulty_level: DifficultyLevel;
  thumbnail_url?: string;
  preview_images?: string[];
  demo_url?: string;
  documentation_url?: string;
  video_tutorial_url?: string;
  source_code_url?: string;
  version: string;
  sales_count: number;
  view_count: number;
  rating_average: number;
  rating_count: number;
  is_featured: boolean;
  is_active: boolean;
  support_duration_months: number;
  includes_source_code: boolean;
  includes_documentation: boolean;
  includes_database: boolean;
  includes_video_tutorial: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // Relations
  category?: Category;
  technologies?: Technology[];
}

export interface ProductFile {
  id: string;
  product_id: string;
  file_name: string;
  file_type: string;
  file_size?: number;
  file_url: string;
  is_main: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  total: number;
  payment_method?: string;
  payment_status: PaymentStatus;
  payment_reference?: string;
  discount_code?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Relations
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  price: number;
  discount_price?: number;
  license_key?: string;
  created_at: string;
  // Relations
  product?: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string;
  rating: number;
  title?: string;
  content?: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  user?: {
    name?: string;
    avatar_url?: string;
  };
}

export interface ProductQuestion {
  id: string;
  product_id: string;
  user_id?: string;
  question: string;
  answer?: string;
  answered_by?: string;
  answered_at?: string;
  is_public: boolean;
  created_at: string;
}

export interface Favorite {
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  // Relations
  product?: Product;
}

export interface DiscountCode {
  id: string;
  code: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number;
  min_purchase?: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id?: string;
  order_id?: string;
  product_id?: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
  // Relations
  messages?: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  user_id?: string;
  message: string;
  is_admin_reply: boolean;
  created_at: string;
}

export interface UserRoleRecord {
  user_id: string;
  role: UserRole;
  created_at: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  category?: string;
  technology?: string;
  difficulty?: DifficultyLevel;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'newest' | 'popular' | 'price_low' | 'price_high' | 'rating';
}
