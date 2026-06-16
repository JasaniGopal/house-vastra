"use client";

import React from 'react';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="bg-[#fcf9f8] min-h-screen pt-24 pb-24 font-sans">
      <div className="max-w-[800px] mx-auto px-6 md:px-8">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#001410] mb-8 tracking-tight">How It Works</h1>
        <p className="text-[#414846] text-lg mb-12">Renting luxury designer wear has never been easier. We handle the dry cleaning and the logistics so you can focus on looking your best.</p>
        
        <div className="space-y-12">
          
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-full bg-[#FAF2E8] text-[#A8813C] flex items-center justify-center font-serif text-2xl shrink-0">1</div>
            <div>
              <h2 className="font-serif text-2xl text-[#001410] mb-2">Find Your Look</h2>
              <p className="text-[#414846] leading-relaxed">
                Browse our curated collection of authentic designer Lehengas, Sarees, Sherwanis, and Gowns. Use our "Find My Fit" tool to ensure the perfect sizing before you book.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-full bg-[#FAF2E8] text-[#A8813C] flex items-center justify-center font-serif text-2xl shrink-0">2</div>
            <div>
              <h2 className="font-serif text-2xl text-[#001410] mb-2">Book Your Dates</h2>
              <p className="text-[#414846] leading-relaxed">
                Select your 4-day or 8-day rental period. We recommend choosing a delivery date 1-2 days before your actual event to give you plenty of time to try it on.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-full bg-[#FAF2E8] text-[#A8813C] flex items-center justify-center font-serif text-2xl shrink-0">3</div>
            <div>
              <h2 className="font-serif text-2xl text-[#001410] mb-2">Wear & Dazzle</h2>
              <p className="text-[#414846] leading-relaxed">
                Your outfit arrives pristine and ready-to-wear. It comes in a premium garment bag. Wear it, take lots of photos, and enjoy your special occasion!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-full bg-[#FAF2E8] text-[#A8813C] flex items-center justify-center font-serif text-2xl shrink-0">4</div>
            <div>
              <h2 className="font-serif text-2xl text-[#001410] mb-2">Return with Ease</h2>
              <p className="text-[#414846] leading-relaxed">
                Pack the outfit back into the garment bag. No need to dry clean—our boutique partners handle the specialized cleaning. Schedule a free home pickup through your profile dashboard.
              </p>
            </div>
          </div>

        </div>

        <div className="mt-16 text-center">
          <Link href="/collections" className="inline-block bg-[#001410] text-white px-8 py-4 text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] transition-all">
            Start Exploring
          </Link>
        </div>
      </div>
    </div>
  );
}
