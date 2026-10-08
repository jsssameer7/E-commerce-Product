import React, { useState } from 'react';
import { 
  Scale, 
  ShoppingCart, 
  Heart, 
  Package, 
  SlidersHorizontal, 
  Search, 
  Sun, 
  Moon, 
  ShieldAlert,
  Sparkles,
  Bot,
  User as UserIcon,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { CategoryType, User } from '../types';

interface HeaderProps {
  category: CategoryType;
  setCategory: (c: CategoryType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  compareCount: number;
  openCompareModal: () => void;
  cartCount: number;
  openCartDrawer: () => void;
  wishlistCount: number;
  openWishlistModal: () => void;
  openOrdersModal: () => void;
  openAdminModal: () => void;
  openRecommendationModal: () => void;
  user: User | null;
  openAuthModal: () => void;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
}

const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'smartphones', label: 'Smartphones' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'tv', label: 'TVs & Displays' },
  { id: 'audio', label: 'Audio & Sound' },
  { id: 'wearables', label: 'Smartwatches' },
  { id: 'gaming', label: 'Gaming Consoles' },
  { id: 'cameras', label: 'Cameras & Drones' },
];

export const Header: React.FC<HeaderProps> = ({
  category,
  setCategory,
  searchQuery,
  setSearchQuery,
  compareCount,
  openCompareModal,
  cartCount,
  openCartDrawer,
  wishlistCount,
  openWishlistModal,
  openOrdersModal,
  openAdminModal,
  openRecommendationModal,
  user,
  openAuthModal,
  onLogout,
  darkMode,
  setDarkMode,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors">
      {/* Top Announcement Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
        <span>Compare specs side-by-side! Save 10% with code <strong className="underline underline-offset-2">TECH10</strong></span>
        <span className="hidden sm:inline">| Free Express Shipping on orders over ₹4,999</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setCategory('all'); setSearchQuery(''); }}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  ElectroCompare
                </span>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
                  Shop & Spec Engine
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-2 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products, brands, screen sizes, processors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-900 focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Actions: Compare, AI Recommender, User Account, Wishlist, Orders, Cart, Theme, Admin */}
          <div className="flex items-center gap-2">
            
            {/* AI Smart Recommender Button */}
            <button
              onClick={openRecommendationModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-extrabold hover:bg-indigo-100 transition-all shadow-sm"
              title="AI Smart Product Recommendation System"
            >
              <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">AI Recommender</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>

            {/* User Account / Sign In Control */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="User Profile Menu"
                >
                  <img src={user.avatar} alt="" className="w-7 h-7 rounded-full object-cover border border-blue-500" />
                  <span className="text-xs font-bold text-gray-900 dark:text-white hidden lg:inline max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-2 z-50 text-xs space-y-1">
                    <div className="p-2.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700 mb-1">
                      <p className="font-extrabold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                      <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded mt-1 ${
                        user.role === 'admin' ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                      }`}>
                        {user.role === 'admin' ? '🛡️ Seller Admin' : '👤 Customer Account'}
                      </span>
                    </div>

                    <button
                      onClick={() => { setShowUserDropdown(false); openOrdersModal(); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-blue-600" />
                      <span>My Orders & Tracking</span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => { setShowUserDropdown(false); openAdminModal(); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 font-semibold flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>Seller Admin Panel</span>
                      </button>
                    )}

                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

                    <button
                      onClick={() => { setShowUserDropdown(false); onLogout(); }}
                      className="w-full text-left px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 font-bold flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out Account</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-extrabold hover:bg-blue-100 transition-all shadow-sm"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Compare Button */}
            <button
              onClick={openCompareModal}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                compareCount > 0
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title="Compare Selected Products"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Compare</span>
              {compareCount > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={openWishlistModal}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Orders Button */}
            <button
              onClick={openOrdersModal}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block"
              title="My Orders & Tracking"
            >
              <Package className="w-5 h-5" />
            </button>

            {/* Admin Panel Toggle */}
            <button
              onClick={openAdminModal}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden lg:block"
              title="Seller & Product Management"
            >
              <ShieldAlert className="w-5 h-5" />
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCartDrawer}
              className="relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all hover:scale-105"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-white text-blue-600 text-xs font-extrabold rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl border border-transparent focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Navigation Category Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar border-t border-gray-100 dark:border-gray-800/60">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

      </div>
    </header>
  );
};
