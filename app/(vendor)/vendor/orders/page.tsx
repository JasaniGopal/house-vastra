"use client";

import React from 'react';
import Image from 'next/image';

export default function VendorOrders() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Active Orders</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Track your upcoming rentals, print shipping labels, and manage returns.</p>
        </div>
      </div>

      {/* Filter/Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search by Order ID or Customer Name..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#775a19]"
          />
          <svg className="w-5 h-5 text-zinc-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select className="bg-white border border-zinc-200 px-4 py-3 rounded-xl text-sm text-[#001410] focus:outline-none focus:border-[#775a19]">
          <option>All Statuses</option>
          <option>Needs Prep</option>
          <option>Dispatched</option>
          <option>In Use</option>
          <option>Returned</option>
        </select>
        <button className="bg-white border border-zinc-200 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-[#001410] hover:bg-zinc-50 transition-all">
          Export CSV
        </button>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        
        {/* Order Card 1 */}
        <div className="bg-white rounded-2xl border border-[#c1c8c5]/40 shadow-sm p-5 md:p-6 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-32 h-40 lg:h-32 bg-zinc-100 rounded-xl relative overflow-hidden shrink-0 border border-zinc-100">
            <Image src="/images/home/bag_midnight_lehenga.png" alt="Lehenga" fill className="object-cover object-top" />
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-[#001410] text-lg">Order #RV-84920</h3>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Needs Prep</span>
                </div>
                <p className="text-sm text-zinc-500">Customer: <span className="font-semibold text-[#001410]">Priya Patel</span></p>
                <p className="text-sm text-zinc-500 mt-1">Outfit: Midnight Blue Sequin Gown (Size M)</p>
              </div>
              <div className="text-left md:text-right bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Rental Period</p>
                <p className="text-sm font-semibold text-[#001410]">Dec 14 - Dec 18</p>
                <p className="text-[10px] text-rose-600 font-bold mt-1 uppercase tracking-wider">Dispatch by Dec 11</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
              <button className="bg-[#001410] text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] transition-all">
                Print Shipping Label
              </button>
              <button className="border border-zinc-200 text-[#001410] px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-all">
                Mark as Dispatched
              </button>
              <button className="text-zinc-500 hover:text-[#001410] text-xs font-bold uppercase tracking-wider ml-auto">
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Order Card 2 */}
        <div className="bg-white rounded-2xl border border-[#c1c8c5]/40 shadow-sm p-5 md:p-6 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-32 h-40 lg:h-32 bg-zinc-100 rounded-xl relative overflow-hidden shrink-0 border border-zinc-100">
            <Image src="/images/home/bag_gold_sherwani.png" alt="Sherwani" fill className="object-cover object-top" />
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-[#001410] text-lg">Order #RV-84881</h3>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Dispatched</span>
                </div>
                <p className="text-sm text-zinc-500">Customer: <span className="font-semibold text-[#001410]">Rahul Sharma</span></p>
                <p className="text-sm text-zinc-500 mt-1">Outfit: Ivory & Gold Sherwani (Size L)</p>
              </div>
              <div className="text-left md:text-right bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Rental Period</p>
                <p className="text-sm font-semibold text-[#001410]">Dec 12 - Dec 16</p>
                <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-wider">Arriving tomorrow</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
              <button className="bg-zinc-100 text-zinc-400 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-not-allowed">
                Print Shipping Label
              </button>
              <button className="border border-zinc-200 text-[#001410] px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-all">
                Track Shipment
              </button>
              <button className="text-zinc-500 hover:text-[#001410] text-xs font-bold uppercase tracking-wider ml-auto">
                View Details
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
