import React from 'react';
import Link from 'next/link';

export default function VendorGuidelinesPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Platform Guidelines</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Everything you need to know about renting on House of Vastra.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        
        {/* Section 1 */}
        <div className="p-6 md:p-8 border-b border-zinc-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#775a19]/10 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#775a19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#001410]">How Payouts Work</h2>
          </div>
          <div className="prose prose-sm prose-zinc max-w-none ml-13">
            <p>We want to ensure you get paid securely and on time.</p>
            <ul>
              <li><strong>When do I get paid?</strong> Your earnings are added to your "Pending Balance" the moment an outfit is safely returned and inspected by our warehouse team.</li>
              <li><strong>Payout Schedule:</strong> We process payouts automatically on the <strong>1st and 15th of every month</strong> directly to your registered bank account.</li>
              <li><strong>Platform Fee:</strong> House of Vastra charges a flat platform fee on the rental price to cover shipping, dry cleaning (optional), and platform maintenance. The exact "Your Expected Rent" you enter during upload is exactly what you get.</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div className="p-6 md:p-8 border-b border-zinc-100 bg-[#fcf9f8]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#001410]">Quality & Cleaning</h2>
          </div>
          <div className="prose prose-sm prose-zinc max-w-none ml-13">
            <p>Customers expect premium quality. Here is what is expected of your inventory.</p>
            <ul>
              <li><strong>Before Pickup:</strong> Ensure the outfit is clean, ironed/steamed, and packed securely in the provided House of Vastra garment bags.</li>
              <li><strong>Returns:</strong> Customers will return the outfit unwashed. <strong>Do not worry!</strong> Our warehouse team will inspect it, process minor stains, and return it to you ready for the next rental or your closet.</li>
              <li><strong>Rejections:</strong> If you upload an item with blurry photos, or if the item is severely damaged upon our initial inspection, we may reject it from the platform to maintain quality standards.</li>
            </ul>
          </div>
        </div>

        {/* Section 3 */}
        <div className="p-6 md:p-8 border-b border-zinc-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#001410]">Damages & Security Deposits</h2>
          </div>
          <div className="prose prose-sm prose-zinc max-w-none ml-13">
            <p>Your items are valuable, and we protect them.</p>
            <ul>
              <li><strong>Security Deposit:</strong> Every customer pays a security deposit (which you define) before renting.</li>
              <li><strong>Minor Wear & Tear:</strong> Small issues like missing beads or easily washable stains are considered normal wear and tear.</li>
              <li><strong>Major Damage:</strong> If an outfit is returned torn, permanently stained, or burnt, <strong>we withhold the customer's security deposit</strong> and transfer it to you as compensation. Our admin team will manage the dispute process entirely so you don't have to deal with the customer directly.</li>
            </ul>
          </div>
        </div>

        {/* Section 4 */}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#001410]">Calendar Blocks</h2>
          </div>
          <div className="prose prose-sm prose-zinc max-w-none ml-13">
            <p>You have full control over your inventory.</p>
            <ul>
              <li><strong>Personal Use:</strong> If you need to wear your own outfit for an upcoming wedding, simply go to your <strong>Products</strong>, click the <strong>Calendar</strong> button, and block those dates.</li>
              <li><strong>Offline Rentals:</strong> If you rent the outfit to someone locally, block those dates immediately so you don't get double-booked online.</li>
              <li><strong>Important:</strong> If an online customer books an outfit and you cancel it because you forgot to block the dates, it negatively affects your boutique rating.</li>
            </ul>
          </div>
        </div>

      </div>
      
      <div className="mt-8 text-center">
        <p className="text-zinc-500 text-sm mb-4">Still have questions?</p>
        <Link href="/vendor/support" className="inline-block bg-white border border-zinc-200 text-[#001410] py-3 px-8 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-zinc-50 transition-colors">
          Contact Support
        </Link>
      </div>

    </div>
  );
}
