"use client";

import React, { useState, useEffect } from 'react';
import CustomerNav from '@/components/CustomerNav';
import Link from 'next/link';
import {
  Search, Truck, Package, MapPin, Star, ShoppingCart,
  Clock, ArrowRight, RotateCcw, CheckCircle2, Zap, ChevronRight, Plus, Loader2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Material } from '@/lib/materials-data';
import { getFeaturedMaterials } from '@/lib/api';
const CATEGORIES = [
  { label: 'Steel & Rebar', icon: '🔩', count: '48 items' },
  { label: 'Cement', icon: '🏗️', count: '24 items' },
  { label: 'Aggregates', icon: '⛏️', count: '36 items' },
  { label: 'Timber', icon: '🪵', count: '19 items' },
  { label: 'Bricks', icon: '🧱', count: '31 items' },
  { label: 'Sand', icon: '🏖️', count: '12 items' },
  { label: 'Pipes & Fittings', icon: '🔧', count: '55 items' },
  { label: 'Safety Gear', icon: '🦺', count: '40 items' },
];



const RECENT_ORDERS = [
  { id: 'ORD-4821', item: 'Portland Cement × 50 Bags', date: 'May 12', status: 'Delivered', statusColor: 'text-green-700 bg-green-50' },
  { id: 'ORD-4807', item: 'Steel Rebar × 5 Tons', date: 'May 10', status: 'In Transit', statusColor: 'text-blue-700 bg-blue-50' },
  { id: 'ORD-4790', item: 'Crushed Gravel × 10 Tons', date: 'May 6', status: 'Delivered', statusColor: 'text-green-700 bg-green-50' },
];

