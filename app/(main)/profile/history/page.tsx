"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function OrderHistoryPage() {
  return (
    <main className="min-h-screen bg-[#fcf9f8] font-sans pb-24">
      <div className="max-w-[800px] mx-auto px-4 md:px-8 pt-8 md:pt-12">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#775a19] transition-colors mb-4 group">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Profile
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Order History</h1>
            <p className="text-[#414846] mt-2 text-sm md:text-base">View your past rentals and invoices.</p>
          </div>
          
          <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#001410] border border-zinc-300 bg-white px-4 py-2.5 rounded-lg shadow-sm hover:bg-zinc-50 transition-colors w-fit">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
            </svg>
            Sort by Date
          </button>
        </div>

        {/* History List */}
        <div className="flex flex-col gap-6">
          
          {/* Past Order Card 1 */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-[#c1c8c5]/40 shadow-sm flex flex-col md:flex-row gap-6">
            {/* Image Thumbnail */}
            <div className="relative w-full md:w-28 h-40 md:h-28 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100 opacity-80 mix-blend-multiply">
               <Image 
                src="/images/home/designer-sarees.png" 
                alt="Pastel Floral Silk Saree" 
                fill 
                className="object-cover object-top" 
               />
            </div>
            
            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-0">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mb-1 block">Order #RV-84920</span>
                    <h3 className="font-serif text-lg font-medium text-[#001410]">Pastel Floral Silk Saree</h3>
                  </div>
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full w-fit flex items-center gap-1.5 bg-zinc-100">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Returned
                  </span>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm text-zinc-600">
                  <p><strong className="text-[#001410]">Dates:</strong> Sep 10 - Sep 14, 2023</p>
                  <p><strong className="text-[#001410]">Paid:</strong> ₹3,499</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <button className="bg-[#FAF2E8] text-[#775a19] py-2 px-5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#F6EDDB] transition-all">
                  Rent Again
                </button>
                <button className="border border-zinc-200 text-zinc-600 bg-white py-2 px-5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-all">
                  View Invoice
                </button>
              </div>
            </div>
          </div>

          {/* Past Order Card 2 */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-[#c1c8c5]/40 shadow-sm flex flex-col md:flex-row gap-6">
            {/* Image Thumbnail */}
            <div className="relative w-full md:w-28 h-40 md:h-28 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100 opacity-80 mix-blend-multiply">
               <Image 
                src="/images/home/premium-sherwani.png" 
                alt="Ivory & Gold Sherwani Set" 
                fill 
                className="object-cover object-top" 
               />
            </div>
            
            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-0">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mb-1 block">Order #RV-71023</span>
                    <h3 className="font-serif text-lg font-medium text-[#001410]">Ivory & Gold Sherwani Set</h3>
                  </div>
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full w-fit flex items-center gap-1.5 bg-zinc-100">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Returned
                  </span>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm text-zinc-600">
                  <p><strong className="text-[#001410]">Dates:</strong> Jul 22 - Jul 26, 2023</p>
                  <p><strong className="text-[#001410]">Paid:</strong> ₹5,999</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <button className="bg-[#FAF2E8] text-[#775a19] py-2 px-5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#F6EDDB] transition-all">
                  Rent Again
                </button>
                <button className="border border-zinc-200 text-zinc-600 bg-white py-2 px-5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-all">
                  View Invoice
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
