"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import CustomerNav from '@/components/CustomerNav';
import {
  CheckCircle2, Clock, Package,
  Phone, MessageSquare, ChevronRight, RotateCcw, Search
} from 'lucide-react';
import LogisticsMap from '@/components/LogisticsMap';
import { getOrders, Order } from '@/lib/api';

type TrackingStep = { label: string; done: boolean; time: string };
type TrackingOrder = {
  dbId?: string;
  id: string;
  item: string;
  qty: string;
  status: string;
  eta: string;
  driver: string;
  phone: string;
  steps: TrackingStep[];
};

const DEMO_ORDERS: TrackingOrder[] = [
  {
    id: 'ORD-4807',
    item: 'Grade 60 Steel Rebar',
    qty: '5 Tons',
    status: 'in-transit',
    eta: '28 min',
    driver: 'Manoj Kumar',
    phone: '+91 98765 43210',
    steps: [
      { label: 'Order Confirmed', done: true, time: '9:00 AM' },
      { label: 'Dispatched from Depot', done: true, time: '10:15 AM' },
      { label: 'En Route to Site', done: true, time: '11:40 AM' },
      { label: 'Delivered', done: false, time: 'Est. 12:30 PM' },
    ],
  },
  {
    id: 'ORD-4821',
    item: 'Portland Cement x 50 Bags',
    qty: '50 Bags',
    status: 'delivered',
    eta: '-',
    driver: 'Suresh Patil',
    phone: '+91 91234 56789',
    steps: [
      { label: 'Order Confirmed', done: true, time: '8:00 AM' },
      { label: 'Dispatched from Depot', done: true, time: '9:00 AM' },
      { label: 'En Route to Site', done: true, time: '10:30 AM' },
      { label: 'Delivered', done: true, time: '11:15 AM' },
    ],
  },
];

