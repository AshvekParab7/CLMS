"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Box, Truck, Users, 
  BarChart2, Settings, HelpCircle, Plus,
  ChevronLeft, ChevronRight, LogOut
} from 'lucide-react';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const NavItem = ({ href, icon, label }: { href?: string, icon: React.ReactNode, label: string }) => {
    const isActive = href ? pathname === href || pathname.startsWith(href + '/') : false;
    
    return (
      <Link href={href || "#"} className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-all cursor-pointer group ${isActive ? 'bg-[#FA6A02]/10 text-[#FA6A02] font-bold' : 'text-gray-400 hover:bg-[#2A2A2A] hover:text-gray-200 font-medium'}`}>
        <div className={`flex items-center justify-center ${isActive ? 'text-[#FA6A02]' : 'text-gray-400 group-hover:text-gray-200'}`}>
          {icon}
        </div>
        {!isCollapsed && <span className="text-[14px] truncate">{label}</span>}
      </Link>
    );
  };

  return (
    <aside className={`${isCollapsed ? 'w-[80px]' : 'w-[260px]'} bg-[#1C1C1C] flex flex-col h-full flex-shrink-0 border-r border-gray-800 transition-all duration-300 relative z-50`}>
      
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3.5 top-8 bg-[#2A2A2A] border border-gray-700 text-gray-400 hover:text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Brand */}
      <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} h-[88px] flex-shrink-0`}>
        <div className="w-8 h-8 bg-gradient-to-br from-[#FA6A02] to-[#D95A00] rounded-[8px] flex items-center justify-center shadow-[0_2px_10px_rgba(250,106,2,0.3)] flex-shrink-0">
          <Box className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h2 className="text-white font-extrabold text-[18px] leading-tight truncate tracking-tight">SheshankTransport <span className="text-gray-400 font-medium">Pro</span></h2>
          </div>
        )}
      </div>

      {/* Primary Action */}
      <div className={`px-4 mb-6 transition-all ${isCollapsed ? 'hidden' : 'block'}`}>
        <Link href="/orders" className="w-full bg-[#FA6A02] hover:bg-[#E56000] text-white py-2.5 rounded-[8px] flex items-center justify-center gap-2 font-semibold transition-all text-sm shadow-[0_2px_10px_rgba(250,106,2,0.2)] active:scale-[0.98]">
          <Plus className="w-4 h-4" strokeWidth={2.5} /> New Dispatch
        </Link>
      </div>
      
      {/* Small Action when collapsed */}
      <div className={`px-4 mb-6 flex justify-center transition-all ${isCollapsed ? 'block' : 'hidden'}`}>
        <Link href="/orders" className="w-10 h-10 bg-[#FA6A02] hover:bg-[#E56000] text-white rounded-[8px] flex items-center justify-center transition-all shadow-[0_2px_10px_rgba(250,106,2,0.2)] active:scale-[0.98]">
          <Plus className="w-5 h-5" strokeWidth={2.5} />
        </Link>
      </div>

      <nav className={`flex-1 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        <div className={`px-3 mb-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest ${isCollapsed ? 'hidden' : 'block'}`}>Core</div>
        <NavItem href="/dashboard" icon={<LayoutDashboard className="w-[18px] h-[18px]" strokeWidth={2} />} label="Dashboard" />
        <NavItem href="/materials" icon={<Box className="w-[18px] h-[18px]" strokeWidth={2} />} label="Inventory" />
        <NavItem href="/orders" icon={<Truck className="w-[18px] h-[18px]" strokeWidth={2} />} label="Orders" />
        
        <div className={`px-3 mt-6 mb-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest ${isCollapsed ? 'hidden' : 'block'}`}>Admin</div>
        <NavItem icon={<Users className="w-[18px] h-[18px]" strokeWidth={2} />} label="Users" />
        <NavItem icon={<BarChart2 className="w-[18px] h-[18px]" strokeWidth={2} />} label="Reports" />
      </nav>

      {/* Footer Nav */}
      <div className={`p-3 border-t border-gray-800 space-y-1.5 mt-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
        <NavItem icon={<Settings className="w-[18px] h-[18px]" strokeWidth={2} />} label="Settings" />
        <NavItem icon={<HelpCircle className="w-[18px] h-[18px]" strokeWidth={2} />} label="Support" />
      </div>

      {/* Profile Card */}
      <div className={`p-4 border-t border-gray-800 flex items-center gap-3 hover:bg-[#2A2A2A] transition-colors cursor-pointer group ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-full bg-gray-700 overflow-hidden flex-shrink-0 border border-gray-600">
          <img src="https://images.unsplash.com/photo-1508214751196-bfdd4ca40b15?q=80&w=100&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden">
            <h3 className="text-white font-semibold text-[13px] truncate leading-tight mb-0.5">Admin User</h3>
            <p className="text-gray-500 text-[11px] truncate">admin@sheshanktransport.com</p>
          </div>
        )}
        {!isCollapsed && (
          <LogOut className="w-4 h-4 text-gray-500 group-hover:text-[#FA6A02] transition-colors flex-shrink-0" strokeWidth={2} />
        )}
      </div>
    </aside>
  );
}
