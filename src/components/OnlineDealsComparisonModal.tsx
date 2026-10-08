import React from 'react';
import { Product } from '../types';
import { getSellerDeals } from '../utils/getSellerDeals';
import { formatPrice } from '../utils/formatCurrency';
import { 
  X, 
  ExternalLink, 
  Trophy, 
  Tag, 
  Truck, 
  ShieldCheck, 
  Star, 
  Building2, 
  ShoppingBag
} from 'lucide-react';

interface OnlineDealsComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const OnlineDealsComparisonModal: React.FC<OnlineDealsComparisonModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  if (!isOpen || !product) return null;

  const deals = getSellerDeals(product);

  const getStoreBadgeColor = (storeName: string) => {
    switch (storeName) {
      case 'Amazon India':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30';
      case 'Flipkart':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30';
      case 'Reliance Digital':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between border-b border-blue-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-2xl shadow-md">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black flex items-center gap-2">
                Live Online Seller Price Comparison Engine
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                  TOP 4 STORES
                </span>
              </h2>
              <p className="text-xs text-blue-200">
                Comparing prices & offers across Amazon, Flipkart, Reliance Digital & Authorized Retailers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Product Summary Banner */}
        <div className="p-4 bg-blue-50/60 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 object-contain bg-white rounded-xl p-2 border shadow-sm"
          />
          <div>
            <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
              {product.brand} • {product.category}
            </span>
            <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500">
              MSRP: <span className="font-extrabold text-gray-800 dark:text-gray-200">{formatPrice(product.price)}</span>
            </p>
          </div>
        </div>

        {/* Store Ranking Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            <span>Ranked Top 4 Online Retailer Deals</span>
            <span>Sorted by Lowest Price & Best Offers</span>
          </div>

          {deals.map((deal) => (
            <div
              key={deal.id}
              className={`relative rounded-2xl p-4 sm:p-5 transition-all border ${
                deal.isBestDeal
                  ? 'bg-gradient-to-r from-amber-500/10 via-white to-blue-500/10 dark:from-amber-950/30 dark:via-gray-900 dark:to-blue-950/30 border-2 border-amber-500/60 shadow-xl'
                  : 'bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 hover:border-blue-400'
              }`}
            >
              {/* Rank Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm ${
                      deal.isBestDeal
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-800 dark:bg-gray-700 text-white'
                    }`}
                  >
                    {deal.isBestDeal ? <Trophy className="w-3.5 h-3.5 text-amber-200" /> : null}
                    RANK #{deal.rank} {deal.isBestDeal ? '— BEST DEAL' : ''}
                  </span>

                  <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStoreBadgeColor(deal.storeName)}`}>
                    <Building2 className="w-3.5 h-3.5 inline mr-1" />
                    {deal.storeName}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{deal.storeRating} Seller Score</span>
                </div>
              </div>

              {/* Deal Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Price & Savings */}
                <div className="md:col-span-4 space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Store Deal Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {formatPrice(deal.price)}
                    </span>
                    {deal.originalPrice > deal.price && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(deal.originalPrice)}
                      </span>
                    )}
                  </div>
                  {deal.originalPrice > deal.price && (
                    <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300">
                      Save {formatPrice(deal.originalPrice - deal.price)} ({Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}% OFF)
                    </span>
                  )}
                </div>

                {/* Offer & Delivery Info */}
                <div className="md:col-span-5 space-y-2 text-xs">
                  <div className="flex items-start gap-1.5 text-blue-900 dark:text-blue-200 font-semibold bg-blue-50 dark:bg-blue-950/60 p-2 rounded-xl border border-blue-100 dark:border-blue-900/40">
                    <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>{deal.bankOffer}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                    <Truck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{deal.deliverySpeed}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>{deal.warrantyInfo}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="md:col-span-3 flex justify-end">
                  <a
                    href={deal.buyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all ${
                      deal.isBestDeal
                        ? 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-105'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <span>Buy from {deal.storeName}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
