"use client";

import React from 'react';
import Link from 'next/link';

export default function VendorDashboard() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Dashboard Overview</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Welcome back, Manish Malhotra. Here's what's happening with your boutique today.</p>
        </div>
        <Link href="/vendor/products" className="bg-[#001410] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] hover:shadow-lg transition-all w-fit">
          + Add New Outfit
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <svg className="w-16 h-16 text-[#775a19]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-1H9v-2h4v-2h-3c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h1V5h2v1h2v2h-4v2h3c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-1v1h-2z"/></svg>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Total Earnings</p>
          <p className="font-serif text-3xl font-bold text-[#001410] relative z-10">₹4,25,000</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">+12%</span>
            <span className="text-xs text-zinc-400">vs last month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#001410] p-6 rounded-2xl border border-[#00261f] shadow-lg relative overflow-hidden group text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Active Rentals</p>
          <p className="font-serif text-3xl font-bold text-white relative z-10">24</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="text-white text-xs font-bold">Currently dispatched</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-16 h-16 text-[#775a19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Pending Orders</p>
          <p className="font-serif text-3xl font-bold text-[#001410] relative z-10">8</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
             <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[10px] font-bold">Requires Action</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-16 h-16 text-[#775a19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Total Inventory</p>
          <p className="font-serif text-3xl font-bold text-[#001410] relative z-10">142</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="text-zinc-400 text-xs">Outfits listed</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium text-[#001410]">Recent Orders</h2>
          <Link href="/vendor/orders" className="text-xs font-bold uppercase tracking-wider text-[#775a19] hover:text-[#001410] transition-colors">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Outfit</th>
                <th className="px-6 py-4">Rental Dates</th>
                <th className="px-6 py-4">Payout</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-[#414846]">
              {/* Order Row 1 */}
              <tr className="hover:bg-[#fcf9f8] transition-colors group">
                <td className="px-6 py-4 font-bold text-[#001410]">#RV-84920</td>
                <td className="px-6 py-4">Midnight Blue Sequin Gown</td>
                <td className="px-6 py-4">Dec 14 - Dec 18</td>
                <td className="px-6 py-4 font-bold text-[#001410]">₹12,400</td>
                <td className="px-6 py-4">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Needs Prep</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#775a19] font-bold text-xs uppercase tracking-wider hover:underline">Manage</button>
                </td>
              </tr>
              {/* Order Row 2 */}
              <tr className="hover:bg-[#fcf9f8] transition-colors group">
                <td className="px-6 py-4 font-bold text-[#001410]">#RV-84881</td>
                <td className="px-6 py-4">Emerald Zari Lehenga</td>
                <td className="px-6 py-4">Dec 12 - Dec 16</td>
                <td className="px-6 py-4 font-bold text-[#001410]">₹18,500</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Dispatched</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#775a19] font-bold text-xs uppercase tracking-wider hover:underline">Manage</button>
                </td>
              </tr>
              {/* Order Row 3 */}
              <tr className="hover:bg-[#fcf9f8] transition-colors group">
                <td className="px-6 py-4 font-bold text-[#001410]">#RV-84755</td>
                <td className="px-6 py-4">Pastel Floral Silk Saree</td>
                <td className="px-6 py-4">Dec 05 - Dec 09</td>
                <td className="px-6 py-4 font-bold text-[#001410]">₹6,200</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Completed</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#775a19] font-bold text-xs uppercase tracking-wider hover:underline">Manage</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
