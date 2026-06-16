"use client";

import React from 'react';

export default function ShippingReturnsPage() {
  return (
    <div className="bg-[#fcf9f8] min-h-screen pt-24 pb-24 font-sans">
      <div className="max-w-[800px] mx-auto px-6 md:px-8">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#001410] mb-8 tracking-tight">Shipping & Returns</h1>
        
        <div className="space-y-8 text-[#414846] leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-[#001410] mb-4">Delivery Options</h2>
            <p className="mb-4">We deliver across major cities in India. All shipments are handled via premium courier services to ensure your outfit arrives safely and on time.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Standard Delivery:</strong> Free on orders over ₹5000. Arrives 1-2 days before your rental start date.</li>
              <li><strong>Express Delivery:</strong> Available for select pin codes for an additional fee of ₹500.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#001410] mb-4">How Returns Work</h2>
            <p className="mb-4">Returning your rental is completely free and frictionless.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Place the unwashed outfit back into the garment bag it arrived in.</li>
              <li>Use the pre-paid shipping label included in your delivery box.</li>
              <li>A delivery agent will automatically come to your address on the final day of your rental period to pick up the package.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#001410] mb-4">Late Returns</h2>
            <p>
              Please ensure your outfit is ready for pickup on the scheduled return date. Late returns affect the next customer's booking. A late fee of ₹1000 per day will be charged to the payment method on file if the outfit is not handed over to our logistics partner on time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
