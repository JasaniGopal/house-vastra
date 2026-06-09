"use client";

import React, { useState } from 'react';
import Image from 'next/image';

export default function VendorProducts() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">My Products</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Manage your listed inventory, update pricing, and add new outfits.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#001410] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] hover:shadow-lg transition-all w-fit"
        >
          + Add New Outfit
        </button>
      </div>

      {/* Filter/Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search by product name or ID..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#775a19]"
          />
          <svg className="w-5 h-5 text-zinc-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select className="bg-white border border-zinc-200 px-4 py-3 rounded-xl text-sm text-[#001410] focus:outline-none focus:border-[#775a19]">
          <option>All Categories</option>
          <option>Lehengas</option>
          <option>Sarees</option>
          <option>Gowns</option>
        </select>
        <select className="bg-white border border-zinc-200 px-4 py-3 rounded-xl text-sm text-[#001410] focus:outline-none focus:border-[#775a19]">
          <option>All Statuses</option>
          <option>Available</option>
          <option>Rented Out</option>
          <option>Disabled</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Outfit</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Rental Price (4 Days)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-[#414846]">
              <tr className="hover:bg-[#fcf9f8] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-zinc-100 rounded-lg relative overflow-hidden">
                      <Image src="/images/home/bag_midnight_lehenga.png" alt="Lehenga" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-[#001410]">Midnight Blue Sequin Gown</p>
                      <p className="text-xs text-zinc-500">SKU: MM-001</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">Gowns</td>
                <td className="px-6 py-4 font-bold text-[#001410]">₹12,400</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Available</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#775a19] font-bold text-xs uppercase tracking-wider hover:underline mr-4">Edit</button>
                  <button className="text-rose-600 font-bold text-xs uppercase tracking-wider hover:underline">Disable</button>
                </td>
              </tr>
              <tr className="hover:bg-[#fcf9f8] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-zinc-100 rounded-lg relative overflow-hidden">
                      <Image src="/images/home/bag_gold_sherwani.png" alt="Sherwani" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-[#001410]">Ivory & Gold Sherwani</p>
                      <p className="text-xs text-zinc-500">SKU: MM-002</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">Sherwanis</td>
                <td className="px-6 py-4 font-bold text-[#001410]">₹18,500</td>
                <td className="px-6 py-4">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Rented Out</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#775a19] font-bold text-xs uppercase tracking-wider hover:underline mr-4">Edit</button>
                  <button className="text-rose-600 font-bold text-xs uppercase tracking-wider hover:underline">Disable</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-[#001410]/60 z-[100] flex justify-end">
          <div className="w-full md:w-[600px] bg-white h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-zinc-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <h2 className="font-serif text-2xl font-medium text-[#001410]">Add New Outfit</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 md:p-8 flex flex-col gap-6">
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Product Images</label>
                <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-[#775a19] transition-colors cursor-pointer bg-zinc-50">
                  <svg className="w-8 h-8 text-zinc-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <p className="text-sm font-bold text-[#001410]">Click to upload or drag & drop</p>
                  <p className="text-xs text-zinc-500 mt-1">High resolution PNG or JPG (Max 5MB)</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Outfit Name</label>
                  <input type="text" className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#775a19]" placeholder="e.g. Midnight Blue Saree" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Category</label>
                    <select className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#775a19] bg-white">
                      <option>Lehenga</option>
                      <option>Saree</option>
                      <option>Sherwani</option>
                      <option>Gown</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Retail Value (₹)</label>
                    <input type="number" className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#775a19]" placeholder="e.g. 150000" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">4-Day Rental (₹)</label>
                    <input type="number" className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#775a19]" placeholder="e.g. 15000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Available Sizes</label>
                    <input type="text" className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#775a19]" placeholder="S, M, L, XL" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Description</label>
                  <textarea rows={4} className="w-full border border-zinc-200 px-4 py-3 rounded-xl focus:outline-none focus:border-[#775a19] resize-none" placeholder="Describe the fabric, embroidery, and care instructions..."></textarea>
                </div>
              </div>

              {/* Submit Actions */}
              <div className="mt-4 pt-6 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-500 hover:bg-zinc-100 transition-colors">
                  Cancel
                </button>
                <button onClick={() => setIsAddModalOpen(false)} className="bg-[#001410] text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] transition-colors shadow-lg">
                  Publish Outfit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
