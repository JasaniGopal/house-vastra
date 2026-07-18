import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from 'next/link';
import LogoutButton from '@/app/components/LogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Military-grade security: only ADMIN allowed
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/partner-login");
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-zinc-200 flex flex-col shadow-sm shrink-0">
        <div className="p-6 md:p-8 flex items-center gap-3 border-b border-zinc-100">
          <div className="w-8 h-8 bg-[#775a19] rounded-md flex items-center justify-center shrink-0">
            <span className="text-white font-serif font-bold text-sm">A</span>
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-[#001410] tracking-tight leading-none block">Admin Portal</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#775a19]">System Control</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link href="/admin/approvals" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Pending Approvals
          </Link>
          <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Live Inventory
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analytics
          </Link>
          <Link href="/admin/inventory" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Vendor Directory
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Global Orders
          </Link>
          <Link href="/admin/returns" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
            </svg>
            Returns & Deposits
          </Link>
          <Link href="/admin/customers" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Customers CRM
          </Link>
          <Link href="/admin/disputes" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Disputes
          </Link>
          <Link href="/admin/shipping" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Shipping
          </Link>
          <Link href="/admin/reviews" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Reviews
          </Link>
          <div className="pt-4 mt-2 border-t border-zinc-100">
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Management</p>
            <Link href="/admin/payouts" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
              <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Payouts
            </Link>
            <Link href="/admin/categories" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
              <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Categories
            </Link>
            <Link href="/admin/occasions" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
              <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Occasions
            </Link>
            <Link href="/admin/promotions" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
              <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
              Promotions
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-zinc-100">
           <div className="bg-zinc-50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
             <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center mb-2">
               <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
             </div>
             <p className="text-xs font-bold text-[#001410] w-full truncate px-2">{session.user.name || session.user.email}</p>
             <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1 mb-3">Admin</p>
             <LogoutButton />
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#fcf9f8]">
        {children}
      </main>
      
    </div>
  );
}
