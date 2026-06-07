"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function OccasionsPage() {
  return (
    <main className="min-h-screen bg-[#fcf9f8] flex flex-col font-sans">
      
      {/* Top Hero Gradient Section */}
      <section className="relative w-full pt-16 pb-12 md:pt-24 md:pb-16 flex flex-col items-center justify-center text-center px-6">
        {/* Subtle background gradient mirroring the design */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#e6e2df] to-[#fcf9f8] opacity-60 z-0 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[64px] font-bold text-[#001410] tracking-tight leading-tight">
            Dress for the Moment
          </h1>
          <p className="font-serif italic text-lg md:text-xl text-[#414846] mt-4">
            Curated luxury rentals for every chapter of your story.
          </p>
        </div>
      </section>

      {/* Heritage & Tradition Section */}
      <section className="w-full pb-20 md:pb-32 px-4 md:px-16 mx-auto max-w-[1280px]">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="font-sans text-[11px] md:text-xs font-bold tracking-[0.15em] text-[#775a19] uppercase">
              Heritage & Tradition
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[40px] font-bold text-[#001410] mt-1 tracking-tight">
              Wedding & Festive
            </h2>
          </div>
          <Link
            href="/search?occasion=wedding"
            className="hidden md:inline-block font-sans text-sm font-medium text-[#414846] hover:text-[#001410] border-b border-[#001410]/30 hover:border-[#001410] pb-0.5 transition-all mt-4 md:mt-0"
          >
            Explore the Collection
          </Link>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Left Column: Grand Weddings */}
          <Link 
            href="/search?occasion=grand-weddings"
            className="md:col-span-7 lg:col-span-6 group block"
          >
            <div className="relative w-full aspect-[3/4] md:h-[600px] lg:h-[800px] rounded-sm overflow-hidden bg-[#E8E1DA]">
              <Image
                src="/images/occasions/new_grand_wedding.png"
                alt="Grand Weddings"
                fill
                priority
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>
            <div className="mt-5">
              <h3 className="font-serif text-2xl font-bold text-[#001410] group-hover:text-[#775a19] transition-colors">
                Grand Weddings
              </h3>
              <p className="font-sans text-[15px] italic text-[#414846] mt-1">
                Majestic silhouettes for the main ceremony.
              </p>
            </div>
          </Link>

          {/* Right Column: Receptions & Sangeet Stack */}
          <div className="md:col-span-5 lg:col-span-6 flex flex-col gap-8 md:gap-10">
            
            {/* Top: Receptions */}
            <Link 
              href="/search?occasion=receptions"
              className="group block"
            >
              <div className="relative w-full aspect-[4/3] md:h-[260px] lg:h-[360px] rounded-sm overflow-hidden bg-[#E8E1DA]">
                <Image
                  src="/images/occasions/reception.jpg"
                  alt="Receptions"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <div className="mt-5">
                <h3 className="font-serif text-2xl font-bold text-[#001410] group-hover:text-[#775a19] transition-colors">
                  Receptions
                </h3>
                <p className="font-sans text-[15px] italic text-[#414846] mt-1">
                  Modern glamour for high-end soirées.
                </p>
              </div>
            </Link>

            {/* Bottom: Sangeet & Mehendi */}
            <Link 
              href="/search?occasion=sangeet"
              className="group block"
            >
              <div className="relative w-full aspect-[4/3] md:h-[260px] lg:h-[360px] rounded-sm overflow-hidden bg-[#E8E1DA]">
                <Image
                  src="/images/occasions/new_sangeet.png"
                  alt="Sangeet and Mehendi"
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <div className="mt-5">
                <h3 className="font-serif text-2xl font-bold text-[#001410] group-hover:text-[#775a19] transition-colors">
                  Sangeet & Mehendi
                </h3>
                <p className="font-sans text-[15px] italic text-[#414846] mt-1">
                  Vibrant ensembles for a night of dance.
                </p>
              </div>
            </Link>
            
          </div>
        </div>

        {/* Mobile-only Explore link (appears at bottom instead of top) */}
        <div className="mt-8 md:hidden flex justify-center">
          <Link
            href="/search?occasion=wedding"
            className="font-sans text-sm font-medium text-[#414846] border-b border-[#001410]/30 pb-0.5"
          >
            Explore the Collection
          </Link>
        </div>

      </section>

      {/* Pre-wedding Shoots Section */}
      <section className="w-full pb-20 md:pb-32 px-4 md:px-16 mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Content */}
          <div className="order-2 lg:order-1 max-w-xl">
            <span className="font-sans text-[11px] md:text-xs font-bold tracking-[0.15em] text-[#775a19] uppercase">
              Cinematic Memories
            </span>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-[72px] font-bold text-[#001410] mt-4 mb-2 tracking-tight leading-[1.05]">
              Pre-wedding
              <br />
              Shoots
            </h2>
            <p className="font-sans italic text-base md:text-[17px] text-[#414846] mt-6 leading-relaxed max-w-md">
              Capture your love story against the backdrop of history. Our pre-wedding collection features statement pieces designed for dramatic landscapes and heritage architecture.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
              <Link 
                href="/lookbook"
                className="w-full sm:w-auto text-center bg-[#001410] text-white px-8 py-3.5 rounded-sm font-sans font-medium text-sm hover:bg-[#00261f] transition-colors"
              >
                View Lookbook
              </Link>
              <Link 
                href="/search?occasion=pre-wedding"
                className="w-full sm:w-auto text-center bg-transparent text-[#001410] px-8 py-3.5 rounded-sm font-sans font-medium text-sm border border-[#001410] hover:bg-[#001410]/5 transition-colors"
              >
                Curated Sets
              </Link>
            </div>
          </div>
          
          {/* Right Image Layout */}
          <div className="order-1 lg:order-2 relative w-full h-[450px] md:h-[550px] lg:h-[600px] flex items-center justify-center pt-8 md:pt-0">
            {/* Top Right Decorative Square Outline */}
            <div className="absolute top-0 right-0 w-[55%] h-[65%] border border-[#001410]/15 z-0 translate-x-[5%] -translate-y-[8%]" />
            
            {/* Bottom Left Solid Square Block */}
            <div className="absolute bottom-0 left-0 w-[35%] h-[45%] bg-[#F3EFE9] z-0 -translate-x-[5%] translate-y-[8%]" />
            
            {/* Main Image */}
            <div className="relative w-[85%] h-[85%] z-10 overflow-hidden bg-[#E8E1DA]">
              <Image
                src="/images/occasions/new_pre_wedding.png"
                alt="Pre-wedding sunset shoot"
                fill
                className="object-cover object-center"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Indian Festivals Section */}
      <section className="w-full pb-20 md:pb-32 px-4 md:px-16 mx-auto max-w-[1280px]">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="font-sans text-[11px] md:text-xs font-bold tracking-[0.15em] text-[#775a19] uppercase">
            Festive Spirit
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-[56px] font-bold text-[#001410] mt-3 tracking-tight">
            Indian Festivals
          </h2>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Navratri Card */}
          <Link href="/search?occasion=navratri" className="group flex flex-col items-center text-center">
            <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden bg-[#E8E1DA] mb-6">
              <Image 
                src="/images/occasions/navratri.png" 
                alt="Navratri" 
                fill 
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
              />
            </div>
            <h3 className="font-serif text-[28px] font-bold text-[#001410]">Navratri</h3>
            <div className="w-8 h-[1px] bg-[#775a19] mt-3 transition-all duration-300 group-hover:w-16" />
          </Link>
          
          {/* Diwali Card */}
          <Link href="/search?occasion=diwali" className="group flex flex-col items-center text-center">
            <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden bg-[#E8E1DA] mb-6">
              <Image 
                src="/images/occasions/diwali.png" 
                alt="Diwali" 
                fill 
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
              />
            </div>
            <h3 className="font-serif text-[28px] font-bold text-[#001410]">Diwali</h3>
            <div className="w-8 h-[1px] bg-[#775a19] mt-3 transition-all duration-300 group-hover:w-16" />
          </Link>

          {/* Christmas Card */}
          <Link href="/search?occasion=christmas" className="group flex flex-col items-center text-center">
            <div className="relative w-full aspect-[4/5] rounded-sm overflow-hidden bg-[#E8E1DA] mb-6">
              <Image 
                src="/images/occasions/christmas.png" 
                alt="Christmas" 
                fill 
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
              />
            </div>
            <h3 className="font-serif text-[28px] font-bold text-[#001410]">Christmas</h3>
            <div className="w-8 h-[1px] bg-[#775a19] mt-3 transition-all duration-300 group-hover:w-16" />
          </Link>

        </div>
      </section>

      {/* Lifestyle & Casuals Section */}
      <section className="w-full pb-24 md:pb-32 px-4 md:px-16 mx-auto max-w-[1280px]">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="font-sans text-[11px] md:text-xs font-bold tracking-[0.15em] text-[#775a19] uppercase">
              Everyday Luxe
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#001410] mt-2 tracking-tight">
              Lifestyle & Casuals
            </h2>
          </div>
          {/* Carousel Arrows */}
          <div className="hidden sm:flex gap-3 mt-4 sm:mt-0">
            <button className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-400 hover:text-black hover:border-black transition-colors cursor-pointer" aria-label="Previous">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-400 hover:text-black hover:border-black transition-colors cursor-pointer" aria-label="Next">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Date Night Card */}
          <Link href="/search?occasion=date-night" className="group block bg-[#f2f0ed] rounded-sm overflow-hidden flex flex-col h-[450px] md:h-[500px]">
            <div className="relative w-full flex-grow p-6 flex items-center justify-center">
              <Image 
                src="/images/occasions/date_night.png" 
                alt="Date Night Elegance" 
                fill 
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]" 
              />
            </div>
            <div className="p-6 pt-4 flex justify-between items-end relative z-10 bg-[#f2f0ed]">
              <div>
                <h3 className="font-sans font-medium text-[#001410]">Date Night Elegance</h3>
                <p className="font-serif italic text-[#414846] text-sm mt-0.5">Understated Sophistication</p>
              </div>
              <svg className="w-5 h-5 text-[#775a19] mb-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </Link>

          {/* Right Column: Campus Icons Banner */}
          <div className="lg:col-span-2 bg-[#09261E] rounded-sm overflow-hidden flex flex-col md:flex-row h-auto md:h-[500px]">
            {/* Text Side */}
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">
              <h3 className="font-serif text-3xl md:text-4xl lg:text-[42px] text-[#A6C4BA] opacity-90 font-bold tracking-tight">
                Campus Icons
              </h3>
              <p className="font-sans italic text-[#A6C4BA] opacity-70 text-base md:text-[17px] mt-6 leading-relaxed max-w-sm">
                Make a statement at your college fest with contemporary ethnic-fusion styles that blend comfort with high-street cool.
              </p>
              <div className="mt-10">
                <Link 
                  href="/search?occasion=college-fest"
                  className="inline-block bg-[#836329] text-[#121212] px-8 py-3.5 rounded-sm font-sans font-medium text-sm hover:bg-[#9E7A36] transition-colors"
                >
                  Shop College Fests
                </Link>
              </div>
            </div>
            {/* Image Side */}
            <div className="w-full md:w-1/2 relative min-h-[300px] h-full">
              <Image 
                src="/images/occasions/campus_icons.png" 
                alt="Campus Icons" 
                fill 
                className="object-cover object-center" 
              />
              {/* Subtle gradient overlay to blend image into background on mobile */}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent via-transparent to-[#09261E] pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

      {/* Personalized Curation CTA Section */}
      <section className="w-full pb-24 md:pb-32 px-4 md:px-16 mx-auto max-w-[1280px]">
        <div className="bg-[#09261E] rounded-md px-6 py-16 md:py-24 lg:py-28 text-center flex flex-col items-center justify-center shadow-lg">
          
          <span className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-[#9E7A36] uppercase mb-4 md:mb-6">
            Personalized Curation
          </span>
          
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#A6C4BA] mb-5 tracking-tight opacity-90">
            Not sure what to wear?
          </h2>
          
          <p className="font-sans italic text-[#A6C4BA] opacity-70 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed px-4">
            Our expert stylists are here to help you select the perfect outfit for your body type, occasion, and personal style.
          </p>
          
          <Link 
            href="/stylist"
            className="inline-block bg-[#836329] text-[#121212] px-10 py-4 rounded-sm font-sans font-semibold text-sm hover:bg-[#9E7A36] transition-colors shadow-sm"
          >
            Book Stylist Session
          </Link>

        </div>
      </section>

    </main>
  );
}
