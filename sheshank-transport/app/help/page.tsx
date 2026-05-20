"use client";

import React, { useState } from 'react';
import CustomerNav from '@/components/CustomerNav';
import Link from 'next/link';
import {
  MessageCircle, Mail, Phone, HelpCircle, ChevronDown,
  Truck, Package, CreditCard, RotateCcw, ShieldCheck,
  Search, ArrowRight, Clock, CheckCircle2, Headphones,
  FileText, Star, Zap, MapPin, Box
} from 'lucide-react';

/* ── FAQ Data ── */
const FAQ_CATEGORIES = [
  {
    category: 'Orders & Delivery',
    icon: <Truck className="w-5 h-5" />,
    color: 'text-blue-600 bg-blue-50',
    faqs: [
      {
        q: 'How do I place an order?',
        a: 'Browse our materials catalog, select the quantity you need, and add items to your cart. Proceed to checkout, choose your delivery address and time slot, then confirm payment. You\'ll receive an order confirmation via email and SMS instantly.',
      },
      {
        q: 'What are the delivery timelines?',
        a: 'Standard delivery is within 2–4 hours for in-stock items in your city. Express delivery (within 1 hour) is available in select areas at an additional charge. Scheduled deliveries can be booked up to 7 days in advance.',
      },
      {
        q: 'Can I track my delivery in real-time?',
        a: 'Yes! Once your order is dispatched, you can track the driver\'s live location from the Track Delivery page. You\'ll also receive SMS/WhatsApp updates at each milestone — dispatched, en route, and delivered.',
      },
      {
        q: 'What happens if my delivery is delayed?',
        a: 'Our team monitors all deliveries in real-time. If a delay occurs, you\'ll be notified proactively. You can also contact our support team via WhatsApp for immediate assistance.',
      },
    ],
  },
  {
    category: 'Payments & Billing',
    icon: <CreditCard className="w-5 h-5" />,
    color: 'text-green-600 bg-green-50',
    faqs: [
      {
        q: 'What payment methods are accepted?',
        a: 'We accept UPI (GPay, PhonePe, Paytm), net banking, debit/credit cards, and cash on delivery for orders under ₹50,000. EMI options are available for orders above ₹25,000.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Absolutely. All payments are processed through PCI-DSS compliant gateways. We do not store your card or UPI details on our servers. Every transaction is encrypted with 256-bit SSL.',
      },
      {
        q: 'How do I get an invoice for my order?',
        a: 'GST-compliant invoices are automatically generated and emailed to you within 30 minutes of order confirmation. You can also download invoices anytime from the Orders page.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    icon: <RotateCcw className="w-5 h-5" />,
    color: 'text-purple-600 bg-purple-50',
    faqs: [
      {
        q: 'What is the return policy?',
        a: 'Unused materials in original packaging can be returned within 7 days of delivery. Damaged or incorrect items must be reported within 24 hours of delivery with photos. Perishable materials (cement, certain chemicals) are non-returnable once delivered.',
      },
      {
        q: 'How long do refunds take?',
        a: 'Once your return is approved and picked up, refunds are processed within 3–5 business days to your original payment method. UPI and wallet refunds are typically faster (1–2 days).',
      },
      {
        q: 'Can I cancel an order?',
        a: 'Orders can be cancelled free of charge before the material is dispatched. Once dispatched, a cancellation fee of 5% applies. Delivered orders follow the standard return process.',
      },
    ],
  },
  {
    category: 'Account & Security',
    icon: <ShieldCheck className="w-5 h-5" />,
    color: 'text-orange-600 bg-orange-50',
    faqs: [
      {
        q: 'How do I update my delivery address?',
        a: 'Go to your profile > Saved Sites, where you can add, edit, or delete delivery addresses. You can save multiple sites and set a default site for faster checkout.',
      },
      {
        q: 'I forgot my password. How do I reset it?',
        a: 'Click "Forgot Password" on the login page and enter your registered email or phone number. You\'ll receive a reset link via email and OTP via SMS within 2 minutes.',
      },
      {
        q: 'Can I have multiple users on one business account?',
        a: 'Yes, our Business Plan supports team accounts with role-based access. Contact us to set up a multi-user account for your organisation.',
      },
    ],
  },
];

/* ── Quick Help Topics ── */
const QUICK_TOPICS = [
  { icon: <Package className="w-5 h-5" />, label: 'Track My Order', href: '/track-order', color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { icon: <RotateCcw className="w-5 h-5" />, label: 'Return & Refund', href: '#faq', color: 'text-purple-600 bg-purple-50 border-purple-100' },
  { icon: <CreditCard className="w-5 h-5" />, label: 'Payment Issues', href: '#faq', color: 'text-green-600 bg-green-50 border-green-100' },
  { icon: <FileText className="w-5 h-5" />, label: 'Download Invoice', href: '/orders', color: 'text-gray-600 bg-gray-50 border-gray-200' },
  { icon: <MapPin className="w-5 h-5" />, label: 'Change Address', href: '#', color: 'text-rose-600 bg-rose-50 border-rose-100' },
  { icon: <Star className="w-5 h-5" />, label: 'Leave a Review', href: '#', color: 'text-amber-600 bg-amber-50 border-amber-100' },
];

/* ── FAQ Accordion Item ── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`border rounded-[14px] overflow-hidden transition-all duration-200 ${open ? 'border-orange-200 bg-orange-50/30' : 'border-gray-100 bg-white hover:border-gray-200'}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-[14px] font-bold text-gray-900 leading-snug">{q}</span>
        <ChevronDown
          className={`w-4.5 h-4.5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-[#FA6A02]' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-[13.5px] text-gray-600 leading-relaxed border-t border-gray-100/80 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

/* ── Main Page ── */
export default function HelpSupportPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = FAQ_CATEGORIES.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(
      f =>
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.faqs.length > 0);

  const displayed = activeCategory
    ? filtered.filter(c => c.category === activeCategory)
    : filtered;

  return (
    <div className="min-h-screen bg-[#F6F8FA] font-sans">
      <CustomerNav />

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-[#2a1500] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_#FA6A02,_transparent_60%)] z-0" />
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_bottom_left,_#FA6A02,_transparent_50%)] z-0" />

        <div className="max-w-[1400px] mx-auto px-6 py-16 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 px-4 py-2 rounded-full text-[12px] font-bold text-orange-300 mb-6 tracking-widest uppercase">
            <Headphones className="w-3.5 h-3.5" />
            We&apos;re here to help
          </div>
          <h1 className="text-[42px] sm:text-[52px] font-extrabold leading-tight tracking-tight mb-4">
            Help & <span className="text-[#FA6A02]">Support</span>
          </h1>
          <p className="text-gray-400 text-[16px] max-w-[520px] mx-auto mb-8 leading-relaxed">
            Find answers to common questions, or reach out to our team — we typically respond in under 5 minutes.
          </p>

          {/* Search */}
          <div className="max-w-[560px] mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your question..."
              className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-[14px] text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-[#FA6A02]/40 placeholder:text-gray-400 shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
            />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 mt-10">
            {[
              ['< 5 min', 'Avg. Response'],
              ['24 / 7', 'Support Hours'],
              ['98%', 'Resolution Rate'],
            ].map(([val, label]) => (
              <div key={label} className="text-center">
                <p className="text-[22px] font-extrabold text-white">{val}</p>
                <p className="text-[12px] text-gray-400 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-12">

        {/* ── QUICK HELP TOPICS ── */}
        <section>
          <h2 className="text-[20px] font-extrabold text-gray-900 tracking-tight mb-5">Quick Help Topics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {QUICK_TOPICS.map(topic => (
              <Link
                key={topic.label}
                href={topic.href}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-[16px] border ${topic.color} hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200 text-center group`}
              >
                <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${topic.color.split(' ').slice(0, 2).join(' ')}`}>
                  {topic.icon}
                </div>
                <span className="text-[12.5px] font-bold text-gray-800 leading-tight group-hover:text-gray-900">
                  {topic.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CONTACT CHANNELS ── */}
        <section>
          <h2 className="text-[20px] font-extrabold text-gray-900 tracking-tight mb-5">Contact Us Directly</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* WhatsApp */}
            <a
              href="https://wa.me/919518786952"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 overflow-hidden hover:border-green-300 hover:shadow-[0_8px_30px_rgba(37,211,102,0.12)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-green-100 rounded-[14px] flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors duration-300">
                  <MessageCircle className="w-6 h-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="text-[11px] font-extrabold text-green-600 uppercase tracking-widest mb-1">WhatsApp</p>
                <h3 className="text-[18px] font-extrabold text-gray-900 mb-1">Chat with Us</h3>
                <p className="text-[13px] text-gray-500 mb-4 leading-relaxed">Fastest way to reach us. Get answers in real-time.</p>
                <div className="flex items-center gap-2 text-[14px] font-bold text-gray-800">
                  <Phone className="w-4 h-4 text-green-500" />
                  +91 95187 86952
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[12px] font-bold text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Typically replies in &lt; 5 minutes
                </div>
                <div className="mt-4 inline-flex items-center gap-2 bg-green-500 text-white text-[13px] font-bold px-4 py-2.5 rounded-[10px] group-hover:bg-green-600 transition-colors">
                  Open WhatsApp <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:sheshanktransport@gmail.com"
              className="group relative bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 overflow-hidden hover:border-orange-300 hover:shadow-[0_8px_30px_rgba(250,106,2,0.10)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-orange-100 rounded-[14px] flex items-center justify-center mb-4 group-hover:bg-[#FA6A02] transition-colors duration-300">
                  <Mail className="w-6 h-6 text-[#FA6A02] group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="text-[11px] font-extrabold text-[#FA6A02] uppercase tracking-widest mb-1">Email</p>
                <h3 className="text-[18px] font-extrabold text-gray-900 mb-1">Send an Email</h3>
                <p className="text-[13px] text-gray-500 mb-4 leading-relaxed">For detailed queries, invoices, and business enquiries.</p>
                <div className="flex items-center gap-2 text-[13px] font-bold text-gray-800 break-all">
                  <Mail className="w-4 h-4 text-[#FA6A02] flex-shrink-0" />
                  sheshanktransport@gmail.com
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[12px] font-bold text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  Response within 2 business hours
                </div>
                <div className="mt-4 inline-flex items-center gap-2 bg-[#FA6A02] text-white text-[13px] font-bold px-4 py-2.5 rounded-[10px] group-hover:bg-[#E56000] transition-colors">
                  Send Email <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>

            {/* Call */}
            <a
              href="tel:+919518786952"
              className="group relative bg-white rounded-[20px] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 overflow-hidden hover:border-blue-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.10)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-100 rounded-[14px] flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <Phone className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">Phone</p>
                <h3 className="text-[18px] font-extrabold text-gray-900 mb-1">Call Us</h3>
                <p className="text-[13px] text-gray-500 mb-4 leading-relaxed">Speak directly with our logistics support team.</p>
                <div className="flex items-center gap-2 text-[14px] font-bold text-gray-800">
                  <Phone className="w-4 h-4 text-blue-600" />
                  +91 95187 86952
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[12px] font-bold text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  Mon–Sat, 8 AM – 8 PM IST
                </div>
                <div className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white text-[13px] font-bold px-4 py-2.5 rounded-[10px] group-hover:bg-blue-700 transition-colors">
                  Call Now <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </a>

          </div>
        </section>

        {/* ── FAQ SECTION ── */}
        <section id="faq">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[20px] font-extrabold text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-[13px] font-bold text-[#FA6A02] hover:text-[#E56000] transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Category Filters */}
          {!search && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-[12.5px] font-bold transition-all ${activeCategory === null ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'}`}
              >
                All Topics
              </button>
              {FAQ_CATEGORIES.map(cat => (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(activeCategory === cat.category ? null : cat.category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12.5px] font-bold transition-all ${activeCategory === cat.category ? 'bg-[#FA6A02] text-white shadow-[0_2px_8px_rgba(250,106,2,0.3)]' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'}`}
                >
                  <span className={activeCategory === cat.category ? 'text-white' : cat.color.split(' ')[0]}>{cat.icon}</span>
                  {cat.category}
                </button>
              ))}
            </div>
          )}

          {displayed.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-[20px] border border-gray-100">
              <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-[15px] font-bold text-gray-500">No results for &quot;{search}&quot;</p>
              <p className="text-[13px] text-gray-400 mt-1">Try a different search term or contact us directly.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {displayed.map(cat => (
                <div key={cat.category}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${cat.color}`}>
                      {cat.icon}
                    </div>
                    <h3 className="text-[16px] font-extrabold text-gray-900">{cat.category}</h3>
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[11px] font-bold text-gray-400">{cat.faqs.length} questions</span>
                  </div>
                  <div className="space-y-2.5">
                    {cat.faqs.map(faq => (
                      <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── STILL NEED HELP CTA ── */}
        <section>
          <div className="bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-[#2a1500] rounded-[24px] p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_#FA6A02,_transparent_60%)]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 px-3 py-1.5 rounded-full text-[11px] font-bold text-orange-300 mb-4 tracking-widest uppercase">
                  <Zap className="w-3 h-3" />
                  Still need help?
                </div>
                <h2 className="text-[26px] font-extrabold mb-2">Can&apos;t find what you&apos;re looking for?</h2>
                <p className="text-gray-400 text-[14px] max-w-[420px] leading-relaxed">
                  Our dedicated logistics support team is ready to assist you with any issue — from order tracking to billing queries.
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  {[
                    { icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: 'Real-time support' },
                    { icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: 'Expert logistics team' },
                    { icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: '98% resolution rate' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-300">
                      <span className="text-green-400">{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <a
                  href="https://wa.me/919518786952"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3.5 rounded-[12px] transition-all active:scale-[0.98] shadow-[0_4px_14px_rgba(37,211,102,0.3)] text-[14px]"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Us
                </a>
                <a
                  href="mailto:sheshanktransport@gmail.com"
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3.5 rounded-[12px] transition-all active:scale-[0.98] text-[14px]"
                >
                  <Mail className="w-5 h-5" />
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* ── FOOTER ── */}
      <footer className="mt-10 border-t border-gray-100 bg-white py-8">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FA6A02] rounded-[7px] flex items-center justify-center">
              <Box className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-[15px] text-gray-800">SheshankTransport.</span>
          </div>
          <p className="text-[13px] text-gray-400">© 2026 Sheshank Transport. All rights reserved.</p>
          <div className="flex gap-5">
            {[
              { label: 'Support', href: '/help' },
              { label: 'Privacy', href: '#' },
              { label: 'Terms', href: '#' },
            ].map(l => (
              <Link key={l.label} href={l.href} className="text-[13px] text-gray-400 hover:text-gray-700 font-medium transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
