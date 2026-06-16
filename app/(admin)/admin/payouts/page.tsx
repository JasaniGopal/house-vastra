"use client";

import React from 'react';

export default function AdminPayouts() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Vendor Payouts</h1>
          <p className="text-zinc-500 mt-2 text-sm md:text-base">Manage automated and manual transfers to boutique partners minus platform fees.</p>
        </div>
        <button className="bg-[#001410] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] shadow-md transition-all">
          Run Payout Cycle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Pending Payouts</p>
          <p className="font-serif text-3xl font-bold text-[#001410]">₹4,25,000</p>
          <p className="text-zinc-400 text-xs mt-2">Due across 12 vendors</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Platform Revenue (Unreleased)</p>
          <p className="font-serif text-3xl font-bold text-emerald-600">₹85,000</p>
          <p className="text-zinc-400 text-xs mt-2">Our cut from pending payouts</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Boutique</th>
                <th className="px-6 py-4">Pending Cleared Balance</th>
                <th className="px-6 py-4">Account Details</th>
                <th className="px-6 py-4">Last Payout</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-[#414846]">
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-bold text-[#A8813C]">Manish Malhotra</td>
                <td className="px-6 py-4 font-bold text-[#001410] text-lg">₹1,45,000</td>
                <td className="px-6 py-4 text-xs">
                  <p>HDFC Bank</p>
                  <p className="text-zinc-500 font-mono">****4092</p>
                </td>
                <td className="px-6 py-4 text-xs text-zinc-500">Dec 01, 2026</td>
                <td className="px-6 py-4 text-right">
                  <button className="bg-[#001410] text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#00261f]">
                    Process Manually
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-bold text-[#A8813C]">Anita Dongre</td>
                <td className="px-6 py-4 font-bold text-[#001410] text-lg">₹82,500</td>
                <td className="px-6 py-4 text-xs">
                  <p>ICICI Bank</p>
                  <p className="text-zinc-500 font-mono">****8811</p>
                </td>
                <td className="px-6 py-4 text-xs text-zinc-500">Nov 15, 2026</td>
                <td className="px-6 py-4 text-right">
                  <button className="bg-[#001410] text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#00261f]">
                    Process Manually
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
