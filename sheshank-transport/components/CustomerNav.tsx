"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search, ShoppingCart, Bell, ChevronDown, X, Menu,
  Package, Truck, MapPin, Heart, User, LogOut,
  Settings, ClipboardList, Box, LayoutDashboard,
  HelpCircle, Star, Tag, RotateCcw, ChevronRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const SIDEBAR_NAV = [
  {
    group: 'Main',
    items: [
      { href: '/dashboard', label: 'Home', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
      { href: '/materials', label: 'Browse Materials', icon: <Box className="w-[18px] h-[18px]" /> },
      { href: '/orders', label: 'My Orders', icon: <ClipboardList className="w-[18px] h-[18px]" /> },
      { href: '/track-order', label: 'Track Delivery', icon: <Truck className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    group: 'My Account',
    items: [
      { href: '#', label: 'Wishlist', icon: <Heart className="w-[18px] h-[18px]" />, badge: '4' },
      { href: '#', label: 'Saved Addresses', icon: <MapPin className="w-[18px] h-[18px]" /> },
      { href: '#', label: 'Deals & Offers', icon: <Tag className="w-[18px] h-[18px]" />, badge: 'NEW' },
      { href: '#', label: 'Reorder History', icon: <RotateCcw className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    group: 'Support',
    items: [
      { href: '#', label: 'Profile Settings', icon: <Settings className="w-[18px] h-[18px]" /> },
      { href: '/help', label: 'Help & Support', icon: <HelpCircle className="w-[18px] h-[18px]" /> },
    ],
  },
];

export default function CustomerNav() {
  const pathname = usePathname();
  const { cartCount, wishlist, unreadNotifCount } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const wishCount = wishlist.length;

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false); }, [pathname]);
  // Lock body scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const navLinks = [
    { href: '/materials', label: 'Browse Materials' },
    { href: '/orders', label: 'Orders' },
    { href: '/track-order', label: 'Track Delivery' },
  ];

  return (
    <>
      {/* ── SLIDE-IN SIDEBAR ── */}
      {/* Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-[290px] bg-white z-[70] shadow-[4px_0_40px_rgba(0,0,0,0.12)] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 h-[64px] border-b border-gray-100 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
            <div className="w-8 h-8 bg-gradient-to-br from-[#FA6A02] to-[#D95A00] rounded-[8px] flex items-center justify-center shadow-[0_2px_8px_rgba(250,106,2,0.3)]">
              <Box className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-[18px] text-gray-900 tracking-tight">
              SheshankTransport<span className="text-[#FA6A02]"></span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-8 h-8 rounded-[8px] flex items-center justify-center text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 bg-gray-50 rounded-[14px] p-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-[#FA6A02] flex items-center justify-center text-white text-[15px] font-extrabold flex-shrink-0">
              R
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-gray-900 leading-tight">Rahul Builders</p>
              <p className="text-[12px] text-gray-500 truncate mt-0.5">rahul@sheshanktransport.in</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </div>
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
          {SIDEBAR_NAV.map(group => (
            <div key={group.group}>
              <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-3 mb-2">
                {group.group}
              </p>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-semibold transition-all ${isActive
                        ? 'bg-orange-50 text-[#FA6A02]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <span className={isActive ? 'text-[#FA6A02]' : 'text-gray-400'}>{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${item.badge === 'NEW' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-[#FA6A02]'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-100">
          <Link href="/login" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-bold text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* ── TOP NAV BAR ── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="flex items-center h-[64px] gap-3">

            {/* Hamburger button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 rounded-[10px] flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-7 h-7 bg-gradient-to-br from-[#FA6A02] to-[#D95A00] rounded-[7px] flex items-center justify-center shadow-[0_2px_6px_rgba(250,106,2,0.25)]">
                <Box className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[20px] font-extrabold tracking-tight text-gray-900">
                SheshankTransport<span className="text-[#FA6A02]">.</span>
              </span>
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-gray-200 hidden sm:block" />

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-[9px] text-[13.5px] font-semibold transition-all ${pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'bg-orange-50 text-[#FA6A02]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-[480px] relative mx-2 hidden md:block">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="Search materials, suppliers..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-[10px] text-[13.5px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FA6A02]/20 focus:border-[#FA6A02] transition-all font-medium"
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 ml-auto">
              {/* Wishlist */}
              <Link href="/wishlist" className="w-9 h-9 rounded-[9px] flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors hidden sm:flex relative">
                <Heart className="w-5 h-5" />
                {wishCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-pink-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center leading-none">
                    {wishCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="w-9 h-9 rounded-[9px] flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-[#FA6A02] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <Link href="/notifications" className="w-9 h-9 rounded-[9px] flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors relative">
                <Bell className="w-5 h-5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center leading-none">
                    {unreadNotifCount}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-[9px] hover:bg-gray-50 transition-colors ml-1"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-[#FA6A02] flex items-center justify-center text-white text-[12px] font-extrabold">
                    R
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-[210px] bg-white rounded-[14px] border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.1)] overflow-hidden z-50">
                      <div className="p-4">
                        <p className="text-[14px] font-bold text-gray-900 leading-none">Rahul Builders</p>
                        <p className="text-[12px] text-gray-400 mt-0.5">rahul@sheshanktransport.in</p>
                      </div>
                      <div className="p-2">
                        <ProfileMenuItem icon={<User className="w-4 h-4" />} label="My Profile" />
                        <ProfileMenuItem icon={<ClipboardList className="w-4 h-4" />} label="My Orders" href="/orders" />
                        <ProfileMenuItem icon={<MapPin className="w-4 h-4" />} label="Saved Addresses" />
                        <ProfileMenuItem icon={<Star className="w-4 h-4" />} label="Reviews" />
                        <ProfileMenuItem icon={<Settings className="w-4 h-4" />} label="Settings" />
                      </div>
                      <div className="p-2 border-t border-gray-100">
                        <Link href="/login" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-red-500 hover:bg-red-50 text-[13px] font-bold transition-colors">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

function ProfileMenuItem({ icon, label, href = '#' }: { icon: React.ReactNode; label: string; href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-gray-700 hover:bg-gray-50 text-[13px] font-semibold transition-colors">
      <span className="text-gray-400">{icon}</span>
      {label}
    </Link>
  );
}
