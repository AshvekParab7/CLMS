"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Material } from '@/lib/materials-data';

interface CartItem { material: Material; qty: number; }

export type NotificationType = 'order' | 'system' | 'promo';
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  read: boolean;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: Material[];
  addToCart: (m: Material, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (m: Material) => void;
  isWishlisted: (id: string) => boolean;
  cartCount: number;
  cartTotal: number;
  notifications: AppNotification[];
  unreadNotifCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Material[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: '1', title: 'Order Dispatched', message: 'Your order ORD-4807 (Steel Rebar) has been dispatched and is on the way.', type: 'order', date: '2 mins ago', read: false },
    { id: '2', title: 'Payment Successful', message: 'We received your payment of ₹24,500 for Invoice #INV-992.', type: 'system', date: '1 hour ago', read: false },
    { id: '3', title: 'Exclusive Offer', message: 'Use code SHESHANK10 to get 10% off your next bulk cement order.', type: 'promo', date: 'Yesterday', read: false },
    { id: '4', title: 'Site Delivery Completed', message: 'Fly Ash Bricks have been successfully delivered to Site Delta.', type: 'order', date: '2 days ago', read: true },
  ]);

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sheshank_cart');
    if (saved) setCart(JSON.parse(saved));
    const savedWl = localStorage.getItem('sheshank_wishlist');
    if (savedWl) setWishlist(JSON.parse(savedWl));
    const savedNotifs = localStorage.getItem('sheshank_notifs');
    if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
  }, []);

  useEffect(() => { localStorage.setItem('sheshank_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('sheshank_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('sheshank_notifs', JSON.stringify(notifications)); }, [notifications]);

  const addToCart = (m: Material, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.material.id === m.id);
      if (existing) return prev.map(i => i.material.id === m.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { material: m, qty }];
    });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.material.id !== id));
  const updateQty = (id: string, qty: number) => setCart(prev => prev.map(i => i.material.id === id ? { ...i, qty } : i));
  const clearCart = () => setCart([]);

  const toggleWishlist = (m: Material) => {
    setWishlist(prev => prev.find(i => i.id === m.id) ? prev.filter(i => i.id !== m.id) : [...prev, m]);
  };

  const isWishlisted = (id: string) => wishlist.some(i => i.id === id);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.material.price * i.qty, 0);

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const markAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <AppContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQty, clearCart, toggleWishlist, isWishlisted, cartCount, cartTotal, notifications, unreadNotifCount, markAsRead, markAllAsRead, deleteNotification }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
