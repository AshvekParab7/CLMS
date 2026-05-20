"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star, ShoppingCart, Heart, Zap, Clock, Truck,
  Search, CheckCircle2, X, ChevronLeft, ChevronRight, Plus, Minus, Loader2
} from 'lucide-react';
import CustomerNav from '@/components/CustomerNav';
import { getMaterials } from '@/lib/api';
import { Material } from '@/lib/materials-data';
import { useApp } from '@/context/AppContext';

const CATEGORIES = ['All', 'Structural', 'Binders', 'Aggregates', 'Sand', 'Masonry', 'Timber'];

export default function MaterialsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMaterials({ category: activeCategory, search: query, sortBy });
      setMaterials(data);
    } catch (err) {
      setError('Failed to load materials. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, query, sortBy]);

  // Debounce search — wait 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMaterials();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchMaterials]);

  return (
    <div className="min-h-screen bg-[#F6F8FA] font-sans text-gray-900">
      <CustomerNav />

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[30px] font-extrabold text-gray-900 tracking-tight">Browse Materials</h1>
            <p className="text-[14px] text-gray-500 mt-0.5 font-medium">
              {loading ? 'Loading...' : `${materials.length} items from verified suppliers`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search materials..."
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-[10px] text-[13.5px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FA6A02]/20 focus:border-[#FA6A02] transition-all w-[220px]"
              />
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-[10px] text-[13.5px] text-gray-700 font-semibold focus:outline-none appearance-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mb-7 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all border ${activeCategory === cat
                ? 'bg-[#FA6A02] text-white border-[#FA6A02] shadow-[0_2px_8px_rgba(250,106,2,0.3)]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-[#FA6A02]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-[#FA6A02] animate-spin" />
            <p className="text-[15px] font-bold text-gray-500">Loading materials from database...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <X className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-[15px] font-bold text-red-600">{error}</p>
            <button
              onClick={fetchMaterials}
              className="px-5 py-2.5 bg-[#FA6A02] text-white font-bold rounded-[10px] text-[13px] hover:bg-[#E56000] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && materials.length === 0 && (
          <div className="col-span-4 flex flex-col items-center justify-center py-20 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-[16px] font-bold text-gray-500">No materials found</p>
            <p className="text-[13px] mt-1">Try a different search or category</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && materials.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {materials.map(mat => (
              <MaterialCard key={mat.id} mat={mat} onQuickView={() => setSelectedMaterial(mat)} />
            ))}
          </div>
        )}
      </div>

      {selectedMaterial && (
        <QuickViewModal mat={selectedMaterial} onClose={() => setSelectedMaterial(null)} />
      )}
    </div>
  );
}

/* ─── Quick View Modal ───────────────────────────────────────────────────── */
function QuickViewModal({ mat, onClose }: { mat: Material; onClose: () => void }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const router = useRouter();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(mat.id);
  const images = mat.images?.length ? mat.images : [mat.image];

  const nextImg = () => setActiveImg(prev => (prev + 1) % images.length);
  const prevImg = () => setActiveImg(prev => (prev - 1 + images.length) % images.length);

  const handleAddCart = () => {
    addToCart(mat, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(mat, qty);
    router.push('/orders');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-[900px] max-h-[90vh] rounded-[24px] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-800 shadow-sm transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Images */}
        <div className="w-full md:w-1/2 relative bg-gray-100 min-h-[300px] md:min-h-full">
          <img src={images[activeImg] || mat.image} alt={mat.name} className="w-full h-full object-cover absolute inset-0" />
          {images.length > 1 && (
            <>
              <button onClick={prevImg} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md text-gray-800 transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={nextImg} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md text-gray-800 transition-all">
                <ChevronRight className="w-6 h-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-2 h-2 rounded-full transition-all ${activeImg === i ? 'bg-[#FA6A02] w-4' : 'bg-white/60 hover:bg-white'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto max-h-[90vh]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold text-[#FA6A02] bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full uppercase tracking-wide">{mat.category}</span>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-bold text-green-700 uppercase">{mat.stock}</span>
            </div>
          </div>

          <h2 className="text-[24px] font-extrabold text-gray-900 leading-tight mb-2">{mat.name}</h2>
          <p className="text-[13px] text-gray-500 font-medium mb-4">
            Supplier: <span className="text-gray-900 font-bold">{mat.supplier}</span>
          </p>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-[32px] font-extrabold text-gray-900 tracking-tight">₹{mat.price.toLocaleString()}</span>
            <span className="text-[15px] text-gray-400 font-medium">/ {mat.unit}</span>
          </div>

          <p className="text-[14px] text-gray-600 leading-relaxed mb-6 line-clamp-3">{mat.description}</p>

          {/* Quantity */}
          <div className="mb-8">
            <label className="text-[12px] font-extrabold text-gray-500 uppercase tracking-wider block mb-3">Quantity ({mat.unit}s)</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-gray-100 rounded-[12px] p-1">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-[10px] bg-white shadow-sm flex items-center justify-center text-gray-700 hover:text-[#FA6A02] transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-14 text-center text-[16px] font-extrabold text-gray-900">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 rounded-[10px] bg-white shadow-sm flex items-center justify-center text-gray-700 hover:text-[#FA6A02] transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 text-right">
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-1">Subtotal</p>
                <p className="text-[20px] font-extrabold text-[#FA6A02]">₹{(mat.price * qty).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={handleAddCart}
                className={`flex-1 py-3.5 rounded-[12px] text-[15px] font-extrabold transition-all flex items-center justify-center gap-2 ${added ? 'bg-green-50 text-green-700 border-2 border-green-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
              >
                {added ? <><CheckCircle2 className="w-5 h-5" /> Added!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
              </button>
              <button
                onClick={() => toggleWishlist(mat)}
                className={`w-[54px] h-[54px] rounded-[12px] flex items-center justify-center transition-all ${wishlisted ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400 hover:text-red-500'}`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500' : ''}`} />
              </button>
            </div>
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 rounded-[12px] bg-[#FA6A02] hover:bg-[#E56000] text-white text-[15px] font-extrabold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(250,106,2,0.3)]"
            >
              <Zap className="w-5 h-5" /> Buy Now
            </button>
            <Link href={`/materials/${mat.id}`} className="text-center text-[13px] font-bold text-gray-500 hover:text-[#FA6A02] mt-2 transition-colors">
              View Full Details & Reviews →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Material Card ──────────────────────────────────────────────────────── */
function MaterialCard({ mat, onQuickView }: { mat: Material; onQuickView: () => void }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(mat.id);
  const isLowStock = mat.stock === 'Low Stock';
  const isOutOfStock = mat.stock === 'Out of Stock';

  const handleAddCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(mat);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col group hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      {/* Image */}
      <Link href={`/materials/${mat.id}`} className="block h-44 relative overflow-hidden">
        <img src={mat.image} alt={mat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="bg-white/95 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-2 py-1 rounded-[5px] border border-gray-200/60 uppercase tracking-wide">{mat.category}</span>
          {mat.isNew && <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-[5px]">NEW</span>}
          {mat.discount ? <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-[5px]">-{mat.discount}%</span> : null}
        </div>

        <div className="absolute top-3 right-3">
          <span className="bg-gray-900/80 backdrop-blur-sm text-white text-[12px] font-bold px-2.5 py-1 rounded-[6px]">
            ₹{mat.price.toLocaleString()}/{mat.unit}
          </span>
        </div>

        {/* Wishlist overlay */}
        <button
          onClick={e => { e.preventDefault(); toggleWishlist(mat); }}
          className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm opacity-0 group-hover:opacity-100 ${wishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'}`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
        </button>
      </Link>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/materials/${mat.id}`}>
          <h3 className="font-bold text-[14.5px] text-gray-900 leading-snug mb-0.5 hover:text-[#FA6A02] transition-colors line-clamp-2">{mat.name}</h3>
        </Link>
        <p className="text-[12px] text-gray-400 font-medium mb-2">{mat.supplier}</p>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-[12px] font-bold text-gray-700">{mat.rating}</span>
            <span className="text-[11px] text-gray-400">({mat.reviews})</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isLowStock ? 'bg-orange-50 text-orange-700' : isOutOfStock ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isLowStock ? 'bg-orange-500' : isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`} />
            {mat.stock}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 text-[11.5px] text-gray-500 font-medium">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {mat.eta}</span>
          <span className="flex items-center gap-1"><Truck className="w-3 h-3" /> ₹{mat.transport}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={() => onQuickView()}
            className="w-full py-2.5 rounded-[10px] border-2 border-gray-200 hover:border-[#FA6A02] hover:text-[#FA6A02] text-gray-700 text-[13px] font-bold transition-all text-center"
          >
            View Details
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleAddCart}
              disabled={isOutOfStock}
              className={`flex-1 py-2.5 rounded-[10px] text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 ${added ? 'bg-green-500 text-white' : isOutOfStock ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
            >
              {added ? <><CheckCircle2 className="w-4 h-4" /> Added!</> : <><ShoppingCart className="w-4 h-4" /> Add</>}
            </button>
            <Link
              href={`/materials/${mat.id}`}
              className="flex-1 py-2.5 rounded-[10px] bg-[#FA6A02] hover:bg-[#E56000] text-white text-[13px] font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(250,106,2,0.25)]"
            >
              <Zap className="w-4 h-4" /> Buy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
