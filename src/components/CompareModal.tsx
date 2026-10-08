import React, { useState } from 'react';
import { Product } from '../types';
import { formatPrice } from '../utils/formatCurrency';
import { 
  X, 
  Check, 
  Sparkles, 
  ShoppingCart, 
  Printer, 
  Share2, 
  Star, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Award
} from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onRemoveProduct: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  products,
  onRemoveProduct,
  onAddToCart,
}) => {
  const [highlightDifferences, setHighlightDifferences] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Key spec keys to render in table
  const specKeys: { key: keyof Product['specs']; label: string }[] = [
    { key: 'display', label: 'Display & Screen' },
    { key: 'processor', label: 'Processor / Chipset' },
    { key: 'ram', label: 'RAM / Memory' },
    { key: 'storage', label: 'Internal Storage' },
    { key: 'battery', label: 'Battery & Charging' },
    { key: 'camera', label: 'Camera System' },
    { key: 'os', label: 'Operating System' },
    { key: 'weight', label: 'Weight' },
    { key: 'waterResistance', label: 'Water Resistance' },
    { key: 'warranty', label: 'Warranty & Support' },
    { key: 'connectivity', label: 'Connectivity & Wireless' },
  ];

  // Helper to check if spec values differ across all compared products
  const isDifferent = (key: keyof Product['specs']) => {
    if (products.length < 2) return false;
    const firstVal = products[0]?.specs?.[key] || 'N/A';
    return products.some((p) => (p.specs?.[key] || 'N/A') !== firstVal);
  };

  // Metric winners calculations
  const lowestPriceId = products.reduce((prev, curr) => (curr.price < prev.price ? curr : prev), products[0])?.id;
  const highestRatingId = products.reduce((prev, curr) => (curr.rating > prev.rating ? curr : prev), products[0])?.id;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-7xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                Product Specification Comparison Engine
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Side-by-side hardware matrix ({products.length} products compared)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Highlight Differences Toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer bg-white dark:bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span>Highlight Differences</span>
            </label>

            {/* Share link */}
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors no-print"
              title="Share comparison link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? 'Copied Link!' : 'Share'}</span>
            </button>

            {/* Print matrix */}
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors no-print"
              title="Print spec table"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Matrix Table Content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">No Products Selected</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
                Select items from the catalog by clicking "Compare" to view side-by-side specifications.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="p-4 w-48 bg-gray-50/50 dark:bg-gray-900/50 text-xs font-bold uppercase tracking-wider text-gray-400 align-top">
                    Specs & Features
                  </th>

                  {products.map((product) => (
                    <th key={product.id} className="p-4 w-72 align-top text-center relative group">
                      <button
                        onClick={() => onRemoveProduct(product.id)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-rose-500 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors no-print"
                        title="Remove product"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Product Card Header */}
                      <div className="flex flex-col items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-32 h-32 object-contain rounded-2xl p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-3 group-hover:scale-105 transition-transform"
                        />
                        
                        {product.badge && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 mb-1.5">
                            {product.badge}
                          </span>
                        )}

                        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[40px]">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 text-amber-500 text-xs my-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="font-bold text-gray-900 dark:text-gray-100">{product.rating}</span>
                          <span className="text-gray-400">({product.reviewCount})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Badges for Winner metrics */}
                        <div className="flex flex-wrap items-center justify-center gap-1 my-2">
                          {product.id === lowestPriceId && products.length > 1 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                              <Award className="w-3 h-3" /> Best Price
                            </span>
                          )}
                          {product.id === highestRatingId && products.length > 1 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1">
                              <Award className="w-3 h-3" /> Top Rated
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => onAddToCart(product)}
                          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105 no-print"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                
                {/* Standout Hackathon Value & Performance Metrics Matrix Row */}
                <tr className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 font-bold">
                  <td className="p-4 text-xs font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                    Performance / Features / Value Scores
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="grid grid-cols-3 gap-1 text-[11px]">
                        <div className="p-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                          <p className="text-[9px] text-gray-400 uppercase font-bold">Perf</p>
                          <p className="font-extrabold text-blue-600 dark:text-blue-400">{product.performanceScore}/10</p>
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                          <p className="text-[9px] text-gray-400 uppercase font-bold">Feat</p>
                          <p className="font-extrabold text-indigo-600 dark:text-indigo-400">{product.featuresScore}/10</p>
                        </div>
                        <div className="p-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                          <p className="text-[9px] text-gray-400 uppercase font-bold">Value</p>
                          <p className="font-extrabold text-emerald-600 dark:text-emerald-400">{product.valueScore}/10</p>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Specification Rows */}
                {specKeys.map(({ key, label }) => {
                  const differs = isDifferent(key);
                  const isHighlighted = highlightDifferences && differs;

                  return (
                    <tr
                      key={key}
                      className={`transition-colors ${
                        isHighlighted
                          ? 'bg-amber-50/70 dark:bg-amber-950/20 font-medium'
                          : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30'
                      }`}
                    >
                      <td className="p-4 font-bold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wider bg-gray-50/40 dark:bg-gray-900/40 flex items-center gap-1.5">
                        {label}
                        {isHighlighted && (
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" title="Difference detected" />
                        )}
                      </td>

                      {products.map((product) => (
                        <td key={product.id} className="p-4 text-center text-gray-800 dark:text-gray-200 text-xs leading-relaxed">
                          {product.specs[key] || (
                            <span className="text-gray-400 italic">N/A</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}

                {/* Pros & Cons Section */}
                <tr className="bg-gray-50/80 dark:bg-gray-800/50 font-bold">
                  <td className="p-4 text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Pros & Strengths
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 align-top">
                      <ul className="space-y-1 text-left">
                        {product.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                            <Check className="w-3.5 h-3.5 shrink-0 text-emerald-500 mt-0.5" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                <tr className="bg-gray-50/80 dark:bg-gray-800/50 font-bold">
                  <td className="p-4 text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Cons / Tradeoffs
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 align-top">
                      <ul className="space-y-1 text-left">
                        {product.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-rose-700 dark:text-rose-400">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500 mt-0.5" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Key Highlights */}
                <tr>
                  <td className="p-4 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 bg-gray-50/40 dark:bg-gray-900/40">
                    Key Highlights
                  </td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4 align-top">
                      <ul className="space-y-1.5 text-left">
                        {product.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-blue-500 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

              </tbody>
            </table>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            * All specifications verified against manufacturer documentation.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 rounded-xl text-xs font-extrabold hover:opacity-90 transition-opacity"
          >
            Close Comparison Matrix
          </button>
        </div>

      </div>
    </div>
  );
};
