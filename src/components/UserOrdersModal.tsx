import React, { useState } from 'react';
import { Order, User } from '../types';
import { X, Package, CheckCircle2, Truck, Clock, Printer, User as UserIcon, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currentUser?: User | null;
}

export const UserOrdersModal: React.FC<UserOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  currentUser,
}) => {
  // Admin view filter toggle
  const [adminViewMode, setAdminViewMode] = useState<'my-orders' | 'all-orders'>('my-orders');

  if (!isOpen) return null;

  // Strict Order Isolation logic
  const userOrders = orders.filter((order) => {
    if (!currentUser) return false;

    const isOwnOrder = 
      order.userId === currentUser.id ||
      (order.userEmail && order.userEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
      (order.shippingAddress?.email && order.shippingAddress.email.toLowerCase() === currentUser.email.toLowerCase());

    if (currentUser.role === 'admin') {
      return adminViewMode === 'all-orders' ? true : isOwnOrder;
    }

    // Regular customers see ONLY their own orders
    return isOwnOrder;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Order History & Live Tracking</h2>
              {currentUser && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Account: <strong className="text-blue-600 dark:text-blue-400">{currentUser.name} ({currentUser.email})</strong>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Filter Bar if logged in as Admin */}
        {currentUser?.role === 'admin' && (
          <div className="px-6 py-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/50 flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-200 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Admin Order Privileges Active</span>
            </div>
            <div className="inline-flex rounded-xl bg-white dark:bg-gray-800 p-1 border border-amber-200 dark:border-amber-900">
              <button
                onClick={() => setAdminViewMode('my-orders')}
                className={`px-3 py-1 rounded-lg font-extrabold transition-colors ${
                  adminViewMode === 'my-orders'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                My Personal Orders Only
              </button>
              <button
                onClick={() => setAdminViewMode('all-orders')}
                className={`px-3 py-1 rounded-lg font-extrabold transition-colors ${
                  adminViewMode === 'all-orders'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                }`}
              >
                All Customer Orders ({orders.length})
              </button>
            </div>
          </div>
        )}

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!currentUser ? (
            <div className="text-center py-16">
              <UserIcon className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Please Sign In</p>
              <p className="text-xs text-gray-400 mt-1">Sign in with your customer account to view your order history.</p>
            </div>
          ) : userOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                No Personal Orders Placed Yet for {currentUser.name}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                When you purchase electronic products, your private GST receipts and tracking will show here.
              </p>
            </div>
          ) : (
            userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 space-y-4"
              >
                {/* Order Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700 pb-3">
                  <div>
                    <span className="text-xs font-mono font-extrabold text-blue-600 dark:text-blue-400">
                      {order.id}
                    </span>
                    <span className="text-xs text-gray-400 ml-3">Placed on {order.date}</span>
                    {order.customerName && (
                      <span className="text-xs text-gray-500 ml-3 font-semibold">
                        Customer: {order.customerName} ({order.userEmail})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-gray-900 dark:text-white">
                      Total: {formatPrice(order.total)}
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      title="Print Invoice"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Simulated Order Progress Tracking Timeline */}
                <div className="py-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-2">
                    <span className="text-blue-600 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Order Placed
                    </span>
                    <span className="text-blue-600 font-bold flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" /> Processing & Quality Check
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Out for Delivery
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden flex">
                    <div className="w-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 h-full" />
                  </div>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1.5">
                    Estimated Delivery: {order.estimatedDelivery} (AWB: {order.trackingNumber})
                  </p>
                </div>

                {/* Items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  {order.items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3 bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                      <img src={product.image} alt="" className="w-10 h-10 object-contain p-1 bg-white rounded" />
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-[11px] text-gray-500">Qty: {quantity} • {formatPrice(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
