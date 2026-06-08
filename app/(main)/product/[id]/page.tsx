"use client";

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

// Mock Product Data
const MOCK_PRODUCT = {
  id: 1,
  brand: "SABYASACHI HERITAGE",
  name: "Emerald Banarasi Heritage Lehenga",
  rentalPrice: "14,500",
  retailPrice: "4,20,000",
  securityDeposit: "5,000",
  totalPayable: "19,500",
  mainImage: "/images/home/why-rent-vastra-home.jpg",
  gallery: [
    "/images/home/why-rent-vastra-home.jpg",
    "/images/home/trending-home-2.jpg",
    "/images/home/trending-home-3.jpg",
    "/images/home/bag_midnight_lehenga.png"
  ]
};

// Mock "Complete the Look" Accessories
const ACCESSORIES = [
  {
    id: 101,
    name: "Polki Choker Set",
    price: "2,400",
    image: "/images/home/bag_gold_sherwani.png"
  },
  {
    id: 102,
    name: "Embroidered Potli Bag",
    price: "1,100",
    image: "/images/home/occassion_haldi.png"
  },
  {
    id: 103,
    name: "Hand Zari Juttis",
    price: "1,200",
    image: "/images/home/occassion_weddings.png"
  }
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { addToCart } = useCart();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>('S');
  const [activeImage, setActiveImage] = useState<string>(MOCK_PRODUCT.mainImage);
  const [wishlisted, setWishlisted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const createCartItem = () => ({
    id: MOCK_PRODUCT.id,
    title: MOCK_PRODUCT.name,
    designer: "House of Vastra", // Mock designer
    image: MOCK_PRODUCT.mainImage,
    size: selectedSize,
    duration: "4 Days: 14 Oct - 18 Oct", // mock dates
    deposit: parseInt(MOCK_PRODUCT.securityDeposit.replace(/,/g, '')),
    price: parseInt(MOCK_PRODUCT.rentalPrice.replace(/,/g, '')),
  });

  const handleAddToBag = () => {
    addToCart(createCartItem());
    showToast(`${MOCK_PRODUCT.name} added to your bag!`);
  };

  const handleRentNow = () => {
    router.push('/checkout/' + unwrappedParams.id);
  };

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      const parsed = JSON.parse(saved);
      const isWishlisted = parsed.some((i: any) => i.title === MOCK_PRODUCT.name);
      setWishlisted(isWishlisted);
    }
  }, []);

  const toggleWishlist = () => {
    const saved = localStorage.getItem("wishlist");
    let parsed = saved ? JSON.parse(saved) : [];
    
    if (wishlisted) {
      // Remove
      parsed = parsed.filter((i: any) => i.title !== MOCK_PRODUCT.name);
      setWishlisted(false);
    } else {
      // Add
      parsed.push({
        designer: "House of Vastra", // Mock designer
        title: MOCK_PRODUCT.name,
        price: "₹" + MOCK_PRODUCT.rentalPrice,
        duration: "/ 4 days",
        image: MOCK_PRODUCT.mainImage,
        link: `/product/${MOCK_PRODUCT.id}`,
        alt: MOCK_PRODUCT.name,
      });
      setWishlisted(true);
      showToast(`${MOCK_PRODUCT.name} added to your wishlist!`);
    }
    localStorage.setItem("wishlist", JSON.stringify(parsed));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <main className="min-h-screen bg-[#fcf9f8] font-sans pb-32 md:pb-24">
      
      <div className="max-w-[1400px] mx-auto">
        {/* Top Product Split Section */}
        <div className="flex flex-col md:flex-row">
          
          {/* LEFT: Image Gallery */}
          <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col md:flex-row gap-4 p-4 md:p-8">
            {/* Desktop Thumbnails */}
            <div className="hidden md:flex flex-col gap-4 w-[100px] shrink-0">
              {MOCK_PRODUCT.gallery.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 border-2 transition-colors ${activeImage === img ? 'border-[#001410]' : 'border-transparent hover:border-zinc-300'}`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover object-top" sizes="100px" />
                </button>
              ))}
            </div>
            
            {/* Mobile Carousel & Desktop Main Image */}
            <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full relative">
              {MOCK_PRODUCT.gallery.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/5] w-full shrink-0 snap-start bg-zinc-100 overflow-hidden">
                   <Image src={img} alt={`${MOCK_PRODUCT.name} ${idx}`} fill priority={idx === 0} sizes="100vw" className="object-cover object-top" />
                </div>
              ))}
            </div>
            <div className="hidden md:block relative aspect-[3/4] w-full bg-zinc-100 flex-1 overflow-hidden">
               <Image src={activeImage} alt={MOCK_PRODUCT.name} fill priority sizes="60vw" className="object-cover object-top" />
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col p-6 md:p-8 md:pt-16 lg:pr-16">
            
            {/* Brand & Title */}
            <div className="mb-6">
              <span className="text-[10px] md:text-xs font-bold tracking-[0.15em] text-[#A8813C] uppercase mb-2 block">{MOCK_PRODUCT.brand}</span>
              <h1 className="font-serif text-3xl md:text-4xl text-[#001410] leading-tight">{MOCK_PRODUCT.name}</h1>
            </div>

            {/* Pricing & Badge */}
            <div className="flex items-center gap-4 mb-3">
              <div className="font-serif text-2xl font-medium text-[#001410]">₹{MOCK_PRODUCT.rentalPrice} <span className="font-sans text-xs text-zinc-500 font-normal">/ 4 days</span></div>
              <div className="flex items-center gap-1.5 bg-[#f5efe6] px-2.5 py-1 rounded text-[#775a19] text-[10px] font-bold uppercase tracking-wider">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                Authenticity Guaranteed
              </div>
            </div>
            <div className="text-xs text-zinc-500 mb-10 pb-10 border-b border-zinc-200">Retail Value: ₹{MOCK_PRODUCT.retailPrice}</div>

            {/* Rental Period */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] md:text-xs font-bold tracking-wider text-[#001410] uppercase">Select Rental Period</span>
                <span className="text-[10px] md:text-xs text-zinc-500 underline cursor-pointer hover:text-[#001410]">Delivery Timeline</span>
              </div>
              {/* Desktop: 2 inputs. Mobile: 1 input */}
              <div className="hidden md:grid grid-cols-2 gap-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Dec 14, 2024" 
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.value === "" ? (e.target.type = "text") : null)}
                    className="w-full border border-zinc-300 rounded px-4 py-3 text-sm focus:border-[#001410] focus:ring-0 outline-none" 
                  />
                  <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                </div>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Dec 18, 2024" 
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.value === "" ? (e.target.type = "text") : null)}
                    className="w-full border border-zinc-300 rounded px-4 py-3 text-sm focus:border-[#001410] focus:ring-0 outline-none" 
                  />
                  <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                </div>
              </div>
              <div className="md:hidden relative">
                  <input 
                    type="text" 
                    placeholder="Choose your event date..." 
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => (e.target.value === "" ? (e.target.type = "text") : null)}
                    className="w-full border border-zinc-300 rounded px-4 py-3.5 text-sm focus:border-[#001410] focus:ring-0 outline-none" 
                  />
                  <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                  <style jsx>{`input { padding-left: 2.5rem; }`}</style>
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] md:text-xs font-bold tracking-wider text-[#001410] uppercase">Select Size</span>
                <span className="text-[10px] md:text-xs font-bold text-[#775a19] underline cursor-pointer hover:text-[#001410] transition-colors">Find My Fit</span>
              </div>
              <div className="flex gap-2">
                {['S', 'M', 'L', 'XL'].map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border transition-colors ${
                      selectedSize === size 
                        ? 'border-[#001410] bg-[#001410] font-bold text-white' 
                        : 'border-zinc-300 bg-white font-medium text-zinc-600 hover:border-[#001410] hover:text-[#001410]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-[#f5f5f5] p-5 rounded-lg mb-8">
              <div className="flex justify-between text-xs text-zinc-600 mb-2">
                <span>Rental Fee</span>
                <span>₹{MOCK_PRODUCT.rentalPrice}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600 mb-4 pb-4 border-b border-zinc-200">
                <span className="flex items-center gap-1">Security Deposit <svg className="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span>
                <span>₹{MOCK_PRODUCT.securityDeposit} <span className="text-[10px] text-zinc-400">(Refundable)</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#001410]">Total Payable</span>
                <span className="font-serif text-xl font-medium text-[#001410]">₹{MOCK_PRODUCT.totalPayable}</span>
              </div>
            </div>

            {/* Desktop Action Buttons (Hidden on mobile via positioning, shown natively here) */}
            <div className="hidden md:flex items-center gap-3 mb-6">
              <button onClick={handleAddToBag} className="flex-1 border border-[#001410] bg-white text-[#001410] py-4 text-xs font-bold tracking-widest uppercase text-center hover:bg-zinc-50 transition-all">
                Add to Bag
              </button>
              <button onClick={handleRentNow} className="flex-1 bg-[#001410] text-white py-4 text-xs font-bold tracking-widest uppercase text-center hover:bg-[#00261f] transition-all">
                Rent Now
              </button>
              <button 
                onClick={toggleWishlist}
                className={`w-14 h-14 border flex items-center justify-center transition-colors ${wishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-zinc-300 text-[#001410] hover:bg-zinc-50 hover:border-[#001410]'}`}
              >
                <svg className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
              </button>
            </div>
            <p className="hidden md:block text-center text-[10px] text-zinc-500 italic">* Includes professional dry cleaning & minor alterations.</p>

          </div>
        </div>

        {/* Complete the Look Section */}
        <div className="px-6 md:px-8 py-16 md:py-24 border-t border-zinc-200 mt-8 md:mt-12">
          <h2 className="font-serif text-2xl md:text-3xl text-center text-[#001410] mb-10 md:mb-16">
            Stylist's Selection: <span className="italic text-[#50756c]">Complete the Look</span>
          </h2>
          
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-4 md:gap-8 pb-8 no-scrollbar snap-x">
            {ACCESSORIES.map(acc => (
              <div key={acc.id} className="min-w-[70vw] sm:min-w-[50vw] md:min-w-0 flex flex-col group snap-start cursor-pointer">
                <div className="relative aspect-[4/5] w-full bg-zinc-100 overflow-hidden mb-4">
                  <Image src={acc.image} alt={acc.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 70vw, 33vw" />
                </div>
                <h4 className="text-[11px] md:text-xs font-bold text-[#001410] uppercase tracking-wider text-center">{acc.name}</h4>
                <p className="text-[11px] text-zinc-500 text-center mt-1">Rent for ₹{acc.price}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 p-3 z-50 flex items-center gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button 
          onClick={toggleWishlist}
          className={`w-12 h-12 shrink-0 border flex items-center justify-center transition-colors ${wishlisted ? 'border-red-500 bg-red-50 text-red-500' : 'border-zinc-300 text-[#001410] hover:bg-zinc-50'}`}
        >
          <svg className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
        </button>
        <button onClick={handleAddToBag} className="flex-1 border border-[#001410] bg-white text-[#001410] h-12 text-[10px] sm:text-xs font-bold tracking-widest uppercase flex items-center justify-center active:scale-[0.98] transition-transform">
          Add to Bag
        </button>
        <button onClick={handleRentNow} className="flex-1 bg-[#001410] text-white h-12 text-[10px] sm:text-xs font-bold tracking-widest uppercase flex items-center justify-center active:scale-[0.98] transition-transform">
          Rent Now
        </button>
      </div>

      {/* Custom Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-[#001410] text-white px-6 py-4 rounded-md shadow-2xl z-[100] flex items-center gap-3 animate-fade-in-up">
          <div className="w-6 h-6 rounded-full bg-[#FAF2E8] flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#775a19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-sans text-xs md:text-[13px] uppercase font-bold tracking-wider">{toastMessage}</span>
        </div>
      )}

    </main>
  );
}
