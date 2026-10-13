import React, { useState } from 'react';
import { Order, User } from '../types';
import { 
  X, 
  Package, 
  CheckCircle2, 
  Truck, 
  Clock, 
  Printer, 
  User as UserIcon, 
  ShieldCheck, 
  Navigation, 
  AlertCircle
} from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currentUser?: User | null;
  onUpdateOrderStatus?: (orderId: string, newStatus: Order['status'], newTrackingNumber?: string, newEstimatedDelivery?: string) => void;
}

export const UserOrdersModal: React.FC<UserOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  currentUser,
  onUpdateOrderStatus,
}) => {
  // Admin view filter toggle
  const [adminViewMode, setAdminViewMode] = useState<'my-orders' | 'all-orders'>('my-orders');

  if (!isOpen) return null;

  // Strict Order Isolation: customer sees ONLY their own orders
  const userOrders = orders.filter((order) => {
    if (!currentUser) return false;

    const isOwnOrder = 
      (order.userId && order.userId === currentUser.id) ||
      (Boolean(order.userEmail) && Boolean(currentUser.email) && order.userEmail?.toLowerCase() === currentUser.email?.toLowerCase());

    if (currentUser.role === 'admin') {
      return adminViewMode === 'all-orders' ? true : isOwnOrder;
    }

    // Regular customers see strictly their own verified orders
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
              <span>Seller Admin Order Rights Active</span>
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
                No Orders Placed Yet for {currentUser.name}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                When you purchase electronic products, your private GST receipts and live tracking will show here.
              </p>
            </div>
          ) : (
            userOrders.map((order) => {
              // Calculate status progression
              const isProcessing = order.status === 'Processing';
              const isShipped = order.status === 'Shipped';
              const isOutForDelivery = order.status === 'Out for Delivery';
              const isDelivered = order.status === 'Delivered';
              const isCancelled = order.status === 'Cancelled';

              let progressWidth = '25%';
              if (isShipped) progressWidth = '55%';
              else if (isOutForDelivery) progressWidth = '80%';
              else if (isDelivered) progressWidth = '100%';
              else if (isCancelled) progressWidth = '100%';

              return (
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
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isDelivered
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : isOutForDelivery
                            ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 animate-pulse'
                            : isShipped
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : isCancelled
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {isDelivered && <CheckCircle2 className="w-3 h-3" />}
                        {isOutForDelivery && <Navigation className="w-3 h-3" />}
                        {isShipped && <Truck className="w-3 h-3" />}
                        {isProcessing && <Clock className="w-3 h-3" />}
                        {isCancelled && <AlertCircle className="w-3 h-3" />}
                        <span>{order.status}</span>
                      </span>

                      <span className="text-xs font-extrabold text-gray-900 dark:text-white ml-2">
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

                  {/* Dynamic Order Progress Tracking Timeline */}
                  {!isCancelled ? (
                    <div className="py-2 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500">
                        {/* Step 1: Placed */}
                        <span className="text-blue-600 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Order Placed
                        </span>

                        {/* Step 2: Processing */}
                        <span className={`flex items-center gap-1 ${
                          isProcessing || isShipped || isOutForDelivery || isDelivered ? 'text-blue-600 font-bold' : 'text-gray-400'
                        }`}>
                          <Package className="w-3.5 h-3.5" /> Processing & QC
                        </span>

                        {/* Step 3: Shipped / In Transit */}
                        <span className={`flex items-center gap-1 ${
                          isShipped || isOutForDelivery || isDelivered ? 'text-blue-600 font-bold' : 'text-gray-400'
                        }`}>
                          <Truck className="w-3.5 h-3.5" /> Shipped
                        </span>

                        {/* Step 4: Out for Delivery */}
                        <span className={`flex items-center gap-1 ${
                          isOutForDelivery ? 'text-indigo-600 font-black animate-pulse' : isDelivered ? 'text-blue-600 font-bold' : 'text-gray-400'
                        }`}>
                          <Navigation className="w-3.5 h-3.5" /> Out for Delivery
                        </span>

                        {/* Step 5: Delivered */}
                        <span className={`flex items-center gap-1 ${
                          isDelivered ? 'text-emerald-600 font-black' : 'text-gray-400'
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            isDelivered 
                              ? 'bg-emerald-500' 
                              : isOutForDelivery 
                              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600' 
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                          }`}
                          style={{ width: progressWidth }}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-[11px] pt-1">
                        <p className="text-emerald-600 dark:text-emerald-400 font-bold">
                          Estimated Delivery: {order.estimatedDelivery}
                        </p>
                        <p className="text-gray-500 font-mono">
                          AWB Courier Tracking: <strong className="text-blue-600 dark:text-blue-400">{order.trackingNumber}</strong>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>This order has been cancelled. A refund of {formatPrice(order.total)} has been processed.</span>
                    </div>
                  )}

                  {/* Items preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    {order.items.map(({ product, quantity }) => (
                      <div key={product.id} className="flex items-center gap-3 bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                        <img src={product.image} alt="" className="w-10 h-10 object-contain p-1 bg-white rounded" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{product.name}</p>
                          <p className="text-[11px] text-gray-500">Qty: {quantity} • {formatPrice(product.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SELLER INLINE CONTROL (If Admin is viewing) */}
                  {currentUser?.role === 'admin' && onUpdateOrderStatus && (
                    <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-amber-600" /> Seller Admin Rights:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-600 dark:text-gray-300 font-semibold">Change Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="px-2 py-1 bg-white dark:bg-gray-800 rounded-lg border border-amber-300 dark:border-amber-700 text-xs font-bold text-gray-900 dark:text-white"
                        >
                          <option value="Processing">🟡 Processing</option>
                          <option value="Shipped">🔵 Shipped</option>
                          <option value="Out for Delivery">🟣 Out for Delivery</option>
                          <option value="Delivered">🟢 Delivered</option>
                          <option value="Cancelled">🔴 Cancelled</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Payment & Customer Actions Footer */}
                  <div className="pt-2 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-500">Payment Status:</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {order.status === 'Cancelled' ? 'REFUNDED (₹' + order.total.toLocaleString('en-IN') + ')' : 'PAID & VERIFIED'}
                      </span>
                    </div>

                    {!isCancelled && !isDelivered && (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to cancel Order ${order.id}?`)) {
                            onUpdateOrderStatus?.(order.id, 'Cancelled');
                          }
                        }}
                        className="text-rose-600 hover:text-rose-700 dark:text-rose-400 font-bold hover:underline"
                      >
                        Cancel Order & Request Refund
                      </button>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
