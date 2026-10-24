import { supabase } from './supabase';
import { SEED_PRODUCTS } from './productsData';
import { safeUUID } from './uuid';
import type { Product, Order, OrderItem, TrackingEvent, BulkTier, CustomerReview, CustomerVisit } from '../types';

const LOCAL_PRODUCTS_KEY = 'pc_local_products_v12';
const LOCAL_ORDERS_KEY = 'pc_local_orders';
const LOCAL_EVENTS_KEY = 'pc_local_events';
const LOCAL_USED_UTRS_KEY = 'pc_used_utrs';
const LOCAL_REVIEWS_KEY = 'pc_customer_reviews';
const LOCAL_CUSTOMER_VISITS_KEY = 'pc_customer_visits';

// ----------------- UTR DEDUPLICATION -----------------

export function getUsedUTRs(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_USED_UTRS_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    // Also include any UTRs present in existing orders
    const orders = getLocalOrders();
    orders.forEach((o) => {
      if (o.utr_number) {
        const norm = o.utr_number.trim().toUpperCase();
        if (!list.includes(norm)) list.push(norm);
      }
    });
    return list;
  } catch {
    return [];
  }
}

function addUsedUTR(utr: string) {
  try {
    const utrs = getUsedUTRs();
    const normalized = utr.trim().toUpperCase();
    if (!utrs.includes(normalized)) {
      utrs.push(normalized);
      localStorage.setItem(LOCAL_USED_UTRS_KEY, JSON.stringify(utrs));
    }
  } catch (e) {
    console.error('Error saving used UTR', e);
  }
}

export function isUTRUsed(utr: string): boolean {
  const normalized = utr.trim().toUpperCase();
  return getUsedUTRs().includes(normalized);
}

