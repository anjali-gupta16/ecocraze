import { supabase } from './supabase';
import { SEED_PRODUCTS } from './productsData';
import { safeUUID } from './uuid';
import type { Product, Order, OrderItem, TrackingEvent, BulkTier } from '../types';

const LOCAL_PRODUCTS_KEY = 'pc_local_products';
const LOCAL_ORDERS_KEY = 'pc_local_orders';
const LOCAL_EVENTS_KEY = 'pc_local_events';

// Initialize local storage products if not present
function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_PRODUCTS;
  }
}

function saveLocalProducts(products: Product[]) {
  try {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving local products', e);
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const hasConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (hasConfig) {
      const { data, error } = await supabase
        .from('products')
        .select('*, bulk_pricing(*)')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    }
  } catch (err) {
    console.warn('Could not reach Supabase for products, using local fallback:', err);
  }
  return getLocalProducts();
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === id) || null;
}

export async function saveProduct(product: Partial<Product> & { name: string; category: any; price: number }): Promise<Product> {
  const isEdit = Boolean(product.id);
  const productId = product.id || safeUUID();

  const newProduct: Product = {
    id: productId,
    name: product.name,
    description: product.description || '',
    category: product.category,
    size: product.size || '',
    image_url: product.image_url || '/paper-plates-collection.png',
    price: Number(product.price),
    stock: Number(product.stock || 0),
    active: product.active !== undefined ? product.active : true,
    created_at: product.created_at || new Date().toISOString(),
    bulk_pricing: product.bulk_pricing || [
      { product_id: productId, min_qty: 1, max_qty: 9, unit_price: Number(product.price) },
      { product_id: productId, min_qty: 10, max_qty: 49, unit_price: Math.round(Number(product.price) * 0.88) },
      { product_id: productId, min_qty: 50, max_qty: null, unit_price: Math.round(Number(product.price) * 0.78) },
    ],
  };

  // Try Supabase
  try {
    const hasConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (hasConfig) {
      if (isEdit) {
        await supabase.from('products').update({
          name: newProduct.name,
          description: newProduct.description,
          category: newProduct.category,
          size: newProduct.size,
          image_url: newProduct.image_url,
          price: newProduct.price,
          stock: newProduct.stock,
          active: newProduct.active,
        }).eq('id', productId);
      } else {
        await supabase.from('products').insert({
          id: productId,
          name: newProduct.name,
          description: newProduct.description,
          category: newProduct.category,
          size: newProduct.size,
          image_url: newProduct.image_url,
          price: newProduct.price,
          stock: newProduct.stock,
          active: newProduct.active,
        });
      }
    }
  } catch (e) {
    console.warn('Supabase product sync warning:', e);
  }

  // Always update local storage
  const current = getLocalProducts();
  const updated = isEdit
    ? current.map((p) => (p.id === productId ? newProduct : p))
    : [newProduct, ...current];
  saveLocalProducts(updated);

  return newProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const hasConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (hasConfig) {
      await supabase.from('products').delete().eq('id', id);
    }
  } catch (e) {
    console.warn('Supabase product delete warning:', e);
  }

  const current = getLocalProducts();
  saveLocalProducts(current.filter((p) => p.id !== id));
  return true;
}

// ----------------- ORDERS -----------------

export function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalOrders(orders: Order[]) {
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving local orders', e);
  }
}

export async function createOrder(orderPayload: {
  user_id?: string | null;
  customer_name: string;
  total: number;
  discount: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  payment_method: 'razorpay' | 'cod' | 'upi_qr';
  payment_status: 'pending' | 'paid';
  items: { product: Product; quantity: number; unit_price: number }[];
}): Promise<Order> {
  const orderId = safeUUID();
  const order: Order = {
    id: orderId,
    user_id: orderPayload.user_id || 'guest-user',
    total: orderPayload.total,
    discount: orderPayload.discount,
    address: orderPayload.address,
    city: orderPayload.city,
    state: orderPayload.state,
    pincode: orderPayload.pincode,
    phone: orderPayload.phone,
    order_status: 'confirmed',
    payment_status: orderPayload.payment_status,
    payment_method: orderPayload.payment_method,
    created_at: new Date().toISOString(),
    order_items: orderPayload.items.map((i) => ({
      id: safeUUID(),
      order_id: orderId,
      product_id: i.product.id,
      qty: i.quantity,
      unit_price: i.unit_price,
      product: i.product,
    })),
  };

  // Try saving to Supabase
  try {
    const hasConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (hasConfig) {
      await supabase.from('orders').insert({
        id: order.id,
        user_id: orderPayload.user_id || null,
        total: order.total,
        discount: order.discount,
        address: order.address,
        city: order.city,
        state: order.state,
        pincode: order.pincode,
        phone: order.phone,
        order_status: order.order_status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
      });

      // Insert items
      const itemsToInsert = orderPayload.items.map((i) => ({
        id: safeUUID(),
        order_id: order.id,
        product_id: i.product.id,
        qty: i.quantity,
        unit_price: i.unit_price,
      }));
      await supabase.from('order_items').insert(itemsToInsert);

      // Insert payment record
      await supabase.from('payments').insert({
        id: safeUUID(),
        order_id: order.id,
        gateway_ref:
          order.payment_method === 'upi_qr'
            ? `UPI_ANSHUMAN_${order.id.slice(0, 8).toUpperCase()}`
            : order.payment_method === 'razorpay'
            ? `pay_${order.id.slice(0, 8)}`
            : 'COD',
        amount: order.total,
        status: order.payment_status === 'paid' ? 'success' : 'pending',
        refunded_amount: 0,
      });
    }
  } catch (e) {
    console.warn('Supabase order creation warning:', e);
  }

  // Save to local storage for instant sync and offline reliability
  const currentOrders = getLocalOrders();
  saveLocalOrders([order, ...currentOrders]);

  return order;
}
export async function getOrders(userId?: string): Promise<Order[]> {
  const local = getLocalOrders();
  try {
    const hasConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (hasConfig) {
      let query = supabase.from('orders').select('*, order_items(*, product:products(*))').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const map = new Map<string, Order>();
        local.forEach((o) => map.set(o.id, o));
        (data as Order[]).forEach((o) => {
          if (!map.has(o.id)) map.set(o.id, o);
        });
        const combined = Array.from(map.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        if (userId) return combined.filter((o) => o.user_id === userId);
        return combined;
      }
    }
  } catch (e) {
    console.warn('Supabase fetch orders warning:', e);
  }

  if (userId) {
    return local.filter((o) => o.user_id === userId);
  }
  return local;
}

export async function updateOrder(
  orderId: string,
  updates: Partial<Pick<Order, 'order_status' | 'payment_status'>>
): Promise<boolean> {
  try {
    const hasConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (hasConfig) {
      await supabase.from('orders').update(updates).eq('id', orderId);
    }
  } catch (e) {
    console.warn('Supabase update order warning:', e);
  }

  const local = getLocalOrders();
  saveLocalOrders(
    local.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
  );
  return true;
}

// ----------------- EVENTS (TRACKING) -----------------

export function getLocalEvents(): TrackingEvent[] {
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalEvent(event: TrackingEvent) {
  try {
    const events = getLocalEvents();
    // Keep max 500 events
    const updated = [event, ...events].slice(0, 500);
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving local event', e);
  }
}
