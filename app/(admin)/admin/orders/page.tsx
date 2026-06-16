"use client";

import React from 'react';

export default function AdminGlobalOrders() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Global Orders</h1>
          <p className="text-zinc-500 mt-2 text-sm md:text-base">Monitor all platform transactions, oversee logistics, and handle disputes.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Rental Dates</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-[#414846]">
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-bold text-[#001410]">#RV-84920</td>
                <td className="px-6 py-4 text-xs">
                  <p className="font-bold text-[#001410]">Priya Patel</p>
                  <p className="text-zinc-500">+91 98765 43210</p>
                </td>
                <td className="px-6 py-4 text-xs">
                  <p className="font-bold text-[#A8813C]">Manish Malhotra</p>
                </td>
                <td className="px-6 py-4 text-xs">
                  Dec 14 - Dec 18
                </td>
                <td className="px-6 py-4 text-right font-bold text-[#001410]">₹12,400</td>
                <td className="px-6 py-4">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Needs Prep</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#A8813C] font-bold text-xs uppercase tracking-wider hover:underline mr-4">View</button>
                  <button className="text-rose-600 font-bold text-xs uppercase tracking-wider hover:underline">Cancel</button>
                </td>
              </tr>
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-bold text-[#001410]">#RV-84919</td>
                <td className="px-6 py-4 text-xs">
                  <p className="font-bold text-[#001410]">Rahul Sharma</p>
                  <p className="text-zinc-500">+91 87654 32109</p>
                </td>
                <td className="px-6 py-4 text-xs">
                  <p className="font-bold text-[#A8813C]">Sabyasachi</p>
                </td>
                <td className="px-6 py-4 text-xs">
                  Dec 12 - Dec 16
                </td>
                <td className="px-6 py-4 text-right font-bold text-[#001410]">₹22,000</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Dispatched</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#A8813C] font-bold text-xs uppercase tracking-wider hover:underline mr-4">View</button>
                  <button className="text-zinc-400 font-bold text-xs uppercase tracking-wider hover:underline">Refund</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
