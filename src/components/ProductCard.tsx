import React from 'react';
import { Product } from '../types';
import { Star, Heart, ShoppingCart, SlidersHorizontal, Eye, Check } from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

interface ProductCardProps {
  product: Product;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onOpenDeals?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isCompared,
  onToggleCompare,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
  onOpenDeals,
}) => {
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Media Area */}
      <div className="relative aspect-square w-full bg-gray-50 dark:bg-gray-800/40 p-6 flex items-center justify-center overflow-hidden">
        
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-600 text-white shadow-md">
            {product.badge}
          </span>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 right-12 z-10 text-[10px] font-black px-2 py-0.5 rounded-lg bg-rose-500 text-white shadow-sm">
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-md scale-110'
              : 'bg-white/80 dark:bg-gray-900/80 text-gray-500 hover:text-rose-500 hover:bg-white dark:hover:bg-gray-900'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Hover Overlay Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onQuickView(product)}
            className="bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 hover:bg-blue-600 hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Specs</span>
          </button>
          {onOpenDeals && (
            <button
              onClick={() => onOpenDeals(product)}
              className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-lg flex items-center gap-1 hover:bg-emerald-700 transition-all transform translate-y-2 group-hover:translate-y-0"
            >
              <span>4 Store Deals</span>
            </button>
          )}
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-semibold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
              {product.brand}
            </span>
            <span className="capitalize text-[11px] text-gray-500">{product.category}</span>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => onQuickView(product)}
            className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Star Rating & Value Score Badge */}
          <div className="flex items-center justify-between mt-1.5 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-xs font-extrabold text-gray-900 dark:text-gray-100">
                {product.rating}
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                ({product.reviewCount})
              </span>
            </div>

            {/* Standout Hackathon Value Rating */}
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800" title="Calculated Value Score">
              Value {product.valueScore}/10
            </span>
          </div>

          {/* Spec Summary Pills */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.specs.display && (
              <span className="text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                {product.specs.display.split('(')[0]}
              </span>
            )}
            {product.specs.processor && (
              <span className="text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                {product.specs.processor}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Bottom Action Row */}
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base font-black text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            {/* Compare Checkbox Toggle */}
            <button
              onClick={() => onToggleCompare(product)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                isCompared
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {isCompared ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Comparing</span>
                </>
              ) : (
                <>
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Compare</span>
                </>
              )}
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={() => onAddToCart(product)}
              className="flex items-center justify-center gap-1.5 py-2 px-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-transform active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add Cart</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
