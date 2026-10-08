import React, { useState } from 'react';
import { Scale, ShieldCheck, Truck, RotateCcw, Award, Send, Check } from 'lucide-react';
import { CategoryType } from '../types';

interface FooterProps {
  onCategorySelect: (cat: CategoryType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onCategorySelect }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 4000);
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white">Free Express Delivery</h4>
              <p className="text-gray-400 text-[11px]">On all orders over ₹4,999</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white">Spec Engine Verification</h4>
              <p className="text-gray-400 text-[11px]">100% authentic hardware specs</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/20 text-purple-400 rounded-2xl">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white">7-Day Easy Replacement</h4>
              <p className="text-gray-400 text-[11px]">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-600/20 text-amber-400 rounded-2xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white">Price Match Guarantee</h4>
              <p className="text-gray-400 text-[11px]">We match verified online prices</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Scale className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-white">ElectroCompare</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              The premier electronics shopping portal and side-by-side technical comparison platform built for technology buyers.
            </p>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider mb-3">Shop Categories</h4>
            <ul className="space-y-2">
              {['smartphones', 'laptops', 'audio', 'wearables', 'gaming', 'cameras'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onCategorySelect(cat as CategoryType)}
                    className="hover:text-blue-400 capitalize transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider mb-3">Customer Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Order Tracking</li>
              <li>Returns & Exchanges</li>
              <li>Specification Guarantee</li>
              <li>Corporate Purchasing</li>
              <li>Terms & Privacy Policy</li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="font-extrabold text-white uppercase tracking-wider mb-3">Stay Tech-Informed</h4>
            <p className="text-gray-400 mb-3">Subscribe for instant price-drop alerts & tech spec comparisons.</p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email..."
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 rounded-xl text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-emerald-400 font-bold mt-2 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Subscribed! Check email for $10 coupon code.
              </p>
            )}
          </div>

        </div>

        {/* Copyright Footer */}
        <div className="pt-6 border-t border-gray-800 text-center text-gray-500 text-[11px]">
          © 2026 ElectroCompare Portal Inc. All rights reserved. Designed for optimal electronics purchasing & comparison experience.
        </div>

      </div>
    </footer>
  );
};
