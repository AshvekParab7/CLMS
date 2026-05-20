"use client";

import React from 'react';
import Link from 'next/link';
import CustomerNav from '@/components/CustomerNav';
import { useApp } from '@/context/AppContext';
import { Heart, ShoppingCart, Trash2, Star, Clock, Truck, Zap, Package } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useApp();

  return (
    <div className="min-h-screen bg-[#F6F8FA] font-sans text-gray-900">
      <CustomerNav />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[30px] font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <Heart className="w-7 h-7 text-red-500 fill-red-500" />
              My Wishlist
            </h1>
            <p className="text-[14px] text-gray-500 mt-1 font-medium">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={() => wishlist.forEach(m => addToCart(m))}
              className="flex items-center gap-2 bg-[#FA6A02] hover:bg-[#E56000] text-white px-5 py-2.5 rounded-[12px] text-[14px] font-bold transition-all shadow-[0_2px_10px_rgba(250,106,2,0.25)]"
            >
              <ShoppingCart className="w-4 h-4" /> Add All to Cart
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <Heart className="w-10 h-10 text-red-300" />
            </div>
            <h2 className="text-[22px] font-extrabold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-[14px] text-gray-500 mb-7 max-w-[320px] mx-auto">Browse our materials and tap the heart icon to save items you love.</p>
            <Link href="/materials" className="inline-flex items-center gap-2 bg-[#FA6A02] hover:bg-[#E56000] text-white px-7 py-3 rounded-[12px] text-[15px] font-bold transition-all shadow-[0_4px_14px_rgba(250,106,2,0.3)]">
              <Package className="w-5 h-5" /> Browse Materials
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlist.map(mat => (
              <div key={mat.id} className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col group hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                {/* Image */}
                <Link href={`/materials/${mat.id}`} className="h-44 relative overflow-hidden block">
                  <img src={mat.image} alt={mat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-2 py-1 rounded-[5px] border border-gray-200/60 uppercase tracking-wide">{mat.category}</div>
                  <div className="absolute top-3 right-3 bg-gray-900/80 text-white text-[12px] font-bold px-2.5 py-1 rounded-[6px]">
                    ₹{mat.price.toLocaleString()}/{mat.unit}
                  </div>
                </Link>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <Link href={`/materials/${mat.id}`}>
                    <h3 className="font-bold text-[14.5px] text-gray-900 leading-snug mb-0.5 hover:text-[#FA6A02] transition-colors">{mat.name}</h3>
                  </Link>
                  <p className="text-[12px] text-gray-400 font-medium mb-3">{mat.supplier}</p>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-[12px] font-bold text-gray-700">{mat.rating}</span>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${mat.stock === 'Low Stock' ? 'bg-orange-50 text-orange-700' : mat.stock === 'Out of Stock' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${mat.stock === 'Low Stock' ? 'bg-orange-500' : mat.stock === 'Out of Stock' ? 'bg-red-500' : 'bg-green-500'}`} />
                      {mat.stock}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4 text-[11.5px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {mat.eta}</span>
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> ₹{mat.transport}</span>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => addToCart(mat)}
                      className="flex-1 py-2.5 rounded-[10px] bg-gray-100 hover:bg-gray-200 text-gray-800 text-[13px] font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add
                    </button>
                    <Link href={`/materials/${mat.id}`} className="flex-1 py-2.5 rounded-[10px] bg-[#FA6A02] hover:bg-[#E56000] text-white text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(250,106,2,0.25)]">
                      <Zap className="w-4 h-4" /> Buy
                    </Link>
                    <button
                      onClick={() => toggleWishlist(mat)}
                      className="w-10 h-10 rounded-[10px] bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
