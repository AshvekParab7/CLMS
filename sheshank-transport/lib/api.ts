/**
 * lib/api.ts
 * Central data-fetching layer that talks to Supabase.
 * All components import from here — never import supabase directly in pages.
 */
import { supabase } from './supabase';
import { Material } from './materials-data';

// ─── Type helpers ─────────────────────────────────────────────────────────────
// Supabase returns snake_case columns — map them to the camelCase Material interface
function mapRow(row: Record<string, unknown>): Material {
  return {
    id: row.id as string,
    name: row.name as string,
    category: row.category as string,
    price: row.price as number,
    unit: row.unit as string,
    supplier: row.supplier as string,
    supplierRating: (row.supplier_rating as number) ?? 0,
    rating: (row.rating as number) ?? 0,
    reviews: (row.reviews as number) ?? 0,
    stock: row.stock as Material['stock'],
    stockQty: (row.stock_qty as number) ?? 0,
    eta: row.eta as string,
    transport: (row.transport as number) ?? 0,
    image: (row.image as string) ?? '',
    images: (row.images as string[]) ?? [(row.image as string) ?? ''],
    description: (row.description as string) ?? '',
    specs: (row.specs as Record<string, string>) ?? {},
    tags: (row.tags as string[]) ?? [],
    isNew: (row.is_new as boolean) ?? false,
    discount: (row.discount as number) ?? 0,
  };
}

// ─── Fetch all materials (optionally filtered) ────────────────────────────────
export async function getMaterials(opts?: {
  category?: string;
  search?: string;
  sortBy?: 'popular' | 'rating' | 'price-asc' | 'price-desc';
  limit?: number;
}): Promise<Material[]> {
  let query = supabase.from('materials').select('*');

  // Category filter
  if (opts?.category && opts.category !== 'All') {
    query = query.eq('category', opts.category);
  }

  // Search filter (case-insensitive)
  if (opts?.search) {
    query = query.or(
      `name.ilike.%${opts.search}%,supplier.ilike.%${opts.search}%,category.ilike.%${opts.search}%`
    );
  }

  // Sort
  switch (opts?.sortBy) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    default: // 'popular'
      query = query.order('reviews', { ascending: false });
  }

  if (opts?.limit) {
    query = query.limit(opts.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[getMaterials] Supabase error:', error.message);
    return [];
  }

  return (data ?? []).map(row => mapRow(row as Record<string, unknown>));
}

// ─── Fetch a single material by ID ───────────────────────────────────────────
export async function getMaterial(id: string): Promise<Material | null> {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[getMaterial] Supabase error:', error.message);
    return null;
  }

  return data ? mapRow(data as Record<string, unknown>) : null;
}

// ─── Fetch similar materials (same category, different ID) ───────────────────
export async function getSimilarMaterials(id: string, category: string, count = 3): Promise<Material[]> {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('category', category)
    .neq('id', id)
    .limit(count);

  if (error) {
    console.error('[getSimilarMaterials] Supabase error:', error.message);
    return [];
  }

  // If not enough same-category results, fill with others
  let results = (data ?? []).map(row => mapRow(row as Record<string, unknown>));

  if (results.length < count) {
    const { data: others } = await supabase
      .from('materials')
      .select('*')
      .neq('id', id)
      .neq('category', category)
      .limit(count - results.length);
    results = [...results, ...(others ?? []).map(row => mapRow(row as Record<string, unknown>))];
  }

  return results;
}

// ─── Fetch featured/highlighted materials for Dashboard ──────────────────────
export async function getFeaturedMaterials(count = 4): Promise<Material[]> {
  return getMaterials({ sortBy: 'popular', limit: count });
}

// ─── ORDER TYPES ─────────────────────────────────────────────────────────────
export interface OrderItem {
  id?: string;
  order_id?: string;
  material_id: string;
  quantity: number;
  price: number;
  unit: string;
  material_name?: string;
  material_image?: string;
  material_category?: string;
}

export interface Order {
  id?: string;
  user_id?: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'dispatched' | 'in-transit' | 'delivered' | 'cancelled';
  total_amount: number;
  subtotal: number;
  delivery_fee: number;
  tax_amount: number;
  discount_amount: number;
  promo_code?: string;
  delivery_address: any;
  payment_method: string;
  eta?: string;
  driver_name?: string;
  driver_phone?: string;
  created_at?: string;
  items?: OrderItem[];
}

// ─── ORDER FUNCTIONS ─────────────────────────────────────────────────────────

export async function placeOrder(orderData: Order, items: OrderItem[]): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // 1. Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderData.order_number,
        user_id: orderData.user_id, // can be null for guest checkout until auth is added
        status: orderData.status,
        total_amount: orderData.total_amount,
        subtotal: orderData.subtotal,
        delivery_fee: orderData.delivery_fee,
        tax_amount: orderData.tax_amount,
        discount_amount: orderData.discount_amount,
        promo_code: orderData.promo_code,
        delivery_address: orderData.delivery_address,
        payment_method: orderData.payment_method,
        eta: orderData.eta
      }])
      .select()
      .single();

    if (orderError) throw new Error(orderError.message);

    // 2. Insert order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      material_id: item.material_id,
      quantity: item.quantity,
      price: item.price,
      unit: item.unit
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw new Error(itemsError.message);

    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error('[placeOrder] failed:', error.message);
    return { success: false, error: error.message };
  }
}

export async function getOrders(userId?: string): Promise<Order[]> {
  let query = supabase.from('orders').select('*, items:order_items(*)').order('created_at', { ascending: false });
  
  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[getOrders] error:', error.message);
    return [];
  }
  return data || [];
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('[getOrderById] error:', error.message);
    return null;
  }
  return data;
}

