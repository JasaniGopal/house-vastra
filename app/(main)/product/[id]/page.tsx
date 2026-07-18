"use client";

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useRouter } from 'next/navigation';

// Type for our dynamic product
export interface DynamicProduct {
  id: string;
  brand: string;
  name: string;
  baseRentalPrice: number;
  retailPrice: number;
  baseSecurityDeposit: number;
  mainImage: string;
  gallery: string[];
  availableSizes: string[];
}

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
  const [activeImage, setActiveImage] = useState<string>("/images/placeholder.jpg");
  const { wishlistItems, toggleWishlist: contextToggleWishlist } = useWishlist();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showFitModal, setShowFitModal] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [calculatedDays, setCalculatedDays] = useState(4);
  const [product, setProduct] = useState<DynamicProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      if (diffTime > 0) {
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setCalculatedDays(Math.max(diffDays, 4));
      } else {
        setCalculatedDays(4);
      }
    } else {
      setCalculatedDays(4);
    }
  }, [startDate, endDate]);

  const currentRentalPrice = product ? Math.round((product.baseRentalPrice / 4) * calculatedDays) : 0;
  const currentDeposit = product ? product.baseSecurityDeposit : 0;
  const currentTotal = currentRentalPrice + currentDeposit;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${unwrappedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          // Derive deposits and totals based on business logic
          const rental = data.rentalPrice4Day || 0;
          const deposit = data.securityDeposit || Math.round(rental * 0.3); // Use admin-set deposit or fallback to 30%
          const retail = data.retailValue || (rental * 10);
          const sizesArray = data.sizes ? data.sizes.split(',').map((s: string) => s.trim()).filter(Boolean) : ['S'];
          
          setProduct({
            id: data.id,
            brand: data.vendor?.boutiqueName || "Boutique",
            name: data.name,
            baseRentalPrice: rental,
            retailPrice: retail,
            baseSecurityDeposit: deposit,
            mainImage: data.images?.[0]?.url || "/images/placeholder.jpg",
            gallery: data.images?.map((img: any) => img.url) || ["/images/placeholder.jpg"],
            availableSizes: sizesArray
          });
          setActiveImage(data.images?.[0]?.url || "/images/placeholder.jpg");
          if (sizesArray.length > 0) setSelectedSize(sizesArray[0]);
        } else {
          showToast("Product not found");
        }
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [unwrappedParams.id]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const createCartItem = () => {
    if (!product) return null;
    
    // Format duration string based on selected dates or fallback
    let durationStr = "4 Days (Dates pending)";
    if (startDate && endDate) {
      const s = new Date(startDate);
      const e = new Date(endDate);
      const formatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
      durationStr = `${calculatedDays} Days: ${formatter.format(s)} - ${formatter.format(e)}`;
    }

    return {
      id: Date.now().toString(),
      productId: product.id,
      title: product.name,
      designer: product.brand,
      image: product.mainImage,
      size: selectedSize,
      duration: durationStr,
      deposit: currentDeposit,
      price: currentRentalPrice,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };
  };

  const handleAddToBag = async () => {
    const item = createCartItem();
    if (item) {
      try {
        const res = await fetch(`/api/products/${unwrappedParams.id}/availability?start=${item.startDate}&end=${item.endDate}`);
        const data = await res.json();
        if (!data.available) {
          showToast("This item is not available for the selected dates.");
          return;
        }
        addToCart(item);
        showToast(`${product?.name} added to your bag!`);
      } catch (err) {
        showToast("Error checking availability. Please try again.");
      }
    }
  };

  const handleRentNow = async () => {
    if (!startDate || !endDate) {
      showToast("Please select your rental dates first");
      return;
    }
    
    try {
      const res = await fetch(`/api/products/${unwrappedParams.id}/availability?start=${startDate}&end=${endDate}`);
      const data = await res.json();
      if (!data.available) {
        showToast("This item is not available for the selected dates.");
        return;
      }
      
      const query = new URLSearchParams();
      query.set('start', startDate);
      query.set('end', endDate);
      if (selectedSize) query.set('size', selectedSize);
      router.push(`/checkout/${unwrappedParams.id}?${query.toString()}`);
    } catch (err) {
      showToast("Error checking availability. Please try again.");
    }
  };

  const wishlisted = product ? wishlistItems.some(i => i.id === product.id) : false;

  const toggleWishlist = () => {
    if (!product) return;
    contextToggleWishlist({
      id: product.id,
      brand: product.brand,
      name: product.name,
      rentalPrice: product.baseRentalPrice.toString(),
      retailPrice: product.retailPrice.toString(),
      image: product.mainImage
    });
    if (!wishlisted) {
      showToast(`${product.name} added to your wishlist!`);
    } else {
      showToast(`${product.name} removed from your wishlist!`);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fcf9f8] flex items-center justify-center">
        <h2 className="font-serif text-2xl text-[#001410]">Loading Product...</h2>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#fcf9f8] flex flex-col items-center justify-center p-8">
        <h2 className="font-serif text-3xl text-[#001410] mb-4">Piece Not Found</h2>
        <p className="text-zinc-500 mb-8">This piece may have been removed or is currently unavailable.</p>
        <Link href="/collections" className="bg-[#001410] text-white px-8 py-4 font-bold text-xs uppercase tracking-wider">Back to Collections</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcf9f8] font-sans pb-32 md:pb-24">
      
      <div className="max-w-[1400px] mx-auto">
        {/* Top Product Split Section */}
        <div className="flex flex-col md:flex-row">
          
          {/* LEFT: Image Gallery */}
          <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col md:flex-row gap-4 p-4 md:p-8">
            {/* Desktop Thumbnails */}
            <div className="hidden md:flex flex-col gap-4 w-[100px] shrink-0">
              {product.gallery.map((img, idx) => (
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
              {product.gallery.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/5] w-full shrink-0 snap-start bg-zinc-100 overflow-hidden">
                   <Image src={img} alt={`${product.name} ${idx}`} fill priority={idx === 0} sizes="100vw" className="object-cover object-top" />
                </div>
              ))}
            </div>
            <div className="hidden md:block relative aspect-[3/4] w-full bg-zinc-100 flex-1 overflow-hidden">
               <Image src={activeImage} alt={product.name} fill priority sizes="60vw" className="object-cover object-top" />
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col p-6 md:p-8 md:pt-16 lg:pr-16">
            
            {/* Brand & Title */}
            <div className="mb-6">
              <h1 className="font-serif text-3xl md:text-4xl text-[#001410] leading-tight">{product.name}</h1>
            </div>

            {/* Pricing & Badge */}
            <div className="flex items-center gap-4 mb-3">
              <div className="font-serif text-2xl font-medium text-[#001410]">₹{currentRentalPrice.toLocaleString()}</div>
              <div className="flex items-center gap-1.5 bg-[#f5efe6] px-2.5 py-1 rounded text-[#775a19] text-[10px] font-bold uppercase tracking-wider">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                Authenticity Guaranteed
              </div>
            </div>
            <div className="text-xs text-zinc-500 mb-10 pb-10 border-b border-zinc-200">Retail Value: ₹{product.retailPrice.toLocaleString()}</div>

            {/* Rental Period */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] md:text-xs font-bold tracking-wider text-[#001410] uppercase">Select Rental Period</span>
                <button onClick={() => setShowDeliveryModal(true)} className="text-[10px] md:text-xs text-zinc-500 underline cursor-pointer hover:text-[#001410] outline-none">Delivery Timeline</button>
              </div>
              {/* From & To Date Inputs (Responsive) */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="relative">
                  <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider z-10">From</span>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-zinc-300 rounded px-3 md:px-4 py-3 text-sm focus:border-[#001410] focus:ring-0 outline-none" 
                  />
                  <svg className="hidden md:block w-4 h-4 absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 left-2 bg-white px-1 text-[10px] text-zinc-500 font-bold uppercase tracking-wider z-10">To</span>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-zinc-300 rounded px-3 md:px-4 py-3 text-sm focus:border-[#001410] focus:ring-0 outline-none" 
                  />
                  <svg className="hidden md:block w-4 h-4 absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                </div>
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] md:text-xs font-bold tracking-wider text-[#001410] uppercase">Select Size</span>
                <button onClick={() => setShowFitModal(true)} className="text-[10px] md:text-xs font-bold text-[#775a19] underline cursor-pointer hover:text-[#001410] transition-colors outline-none">Find My Fit</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-3 h-12 border transition-colors ${
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
                <span>Rental Fee ({calculatedDays} Days)</span>
                <span>₹{currentRentalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600 mb-4 pb-4 border-b border-zinc-200">
                <span className="flex items-center gap-1">Security Deposit <svg className="w-3 h-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></span>
                <span>₹{currentDeposit.toLocaleString()} <span className="text-[10px] text-zinc-400">(Refundable)</span></span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#001410]">Total Payable</span>
                <span className="font-serif text-xl font-medium text-[#001410]">₹{currentTotal.toLocaleString()}</span>
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

      {/* DELIVERY TIMELINE MODAL */}
      {showDeliveryModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001410]/40 backdrop-blur-sm" onClick={() => setShowDeliveryModal(false)}></div>
          <div className="bg-white w-full max-w-md rounded-2xl p-6 md:p-8 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowDeliveryModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-[#001410]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="font-serif text-2xl text-[#001410] mb-6 border-b border-zinc-100 pb-4">Delivery Timeline</h3>
            <div className="flex flex-col gap-6 relative">
              {/* Line behind dots */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[#E8D8BA]"></div>
              
              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[#001410] flex items-center justify-center shrink-0 border-4 border-white mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#001410] uppercase tracking-wider mb-1">Order Placed</h4>
                  <p className="text-xs text-zinc-500">Your rental is confirmed and scheduled for prep.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[#001410] flex items-center justify-center shrink-0 border-4 border-white mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#001410] uppercase tracking-wider mb-1">Custom Tailoring</h4>
                  <p className="text-xs text-zinc-500">Outfit altered to your measurement profile.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[#FAF2E8] border border-[#A8813C] flex items-center justify-center shrink-0 mt-0.5"></div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-500 uppercase tracking-wider mb-1">Dispatch & Delivery</h4>
                  <p className="text-xs text-zinc-500">Delivered directly to you 1-2 days before your event.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-[#FAF2E8] border border-[#A8813C] flex items-center justify-center shrink-0 mt-0.5"></div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-500 uppercase tracking-wider mb-1">Return Pickup</h4>
                  <p className="text-xs text-zinc-500">Scheduled pickup from your address on the return date.</p>
                </div>
              </div>
            </div>
            <button onClick={() => setShowDeliveryModal(false)} className="w-full mt-8 bg-[#001410] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] transition-all">
              Got it
            </button>
          </div>
        </div>
      )}

      {/* FIND MY FIT MODAL */}
      {showFitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001410]/40 backdrop-blur-sm" onClick={() => setShowFitModal(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 md:p-8 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowFitModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-[#001410]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="font-serif text-2xl text-[#001410] mb-2">Size Guide</h3>
            <p className="text-xs text-zinc-500 mb-6">Measurements are in inches. Our outfits are tailored exactly to your measurements.</p>
            
            <div className="overflow-x-auto border border-zinc-200 rounded-xl mb-6">
              <table className="w-full text-left text-xs text-[#001410]">
                <thead className="bg-zinc-50 border-b border-zinc-200 uppercase tracking-wider text-[10px] font-bold text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Size</th>
                    <th className="px-4 py-3">Bust</th>
                    <th className="px-4 py-3">Waist</th>
                    <th className="px-4 py-3">Hip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold">XS</td><td className="px-4 py-3">32"</td><td className="px-4 py-3">26"</td><td className="px-4 py-3">36"</td></tr>
                  <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold">S</td><td className="px-4 py-3">34"</td><td className="px-4 py-3">28"</td><td className="px-4 py-3">38"</td></tr>
                  <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold">M</td><td className="px-4 py-3">36"</td><td className="px-4 py-3">30"</td><td className="px-4 py-3">40"</td></tr>
                  <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold">L</td><td className="px-4 py-3">38"</td><td className="px-4 py-3">32"</td><td className="px-4 py-3">42"</td></tr>
                  <tr className="hover:bg-zinc-50"><td className="px-4 py-3 font-bold">XL</td><td className="px-4 py-3">40"</td><td className="px-4 py-3">34"</td><td className="px-4 py-3">44"</td></tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#FAF2E8] border border-[#E8D8BA] p-4 rounded-xl flex items-start gap-3">
               <svg className="w-5 h-5 text-[#A8813C] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
               <div>
                 <h4 className="font-bold text-xs uppercase tracking-wider text-[#001410] mb-1">Want a Perfect Fit?</h4>
                 <p className="text-[11px] text-[#414846] mb-3">Update your profile with exact measurements and we'll tailor it before dispatch.</p>
                 <Link href="/profile/measurements" className="text-[10px] font-bold text-[#001410] bg-white border border-[#001410] px-4 py-2 rounded uppercase tracking-wider hover:bg-[#001410] hover:text-white transition-colors">
                   Update Measurement Profile
                 </Link>
               </div>
            </div>
          </div>
        </div>
      )}

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
