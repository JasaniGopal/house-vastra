"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";

const getProductById = (id: string) => {
  return {
    id: parseInt(id) || 1,
    title: "Emerald Banarasi Heritage Lehenga",
    designer: "Sabyasachi",
    image: "/images/home/why-rent-vastra-home.jpg",
    duration: "4 Days: 14 Oct - 18 Oct",
    deposit: 5000,
    price: 14500,
  };
};

export default function DirectCheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const item = getProductById(unwrappedParams.id);
  const items = [item];
  
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("card");

  const handleCheckout = () => {
    setIsCheckoutLoading(true);
    setTimeout(() => {
      setIsCheckoutLoading(false);
      setIsSuccess(true);
    }, 2000);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const totalDeposit = items.reduce((acc, item) => acc + item.deposit, 0);
  // Delivery fee not in screenshot summary, so omitted to match design exactly
  const grandTotal = subtotal + totalDeposit;

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-sans flex items-center justify-center p-6">
        <div className="max-w-[500px] w-full bg-white p-8 md:p-12 rounded-sm shadow-xl text-center border border-[#001410]/5">
          <div className="w-20 h-20 rounded-full bg-[#001410] flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#001410] mb-3">Order Confirmed</h2>
          <p className="font-sans text-[#5c6462] leading-relaxed mb-8">
            Thank you for choosing Rent Vastra. Your luxury garments have been reserved and will be delivered to you shortly.
          </p>
          <Link
            href="/"
            className="block w-full bg-[#001410] text-white py-4 rounded-sm font-sans font-bold text-sm tracking-widest uppercase hover:bg-[#00261f] transition-all text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-sans">
      {/* Header Bar */}
      <header className="w-full bg-white border-b border-[#c1c8c5]/30 sticky top-0 z-30">
        <div className="mx-auto max-w-[1280px] px-4 md:px-16 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-tight text-[#001410] hover:text-[#00261f] transition-colors"
          >
            Rent Vastra
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs md:text-sm font-bold tracking-wider text-[#414846] hover:text-[#775a19] transition-colors uppercase"
          >
            Cancel
          </Link>
        </div>
      </header>

      {/* Main Grid */}
      <main className="mx-auto max-w-[1280px] px-4 md:px-16 py-8 md:py-12">
        {items.length === 0 ? (
          <div className="max-w-[420px] mx-auto w-full text-center py-24">
            <svg className="w-16 h-16 mx-auto text-zinc-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <h2 className="font-serif text-2xl font-bold text-[#001410] mb-2">Your Bag is Empty</h2>
            <p className="font-sans text-sm text-[#5c6462] leading-relaxed mb-8">
              Explore our collection of heritage designer ethnic wear and book your dream outfit.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#001410] text-white py-4 px-8 rounded-sm font-sans font-bold text-xs tracking-widest uppercase hover:bg-[#00261f] transition-all"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT COLUMN: Address & Payment */}
            <div className="lg:col-span-7 w-full flex flex-col gap-10">
              
              {/* Delivery Address */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-serif text-xl md:text-2xl font-bold text-[#001410]">1. Delivery Address</h2>
                  <button className="text-sm font-bold text-[#775a19] hover:underline">Change</button>
                </div>
                
                <div className="bg-[#f5f3f0] p-6 rounded-sm border border-black/5 flex gap-4 items-start">
                  <svg className="w-5 h-5 text-[#001410] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div>
                    <span className="block font-bold text-[#001410] mb-1">Ananya Sharma</span>
                    <span className="block text-sm text-[#414846] leading-relaxed">
                      Flat 402, Sea View Apartments,<br />
                      Juhu Tara Road, Mumbai,<br />
                      Maharashtra 400049
                    </span>
                    <span className="block text-sm text-[#414846] mt-2">Phone: +91 98XXX XXXXX</span>
                  </div>
                </div>
              </section>

              {/* Payment Method */}
              <section>
                <h2 className="font-serif text-xl md:text-2xl font-bold text-[#001410] mb-4">2. Payment Method</h2>
                
                <div className="border border-black/10 rounded-sm overflow-hidden bg-white shadow-sm">
                  
                  {/* Card Option */}
                  <div className={`border-b border-black/5 transition-colors ${selectedPayment === 'card' ? 'bg-white' : 'hover:bg-zinc-50'}`}>
                    <label className="flex items-center gap-4 p-5 cursor-pointer">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'card' ? 'border-[#001410]' : 'border-zinc-300'}`}>
                        {selectedPayment === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[#001410]" />}
                      </div>
                      <input type="radio" className="hidden" checked={selectedPayment === 'card'} onChange={() => setSelectedPayment('card')} />
                      <span className="font-sans font-bold text-sm text-[#001410] uppercase tracking-wider flex-1">Credit / Debit Card</span>
                      <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                    </label>
                    
                    {/* Expanded Card Form */}
                    <div className={`overflow-hidden transition-all duration-300 px-5 ${selectedPayment === 'card' ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Card Number</label>
                          <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="w-full border border-black/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#001410] transition-colors font-mono placeholder:font-sans" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Expiry Date</label>
                            <input type="text" placeholder="MM / YY" className="w-full border border-black/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#001410] transition-colors" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">CVV</label>
                            <input type="text" placeholder="***" className="w-full border border-black/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#001410] transition-colors font-mono placeholder:font-sans" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* UPI Option */}
                  <div className={`border-b border-black/5 transition-colors ${selectedPayment === 'upi' ? 'bg-white' : 'hover:bg-zinc-50'}`}>
                    <label className="flex items-center gap-4 p-5 cursor-pointer">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'upi' ? 'border-[#001410]' : 'border-zinc-300'}`}>
                        {selectedPayment === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-[#001410]" />}
                      </div>
                      <input type="radio" className="hidden" checked={selectedPayment === 'upi'} onChange={() => setSelectedPayment('upi')} />
                      <div className="flex-1">
                        <span className="font-sans font-bold text-sm text-[#001410] uppercase tracking-wider block">UPI (Google Pay, PhonePe)</span>
                        {/* Mock UPI badges */}
                        <div className="flex gap-2 mt-2">
                           <span className="px-2 py-0.5 bg-zinc-100 text-[10px] font-bold text-zinc-500 rounded-sm">GPay</span>
                           <span className="px-2 py-0.5 bg-zinc-100 text-[10px] font-bold text-zinc-500 rounded-sm">BHIM</span>
                           <span className="px-2 py-0.5 bg-zinc-100 text-[10px] font-bold text-zinc-500 rounded-sm">Paytm</span>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                      </svg>
                    </label>
                  </div>

                  {/* Net Banking Option */}
                  <div className={`transition-colors ${selectedPayment === 'netbanking' ? 'bg-white' : 'hover:bg-zinc-50'}`}>
                    <label className="flex items-center gap-4 p-5 cursor-pointer">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'netbanking' ? 'border-[#001410]' : 'border-zinc-300'}`}>
                        {selectedPayment === 'netbanking' && <div className="w-2.5 h-2.5 rounded-full bg-[#001410]" />}
                      </div>
                      <input type="radio" className="hidden" checked={selectedPayment === 'netbanking'} onChange={() => setSelectedPayment('netbanking')} />
                      <span className="font-sans font-bold text-sm text-[#001410] uppercase tracking-wider flex-1">Net Banking</span>
                      <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                      </svg>
                    </label>
                  </div>

                </div>
              </section>

              {/* Trust Badges bottom left */}
              <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FAF2E8] flex items-center justify-center text-[#775a19]">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-[#001410] uppercase tracking-wider">Secure Escrow</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FAF2E8] flex items-center justify-center text-[#775a19]">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <rect x="5" y="11" width="14" height="10" rx="2" ry="2"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 018 0v4"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-[#001410] uppercase tracking-wider">SSL Encrypted</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Rental Summary */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-white lg:sticky lg:top-24 shadow-2xl border border-black/5 rounded-sm overflow-hidden">
                <div className="p-6 md:p-8">
                  <h2 className="font-serif text-2xl font-bold text-[#001410] mb-6 border-b border-black/5 pb-4">
                    Rental Summary
                  </h2>
                  
                  {items.map((item) => (
                    <div key={item.id} className="mb-8 last:mb-0 border-b border-black/5 last:border-0 pb-8 last:pb-0">
                      {/* Full Width Image like Screenshot */}
                      <div className="relative w-full aspect-[4/5] bg-[#FAF2E8] mb-6 rounded-sm overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover object-top"
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          priority
                        />
                      </div>
                      
                      <h3 className="font-serif text-xl md:text-2xl font-bold text-[#001410] mb-3 leading-tight">
                        {item.title}
                      </h3>
                      
                      {/* Authenticity Badge */}
                      <div className="inline-flex items-center gap-1.5 bg-[#FAF2E8] px-3 py-1.5 rounded-full text-[#775a19] text-[9px] font-bold uppercase tracking-wider mb-6">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                        Authenticity Guaranteed
                      </div>
                      
                      {/* Dates & Size */}
                      <div className="flex justify-between items-center text-[#414846] mb-6">
                        <div>
                          <span className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Rental Dates</span>
                          <span className="font-bold text-sm text-[#001410]">{item.duration}</span>
                        </div>
                        <svg className="w-5 h-5 text-[#775a19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                        </svg>
                      </div>

                      {/* Fees */}
                      <div className="space-y-3 font-sans text-sm border-t border-black/5 pt-6">
                        <div className="flex justify-between text-zinc-600">
                          <span>Rental Fee</span>
                          <span className="text-[#001410] font-medium">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-zinc-600">
                          <span className="flex items-center gap-1.5">
                            Security Deposit
                            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                          </span>
                          <span className="text-[#775a19] font-medium">₹{item.deposit.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Grand Total */}
                  <div className="pt-6 mt-2 border-t border-black/10">
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-serif text-xl font-bold text-[#001410]">Total Payable</span>
                      <span className="font-serif text-2xl font-bold text-[#001410]">
                        ₹{grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span className="block text-[9px] text-zinc-500 mb-8">*Security deposit is fully refundable post-rental inspection.</span>
                    
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckoutLoading}
                      className="w-full bg-[#001410] text-white py-4 font-sans font-bold text-sm tracking-widest uppercase hover:bg-[#00261f] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-xl"
                    >
                      {isCheckoutLoading ? "Processing..." : `Pay ₹${grandTotal.toLocaleString('en-IN')}`}
                    </button>
                    
                    <p className="text-center text-[9px] text-zinc-400 mt-4 leading-relaxed px-4">
                      By placing this order, you agree to our <span className="underline decoration-zinc-300 underline-offset-2 cursor-pointer hover:text-zinc-600">Rental Agreement</span> and confirm that you have read our <span className="underline decoration-zinc-300 underline-offset-2 cursor-pointer hover:text-zinc-600">Cancellations Policy</span>.
                    </p>
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
