import React from "react";

const socialLinks = [
  {
    name: "Instagram",
    url: "https://instagram.com",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "Pinterest",
    url: "https://pinterest.com",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: "https://facebook.com",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        {/* Literal "Face" + "Book" icon representation */}
        {/* Face */}
        <circle cx="8" cy="12" r="5" />
        <circle cx="6.5" cy="10.5" r="0.75" fill="currentColor" />
        <circle cx="9.5" cy="10.5" r="0.75" fill="currentColor" />
        <path d="M6.5 14c.5.5 1.5.5 3 0" />
        
        {/* Book */}
        <path d="M15 8h5v9h-5V8Z" />
        <path d="M15 17h5" />
      </svg>
    ),
  },
];

export default function SocialJourney() {
  return (
    <section className="w-full py-16 md:py-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6 md:px-16 flex flex-col items-center text-center">
        
        {/* Header */}
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-[#001410] tracking-tight">
          Follow Our Journey
        </h2>
        
        <p className="font-sans text-sm md:text-base text-[#5c6462] mt-4 mb-10 max-w-[500px]">
          Join our community of sustainable luxury lovers.
        </p>

        {/* Social Cards Grid */}
        <div className="flex gap-8 justify-center">
          {socialLinks.map((social, idx) => (
            <a
              key={idx}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Rounded Square Badge */}
              <div className="w-14 h-14 rounded-xl border border-zinc-200 flex items-center justify-center text-[#001410] bg-white group-hover:border-[#775a19] group-hover:text-[#775a19] group-hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm">
                {social.icon}
              </div>
              
              {/* Social Name */}
              <span className="mt-3 font-sans text-xs md:text-sm font-medium text-[#5c6462] transition-colors duration-300 group-hover:text-[#775a19]">
                {social.name}
              </span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
