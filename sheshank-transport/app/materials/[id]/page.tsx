"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import CustomerNav from '@/components/CustomerNav';
import { getMaterial, getSimilarMaterials } from '@/lib/api';
import { Material } from '@/lib/materials-data';
import { useApp } from '@/context/AppContext';
import {
  Star, ShoppingCart, Heart, Zap, Clock, Truck, ChevronRight,
  CheckCircle2, Shield, RotateCcw, Phone, MapPin, Plus, Minus, Loader2, Package
} from 'lucide-react';

export default function MaterialDetailPage({ params }: { params: { id: string } }) {
  const [mat, setMat] = useState<Material | null>(null);
  const [similar, setSimilar] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundPage, setNotFoundPage] = useState(false);

  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  // Fetch material data from Supabase
  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getMaterial(params.id);
      if (!data) {
        setNotFoundPage(true);
        setLoading(false);
        return;
      }
      setMat(data);
      // Fetch similar in background
      const sim = await getSimilarMaterials(data.id, data.category, 3);
      setSimilar(sim);
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6F8FA] font-sans">
        <CustomerNav />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 text-[#FA6A02] animate-spin" />
          <p className="text-[15px] font-bold text-gray-500">Loading material details...</p>
        </div>
      </div>
    );
  }

  if (notFoundPage || !mat) {
    return notFound();
  }

  const wishlisted = isWishlisted(mat.id);
  const total = mat.price * qty + mat.transport;
  const images = mat.images?.length ? mat.images : [mat.image];

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
    <div className="min-h-screen bg-[#F6F8FA] font-sans text-gray-900">
      <CustomerNav />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[13px] font-semibold text-gray-400 mb-6">
          <Link href="/dashboard" className="hover:text-gray-700 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/materials" className="hover:text-gray-700 transition-colors">Materials</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-800 truncate max-w-[200px]">{mat.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 mb-12">
          {/* LEFT: Images + specs */}
          <div className="space-y-6">
            {/* Gallery */}
            <div className="bg-white rounded-[20px] border border-gray-100 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <div className="h-[360px] relative overflow-hidden">
                <img
                  src={images[activeImg] || mat.image}
                  alt={mat.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                {mat.isNew && (
                  <span className="absolute top-4 left-4 bg-green-500 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-sm uppercase">New Arrival</span>
                )}
                {mat.discount ? (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-[13px] font-extrabold px-3 py-1.5 rounded-full shadow-sm">-{mat.discount}% OFF</span>
                ) : null}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 p-4 border-t border-gray-100">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`w-16 h-16 rounded-[10px] overflow-hidden border-2 transition-all ${activeImg === i ? 'border-[#FA6A02] shadow-[0_0_0_2px_rgba(250,106,2,0.2)]' : 'border-transparent hover:border-gray-200'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specs */}
            {mat.specs && Object.keys(mat.specs).length > 0 && (
              <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6">
                <h2 className="text-[18px] font-extrabold text-gray-900 mb-4">Specifications</h2>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(mat.specs).map(([key, val]) => (
                    <div key={key} className="flex flex-col p-3 bg-gray-50 rounded-[10px] border border-gray-100">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{key}</span>
                      <span className="text-[13.5px] font-bold text-gray-900">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews (static — can be connected later) */}
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[18px] font-extrabold text-gray-900">Customer Reviews</h2>
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-[14px] font-extrabold text-gray-900">{mat.rating}</span>
                  <span className="text-[12px] text-gray-400">({mat.reviews})</span>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Rajesh K.', date: '2 days ago', rating: 5, text: 'Excellent quality material. Delivered on time and exactly as described. Will definitely order again.' },
                  { name: 'Priya M.', date: '1 week ago', rating: 4, text: 'Good quality, slightly delayed delivery but the material itself was perfect for our project.' },
                  { name: 'Amit S.', date: '2 weeks ago', rating: 5, text: 'Best supplier on this platform. Very consistent quality and competitive pricing.' },
                ].map((rev, i) => (
                  <div key={i} className="pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-[#FA6A02] flex items-center justify-center text-white text-[12px] font-extrabold">
                          {rev.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-gray-900">{rev.name}</p>
                          <p className="text-[11px] text-gray-400">{rev.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, si) => (
                          <Star key={si} className={`w-3.5 h-3.5 ${si < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[13.5px] text-gray-600 leading-relaxed">{rev.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Purchase panel */}
          <div className="space-y-5">
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-6 sticky top-[80px]">
              {/* Category + Tags */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[11px] font-bold text-[#FA6A02] bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full uppercase tracking-wide">{mat.category}</span>
                {(mat.tags ?? []).slice(0, 2).map(t => (
                  <span key={t} className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>

              <h1 className="text-[22px] font-extrabold text-gray-900 leading-tight mb-2">{mat.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(mat.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                  ))}
                  <span className="text-[13px] font-bold text-gray-700 ml-1">{mat.rating}</span>
                </div>
                <span className="text-[12px] text-gray-400">({mat.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-5">
                <div className="flex items-baseline gap-2">
                  <span className="text-[32px] font-extrabold text-gray-900 tracking-tight">₹{mat.price.toLocaleString()}</span>
                  <span className="text-[15px] text-gray-400 font-medium">/ {mat.unit}</span>
                </div>
                {mat.discount ? (
                  <p className="text-[12.5px] text-green-600 font-bold mt-1">You save ₹{Math.round(mat.price * mat.discount / 100)} ({mat.discount}% off)</p>
                ) : null}
              </div>

              {/* Stock */}
              <div className={`flex items-center gap-2 mb-5 px-3 py-2.5 rounded-[10px] text-[13px] font-bold ${mat.stock === 'In Stock' ? 'bg-green-50 text-green-800' : mat.stock === 'Low Stock' ? 'bg-orange-50 text-orange-800' : 'bg-red-50 text-red-800'}`}>
                <div className={`w-2 h-2 rounded-full ${mat.stock === 'In Stock' ? 'bg-green-500' : mat.stock === 'Low Stock' ? 'bg-orange-500' : 'bg-red-500'}`} />
                {mat.stock} — {mat.stockQty} {mat.unit}s available
              </div>

              {/* Quantity */}
              <div className="mb-5">
                <label className="text-[12px] font-extrabold text-gray-500 uppercase tracking-wider block mb-2">Quantity ({mat.unit}s)</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-[9px] bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <Minus className="w-4 h-4 text-gray-700" />
                  </button>
                  <span className="text-[18px] font-extrabold text-gray-900 w-12 text-center">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 rounded-[9px] bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <Plus className="w-4 h-4 text-gray-700" />
                  </button>
                  <div className="ml-auto text-right">
                    <p className="text-[11px] text-gray-400 font-medium">Subtotal</p>
                    <p className="text-[18px] font-extrabold text-[#FA6A02]">₹{(mat.price * qty).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="grid grid-cols-2 gap-3 mb-5 p-3 bg-gray-50 rounded-[12px] border border-gray-100">
                <div>
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Delivery ETA</p>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#FA6A02]" />
                    <span className="text-[13px] font-bold text-gray-900">{mat.eta}</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Transport</p>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#FA6A02]" />
                    <span className="text-[13px] font-bold text-gray-900">₹{mat.transport}</span>
                  </div>
                </div>
                <div className="col-span-2 border-t border-gray-200 pt-2 flex items-center justify-between">
                  <span className="text-[12px] font-bold text-gray-500">Est. Total (incl. transport)</span>
                  <span className="text-[14px] font-extrabold text-gray-900">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 rounded-[12px] bg-[#FA6A02] hover:bg-[#E56000] text-white text-[15px] font-extrabold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(250,106,2,0.3)]"
                >
                  <Zap className="w-5 h-5" /> Buy Now — ₹{total.toLocaleString()}
                </button>
                <button
                  onClick={handleAddCart}
                  className={`w-full py-3.5 rounded-[12px] border-2 text-[15px] font-extrabold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${added ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-[#FA6A02] text-gray-800 hover:text-[#FA6A02]'}`}
                >
                  {added ? <><CheckCircle2 className="w-5 h-5" /> Added to Cart!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
                </button>
                <button
                  onClick={() => toggleWishlist(mat)}
                  className={`w-full py-3 rounded-[12px] border text-[13px] font-bold transition-all flex items-center justify-center gap-2 ${wishlisted ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-100 bg-gray-50 text-gray-500 hover:text-red-500 hover:border-red-200'}`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  {wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
                {[
                  { icon: <Shield className="w-4 h-4" />, label: 'Quality\nGuaranteed' },
                  { icon: <RotateCcw className="w-4 h-4" />, label: 'Easy\nReturns' },
                  { icon: <Truck className="w-4 h-4" />, label: 'Fast\nDelivery' },
                ].map(b => (
                  <div key={b.label} className="flex flex-col items-center gap-1 text-center">
                    <span className="text-[#FA6A02]">{b.icon}</span>
                    <span className="text-[10px] font-bold text-gray-500 leading-tight whitespace-pre-line">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Supplier card */}
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5">
              <h3 className="text-[14px] font-extrabold text-gray-700 mb-3 uppercase tracking-wide">Supplier</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-[12px] bg-gradient-to-br from-orange-200 to-orange-300 flex items-center justify-center text-[#FA6A02] font-extrabold text-[16px]">
                  {mat.supplier.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[14px] text-gray-900">{mat.supplier}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[12px] font-bold text-gray-700">{mat.supplierRating}</span>
                    <span className="text-[11px] text-gray-400">Verified Supplier</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-bold transition-colors">
                  <Phone className="w-4 h-4" /> Call
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 text-[13px] font-bold transition-colors">
                  <MapPin className="w-4 h-4" /> Location
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {mat.description && (
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 mb-8">
            <h2 className="text-[18px] font-extrabold text-gray-900 mb-3">About this Material</h2>
            <p className="text-[14.5px] text-gray-600 leading-relaxed">{mat.description}</p>
          </div>
        )}

        {/* Similar Materials */}
        {similar.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[22px] font-extrabold text-gray-900">Similar Materials</h2>
              <Link href="/materials" className="text-[13px] font-bold text-[#FA6A02]">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {similar.map(m => (
                <Link
                  key={m.id}
                  href={`/materials/${m.id}`}
                  className="bg-white rounded-[16px] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_6px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all group"
                >
                  <div className="h-36 overflow-hidden">
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-bold text-[#FA6A02] uppercase mb-1">{m.category}</p>
                    <h4 className="font-bold text-[14px] text-gray-900 mb-1 line-clamp-1">{m.name}</h4>
                    <p className="text-[13px] font-extrabold text-gray-900">
                      ₹{m.price.toLocaleString()}<span className="text-[11px] text-gray-400 font-medium">/{m.unit}</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
