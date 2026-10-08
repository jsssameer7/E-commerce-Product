import React from 'react';
import { FilterState, CategoryType } from '../types';
import { Filter, RotateCcw, Star, Check, ChevronDown } from 'lucide-react';
import { formatPrice } from '../utils/formatCurrency';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableBrands: string[];
  totalProductsCount: number;
  filteredCount: number;
  onReset: () => void;
}

const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'smartphones', label: 'Smartphones' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'audio', label: 'Audio & Sound' },
  { id: 'wearables', label: 'Smartwatches' },
  { id: 'gaming', label: 'Gaming Consoles' },
  { id: 'cameras', label: 'Cameras & Drones' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  availableBrands,
  totalProductsCount,
  filteredCount,
  onReset,
}) => {
  const handleBrandToggle = (brand: string) => {
    setFilters((prev) => {
      const exists = prev.selectedBrands.includes(brand);
      const newBrands = exists
        ? prev.selectedBrands.filter((b) => b !== brand)
        : [...prev.selectedBrands, brand];
      return { ...prev, selectedBrands: newBrands };
    });
  };

  return (
    <aside className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm space-y-6">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white">Filters</h2>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold px-2 py-0.5 rounded-full">
            {filteredCount}/{totalProductsCount}
          </span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-gray-500 hover:text-rose-500 flex items-center gap-1 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          Sort By
        </label>
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
            className="w-full appearance-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-semibold px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="featured">Featured / Best Sellers</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Category Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          Category
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters((prev) => ({ ...prev, category: cat.id }))}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                filters.category === cat.id
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span>{cat.label}</span>
              {filters.category === cat.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider & Inputs */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Price Range
          </label>
          <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400">
            {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
          </span>
        </div>
        
        <input
          type="range"
          min={0}
          max={400000}
          step={5000}
          value={filters.priceRange[1]}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              priceRange: [prev.priceRange[0], Number(e.target.value)],
            }))
          }
          className="w-full accent-blue-600 cursor-pointer"
        />

        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">₹</span>
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [Number(e.target.value), prev.priceRange[1]],
                }))
              }
              className="w-full pl-6 pr-2 py-1.5 bg-gray-50 dark:bg-gray-800 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              placeholder="Min"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">₹</span>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], Number(e.target.value)],
                }))
              }
              className="w-full pl-6 pr-2 py-1.5 bg-gray-50 dark:bg-gray-800 text-xs font-semibold rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Brand Checkboxes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          Brands
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {availableBrands.map((brand) => {
            const isChecked = filters.selectedBrands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-1.5 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandToggle(brand)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="font-semibold">{brand}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          Minimum Rating
        </label>
        <div className="flex items-center gap-2">
          {[0, 4.0, 4.5, 4.8].map((ratingVal) => (
            <button
              key={ratingVal}
              onClick={() => setFilters((prev) => ({ ...prev, minRating: ratingVal }))}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors ${
                filters.minRating === ratingVal
                  ? 'bg-amber-400 text-gray-900 shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {ratingVal === 0 ? (
                'Any'
              ) : (
                <>
                  <span>{ratingVal}</span>
                  <Star className="w-3 h-3 fill-current" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Toggle */}
      <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
        <label className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
        </label>
      </div>

    </aside>
  );
};
