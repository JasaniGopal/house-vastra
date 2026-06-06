import React from "react";

export default function StylistBanner() {
  return (
    <section className="w-full py-12 md:py-16 bg-[#001410] border-t border-white/5 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Title & Subtitle */}
        <div className="flex flex-col text-center md:text-left">
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-tight mb-2">
            Still have questions?
          </h2>
          <p className="font-sans text-sm md:text-base text-[#c1c8c5] max-w-[480px]">
            Our stylists are here to help you find the perfect look.
          </p>
        </div>

        {/* Right Side: Call Button */}
        <a
          href="tel:+919876543210"
          className="flex items-center gap-3 bg-[#775a19] text-white px-8 py-4 rounded-md font-sans font-semibold text-sm md:text-base hover:bg-[#8e6e23] active:scale-[0.98] cursor-pointer transition-all duration-300 shadow-sm shrink-0"
        >
          {/* Phone Icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 md:w-5 h-5 text-white"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span>Call to Enquire: +91 98765 43210</span>
        </a>

      </div>
    </section>
  );
}
