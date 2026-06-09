"use client";

import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Platform Overview</h1>
          <p className="text-zinc-500 mt-2 text-sm md:text-base">System status and global metrics for Rent Vastra.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="bg-white border border-zinc-200 text-[#001410] py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-all">
             Generate Report
           </button>
           <button className="bg-[#001410] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] shadow-md transition-all">
             Global Settings
           </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
            <svg className="w-16 h-16 text-[#001410]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Platform Revenue</p>
          <p className="font-serif text-3xl font-bold text-[#001410] relative z-10">₹84,50,000</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">+24.5%</span>
            <span className="text-xs text-zinc-400">YTD Growth</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
             <svg className="w-16 h-16 text-[#001410]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Total Users</p>
          <p className="font-serif text-3xl font-bold text-[#001410] relative z-10">12,450</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">+1,204</span>
            <span className="text-xs text-zinc-400">this month</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-110 transition-transform">
            <svg className="w-16 h-16 text-[#001410]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Active Vendors</p>
          <p className="font-serif text-3xl font-bold text-[#001410] relative z-10">84</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
             <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">+3</span>
             <span className="text-xs text-zinc-400">new partners</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#FAF2E8] p-6 rounded-2xl border border-[#E8D8BA] shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <svg className="w-16 h-16 text-[#A8813C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <p className="text-[#A8813C] text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Approvals Pending</p>
          <p className="font-serif text-3xl font-bold text-[#001410] relative z-10">16</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <Link href="/admin/inventory" className="text-[#001410] text-xs font-bold uppercase hover:underline">Review Queue &rarr;</Link>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Recent Global Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-serif text-xl font-medium text-[#001410]">Recent Global Orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-wider text-[#A8813C] hover:text-[#001410] transition-colors">View All</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Vendor</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-[#414846]">
                <tr className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#001410]">#RV-84920</td>
                  <td className="px-6 py-4">Priya Patel</td>
                  <td className="px-6 py-4">Manish Malhotra</td>
                  <td className="px-6 py-4 font-bold text-[#001410]">₹12,400</td>
                  <td className="px-6 py-4">
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Prep</span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#001410]">#RV-84919</td>
                  <td className="px-6 py-4">Rahul Sharma</td>
                  <td className="px-6 py-4">Sabyasachi Heritage</td>
                  <td className="px-6 py-4 font-bold text-[#001410]">₹22,000</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Dispatched</span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#001410]">#RV-84918</td>
                  <td className="px-6 py-4">Sneha Reddy</td>
                  <td className="px-6 py-4">Anita Dongre</td>
                  <td className="px-6 py-4 font-bold text-[#001410]">₹8,500</td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Completed</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Top Performing Vendors */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-zinc-100">
            <h2 className="font-serif text-xl font-medium text-[#001410]">Top Vendors</h2>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-6">
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#001410] text-white flex items-center justify-center font-serif font-bold text-sm shrink-0">
                SB
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-[#001410] truncate">Sabyasachi Heritage</p>
                <p className="text-xs text-zinc-500">142 Rentals this month</p>
              </div>
              <div className="text-sm font-bold text-[#A8813C]">#1</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 flex items-center justify-center font-serif font-bold text-sm shrink-0">
                MM
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-[#001410] truncate">Manish Malhotra</p>
                <p className="text-xs text-zinc-500">128 Rentals this month</p>
              </div>
              <div className="text-sm font-bold text-zinc-400">#2</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 flex items-center justify-center font-serif font-bold text-sm shrink-0">
                AD
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-[#001410] truncate">Anita Dongre</p>
                <p className="text-xs text-zinc-500">95 Rentals this month</p>
              </div>
              <div className="text-sm font-bold text-zinc-400">#3</div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
