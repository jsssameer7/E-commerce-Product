import { Product } from '../types';

export interface ProductComparisonRank {
  product: Product;
  rank: number;
  compositeScore: number; // Score out of 10 (e.g. 9.4)
  verdict: string;
  badgeColor: string;
  rankTitle: string;
}

/**
 * Calculates a composite score and assigns dynamic rank (#1 Best Pick down to #4)
 * for a list of products being compared side-by-side.
 */
export function rankComparisonProducts(products: Product[]): Map<string, ProductComparisonRank> {
  if (!products || products.length === 0) return new Map();

  const rankedList = products.map((product) => {
    // 1. Performance (25%)
    const perfNorm = (product.performanceScore || 8) / 10;

    // 2. Features (25%)
    const featNorm = (product.featuresScore || 8) / 10;

    // 3. Value for Money (25%)
    const valNorm = (product.valueScore || 8) / 10;

    // 4. Customer Rating (25%)
    const ratingNorm = (product.rating || 4.5) / 5;

    // Weighted composite score out of 10
    const compositeScore = Math.round((perfNorm * 2.5 + featNorm * 2.5 + valNorm * 2.5 + ratingNorm * 2.5) * 10) / 10;

    return {
      product,
      compositeScore,
    };
  });

  // Sort descending by compositeScore, secondary by rating, tertiary by price (lower price first)
  rankedList.sort((a, b) => {
    if (b.compositeScore !== a.compositeScore) {
      return b.compositeScore - a.compositeScore;
    }
    if (b.product.rating !== a.product.rating) {
      return b.product.rating - a.product.rating;
    }
    return a.product.price - b.product.price;
  });

  const resultMap = new Map<string, ProductComparisonRank>();

  rankedList.forEach((item, index) => {
    const rank = index + 1;
    let verdict = '';
    let badgeColor = '';
    let rankTitle = '';

    if (rank === 1) {
      rankTitle = '#1 Overall Winner 🏆';
      badgeColor = 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-white shadow-lg border-amber-300';
      verdict = 'Best Overall Pick — Highest composite score across performance, features & rating.';
    } else if (rank === 2) {
      rankTitle = '#2 Runner Up 🥈';
      badgeColor = 'bg-gradient-to-r from-slate-600 to-gray-700 text-white shadow border-slate-400';
      verdict = 'Strong Runner Up — High performance contender with excellent feature set.';
    } else if (rank === 3) {
      rankTitle = '#3 Bronze Choice 🥉';
      badgeColor = 'bg-gradient-to-r from-amber-700 to-orange-800 text-white shadow border-amber-600';
      verdict = 'Solid Choice — Good budget-conscious value option.';
    } else {
      rankTitle = `#${rank} Alternative`;
      badgeColor = 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700';
      verdict = 'Alternative Option — Suitable for specific usage preferences.';
    }

    resultMap.set(item.product.id, {
      product: item.product,
      rank,
      compositeScore: item.compositeScore,
      verdict,
      badgeColor,
      rankTitle,
    });
  });

  return resultMap;
}
