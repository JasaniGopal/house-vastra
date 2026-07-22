"use client";

import React from 'react';
import Image from 'next/image';

export default function AdminUsers() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Users & Customers</h1>
          <p className="text-zinc-500 mt-2 text-sm md:text-base">Manage all registered customer accounts on LOR.</p>
        </div>
        <button className="bg-[#001410] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] shadow-md transition-all">
          Export User Data
        </button>
      </div>

      {/* Filter/Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#A8813C]"
          />
          <svg className="w-5 h-5 text-zinc-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select className="bg-white border border-zinc-200 px-4 py-3 rounded-xl text-sm text-[#001410] focus:outline-none focus:border-[#A8813C]">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Suspended</option>
          <option>Unverified</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Total Rentals</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-[#414846]">
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FAF2E8] text-[#A8813C] flex items-center justify-center font-bold">
                      PP
                    </div>
                    <div>
                      <p className="font-bold text-[#001410]">Priya Patel</p>
                      <p className="text-xs text-zinc-500">Joined Oct 2025</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs">
                  <p>priya.patel@example.com</p>
                  <p className="text-zinc-500 mt-0.5">+91 9168899557</p>
                </td>
                <td className="px-6 py-4 font-bold text-[#001410]">14</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Active</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#A8813C] font-bold text-xs uppercase tracking-wider hover:underline mr-4">View</button>
                  <button className="text-rose-600 font-bold text-xs uppercase tracking-wider hover:underline">Suspend</button>
                </td>
              </tr>
              <tr className="hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FAF2E8] text-[#A8813C] flex items-center justify-center font-bold">
                      RS
                    </div>
                    <div>
                      <p className="font-bold text-[#001410]">Rahul Sharma</p>
                      <p className="text-xs text-zinc-500">Joined Jan 2026</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs">
                  <p>rahul.sharma88@example.com</p>
                  <p className="text-zinc-500 mt-0.5">+91 87654 32109</p>
                </td>
                <td className="px-6 py-4 font-bold text-[#001410]">2</td>
                <td className="px-6 py-4">
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Unverified</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[#A8813C] font-bold text-xs uppercase tracking-wider hover:underline mr-4">View</button>
                  <button className="text-rose-600 font-bold text-xs uppercase tracking-wider hover:underline">Suspend</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
