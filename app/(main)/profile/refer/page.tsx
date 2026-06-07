"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function ReferPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("ANANYA500");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Rent Vastra',
      text: 'Use my code ANANYA500 to get ₹500 off your first luxury rental!',
      url: 'https://rentvastra.com?ref=ANANYA500'
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for desktop/unsupported browsers
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert("Referral message and link copied to clipboard!");
    }
  };
  return (
    <main className="min-h-screen bg-[#fcf9f8] font-sans pb-24">
      <div className="max-w-[700px] mx-auto px-4 md:px-8 pt-8 md:pt-12">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#775a19] transition-colors mb-4 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Refer a Friend</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Share the elegance of Rent Vastra and earn exclusive rewards.</p>
        </div>

        <div className="flex flex-col gap-8">
          
          {/* Main Hero Card */}
          <div className="bg-[#00261f] rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl border border-[#001410] text-center flex flex-col items-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#E8D8BA 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            <div className="w-20 h-20 bg-[#FAF2E8] rounded-full flex items-center justify-center text-[#775a19] mb-6 shadow-lg relative z-10">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl text-white font-medium mb-4 relative z-10">Give ₹500, Get ₹500</h2>
            <p className="text-[#A6C4BA] text-sm md:text-base max-w-[400px] mb-10 relative z-10 leading-relaxed">
              When your friends rent their first designer outfit using your code, they get ₹500 off, and you get ₹500 in store credit!
            </p>

            {/* Code Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 pl-6 rounded-2xl flex items-center justify-between w-full max-w-[400px] relative z-10">
              <span className="font-mono text-xl md:text-2xl font-bold text-white tracking-widest uppercase">ANANYA500</span>
              <button 
                onClick={handleCopy}
                className="bg-[#F6EDDB] text-[#001410] py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white active:scale-95 transition-all shadow-md w-[110px]"
              >
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
          </div>

          {/* Stats & Rules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Total Referrals</span>
              <div className="flex items-end gap-3">
                 <span className="font-serif text-4xl font-medium text-[#001410]">3</span>
                 <span className="text-sm font-bold text-[#2E7D32] mb-1">+ ₹1,500 Earned</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Pending Invites</span>
              <div className="flex items-end gap-3">
                 <span className="font-serif text-4xl font-medium text-[#001410]">1</span>
                 <span className="text-sm font-medium text-zinc-400 mb-1">Awaiting first rental</span>
              </div>
            </div>

          </div>

          {/* Share Button (Mobile friendly) */}
          <button 
            onClick={handleShare}
            className="w-full bg-[#001410] text-white py-4 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#00261f] hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 md:hidden"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            Share Referral Link
          </button>

        </div>
      </div>
    </main>
  );
}
