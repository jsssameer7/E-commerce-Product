import { Product, SellerDeal } from '../types';

/**
 * Generate 4 Top Ranked Online Retailer Deals for any product
 * Compares Amazon India, Flipkart, Reliance Digital, and Croma/Tata CLiQ
 */
export function getSellerDeals(product: Product): SellerDeal[] {
  if (product.sellerDeals && product.sellerDeals.length >= 4) {
    return product.sellerDeals;
  }

  const basePrice = product.price;
  const original = product.originalPrice || Math.round(basePrice * 1.12);

  // Retailer variations
  const rawDeals: Omit<SellerDeal, 'rank'>[] = [
    {
      id: `deal-flipkart-${product.id}`,
      storeName: 'Flipkart',
      price: Math.round(basePrice * 0.97), // 3% lower deal
      originalPrice: original,
      bankOffer: '₹2,500 Instant Discount on HDFC Bank Credit Cards + No Cost EMI',
      deliverySpeed: 'Flipkart Assured • Express 24h Delivery',
      warrantyInfo: '1 Year Brand Warranty + 7 Days Replacement Policy',
      storeRating: 4.9,
      buyUrl: `https://www.flipkart.com/search?q=${encodeURIComponent(product.name)}`,
    },
    {
      id: `deal-amazon-${product.id}`,
      storeName: 'Amazon India',
      price: basePrice,
      originalPrice: original,
      bankOffer: '10% Cashback up to ₹2,000 with ICICI Bank Credit Card',
      deliverySpeed: 'Amazon Prime • Free Next-Day Delivery by 12 PM',
      warrantyInfo: '1 Year Official Brand Warranty',
      storeRating: 4.8,
      buyUrl: `https://www.amazon.in/s?k=${encodeURIComponent(product.name)}`,
    },
    {
      id: `deal-reliance-${product.id}`,
      storeName: 'Reliance Digital',
      price: Math.round(basePrice * 1.01),
      originalPrice: original,
      bankOffer: 'Flat ₹3,000 Instant Cashback on SBI Credit Cards',
      deliverySpeed: 'Reliance Store Pickup (Same Day) or 2-Day Express Home Delivery',
      warrantyInfo: 'Official Brand Warranty + Reliance ResQ Protection',
      storeRating: 4.7,
      buyUrl: `https://www.reliancedigital.in/search?q=${encodeURIComponent(product.name)}`,
    },
    {
      id: `deal-croma-${product.id}`,
      storeName: 'Croma',
      price: Math.round(basePrice * 1.02),
      originalPrice: original,
      bankOffer: 'Flat ₹1,500 Instant Discount on Axis Bank Cards',
      deliverySpeed: 'Tata Express Delivery in 48 Hours',
      warrantyInfo: '1 Year Brand Warranty + Croma ZipCare Advantage',
      storeRating: 4.6,
      buyUrl: `https://www.croma.com/searchB?q=${encodeURIComponent(product.name)}`,
    },
  ];

  // Sort deals by lowest final effective price to determine ranking #1 to #4
  rawDeals.sort((a, b) => a.price - b.price);

  return rawDeals.map((deal, idx) => ({
    ...deal,
    rank: idx + 1,
    isBestDeal: idx === 0,
  }));
}
