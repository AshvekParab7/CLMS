"use client";

import React, { useEffect, useState } from 'react';

const TRUCKS = [
  { id: 'T-04', x: 68, y: 42, route: 'Zone A → Site Delta', eta: '14 min', status: 'on-route' },
  { id: 'T-07', x: 30, y: 62, route: 'Depot → Zone C', eta: '31 min', status: 'on-route' },
  { id: 'T-12', x: 80, y: 65, route: 'Delivered', eta: '—', status: 'delivered' },
];

export default function LogisticsMap({ height = 'h-[310px]' }: { height?: string }) {
  const [activeTruck, setActiveTruck] = useState<string | null>('T-04');
  const [tick, setTick] = useState(0);

  // Animate a "live pulse" every second
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1200);
    return () => clearInterval(id);
  }, []);

  // Slowly move trucks along simplified paths
  const truckPositions = TRUCKS.map(t => ({
    ...t,
    cx: t.id === 'T-04' ? t.x + (Math.sin(tick * 0.25) * 1.5) : t.id === 'T-07' ? t.x + (tick * 0.15) % 8 : t.x,
    cy: t.id === 'T-04' ? t.y + (Math.cos(tick * 0.25) * 0.8) : t.id === 'T-07' ? t.y - (tick * 0.08) % 5 : t.y,
  }));

  const selected = truckPositions.find(t => t.id === activeTruck);

  return (
    <div className={`${height} bg-[#0F1923] rounded-[16px] border border-gray-800 overflow-hidden relative shadow-[0_8px_40px_rgba(0,0,0,0.4)] select-none`}>
      
      {/* SVG Map Canvas */}
      <svg viewBox="0 0 100 80" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        
        {/* Base map grid (city blocks) */}
        <rect width="100" height="80" fill="#0F1923" />
        
        {/* Major road network */}
        {/* Horizontal roads */}
        <line x1="0" y1="20" x2="100" y2="20" stroke="#1E2D3E" strokeWidth="3.5" />
        <line x1="0" y1="40" x2="100" y2="40" stroke="#1E2D3E" strokeWidth="2.5" />
        <line x1="0" y1="60" x2="100" y2="60" stroke="#1E2D3E" strokeWidth="3" />
        {/* Vertical roads */}
        <line x1="20" y1="0" x2="20" y2="80" stroke="#1E2D3E" strokeWidth="2.5" />
        <line x1="45" y1="0" x2="45" y2="80" stroke="#1E2D3E" strokeWidth="3.5" />
        <line x1="70" y1="0" x2="70" y2="80" stroke="#1E2D3E" strokeWidth="2.5" />
        {/* Minor roads */}
        <line x1="0" y1="10" x2="45" y2="10" stroke="#162030" strokeWidth="1.2" />
        <line x1="45" y1="10" x2="100" y2="10" stroke="#162030" strokeWidth="1.2" />
        <line x1="0" y1="30" x2="100" y2="30" stroke="#162030" strokeWidth="1.2" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#162030" strokeWidth="1.2" />
        <line x1="0" y1="70" x2="100" y2="70" stroke="#162030" strokeWidth="1.2" />
        <line x1="10" y1="0" x2="10" y2="80" stroke="#162030" strokeWidth="1.2" />
        <line x1="32" y1="0" x2="32" y2="80" stroke="#162030" strokeWidth="1.2" />
        <line x1="58" y1="0" x2="58" y2="80" stroke="#162030" strokeWidth="1.2" />
        <line x1="82" y1="0" x2="82" y2="80" stroke="#162030" strokeWidth="1.2" />

        {/* City blocks / buildings fill */}
        <rect x="1" y="1" width="8" height="8" fill="#131F2B" rx="0.5" />
        <rect x="11" y="1" width="8" height="8" fill="#13202D" rx="0.5" />
        <rect x="21" y="1" width="10" height="8" fill="#111D27" rx="0.5" />
        <rect x="33" y="1" width="11" height="8" fill="#131F2B" rx="0.5" />
        <rect x="46" y="1" width="11" height="8" fill="#13202D" rx="0.5" />
        <rect x="59" y="1" width="10" height="8" fill="#111D27" rx="0.5" />
        <rect x="71" y="1" width="10" height="8" fill="#131F2B" rx="0.5" />
        <rect x="83" y="1" width="16" height="8" fill="#13202D" rx="0.5" />

        <rect x="1" y="11" width="8" height="8" fill="#13202D" rx="0.5" />
        <rect x="11" y="11" width="8" height="8" fill="#111D27" rx="0.5" />
        <rect x="21" y="11" width="10" height="8" fill="#131F2B" rx="0.5" />
        <rect x="33" y="11" width="11" height="8" fill="#13202D" rx="0.5" />
        <rect x="46" y="11" width="11" height="8" fill="#111D27" rx="0.5" />
        <rect x="59" y="11" width="10" height="8" fill="#131F2B" rx="0.5" />
        <rect x="71" y="11" width="10" height="8" fill="#13202D" rx="0.5" />
        <rect x="83" y="11" width="16" height="8" fill="#111D27" rx="0.5" />

        <rect x="1" y="21" width="8" height="8" fill="#111D27" rx="0.5" />
        <rect x="11" y="21" width="8" height="8" fill="#131F2B" rx="0.5" />
        <rect x="21" y="21" width="10" height="8" fill="#13202D" rx="0.5" />
        <rect x="33" y="21" width="11" height="8" fill="#111D27" rx="0.5" />
        <rect x="46" y="21" width="11" height="8" fill="#131F2B" rx="0.5" />
        <rect x="59" y="21" width="10" height="8" fill="#13202D" rx="0.5" />
        <rect x="71" y="21" width="10" height="8" fill="#111D27" rx="0.5" />
        <rect x="83" y="21" width="16" height="8" fill="#131F2B" rx="0.5" />

        <rect x="1" y="31" width="8" height="8" fill="#131F2B" rx="0.5" />
        <rect x="11" y="31" width="8" height="8" fill="#13202D" rx="0.5" />
        <rect x="21" y="31" width="10" height="8" fill="#111D27" rx="0.5" />
        <rect x="33" y="31" width="11" height="8" fill="#131F2B" rx="0.5" />
        <rect x="46" y="31" width="11" height="8" fill="#13202D" rx="0.5" />
        <rect x="59" y="31" width="10" height="8" fill="#111D27" rx="0.5" />
        <rect x="71" y="31" width="10" height="8" fill="#131F2B" rx="0.5" />
        <rect x="83" y="31" width="16" height="8" fill="#13202D" rx="0.5" />

        <rect x="1" y="41" width="8" height="8" fill="#13202D" rx="0.5" />
        <rect x="11" y="41" width="8" height="8" fill="#111D27" rx="0.5" />
        <rect x="21" y="41" width="10" height="8" fill="#131F2B" rx="0.5" />
        <rect x="33" y="41" width="11" height="8" fill="#13202D" rx="0.5" />
        <rect x="46" y="41" width="11" height="8" fill="#111D27" rx="0.5" />
        <rect x="59" y="41" width="10" height="8" fill="#131F2B" rx="0.5" />
        <rect x="71" y="41" width="10" height="8" fill="#13202D" rx="0.5" />
        <rect x="83" y="41" width="16" height="8" fill="#111D27" rx="0.5" />

        <rect x="1" y="51" width="8" height="8" fill="#111D27" rx="0.5" />
        <rect x="11" y="51" width="8" height="8" fill="#131F2B" rx="0.5" />
        <rect x="21" y="51" width="10" height="8" fill="#13202D" rx="0.5" />
        <rect x="33" y="51" width="11" height="8" fill="#111D27" rx="0.5" />
        <rect x="46" y="51" width="11" height="8" fill="#131F2B" rx="0.5" />
        <rect x="59" y="51" width="10" height="8" fill="#13202D" rx="0.5" />
        <rect x="71" y="51" width="10" height="8" fill="#111D27" rx="0.5" />
        <rect x="83" y="51" width="16" height="8" fill="#131F2B" rx="0.5" />

        <rect x="1" y="61" width="8" height="8" fill="#131F2B" rx="0.5" />
        <rect x="11" y="61" width="8" height="8" fill="#13202D" rx="0.5" />
        <rect x="21" y="61" width="10" height="8" fill="#111D27" rx="0.5" />
        <rect x="33" y="61" width="11" height="8" fill="#131F2B" rx="0.5" />
        <rect x="46" y="61" width="11" height="8" fill="#13202D" rx="0.5" />
        <rect x="59" y="61" width="10" height="8" fill="#111D27" rx="0.5" />
        <rect x="71" y="61" width="10" height="8" fill="#131F2B" rx="0.5" />
        <rect x="83" y="61" width="16" height="8" fill="#13202D" rx="0.5" />

        <rect x="1" y="71" width="8" height="8" fill="#13202D" rx="0.5" />
        <rect x="11" y="71" width="8" height="8" fill="#111D27" rx="0.5" />
        <rect x="21" y="71" width="10" height="8" fill="#131F2B" rx="0.5" />
        <rect x="33" y="71" width="11" height="8" fill="#13202D" rx="0.5" />
        <rect x="46" y="71" width="11" height="8" fill="#111D27" rx="0.5" />
        <rect x="59" y="71" width="10" height="8" fill="#131F2B" rx="0.5" />
        <rect x="71" y="71" width="10" height="8" fill="#13202D" rx="0.5" />
        <rect x="83" y="71" width="16" height="8" fill="#111D27" rx="0.5" />

        {/* Delivery Zones (colored polygon overlays) */}
        {/* Zone A - Blue (Depot Origin) */}
        <rect x="1" y="1" width="30" height="28" fill="rgba(59,130,246,0.06)" stroke="#3B82F6" strokeWidth="0.4" strokeDasharray="1,1" rx="0.5" />
        {/* Zone B - Orange (Priority Delivery) */}
        <rect x="46" y="21" width="35" height="28" fill="rgba(250,106,2,0.06)" stroke="#FA6A02" strokeWidth="0.4" strokeDasharray="1,1" rx="0.5" />
        {/* Zone C - Green (Delivered) */}
        <rect x="59" y="51" width="40" height="28" fill="rgba(34,197,94,0.07)" stroke="#22C55E" strokeWidth="0.4" strokeDasharray="1,1" rx="0.5" />

        {/* Zone Labels */}
        <text x="3.5" y="5" fontSize="2.5" fill="#3B82F6" fontWeight="bold" opacity="0.7">ZONE A — DEPOT</text>
        <text x="48" y="25" fontSize="2.5" fill="#FA6A02" fontWeight="bold" opacity="0.7">ZONE B — PRIORITY</text>
        <text x="61" y="55" fontSize="2.5" fill="#22C55E" fontWeight="bold" opacity="0.7">ZONE C — DELIVERED</text>

        {/* Active Transport Routes (dashed lines) */}
        {/* T-04 route: depot (10,20) → site (68,42) */}
        <polyline
          points="10,20 10,40 45,40 45,20 70,20 70,40"
          fill="none"
          stroke="#FA6A02"
          strokeWidth="0.8"
          strokeDasharray="2,1.5"
          opacity="0.7"
        />
        {/* T-07 route: depot (10,20) → zone C */}
        <polyline
          points="10,20 20,20 20,60 45,60 70,60"
          fill="none"
          stroke="#3B82F6"
          strokeWidth="0.8"
          strokeDasharray="2,1.5"
          opacity="0.6"
        />
        {/* Completed route (T-12 faded) */}
        <polyline
          points="45,60 70,60 70,70 82,70 90,60"
          fill="none"
          stroke="#22C55E"
          strokeWidth="0.7"
          strokeDasharray="1.5,2"
          opacity="0.4"
        />

        {/* Destination Pin - Industrial Site */}
        <circle cx="70" cy="40" r="2" fill="#FA6A02" opacity="0.9" />
        <line x1="70" y1="40" x2="70" y2="35" stroke="#FA6A02" strokeWidth="0.6" />
        <circle cx="70" cy="34.5" r="1.5" fill="#FA6A02" opacity="0.3" />

        {/* Depot origin pin */}
        <circle cx="10" cy="20" r="2.2" fill="none" stroke="#3B82F6" strokeWidth="0.8" />
        <circle cx="10" cy="20" r="1.2" fill="#3B82F6" opacity="0.9" />

        {/* Animated Truck Markers */}
        {truckPositions.map(truck => (
          <g key={truck.id} onClick={() => setActiveTruck(truck.id === activeTruck ? null : truck.id)} style={{ cursor: 'pointer' }}>
            {/* Pulse ring for active trucks */}
            {truck.status === 'on-route' && (
              <circle
                cx={truck.cx}
                cy={truck.cy}
                r={activeTruck === truck.id ? 3.5 : 2.5}
                fill="none"
                stroke={truck.id === 'T-07' ? '#3B82F6' : '#FA6A02'}
                strokeWidth="0.5"
                opacity={0.3 + (tick % 2) * 0.2}
              />
            )}
            {/* Truck body */}
            <rect
              x={truck.cx - 2.2}
              y={truck.cy - 1.4}
              width="4.4"
              height="2.8"
              rx="0.6"
              fill={truck.status === 'delivered' ? '#22C55E' : truck.id === 'T-07' ? '#3B82F6' : '#FA6A02'}
            />
            {/* Cab */}
            <rect
              x={truck.cx + 1.2}
              y={truck.cy - 1}
              width="1.8"
              height="2.0"
              rx="0.4"
              fill={truck.status === 'delivered' ? '#15803D' : truck.id === 'T-07' ? '#2563EB' : '#E56000'}
            />
            {/* Wheels */}
            <circle cx={truck.cx - 1.2} cy={truck.cy + 1.4} r="0.6" fill="#0F1923" stroke="#6B7280" strokeWidth="0.3" />
            <circle cx={truck.cx + 1.4} cy={truck.cy + 1.4} r="0.6" fill="#0F1923" stroke="#6B7280" strokeWidth="0.3" />
            {/* Truck ID label */}
            <text x={truck.cx} y={truck.cy - 2.5} fontSize="2" fill="white" textAnchor="middle" fontWeight="bold" opacity="0.9">
              {truck.id}
            </text>
          </g>
        ))}

      </svg>

      {/* Map Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 bg-[#0F1923]/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-700/50">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[11px] font-bold text-gray-300 tracking-wide uppercase">Live Route Tracking</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#0F1923]/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-700/50">
          <span className="text-[10px] font-bold text-gray-400">3 Vehicles Active</span>
        </div>
      </div>

      {/* Zone Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-1 rounded-sm bg-blue-500" />
          <span className="text-[10px] font-bold text-gray-400">Zone A</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-1 rounded-sm bg-[#FA6A02]" />
          <span className="text-[10px] font-bold text-gray-400">Zone B</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-1 rounded-sm bg-green-500" />
          <span className="text-[10px] font-bold text-gray-400">Zone C</span>
        </div>
      </div>

      {/* Selected Truck Info Popup */}
      {selected && (
        <div className="absolute bottom-3 right-3 bg-[#1C2B3A] backdrop-blur-sm border border-gray-700 rounded-[10px] p-3 min-w-[160px] shadow-xl z-20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-white tracking-wide">{selected.id}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${selected.status === 'delivered' ? 'bg-green-900 text-green-300' : 'bg-orange-900/70 text-orange-300'}`}>
              {selected.status === 'delivered' ? 'Delivered' : 'En Route'}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mb-1 font-medium">{selected.route}</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FA6A02]" />
            <span className="text-[10px] font-bold text-gray-300">ETA: {selected.eta}</span>
          </div>
        </div>
      )}
    </div>
  );
}
