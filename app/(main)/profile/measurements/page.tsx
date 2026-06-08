"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function MeasurementsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setToastMessage("Measurement Profile Updated Successfully!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1000);
  };

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
          <div className="flex items-center gap-4">
             <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Measurement Profile</h1>
             <span className="bg-[#FAF2E8] text-[#A8813C] text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase border border-[#E8D8BA]">Updated</span>
          </div>
          <p className="text-[#414846] mt-2 text-sm md:text-base">We use these exact measurements to perfectly tailor your rentals before dispatch.</p>
        </div>

        {/* Form */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#c1c8c5]/40 shadow-sm relative overflow-hidden">
          {/* Subtle tape measure graphic in background */}
          <div className="absolute top-0 right-4 w-8 h-full border-l-2 border-r-2 border-dashed border-[#E8D8BA] opacity-20 pointer-events-none flex flex-col justify-between py-8">
             {[...Array(10)].map((_, i) => (
                <div key={i} className="w-full border-t border-solid border-[#A8813C] h-px"></div>
             ))}
          </div>

          <form className="flex flex-col gap-8 relative z-10">
            
            {/* General */}
            <div>
               <h3 className="font-serif text-xl font-medium text-[#001410] mb-4 border-b border-zinc-100 pb-2">General Sizing</h3>
               <div className="grid grid-cols-2 gap-6">
                 <div className="flex flex-col gap-2">
                   <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Height</label>
                   <div className="flex gap-2">
                     <input type="text" defaultValue="5" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-center text-[#001410]" />
                     <span className="self-center text-sm font-bold text-zinc-400">ft</span>
                     <input type="text" defaultValue="6" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-center text-[#001410]" />
                     <span className="self-center text-sm font-bold text-zinc-400">in</span>
                   </div>
                 </div>
                 <div className="flex flex-col gap-2">
                   <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Standard Top Size</label>
                   <select defaultValue="M" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-[#001410] focus:outline-none appearance-none">
                     <option value="XS">XS</option>
                     <option value="S">S</option>
                     <option value="M">M</option>
                     <option value="L">L</option>
                     <option value="XL">XL</option>
                   </select>
                 </div>
               </div>
            </div>

            {/* Exact Measurements */}
            <div>
               <h3 className="font-serif text-xl font-medium text-[#001410] mb-4 border-b border-zinc-100 pb-2">Body Measurements (Inches)</h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 
                 <div className="flex flex-col gap-2">
                   <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Bust / Chest</label>
                   <div className="relative">
                     <input type="text" defaultValue="36" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-[#001410] focus:border-[#775a19]" />
                     <span className="absolute right-4 top-3 text-sm font-bold text-zinc-400">in</span>
                   </div>
                 </div>

                 <div className="flex flex-col gap-2">
                   <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Natural Waist</label>
                   <div className="relative">
                     <input type="text" defaultValue="28" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-[#001410] focus:border-[#775a19]" />
                     <span className="absolute right-4 top-3 text-sm font-bold text-zinc-400">in</span>
                   </div>
                 </div>

                 <div className="flex flex-col gap-2">
                   <label className="text-[11px] uppercase tracking-wider font-bold text-zinc-500">Hips</label>
                   <div className="relative">
                     <input type="text" defaultValue="38" className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-medium text-[#001410] focus:border-[#775a19]" />
                     <span className="absolute right-4 top-3 text-sm font-bold text-zinc-400">in</span>
                   </div>
                 </div>

               </div>
               <p className="text-xs text-zinc-500 mt-4 italic bg-zinc-50 p-3 rounded-lg">
                 *For lehengas, your skirt will be tailored exactly to your natural waist measurement.
               </p>
            </div>

            {/* Action */}
            <div className="mt-2 pt-6 border-t border-zinc-100 flex items-center justify-end">
              <button 
                type="submit" 
                onClick={handleSubmit}
                disabled={isUpdating}
                className={`bg-[#001410] text-white py-3.5 px-8 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] hover:shadow-lg transition-all active:scale-[0.98] ${isUpdating ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* Custom Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-4 md:right-8 z-50 transition-all duration-300 transform translate-y-0 opacity-100">
          <div className="bg-[#001410] text-white px-6 py-4 rounded-sm shadow-2xl flex items-center gap-3 border border-[#775a19]/30">
            <svg className="w-5 h-5 text-[#775a19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-sans text-xs md:text-[13px] uppercase font-bold tracking-wider">{toastMessage}</span>
          </div>
        </div>
      )}

    </main>
  );
}
