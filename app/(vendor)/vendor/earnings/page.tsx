"use client";

import React from 'react';

export default function VendorEarnings() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Earnings & Payouts</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Track your revenue, view upcoming payouts, and manage your bank details.</p>
        </div>
        <button className="bg-[#001410] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] hover:shadow-lg transition-all w-fit">
          Withdraw Funds
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#001410] text-white p-6 rounded-2xl border border-[#00261f] shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-1H9v-2h4v-2h-3c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h1V5h2v1h2v2h-4v2h3c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-1v1h-2z"/></svg>
          </div>
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Available for Withdrawal</p>
          <p className="font-serif text-4xl font-bold relative z-10">₹1,45,000</p>
          <p className="text-zinc-400 text-xs mt-4 relative z-10 border-t border-zinc-800 pt-3">Next auto-payout on Dec 15</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Pending Clearance</p>
          <p className="font-serif text-3xl font-bold text-[#001410]">₹38,500</p>
          <p className="text-zinc-500 text-xs mt-4 border-t border-zinc-100 pt-3">Funds clear 2 days after rental return</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Total Earnings (YTD)</p>
          <p className="font-serif text-3xl font-bold text-[#001410]">₹18,50,000</p>
          <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-3">
            <span className="text-emerald-600 font-bold text-xs">+15%</span>
            <span className="text-xs text-zinc-400">vs last year</span>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium text-[#001410]">Payout History</h2>
          <button className="text-[#775a19] font-bold text-xs uppercase tracking-wider hover:underline">Download Statements</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-[#414846]">
              <tr className="hover:bg-[#fcf9f8] transition-colors">
                <td className="px-6 py-4">Dec 01, 2026</td>
                <td className="px-6 py-4 text-xs font-mono text-zinc-500">TXN-98442119</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-5 bg-zinc-200 rounded border border-zinc-300 flex items-center justify-center text-[8px] font-bold">BANK</span>
                    HDFC ****4092
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-[#001410]">₹1,20,000</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Processed</span>
                </td>
              </tr>
              <tr className="hover:bg-[#fcf9f8] transition-colors">
                <td className="px-6 py-4">Nov 15, 2026</td>
                <td className="px-6 py-4 text-xs font-mono text-zinc-500">TXN-88219904</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-5 bg-zinc-200 rounded border border-zinc-300 flex items-center justify-center text-[8px] font-bold">BANK</span>
                    HDFC ****4092
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-[#001410]">₹85,400</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Processed</span>
                </td>
              </tr>
              <tr className="hover:bg-[#fcf9f8] transition-colors">
                <td className="px-6 py-4">Nov 01, 2026</td>
                <td className="px-6 py-4 text-xs font-mono text-zinc-500">TXN-71982230</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-5 bg-zinc-200 rounded border border-zinc-300 flex items-center justify-center text-[8px] font-bold">BANK</span>
                    HDFC ****4092
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-[#001410]">₹1,05,200</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Processed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
