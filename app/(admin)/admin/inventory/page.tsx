"use client";

import React from 'react';
import Image from 'next/image';

export default function AdminInventoryQueue() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Inventory Queue</h1>
          <p className="text-zinc-500 mt-2 text-sm md:text-base">Review and approve new outfit submissions from boutique partners.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Review Item 1 */}
        <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-5 md:p-6 flex flex-col lg:flex-row gap-6 relative overflow-hidden">
          {/* Status Indicator Bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#A8813C]"></div>
          
          <div className="w-full lg:w-48 h-64 lg:h-48 bg-zinc-100 rounded-xl relative overflow-hidden shrink-0 border border-zinc-100">
            <Image src="/images/home/bag_midnight_lehenga.png" alt="Lehenga" fill className="object-cover object-top" />
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-[#A8813C] uppercase bg-[#FAF2E8] px-2 py-1 rounded">Manish Malhotra</span>
                  <span className="text-[10px] text-zinc-400">Submitted 2 hours ago</span>
                </div>
                <h3 className="font-serif text-2xl text-[#001410] font-medium mb-2">Midnight Blue Sequin Gown</h3>
                <p className="text-sm text-zinc-500 max-w-2xl line-clamp-2">
                  Premium georgette gown featuring intricate sequin and thread work. Includes an attached draped dupatta for effortless styling. Retail value verified via boutique invoice.
                </p>
              </div>
              
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-sm grid grid-cols-2 gap-x-8 gap-y-3 shrink-0 h-fit">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Category</p>
                  <p className="font-semibold text-[#001410]">Gowns</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Sizes</p>
                  <p className="font-semibold text-[#001410]">S, M, L</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Retail Value</p>
                  <p className="font-semibold text-[#001410]">₹1,25,000</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">4-Day Rental</p>
                  <p className="font-bold text-[#A8813C]">₹12,400</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
              <button className="bg-[#001410] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] transition-all">
                Approve Listing
              </button>
              <button className="bg-rose-50 text-rose-600 border border-rose-200 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-rose-100 transition-all">
                Reject / Flag
              </button>
              <button className="text-zinc-500 hover:text-[#001410] text-xs font-bold uppercase tracking-wider ml-auto">
                Request Edits
              </button>
            </div>
          </div>
        </div>

        {/* Review Item 2 */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 md:p-6 flex flex-col lg:flex-row gap-6 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-200"></div>
          
          <div className="w-full lg:w-48 h-64 lg:h-48 bg-zinc-100 rounded-xl relative overflow-hidden shrink-0 border border-zinc-100">
            <Image src="/images/home/bag_gold_sherwani.png" alt="Sherwani" fill className="object-cover object-top" />
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-[#A8813C] uppercase bg-[#FAF2E8] px-2 py-1 rounded">Sabyasachi Heritage</span>
                  <span className="text-[10px] text-zinc-400">Submitted yesterday</span>
                </div>
                <h3 className="font-serif text-2xl text-[#001410] font-medium mb-2">Ivory & Gold Zari Sherwani</h3>
                <p className="text-sm text-zinc-500 max-w-2xl line-clamp-2">
                  Classic ivory sherwani embroidered with pure gold zari. Includes matching churidar and a contrasting safa. Perfect for the groom's main ceremony.
                </p>
              </div>
              
              <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 text-sm grid grid-cols-2 gap-x-8 gap-y-3 shrink-0 h-fit">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Category</p>
                  <p className="font-semibold text-[#001410]">Sherwanis</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Sizes</p>
                  <p className="font-semibold text-[#001410]">L, XL</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Retail Value</p>
                  <p className="font-semibold text-[#001410]">₹1,85,000</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">4-Day Rental</p>
                  <p className="font-bold text-[#A8813C]">₹18,500</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
              <button className="bg-[#001410] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] transition-all">
                Approve Listing
              </button>
              <button className="bg-rose-50 text-rose-600 border border-rose-200 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-rose-100 transition-all">
                Reject / Flag
              </button>
              <button className="text-zinc-500 hover:text-[#001410] text-xs font-bold uppercase tracking-wider ml-auto">
                Request Edits
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
