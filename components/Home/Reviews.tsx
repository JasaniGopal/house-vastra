"use client";

import React, { useRef, useState } from "react";

const testimonials = [
  {
    quote: '"Rented a Sabyasachi for my sister\'s wedding. The outfit was immaculate, and the fit was perfect. The entire process was seamless!"',
    name: "Ananya R.",
    location: "Mumbai",
    initial: "A",
  },
  {
    quote: '"Saved me a fortune! The sherwani looked brand new and the customer service was incredibly helpful when I had questions about sizing."',
    name: "Rahul M.",
    location: "Delhi",
    initial: "R",
  },
  {
    quote: '"Such a brilliant concept. The packaging was beautiful and felt so luxurious. I got so many compliments at the cocktail party."',
    name: "Sneha P.",
    location: "Bangalore",
    initial: "S",
  },
  {
    quote: '"The outfit fit like a glove, and returning it was as simple as leaving it with the concierge. Truly a five-star experience."',
    name: "Priyanka K.",
    location: "Hyderabad",
    initial: "P",
  },
  {
    quote: '"Outstanding quality and craftsmanship. It was dry-cleaned to pristine clinical standards. I will definitely rent again!"',
    name: "Vikram S.",
    location: "Pune",
    initial: "V",
  },
  {
    quote: '"Absolutely stunning Banarasi lehenga. The process was stress-free and the security deposit was refunded within hours of return."',
    name: "Aditi M.",
    location: "Kolkata",
    initial: "A",
  },
];

export default function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft } = scrollRef.current;
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    
    const children = scrollRef.current.children;
    if (!children || children.length === 0) return;
    
    let currentCardIdx = 0;
    let minDiff = Infinity;
    
    for (let i = 0; i < children.length; i++) {
      const el = children[i] as HTMLElement;
      const diff = Math.abs(el.offsetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        currentCardIdx = i;
      }
    }
    
    let dotIndex = 0;
    if (isDesktop) {
      // On desktop:
      // Card 0, 1 -> Page 0 (Dot 0)
      // Card 2 -> Page 1 (Dot 1)
      // Card 3, 4, 5 -> Page 2 (Dot 2)
      if (currentCardIdx <= 1) dotIndex = 0;
      else if (currentCardIdx === 2) dotIndex = 1;
      else dotIndex = 2;
    } else {
      // On mobile/tablet:
      // Card 0, 1 -> Page 0
      // Card 2, 3 -> Page 1
      // Card 4, 5 -> Page 2
      dotIndex = Math.min(Math.floor(currentCardIdx / 2), 2);
    }
    setActiveIndex(dotIndex);
  };

  const scrollToPage = (dotIndex: number) => {
    if (!scrollRef.current) return;
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    
    let targetCardIndex = 0;
    if (isDesktop) {
      if (dotIndex === 0) targetCardIndex = 0;
      else if (dotIndex === 1) targetCardIndex = 2; // Slides to display Card 2, 3, 4
      else targetCardIndex = 3; // Slides to display Card 3, 4, 5
    } else {
      targetCardIndex = dotIndex * 2; // Slides to Card 0, 2, or 4
    }
    
    const children = scrollRef.current.children;
    const idx = Math.min(targetCardIndex, testimonials.length - 1);
    
    if (children && children[idx]) {
      const targetEl = children[idx] as HTMLElement;
      scrollRef.current.scrollTo({
        left: targetEl.offsetLeft,
        behavior: "smooth",
      });
      setActiveIndex(dotIndex);
    }
  };

  return (
    <section className="w-full py-16 md:py-24 bg-[#EAE8E5] overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6 md:px-16">
        
        {/* Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-[#001410] tracking-tight">
            Loved by Our Clients
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          
          {/* Testimonials Scroll Track */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-6 pb-4 scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="flex-none w-[90%] sm:w-[48%] lg:w-[31.8%] snap-start snap-always bg-white p-8 md:p-10 rounded-xl shadow-sm flex flex-col justify-between"
              >
                {/* Top part: Stars and Quote */}
                <div>
                  {/* 5 Stars */}
                  <div className="flex gap-1 mb-6 text-[#775a19]">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4.5 h-4.5"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="font-sans text-sm md:text-base text-[#1c2422] leading-relaxed mb-8">
                    {t.quote}
                  </p>
                </div>

                {/* Bottom part: Avatar and Info */}
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-11 h-11 rounded-lg bg-[#E8E7E5] flex items-center justify-center text-[#001410] font-sans font-semibold text-lg">
                    {t.initial}
                  </div>
                  <div>
                    <h4 className="font-sans text-sm md:text-base font-bold text-[#001410]">
                      {t.name}
                    </h4>
                    <p className="font-sans text-xs md:text-sm text-[#5c6462]">
                      {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Pagination Dots (Exactly 3 dots, functional for page-based scrolling) */}
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(3)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToPage(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === idx ? "bg-[#775a19]" : "bg-[#c6c4c2]"
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
