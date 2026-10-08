import { createClient } from '@supabase/supabase-js';
import { Product, Review, Coupon, Order } from '../types';

// Fetch Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase keys are configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-supabase-project-id.supabase.co'
);

// Create Supabase Client instance
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// ========================================================
// PRODUCT API FUNCTIONS
// ========================================================

/** Fetch all electronic products from Supabase */
export async function getProductsFromSupabase(): Promise<Product[] | null> {
  if (!isSupabaseConfigured) return null;
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      console.error('Supabase Error fetching products:', error);
      return null;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      category: item.category,
      price: Number(item.price),
      originalPrice: Number(item.original_price),
      rating: Number(item.rating),
      reviewCount: Number(item.review_count),
      image: item.image,
      images: item.images || [item.image],
      badge: item.badge,
      stock: Number(item.stock),
      specs: item.specs || {},
      highlights: item.highlights || [],
      description: item.description || '',
      pros: item.pros || [],
      cons: item.cons || [],
      releaseDate: item.release_date || '',
      performanceScore: Number(item.performance_score),
      featuresScore: Number(item.features_score),
      valueScore: Number(item.value_score),
      recommendedUseCases: item.recommended_use_cases || []
    }));
  } catch (err) {
    console.error('Failed to connect to Supabase products table:', err);
    return null;
  }
}

/** Insert a new product into Supabase (Admin capability) */
export async function createProductInSupabase(product: Product): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { error } = await supabase.from('products').insert({
    id: product.id,
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: product.price,
    original_price: product.originalPrice,
    rating: product.rating,
    review_count: product.reviewCount,
    image: product.image,
    images: product.images,
    badge: product.badge,
    stock: product.stock,
    specs: product.specs,
    highlights: product.highlights,
    description: product.description,
    pros: product.pros,
    cons: product.cons,
    release_date: product.releaseDate,
    performance_score: product.performanceScore,
    features_score: product.featuresScore,
    value_score: product.valueScore,
    recommended_use_cases: product.recommendedUseCases
  });

  if (error) {
    console.error('Error creating product in Supabase:', error);
    return false;
  }
  return true;
}

/** Bulk seed/sync products to Supabase */
export async function seedProductsToSupabase(productsList: Product[]): Promise<void> {
  if (!isSupabaseConfigured) return;
  
  for (const product of productsList) {
    await supabase.from('products').upsert({
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      original_price: product.originalPrice,
      rating: product.rating,
      review_count: product.reviewCount,
      image: product.image,
      images: product.images,
      badge: product.badge,
      stock: product.stock,
      specs: product.specs,
      highlights: product.highlights,
      description: product.description,
      pros: product.pros,
      cons: product.cons,
      release_date: product.releaseDate,
      performance_score: product.performanceScore,
      features_score: product.featuresScore,
      value_score: product.valueScore,
      recommended_use_cases: product.recommendedUseCases
    }, { onConflict: 'id' });
  }
}

// ========================================================
// REVIEWS API FUNCTIONS
// ========================================================

/** Fetch customer reviews for a given product */
export async function getReviewsFromSupabase(productId: string): Promise<Review[] | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews from Supabase:', error);
    return null;
  }

  return data.map((r: any) => ({
    id: r.id,
    productId: r.product_id,
    author: r.author,
    rating: Number(r.rating),
    date: new Date(r.created_at).toISOString().split('T')[0],
    title: r.title,
    comment: r.comment,
    verified: r.verified,
    helpfulCount: r.helpful_count || 0
  }));
}

/** Submit a new product review */
export async function addReviewToSupabase(review: Omit<Review, 'id'>): Promise<Review | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: review.productId,
      author: review.author,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      verified: review.verified,
      helpful_count: review.helpfulCount || 0
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting review to Supabase:', error);
    return null;
  }

  return {
    id: data.id,
    productId: data.product_id,
    author: data.author,
    rating: Number(data.rating),
    date: new Date(data.created_at).toISOString().split('T')[0],
    title: data.title,
    comment: data.comment,
    verified: data.verified,
    helpfulCount: data.helpful_count
  };
}

// ========================================================
// ORDERS API FUNCTIONS
// ========================================================

/** Create a customer purchase order in Supabase */
export async function createOrderInSupabase(order: Order, userId?: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { error } = await supabase.from('orders').insert({
    id: order.id,
    user_id: userId || null,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    tax: order.tax,
    shipping: order.shipping,
    total: order.total,
    shipping_address: order.shippingAddress,
    payment_method: order.paymentMethod,
    status: order.status,
    tracking_number: order.trackingNumber,
    estimated_delivery: order.estimatedDelivery
  });

  if (error) {
    console.error('Error creating order in Supabase:', error);
    return false;
  }
  return true;
}

// ========================================================
// COUPONS API FUNCTIONS
// ========================================================

/** Fetch all active coupons */
export async function getCouponsFromSupabase(): Promise<Coupon[] | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase.from('coupons').select('*');

  if (error) {
    console.error('Error fetching coupons from Supabase:', error);
    return null;
  }

  return data.map((c: any) => ({
    code: c.code,
    discountType: c.discount_type,
    value: Number(c.value),
    minSpend: Number(c.min_spend),
    description: c.description
  }));
}
