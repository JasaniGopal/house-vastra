"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface CartItem {
  id: number;
  title: string;
  designer: string;
  size?: string;
  image: string;
  duration: string;
  deposit: number;
  price: number;
}

export default function CheckoutPage() {
  const { cartItems: items, removeFromCart, clearCart } = useCart();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDelete = (id: number) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    setIsCheckoutLoading(true);
    setTimeout(() => {
      setIsCheckoutLoading(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const totalDeposit = items.reduce((acc, item) => acc + item.deposit, 0);
  const deliveryFee = items.length > 0 ? 450 : 0;
  const grandTotal = subtotal + totalDeposit + deliveryFee;

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-sans flex flex-col justify-between">
      
      {/* Header Bar */}
      <header className="w-full bg-white border-b border-[#c1c8c5]/30 sticky top-0 z-30">
        <div className="mx-auto max-w-[1280px] px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#001410] hover:text-[#775a19] transition-colors font-semibold text-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to Home</span>
          </Link>

          <h1 className="font-serif text-xl md:text-2xl font-bold text-[#001410]">
            Your Bag
          </h1>

          <div className="relative p-1.5 text-[#001410]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            {items.length > 0 && (
              <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#775a19] text-[9px] font-bold text-white font-sans">
                {items.length}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <main className="flex-grow mx-auto max-w-[1280px] w-full px-6 py-8 md:py-12 flex flex-col justify-center">
        
        {isSuccess ? (
          <div className="max-w-[500px] mx-auto w-full bg-white p-8 md:p-12 rounded-2xl shadow-sm text-center border border-[#001410]/5">
            <div className="w-16 h-16 rounded-full bg-[#c6ede2]/60 flex items-center justify-center mx-auto mb-6 text-[#001410]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#001410] mb-3">Booking Confirmed!</h2>
            <p className="font-sans text-sm md:text-base text-[#5c6462] leading-relaxed mb-8">
              Thank you for renting with Rent Vastra. Your luxury garments have been reserved and are being prepared under clinical standards.
            </p>
            <Link
              href="/"
              className="block w-full bg-[#001410] text-white py-3.5 rounded-md font-sans font-semibold text-sm hover:bg-[#00261f] active:scale-[0.98] transition-all text-center"
            >
              Back to Home
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="max-w-[420px] mx-auto w-full text-center py-12">
            <svg className="w-16 h-16 mx-auto text-zinc-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <h2 className="font-serif text-2xl font-bold text-[#001410] mb-2">Your Bag is Empty</h2>
            <p className="font-sans text-sm text-[#5c6462] leading-relaxed mb-8">
              Explore our collection of heritage designer ethnic wear and book your dream outfit.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#001410] text-white py-3.5 px-8 rounded-md font-sans font-semibold text-sm hover:bg-[#00261f] transition-all"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Bag Items list */}
            <div className="lg:col-span-7 space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#c1c8c5]/25 rounded-xl p-4 md:p-6 shadow-sm relative transition-all duration-300"
                >
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 cursor-pointer transition-colors p-1 z-10 bg-white/50 sm:bg-transparent rounded-full backdrop-blur-sm sm:backdrop-blur-none"
                    aria-label={`Remove ${item.title} from bag`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  <div className="flex flex-row gap-4 sm:gap-6">
                    {/* Item Image */}
                    <div className="relative w-[100px] sm:w-[150px] aspect-[4/5] shrink-0 rounded-lg overflow-hidden bg-[#FAF2E8]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 640px) 100px, 150px"
                        priority
                      />
                    </div>

                    {/* Details Column */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        {/* Title & Designer */}
                        <h3 className="font-serif text-[15px] sm:text-lg md:text-xl font-bold text-[#001410] pr-6 sm:pr-8 leading-tight">
                          {item.title}
                        </h3>
                        <p className="font-sans text-[10px] sm:text-xs md:text-sm text-zinc-400 font-semibold uppercase tracking-wider mt-1">
                          {item.designer} {item.size && `• ${item.size}`}
                        </p>

                        {/* Rental Period */}
                        <div className="flex items-center gap-2 mt-4 text-[#414846] text-xs md:text-sm font-sans">
                          <svg className="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                          </svg>
                          <span>{item.duration}</span>
                          <button className="text-[#775a19] font-bold text-xs md:text-sm hover:underline ml-auto cursor-pointer">
                            Edit Dates
                          </button>
                        </div>

                        {/* Security Deposit Info Box */}
                        <div className="mt-4 flex items-start gap-2.5 bg-[#FAF2E8] p-3 rounded-lg text-xs md:text-sm border border-[#775a19]/10">
                          <svg className="w-4.5 h-4.5 text-[#775A19] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                          </svg>
                          <div>
                            <span className="font-bold text-[#775A19]">Security Deposit</span>
                            <p className="text-zinc-500 mt-0.5">₹{item.deposit.toLocaleString()} • Fully refundable on return</p>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Block */}
                      <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-6">
                        <span className="text-xs md:text-sm font-sans text-zinc-400 uppercase font-semibold">
                          Rental Price
                        </span>
                        <span className="font-serif text-lg md:text-xl font-bold text-[#001410]">
                          ₹{item.price.toLocaleString()}
                        </span>
                      </div>

                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Summary Card */}
              <div className="bg-[#EAE8E5] p-6 md:p-8 rounded-2xl shadow-sm border border-zinc-300/10">
                <h2 className="font-serif text-xl md:text-2xl font-bold text-[#001410] mb-6 border-b border-zinc-300/50 pb-4">
                  Order Summary
                </h2>
                
                <div className="space-y-4 text-sm md:text-base font-sans text-[#414846]">
                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#001410]">₹{subtotal.toLocaleString()}</span>
                  </div>

                  {/* Security Deposit Info */}
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <span>Security Deposit</span>
                      <svg className="w-3.5 h-3.5 text-zinc-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                    </span>
                    <span className="font-semibold text-[#001410]">₹{totalDeposit.toLocaleString()}</span>
                  </div>

                  {/* Delivery Fee */}
                  <div className="flex justify-between border-b border-zinc-300/50 pb-4">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-[#001410]">₹{deliveryFee.toLocaleString()}</span>
                  </div>

                  {/* Grand Total */}
                  <div className="pt-4 flex flex-col justify-between items-stretch">
                    <div className="flex justify-between items-baseline">
                      <span className="font-serif text-lg md:text-xl font-bold text-[#001410]">Grand Total</span>
                      <div className="text-right">
                        <span className="font-serif text-2xl md:text-3xl font-bold text-[#001410]">
                          ₹{grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] md:text-xs text-zinc-500 font-sans text-right mt-1 leading-normal block">
                      Incl. all taxes and refundable fees
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckoutLoading}
                  className="w-full bg-[#001410] text-white py-4 rounded-md font-sans font-semibold text-sm hover:bg-[#00261f] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 mt-8 shadow-md"
                >
                  <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>{isCheckoutLoading ? "Processing..." : "Secure Checkout"}</span>
                </button>

                {/* Mini payment logos */}
                <div className="flex items-center justify-center gap-4 mt-6 text-zinc-400">
                  {/* Visa Card */}
                  <svg className="w-7 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 .75v18.5c-4.83 0-8.75-3.92-8.75-8.75S8.17 2.75 13 2.75z" fillOpacity="0.2"/>
                    <rect x="2" y="6" width="20" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {/* Credit Card */}
                  <svg className="w-7 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="5" width="20" height="14" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                    <line x1="6" y1="15" x2="10" y2="15"/>
                  </svg>
                  {/* Secure Padlock */}
                  <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <rect x="5" y="11" width="14" height="10" rx="2" ry="2"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 018 0v4"/>
                  </svg>
                </div>

              </div>

              {/* Trust badges footer */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-[#c1c8c5]/20 p-4 rounded-xl flex items-center gap-3 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[#FAF2E8] flex items-center justify-center text-[#775a19] shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#001410] leading-none block">Authenticity</span>
                    <span className="text-[10px] text-zinc-500 leading-normal mt-0.5 block">Guaranteed</span>
                  </div>
                </div>

                <div className="bg-white border border-[#c1c8c5]/20 p-4 rounded-xl flex items-center gap-3 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[#FAF2E8] flex items-center justify-center text-[#775a19] shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#001410] leading-none block">Eco-friendly</span>
                    <span className="text-[10px] text-zinc-500 leading-normal mt-0.5 block">Clean</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
