"use client";

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import CustomerNav from '@/components/CustomerNav';
import { CheckCircle, Package, ArrowRight, Truck, Clock } from 'lucide-react';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const orderNum = searchParams.get('num') || 'ORD-XXXX';

  return (
    <div className="min-h-screen bg-[#F6F8FA] font-sans text-gray-900">
      <CustomerNav />

      <div className="max-w-[700px] mx-auto px-6 py-16">
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
          
          <div className="bg-[#16A34A] px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 animate-in zoom-in duration-500">
                <CheckCircle className="w-10 h-10 text-[#16A34A]" strokeWidth={2.5} />
              </div>
              <h1 className="text-[32px] font-extrabold text-white tracking-tight mb-2">Order Confirmed!</h1>
              <p className="text-green-100 font-medium text-[15px] max-w-sm">
                Your construction materials have been successfully ordered and are being processed for dispatch.
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6">
              <div>
                <p className="text-[13px] text-gray-500 font-bold uppercase tracking-wide mb-1">Order Number</p>
                <p className="text-[20px] font-extrabold text-gray-900">{orderNum}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] text-gray-500 font-bold uppercase tracking-wide mb-1">Status</p>
                <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[12px] font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Processing
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-[12px] border border-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Truck className="w-5 h-5 text-[#FA6A02]" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-500 mb-0.5">Delivery Agent</p>
                  <p className="text-[14px] font-bold text-gray-900">Sheshank Logistics</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-[12px] border border-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Clock className="w-5 h-5 text-[#FA6A02]" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-gray-500 mb-0.5">Estimated Arrival</p>
                  <p className="text-[14px] font-bold text-gray-900">Processing...</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/track-order?id=${encodeURIComponent(orderId ?? '')}&num=${encodeURIComponent(orderNum)}`} className="flex-1 bg-[#FA6A02] hover:bg-[#E56000] text-white py-3.5 rounded-[10px] font-bold text-[15px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]">
                <Package className="w-5 h-5" /> Track Order
              </Link>
              <Link href="/materials" className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 py-3.5 rounded-[10px] font-bold text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                Continue Shopping <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
