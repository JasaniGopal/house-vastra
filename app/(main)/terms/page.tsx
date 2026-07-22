"use client";

import React from 'react';

export default function TermsPage() {
  return (
    <div className="bg-[#fcf9f8] min-h-screen pt-24 pb-24 font-sans">
      <div className="max-w-[800px] mx-auto px-6 md:px-8">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#001410] mb-8 tracking-tight">Terms of Service</h1>
        
        <div className="space-y-6 text-[#414846] leading-relaxed text-sm">
          <p>Last Updated: June 2026</p>

          <h2 className="font-serif text-xl text-[#001410] pt-4">1. Introduction</h2>
          <p>
            Welcome to LOR. These Terms of Service govern your use of our website and rental services. By accessing or using our platform, you agree to be bound by these terms.
          </p>

          <h2 className="font-serif text-xl text-[#001410] pt-4">2. Rental Agreement</h2>
          <p>
            When you rent a product from LOR, you are agreeing to rent it for a specific duration (4 or 8 days). The product remains the property of the respective boutique partner at all times.
          </p>

          <h2 className="font-serif text-xl text-[#001410] pt-4">3. Damage and Loss</h2>
          <p>
            You are responsible for the care of the item during the rental period. Minor wear is covered by our insurance. However, major damage (e.g., large tears, severe stains, burns) or loss/theft will result in a charge up to the full retail value of the item.
          </p>

          <h2 className="font-serif text-xl text-[#001410] pt-4">4. Cancellations</h2>
          <p>
            Orders can be canceled for a full refund up to 14 days before the delivery date. Cancellations within 14 days will incur a 50% penalty.
          </p>

          <h2 className="font-serif text-xl text-[#001410] pt-4">5. Vendor Obligations</h2>
          <p>
            Boutique partners agree to maintain the quality and authenticity of all listed items. Vendors must adhere to the platform's cleaning standards and dispatch timelines.
          </p>
        </div>
      </div>
    </div>
  );
}
