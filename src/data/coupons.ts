import { Coupon } from '../types';

export const VALID_COUPONS: Coupon[] = [
  {
    code: 'TECH10',
    discountType: 'percent',
    value: 10,
    minSpend: 15000,
    description: '10% off on orders over ₹15,000'
  },
  {
    code: 'COMPARE2000',
    discountType: 'fixed',
    value: 2000,
    minSpend: 10000,
    description: '₹2,000 off instantly for comparison shopping'
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    value: 500,
    minSpend: 2000,
    description: 'Free Express Shipping Discount'
  },
  {
    code: 'FESTIVE5000',
    discountType: 'fixed',
    value: 5000,
    minSpend: 50000,
    description: '₹5,000 off orders over ₹50,000'
  }
];
