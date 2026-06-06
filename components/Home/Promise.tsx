import React from "react";

export default function Promise() {
  return (
    <section className="w-full py-16 md:py-24 bg-[#FAF7F5] overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6 md:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-[#001410] tracking-tight">
            The Rent Vastra Promise
          </h2>
          <p className="font-sans text-sm md:text-base text-[#5c6462] mt-4 max-w-[600px] leading-relaxed">
            Pristine quality and lightning-fast service for your most important moments.
          </p>
        </div>

        {/* Promise Cards Grid */}
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Hygiene & Care */}
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm flex flex-col items-center text-center border border-[#001410]/5 transition-all duration-300 hover:shadow-md">
            
            {/* Mint Green Badge */}
            <div className="w-16 h-16 rounded-2xl bg-[#c6ede2]/60 flex items-center justify-center mb-6">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#001410" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[#001410]">
                <path d="M7 11h10v9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-9Z" />
                <path d="M12 2v4" />
                <path d="M9 6h6" />
                <path d="M10 16h4M12 14v4" />
                <path d="M19 11c0 1.2-.8 2-1.5 2s-1.5-.8-1.5-2 .8-2 1.5-2 1.5.8 1.5 2Z" fill="#001410" fillOpacity="0.1" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#001410] mb-4">
              Hygiene & Care
            </h3>

            {/* Description */}
            <p className="font-sans text-sm md:text-base text-[#414846] leading-relaxed max-w-[360px]">
              Every garment undergoes a rigorous 5-step medical-grade sanitization and professional dry cleaning process before it reaches you.
            </p>

          </div>

          {/* Card 2: One-Day Delivery */}
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm flex flex-col items-center text-center border border-[#001410]/5 transition-all duration-300 hover:shadow-md">
            
            {/* Mint Green Badge */}
            <div className="w-16 h-16 rounded-2xl bg-[#c6ede2]/60 flex items-center justify-center mb-6">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#001410" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[#001410]">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8Z" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#001410] mb-4">
              One-Day Delivery
            </h3>

            {/* Description */}
            <p className="font-sans text-sm md:text-base text-[#414846] leading-relaxed max-w-[360px]">
              Last-minute plans? Our express delivery option ensures your dream outfit arrives at your doorstep within 24 hours.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
