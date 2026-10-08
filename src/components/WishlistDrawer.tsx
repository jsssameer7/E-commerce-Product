import React from 'react';
import { Product } from '../types';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 dark:border-gray-800">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Your Saved Wishlist</h2>
            <span className="text-xs bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold px-2 py-0.5 rounded-full">
              {wishlistProducts.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-600 dark:text-gray-300">Your Wishlist is empty</p>
              <p className="text-xs text-gray-400 mt-1">Click the heart icon on any product to save it for later.</p>
            </div>
          ) : (
            wishlistProducts.map((product) => (
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
                  <p className="text-[10px] text-gray-400 capitalize">{product.brand}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onRemoveWishlist(product.id);
                    }}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                    title="Move to Cart"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveWishlist(product.id)}
                    className="p-2 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl text-xs font-bold"
          >
            Close Wishlist
          </button>
        </div>

      </div>
    </div>
  );
};
