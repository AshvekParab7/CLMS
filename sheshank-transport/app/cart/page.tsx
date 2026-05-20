"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CustomerNav from '@/components/CustomerNav';
import { useApp } from '@/context/AppContext';
import { createOrder } from '@/services/orderService';
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag,
  Truck, ShieldCheck, RotateCcw, Package, ChevronRight,
  MapPin, Clock, Zap, X
} from 'lucide-react';

const PROMO_CODES: Record<string, number> = {
  SHESHANK10: 0.10,
  CEMENT12: 0.12,
  STEEL5: 0.05,
  FIRST20: 0.20,
};

const DELIVERY_FEE = 350;
const GST_RATE = 0.18;

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useApp();
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Sheshank Transport Yard');
  const [destination, setDestination] = useState('');
  const [vehicleType, setVehicleType] = useState('Open Truck');
  const [checkoutError, setCheckoutError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  const discount = appliedPromo ? cartTotal * PROMO_CODES[appliedPromo] : 0;
  const subtotal = cartTotal;
  const gst = (subtotal - discount) * GST_RATE;
  const total = subtotal - discount + gst + (cart.length > 0 ? DELIVERY_FEE : 0);

  

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoSuccess('');
    setPromoError('');
  };

  const placeOrder = async () => {
    setCheckoutError('');

    if (!customerName.trim() || !customerPhone.trim() || !pickupLocation.trim() || !destination.trim()) {
      setCheckoutError('Enter customer name, phone, pickup location, and destination.');
      return;
    }

    if (cart.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    setPlacingOrder(true);

    try {
      const order = await createOrder({
        customer_name: customerName,
        customer_phone: customerPhone,
        pickup_location: pickupLocation,
        destination,
        material_name: cart.map((item) => item.material.name).join(', '),
        vehicle_type: vehicleType,
        total_amount: Number(total.toFixed(2)),
        items: cart.map((item) => ({
          material_id: item.material.id,
          material_name: item.material.name,
          quantity: item.qty,
          unit_price: item.material.price,
          unit: item.material.unit,
        })),
      });

      clearCart();
      router.push(`/order-success?id=${encodeURIComponent(order.id)}&num=${encodeURIComponent(order.id.slice(0, 8).toUpperCase())}`);
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'Unable to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA]">
      <CustomerNav />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">

        {/* Page Header */}
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 bg-[#FA6A02]/10 rounded-[12px] flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-[#FA6A02]" />
          </div>
          <div>
            <h1 className="text-[24px] font-extrabold text-gray-900 tracking-tight leading-none">
              My Cart
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5 font-medium">
              {cart.length === 0 ? 'Your cart is empty' : `${cart.reduce((s, i) => s + i.qty, 0)} item${cart.reduce((s, i) => s + i.qty, 0) !== 1 ? 's' : ''} in your cart`}
            </p>
          </div>
          {/* Breadcrumb */}
          <nav className="ml-auto hidden md:flex items-center gap-1.5 text-[12px] text-gray-400 font-medium">
            <Link href="/dashboard" className="hover:text-gray-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/materials" className="hover:text-gray-700">Materials</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-bold">Cart</span>
          </nav>
        </div>

        {cart.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center py-24 px-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <ShoppingCart className="w-9 h-9 text-gray-300" />
            </div>
            <h2 className="text-[22px] font-extrabold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-[14px] text-gray-500 mb-7 max-w-[360px] leading-relaxed">
              You have not added any materials yet. Browse our catalog and find what you need for your project.
            </p>
            <Link
              href="/materials"
              className="inline-flex items-center gap-2 bg-[#FA6A02] hover:bg-[#E56000] text-white px-7 py-3 rounded-[12px] font-bold text-[15px] transition-all shadow-[0_4px_14px_rgba(250,106,2,0.35)]"
            >
              Browse Materials <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

            {/* ── LEFT: Cart Items ── */}
            <div className="space-y-4">

              {/* Delivery info strip */}
              <div className="bg-green-50 border border-green-200 rounded-[14px] px-5 py-3 flex items-center gap-3">
                <Truck className="w-4.5 h-4.5 text-green-600 flex-shrink-0" />
                <p className="text-[13px] font-semibold text-green-800">
                  🎉 You qualify for <span className="font-extrabold">Express Delivery</span> — estimated arrival in <span className="font-extrabold">2–4 hours</span>
                </p>
              </div>

              {/* Items */}
              <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-[16px] font-extrabold text-gray-900">Cart Items</h2>
                  <button
                    onClick={() => cart.forEach(i => removeFromCart(i.material.id))}
                    className="text-[12px] font-bold text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                </div>

                <div className="divide-y divide-gray-50">
                  {cart.map((item) => (
                    <CartItemRow
                      key={item.material.id}
                      item={item}
                      onRemove={() => removeFromCart(item.material.id)}
                      onQtyChange={(q) => updateQty(item.material.id, q)}
                    />
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <ShieldCheck className="w-5 h-5 text-green-500" />, title: 'Secure Checkout', sub: 'SSL encrypted' },
                  { icon: <RotateCcw className="w-5 h-5 text-blue-500" />, title: 'Easy Returns', sub: 'Within 7 days' },
                  { icon: <Truck className="w-5 h-5 text-[#FA6A02]" />, title: 'Fast Delivery', sub: '2–4 hr avg.' },
                ].map(b => (
                  <div key={b.title} className="bg-white rounded-[14px] border border-gray-100 p-4 flex items-center gap-3">
                    <div className="flex-shrink-0">{b.icon}</div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-800">{b.title}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{b.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue shopping */}
              <Link
                href="/materials"
                className="flex items-center gap-2 text-[13px] font-bold text-[#FA6A02] hover:text-[#E56000] transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="space-y-4">

              {/* Delivery address */}
              <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[15px] font-extrabold text-gray-900">Delivery Details</h3>
                </div>
                <div className="space-y-3 mb-3">
                  <input
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Customer name"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FA6A02]/20 focus:border-[#FA6A02]"
                  />
                  <input
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    placeholder="Customer phone"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FA6A02]/20 focus:border-[#FA6A02]"
                  />
                  <input
                    value={pickupLocation}
                    onChange={(event) => setPickupLocation(event.target.value)}
                    placeholder="Pickup location"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FA6A02]/20 focus:border-[#FA6A02]"
                  />
                  <input
                    value={destination}
                    onChange={(event) => setDestination(event.target.value)}
                    placeholder="Destination"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FA6A02]/20 focus:border-[#FA6A02]"
                  />
                  <select
                    value={vehicleType}
                    onChange={(event) => setVehicleType(event.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-[10px] text-[13px] font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FA6A02]/20 focus:border-[#FA6A02]"
                  >
                    <option>Open Truck</option>
                    <option>Mini Truck</option>
                    <option>Container Truck</option>
                    <option>Tipper</option>
                    <option>Trailer</option>
                  </select>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-[12px]">
                  <MapPin className="w-4 h-4 text-[#FA6A02] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-bold text-gray-900">Main Construction Site</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">Plot 24, Industrial Sector, Zone B, Mumbai — 400001</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[12px] text-gray-500 font-medium">Estimated delivery: <span className="font-bold text-gray-800">Today, 2–4 hrs</span></span>
                </div>
              </div>

              

              {/* Price breakdown */}
              <div className="bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5">
                <h3 className="text-[15px] font-extrabold text-gray-900 mb-4">Order Summary</h3>

                <div className="space-y-3 text-[13px]">
                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                    <span className="font-bold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="font-medium flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> Promo ({appliedPromo})
                      </span>
                      <span className="font-bold">−₹{discount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">Delivery Fee</span>
                    <span className="font-bold text-gray-900">₹{DELIVERY_FEE.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span className="font-medium">GST (18%)</span>
                    <span className="font-bold text-gray-900">₹{gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>

                  <div className="h-px bg-gray-100 my-1" />

                  <div className="flex justify-between text-gray-900">
                    <span className="font-extrabold text-[16px]">Total</span>
                    <span className="font-extrabold text-[18px] text-[#FA6A02]">
                      ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  {discount > 0 && (
                    <p className="text-[12px] text-green-600 font-bold text-center">
                      🎉 You save ₹{discount.toLocaleString('en-IN', { maximumFractionDigits: 0 })} with promo code!
                    </p>
                  )}
                </div>

                {checkoutError && (
                  <p className="mt-4 text-[12px] text-red-500 font-bold bg-red-50 border border-red-100 rounded-[10px] px-3 py-2">
                    {checkoutError}
                  </p>
                )}

                {/* Checkout CTA */}
                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={placingOrder}
                  className="mt-5 w-full flex items-center justify-center gap-2 bg-[#FA6A02] hover:bg-[#E56000] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-[14px] font-bold text-[15px] transition-all active:scale-[0.98] shadow-[0_4px_14px_rgba(250,106,2,0.35)]"
                >
                  <Zap className="w-4.5 h-4.5" /> {placingOrder ? 'Placing order...' : 'Place Order'}
                </button>

                <p className="text-[11.5px] text-gray-400 text-center mt-3 font-medium">
                  By placing your order, you agree to our{' '}
                  <a href="#" className="text-[#FA6A02] font-bold">Terms & Conditions</a>
                </p>
              </div>

              {/* Help */}
              <div className="bg-gray-900 rounded-[16px] p-5 flex items-center gap-4">
                <div className="w-9 h-9 bg-white/10 rounded-[10px] flex items-center justify-center flex-shrink-0">
                  <Package className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-white">Need bulk pricing?</p>
                  <p className="text-[11.5px] text-gray-400 mt-0.5">Contact us for orders above ₹5 Lakhs</p>
                </div>
                <button className="text-[12px] font-bold text-[#FA6A02] flex items-center gap-1 flex-shrink-0">
                  Talk to us <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Cart Item Row ── */
function CartItemRow({
  item,
  onRemove,
  onQtyChange,
}: {
  item: { material: { id: string; name: string; price: number; unit: string; image?: string; category?: string }; qty: number };
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
}) {
  const lineTotal = item.material.price * item.qty;

  return (
    <div className="flex items-start gap-4 p-5 hover:bg-gray-50/50 transition-colors group">
      {/* Image */}
      <div className="w-16 h-16 rounded-[12px] bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
        {item.material.image ? (
          <img
            src={item.material.image}
            alt={item.material.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[14px] font-bold text-gray-900 leading-tight">{item.material.name}</h3>
            {item.material.category && (
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-0.5 block">
                {item.material.category}
              </span>
            )}
          </div>
          <p className="text-[15px] font-extrabold text-gray-900 flex-shrink-0">
            ₹{lineTotal.toLocaleString('en-IN')}
          </p>
        </div>

        <p className="text-[12px] text-gray-500 mt-1 font-medium">
          ₹{item.material.price.toLocaleString('en-IN')} / {item.material.unit}
        </p>

        {/* Qty + Remove */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center border border-gray-200 rounded-[10px] overflow-hidden">
            <button
              onClick={() => item.qty > 1 ? onQtyChange(item.qty - 1) : onRemove()}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center text-[13px] font-bold text-gray-900 border-x border-gray-200">
              {item.qty}
            </span>
            <button
              onClick={() => onQtyChange(item.qty + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onRemove}
            className="flex items-center gap-1 text-[12px] font-bold text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3.5 h-3.5" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}
