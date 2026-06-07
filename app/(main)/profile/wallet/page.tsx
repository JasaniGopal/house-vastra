"use client";

import React from 'react';
import Link from 'next/link';

export default function WalletPage() {
  return (
    <main className="min-h-screen bg-[#fcf9f8] font-sans pb-24">
      <div className="max-w-[800px] mx-auto px-4 md:px-8 pt-8 md:pt-12">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#775a19] transition-colors mb-4 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Wallet & Credits</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Manage your store credits and view transaction history.</p>
        </div>

        <div className="flex flex-col gap-8">
          
          {/* Balance Card */}
          <div className="bg-[#00261f] rounded-3xl p-8 relative overflow-hidden shadow-xl border border-[#001410] text-white">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
              </svg>
            </div>
            
            <div className="relative z-10">
              <span className="text-[#A6C4BA] text-[11px] uppercase tracking-[0.2em] font-bold block mb-2">Available Balance</span>
              <div className="flex items-end gap-4">
                <span className="font-serif text-5xl md:text-6xl font-medium">₹4,500</span>
              </div>
              
              <div className="mt-10 flex flex-wrap gap-4">
                <button className="bg-[#F6EDDB] text-[#001410] py-3.5 px-8 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white active:scale-95 transition-all shadow-md">
                  Add Funds
                </button>
                <button className="border border-[#A6C4BA] text-white py-3.5 px-8 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white/10 active:scale-95 transition-all">
                  Withdraw to Bank
                </button>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div>
            <h2 className="font-serif text-[22px] font-medium text-[#001410] mb-4">Recent Transactions</h2>
            
            <div className="bg-white rounded-2xl border border-[#c1c8c5]/40 overflow-hidden shadow-sm">
              <div className="flex flex-col divide-y divide-zinc-100">
                
                {/* Transaction 1 */}
                <div className="p-4 md:p-5 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                      </svg>
                    </div>
                    <div>
                      <span className="block font-medium text-[#001410] text-sm md:text-base">Security Deposit Refund</span>
                      <span className="block text-xs text-zinc-500 mt-0.5">Order #RV-84920 &bull; Oct 18, 2023</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#2E7D32]">+ ₹2,500</span>
                </div>

                {/* Transaction 2 */}
                <div className="p-4 md:p-5 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-[#2E7D32]">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                      </svg>
                    </div>
                    <div>
                      <span className="block font-medium text-[#001410] text-sm md:text-base">Funds Added via UPI</span>
                      <span className="block text-xs text-zinc-500 mt-0.5">Transaction ID: U9283749 &bull; Sep 25, 2023</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#2E7D32]">+ ₹2,000</span>
                </div>

                {/* Transaction 3 */}
                <div className="p-4 md:p-5 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                      </svg>
                    </div>
                    <div>
                      <span className="block font-medium text-[#001410] text-sm md:text-base">Rental Payment</span>
                      <span className="block text-xs text-zinc-500 mt-0.5">Order #RV-84920 &bull; Sep 10, 2023</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#001410]">- ₹3,499</span>
                </div>
                
              </div>
            </div>
            <button className="w-full mt-4 py-3 text-sm font-bold text-zinc-500 hover:text-[#775a19] hover:bg-zinc-100 rounded-xl transition-colors">
              View All Transactions
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
