"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function OrderHistoryPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchOrders();
    }
  }, [session]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/profile/orders");
      if (res.ok) {
        const data = await res.json();
        // For history, show past orders (RETURNED, COMPLETED, CANCELLED)
        const historyOrders = data.filter((o: any) => 
          ["RETURNED", "COMPLETED", "CANCELLED"].includes(o.status)
        );
        setOrders(historyOrders);
      }
    } catch (err) {
      console.error("Failed to fetch order history", err);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateString));
  };

  const submitReview = async () => {
    if (!reviewOrder) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: reviewOrder.productId,
          orderId: reviewOrder.id,
          rating,
          comment
        })
      });
      if (res.ok) {
        showToast("Review submitted successfully and pending approval!");
        setReviewOrder(null);
        setRating(5);
        setComment("");
      } else {
        showToast("Failed to submit review");
      }
    } catch (e) {
      showToast("Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fcf9f8] font-sans pb-24">
      <div className="max-w-[800px] mx-auto px-4 md:px-8 pt-8 md:pt-12">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#775a19] transition-colors mb-4 group">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Profile
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Order History</h1>
            <p className="text-[#414846] mt-2 text-sm md:text-base">View your past rentals and invoices.</p>
          </div>
        </div>

        {/* History List */}
        <div className="flex flex-col gap-6">
          {isLoading ? (
            <div className="text-center text-zinc-500 py-12">Loading your order history...</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-zinc-500 py-12 bg-white rounded-2xl border border-zinc-200">
              <p>You have no past orders yet.</p>
              <Link href="/collections" className="inline-block mt-4 text-[#775a19] font-bold hover:underline">Browse Collection</Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white p-5 md:p-6 rounded-2xl border border-[#c1c8c5]/40 shadow-sm flex flex-col md:flex-row gap-6">
                {/* Image Thumbnail */}
                <div className="relative w-full md:w-28 h-40 md:h-28 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100">
                   <Image 
                    src={order.product?.images?.[0]?.url || "/placeholder.jpg"} 
                    alt={order.product?.title || "Product"} 
                    fill 
                    className="object-cover object-top" 
                   />
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-0">
                      <div>
                        <span className="text-[10px] font-bold tracking-[0.15em] text-zinc-500 uppercase mb-1 block">Order {order.orderNumber}</span>
                        <h3 className="font-serif text-lg font-medium text-[#001410]">{order.product?.title}</h3>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full w-fit flex items-center gap-1.5 ${order.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-500'}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm text-zinc-600">
                      <p><strong className="text-[#001410]">Dates:</strong> {formatDate(order.startDate)} - {formatDate(order.endDate)}</p>
                      <p><strong className="text-[#001410]">Paid:</strong> ₹{order.totalAmount}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <Link href={`/product/${order.productId}`} className="bg-[#FAF2E8] text-[#775a19] py-2 px-5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#F6EDDB] transition-all">
                      Rent Again
                    </Link>
                    {order.status === 'COMPLETED' || order.status === 'RETURNED' ? (
                      <button onClick={() => setReviewOrder(order)} className="border border-[#001410] text-[#001410] bg-white py-2 px-5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-all">
                        Write a Review
                      </button>
                    ) : null}
                    {order.status !== 'CANCELLED' && (
                      <button onClick={() => showToast(`Downloading Invoice ${order.orderNumber}.pdf...`)} className="border border-zinc-200 text-zinc-600 bg-white py-2 px-5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-all">
                        View Invoice
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Custom Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-4 md:right-8 z-50 transition-all duration-300 transform translate-y-0 opacity-100">
          <div className="bg-[#001410] text-white px-6 py-4 rounded-sm shadow-2xl flex items-center gap-3 border border-[#775a19]/30">
            <svg className="w-5 h-5 text-[#775a19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="font-sans text-xs md:text-[13px] uppercase font-bold tracking-wider">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001410]/40 backdrop-blur-sm" onClick={() => setReviewOrder(null)}></div>
          <div className="bg-white w-full max-w-md rounded-2xl p-6 md:p-8 relative z-10 shadow-2xl">
            <button onClick={() => setReviewOrder(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-[#001410]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="font-serif text-2xl text-[#001410] mb-2">Write a Review</h3>
            <p className="text-xs text-zinc-500 mb-6">How was your experience renting {reviewOrder.product?.title || "this product"}?</p>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-[#001410] uppercase tracking-wider mb-2">Rating</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="outline-none">
                    <svg className={`w-8 h-8 ${star <= rating ? 'text-[#775a19]' : 'text-zinc-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-[#001410] uppercase tracking-wider mb-2">Comment</label>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details of your experience..."
                className="w-full border border-zinc-200 rounded-lg p-3 text-sm focus:border-[#001410] focus:ring-0 outline-none h-32 resize-none"
              ></textarea>
            </div>

            <button 
              onClick={submitReview} 
              disabled={isSubmitting}
              className="w-full bg-[#001410] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
