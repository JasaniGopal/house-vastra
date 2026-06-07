"use client";

import React from 'react';
import Link from 'next/link';

export default function AddressesPage() {
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
            <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Saved Addresses</h1>
            <p className="text-[#414846] mt-2 text-sm md:text-base">Manage delivery addresses for your rental orders.</p>
          </div>
          
          <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white bg-[#001410] px-5 py-3 rounded-xl shadow-sm hover:bg-[#00261f] active:scale-95 transition-all w-fit">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New
          </button>
        </div>

        {/* Addresses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Default Address */}
          <div className="bg-white p-6 rounded-2xl border-2 border-[#775a19]/20 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#FAF2E8] text-[#775a19] text-[10px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-bl-xl">
              Default
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#001410]">Home</h3>
            </div>
            
            <div className="text-zinc-600 text-sm leading-relaxed mb-6">
              <strong className="block text-[#001410] font-medium mb-1">Ananya Sharma</strong>
              A-102, Royal Enclave Apartments<br />
              14th Main Road, Indiranagar<br />
              Bengaluru, Karnataka 560038<br />
              India<br />
              <span className="block mt-2 font-medium">Ph: +91 98765 43210</span>
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 border border-zinc-200 text-[#001410] py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-colors">
                Edit
              </button>
              <button className="w-12 flex items-center justify-center border border-zinc-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>

          {/* Secondary Address */}
          <div className="bg-white p-6 rounded-2xl border border-[#c1c8c5]/40 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-medium text-[#001410]">Office</h3>
            </div>
            
            <div className="text-zinc-600 text-sm leading-relaxed mb-6">
              <strong className="block text-[#001410] font-medium mb-1">Ananya Sharma (TechCorp)</strong>
              Level 4, Orion Tech Park<br />
              Outer Ring Road, Bellandur<br />
              Bengaluru, Karnataka 560103<br />
              India<br />
              <span className="block mt-2 font-medium">Ph: +91 98765 43210</span>
            </div>
            
            <div className="flex gap-3">
              <button className="flex-1 border border-zinc-200 text-[#001410] py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-colors">
                Edit
              </button>
              <button className="w-12 flex items-center justify-center border border-zinc-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          </div>

          {/* Add New Outline Card */}
          <button className="border-2 border-dashed border-[#c1c8c5] rounded-2xl flex flex-col items-center justify-center text-zinc-400 hover:text-[#775a19] hover:border-[#775a19] hover:bg-[#FAF2E8]/30 transition-all min-h-[260px] gap-3">
             <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
             </div>
             <span className="font-serif text-lg font-medium">Add New Address</span>
          </button>

        </div>
      </div>
    </main>
  );
}
