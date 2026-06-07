import React from "react";
import Link from "next/link";
import Image from "next/image";

const occasions = [
  {
    title: "Weddings",
    link: "/search?occasion=weddings",
    desktopSrc: "/images/home/occassion_weddings.png",
    mobileSrc: "/images/home/occassion_weddings_mobile.jpg",
    alt: "Traditional bridal weddings collection",
  },
  {
    title: "Cocktail",
    link: "/search?occasion=cocktail",
    desktopSrc: "/images/home/occassion_cocktail.png",
    mobileSrc: "/images/home/occassion_cocktail_mobile.jpg",
    alt: "Glamorous cocktail evening wear",
  },
  {
    title: "Haldi & Mehendi",
    link: "/search?occasion=haldi",
    desktopSrc: "/images/home/occassion_haldi.png",
    mobileSrc: "/images/home/occassion_haldi_mobile.jpg",
    alt: "Bright ethnic wear for Haldi and Mehendi ceremonies",
  },
];

export default function Occasions() {
  return (
    <section className="w-full py-16 md:py-24 bg-[#fcf9f8] overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6 md:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-[#001410] tracking-tight">
              Shop by Occasion
            </h2>
            <p className="text-sm md:text-base font-sans text-[#414846] mt-2">
              Curated looks for every celebration.
            </p>
          </div>
          <Link
            href="/occasions"
            className="text-sm font-sans font-semibold text-[#775a19] hover:text-[#5d4613] transition-colors flex items-center gap-1.5 mt-4 sm:mt-0"
          >
            View All Occasions
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Occasions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* Left Column: Weddings (Large Card) */}
          <Link
            href={occasions[0].link}
            className="group relative block overflow-hidden rounded-lg aspect-[2/1] md:aspect-auto md:col-span-3 md:h-[500px] lg:h-[600px] bg-[#FAF2E8] transition-transform duration-500 hover:-translate-y-1 shadow-sm"
          >
            <Image
              src={occasions[0].desktopSrc}
              alt={occasions[0].alt}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover object-left transition-transform duration-700 ease-out group-hover:scale-103"
              priority
            />
            {/* Soft dark overlay on hover */}
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-300" />
          </Link>

          {/* Right Column: Stacked Cards (Cocktail & Haldi) */}
          <div className="md:col-span-2 flex flex-col gap-6 h-auto md:h-[500px] lg:h-[600px]">
            
            {/* Top: Cocktail Card */}
            <Link
              href={occasions[1].link}
              className="group relative flex-1 block overflow-hidden rounded-lg aspect-[2/1] md:aspect-auto bg-[#FAF2E8] transition-transform duration-500 hover:-translate-y-1 shadow-sm"
            >
              <Image
                src={occasions[1].desktopSrc}
                alt={occasions[1].alt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-left transition-transform duration-700 ease-out group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-300" />
            </Link>

            {/* Bottom: Haldi Card */}
            <Link
              href={occasions[2].link}
              className="group relative flex-1 block overflow-hidden rounded-lg aspect-[2/1] md:aspect-auto bg-[#FAF2E8] transition-transform duration-500 hover:-translate-y-1 shadow-sm"
            >
              <Image
                src={occasions[2].desktopSrc}
                alt={occasions[2].alt}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-left transition-transform duration-700 ease-out group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-300" />
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}
