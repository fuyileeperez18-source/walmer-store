// ============================================
// WALMER STORE - TYPE DEFINITIONS
// ============================================

// User Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  role: 'customer' | 'admin' | 'super_admin';
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price?: number;
  cost_per_item?: number;
  sku: string;
  barcode?: string;
  quantity: number;
  track_quantity: boolean;
  continue_selling_when_out_of_stock: boolean;
  category_id: string;
  category?: Category;
  brand?: string;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  is_active: boolean;
  is_featured: boolean;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string;
  position: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  price: number;
  compare_at_price?: number;
  quantity: number;
  options: VariantOption[];
  image_url?: string;
  is_active: boolean;
}

export interface VariantOption {
  name: string; // e.g., "Size", "Color"
  value: string; // e.g., "XL", "Black"
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  position: number;
  is_active: boolean;
  products_count?: number;
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  user_id?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  coupon_code?: string;
}

// Order Types
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  user?: User;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping_cost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  payment_id?: string;
  shipping_address: Address;
  billing_address: Address;
  tracking_number?: string;
  tracking_url?: string;
  notes?: string;
  coupon_code?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product: Product;
  variant_id?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
}

// Payment Types
export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

// Coupon Types
export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_purchase?: number;
  maximum_discount?: number;
  usage_limit?: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

// Review Types
export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user?: User;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
}

// Wishlist Types
export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  added_at: string;
}

// Analytics Types
export interface AnalyticsData {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  average_order_value: number;
  conversion_rate: number;
  top_products: Product[];
  revenue_by_date: { date: string; revenue: number }[];
  orders_by_status: { status: OrderStatus; count: number }[];
}

export interface DashboardMetrics {
  today_revenue: number;
  today_orders: number;
  pending_orders: number;
  low_stock_products: number;
  new_customers_today: number;
  revenue_change: number;
  orders_change: number;
}

// Chat/WhatsApp Types
export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_type: 'user' | 'bot' | 'agent';
  sender_id?: string;
  content: string;
  message_type: 'text' | 'image' | 'product' | 'order' | 'quick_reply';
  metadata?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id?: string;
  user?: User;
  channel: 'website' | 'whatsapp' | 'instagram';
  status: 'active' | 'resolved' | 'pending';
  assigned_to?: string;
  last_message?: ChatMessage;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface QuickReply {
  id: string;
  text: string;
  payload: string;
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  type: 'order' | 'promotion' | 'stock' | 'system';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// Settings Types
export interface StoreSettings {
  store_name: string;
  store_description: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  address: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  currency: string;
  timezone: string;
  tax_rate: number;
  free_shipping_threshold?: number;
  default_shipping_cost: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
}

// Filter Types
export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  sizes?: string[];
  colors?: string[];
  brands?: string[];
  sort_by?: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'rating';
  search?: string;
}

// SEO Types
export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  og_image?: string;
  og_type?: string;
  keywords?: string[];
  structured_data?: Record<string, unknown>;
}