export default function CustomerDashboard() {
  const { cartCount } = useApp();
  const [featured, setFeatured] = useState<Material[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    getFeaturedMaterials(4).then(data => {
      setFeatured(data);
      setFeaturedLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8FA] font-sans">
      <CustomerNav />

      {/* HERO */}
      <section className="bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-[#2a1500] text-white relative overflow-hidden">
        {/* Abstract glow */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_#FA6A02,_transparent_60%)] z-0" />

        {/* Right-side Truck Image Background */}
        <div className="absolute inset-y-0 right-0 w-full md:w-3/5 lg:w-1/2 opacity-[0.40] z-0 pointer-events-none">
          {/* Left-to-right fade */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/40 to-transparent z-10" />
          {/* Bottom-to-top fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
          <img
            src="/truck1.jpeg"
            alt="Logistics Fleet"
            className="w-full h-full object-cover object-[center_right]"
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-14 relative z-10">
          <div className="max-w-[640px] relative z-20">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1.5 rounded-full text-[12px] font-bold text-orange-300 mb-5 tracking-wide uppercase">
              <Zap className="w-3.5 h-3.5" /> Fast Delivery Across 50+ Cities
            </div>
            <h1 className="text-[40px] font-extrabold leading-tight tracking-tight mb-4">
              Order Construction Materials<br />
              <span className="text-[#FA6A02]">Delivered to Your Site</span>
            </h1>
            <p className="text-gray-400 text-[16px] mb-7 leading-relaxed">
              Browse 500+ materials from verified suppliers. Schedule delivery, track in real-time, and manage all your orders in one place.
            </p>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search steel, cement, aggregates..."
                  className="w-full pl-12 pr-4 py-3.5 bg-white text-gray-900 rounded-[12px] text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6A02]/40 placeholder:text-gray-400"
                />
              </div>
              <button className="bg-[#FA6A02] hover:bg-[#E56000] text-white px-7 py-3.5 rounded-[12px] font-bold text-[15px] transition-all active:scale-[0.98] shadow-[0_4px_14px_rgba(250,106,2,0.4)] flex-shrink-0">
                Search
              </button>
            </div>
            {/* Quick stats */}
            <div className="flex gap-6 mt-8">
              {[['500+', 'Materials'], ['50+', 'Suppliers'], ['2 hr', 'Avg. Delivery'], ['4.8★', 'Customer Rating']].map(([val, label]) => (
                <div key={label}>
                  <p className="text-[20px] font-extrabold text-white">{val}</p>
                  <p className="text-[12px] text-gray-400 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-12">

        {/* Active Order Tracker */}
        <section>
          <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-[14px] flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">Order ORD-4807 · Active Delivery</p>
              <h3 className="text-[17px] font-bold text-gray-900 mb-1">Steel Rebar × 5 Tons — En Route</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-100 rounded-full h-2 mt-2">
                  <div className="bg-[#FA6A02] h-2 rounded-full" style={{ width: '62%' }} />
                </div>
                <span className="text-[13px] font-bold text-gray-500 whitespace-nowrap">~28 min remaining</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                {['Confirmed', 'Dispatched', 'En Route', 'Delivered'].map((step, i) => (
                  <span key={step} className={`text-[11px] font-bold ${i <= 2 ? 'text-[#FA6A02]' : 'text-gray-300'}`}>{step}</span>
                ))}
              </div>
            </div>
            <Link href="/track-order" className="flex-shrink-0 flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-[10px] text-[13px] font-bold transition-all">
              Track Live <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px] font-extrabold text-gray-900 tracking-tight">Browse by Category</h2>
            <Link href="/materials" className="text-[13px] font-bold text-[#FA6A02] hover:text-[#E56000] flex items-center gap-1">
              All Categories <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map(cat => (
              <Link href="/materials" key={cat.label} className="bg-white rounded-[16px] border border-gray-100 p-4 flex flex-col items-center gap-2 hover:border-orange-200 hover:shadow-[0_4px_16px_rgba(250,106,2,0.08)] transition-all cursor-pointer group text-center">
                <span className="text-[28px]">{cat.icon}</span>
                <span className="text-[12px] font-bold text-gray-800 leading-tight group-hover:text-[#FA6A02] transition-colors">{cat.label}</span>
                <span className="text-[10px] text-gray-400 font-medium">{cat.count}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Materials */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[22px] font-extrabold text-gray-900 tracking-tight">Featured Materials</h2>
            <Link href="/materials" className="text-[13px] font-bold text-[#FA6A02] hover:text-[#E56000] flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {featuredLoading ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <Loader2 className="w-6 h-6 text-[#FA6A02] animate-spin" />
              <span className="text-[14px] font-bold text-gray-400">Loading from database...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {featured.length > 0 ? featured.map(mat => (
                <MaterialCard key={mat.id} mat={mat} />
              )) : (
                <div className="col-span-4 text-center py-10 text-gray-400">
                  <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-[14px] font-bold">No featured materials yet</p>
                  <p className="text-[12px] mt-1">Add materials in your Supabase dashboard</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Quick Reorder + Saved Addresses side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">

          {/* Recent Orders / Quick Reorder */}
          <section className="bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-[17px] font-extrabold text-gray-900">Recent Orders</h2>
              <Link href="/orders" className="text-[12px] font-bold text-[#FA6A02]">View All</Link>
            </div>
            <div className="divide-y divide-gray-100">
              {RECENT_ORDERS.map(order => (
                <div key={order.id} className="p-5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-10 h-10 rounded-[10px] bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-gray-900 truncate">{order.item}</p>
                    <p className="text-[11.5px] text-gray-400 font-medium mt-0.5">{order.id} · {order.date}</p>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${order.statusColor}`}>{order.status}</span>
                  <button className="flex items-center gap-1.5 text-[12px] font-bold text-gray-500 hover:text-[#FA6A02] transition-colors border border-gray-200 hover:border-[#FA6A02] px-3 py-1.5 rounded-[8px]">
                    <RotateCcw className="w-3.5 h-3.5" /> Reorder
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Saved Addresses + Quick Actions */}
          <section className="space-y-5">
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-extrabold text-gray-900">Saved Sites</h2>
                <button className="text-[12px] font-bold text-[#FA6A02] flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add</button>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Main Construction Site', addr: 'Plot 24, Industrial Sector, Zone B', default: true },
                  { name: 'Warehouse Depot', addr: '12 Ring Road, North District', default: false },
                ].map(site => (
                  <div key={site.name} className={`flex items-start gap-3 p-3 rounded-[10px] border ${site.default ? 'border-orange-200 bg-orange-50/40' : 'border-gray-100 bg-gray-50/50'}`}>
                    <MapPin className={`w-4.5 h-4.5 mt-0.5 flex-shrink-0 ${site.default ? 'text-[#FA6A02]' : 'text-gray-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-gray-900">{site.name}</p>
                      <p className="text-[11.5px] text-gray-500 mt-0.5">{site.addr}</p>
                    </div>
                    {site.default && <span className="text-[10px] font-bold text-[#FA6A02] bg-orange-100 px-2 py-0.5 rounded-full">Default</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Order Status Summary */}
            <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5">
              <h2 className="text-[17px] font-extrabold text-gray-900 mb-4">Order Summary</h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Active', count: 2, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Delivered', count: 18, color: 'text-green-600 bg-green-50' },
                  { label: 'Pending', count: 1, color: 'text-orange-600 bg-orange-50' },
                ].map(s => (
                  <div key={s.label} className={`rounded-[12px] p-3 ${s.color.split(' ')[1]} flex flex-col items-center`}>
                    <span className={`text-[22px] font-extrabold ${s.color.split(' ')[0]}`}>{s.count}</span>
                    <span className="text-[11px] font-bold text-gray-500 mt-0.5">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

      </div>

      {/* Footer */}
      <footer className="mt-10 border-t border-gray-100 bg-white py-8">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FA6A02] rounded-[7px] flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-[15px] text-gray-800">SheshankTransport.</span>
          </div>
          <p className="text-[13px] text-gray-400">© 2026 Sheshank Transport. All rights reserved.</p>
          <div className="flex gap-5">
            {['Support', 'Privacy', 'Terms'].map(l => (
              <a key={l} href="#" className="text-[13px] text-gray-400 hover:text-gray-700 font-medium">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function MaterialCard({ mat }: { mat: any }) {
  const { addToCart } = useApp();
  const [added, setAdded] = useState(false);
  const isLowStock = mat.stock === 'Low Stock';

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(mat);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    // Standard link behavior would handle navigation, but we need to add to cart first
    addToCart(mat);
  };

  return (
    <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col group hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
      <Link href={`/materials/${mat.id}`} className="h-44 relative overflow-hidden block">
        <img src={mat.image || mat.img} alt={mat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-2 py-1 rounded-[5px] border border-gray-200/60 uppercase tracking-wide">{mat.category}</div>
        <div className="absolute top-3 right-3 bg-gray-900/80 backdrop-blur-sm text-white text-[12px] font-bold px-2.5 py-1 rounded-[6px]">
          ₹{mat.price}/{mat.unit}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/materials/${mat.id}`}>
          <h3 className="font-bold text-[15px] text-gray-900 leading-tight mb-1 hover:text-[#FA6A02] transition-colors">{mat.name}</h3>
        </Link>
        <p className="text-[12px] text-gray-500 font-medium mb-3">{mat.supplier}</p>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-[12px] font-bold text-gray-700">{mat.rating}</span>
            <span className="text-[11px] text-gray-400">({mat.reviews})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${isLowStock ? 'bg-orange-500' : 'bg-green-500'}`} />
            <span className={`text-[11px] font-bold ${isLowStock ? 'text-orange-700' : 'text-green-700'}`}>{mat.stock}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4 p-2.5 bg-gray-50 rounded-[10px] border border-gray-100">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ETA</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-[12px] font-bold text-gray-800">{mat.eta}</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Transport</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Truck className="w-3 h-3 text-gray-400" />
              <span className="text-[12px] font-bold text-gray-800">₹{mat.transport}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleAdd}
            className={`flex-1 py-2.5 rounded-[10px] text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 ${added ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
          >
            {added ? <CheckCircle2 className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            {added ? 'Added' : 'Add'}
          </button>
          <Link
            href="/orders"
            onClick={handleBuyNow}
            className="flex-1 py-2.5 rounded-[10px] bg-[#FA6A02] hover:bg-[#E56000] text-white text-[13px] font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(250,106,2,0.25)]"
          >
            <Zap className="w-4 h-4" /> Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}