const STATUS_META: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  'in-transit': { label: 'En Route', color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
  dispatched: { label: 'Dispatched', color: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
  delivered: { label: 'Delivered', color: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-500' },
  confirmed: { label: 'Confirmed', color: 'text-green-700', bg: 'bg-green-50', dot: 'bg-green-500' },
  pending: { label: 'Pending', color: 'text-orange-700', bg: 'bg-orange-50', dot: 'bg-orange-500' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' },
};

const FALLBACK_DRIVER = 'Sheshank Logistics';
const FALLBACK_PHONE = '+91 98765 43210';

function normalizeStatus(value?: string) {
  const status = (value ?? 'pending').trim().toLowerCase();
  if (status === 'in transit' || status === 'in_transit') return 'in-transit';
  return status;
}

function formatOrderTime(value?: string) {
  if (!value) return 'Just now';
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: 'short',
  }).format(new Date(value));
}

function getOrderTitle(order: Order) {
  const items = order.items ?? [];
  if (items.length === 0) return 'Construction Materials';
  if (items.length === 1) {
    const item = items[0];
    return item.material_name || `Material ${item.material_id}`;
  }
  return `${items.length} construction materials`;
}

function getOrderQuantity(order: Order) {
  const items = order.items ?? [];
  const totalQty = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  if (items.length === 1) return `${totalQty || items[0].quantity} ${items[0].unit}`;
  return `${items.length} items - ${totalQty} units`;
}

function getSteps(order: Order): TrackingStep[] {
  const status = normalizeStatus(order.status);
  const created = formatOrderTime(order.created_at);
  return [
    { label: 'Order Confirmed', done: ['pending', 'confirmed', 'dispatched', 'in-transit', 'delivered'].includes(status), time: created },
    { label: 'Dispatched from Depot', done: ['dispatched', 'in-transit', 'delivered'].includes(status), time: ['dispatched', 'in-transit', 'delivered'].includes(status) ? 'Assigned' : 'Awaiting dispatch' },
    { label: 'En Route to Site', done: ['in-transit', 'delivered'].includes(status), time: ['in-transit', 'delivered'].includes(status) ? 'On the way' : 'Pending' },
    { label: 'Delivered', done: status === 'delivered', time: status === 'delivered' ? 'Completed' : `Est. ${order.eta || 'Soon'}` },
  ];
}

function mapOrder(order: Order): TrackingOrder {
  const status = normalizeStatus(order.status);

  return {
    dbId: order.id,
    id: order.order_number,
    item: getOrderTitle(order),
    qty: getOrderQuantity(order),
    status,
    eta: order.eta || 'Processing',
    driver: order.driver_name || FALLBACK_DRIVER,
    phone: order.driver_phone || FALLBACK_PHONE,
    steps: getSteps(order),
  };
}

export default function TrackOrderClient() {
  const searchParams = useSearchParams();
  const selectedDbId = searchParams.get('id');
  const selectedOrderNumber = searchParams.get('num');
  const [orders, setOrders] = useState<TrackingOrder[]>(DEMO_ORDERS);
  const [activeOrder, setActiveOrder] = useState<TrackingOrder>(DEMO_ORDERS[0]);
  const [trackId, setTrackId] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let pollHandle: ReturnType<typeof setInterval> | undefined;

    async function loadOrders(silent = false) {
      if (!silent) {
        setIsLoading(true);
      }

      const savedOrders = await getOrders();
      if (!mounted) return;

      const liveOrders = savedOrders.map(mapOrder);
      const nextOrders = liveOrders.length > 0 ? liveOrders : DEMO_ORDERS;
      const selectedOrder = nextOrders.find(order => order.dbId === selectedDbId || order.id === selectedOrderNumber) ?? nextOrders[0];

      setOrders(nextOrders);
      setActiveOrder(selectedOrder);
      setTrackId('');
      setActiveSearch('');
      setIsLoading(false);
    }

    loadOrders();

    const refreshOrders = () => {
      void loadOrders(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshOrders();
      }
    };

    const handleFocus = () => {
      refreshOrders();
    };

    pollHandle = setInterval(refreshOrders, 10000);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      mounted = false;
      if (pollHandle) {
        clearInterval(pollHandle);
      }
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedDbId, selectedOrderNumber]);

  const filteredOrders = useMemo(() => {
    const query = activeSearch.trim().toLowerCase();
    if (!query) return orders;
    return orders.filter(order => order.id.toLowerCase().includes(query) || order.dbId?.toLowerCase().includes(query));
  }, [orders, activeSearch]);

  const handleTrack = () => {
    const query = trackId.trim().toLowerCase();
    setActiveSearch(query);
    if (!query) return;
    const match = orders.find(order => order.id.toLowerCase() === query || order.dbId?.toLowerCase() === query)
      ?? orders.find(order => order.id.toLowerCase().includes(query) || order.dbId?.toLowerCase().includes(query));
    if (match) setActiveOrder(match);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] font-sans text-gray-900">
      <CustomerNav />

      <div className="max-w-[1200px] mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-extrabold text-gray-900 tracking-tight mb-1">Track Delivery</h1>
          <p className="text-[15px] text-gray-500 font-medium">Live updates on your active and recent orders.</p>
        </div>

        {/* Quick Track by ID */}
        <div className="bg-white rounded-[18px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-5 mb-8 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={trackId}
              onChange={e => setTrackId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              type="text"
              placeholder={`Enter Order ID  (e.g. ${activeOrder.id})`}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-[12px] text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FA6A02]/20 focus:border-[#FA6A02] transition-all font-medium"
            />
          </div>
          <button onClick={handleTrack} className="bg-[#FA6A02] hover:bg-[#E56000] text-white px-7 py-3 rounded-[12px] font-bold text-[14px] transition-all active:scale-[0.98] shadow-[0_2px_10px_rgba(250,106,2,0.25)] flex-shrink-0">
            Track
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

          {/* Left: Order List */}
          <div className="space-y-3">
            <p className="text-[12px] font-extrabold text-gray-400 uppercase tracking-widest px-1 mb-3">Active & Recent</p>
            {isLoading && (
              <div className="bg-white border border-gray-100 rounded-[16px] p-4 text-[13px] font-bold text-gray-500">
                Loading your latest orders...
              </div>
            )}
            {!isLoading && filteredOrders.length === 0 && (
              <div className="bg-white border border-gray-100 rounded-[16px] p-4 text-[13px] font-bold text-gray-500">
                No order found for &quot;{activeSearch}&quot;.
              </div>
            )}
            {filteredOrders.map(order => {
              const meta = STATUS_META[order.status] ?? STATUS_META.pending;
              const isActive = activeOrder.id === order.id;
              return (
                <button
                  key={order.id}
                  onClick={() => setActiveOrder(order)}
                  className={`w-full text-left p-4 rounded-[16px] border transition-all ${isActive ? 'border-[#FA6A02] bg-orange-50/40 shadow-[0_0_0_2px_rgba(250,106,2,0.1)]' : 'border-gray-100 bg-white hover:border-gray-200 shadow-[0_2px_10px_rgba(0,0,0,0.03)]'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 ${isActive ? 'bg-[#FA6A02] text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Package className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-[13px] font-extrabold text-gray-900">{order.id}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${meta.bg} ${meta.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                      </div>
                      <p className="text-[12.5px] text-gray-600 font-medium truncate">{order.item}</p>
                      {order.status === 'in-transit' && (
                        <p className="text-[11.5px] text-[#FA6A02] font-bold mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> ETA: {order.eta}
                        </p>
                      )}
                    </div>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-1 ${isActive ? 'text-[#FA6A02]' : 'text-gray-300'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detail Panel */}
          <div className="space-y-5">

            {/* Map */}
            <LogisticsMap height="h-[280px]" />

            {/* Order Detail Card */}
            <div className="bg-white rounded-[18px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{activeOrder.id}</p>
                  <h2 className="text-[18px] font-extrabold text-gray-900">{activeOrder.item}</h2>
                  <p className="text-[13px] text-gray-500 font-medium mt-0.5">{activeOrder.qty}</p>
                </div>
                {activeOrder.status === 'delivered' ? (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-full">
                    <CheckCircle2 className="w-4.5 h-4.5 text-green-600" />
                    <span className="text-[13px] font-bold text-green-700">Delivered</span>
                  </div>
                ) : (
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">ETA</p>
                    <p className="text-[24px] font-extrabold text-[#FA6A02] leading-tight">{activeOrder.eta}</p>
                  </div>
                )}
              </div>

              {/* Tracking Steps */}
              <div className="p-5 border-b border-gray-100">
                <p className="text-[12px] font-extrabold text-gray-400 uppercase tracking-wider mb-4">Delivery Progress</p>
                <div className="relative">
                  {/* vertical line */}
                  <div className="absolute left-[14px] top-3 bottom-3 w-[2px] bg-gray-100 z-0" />
                  <div className="space-y-5 relative z-10">
                    {activeOrder.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${step.done ? 'bg-[#FA6A02] shadow-[0_2px_8px_rgba(250,106,2,0.3)]' : 'bg-gray-100 border-2 border-gray-200'}`}>
                          {step.done
                            ? <CheckCircle2 className="w-4 h-4 text-white" />
                            : <div className="w-2 h-2 rounded-full bg-gray-300" />
                          }
                        </div>
                        <div className="flex-1 pt-0.5">
                          <p className={`text-[14px] font-bold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                          <p className={`text-[12px] font-medium mt-0.5 ${step.done ? 'text-gray-500' : 'text-gray-300'}`}>{step.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Driver Info */}
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-extrabold text-[15px] flex-shrink-0">
                    {activeOrder.driver.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-extrabold text-gray-900">{activeOrder.driver}</p>
                    <p className="text-[12px] text-gray-400 font-medium">Delivery Driver</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a href={`tel:${activeOrder.phone}`} className="w-9 h-9 rounded-[10px] bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
                    <Phone className="w-4 h-4" />
                  </a>
                  <button className="w-9 h-9 rounded-[10px] bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  {activeOrder.status === 'delivered' && (
                    <button className="flex items-center gap-2 bg-[#FA6A02] hover:bg-[#E56000] text-white px-4 py-2 rounded-[10px] text-[13px] font-bold transition-all">
                      <RotateCcw className="w-3.5 h-3.5" /> Reorder
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
