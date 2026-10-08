import React, { useState, useMemo } from 'react';
import { Product, CategoryType } from '../types';
import { formatPrice } from '../utils/formatCurrency';
import { 
  X, 
  Bot, 
  SlidersHorizontal, 
  ShoppingCart, 
  Award, 
  HelpCircle
} from 'lucide-react';

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isCompared: (productId: string) => boolean;
  onQuickView: (product: Product) => void;
}

const USE_CASE_OPTIONS = [
  'College & Programming',
  'Heavy Gaming',
  '4K Video Editing & Graphic Design',
  'Travel & Noise Isolation',
  'Fitness & Extreme Sports',
  'Living Room & Sports',
  'Productivity & Note Taking',
  'Daily Driver & Battery Endurance',
  'Clean Android & AI Workflow'
];

export const RecommendationModal: React.FC<RecommendationModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
  onToggleCompare,
  isCompared,
  onQuickView,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('laptops');
  const [maxBudget, setMaxBudget] = useState<number>(75000);
  const [selectedPurpose, setSelectedPurpose] = useState<string>('College & Programming');

  if (!isOpen) return null;

  // AI Recommendation Engine scoring algorithm
  const recommendationResults = useMemo(() => {
    let eligible = products.filter((p) => p.price <= maxBudget);
    if (selectedCategory !== 'all') {
      eligible = eligible.filter((p) => p.category === selectedCategory);
    }

    if (eligible.length === 0) {
      // Fallback if budget too strict
      eligible = selectedCategory === 'all' ? products : products.filter((p) => p.category === selectedCategory);
    }

    // Rank by composite score
    const scored = eligible.map((product) => {
      let score = 0;

      // Price match (closer to budget but under = higher value score)
      const budgetUtil = product.price / maxBudget;
      if (budgetUtil <= 1.0) {
        score += 30 * (1 - (maxBudget - product.price) / maxBudget);
      } else {
        score -= 20; // Penalty for over budget
      }

      // Purpose match
      const hasPurposeMatch = product.recommendedUseCases.some((uc) =>
        uc.toLowerCase().includes(selectedPurpose.toLowerCase())
      );
      if (hasPurposeMatch) score += 40;

      // Performance & Value scores
      score += product.performanceScore * 2;
      score += product.valueScore * 3;
      score += product.rating * 2;

      return { product, matchScore: Math.min(99, Math.round(score)) };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    const winner = scored[0]?.product || null;
    const winnerScore = scored[0]?.matchScore || 92;
    const runnerUp = scored[1]?.product || null;

    return { winner, winnerScore, runnerUp };
  }, [products, selectedCategory, maxBudget, selectedPurpose]);

  const { winner, winnerScore, runnerUp } = recommendationResults;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between border-b border-blue-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-2xl shadow-md">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black flex items-center gap-2">
                SmartElectro AI Recommendation System
              </h2>
              <p className="text-xs text-blue-200">
                Enter your budget & purpose to get tailored product recommendation & value scores
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

        {/* Wizard Controls Area */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-xs font-bold rounded-xl text-gray-900 dark:text-white capitalize"
              >
                <option value="all">All Categories</option>
                <option value="laptops">Laptops</option>
                <option value="smartphones">Smartphones</option>
                <option value="tv">TVs & Displays</option>
                <option value="audio">Headphones & Audio</option>
                <option value="wearables">Smartwatches</option>
                <option value="gaming">Gaming Consoles</option>
                <option value="cameras">Cameras & Drones</option>
              </select>
            </div>

            {/* Purpose / Primary Use Case */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Primary Purpose
              </label>
              <select
                value={selectedPurpose}
                onChange={(e) => setSelectedPurpose(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-xs font-bold rounded-xl text-gray-900 dark:text-white"
              >
                {USE_CASE_OPTIONS.map((uc) => (
                  <option key={uc} value={uc}>
                    {uc}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="uppercase text-gray-500">Max Budget</span>
                <span className="text-blue-600 dark:text-blue-400 font-extrabold">{formatPrice(maxBudget)}</span>
              </div>
              <input
                type="range"
                min={20000}
                max={350000}
                step={5000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* AI Recommendation Output Display */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {winner ? (
            <div className="space-y-6">
              
              {/* Top Recommended Winner Card */}
              <div className="relative bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 dark:from-blue-950/40 dark:via-gray-900 dark:to-indigo-950/40 border-2 border-blue-500/60 rounded-3xl p-6 shadow-xl space-y-4">
                
                {/* AI Match Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200 dark:border-blue-900/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-xs font-extrabold flex items-center gap-1 shadow-md">
                      <Award className="w-4 h-4" /> Top Recommendation
                    </span>
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-extrabold">
                      {winnerScore}% AI Match Score
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-semibold">
                    Target Budget: {formatPrice(maxBudget)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Product Image */}
                  <div className="md:col-span-4 flex justify-center">
                    <img
                      src={winner.image}
                      alt={winner.name}
                      className="w-48 h-48 object-contain bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md"
                    />
                  </div>

                  {/* Winner Content & Scores */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        {winner.brand}
                      </span>
                      <span className="text-xs font-bold text-gray-500">Rating: {winner.rating} ★</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                      {winner.name}
                    </h3>

                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                        {formatPrice(winner.price)}
                      </span>
                      {winner.originalPrice > winner.price && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatPrice(winner.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Standout Hackathon Metrics */}
                    <div className="grid grid-cols-3 gap-2 py-2">
                      <div className="p-2 bg-white dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Performance</p>
                        <p className="text-sm font-black text-blue-600 dark:text-blue-400">{winner.performanceScore}/10</p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Features</p>
                        <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">{winner.featuresScore}/10</p>
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Value Rating</p>
                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{winner.valueScore}/10</p>
                      </div>
                    </div>

                    {/* AI Recommendation Reasoning */}
                    <div className="p-3 bg-blue-100/70 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 leading-relaxed font-medium">
                      🤖 <strong>SmartElectro AI Reason:</strong> "{winner.name} is recommended for <strong>{selectedPurpose}</strong> because it delivers the best balance of performance ({winner.performanceScore}/10), value rating ({winner.valueScore}/10), and stays within your {formatPrice(maxBudget)} budget."
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        onClick={() => onAddToCart(winner)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </button>

                      <button
                        onClick={() => onToggleCompare(winner)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                          isCompared(winner.id)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <SlidersHorizontal className="w-4 h-4 inline mr-1" />
                        <span>{isCompared(winner.id) ? 'Comparing' : 'Compare'}</span>
                      </button>

                      <button
                        onClick={() => onQuickView(winner)}
                        className="px-4 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold hover:bg-gray-300 transition-colors"
                      >
                        View Full Specs
                      </button>
                    </div>

                  </div>

                </div>

              </div>

              {/* Runner Up Alternative Option */}
              {runnerUp && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={runnerUp.image} alt="" className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Runner-Up Alternative</span>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">{runnerUp.name}</h4>
                      <p className="text-xs font-extrabold text-blue-600">{formatPrice(runnerUp.price)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleCompare(runnerUp)}
                    className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Compare with Winner</span>
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700 dark:text-gray-300">No products matched budget criteria</p>
              <p className="text-xs text-gray-400 mt-1">Try increasing your budget slider to view recommendations.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
