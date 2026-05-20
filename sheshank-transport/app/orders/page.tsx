"use client";

import React, { useState, useEffect } from 'react';
import {
  Search, LayoutDashboard, Box, Truck, Users,
  BarChart2, Settings, HelpCircle, Plus, ChevronRight,
  Calendar, Target, Building2, ChevronDown, ArrowRight, Home,
  Mountain, MapPin, CheckCircle2, CreditCard, FileText,
  ShoppingCart, Clock, Smartphone, Banknote, Edit3, ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import LogisticsMap from '@/components/LogisticsMap';
import CustomerNav from '@/components/CustomerNav';
import { useApp } from '@/context/AppContext';
import { placeOrder } from '@/lib/api';

// Types (simplified to use context types)
interface CheckoutCartItem {
  material: {
    id: string;
    name: string;
    price: number;
    category: string;
    image?: string;
    unit: string;
  };
  qty: number;
}

export default function OrdersPage() {
  const [isClient, setIsClient] = useState(false);
  const { cart, cartTotal, clearCart } = useApp();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [transportFee, setTransportFee] = useState(150);
  const [activeTransport, setActiveTransport] = useState('flatbed');
  const [activePayment, setActivePayment] = useState('invoice');
  const [activeDate, setActiveDate] = useState('today');
  const [activeTime, setActiveTime] = useState('morning');
  const [isPlacing, setIsPlacing] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    siteName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    phone: '',
    instructions: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculations
  const materialsSubtotal = cartTotal;
  const tax = (materialsSubtotal + transportFee) * 0.18; // 18% GST for India
  const total = materialsSubtotal + transportFee + tax;

  const handleTransportSelect = (type: string, fee: number) => {
    setActiveTransport(type);
    setTransportFee(fee);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setIsPlacing(true);
    try {
      const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const orderItems = cart.map(item => ({
        material_id: item.material.id,
        quantity: item.qty,
        price: item.material.price,
        unit: item.material.unit
      }));

      const res = await placeOrder({
        order_number: orderNumber,
        status: 'pending',
        total_amount: total,
        subtotal: materialsSubtotal,
        delivery_fee: transportFee,
        tax_amount: tax,
        discount_amount: 0,
        delivery_address: deliveryAddress,
        payment_method: activePayment,
        eta: activeDate === 'today' ? 'Today' : activeDate === 'tomorrow' ? 'Tomorrow' : 'Wednesday'
      }, orderItems);

      if (res.success) {
        clearCart();
        router.push(`/order-success?id=${res.orderId}&num=${orderNumber}`);
      } else {
        alert('Failed to place order: ' + res.error);
      }
    } catch (err: any) {
      console.error(err);
      alert('An error occurred while placing your order.');
    } finally {
      setIsPlacing(false);
    }
  };

  if (!isClient) return null; // Prevent hydration mismatch

  // Empty Cart State
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F6F8FA] font-sans text-gray-900">
        <CustomerNav />
        <div className="max-w-[1100px] mx-auto px-6 py-16 flex flex-col items-center justify-center min-h-[70vh]">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-gray-100">
            <ShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-[28px] font-extrabold text-gray-900 mb-2 tracking-tight">Your project cart is empty</h2>
          <p className="text-gray-500 font-medium mb-8 text-center max-w-md">
            You haven't added any construction materials to your dispatch order yet. Let's get your site supplied.
          </p>
          <a href="/materials" className="bg-[#FA6A02] hover:bg-[#E56000] text-white px-8 py-3.5 rounded-[10px] font-bold text-[15px] shadow-sm transition-all active:scale-[0.98] flex items-center gap-2">
            Browse Materials <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FA] font-sans text-gray-900 pb-20">
      <CustomerNav />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">

        {/* Page Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 text-[13px] font-bold text-gray-500 mb-2">
            <a href="/dashboard" className="hover:text-gray-800 transition-colors">Dashboard</a>
            <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span className="text-gray-900">Checkout</span>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-[32px] sm:text-[36px] font-extrabold text-gray-900 tracking-tight leading-tight">Secure Checkout</h1>
            <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#DCFCE7] px-3 py-1.5 rounded-full shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></div>
              <span className="text-[11px] font-bold text-[#166534] uppercase tracking-wide">System Online</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-4">

          {/* LEFT COLUMN: FORMS */}
          <div className="space-y-6">

            {/* Progress Stepper */}
            <div className="flex items-center justify-between bg-white p-5 rounded-[16px] border border-gray-200/70 shadow-sm mb-2">
              {[
                { num: 1, label: 'Delivery Details' },
                { num: 2, label: 'Schedule & Transport' },
                { num: 3, label: 'Payment & Review' }
              ].map((step, idx) => (
                <React.Fragment key={step.num}>
                  <div className={`flex flex-col items-center gap-2.5 transition-opacity duration-300 ${currentStep >= step.num ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold transition-all duration-300 ${currentStep === step.num ? 'bg-[#FA6A02] text-white shadow-[0_4px_12px_rgba(250,106,2,0.35)] ring-4 ring-orange-50' :
                      currentStep > step.num ? 'bg-[#16A34A] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {currentStep > step.num ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                    </div>
                    <span className={`text-[12px] font-bold ${currentStep === step.num ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</span>
                  </div>
                  {idx < 2 && (
                    <div className={`flex-1 h-1 rounded-full mx-2 sm:mx-4 transition-colors duration-500 ${currentStep > step.num ? 'bg-[#16A34A]' : 'bg-gray-100'}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* 1. Delivery Details */}
            {currentStep === 1 && (
              <div className="bg-white rounded-[16px] border border-gray-200/70 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFF0E6] text-[#B23B19] flex items-center justify-center text-[14px] font-bold">1</div>
                    <h2 className="text-[20px] font-bold text-gray-900">Delivery Details</h2>
                  </div>
                  <button className="text-[13px] font-bold text-[#FA6A02] hover:text-[#E56000] bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Saved Addresses
                  </button>
                </div>

                <div className="p-6 space-y-5 bg-white">
                  <div className="space-y-2">
                    <label className="block text-[13px] font-bold text-gray-800">Site Name / Project ID <span className="text-red-500">*</span></label>
                    <input type="text" value={deliveryAddress.siteName} onChange={e => setDeliveryAddress({...deliveryAddress, siteName: e.target.value})} placeholder="e.g., Downtown Metro Extension - Sect 4" className="w-full px-4 py-3.5 bg-[#FDFCFB] border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-gray-400 font-medium text-gray-900" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[13px] font-bold text-gray-800">Complete Address <span className="text-red-500">*</span></label>
                    <input type="text" value={deliveryAddress.street} onChange={e => setDeliveryAddress({...deliveryAddress, street: e.target.value})} placeholder="123 Industrial Parkway, Loading Bay B" className="w-full px-4 py-3.5 bg-[#FDFCFB] border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-gray-400 font-medium text-gray-900" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-[13px] font-bold text-gray-800">City / District <span className="text-red-500">*</span></label>
                      <input type="text" value={deliveryAddress.city} onChange={e => setDeliveryAddress({...deliveryAddress, city: e.target.value})} placeholder="Metropolis" className="w-full px-4 py-3.5 bg-[#FDFCFB] border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-gray-400 font-medium text-gray-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[13px] font-bold text-gray-800">State / Region <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select value={deliveryAddress.state} onChange={e => setDeliveryAddress({...deliveryAddress, state: e.target.value})} className="w-full px-4 py-3.5 bg-[#FDFCFB] border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all appearance-none text-gray-700 font-medium">
                          <option value="" disabled>Select State</option>
                          <option>Maharashtra</option>
                          <option>Karnataka</option>
                          <option>Delhi</option>
                          <option>Goa</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-[13px] font-bold text-gray-800">Postal Code <span className="text-red-500">*</span></label>
                      <input type="text" value={deliveryAddress.postalCode} onChange={e => setDeliveryAddress({...deliveryAddress, postalCode: e.target.value})} placeholder="400001" className="w-full px-4 py-3.5 bg-[#FDFCFB] border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-gray-400 text-gray-900 font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[13px] font-bold text-gray-800">Site Contact Number <span className="text-red-500">*</span></label>
                      <input type="tel" value={deliveryAddress.phone} onChange={e => setDeliveryAddress({...deliveryAddress, phone: e.target.value})} placeholder="+91 90000 00000" className="w-full px-4 py-3.5 bg-[#FDFCFB] border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-gray-400 text-gray-900 font-medium" />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="block text-[13px] font-bold text-gray-800">Delivery Instructions (Optional)</label>
                    <textarea
                      rows={3}
                      value={deliveryAddress.instructions}
                      onChange={e => setDeliveryAddress({...deliveryAddress, instructions: e.target.value})}
                      placeholder="e.g., Enter through Gate 3, ask for Site Manager Ramesh..."
                      className="w-full px-4 py-3 bg-[#FDFCFB] border border-gray-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-gray-400 font-medium text-gray-900 resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-6 flex justify-end border-t border-gray-100">
                    <button onClick={() => setCurrentStep(2)} className="bg-[#FA6A02] hover:bg-[#E56000] text-white px-8 py-3.5 rounded-[10px] font-bold text-[15px] flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]">
                      Next: Schedule Delivery <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Scheduling & Transport */}
            {currentStep === 2 && (
              <div className="bg-white rounded-[16px] border border-gray-200/70 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-white">
                  <div className="w-8 h-8 rounded-full bg-[#FFF0E6] text-[#B23B19] flex items-center justify-center text-[14px] font-bold">2</div>
                  <h2 className="text-[20px] font-bold text-gray-900">Schedule & Logistics</h2>
                </div>

                <div className="p-6 space-y-8 bg-white">
                  {/* Date Selection */}
                  <div className="space-y-3">
                    <label className="block text-[14px] font-bold text-gray-800">Select Delivery Date</label>
                    <div className="flex flex-wrap gap-4">
                      <div onClick={() => setActiveDate('today')} className={`w-[90px] h-[95px] rounded-[12px] border-2 flex flex-col items-center justify-center shadow-sm cursor-pointer relative overflow-hidden transition-all ${activeDate === 'today' ? 'border-[#FA6A02] bg-orange-50/20' : 'border-gray-200 hover:border-orange-300 bg-white'}`}>
                        {activeDate === 'today' && <div className="absolute top-0 left-0 w-full h-1 bg-[#FA6A02]" />}
                        <span className={`text-[10px] font-bold tracking-wider mb-0.5 ${activeDate === 'today' ? 'text-[#FA6A02]' : 'text-gray-500'}`}>TODAY</span>
                        <span className={`text-[28px] font-extrabold leading-none mb-1 ${activeDate === 'today' ? 'text-[#FA6A02]' : 'text-gray-900'}`}>24</span>
                        <span className={`text-[12px] font-bold ${activeDate === 'today' ? 'text-[#FA6A02]' : 'text-gray-500'}`}>Oct</span>
                      </div>
                      <div onClick={() => setActiveDate('tomorrow')} className={`w-[90px] h-[95px] rounded-[12px] border-2 flex flex-col items-center justify-center shadow-sm cursor-pointer relative overflow-hidden transition-all ${activeDate === 'tomorrow' ? 'border-[#FA6A02] bg-orange-50/20' : 'border-gray-200 hover:border-orange-300 bg-white'}`}>
                        {activeDate === 'tomorrow' && <div className="absolute top-0 left-0 w-full h-1 bg-[#FA6A02]" />}
                        <span className={`text-[10px] font-bold tracking-wider mb-0.5 ${activeDate === 'tomorrow' ? 'text-[#FA6A02]' : 'text-gray-500'}`}>TOMORROW</span>
                        <span className={`text-[28px] font-extrabold leading-none mb-1 ${activeDate === 'tomorrow' ? 'text-[#FA6A02]' : 'text-gray-900'}`}>25</span>
                        <span className={`text-[12px] font-bold ${activeDate === 'tomorrow' ? 'text-[#FA6A02]' : 'text-gray-500'}`}>Oct</span>
                      </div>
                      <div onClick={() => setActiveDate('wed')} className={`w-[90px] h-[95px] rounded-[12px] border-2 flex flex-col items-center justify-center shadow-sm cursor-pointer relative overflow-hidden transition-all ${activeDate === 'wed' ? 'border-[#FA6A02] bg-orange-50/20' : 'border-gray-200 hover:border-orange-300 bg-white'}`}>
                        {activeDate === 'wed' && <div className="absolute top-0 left-0 w-full h-1 bg-[#FA6A02]" />}
                        <span className={`text-[10px] font-bold tracking-wider mb-0.5 uppercase ${activeDate === 'wed' ? 'text-[#FA6A02]' : 'text-gray-500'}`}>Wed</span>
                        <span className={`text-[28px] font-extrabold leading-none mb-1 ${activeDate === 'wed' ? 'text-[#FA6A02]' : 'text-gray-900'}`}>26</span>
                        <span className={`text-[12px] font-bold ${activeDate === 'wed' ? 'text-[#FA6A02]' : 'text-gray-500'}`}>Oct</span>
                      </div>
                      <div className="w-[90px] h-[95px] bg-gray-50 rounded-[12px] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all group">
                        <Calendar className="w-6 h-6 text-gray-400 mb-1 group-hover:text-gray-600 transition-colors" />
                        <span className="text-[12px] font-bold text-gray-500 group-hover:text-gray-700 transition-colors">Select</span>
                      </div>
                    </div>
                  </div>

                  {/* Time Window */}
                  <div className="space-y-3">
                    <label className="block text-[14px] font-bold text-gray-800">Time Window</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button onClick={() => setActiveTime('morning')} className={`py-4 px-3 rounded-[10px] text-[13px] font-bold shadow-sm transition-all border-2 flex items-center justify-center gap-2 ${activeTime === 'morning' ? 'border-[#FA6A02] bg-orange-50/20 text-[#FA6A02]' : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'}`}>
                        <Clock className="w-4 h-4" /> 06:00 - 09:00 AM
                      </button>
                      <button onClick={() => setActiveTime('mid')} className={`py-4 px-3 rounded-[10px] text-[13px] font-bold shadow-sm transition-all border-2 flex items-center justify-center gap-2 ${activeTime === 'mid' ? 'border-[#FA6A02] bg-orange-50/20 text-[#FA6A02]' : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'}`}>
                        <Clock className="w-4 h-4" /> 09:00 - 12:00 PM
                      </button>
                      <button onClick={() => setActiveTime('afternoon')} className={`py-4 px-3 rounded-[10px] text-[13px] font-bold shadow-sm transition-all border-2 flex items-center justify-center gap-2 ${activeTime === 'afternoon' ? 'border-[#FA6A02] bg-orange-50/20 text-[#FA6A02]' : 'border-gray-200 bg-white text-gray-600 hover:border-orange-300'}`}>
                        <Clock className="w-4 h-4" /> 12:00 - 15:00 PM
                      </button>
                    </div>
                  </div>

                  {/* Transport Selection */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[14px] font-bold text-gray-800">Vehicle Type</label>
                      <span className="text-[12px] font-medium text-gray-500">Based on cart volume</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        onClick={() => handleTransportSelect('flatbed', 150)}
                        className={`p-5 rounded-[12px] border-2 cursor-pointer transition-all ${activeTransport === 'flatbed' ? 'border-[#FA6A02] bg-orange-50/20 shadow-md ring-1 ring-[#FA6A02]/10' : 'border-gray-200 hover:border-orange-300 bg-white hover:shadow-sm'}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-lg ${activeTransport === 'flatbed' ? 'bg-orange-100 text-[#FA6A02]' : 'bg-gray-100 text-gray-500'}`}>
                            <Truck className="w-6 h-6" />
                          </div>
                          <span className={`text-[16px] font-extrabold ${activeTransport === 'flatbed' ? 'text-[#FA6A02]' : 'text-gray-900'}`}>₹150.00</span>
                        </div>
                        <h4 className="font-bold text-[15px] text-gray-900 mb-1">Standard Flatbed</h4>
                        <p className="text-[13px] text-gray-500 font-medium leading-relaxed">Ideal for palletized goods, cement bags, and lumber. Max 20 Tons.</p>
                      </div>

                      <div
                        onClick={() => handleTransportSelect('dump', 320)}
                        className={`p-5 rounded-[12px] border-2 cursor-pointer transition-all ${activeTransport === 'dump' ? 'border-[#FA6A02] bg-orange-50/20 shadow-md ring-1 ring-[#FA6A02]/10' : 'border-gray-200 hover:border-orange-300 bg-white hover:shadow-sm'}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-lg ${activeTransport === 'dump' ? 'bg-orange-100 text-[#FA6A02]' : 'bg-gray-100 text-gray-500'}`}>
                            <Truck className="w-6 h-6" />
                          </div>
                          <span className={`text-[16px] font-extrabold ${activeTransport === 'dump' ? 'text-[#FA6A02]' : 'text-gray-900'}`}>₹320.00</span>
                        </div>
                        <h4 className="font-bold text-[15px] text-gray-900 mb-1">Heavy Dump Truck</h4>
                        <p className="text-[13px] text-gray-500 font-medium leading-relaxed">Required for bulk aggregates, sand, and loose gravel. Max 35 Tons.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between items-center border-t border-gray-100">
                    <button onClick={() => setCurrentStep(1)} className="text-gray-500 hover:text-gray-900 font-bold text-[14px] py-2 transition-colors flex items-center gap-1.5">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button onClick={() => setCurrentStep(3)} className="bg-[#FA6A02] hover:bg-[#E56000] text-white px-8 py-3.5 rounded-[10px] font-bold text-[15px] flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]">
                      Next: Payment <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Payment Method */}
            {currentStep === 3 && (
              <div className="bg-white rounded-[16px] border border-gray-200/70 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-white">
                  <div className="w-8 h-8 rounded-full bg-[#FFF0E6] text-[#B23B19] flex items-center justify-center text-[14px] font-bold">3</div>
                  <h2 className="text-[20px] font-bold text-gray-900">Payment & Review</h2>
                </div>

                <div className="p-6 space-y-6 bg-white">
                  <div className="space-y-4">
                    <label className="block text-[14px] font-bold text-gray-800">Select Payment Method</label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Corporate Invoice */}
                      <div
                        onClick={() => setActivePayment('invoice')}
                        className={`p-4 rounded-[12px] border-2 cursor-pointer flex items-start gap-4 transition-all ${activePayment === 'invoice' ? 'border-[#FA6A02] bg-orange-50/20 shadow-sm' : 'border-gray-200 hover:border-orange-300 bg-white'}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-0.5 ${activePayment === 'invoice' ? 'bg-[#FA6A02] text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[15px] text-gray-900 mb-1 flex items-center justify-between">
                            Corporate Invoice
                            {activePayment === 'invoice' && <CheckCircle2 className="w-5 h-5 text-[#FA6A02]" />}
                          </h4>
                          <p className="text-[13px] text-gray-500 font-medium leading-tight">Net 30. Billed to verified account.</p>
                        </div>
                      </div>

                      {/* UPI / GPay */}
                      <div
                        onClick={() => setActivePayment('upi')}
                        className={`p-4 rounded-[12px] border-2 cursor-pointer flex items-start gap-4 transition-all ${activePayment === 'upi' ? 'border-[#FA6A02] bg-orange-50/20 shadow-sm' : 'border-gray-200 hover:border-orange-300 bg-white'}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-0.5 ${activePayment === 'upi' ? 'bg-[#FA6A02] text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[15px] text-gray-900 mb-1 flex items-center justify-between">
                            UPI / GPay
                            {activePayment === 'upi' && <CheckCircle2 className="w-5 h-5 text-[#FA6A02]" />}
                          </h4>
                          <p className="text-[13px] text-gray-500 font-medium leading-tight">Instant transfer via QR or UPI ID.</p>
                        </div>
                      </div>

                      {/* Credit/Debit Card */}
                      <div
                        onClick={() => setActivePayment('card')}
                        className={`p-4 rounded-[12px] border-2 cursor-pointer flex items-start gap-4 transition-all ${activePayment === 'card' ? 'border-[#FA6A02] bg-orange-50/20 shadow-sm' : 'border-gray-200 hover:border-orange-300 bg-white'}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-0.5 ${activePayment === 'card' ? 'bg-[#FA6A02] text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[15px] text-gray-900 mb-1 flex items-center justify-between">
                            Credit/Debit Card
                            {activePayment === 'card' && <CheckCircle2 className="w-5 h-5 text-[#FA6A02]" />}
                          </h4>
                          <p className="text-[13px] text-gray-500 font-medium leading-tight">Visa, Mastercard, RuPay accepted.</p>
                        </div>
                      </div>

                      {/* Cash on Delivery */}
                      <div
                        onClick={() => setActivePayment('cod')}
                        className={`p-4 rounded-[12px] border-2 cursor-pointer flex items-start gap-4 transition-all ${activePayment === 'cod' ? 'border-[#FA6A02] bg-orange-50/20 shadow-sm' : 'border-gray-200 hover:border-orange-300 bg-white'}`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-0.5 ${activePayment === 'cod' ? 'bg-[#FA6A02] text-white' : 'bg-gray-100 text-gray-500'}`}>
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[15px] text-gray-900 mb-1 flex items-center justify-between">
                            Cash on Delivery
                            {activePayment === 'cod' && <CheckCircle2 className="w-5 h-5 text-[#FA6A02]" />}
                          </h4>
                          <p className="text-[13px] text-gray-500 font-medium leading-tight">Pay driver at site. Limits apply.</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Form Expanded */}
                    {activePayment === 'card' && (
                      <div className="p-5 bg-gray-50 rounded-[12px] border border-gray-200 space-y-4 animate-in slide-in-from-top-2 mt-4">
                        <div className="space-y-2">
                          <label className="block text-[13px] font-bold text-gray-700">Card Number</label>
                          <div className="relative">
                            <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-mono" />
                            <CreditCard className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="block text-[13px] font-bold text-gray-700">Expiry Date</label>
                            <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-mono text-center" />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-[13px] font-bold text-gray-700">CVV</label>
                            <input type="text" placeholder="123" className="w-full px-4 py-3 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-mono text-center" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* UPI Expanded */}
                    {activePayment === 'upi' && (
                      <div className="p-5 bg-gray-50 rounded-[12px] border border-gray-200 space-y-4 animate-in slide-in-from-top-2 mt-4 flex flex-col items-center justify-center py-8">
                        <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center mb-2">
                          <Smartphone className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-[13px] font-bold text-gray-700">Scan QR Code or enter UPI ID</p>
                        <input type="text" placeholder="username@upi" className="w-full max-w-sm px-4 py-3 bg-white border border-gray-300 rounded-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-center" />
                      </div>
                    )}
                  </div>

                  <div className="pt-6 flex justify-between items-center border-t border-gray-100">
                    <button onClick={() => setCurrentStep(2)} className="text-gray-500 hover:text-gray-900 font-bold text-[14px] py-2 transition-colors flex items-center gap-1.5">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button onClick={handlePlaceOrder} disabled={isPlacing} className={`bg-[#16A34A] hover:bg-[#15803D] text-white px-8 py-3.5 rounded-[10px] font-bold text-[15px] flex items-center gap-2 shadow-[0_4px_14px_rgba(22,163,74,0.25)] transition-all active:scale-[0.98] ${isPlacing ? 'opacity-70 cursor-not-allowed' : ''}`}>
                      {isPlacing ? 'Placing Order...' : 'Confirm & Pay'} {isPlacing ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span> : <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: SUMMARY & MAP */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start z-10">

            {/* Dynamic Order Summary */}
            <div className="bg-white rounded-[16px] border border-gray-200/70 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-white flex items-center justify-between">
                <h2 className="text-[18px] font-extrabold text-gray-900 tracking-tight">Order Summary</h2>
                <a href="/cart" className="text-[12px] font-bold text-[#FA6A02] hover:text-[#E56000] flex items-center gap-1 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Cart
                </a>
              </div>

              <div className="p-5 space-y-5">
                {/* Dynamically Mapped Items */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 group">
                      <div className="w-12 h-12 bg-gray-50 rounded-[8px] flex items-center justify-center flex-shrink-0 border border-gray-200/60 overflow-hidden">
                        {item.material.image ? (
                          <img src={item.material.image} alt={item.material.name} className="w-full h-full object-cover" />
                        ) : (
                          <Box className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[14px] text-gray-900 truncate">{item.material.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-gray-500 uppercase bg-gray-100 px-1.5 py-0.5 rounded">{item.material.category}</span>
                          <span className="text-[12px] text-gray-500 font-medium">{item.qty} {item.material.unit}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-[14px] text-gray-900">₹{(item.material.price * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Section */}
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center text-[13.5px]">
                  <span className="text-gray-500 font-medium">Materials Subtotal</span>
                  <span className="text-gray-900 font-bold">₹{materialsSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[13.5px]">
                  <span className="text-gray-500 font-medium flex items-center gap-1.5">
                    Transport
                    <span className="text-[9px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-500 uppercase font-bold tracking-wide shadow-sm">
                      {activeTransport}
                    </span>
                  </span>
                  <span className="text-gray-900 font-bold">₹{transportFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[13.5px]">
                  <span className="text-gray-500 font-medium">GST / Tax (18%)</span>
                  <span className="text-gray-900 font-bold">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="px-5 py-5 bg-white border-t border-gray-100">
                <div className="flex justify-between items-end">
                  <span className="text-[16px] font-bold text-gray-600">Total Amount</span>
                  <span className="text-[28px] font-extrabold text-gray-900 tracking-tight leading-none">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Optional Map Element Below Summary */}
            <div className="bg-white rounded-[16px] border border-gray-200/70 shadow-sm p-2">
              <LogisticsMap height="h-[200px]" />
              <div className="p-3 bg-gray-50 rounded-b-[10px] mt-2 flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-400" />
                <span className="text-[12px] font-medium text-gray-600">Route map calculation active</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}