"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import OrderTimeline from '@/components/Profile/OrderTimeline';

export default function ActiveRentalsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetch('/api/profile/orders')
      .then(res => res.json())
      .then(data => {
        const activeOrders = data.filter((o: any) => 
          !["RETURNED", "COMPLETED", "CANCELLED"].includes(o.status)
        );
        setOrders(activeOrders || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/profile/orders/${orderToCancel}/cancel`, { method: "POST" });
      if (res.ok) {
        showToast("Order cancelled successfully.");
        // Remove it from the active rentals list since it's now cancelled
        setOrders(orders.filter(o => o.id !== orderToCancel));
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to cancel order.");
      }
    } catch (e) {
      showToast("Error cancelling order.");
    } finally {
      setIsCancelling(false);
      setOrderToCancel(null);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <main className="min-h-screen bg-[#fcf9f8] font-sans pb-24">
      <div className="max-w-[800px] mx-auto px-4 md:px-8 pt-8 md:pt-12">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#775a19] transition-colors mb-4 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Active Rentals</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Manage your current rented outfits and track their status.</p>
        </div>

        {/* Rentals List */}
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="py-12 text-center text-zinc-500">Loading rentals...</div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">No active rentals found.</div>
          ) : (
            orders.map((order) => {
              const startDateStr = new Date(order.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
              const endDateStr = new Date(order.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
              
              return (
                <div key={order.id} className="bg-white p-5 md:p-6 rounded-2xl border border-[#c1c8c5]/40 shadow-sm flex flex-col md:flex-row gap-6">
                  {/* Image Thumbnail */}
                  <div className="relative w-full md:w-36 h-48 md:h-36 rounded-xl overflow-hidden bg-[#FAF2E8] shrink-0 border border-zinc-100">
                     <Image 
                      src={order.product?.images?.[0]?.url || "/images/placeholder.jpg"} 
                      alt={order.product?.name || "Product Image"} 
                      fill 
                      className="object-cover object-top" 
                     />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-0">
                        <div>
                          <span className="text-[10px] font-bold tracking-[0.15em] text-[#775a19] uppercase mb-1 block">
                            {order.product?.vendor?.boutiqueName || "Boutique"}
                          </span>
                          <h3 className="font-serif text-xl font-medium text-[#001410]">{order.product?.name}</h3>
                          <p className="text-xs text-zinc-500 mt-1 font-mono">Order: {order.orderNumber}</p>
                        </div>
                        <span className="bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full w-fit flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse"></span>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                        <div>
                          <span className="text-zinc-500 block text-[11px] uppercase tracking-wider font-bold mb-1">Rental Period</span>
                          <span className="font-medium text-[#001410]">{startDateStr} - {endDateStr}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block text-[11px] uppercase tracking-wider font-bold mb-1">Total Amount</span>
                          <span className="font-medium text-[#001410]">₹{order.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    {/* Timeline */}
                    <div className="mt-4 px-2">
                      <OrderTimeline currentStatus={order.status} />
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-6">
                      <button onClick={() => showToast("Opening tracking link for tracking ID: " + order.orderNumber)} className="flex-1 bg-[#FAF2E8] text-[#775a19] py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#F6EDDB] transition-all active:scale-[0.98]">
                        Track Delivery
                      </button>
                      {order.status === "PREPARING" && (
                        <button 
                          onClick={() => setOrderToCancel(order.id)}
                          className="flex-1 bg-rose-50 text-rose-600 border border-rose-100 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-rose-100 transition-all active:scale-[0.98]"
                        >
                          Cancel Order
                        </button>
                      )}
                      <Link href={`/product/${order.product?.id}`} className="px-5 py-3 border border-zinc-200 rounded-xl text-xs font-bold uppercase tracking-wider hover:border-[#001410] hover:text-[#001410] transition-colors text-zinc-600 whitespace-nowrap">
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isCancelling && setOrderToCancel(null)} />
          
          <div className="relative bg-white w-full max-w-sm rounded-2xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-rose-100">
              <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className="font-serif text-2xl font-bold text-[#001410] mb-2">Cancel Order?</h3>
            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
              Are you sure you want to cancel this rental? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setOrderToCancel(null)}
                disabled={isCancelling}
                className="flex-1 px-4 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50"
              >
                Keep Order
              </button>
              <button 
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

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

    </main>
  );
}
