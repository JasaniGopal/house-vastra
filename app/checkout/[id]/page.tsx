"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, addDays, startOfDay, eachDayOfInterval } from 'date-fns';
function CheckoutContent({ unwrappedParams }: { unwrappedParams: any }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${unwrappedParams.id}`);
        if (res.ok) {
          const product = await res.json();
          const start = searchParams.get('start');
          const end = searchParams.get('end');
          const size = searchParams.get('size') || "Custom";
          
          let calculatedDays = 4;
          let durationStr = "4 Days (Dates pending)";
          if (start && end) {
            const s = new Date(start);
            const e = new Date(end);
            const diffTime = e.getTime() - s.getTime();
            if (diffTime > 0) {
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              calculatedDays = Math.max(diffDays, 4);
              const formatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });
              durationStr = `${calculatedDays} Days: ${formatter.format(s)} - ${formatter.format(e)}`;
            }
          }

          const baseRental = product.rentalPrice4Day || 0;
          const currentRentalPrice = Math.round((baseRental / 4) * calculatedDays);
          const currentDeposit = product.securityDeposit || Math.round(baseRental * 0.3);

            setItems([{
              id: product.id,
              title: product.name,
              designer: product.vendor?.boutiqueName || "Boutique",
              image: product.images?.[0]?.url || "/images/placeholder.jpg",
              size: size,
              duration: durationStr,
              deposit: currentDeposit,
              price: currentRentalPrice,
              startDate: start || undefined,
              endDate: end || undefined
            }]);

            if (start) {
              setDeliveryDate(new Date(start));
            }

            const datesRes = await fetch(`/api/products/${unwrappedParams.id}/booked-dates`);
            if (datesRes.ok) {
              const datesData = await datesRes.json();
              const blocked: Date[] = [];
              if (datesData.bookedDates) {
                datesData.bookedDates.forEach((order: any) => {
                  const s = new Date(order.startDate);
                  const e = new Date(order.endDate);
                  blocked.push(...eachDayOfInterval({ start: s, end: e }));
                });
              }
              setBookedDates(blocked);
            }
          }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [unwrappedParams.id, searchParams]);
  
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("card");
  
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [address, setAddress] = useState({
    name: "Ananya Sharma",
    flat: "Flat 402, Sea View Apartments",
    street: "Juhu Tara Road",
    city: "Mumbai, Maharashtra 400049",
    phone: "+91 98XXX XXXXX"
  });

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (status === "unauthenticated") {
      const query = new URLSearchParams(searchParams.toString());
      router.push(`/login?callbackUrl=/checkout/${unwrappedParams.id}?${query.toString()}`);
      return;
    }
    
    // Validation for missing dates
    if (items.some(item => !item.startDate || !item.endDate)) {
      alert("Please select rental dates before checking out.");
      return;
    }

    setIsCheckoutLoading(true);

    try {
      // 0. Validate availability
      const valRes = await fetch("/api/checkout/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const valData = await valRes.json();
      
      if (!valData.available) {
        alert("Sorry, this item is no longer available for the selected dates.");
        setIsCheckoutLoading(false);
        return;
      }

      // 1. Create order on server
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal }),
      });
      
      const order = await res.json();
      if (!order.id) {
        throw new Error("Failed to create Razorpay order");
      }

      // 2. Initialize Razorpay popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_key",
        amount: order.amount,
        currency: order.currency,
        name: "LOR",
        description: "Luxury Rental Order",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify payment on server
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: items,
              address: address,
              userId: session?.user?.id || null, // Pass actual session userId
              couponCode: appliedCoupon?.code || null
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setIsSuccess(true);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: address.name,
          contact: address.phone,
        },
        theme: {
          color: "#001410",
        },
      };

      const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock_key";
      if (rzpKey === "rzp_test_mock_key") {
        options.handler({
          razorpay_order_id: order.id,
          razorpay_payment_id: "pay_mock_" + Math.random().toString(36).substring(2, 10),
          razorpay_signature: "mock_signature",
        });
        return;
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert(`Payment failed! ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong during checkout.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    setCouponError("");
    
    try {
      const res = await fetch("/api/checkout/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to validate coupon");
      
      setAppliedCoupon({ code: data.code, discountAmount: data.discountAmount });
      setCouponCode("");
    } catch (err: any) {
      setCouponError(err.message);
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const totalDeposit = items.reduce((acc, item) => acc + item.deposit, 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = subtotal - discountAmount + totalDeposit;

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
            Thank you for choosing LOR. Your luxury garments have been reserved and will be delivered to you shortly.
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
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-sans">
      {/* Header Bar */}
      <header className="w-full bg-white border-b border-[#c1c8c5]/30 sticky top-0 z-30">
        <div className="mx-auto max-w-[1280px] px-4 md:px-16 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl font-bold tracking-tight text-[#001410] hover:text-[#00261f] transition-colors"
          >
            LOR
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
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <h2 className="font-serif text-2xl text-[#001410]">Loading checkout...</h2>
          </div>
        ) : items.length === 0 ? (
          <div className="max-w-[420px] mx-auto w-full text-center py-24">
            <svg className="w-16 h-16 mx-auto text-zinc-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <h2 className="font-serif text-2xl font-bold text-[#001410] mb-2">Item Not Found</h2>
            <p className="font-sans text-sm text-[#5c6462] leading-relaxed mb-8">
              We couldn't load the details for this item.
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
                  <button 
                    onClick={() => setIsEditingAddress(!isEditingAddress)} 
                    className="text-sm font-bold text-[#775a19] hover:underline"
                  >
                    {isEditingAddress ? "Cancel" : "Change"}
                  </button>
                </div>
                
                {isEditingAddress ? (
                  <div className="bg-white p-6 rounded-sm border border-black/10 flex flex-col gap-4 shadow-sm animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input 
                          type="text" 
                          value={address.name}
                          onChange={(e) => setAddress({...address, name: e.target.value})}
                          className="w-full border border-black/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#001410] transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Phone Number</label>
                        <input 
                          type="text" 
                          value={address.phone}
                          onChange={(e) => setAddress({...address, phone: e.target.value})}
                          className="w-full border border-black/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#001410] transition-colors" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Flat, House no., Building</label>
                        <input 
                          type="text" 
                          value={address.flat}
                          onChange={(e) => setAddress({...address, flat: e.target.value})}
                          className="w-full border border-black/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#001410] transition-colors" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Area, Street, Sector, Village</label>
                        <input 
                          type="text" 
                          value={address.street}
                          onChange={(e) => setAddress({...address, street: e.target.value})}
                          className="w-full border border-black/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#001410] transition-colors" 
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Town/City & Pincode</label>
                        <input 
                          type="text" 
                          value={address.city}
                          onChange={(e) => setAddress({...address, city: e.target.value})}
                          className="w-full border border-black/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#001410] transition-colors" 
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsEditingAddress(false)}
                      className="mt-2 bg-[#001410] text-white py-3 px-6 rounded-sm font-sans font-bold text-xs tracking-widest uppercase hover:bg-[#00261f] transition-all self-start"
                    >
                      Save Address
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#f5f3f0] p-6 rounded-sm border border-black/5 flex gap-4 items-start">
                    <svg className="w-5 h-5 text-[#001410] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <div>
                      <span className="block font-bold text-[#001410] mb-1">{address.name}</span>
                      <span className="block text-sm text-[#414846] leading-relaxed">
                        {address.flat},<br />
                        {address.street},<br />
                        {address.city}
                      </span>
                      <span className="block text-sm text-[#414846] mt-2">Phone: {address.phone}</span>
                    </div>
                  </div>
                )}
              </section>

              {/* Payment Details */}
              <section>
                <h2 className="font-serif text-xl md:text-2xl font-bold text-[#001410] mb-4">2. Payment Details</h2>
                
                <div className="bg-white border border-black/10 rounded-sm p-6 shadow-sm">
                  {/* Promo Code Input */}
                  <div className="mb-6">
                    <span className="block text-sm font-bold text-[#001410] mb-3">Apply Promo Code</span>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-[#775a19]/10 border border-[#775a19]/20 p-3 rounded-sm">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-[#775a19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-bold text-[#775a19] text-sm tracking-wide">{appliedCoupon.code}</span>
                        </div>
                        <button onClick={removeCoupon} className="text-[#775a19] hover:text-[#001410] text-xs font-bold uppercase tracking-widest cursor-pointer">Remove</button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="e.g. WELCOME500" 
                            className="flex-1 min-w-0 px-3 md:px-4 py-3 bg-[#faf9f8] border border-black/10 rounded-sm text-sm font-bold text-[#001410] focus:outline-none focus:border-[#775a19] uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:font-normal"
                          />
                          <button 
                            onClick={handleApplyCoupon}
                            disabled={isValidatingCoupon || !couponCode}
                            className="px-4 md:px-6 py-3 bg-[#001410] text-white rounded-sm font-bold text-sm hover:bg-[#775a19] transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                          >
                            {isValidatingCoupon ? "..." : "Apply"}
                          </button>
                        </div>
                        {couponError && <p className="text-red-500 text-xs font-bold mt-2">{couponError}</p>}
                      </div>
                    )}
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-emerald-600 font-bold text-sm mb-4">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

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
                      <button 
                        onClick={() => setShowDatePickerModal(true)}
                        className="w-full flex justify-between items-center text-[#414846] mb-6 p-4 border border-zinc-200 rounded-lg hover:border-[#001410] transition-colors text-left bg-white"
                      >
                        <div>
                          <span className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Rental Dates</span>
                          <span className="font-bold text-sm text-[#001410]">{item.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#775a19] text-xs font-bold underline">Edit</span>
                          <svg className="w-5 h-5 text-[#775a19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                          </svg>
                        </div>
                      </button>

                      {/* Fees */}
                      <div className="space-y-3 font-sans text-sm border-t border-black/5 pt-6">
                        <div className="flex justify-between text-zinc-600">
                          <span>Rental Fee</span>
                          <span className="text-[#001410] font-medium">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center text-zinc-600">
                          <span className="relative group flex items-center gap-1.5 cursor-pointer">
                            Security Deposit
                            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-3 py-1.5 bg-[#001410] text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg uppercase tracking-wider">
                              Refundable in 7 days
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#001410]"></div>
                            </div>
                          </span>
                          <span className="text-[#775a19] font-medium">₹{item.deposit.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}



                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* DATE PICKER MODAL */}
      {showDatePickerModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001410]/40 backdrop-blur-sm" onClick={() => setShowDatePickerModal(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative z-10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowDatePickerModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-[#001410]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="font-serif text-xl text-[#001410] mb-4 text-center">Select Delivery Date</h3>
            
            <div className="flex justify-center mb-6">
              <DayPicker
                mode="single"
                selected={deliveryDate}
                onSelect={(date) => {
                  if (date) {
                    setDeliveryDate(date);
                    setShowDatePickerModal(false);
                    const startStr = date.toISOString();
                    const endStr = addDays(date, 3).toISOString(); // 4 day rental
                    const query = new URLSearchParams(searchParams.toString());
                    query.set('start', startStr);
                    query.set('end', endStr);
                    router.replace(`/checkout/${unwrappedParams.id}?${query.toString()}`);
                  }
                }}
                disabled={[
                  { before: startOfDay(addDays(new Date(), 2)) },
                  ...bookedDates
                ]}
                className="font-sans"
                classNames={{
                  selected: "bg-[#001410] text-white hover:bg-[#00261f]",
                }}
              />
            </div>

            {deliveryDate && (
              <div className="p-4 bg-[#FAF2E8] border border-[#E8D8BA] rounded-xl text-center">
                <p className="text-sm text-[#001410]">
                  <span className="font-bold">Delivery:</span> {format(deliveryDate, 'do MMM')}
                </p>
                <p className="text-sm text-[#001410] mt-1">
                  <span className="font-bold">Return:</span> {format(addDays(deliveryDate, 3), 'do MMM')} (4-Day)
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
}

export default function DirectCheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center">
        <h2 className="font-serif text-2xl text-[#001410]">Loading checkout...</h2>
      </div>
    }>
      <CheckoutContent unwrappedParams={unwrappedParams} />
    </Suspense>
  );
}
