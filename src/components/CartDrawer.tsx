import React, { useState } from 'react';
import { CartItem, Coupon } from '../types';
import { X, Trash2, ShoppingCart, Tag, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { VALID_COUPONS } from '../data/coupons';
import { formatPrice } from '../utils/formatCurrency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  appliedCoupon,
  onApplyCoupon,
  onProceedToCheckout,
}) => {
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const freeShippingThreshold = 4999;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const isFreeShipping = subtotal >= freeShippingThreshold || (appliedCoupon && appliedCoupon.code === 'FREESHIP');
  const shippingFee = isFreeShipping ? 0 : 499;

  const taxAmount = (subtotal - discountAmount) * 0.18; // 18% GST
  const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const found = VALID_COUPONS.find((c) => c.code.toUpperCase() === couponCodeInput.trim().toUpperCase());
    if (!found) {
      setCouponMessage({ type: 'error', text: 'Invalid coupon. Try TECH10 or COMPARE2000' });
      return;
    }

    if (subtotal < found.minSpend) {
      setCouponMessage({ type: 'error', text: `Minimum spend of ${formatPrice(found.minSpend)} required for code ${found.code}` });
      return;
    }

    onApplyCoupon(found);
    setCouponMessage({ type: 'success', text: `Applied code ${found.code}: ${found.description}` });
    setCouponCodeInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 dark:border-gray-800">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Your Shopping Cart</h2>
            <span className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-blue-50 dark:bg-blue-950/40 p-3 border-b border-blue-100 dark:border-blue-900/40 text-xs">
          {amountNeededForFreeShipping > 0 && !isFreeShipping ? (
            <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
              Add <strong className="text-blue-600 dark:text-blue-400">{formatPrice(amountNeededForFreeShipping)}</strong> more to get <strong>Free Express Shipping</strong>!
            </p>
          ) : (
            <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> You've unlocked FREE Express Delivery!
            </p>
          )}
          <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Your Cart is empty</p>
              <p className="text-xs text-gray-400 mt-1">Explore our electronics catalog to add products.</p>
            </div>
          ) : (
            cartItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-contain rounded-lg bg-white p-1"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-extrabold mt-0.5">
                    {formatPrice(product.price)}
                  </p>

                  {/* Quantity adjusters */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="px-2 py-0.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-l-lg"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-gray-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="px-2 py-0.5 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="p-1 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-gray-900 dark:text-white">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-3">
            
            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Promo Code (TECH10)..."
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 bg-white dark:bg-gray-800 text-xs rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white uppercase font-bold"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Apply
              </button>
            </form>

            {/* Coupon Applied Badge */}
            {appliedCoupon && (
              <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg text-xs border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Code '{appliedCoupon.code}' (-{formatPrice(discountAmount)})</span>
                </div>
                <button
                  onClick={() => onApplyCoupon(null)}
                  className="text-emerald-600 hover:text-emerald-900 font-bold"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {couponMessage && (
              <p className={`text-xs font-semibold ${couponMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-500'}`}>
                {couponMessage.text}
              </p>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-800">
                <span>Total Amount</span>
                <span className="text-blue-600 dark:text-blue-400">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

