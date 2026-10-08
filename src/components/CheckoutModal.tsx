import React, { useState } from 'react';
import { CartItem, Coupon, Order, ShippingAddress } from '../types';
import { formatPrice } from '../utils/formatCurrency';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  Printer, 
  ArrowRight, 
  ArrowLeft,
  PackageCheck
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  appliedCoupon: Coupon | null;
  onOrderPlaced: (order: Order) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  appliedCoupon,
  onOrderPlaced,
  onClearCart,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.in',
    address: '42 Marine Drive, Nariman Point',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    country: 'India',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');

  // Card fields
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('321');
  const [upiId, setUpiId] = useState('rajesh@okaxis');

  // Generated Order state
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const shippingCosts = {
    standard: 0,
    express: 299,
    overnight: 599,
  };
  const shippingFee = shippingCosts[shippingMethod];

  const taxAmount = (subtotal - discountAmount) * 0.18; // 18% GST
  const grandTotal = Math.max(0, subtotal - discountAmount + taxAmount + shippingFee);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const newOrder: Order = {
      id: 'ORD-IN-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString().split('T')[0],
      items: [...cartItems],
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      shipping: shippingFee,
      total: grandTotal,
      shippingAddress: { ...address },
      paymentMethod: paymentMethod.toUpperCase(),
      status: 'Processing',
      trackingNumber: 'IND-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      estimatedDelivery: shippingMethod === 'overnight' ? 'Tomorrow by 2 PM' : '2-3 Business Days',
    };

    setConfirmedOrder(newOrder);
    onOrderPlaced(newOrder);
    onClearCart();
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">
              {step === 4 ? 'Order Confirmation' : 'Secure Checkout (INR)'}
            </h2>
          </div>
          {step !== 4 && (
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Stepper Indicator */}
        {step !== 4 && (
          <div className="bg-white dark:bg-gray-900 px-6 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-around text-xs font-semibold">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Address</span>
            </div>
            <div className="h-px w-8 bg-gray-200 dark:bg-gray-800" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
              <span>Delivery</span>
            </div>
            <div className="h-px w-8 bg-gray-200 dark:bg-gray-800" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</span>
              <span>Payment</span>
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* STEP 1: Shipping Address */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-4 max-w-2xl mx-auto">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Indian Delivery Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Street / House Address</label>
                <input
                  type="text"
                  required
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md"
                >
                  <span>Continue to Delivery Speed</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Delivery Speed */}
          {step === 2 && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" /> Delivery Options
              </h3>

              <div className="space-y-3">
                {[
                  { id: 'standard', title: 'Standard Delivery', time: '3 - 5 Business Days', price: 'FREE' },
                  { id: 'express', title: 'Express Priority Courier (Delhivery / Bluedart)', time: '2 Business Days Guaranteed', price: '₹299' },
                  { id: 'overnight', title: 'Same Day Air Express', time: 'Tomorrow by 2 PM', price: '₹599' },
                ].map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === option.id
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-sm'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingOption"
                        checked={shippingMethod === option.id}
                        onChange={() => setShippingMethod(option.id as any)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{option.title}</p>
                        <p className="text-[11px] text-gray-500">{option.time}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">{option.price}</span>
                  </label>
                ))}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method & Order Summary */}
          {step === 3 && (
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-3xl mx-auto">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" /> Indian Payment Methods
                </h3>

                {/* Payment Selector Tabs */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / GPay' },
                    { id: 'card', label: 'Credit/Debit' },
                    { id: 'netbanking', label: 'Net Banking' },
                    { id: 'cod', label: 'Cash on Del.' },
                  ].map((pay) => (
                    <button
                      type="button"
                      key={pay.id}
                      onClick={() => setPaymentMethod(pay.id as any)}
                      className={`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-colors ${
                        paymentMethod === pay.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {pay.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'upi' && (
                  <div className="space-y-3 p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Enter VPA / UPI ID (Google Pay, PhonePe, Paytm, BHIM)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. mobile@upi or username@okicici"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs text-gray-900 dark:text-white font-mono"
                    />
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">
                      Instant 0% transaction fee via Google Pay, PhonePe, or BHIM UPI
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod !== 'card' && paymentMethod !== 'upi' && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 rounded-2xl text-xs">
                    You will complete the {paymentMethod.toUpperCase()} payment after order confirmation.
                  </div>
                )}
              </div>

              {/* Order Summary Box */}
              <div className="lg:col-span-5 bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Items ({cartItems.length})</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : formatPrice(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">GST (18%)</span>
                      <span>{formatPrice(taxAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span>Total</span>
                      <span className="text-blue-600 dark:text-blue-400">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Pay {formatPrice(grandTotal)}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-2 text-xs text-gray-500 hover:text-gray-800 text-center"
                  >
                    Back to Shipping Options
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* STEP 4: Success Order Confirmation */}
          {step === 4 && confirmedOrder && (
            <div className="text-center py-6 space-y-6 max-w-xl mx-auto">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <PackageCheck className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Thank you for shopping with ElectroCompare. Your GST invoice and tracking specs have been generated.
                </p>
              </div>

              {/* Order summary card */}
              <div className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="font-semibold text-gray-500">Order ID:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{confirmedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500">AWB Tracking Number:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200">{confirmedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-500">Estimated Delivery:</span>
                  <span className="font-bold text-emerald-600">{confirmedOrder.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 font-bold text-sm">
                  <span>Total Paid:</span>
                  <span className="text-gray-900 dark:text-white">{formatPrice(confirmedOrder.total)}</span>
                </div>
              </div>

              {/* Print Receipt Action */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print GST Invoice
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md transition-transform"
                >
                  Back to Store Catalog
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
