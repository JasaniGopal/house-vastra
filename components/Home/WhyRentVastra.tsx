import React from "react";
import Image from "next/image";

const items = [
  {
    title: "Sustainable Fashion",
    description: "Reduce fashion waste by renting instead of buying outfits you'll only wear once.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#775a19" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M2 22C2 22 8 21 12 17C16 13 22 6 22 2C22 2 15 2 11 6C7 10 6 16 6 16L2 22Z" />
        <path d="M12 12c2 2 5 3 5 3" />
        <path d="M7 17c2 2 3 5 3 5" />
      </svg>
    ),
  },
  {
    title: "Access to Luxury",
    description: "Wear high-end designer labels for up to 90% less than the retail price.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#775a19" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M19 11.5c0-4.14-3.36-7.5-7.5-7.5S4 7.36 4 11.5c0 1.7.56 3.26 1.5 4.5v2.5a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-1h4v1a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 1.5-1.5v-2.5c.94-1.24 1.5-2.8 1.5-4.5Z" />
        <path d="M21 10.5h-2" />
        <path d="M12 2v2.5" />
        <circle cx="8.5" cy="10.5" r="1" fill="#775a19" />
      </svg>
    ),
  },
  {
    title: "Professional Dry Cleaning",
    description: "Every garment goes through a 5-step premium cleaning process before it reaches you.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#775a19" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 6a2.5 2.5 0 0 1 4 2" />
        <path d="M2 17.5L12 10l10 7.5A1.5 1.5 0 0 1 21 20H3a1.5 1.5 0 0 1-1-2.5Z" />
      </svg>
    ),
  },
  {
    title: "Secure Deposits",
    description: "Your security deposit is held safely and refunded within 24 hours of successful return.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#775a19" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
        <path d="M12 15v3" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    ),
  },
  {
    title: "Clinically Sanitized",
    description: "Every outfit undergoes a 5-step medical-grade dry cleaning and UV-C sterilization process before it reaches you.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#775a19" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9 10h6v10a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V10Z" />
        <path d="M12 6v4" />
        <path d="M10 6h4" />
        <path d="M12 3a1 1 0 0 1 1 1v2h-2V4a1 1 0 0 1 1-1Z" />
        <path d="M10 15h4" />
        <path d="M12 13v4" />
      </svg>
    ),
  },
];

export default function WhyRentVastra() {
  return (
    <section className="w-full py-16 md:py-24 bg-[#FAF7F5] overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Title & Value Props */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-[#001410] tracking-tight mb-8">
              Why Rent Vastra?
            </h2>
            
            <div className="space-y-6">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1 text-[#775a19]">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-sans text-base md:text-lg font-semibold text-[#001410]">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base font-sans text-[#414846] mt-1 leading-relaxed max-w-[580px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column: Flatlay Image */}
          <div className="lg:col-span-5 relative w-full aspect-[4/3] md:aspect-[6/5] lg:aspect-square overflow-hidden rounded-2xl shadow-sm">
            <Image
              src="/images/home/why-rent-vastra-home.jpg"
              alt="Rent Vastra Lehenga and Packaging"
              fill
              className="object-cover object-center"
              sizes="(max-w-768px) 100vw, 40vw"
              priority
            />
          </div>
          
        </div>
      </div>
    </section>
  );
}
