import React from 'react';
import { Product } from '../types';
import { X, SlidersHorizontal, ArrowRight, Trash2 } from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

interface CompareBarProps {
  selectedProducts: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
  onCompare: () => void;
  maxProducts?: number;
}

export const CompareBar: React.FC<CompareBarProps> = ({
  selectedProducts,
  onRemove,
  onClear,
  onCompare,
  maxProducts = 4,
}) => {
  if (selectedProducts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-4xl bg-gray-900/95 text-white backdrop-blur-xl border border-gray-700/80 rounded-2xl shadow-2xl p-4 transition-all duration-300 animate-slide-up">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left info & thumbnails */}
        <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Compare ({selectedProducts.length}/{maxProducts})</p>
              <p className="text-[11px] text-gray-400 hidden sm:block">Select up to 4 items</p>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-700 hidden sm:block" />

          {/* Product Thumbnails list */}
          <div className="flex items-center gap-2">
            {selectedProducts.map((product) => (
              <div
                key={product.id}
                className="relative group bg-gray-800 rounded-xl p-1.5 border border-gray-700 flex items-center gap-2 pr-6 shrink-0"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded-lg bg-white"
                />
                <div className="text-left hidden md:block max-w-[100px]">
                  <p className="text-xs font-semibold truncate text-gray-200">{product.name}</p>
                  <p className="text-[10px] text-blue-400 font-medium">{formatPrice(product.price)}</p>
                </div>
                <button
                  onClick={() => onRemove(product.id)}
                  className="absolute top-1 right-1 p-0.5 text-gray-400 hover:text-rose-400 rounded-full hover:bg-gray-700 transition-colors"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Empty slots placeholders */}
            {Array.from({ length: maxProducts - selectedProducts.length }).map((_, idx) => (
              <div
                key={idx}
                className="hidden lg:flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-700 rounded-xl text-gray-500 text-xs font-medium"
              >
                +{idx + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onClear}
            className="px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white flex items-center gap-1 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear All</span>
          </button>

          <button
            onClick={onCompare}
            disabled={selectedProducts.length < 2}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              selectedProducts.length >= 2
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 hover:scale-105'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
            }`}
          >
            <span>Compare {selectedProducts.length} Items</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
