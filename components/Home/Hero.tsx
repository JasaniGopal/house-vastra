import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[580px] md:min-h-[680px] lg:min-h-[780px] flex items-center bg-[#fcf9f8] overflow-hidden">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-350 md:bg-right md:bg-[url('/images/home/hero_hero_image_web.png')] bg-[url('/images/home/hero_home_image_mobile.jpg')]"
        aria-hidden="true"
      />

      {/* Luxury Gradient Overlay (Fades into content on left, keeping text legible while keeping the mannequin fully vibrant) */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[#fcf9f8] via-[#fcf9f8]/95 to-transparent md:w-[60%] lg:w-[50%] hidden md:block"
        aria-hidden="true"
      />
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[#fcf9f8] via-[#fcf9f8]/40 to-transparent md:hidden"
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-[1280px] w-full px-6 md:px-16 py-12 md:py-24 flex flex-col justify-center">
        <div className="max-w-[520px]">
          {/* Overline Subtitle */}
          <span className="text-xs md:text-sm font-sans font-bold tracking-widest text-[#775a19] uppercase block mb-3 md:mb-4">
            Curated Elegance
          </span>

          {/* Luxury Serif Title */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-[#001410] leading-[1.1] tracking-tight">
            Rent. Wear.
            <span className="block italic text-[#50756c] mt-1">Repeat.</span>
          </h1>

          {/* Muted Description */}
          <p className="text-sm md:text-base font-sans text-[#414846] leading-relaxed max-w-[420px] mt-6 md:mt-8">
            Experience the luxury of heritage craftsmanship without the commitment. 
            Designer ethnic wear for your defining moments.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8 md:mt-10">
            <Link
              href="/search"
              className="bg-[#001410] text-white font-sans font-semibold text-center text-sm py-4 px-8 rounded hover:bg-[#00261f] transition-all hover:shadow-lg hover:shadow-[#001410]/10"
            >
              Explore Collection
            </Link>
            <Link
              href="#how-it-works"
              className="border border-[#1c1b1b]/30 text-[#1c1b1b] bg-white/50 backdrop-blur-sm font-sans font-semibold text-center text-sm py-4 px-8 rounded hover:bg-[#1c1b1b]/5 transition-all"
            >
              How it Works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
