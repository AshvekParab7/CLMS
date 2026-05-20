"use client";

import { Mail, Lock, Eye, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen flex w-full font-sans">
            {/* LEFT PANEL */}
            <div className="hidden lg:flex flex-col justify-end p-16 w-1/2 relative bg-black">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541888086225-ee825c38be4d?q=80&w=2070&auto=format&fit=crop')" }}
                >
                    <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>
                
                <div className="relative z-10 max-w-xl text-white mb-10">
                    <h1 className="text-[52px] font-bold mb-6 leading-[1.1] tracking-tight">
                        Command your<br />
                        logistics with<br />
                        precision.
                    </h1>
                    <p className="text-[17px] text-gray-200/90 leading-relaxed max-w-[420px]">
                        SheshankTransport provides a centralized operational hub for heavy industry supply chains.
                    </p>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex items-center justify-center bg-[#FEFDFB] relative w-full lg:w-1/2 p-6">
                {/* Subtle top-right gradient */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFEDDF] rounded-full blur-[100px] opacity-70 pointer-events-none transform translate-x-1/4 -translate-y-1/4"></div>

                <div className="w-full max-w-[440px] bg-white rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 md:p-10 relative z-10">
                    
                    <h2 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight">
                        SheshankTransport
                    </h2>
                    <p className="text-[15px] text-gray-600 mb-8">
                        Sign in to your command center.
                    </p>

                    {/* Role Selector */}
                    <div className="flex bg-[#F4F4F5] p-1 rounded-xl mb-8">
                        <button type="button" className="flex-1 text-center py-2.5 text-[13.5px] font-semibold rounded-[8px] bg-white shadow-sm text-[#9b3a16] border border-gray-200/60 transition-all">
                            Customer
                        </button>
                        <button type="button" className="flex-1 text-center py-2.5 text-[13.5px] font-medium text-gray-500 hover:text-gray-700 transition-colors">
                            Admin
                        </button>
                        <button type="button" className="flex-1 text-center py-2.5 text-[13.5px] font-medium text-gray-500 hover:text-gray-700 transition-colors">
                            Driver
                        </button>
                    </div>

                    <form className="space-y-5" onSubmit={handleLogin}>
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="block text-[13.5px] font-bold text-gray-800 tracking-wide">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    className="w-full pl-12 pr-4 py-3.5 rounded-[12px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-[15px] placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="block text-[13.5px] font-bold text-gray-800 tracking-wide">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-3.5 rounded-[12px] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-[15px] placeholder:text-gray-400 tracking-[0.2em]"
                                />
                                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors">
                                    <Eye className="h-5 w-5" strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>

                        {/* Remember & Forgot */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input type="checkbox" className="peer w-4 h-4 rounded-[4px] border-gray-300 text-orange-500 focus:ring-orange-500/20 cursor-pointer transition-all" />
                                </div>
                                <span className="text-[14px] text-gray-600 group-hover:text-gray-800 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-[13px] font-semibold text-[#9b3a16] hover:text-[#7a2d10] transition-colors">
                                Forgot Password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                className="w-full bg-[#F56B02] hover:bg-[#E06202] text-white rounded-[12px] py-3.5 px-4 font-semibold text-[15px] transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(245,107,2,0.25)] hover:shadow-[0_6px_20px_rgba(245,107,2,0.3)] active:scale-[0.98]"
                            >
                                Sign In <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                            </button>
                        </div>
                    </form>

                    {/* Divider & Sign Up */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-[14.5px] text-gray-600">
                            Don't have an account? <a href="#" className="font-bold text-[#9b3a16] hover:text-[#7a2d10] transition-colors">Sign up</a>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
}