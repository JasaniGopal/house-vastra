"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function SlideOutCart({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { cartItems, removeFromCart } = useCart();

  const totalRental = cartItems.reduce((acc, item) => acc + item.price, 0);
  const totalDeposit = cartItems.reduce((acc, item) => acc + item.deposit, 0);
  const grandTotal = totalRental + totalDeposit;

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Cart Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-[90%] max-w-[400px] bg-white z-[101] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 shrink-0">
          <h2 className="font-serif text-2xl font-bold text-[#001410]">Your Bag</h2>
          <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:text-[#001410] transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg className="w-16 h-16 text-zinc-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <h3 className="font-serif text-xl text-[#001410] mb-2">Your bag is empty</h3>
              <p className="text-sm text-zinc-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <button onClick={onClose} className="text-[10px] font-bold text-[#775a19] uppercase tracking-widest border-b border-[#775a19] pb-1">
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex gap-4">
                <div className="w-20 h-28 shrink-0 relative bg-zinc-100 rounded-md overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-[#001410] line-clamp-1 pr-4">{item.title}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-zinc-400 hover:text-rose-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.designer}</p>
                    {item.size && <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 mt-2">Size: {item.size}</p>}
                    {item.startDate && (
                      <p className="text-[10px] font-medium text-zinc-500 mt-1">
                        {new Date(item.startDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - {item.endDate ? new Date(item.endDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <p className="text-xs text-zinc-500">Rent: ₹{item.price.toLocaleString('en-IN')}</p>
                    <p className="font-bold text-sm text-[#001410]">Dep: ₹{item.deposit.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-zinc-50 border-t border-zinc-100 shrink-0">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-zinc-600">
                <span>Total Rental</span>
                <span>₹{totalRental.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-600">
                <span>Refundable Deposit</span>
                <span>₹{totalDeposit.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-px w-full bg-zinc-200 my-2"></div>
              <div className="flex justify-between font-serif text-xl font-bold text-[#001410]">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-zinc-500 text-center mt-2">Shipping calculated at checkout.</p>
            </div>
            
            <Link 
              href="/checkout" 
              onClick={onClose}
              className="block w-full bg-[#001410] text-white py-4 text-center text-xs font-bold uppercase tracking-widest hover:bg-[#00261f] transition-all rounded-md"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
