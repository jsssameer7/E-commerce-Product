import React, { useState } from 'react';
import { Product, Review } from '../types';
import { formatPrice } from '../utils/formatCurrency';
import { getSellerDeals } from '../utils/getSellerDeals';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Heart, 
  SlidersHorizontal, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  ExternalLink,
  Building2
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  isCompared: boolean;
  onToggleCompare: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  reviews: Review[];
  onAddReview: (newReview: Omit<Review, 'id' | 'date' | 'helpfulCount'>) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isCompared,
  onToggleCompare,
  isWishlisted,
  onToggleWishlist,
  reviews,
  onAddReview,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'deals' | 'reviews'>('specs');
  const [zipCode, setZipCode] = useState<string>('');
  const [shippingEstimate, setShippingEstimate] = useState<string | null>(null);

  // Review submission state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittedReviewSuccess, setSubmittedReviewSuccess] = useState(false);

  if (!product) return null;

  const currentImage = selectedImage || product.image;
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleZipCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode.trim()) return;
    setShippingEstimate(`Express 2-Day Delivery guaranteed to PIN Code ${zipCode}! Free delivery available.`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || !reviewTitle || !reviewComment) return;
    onAddReview({
      productId: product.id,
      author: reviewAuthor,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      verified: true,
    });
    setSubmittedReviewSuccess(true);
    setReviewTitle('');
    setReviewComment('');
    setTimeout(() => setSubmittedReviewSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <span className="uppercase text-blue-600 font-bold">{product.brand}</span>
            <span>/</span>
            <span className="capitalize">{product.category}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Gallery */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square w-full bg-gray-50 dark:bg-gray-800/40 rounded-2xl p-6 flex items-center justify-center border border-gray-200 dark:border-gray-800">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain transition-all duration-300"
              />
              {product.badge && (
                <span className="absolute top-4 left-4 text-xs font-extrabold px-3 py-1 rounded-full bg-blue-600 text-white shadow-md">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails list */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-16 h-16 rounded-xl p-1.5 border-2 transition-all ${
                      currentImage === imgUrl
                        ? 'border-blue-600 scale-105'
                        : 'border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-gray-600 dark:text-gray-400">
              <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center">
                <Truck className="w-4 h-4 text-blue-600 mb-1" />
                <span className="font-semibold">Free Delivery</span>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                <span className="font-semibold">India Warranty</span>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="font-semibold">7-Day Replace</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Actions, & Specs Tabs */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews summary */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-1 text-sm font-bold text-gray-900 dark:text-gray-100">{product.rating}</span>
                </div>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  {productReviews.length} Verified Reviews
                </span>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {product.stock} items in stock
                </span>
              </div>

              {/* Price section */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-black text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice > product.price && (
                  <span className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Delivery Calculator */}
              <div className="mt-4 p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl">
                <form onSubmit={handleZipCheck} className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Delivery PIN:</span>
                  <input
                    type="text"
                    placeholder="e.g. 400001..."
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="px-2.5 py-1 text-xs bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white w-28"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Check PIN
                  </button>
                </form>
                {shippingEstimate && (
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mt-2">
                    {shippingEstimate}
                  </p>
                )}
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                {/* Quantity picker */}
                <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-8 h-8 flex items-center justify-center font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => onAddToCart(product, quantity)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-extrabold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add {quantity} to Cart - {formatPrice(product.price * quantity)}</span>
                </button>

                {/* Compare Toggle Button */}
                <button
                  onClick={() => onToggleCompare(product)}
                  className={`p-3 rounded-xl border transition-all ${
                    isCompared
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title="Toggle compare"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>

                {/* Wishlist Toggle Button */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-all ${
                    isWishlisted
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title="Toggle wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

            </div>

            {/* Bottom Tabs: Specs / Reviews / Shipping */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
              <div className="flex border-b border-gray-200 dark:border-gray-800 gap-4 mb-4">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === 'specs'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Full Technical Specs
                </button>
                <button
                  onClick={() => setActiveTab('deals')}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === 'deals'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  🏷️ Top 4 Store Deals (Amazon/Flipkart)
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === 'reviews'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Reviews ({productReviews.length})
                </button>
              </div>

              {/* Tab 1: Specs Table */}
              {activeTab === 'specs' && (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  <table className="w-full text-xs">
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {Object.entries(product.specs).map(([key, val]) => (
                        <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                          <td className="py-2 px-1 font-bold text-gray-500 dark:text-gray-400 capitalize w-1/3">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </td>
                          <td className="py-2 px-1 text-gray-900 dark:text-gray-100 font-medium">
                            {val}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 2: Top 4 Online Store Deals */}
              {activeTab === 'deals' && (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  <div className="p-2 bg-blue-50/80 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 font-bold flex items-center justify-between">
                    <span>🏆 Store Price Comparison Engine</span>
                    <span>Ranked #1 to #4</span>
                  </div>
                  {getSellerDeals(product).map((deal) => (
                    <div
                      key={deal.id}
                      className={`p-3 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-3 ${
                        deal.isBestDeal
                          ? 'bg-amber-500/10 border-amber-500/50 dark:bg-amber-950/30'
                          : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${deal.isBestDeal ? 'bg-amber-500 text-white' : 'bg-gray-700 text-white'}`}>
                            RANK #{deal.rank}
                          </span>
                          <span className="font-extrabold text-gray-900 dark:text-white flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-blue-600" />
                            {deal.storeName}
                          </span>
                          <span className="text-[10px] text-amber-500 font-bold">({deal.storeRating} ★)</span>
                        </div>
                        <p className="text-[11px] text-gray-600 dark:text-gray-300 font-medium">{deal.bankOffer}</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{deal.deliverySpeed}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{formatPrice(deal.price)}</p>
                          <p className="text-[10px] text-gray-400 line-through">{formatPrice(deal.originalPrice)}</p>
                        </div>
                        <a
                          href={deal.buyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                        >
                          <span>Buy</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                  {/* Reviews List */}
                  {productReviews.length === 0 ? (
                    <p className="text-xs text-gray-500 italic">No reviews submitted yet for this product. Be the first!</p>
                  ) : (
                    productReviews.map((rev) => (
                      <div key={rev.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-900 dark:text-white">{rev.author}</span>
                          <span className="text-gray-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center text-amber-400 text-xs my-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1">{rev.title}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{rev.comment}</p>
                      </div>
                    ))
                  )}

                  {/* Submit Review Form */}
                  <form onSubmit={handleSubmitReview} className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">Write a Customer Review</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={reviewAuthor}
                        onChange={(e) => setReviewAuthor(e.target.value)}
                        className="px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 text-xs rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                      <select
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                        className="px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 text-xs rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value={5}>5 Stars ★★★★★</option>
                        <option value={4}>4 Stars ★★★★☆</option>
                        <option value={3}>3 Stars ★★★☆☆</option>
                        <option value={2}>2 Stars ★★☆☆☆</option>
                        <option value={1}>1 Star ★☆☆☆☆</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      placeholder="Review Title"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 text-xs rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    <textarea
                      placeholder="Write your review comments..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={2}
                      className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-800 text-xs rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                    >
                      Post Review
                    </button>
                    {submittedReviewSuccess && (
                      <p className="text-xs text-emerald-600 font-semibold">Review submitted successfully!</p>
                    )}
                  </form>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
