export type Category = 'dona-bowls' | 'tissue-papers';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  size: string;
  image_url: string;
  price: number; // base price per packet
  stock: number;
  active: boolean;
  created_at: string;
  bulk_pricing?: BulkTier[];
}

export interface BulkTier {
  id?: string;
  product_id: string;
  min_qty: number;
  max_qty: number | null;
  unit_price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unit_price: number; // effective price after bulk tier
  tier_label?: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'verification_pending';
export type PaymentMethod = 'razorpay' | 'cod' | 'upi_qr';

export interface Order {
  id: string;
  user_id: string;
  customer_name?: string;
  total: number;
  discount: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  created_at: string;
  utr_number?: string;
  order_items?: OrderItem[];
  profiles?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  qty: number;
  unit_price: number;
  product?: Product;
}

export interface Payment {
  id: string;
  order_id: string;
  gateway_ref: string;
  amount: number;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  refunded_amount: number;
  created_at: string;
}

export type EventType = 
  | 'page_view' 
  | 'product_view' 
  | 'add_to_cart' 
  | 'checkout_started' 
  | 'login' 
  | 'register' 
  | 'order_placed';

export interface TrackingEvent {
  id?: string;
  session_id: string;
  user_id: string | null;
  type: EventType;
  metadata: Record<string, unknown>;
  created_at?: string;
}

export interface AdminKPI {
  label: string;
  value: string | number;
  change?: number;
  icon: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  business_name?: string;
  city?: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  verified_buyer: boolean;
  order_id?: string;
  created_at: string;
}
