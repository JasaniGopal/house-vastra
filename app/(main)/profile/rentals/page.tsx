"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ActiveRentalsPage() {
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
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Active Rentals</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Manage your current rented outfits and track their status.</p>
        </div>

        {/* Rentals List */}
        <div className="flex flex-col gap-6">
          
          {/* Active Rental Card 1 */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-[#c1c8c5]/40 shadow-sm flex flex-col md:flex-row gap-6">
            {/* Image Thumbnail */}
            <div className="relative w-full md:w-36 h-48 md:h-36 rounded-xl overflow-hidden bg-[#FAF2E8] shrink-0 border border-zinc-100">
               <Image 
                src="/images/home/why-rent-vastra-home.jpg" 
                alt="Emerald Zari Lehenga" 
                fill 
                className="object-cover object-top" 
               />
            </div>
            
            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-0">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.15em] text-[#775a19] uppercase mb-1 block">Sabyasachi Heritage</span>
                    <h3 className="font-serif text-xl font-medium text-[#001410]">Emerald Zari Lehenga</h3>
                  </div>
                  <span className="bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full w-fit flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse"></span>
                    Delivered
                  </span>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <div>
                    <span className="text-zinc-500 block text-[11px] uppercase tracking-wider font-bold mb-1">Rental Period</span>
                    <span className="font-medium text-[#001410]">Oct 12 - Oct 16</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px] uppercase tracking-wider font-bold mb-1">Return Date</span>
                    <span className="font-bold text-red-600">Tomorrow, by 5 PM</span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3 mt-6">
                <button className="flex-1 bg-[#001410] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] hover:shadow-lg transition-all active:scale-[0.98]">
                  Schedule Return
                </button>
                <button className="flex-1 border border-[#001410] text-[#001410] bg-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-all active:scale-[0.98]">
                  Extend Rental
                </button>
              </div>
            </div>
          </div>

          {/* Active Rental Card 2 */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-[#c1c8c5]/40 shadow-sm flex flex-col md:flex-row gap-6">
            {/* Image Thumbnail */}
            <div className="relative w-full md:w-36 h-48 md:h-36 rounded-xl overflow-hidden bg-[#FAF2E8] shrink-0 border border-zinc-100">
               <Image 
                src="/images/home/western-gowns.png" 
                alt="Midnight Blue Sequin Gown" 
                fill 
                className="object-cover object-top" 
               />
            </div>
            
            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-0">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.15em] text-[#775a19] uppercase mb-1 block">Manish Malhotra</span>
                    <h3 className="font-serif text-xl font-medium text-[#001410]">Midnight Blue Sequin Gown</h3>
                  </div>
                  <span className="bg-[#FFF8E1] border border-[#FFECB3] text-[#F57F17] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full w-fit flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    Out for Delivery
                  </span>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  <div>
                    <span className="text-zinc-500 block text-[11px] uppercase tracking-wider font-bold mb-1">Rental Period</span>
                    <span className="font-medium text-[#001410]">Oct 15 - Oct 19</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[11px] uppercase tracking-wider font-bold mb-1">Status</span>
                    <span className="font-medium text-[#001410]">Arriving Today by 8 PM</span>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3 mt-6">
                <button className="flex-1 bg-zinc-100 text-zinc-400 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-not-allowed">
                  Track Delivery
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
