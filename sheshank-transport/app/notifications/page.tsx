"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import CustomerNav from '@/components/CustomerNav';
import { Bell, Package, AlertCircle, Tag, Check, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useApp();
  const [filter, setFilter] = useState<'all' | 'order' | 'system' | 'promo'>('all');

  const filteredNotifs = notifications.filter(n => filter === 'all' || n.type === filter);

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="w-5 h-5 text-blue-500" />;
      case 'system': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'promo': return <Tag className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-50 border-blue-100';
      case 'system': return 'bg-orange-50 border-orange-100';
      case 'promo': return 'bg-green-50 border-green-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FA] font-sans text-gray-900 pb-20">
      <CustomerNav />

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[13px] font-bold text-gray-500 mb-2">
              <Link href="/dashboard" className="hover:text-gray-800 transition-colors">Dashboard</Link>
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span className="text-gray-900">Notifications</span>
            </div>
            <h1 className="text-[32px] sm:text-[36px] font-extrabold text-gray-900 tracking-tight leading-tight">Notifications</h1>
          </div>

          {notifications.some(n => !n.read) && (
            <button 
              onClick={markAllAsRead}
              className="text-[13px] font-bold text-[#FA6A02] bg-orange-50 hover:bg-orange-100 px-4 py-2.5 rounded-[10px] transition-colors flex items-center gap-2 self-start sm:self-auto"
            >
              <CheckCircle2 className="w-4 h-4" /> Mark all as read
            </button>
          )}
        </div>

        <div className="bg-white rounded-[20px] border border-gray-200/70 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Sidebar Filters */}
          <div className="w-full md:w-[240px] bg-gray-50/50 border-b md:border-b-0 md:border-r border-gray-100 p-4 sm:p-6 flex flex-row md:flex-col gap-2 overflow-x-auto custom-scrollbar">
            {[
              { id: 'all', label: 'All Notifications', icon: <Bell className="w-4 h-4" /> },
              { id: 'order', label: 'Order Updates', icon: <Package className="w-4 h-4" /> },
              { id: 'promo', label: 'Promotions', icon: <Tag className="w-4 h-4" /> },
              { id: 'system', label: 'System Alerts', icon: <AlertCircle className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-[12px] text-[14px] font-bold transition-all whitespace-nowrap ${
                  filter === tab.id 
                    ? 'bg-white text-[#FA6A02] shadow-sm border border-gray-200' 
                    : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900 border border-transparent'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 p-0 sm:p-2 bg-white">
            {filteredNotifs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-10 text-center min-h-[400px]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                  <Bell className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-1">No notifications</h3>
                <p className="text-[14px] text-gray-500 font-medium">You're all caught up! No new updates here.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifs.map(n => (
                  <div key={n.id} className={`p-4 sm:p-6 group flex items-start gap-4 transition-colors hover:bg-gray-50/50 ${!n.read ? 'bg-[#FA6A02]/[0.02]' : ''}`}>
                    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 border shadow-sm ${getBg(n.type)}`}>
                      {getIcon(n.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <h4 className={`text-[15px] truncate ${!n.read ? 'font-extrabold text-gray-900' : 'font-bold text-gray-700'}`}>
                          {n.title}
                        </h4>
                        <span className="text-[12px] text-gray-400 font-medium whitespace-nowrap">{n.date}</span>
                      </div>
                      <p className={`text-[14px] leading-relaxed mb-3 ${!n.read ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                        {n.message}
                      </p>
                      
                      {/* Action buttons on hover */}
                      <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        {!n.read && (
                          <button onClick={() => markAsRead(n.id)} className="text-[12px] font-bold text-[#FA6A02] bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors">
                            <Check className="w-3.5 h-3.5" /> Mark as read
                          </button>
                        )}
                        <button onClick={() => deleteNotification(n.id)} className="text-[12px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>

                    {/* Unread dot */}
                    {!n.read && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FA6A02] flex-shrink-0 mt-2 shadow-[0_0_8px_rgba(250,106,2,0.6)]" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
