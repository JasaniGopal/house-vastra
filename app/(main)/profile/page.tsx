"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();
  return (
    <main className="min-h-screen bg-[#fcf9f8] font-sans pb-24">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 pt-10 md:pt-16 flex flex-col md:flex-row gap-8 lg:gap-16">
        
        {/* LEFT SIDEBAR (Sticky on Desktop) */}
        <div className="w-full md:w-[340px] shrink-0 md:sticky md:top-[120px] h-fit flex flex-col gap-8">
          
          {/* Profile Summary Card */}
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-[20px] overflow-hidden bg-[#001410] shadow-xl mb-5 border border-zinc-200 flex items-center justify-center text-white text-3xl font-serif">
              {session?.user?.image ? (
                <Image 
                  src={session.user.image}
                  alt={session?.user?.name || "Avatar"}
                  fill
                  priority
                  className="object-cover object-top"
                />
              ) : (
                session?.user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            
            {/* Name */}
            <h1 className="font-serif text-[26px] md:text-[28px] font-medium text-[#001410] tracking-tight">{session?.user?.name || "My Profile"}</h1>
            <p className="font-sans text-[13px] text-zinc-500 mt-1">{session?.user?.email}</p>
          </div>

          <hr className="border-[#c1c8c5]/30 block md:hidden" />
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col gap-10 md:gap-12 w-full mt-2 md:mt-0">
          
          {/* Quick Links Grid (2x2) */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            
            {/* Active Rentals */}
            <Link href="/profile/rentals" className="bg-[#f8f6f5] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-[#FAF2E8] hover:shadow-sm transition-all border border-transparent hover:border-[#E8D8BA]">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#00261f] rounded-2xl flex items-center justify-center shadow-md text-white">
                <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <span className="font-sans text-[13px] md:text-sm font-bold text-[#001410]">Active Rentals</span>
            </Link>

            {/* Order History */}
            <Link href="/profile/history" className="bg-[#f8f6f5] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-[#FAF2E8] hover:shadow-sm transition-all border border-transparent hover:border-[#E8D8BA]">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#00261f] rounded-2xl flex items-center justify-center shadow-md text-white">
                <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-sans text-[13px] md:text-sm font-bold text-[#001410]">Order History</span>
            </Link>

            {/* My Wishlist */}
            <Link href="/wishlist" className="bg-[#f8f6f5] rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-[#FAF2E8] hover:shadow-sm transition-all border border-transparent hover:border-[#E8D8BA]">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#00261f] rounded-2xl flex items-center justify-center shadow-md text-white">
                <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <span className="font-sans text-[13px] md:text-sm font-bold text-[#001410]">My Wishlist</span>
            </Link>
          </div>

          {/* Account Settings List */}
          <div>
            <h2 className="font-serif text-[22px] font-medium text-[#001410] mb-3">Account Settings</h2>
            <div className="flex flex-col">
              
              {/* Personal Information */}
              <Link href="/profile/personal-info" className="flex items-center justify-between py-5 border-b border-[#c1c8c5]/40 hover:bg-[#FAF2E8]/40 px-2 -mx-2 rounded-lg transition-colors group">
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#001410]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="font-sans text-[15px] font-medium text-[#001410]">Personal Information</span>
                </div>
                <svg className="w-4 h-4 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Saved Addresses */}
              <Link href="/profile/addresses" className="flex items-center justify-between py-5 border-b border-[#c1c8c5]/40 hover:bg-[#FAF2E8]/40 px-2 -mx-2 rounded-lg transition-colors group">
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#001410]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="font-sans text-[15px] font-medium text-[#001410]">Saved Addresses</span>
                </div>
                <svg className="w-4 h-4 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Measurement Profile */}
              <Link href="/profile/measurements" className="flex items-center justify-between py-5 border-b border-[#c1c8c5]/40 hover:bg-[#FAF2E8]/40 px-2 -mx-2 rounded-lg transition-colors group">
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#001410]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 010 3m0-3a1.5 1.5 0 000 3m0 9.75V10.5" />
                  </svg>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="font-sans text-[15px] font-medium text-[#001410]">Measurement Profile</span>
                    <span className="bg-[#FAF2E8] text-[#A8813C] text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase w-fit border border-[#E8D8BA]">Updated</span>
                  </div>
                </div>
                <svg className="w-4 h-4 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>



          {/* Support & Legal */}
          <div className="mt-4 md:mt-2">
            <span className="font-sans text-[11px] font-bold text-zinc-400 uppercase tracking-[0.15em] block mb-2">
              Support & Legal
            </span>
            <div className="flex flex-col">
              
              {/* Help Center */}
              <Link href="/support" className="flex items-center justify-between py-5 border-b border-[#c1c8c5]/40 hover:bg-[#FAF2E8]/40 px-2 -mx-2 rounded-lg transition-colors group">
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#001410]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                  <span className="font-sans text-[15px] font-medium text-[#001410]">Help Center</span>
                </div>
                <svg className="w-4 h-4 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </Link>

              {/* Rental Policy */}
              <Link href="/policy" className="flex items-center justify-between py-5 border-b border-[#c1c8c5]/40 hover:bg-[#FAF2E8]/40 px-2 -mx-2 rounded-lg transition-colors group">
                <div className="flex items-center gap-4">
                  <svg className="w-5 h-5 text-[#001410]/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="font-sans text-[15px] font-medium text-[#001410]">Rental Policy</span>
                </div>
                <svg className="w-4 h-4 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Logout */}
              <button onClick={() => signOut({ callbackUrl: '/' })} className="flex items-center gap-4 py-5 hover:bg-red-50/50 px-2 -mx-2 rounded-lg transition-colors group mt-2 w-full text-left">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                <span className="font-sans text-[15px] font-bold text-red-600 tracking-wide">Logout</span>
              </button>

            </div>
          </div>

          <p className="font-sans text-[10px] text-zinc-400 text-center md:text-left mt-8 pb-4 uppercase tracking-widest">
            LOR v2.4.0 &bull; Handcrafted Curated Elegance
          </p>
          
        </div>
      </div>
    </main>
  );
}
