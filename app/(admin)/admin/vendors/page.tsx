"use client";

import React from 'react';

export default function AdminVendors() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Manage Vendors</h1>
          <p className="text-zinc-500 mt-2 text-sm md:text-base">Review, approve, and manage boutique partners on the platform.</p>
        </div>
        <button className="bg-[#001410] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] shadow-md transition-all">
          Invite New Vendor
        </button>
      </div>

      {/* Filter/Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search boutique or owner name..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#A8813C]"
          />
          <svg className="w-5 h-5 text-zinc-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select className="bg-white border border-zinc-200 px-4 py-3 rounded-xl text-sm text-[#001410] focus:outline-none focus:border-[#A8813C]">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Pending Approval</option>
          <option>Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Boutique</th>
                <th className="px-6 py-4">Contact Person</th>
                <th className="px-6 py-4 text-center">Active Products</th>
                <th className="px-6 py-4 text-center">Platform Fee</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-[#414846]">
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#001410] text-white flex items-center justify-center font-serif text-sm">MM</div>
                    <div>
                      <p className="font-bold text-[#001410]">Manish Malhotra</p>
                      <p className="text-xs text-zinc-500">Since Jan 2025</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs">
                  <p>Manish M.</p>
                  <p className="text-zinc-500">contact@mm.in</p>
                </td>
                <td className="px-6 py-4 text-center font-bold text-[#001410]">142</td>
                <td className="px-6 py-4 text-center">20%</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Active</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#A8813C] font-bold text-xs uppercase tracking-wider hover:underline mr-4">Edit</button>
                  <button className="text-rose-600 font-bold text-xs uppercase tracking-wider hover:underline">Suspend</button>
                </td>
              </tr>
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center font-serif text-sm">VT</div>
                    <div>
                      <p className="font-bold text-[#001410]">Vastra Traditions</p>
                      <p className="text-xs text-zinc-500">Applied 2 days ago</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs">
                  <p>Sneha Kapoor</p>
                  <p className="text-zinc-500">sneha@vastratraditions.com</p>
                </td>
                <td className="px-6 py-4 text-center font-bold text-[#001410]">-</td>
                <td className="px-6 py-4 text-center">25% (Default)</td>
                <td className="px-6 py-4">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Pending</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-emerald-600 font-bold text-xs uppercase tracking-wider hover:underline mr-4">Approve</button>
                  <button className="text-rose-600 font-bold text-xs uppercase tracking-wider hover:underline">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
