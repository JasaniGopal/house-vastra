"use client";

import React, from 'react';
import Link from 'next/link';

export default function PersonalInfoPage() {
  return (
    <main className="min-h-screen bg-[#fcf9f8] font-sans pb-24">
      <div className="max-w-[600px] mx-auto px-4 md:px-8 pt-8 md:pt-12">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#775a19] transition-colors mb-4 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Personal Information</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Update your contact details and preferences.</p>
        </div>

        {/* Form */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#c1c8c5]/40 shadow-sm">
          <form className="flex flex-col gap-6">
            
            {/* Name Fields */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">First Name</label>
                <input 
                  type="text" 
                  defaultValue="Ananya"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-[#001410] focus:outline-none focus:border-[#775a19] focus:bg-white transition-colors"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Last Name</label>
                <input 
                  type="text" 
                  defaultValue="Sharma"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-[#001410] focus:outline-none focus:border-[#775a19] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Email Address</label>
              <input 
                type="email" 
                defaultValue="ananya.sharma@example.com"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-[#001410] focus:outline-none focus:border-[#775a19] focus:bg-white transition-colors"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Phone Number</label>
              <div className="flex gap-2">
                <div className="bg-zinc-100 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 flex items-center shrink-0">
                  +91
                </div>
                <input 
                  type="tel" 
                  defaultValue="98765 43210"
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-[#001410] focus:outline-none focus:border-[#775a19] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* DOB */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Date of Birth <span className="lowercase font-normal normal-case">(For birthday surprises!)</span></label>
              <input 
                type="date" 
                defaultValue="1995-08-14"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-[#001410] focus:outline-none focus:border-[#775a19] focus:bg-white transition-colors"
              />
            </div>

            {/* Action */}
            <div className="mt-4 pt-6 border-t border-zinc-100 flex items-center justify-end">
              <button type="button" className="bg-[#001410] text-white py-3.5 px-8 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] hover:shadow-lg transition-all active:scale-[0.98]">
                Save Changes
              </button>
            </div>

          </form>
        </div>

      </div>
    </main>
  );
}
