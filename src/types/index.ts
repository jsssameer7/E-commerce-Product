export type CategoryType = 'all' | 'smartphones' | 'laptops' | 'audio' | 'wearables' | 'gaming' | 'cameras' | 'tv';

export interface ProductSpecs {
  display?: string;
  processor?: string;
  ram?: string;
  storage?: string;
  battery?: string;
  camera?: string;
  os?: string;
  weight?: string;
  warranty?: string;
  connectivity?: string;
  waterResistance?: string;
  [key: string]: string | undefined;
}

export interface SellerDeal {
  id: string;
  storeName: 'Amazon India' | 'Flipkart' | 'Reliance Digital' | 'Croma' | 'Tata CLiQ' | 'Vijay Sales';
  storeLogo?: string;
  price: number;
  originalPrice: number;
  bankOffer: string;
  deliverySpeed: string;
  warrantyInfo: string;
  storeRating: number;
  rank: number;
  buyUrl: string;
  isBestDeal?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryType;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  badge?: 'Best Seller' | "Editor's Choice" | 'Top Rated' | 'New Release' | 'Sale' | 'Best Value';
  stock: number;
  specs: ProductSpecs;
  highlights: string[];
  description: string;
  pros: string[];
  cons: string[];
  releaseDate: string;
  performanceScore: number;
  featuresScore: number;
  valueScore: number;
  recommendedUseCases: string[];
  sellerDeals?: SellerDeal[];
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterState {
  category: CategoryType;
  searchQuery: string;
  priceRange: [number, number];
  selectedBrands: string[];
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'value';
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  minSpend: number;
  description: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId?: string;
  userEmail?: string;
  customerName?: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
}