// Initialize local storage products and auto-heal stale/broken cached products
function getLocalProducts(): Product[] {
  try {
    // Purge outdated caches from earlier versions
    ['pc_local_products', 'pc_local_products_v1', 'pc_local_products_v2', 'pc_local_products_v3', 'pc_local_products_v4', 'pc_local_products_v5', 'pc_local_products_v6', 'pc_local_products_v7', 'pc_local_products_v8', 'pc_local_products_v9', 'pc_local_products_v10', 'pc_local_products_v11'].forEach((k) => {
      try { localStorage.removeItem(k); } catch {}
    });

    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }

    const parsed: Product[] = JSON.parse(raw);
    // If any product still has old unsplash URLs or missing images, force refresh from SEED_PRODUCTS
    const hasStaleImages = !Array.isArray(parsed) || parsed.length === 0 || parsed.some(
      (p) => !p.image_url || p.image_url.includes('unsplash.com')
    );

    if (hasStaleImages) {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }

    return parsed;
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
    image_url: product.image_url || '/products/colorful-dona-bowls.jpg',
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

const SEED_ORDERS: Order[] = [
  // 1. Anjali Gupta - Gupta Eco Disposables (Total ₹54,000 across 8 orders)
  {
    id: 'ord-eco-ag-001',
    user_id: 'anjali.gupta.ashok16@gmail.com',
    customer_name: 'Anjali Gupta',
    customer_email: 'anjali.gupta.ashok16@gmail.com',
    total: 28600,
    discount: 1400,
    address: '42, Industrial Estate, Phase 2',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    pincode: '208012',
    phone: '7676349773',
    order_status: 'delivered',
    payment_status: 'paid',
    payment_method: 'upi_qr',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    utr_number: 'UPI983104928174',
    order_items: [
      {
        id: 'item-ag-1',
        order_id: 'ord-eco-ag-001',
        product_id: '22222222-2222-2222-2222-222222220001',
        qty: 500,
        unit_price: 22.00,
        product: {
          id: '22222222-2222-2222-2222-222222220001',
          name: '6-Inch Deep Paper Dona Bowls (Assorted Colors)',
          description: 'Deep wall food-grade paper dona bowls',
          category: 'dona-bowls',
          size: '6 Inch / 250ml (Pack of 100)',
          image_url: '/products/colorful-dona-bowls.jpg',
          price: 30.00,
          stock: 800,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'item-ag-2',
        order_id: 'ord-eco-ag-001',
        product_id: '33333333-3333-3333-3333-333333330003',
        qty: 200,
        unit_price: 65.00,
        product: {
          id: '33333333-3333-3333-3333-333333330003',
          name: 'Pop-Up Interfold Tabletop Tissue Napkins',
          description: 'Touchless one-at-a-time pull tissues',
          category: 'tissue-papers',
          size: 'Interfold (Pack of 150)',
          image_url: '/products/interfold-tissues.jpg',
          price: 90.00,
          stock: 450,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'item-ag-3',
        order_id: 'ord-eco-ag-001',
        product_id: '22222222-2222-2222-2222-222222220002',
        qty: 210,
        unit_price: 22.00,
        product: {
          id: '22222222-2222-2222-2222-222222220002',
          name: '4-Inch Golden Paper Dona Bowls',
          description: 'Traditional golden kraft paper dona bowls',
          category: 'dona-bowls',
          size: '4 Inch (Pack of 100)',
          image_url: '/products/golden-dona-bowls.jpg',
          price: 30.00,
          stock: 650,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
    ],
  },
  {
    id: 'ord-eco-ag-002',
    user_id: 'anjali.gupta.ashok16@gmail.com',
    customer_name: 'Anjali Gupta',
    customer_email: 'anjali.gupta.ashok16@gmail.com',
    total: 25400,
    discount: 1600,
    address: '42, Industrial Estate, Phase 2',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    pincode: '208012',
    phone: '7676349773',
    order_status: 'confirmed',
    payment_status: 'paid',
    payment_method: 'upi_qr',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    utr_number: 'UPI983109283741',
    order_items: [
      {
        id: 'item-ag-4',
        order_id: 'ord-eco-ag-002',
        product_id: '33333333-3333-3333-3333-333333330004',
        qty: 120,
        unit_price: 99.00,
        product: {
          id: '33333333-3333-3333-3333-333333330004',
          name: 'Heavy Duty Multi-Purpose Kitchen Paper Towel Rolls',
          description: 'Perforated extra absorbent paper kitchen roll',
          category: 'tissue-papers',
          size: 'Twin Roll Pack (120 Pulls)',
          image_url: '/products/kitchen-paper-towel.jpg',
          price: 135.00,
          stock: 310,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'item-ag-5',
        order_id: 'ord-eco-ag-002',
        product_id: '22222222-2222-2222-2222-222222220003',
        qty: 300,
        unit_price: 45.00,
        product: {
          id: '22222222-2222-2222-2222-222222220003',
          name: '4-Inch Chutney, Dahi & Dessert Paper Dona',
          description: 'Compact deep round cups for chutneys and snacks',
          category: 'dona-bowls',
          size: '4 Inch / 100ml (Pack of 100)',
          image_url: '/products/chutney-dona-cups.jpg',
          price: 65.00,
          stock: 950,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
    ],
  },

  // 2. Ananya Deshmukh - Desi Bowls Cafe (Total ₹28,500 across 5 orders)
  {
    id: 'ord-eco-ad-001',
    user_id: 'procurement@desibowls.in',
    customer_name: 'Ananya Deshmukh',
    customer_email: 'procurement@desibowls.in',
    total: 28500,
    discount: 1200,
    address: 'Shop 12, Food Court, MG Road',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226001',
    phone: '6306784568',
    order_status: 'delivered',
    payment_status: 'paid',
    payment_method: 'upi_qr',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    utr_number: 'UPI882910394812',
    order_items: [
      {
        id: 'item-ad-1',
        order_id: 'ord-eco-ad-001',
        product_id: '22222222-2222-2222-2222-222222220003',
        qty: 350,
        unit_price: 45.00,
        product: {
          id: '22222222-2222-2222-2222-222222220003',
          name: '4-Inch Chutney, Dahi & Dessert Paper Dona',
          description: 'Compact deep round cups for chutneys and sauces',
          category: 'dona-bowls',
          size: '4 Inch / 100ml (Pack of 100)',
          image_url: '/products/chutney-dona-cups.jpg',
          price: 65.00,
          stock: 950,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'item-ad-2',
        order_id: 'ord-eco-ad-001',
        product_id: '22222222-2222-2222-2222-222222220001',
        qty: 420,
        unit_price: 22.00,
        product: {
          id: '22222222-2222-2222-2222-222222220001',
          name: '6-Inch Deep Paper Dona Bowls (Assorted Colors)',
          description: 'Deep wall food-grade paper dona bowls',
          category: 'dona-bowls',
          size: '6 Inch / 250ml (Pack of 100)',
          image_url: '/products/colorful-dona-bowls.jpg',
          price: 30.00,
          stock: 800,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'item-ad-3',
        order_id: 'ord-eco-ad-001',
        product_id: '33333333-3333-3333-3333-333333330002',
        qty: 500,
        unit_price: 7.00,
        product: {
          id: '33333333-3333-3333-3333-333333330002',
          name: 'TOP Tissue Paper Napkins (22x22 cm)',
          description: 'Standard 22x22 cm single fold tissue napkins',
          category: 'tissue-papers',
          size: '22x22 cm (Pack of 50)',
          image_url: '/products/top-tissue-napkins.jpg',
          price: 10.00,
          stock: 1200,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
    ],
  },

  // 3. Mohd. Imran - Royal Biryani Banquet (Total ₹1,18,000 across 12 orders)
  {
    id: 'ord-eco-mi-001',
    user_id: 'imran.banquets@yahoo.com',
    customer_name: 'Mohd. Imran',
    customer_email: 'imran.banquets@yahoo.com',
    total: 118000,
    discount: 5000,
    address: 'Grand Celebration Road, Civil Lines',
    city: 'Prayagraj',
    state: 'Uttar Pradesh',
    pincode: '211001',
    phone: '7892280294',
    order_status: 'delivered',
    payment_status: 'paid',
    payment_method: 'upi_qr',
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    utr_number: 'UPI771829039182',
    order_items: [
      {
        id: 'item-mi-1',
        order_id: 'ord-eco-mi-001',
        product_id: '22222222-2222-2222-2222-222222220004',
        qty: 3000,
        unit_price: 9.00,
        product: {
          id: '22222222-2222-2222-2222-222222220004',
          name: 'Silver Coated Paper Dona',
          description: 'Premium silver laminated paper dona',
          category: 'dona-bowls',
          size: 'Pack of 20',
          image_url: '/products/silver-paper-dona.jpg',
          price: 12.00,
          stock: 1200,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'item-mi-2',
        order_id: 'ord-eco-mi-001',
        product_id: '22222222-2222-2222-2222-222222220001',
        qty: 2500,
        unit_price: 22.00,
        product: {
          id: '22222222-2222-2222-2222-222222220001',
          name: '6-Inch Deep Paper Dona Bowls (Assorted Colors)',
          description: 'Deep wall food-grade paper dona bowls',
          category: 'dona-bowls',
          size: '6 Inch / 250ml (Pack of 100)',
          image_url: '/products/colorful-dona-bowls.jpg',
          price: 30.00,
          stock: 800,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'item-mi-3',
        order_id: 'ord-eco-mi-001',
        product_id: '33333333-3333-3333-3333-333333330001',
        qty: 4000,
        unit_price: 9.00,
        product: {
          id: '33333333-3333-3333-3333-333333330001',
          name: 'OJAS Soft Paper Napkins (27x30 cm)',
          description: 'Soft, absorbent 27x30 cm paper table napkins',
          category: 'tissue-papers',
          size: '27x30 cm (60g Pack)',
          image_url: '/products/ojas-paper-napkins.jpg',
          price: 12.00,
          stock: 1200,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
    ],
  },

  // 4. Vikram Mehta - Spice Hub Kitchens (Total ₹14,200 across 3 orders)
  {
    id: 'ord-eco-vm-001',
    user_id: 'yashaswinim8002@gmail.com',
    customer_name: 'Vikram Mehta',
    customer_email: 'yashaswinim8002@gmail.com',
    total: 14200,
    discount: 800,
    address: 'Plot 7, Cloud Kitchen Hub, Gomti Nagar',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226010',
    phone: '9811223344',
    order_status: 'delivered',
    payment_status: 'paid',
    payment_method: 'upi_qr',
    created_at: new Date(Date.now() - 3600000 * 30).toISOString(),
    utr_number: 'UPI662910394819',
    order_items: [
      {
        id: 'item-vm-1',
        order_id: 'ord-eco-vm-001',
        product_id: '22222222-2222-2222-2222-222222220001',
        qty: 250,
        unit_price: 26.00,
        product: {
          id: '22222222-2222-2222-2222-222222220001',
          name: '6-Inch Deep Paper Dona Bowls (Assorted Colors)',
          description: 'Deep wall food-grade paper dona bowls',
          category: 'dona-bowls',
          size: '6 Inch / 250ml (Pack of 100)',
          image_url: '/products/colorful-dona-bowls.jpg',
          price: 30.00,
          stock: 800,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'item-vm-2',
        order_id: 'ord-eco-vm-001',
        product_id: '22222222-2222-2222-2222-222222220002',
        qty: 180,
        unit_price: 26.00,
        product: {
          id: '22222222-2222-2222-2222-222222220002',
          name: '4-Inch Golden Paper Dona Bowls',
          description: 'Traditional golden kraft paper dona bowls',
          category: 'dona-bowls',
          size: '4 Inch (Pack of 100)',
          image_url: '/products/golden-dona-bowls.jpg',
          price: 30.00,
          stock: 650,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'item-vm-3',
        order_id: 'ord-eco-vm-001',
        product_id: '33333333-3333-3333-3333-333333330002',
        qty: 430,
        unit_price: 7.00,
        product: {
          id: '33333333-3333-3333-3333-333333330002',
          name: 'TOP Tissue Paper Napkins (22x22 cm)',
          description: 'Standard 22x22 cm single fold tissue napkins',
          category: 'tissue-papers',
          size: '22x22 cm (Pack of 50)',
          image_url: '/products/top-tissue-napkins.jpg',
          price: 10.00,
          stock: 1200,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
    ],
  },

  // 5. Gupta Wholesale Caterers (Total ₹4,900 across 2 orders)
  {
    id: 'ord-eco-984210',
    user_id: 'wholesale@ecocraze.com',
    customer_name: 'Gupta Wholesale Caterers',
    customer_email: 'wholesale@ecocraze.com',
    total: 4900,
    discount: 300,
    address: '14, Industrial Area, Sector 5',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    pincode: '208001',
    phone: '6306784568',
    order_status: 'confirmed',
    payment_status: 'paid',
    payment_method: 'upi_qr',
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    utr_number: 'UPI983726481023',
    order_items: [
      {
        id: 'item-001',
        order_id: 'ord-eco-984210',
        product_id: '22222222-2222-2222-2222-222222220001',
        qty: 50,
        unit_price: 22.00,
        product: {
          id: '22222222-2222-2222-2222-222222220001',
          name: '6-Inch Deep Paper Dona Bowls (Assorted Colors)',
          description: 'Deep wall food-grade paper dona bowls',
          category: 'dona-bowls',
          size: '6 Inch / 250ml (Pack of 100)',
          image_url: '/products/colorful-dona-bowls.jpg',
          price: 30.00,
          stock: 800,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'item-002',
        order_id: 'ord-eco-984210',
        product_id: '22222222-2222-2222-2222-222222220002',
        qty: 100,
        unit_price: 22.00,
        product: {
          id: '22222222-2222-2222-2222-222222220002',
          name: '4-Inch Golden Paper Dona Bowls',
          description: 'Traditional golden kraft paper dona bowls',
          category: 'dona-bowls',
          size: '4 Inch (Pack of 100)',
          image_url: '/products/golden-dona-bowls.jpg',
          price: 30.00,
          stock: 650,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
      {
        id: 'item-003',
        order_id: 'ord-eco-984210',
        product_id: '22222222-2222-2222-2222-222222220004',
        qty: 40,
        unit_price: 40.00,
        product: {
          id: '22222222-2222-2222-2222-222222220004',
          name: 'Silver Coated Paper Dona',
          description: 'Premium silver laminated paper dona',
          category: 'dona-bowls',
          size: 'Pack of 20',
          image_url: '/products/silver-paper-dona.jpg',
          price: 12.00,
          stock: 1200,
          active: true,
          created_at: new Date().toISOString(),
        },
      },
    ],
  },
];

export function getLocalOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    const existing: Order[] = raw ? JSON.parse(raw) : [];
    // Ensure seed orders exist
    const existingEmails = new Set(existing.map((o) => (o.customer_email || o.user_id || '').toLowerCase()));
    const missing = SEED_ORDERS.filter((s) => !existingEmails.has((s.customer_email || '').toLowerCase()));
    if (missing.length > 0) {
      const merged = [...existing, ...missing];
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(merged));
      return merged;
    }
    return existing.length > 0 ? existing : SEED_ORDERS;
  } catch {
    return SEED_ORDERS;
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
  customer_email?: string;
  total: number;
  discount: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  payment_method: 'razorpay' | 'cod' | 'upi_qr';
  payment_status: 'pending' | 'paid' | 'verification_pending';
  utr_number?: string;
  items: { product: Product; quantity: number; unit_price: number }[];
}): Promise<Order> {
  const orderId = safeUUID();
  const order: Order = {
    id: orderId,
    user_id: orderPayload.user_id || 'guest-user',
    customer_name: orderPayload.customer_name,
    customer_email: orderPayload.customer_email || (orderPayload.user_id?.includes('@') ? orderPayload.user_id : undefined),
    total: orderPayload.total,
    discount: orderPayload.discount,
    address: orderPayload.address,
    city: orderPayload.city,
    state: orderPayload.state,
    pincode: orderPayload.pincode,
    phone: orderPayload.phone,
    order_status: orderPayload.payment_status === 'verification_pending' ? 'pending' : 'confirmed',
    payment_status: orderPayload.payment_status,
    payment_method: orderPayload.payment_method,
    created_at: new Date().toISOString(),
    utr_number: orderPayload.utr_number || undefined,
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
  try {
    window.dispatchEvent(new CustomEvent('ecocraze_customer_activity', { detail: order }));
  } catch {}

  // Record UTR in the used-UTRs ledger to prevent reuse
  if (orderPayload.utr_number) {
    addUsedUTR(orderPayload.utr_number);
  }

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

// ----------------- GENUINE CUSTOMER REVIEWS -----------------

export function getLocalCustomerReviews(): CustomerReview[] {
  try {
    const raw = localStorage.getItem(LOCAL_REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalCustomerReviews(reviews: CustomerReview[]) {
  try {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(reviews));
    window.dispatchEvent(new CustomEvent('reviews-updated'));
  } catch (e) {
    console.error('Error saving local reviews', e);
  }
}

export async function getCustomerReviews(): Promise<CustomerReview[]> {
  try {
    const hasConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (hasConfig) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        saveLocalCustomerReviews(data);
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not reach Supabase for reviews, using local fallback:', err);
  }

  return getLocalCustomerReviews();
}

export async function submitCustomerReview(reviewInput: Omit<CustomerReview, 'id' | 'created_at'>): Promise<CustomerReview> {
  const newReview: CustomerReview = {
    ...reviewInput,
    id: safeUUID(),
    created_at: new Date().toISOString(),
  };

  // Try saving to Supabase if configured
  try {
    const hasConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (hasConfig) {
      await supabase.from('reviews').insert({
        id: newReview.id,
        name: newReview.name,
        business_name: newReview.business_name || null,
        city: newReview.city || null,
        rating: newReview.rating,
        title: newReview.title || null,
        comment: newReview.comment,
        verified_buyer: newReview.verified_buyer,
        order_id: newReview.order_id || null,
        created_at: newReview.created_at,
      });
    }
  } catch (e) {
    console.warn('Supabase review submission warning:', e);
  }

  // Save to local storage
  const current = getLocalCustomerReviews();
  const updated = [newReview, ...current];
  saveLocalCustomerReviews(updated);

  return newReview;
}

export async function deleteCustomerReview(id: string): Promise<boolean> {
  try {
    const hasConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (hasConfig) {
      await supabase.from('reviews').delete().eq('id', id);
    }
  } catch (e) {
    console.warn('Supabase review deletion warning:', e);
  }

  const current = getLocalCustomerReviews();
  saveLocalCustomerReviews(current.filter((r) => r.id !== id));
  return true;
}

// ----------------- CUSTOMER VISIT TRACKING -----------------

export const SEED_CUSTOMER_VISITS: CustomerVisit[] = [
  // Anjali Gupta (Gupta Eco Disposables) - 8 visits
  { id: 'v-ag-8', email: 'anjali.gupta.ashok16@gmail.com', name: 'Anjali Gupta', firm: 'Gupta Eco Disposables', phone: '7676349773', role: 'customer', visited_at: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { id: 'v-ag-7', email: 'anjali.gupta.ashok16@gmail.com', name: 'Anjali Gupta', firm: 'Gupta Eco Disposables', phone: '7676349773', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 4).toISOString() },
  { id: 'v-ag-6', email: 'anjali.gupta.ashok16@gmail.com', name: 'Anjali Gupta', firm: 'Gupta Eco Disposables', phone: '7676349773', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: 'v-ag-5', email: 'anjali.gupta.ashok16@gmail.com', name: 'Anjali Gupta', firm: 'Gupta Eco Disposables', phone: '7676349773', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 'v-ag-4', email: 'anjali.gupta.ashok16@gmail.com', name: 'Anjali Gupta', firm: 'Gupta Eco Disposables', phone: '7676349773', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 48).toISOString() },
  { id: 'v-ag-3', email: 'anjali.gupta.ashok16@gmail.com', name: 'Anjali Gupta', firm: 'Gupta Eco Disposables', phone: '7676349773', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 72).toISOString() },
  { id: 'v-ag-2', email: 'anjali.gupta.ashok16@gmail.com', name: 'Anjali Gupta', firm: 'Gupta Eco Disposables', phone: '7676349773', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 96).toISOString() },
  { id: 'v-ag-1', email: 'anjali.gupta.ashok16@gmail.com', name: 'Anjali Gupta', firm: 'Gupta Eco Disposables', phone: '7676349773', role: 'customer', visited_at: new Date('2026-08-12T10:30:00.000Z').toISOString() },

  // Ananya Deshmukh (Desi Bowls Cafe) - 5 visits
  { id: 'v-ad-5', email: 'procurement@desibowls.in', name: 'Ananya Deshmukh', firm: 'Desi Bowls Cafe', phone: '6306784568', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'v-ad-4', email: 'procurement@desibowls.in', name: 'Ananya Deshmukh', firm: 'Desi Bowls Cafe', phone: '6306784568', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 18).toISOString() },
  { id: 'v-ad-3', email: 'procurement@desibowls.in', name: 'Ananya Deshmukh', firm: 'Desi Bowls Cafe', phone: '6306784568', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 40).toISOString() },
  { id: 'v-ad-2', email: 'procurement@desibowls.in', name: 'Ananya Deshmukh', firm: 'Desi Bowls Cafe', phone: '6306784568', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 70).toISOString() },
  { id: 'v-ad-1', email: 'procurement@desibowls.in', name: 'Ananya Deshmukh', firm: 'Desi Bowls Cafe', phone: '6306784568', role: 'customer', visited_at: new Date('2026-09-01T14:15:00.000Z').toISOString() },

  // Mohd. Imran (Royal Biryani Banquet) - 12 visits
  { id: 'v-mi-12', email: 'imran.banquets@yahoo.com', name: 'Mohd. Imran', firm: 'Royal Biryani Banquet', phone: '7892280294', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'v-mi-11', email: 'imran.banquets@yahoo.com', name: 'Mohd. Imran', firm: 'Royal Biryani Banquet', phone: '7892280294', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 20).toISOString() },
  { id: 'v-mi-10', email: 'imran.banquets@yahoo.com', name: 'Mohd. Imran', firm: 'Royal Biryani Banquet', phone: '7892280294', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 50).toISOString() },
  { id: 'v-mi-1', email: 'imran.banquets@yahoo.com', name: 'Mohd. Imran', firm: 'Royal Biryani Banquet', phone: '7892280294', role: 'customer', visited_at: new Date('2026-09-18T09:45:00.000Z').toISOString() },

  // Vikram Mehta (Spice Hub Kitchens) - 3 visits
  { id: 'v-vm-3', email: 'yashaswinim8002@gmail.com', name: 'Vikram Mehta', firm: 'Spice Hub Kitchens', phone: '9811223344', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 'v-vm-2', email: 'yashaswinim8002@gmail.com', name: 'Vikram Mehta', firm: 'Spice Hub Kitchens', phone: '9811223344', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 60).toISOString() },
  { id: 'v-vm-1', email: 'yashaswinim8002@gmail.com', name: 'Vikram Mehta', firm: 'Spice Hub Kitchens', phone: '9811223344', role: 'customer', visited_at: new Date('2026-10-04T11:20:00.000Z').toISOString() },

  // Gupta Wholesale Caterers - 6 visits
  { id: 'v-gw-6', email: 'wholesale@ecocraze.com', name: 'Gupta Wholesale Caterers', firm: 'Gupta Wholesale Caterers', phone: '6306784568', role: 'customer', visited_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: 'v-gw-5', email: 'wholesale@ecocraze.com', name: 'Gupta Wholesale Caterers', firm: 'Gupta Wholesale Caterers', phone: '6306784568', role: 'customer', visited_at: new Date(Date.now() - 3600000 * 6).toISOString() },
  { id: 'v-gw-1', email: 'wholesale@ecocraze.com', name: 'Gupta Wholesale Caterers', firm: 'Gupta Wholesale Caterers', phone: '6306784568', role: 'customer', visited_at: new Date('2026-08-20T16:00:00.000Z').toISOString() },

  // Anjali Gupta (Ecocraze Operations) - ADMIN - 24 visits
  { id: 'v-adm-1', email: 'anshumangupta2501@gmail.com', name: 'Anjali Gupta', firm: 'Ecocraze Operations', phone: '7676349773', role: 'admin', visited_at: new Date().toISOString() },
];

const FIRM_MAP: Record<string, string> = {
  'anjali.gupta.ashok16@gmail.com': 'Gupta Eco Disposables',
  'procurement@desibowls.in': 'Desi Bowls Cafe',
  'imran.banquets@yahoo.com': 'Royal Biryani Banquet',
  'yashaswinim8002@gmail.com': 'Spice Hub Kitchens',
  'wholesale@ecocraze.com': 'Gupta Wholesale Caterers',
  'anshumangupta2501@gmail.com': 'Ecocraze Operations',
};

export function getCustomerVisits(): CustomerVisit[] {
  try {
    const raw = localStorage.getItem(LOCAL_CUSTOMER_VISITS_KEY);
    const existing: CustomerVisit[] = raw ? JSON.parse(raw) : [];
    // Ensure seed customer visits exist
    const existingEmails = new Set(existing.map((v) => v.email.toLowerCase()));
    const missing = SEED_CUSTOMER_VISITS.filter((s) => !existingEmails.has(s.email.toLowerCase()));
    if (missing.length > 0) {
      const merged = [...existing, ...missing];
      localStorage.setItem(LOCAL_CUSTOMER_VISITS_KEY, JSON.stringify(merged));
      return merged;
    }
    return existing.length > 0 ? existing : SEED_CUSTOMER_VISITS;
  } catch {
    return SEED_CUSTOMER_VISITS;
  }
}

export function saveCustomerVisit(visit: Omit<CustomerVisit, 'id' | 'visited_at'>) {
  try {
    const visits = getCustomerVisits();
    const newVisit: CustomerVisit = {
      ...visit,
      firm: visit.firm || FIRM_MAP[visit.email.toLowerCase()] || undefined,
      id: safeUUID(),
      visited_at: new Date().toISOString(),
    };
    // Keep max 1000 visit records
    const updated = [newVisit, ...visits].slice(0, 1000);
    localStorage.setItem(LOCAL_CUSTOMER_VISITS_KEY, JSON.stringify(updated));
    try {
      window.dispatchEvent(new CustomEvent('ecocraze_customer_activity', { detail: newVisit }));
    } catch {}
  } catch (e) {
    console.error('Error saving customer visit', e);
  }
}

export interface CustomerActivitySummary {
  email: string;
  name: string;
  firm?: string;
  phone: string;
  role: 'customer' | 'admin';
  firstVisit: string;
  lastVisit: string;
  visitCount: number;
  ordersCount: number;
  totalSpend: number;
  productsPurchased: {
    productName: string;
    quantity: number;
    totalValue: number;
    unitPrice: number;
    imageUrl?: string;
    lastPurchasedAt?: string;
  }[];
  recentOrders?: {
    orderId: string;
    total: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    date: string;
    items: { productName: string; quantity: number; unitPrice: number; total: number; imageUrl?: string }[];
  }[];
}

export function getCustomerActivitySummary(): CustomerActivitySummary[] {
  const visits = getCustomerVisits();
  const orders = getLocalOrders();

  // Build a map of unique customers from visit logs
  const customerMap = new Map<string, CustomerActivitySummary>();

  // Aggregate visit data by email
  visits.forEach((v) => {
    const key = v.email.toLowerCase();
    const firmName = v.firm || FIRM_MAP[key] || '';
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        email: v.email,
        name: v.name,
        firm: firmName,
        phone: v.phone,
        role: v.role,
        firstVisit: v.visited_at,
        lastVisit: v.visited_at,
        visitCount: 1,
        ordersCount: 0,
        totalSpend: 0,
        productsPurchased: [],
        recentOrders: [],
      });
    } else {
      const existing = customerMap.get(key)!;
      existing.visitCount += 1;
      existing.name = v.name || existing.name;
      existing.firm = firmName || existing.firm;
      existing.phone = v.phone || existing.phone;
      if (new Date(v.visited_at) < new Date(existing.firstVisit)) {
        existing.firstVisit = v.visited_at;
      }
      if (new Date(v.visited_at) > new Date(existing.lastVisit)) {
        existing.lastVisit = v.visited_at;
      }
    }
  });

  // Enrich with orders data — match by email, user_id, phone, or name
  orders.forEach((order) => {
    let matchKey: string | null = null;

    // 1. Direct email match (highest priority, 100% exact)
    const orderEmail = (order.customer_email || (order.user_id?.includes('@') ? order.user_id : '')).toLowerCase().trim();
    if (orderEmail && customerMap.has(orderEmail)) {
      matchKey = orderEmail;
    }

    // 2. Fallback matching (only on customers, NEVER assign customer orders to admin)
    if (!matchKey) {
      customerMap.forEach((summary, email) => {
        if (matchKey || summary.role === 'admin') return;

        // user_id match
        if (order.user_id && (order.user_id.toLowerCase() === email || order.user_id.toLowerCase().includes(email.split('@')[0]))) {
          matchKey = email;
        }
        // Direct phone match
        else if (order.phone && summary.phone && order.phone.replace(/\D/g, '') === summary.phone.replace(/\D/g, '')) {
          matchKey = email;
        }
        // Direct name match
        else if (
          order.customer_name &&
          summary.name &&
          (order.customer_name.toLowerCase().includes(summary.name.toLowerCase().split(' ')[0]) ||
           summary.name.toLowerCase().includes(order.customer_name.toLowerCase().split(' ')[0]))
        ) {
          matchKey = email;
        }
      });
    }

    if (matchKey) {
      const customer = customerMap.get(matchKey)!;
      customer.ordersCount += 1;
      customer.totalSpend += order.total;

      const orderItemSummaries: { productName: string; quantity: number; unitPrice: number; total: number; imageUrl?: string }[] = [];

      // Track products from order items
      if (order.order_items) {
        order.order_items.forEach((item) => {
          const productName = item.product?.name || `Product ${item.product_id.slice(0, 6)}`;
          const imageUrl = item.product?.image_url;
          const unitPrice = item.unit_price;
          const totalVal = item.qty * item.unit_price;

          orderItemSummaries.push({
            productName,
            quantity: item.qty,
            unitPrice,
            total: totalVal,
            imageUrl,
          });

          const existingProduct = customer.productsPurchased.find(
            (p) => p.productName === productName
          );
          if (existingProduct) {
            existingProduct.quantity += item.qty;
            existingProduct.totalValue += totalVal;
            existingProduct.lastPurchasedAt = order.created_at;
            if (!existingProduct.imageUrl && imageUrl) existingProduct.imageUrl = imageUrl;
          } else {
            customer.productsPurchased.push({
              productName,
              quantity: item.qty,
              unitPrice,
              totalValue: totalVal,
              imageUrl,
              lastPurchasedAt: order.created_at,
            });
          }
        });
      }

      if (!customer.recentOrders) customer.recentOrders = [];
      customer.recentOrders.push({
        orderId: order.id,
        total: order.total,
        status: order.order_status,
        paymentStatus: order.payment_status,
        paymentMethod: order.payment_method,
        date: order.created_at,
        items: orderItemSummaries,
      });
    }
  });

  return Array.from(customerMap.values()).sort(
    (a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
  );
}
