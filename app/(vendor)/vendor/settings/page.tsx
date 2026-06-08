"use client";

import React from 'react';

export default function VendorSettings() {
  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Boutique Settings</h1>
        <p className="text-[#414846] mt-2 text-sm md:text-base">Manage your boutique profile, business details, and notification preferences.</p>
      </div>

      <div className="flex flex-col gap-8">
        
        {/* Boutique Profile */}
        <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 md:p-8">
          <h2 className="font-serif text-xl font-medium text-[#001410] mb-6">Boutique Profile</h2>
          
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-[#001410] text-white flex items-center justify-center font-serif text-3xl shrink-0">
              MM
            </div>
            <div className="flex flex-col justify-center">
              <button className="bg-zinc-100 text-[#001410] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors w-fit mb-2">
                Upload New Logo
              </button>
              <p className="text-xs text-zinc-500">Must be JPEG or PNG. Max 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Boutique Name</label>
              <input type="text" defaultValue="Manish Malhotra" className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#775a19]" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Public Email</label>
              <input type="email" defaultValue="contact@manishmalhotra.in" className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#775a19]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Bio / Description</label>
              <textarea rows={3} defaultValue="Premium designer ethnic wear blending traditional craftsmanship with contemporary silhouettes." className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#775a19] resize-none"></textarea>
            </div>
          </div>
        </section>

        {/* Business & Payout Details */}
        <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 md:p-8">
          <h2 className="font-serif text-xl font-medium text-[#001410] mb-6">Business & Payout Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">GSTIN / Tax ID</label>
              <input type="text" defaultValue="27AAHCMXXXXG1Z2" className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#775a19]" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Account Holder Name</label>
              <input type="text" defaultValue="Manish Malhotra Designs Pvt Ltd" className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#775a19]" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Bank Account Number</label>
              <input type="password" defaultValue="00000000004092" className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#775a19]" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">IFSC / Routing Code</label>
              <input type="text" defaultValue="HDFC0000001" className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#775a19]" />
            </div>
          </div>
        </section>

        {/* Save Actions */}
        <div className="flex items-center justify-end gap-4 mt-4">
          <button className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-500 hover:bg-zinc-100 transition-colors">
            Discard Changes
          </button>
          <button className="bg-[#001410] text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] transition-colors shadow-lg">
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
}
