"use client";

import React from 'react';

export default function AdminSettings() {
  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Platform Settings</h1>
        <p className="text-zinc-500 mt-2 text-sm md:text-base">Manage global configurations, pricing rules, and third-party integrations.</p>
      </div>

      <div className="space-y-8">
        {/* Fee Configuration */}
        <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 md:p-8">
          <h2 className="font-serif text-xl font-medium text-[#001410] mb-6">Financial Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Default Platform Fee (%)</label>
              <input type="number" defaultValue="20" className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#A8813C]" />
              <p className="text-[10px] text-zinc-400 mt-1">This can be overridden per vendor.</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Security Deposit Multiple</label>
              <select className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#A8813C]">
                <option>0.5x Rental Price</option>
                <option selected>1.0x Rental Price</option>
                <option>1.5x Rental Price</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Auto-Payout Threshold (₹)</label>
              <input type="number" defaultValue="10000" className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#A8813C]" />
            </div>
          </div>
        </section>

        {/* Third Party Keys */}
        <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 md:p-8">
          <h2 className="font-serif text-xl font-medium text-[#001410] mb-6">Integrations & API Keys</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Razorpay Key ID</label>
              <input type="password" defaultValue="rzp_live_xxxxxxxxxxx" className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#A8813C]" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Delhivery Logistics Token</label>
              <input type="password" defaultValue="dlv_prod_xxxxxxxxxxx" className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#A8813C]" />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button className="bg-[#001410] text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] shadow-lg transition-all">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
