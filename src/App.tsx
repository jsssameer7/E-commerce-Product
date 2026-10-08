import React, { useState, useEffect, useMemo } from 'react';
import { Product, FilterState, CartItem, Coupon, Order, Review, User } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { INITIAL_REVIEWS } from './data/reviews';
import { getProductsFromSupabase, createOrderInSupabase, createProductInSupabase, isSupabaseConfigured } from './lib/supabase';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { FilterSidebar } from './components/FilterSidebar';
import { CompareBar } from './components/CompareBar';
import { CompareModal } from './components/CompareModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { RecommendationModal } from './components/RecommendationModal';
import { AuthModal, AuthContent } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { UserOrdersModal } from './components/UserOrdersModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { OnlineDealsComparisonModal } from './components/OnlineDealsComparisonModal';
import { Footer } from './components/Footer';
import { Sparkles, SlidersHorizontal, CheckCircle2, Grid, List, Bot, Sun, Moon, Scale, Tag, Trophy } from 'lucide-react';

export const App: React.FC = () => {
  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('electro_dark_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('electro_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Catalog & Reviews State
  const [products, setProducts] = useState<Product[]>(() => {
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    async function loadSupabaseData() {
      if (isSupabaseConfigured) {
        const fetchedProducts = await getProductsFromSupabase();
        if (fetchedProducts && fetchedProducts.length > 0) {
          const existingIds = new Set(fetchedProducts.map((p) => p.id));
          const missingFromSupabase = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
          setProducts([...fetchedProducts, ...missingFromSupabase]);
        } else {
          setProducts(INITIAL_PRODUCTS);
        }
      }
    }
    loadSupabaseData();
  }, []);

  useEffect(() => {
    localStorage.setItem('electro_products', JSON.stringify(products));
  }, [products]);

  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    searchQuery: '',
    priceRange: [0, 400000],
    selectedBrands: [],
    minRating: 0,
    inStockOnly: false,
    sortBy: 'featured',
  });

  // Comparison State
  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);

  // Cart & Wishlist State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('electro_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('electro_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('electro_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('electro_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('electro_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('electro_orders', JSON.stringify(orders));
  }, [orders]);

  // User Session State (null by default so visitors MUST login or signup first)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('electro_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('electro_user_session', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('electro_user_session');
    }
  }, [currentUser]);

  // Modal Controllers
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [dealsProduct, setDealsProduct] = useState<Product | null>(null);

  // View mode grid vs list
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Available brands computed dynamically from products catalog
  const availableBrands = useMemo(() => {
    const brandsSet = new Set(products.map((p) => p.brand));
    return Array.from(brandsSet).sort();
  }, [products]);

  // Toggle comparison item
  const handleToggleCompare = (product: Product) => {
    setComparedProductIds((prev) => {
      if (prev.includes(product.id)) {
        showToast(`Removed ${product.name} from comparison.`);
        return prev.filter((id) => id !== product.id);
      } else {
        if (prev.length >= 4) {
          showToast('Comparison limit reached (max 4 products).');
          return prev;
        }
        showToast(`Added ${product.name} to comparison!`);
        return [...prev, product.id];
      }
    });
  };

  // Toggle wishlist item
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        showToast(`Removed from Wishlist`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved ${product.name} to Wishlist!`);
        return [...prev, product.id];
      }
    });
  };

  // Cart Management
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} (${quantity}) to Cart!`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Admin Stock Updates
  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
    showToast('Inventory stock updated!');
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    if (isSupabaseConfigured) {
      createProductInSupabase(newProduct);
    }
    showToast(`Added ${newProduct.name} to active store! Live for all customers.`);
  };

  // Filter products pipeline
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category
        if (filters.category !== 'all' && p.category !== filters.category) return false;

        // Search Query (matches name, brand, description, specs)
        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(query);
          const matchBrand = p.brand.toLowerCase().includes(query);
          const matchDesc = p.description.toLowerCase().includes(query);
          const matchSpecs = Object.values(p.specs).some(
            (val) => val && val.toLowerCase().includes(query)
          );
          if (!matchName && !matchBrand && !matchDesc && !matchSpecs) return false;
        }

        // Price Range
        if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false;

        // Selected Brands
        if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(p.brand)) return false;

        // Min Rating
        if (filters.minRating > 0 && p.rating < filters.minRating) return false;

        // In Stock Only
        if (filters.inStockOnly && p.stock <= 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'value') return b.valueScore - a.valueScore;
        if (filters.sortBy === 'newest') return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        // Default 'featured': prioritize badges & rating
        return b.rating * b.reviewCount - a.rating * a.reviewCount;
      });
  }, [products, filters]);

  const comparedProducts = useMemo(() => {
    return products.filter((p) => comparedProductIds.includes(p.id));
  }, [products, comparedProductIds]);

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  const resetFilters = () => {
    setFilters({
      category: 'all',
      searchQuery: '',
      priceRange: [0, 400000],
      selectedBrands: [],
      minRating: 0,
      inStockOnly: false,
      sortBy: 'featured',
    });
  };

  // Mandatory Login / Sign Up Gate: When a user enters the website, they MUST login or signup first
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-gray-900 text-white flex flex-col justify-between p-4 sm:p-8 animate-fade-in">
        {/* Top Navbar Header */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">ElectroCompare</h1>
              <p className="text-[10px] text-blue-300 font-extrabold uppercase tracking-wider">Shopping & Spec Portal</p>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-blue-300" />}
          </button>
        </div>

        {/* Main Center Auth Container */}
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-center">
          
          {/* Left Side: Portal Welcome & Highlights */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" /> Authentication Required
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Sign In to Access Electronics Shopping Portal
            </h2>

            <p className="text-sm text-gray-300 leading-relaxed font-normal">
              Compare prices across top Indian online sellers (<strong>Amazon, Flipkart, Reliance Digital, Croma</strong>). Evaluate specifications side-by-side and find the #1 best value deals.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-blue-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-blue-400" /> 4 Store Deal Comparison
                </div>
                <p className="text-xs text-gray-400">Live prices, savings & bank cashback offers ranked #1 to #4.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="text-indigo-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" /> Winner Rank Engine
                </div>
                <p className="text-xs text-gray-400">Automatic overall composite scoring matrix out of 10.</p>
              </div>
            </div>
          </div>

          {/* Right Side: Inline Auth Form Component */}
          <div className="lg:col-span-6">
            <AuthContent
              onLoginSuccess={(loggedInUser) => {
                setCurrentUser(loggedInUser);
                showToast(`Welcome ${loggedInUser.name}!`);
              }}
            />
          </div>

        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 py-4 border-t border-white/10">
          © 2026 ElectroCompare Shopping Portal. All specifications & seller prices verified live.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors">
      
      {/* Toast Banner Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-3 rounded-2xl shadow-2xl border border-gray-700 dark:border-gray-200 flex items-center gap-2 text-xs font-bold animate-slide-down">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Navigation Header */}
      <Header
        category={filters.category}
        setCategory={(cat) => setFilters((prev) => ({ ...prev, category: cat }))}
        searchQuery={filters.searchQuery}
        setSearchQuery={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        compareCount={comparedProductIds.length}
        openCompareModal={() => setIsCompareModalOpen(true)}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        openCartDrawer={() => setIsCartDrawerOpen(true)}
        wishlistCount={wishlistIds.length}
        openWishlistModal={() => setIsWishlistDrawerOpen(true)}
        openOrdersModal={() => setIsOrdersModalOpen(true)}
        openAdminModal={() => setIsAdminModalOpen(true)}
        openRecommendationModal={() => setIsRecommendationModalOpen(true)}
        user={currentUser}
        openAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Signed out successfully.');
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Page Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section Banner */}
        <div className="relative mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl overflow-hidden border border-blue-800/40">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/30 text-blue-300 border border-blue-400/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> SmartElectro — Electronics Comparison & Shopping Portal
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Compare Specs & Get AI Product Recommendations
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/80 mt-2 leading-relaxed">
              Evaluate real-time hardware specifications, OLED displays, battery benchmarks, and calculated value scores across leading tech brands before you buy.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => setIsRecommendationModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-500/30 flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Bot className="w-4 h-4" />
                <span>Smart AI Recommendation Engine</span>
              </button>

              <button
                onClick={() => setIsCompareModalOpen(true)}
                disabled={comparedProductIds.length < 2}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                  comparedProductIds.length >= 2
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:scale-105'
                    : 'bg-white/10 text-gray-400 border border-white/10 cursor-not-allowed'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Compare Matrix ({comparedProductIds.length}/4)</span>
              </button>
            </div>
          </div>

          <div className="absolute right-[-40px] bottom-[-40px] w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Content Container: Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Filters */}
          <div className="lg:col-span-3">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              availableBrands={availableBrands}
              totalProductsCount={products.length}
              filteredCount={filteredProducts.length}
              onReset={resetFilters}
            />
          </div>

          {/* Right Column: Active Products Display */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Header bar above product grid */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-gray-900 dark:text-white capitalize">
                  {filters.category === 'all' ? 'All Electronic Products' : filters.category}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Showing {filteredProducts.length} items
                  {filters.searchQuery && ` matching "${filters.searchQuery}"`}
                </p>
              </div>

              {/* View layout toggle */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
                <SlidersHorizontal className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">No Products Found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                  No electronic items matched your current filter selection or search query.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Products Grid / List */
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isCompared={comparedProductIds.includes(product.id)}
                    onToggleCompare={handleToggleCompare}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onQuickView={(p) => setQuickViewProduct(p)}
                    onOpenDeals={(p) => setDealsProduct(p)}
                  />
                ))}
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Floating Bottom Comparison Drawer */}
      <CompareBar
        selectedProducts={comparedProducts}
        onRemove={(id) => setComparedProductIds((prev) => prev.filter((i) => i !== id))}
        onClear={() => setComparedProductIds([])}
        onCompare={() => setIsCompareModalOpen(true)}
      />

      {/* Modals & Overlays */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={comparedProducts}
        onRemoveProduct={(id) => setComparedProductIds((prev) => prev.filter((i) => i !== id))}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      <RecommendationModal
        isOpen={isRecommendationModalOpen}
        onClose={() => setIsRecommendationModalOpen(false)}
        products={products}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onToggleCompare={handleToggleCompare}
        isCompared={(id) => comparedProductIds.includes(id)}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setCurrentUser(loggedInUser);
          showToast(`Signed in as ${loggedInUser.name}!`);
        }}
      />

      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(p, q) => handleAddToCart(p, q)}
        isCompared={quickViewProduct ? comparedProductIds.includes(quickViewProduct.id) : false}
        onToggleCompare={handleToggleCompare}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        reviews={reviews}
        onAddReview={(newRev) => {
          setReviews((prev) => [
            {
              ...newRev,
              id: 'rev-' + Date.now(),
              date: new Date().toISOString().split('T')[0],
              helpfulCount: 0,
            },
            ...prev,
          ]);
          showToast('Customer review posted!');
        }}
      />

      <OnlineDealsComparisonModal
        isOpen={!!dealsProduct}
        onClose={() => setDealsProduct(null)}
        product={dealsProduct}
      />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        onProceedToCheckout={() => setIsCheckoutModalOpen(true)}
      />

      <WishlistDrawer
        isOpen={isWishlistDrawerOpen}
        onClose={() => setIsWishlistDrawerOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveWishlist={(id) => setWishlistIds((prev) => prev.filter((i) => i !== id))}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cartItems}
        appliedCoupon={appliedCoupon}
        currentUser={currentUser}
        onOrderPlaced={(newOrder) => {
          setOrders((prev) => [newOrder, ...prev]);
          if (isSupabaseConfigured) {
            createOrderInSupabase(newOrder, currentUser?.id);
          }
          setAppliedCoupon(null);
        }}
        onClearCart={() => setCartItems([])}
      />

      <UserOrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        orders={orders}
        currentUser={currentUser}
      />

      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateStock={handleUpdateStock}
      />

      {/* Footer */}
      <Footer onCategorySelect={(cat) => setFilters((prev) => ({ ...prev, category: cat }))} />

    </div>
  );
};
