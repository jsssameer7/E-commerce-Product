import React from 'react';
import { Order } from '../types';
import { X, Package, CheckCircle2, Truck, Clock, Printer } from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const UserOrdersModal: React.FC<UserOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Order History & Live Tracking</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300">No Orders Placed Yet</p>
              <p className="text-xs text-gray-400 mt-1">When you purchase electronic products, your GST receipts and tracking will show here.</p>
            </div>
          ) : (
            orders.map((order) => (
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
                      <img src={product.image} alt="" className="w-10 h-10 object-contain" />
                      <div className="text-xs">
                        <p className="font-bold text-gray-900 dark:text-white truncate max-w-[180px]">{product.name}</p>
                        <p className="text-gray-500 font-medium">Qty: {quantity} • {formatPrice(product.price)}</p>
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
