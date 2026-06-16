"use client";

import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="bg-[#fcf9f8] min-h-screen pt-24 pb-24 font-sans">
      <div className="max-w-[800px] mx-auto px-6 md:px-8">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#001410] mb-8 tracking-tight">Privacy Policy</h1>
        
        <div className="space-y-6 text-[#414846] leading-relaxed text-sm">
          <p>Last Updated: June 2026</p>

          <h2 className="font-serif text-xl text-[#001410] pt-4">Data Collection</h2>
          <p>
            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This includes your name, email, phone number, physical address, and body measurements.
          </p>

          <h2 className="font-serif text-xl text-[#001410] pt-4">How We Use Your Data</h2>
          <p>
            We use the information we collect to:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide, maintain, and improve our services.</li>
              <li>Process transactions and send related information.</li>
              <li>Verify sizing and fit based on your measurements.</li>
              <li>Send technical notices, updates, and security alerts.</li>
            </ul>
          </p>

          <h2 className="font-serif text-xl text-[#001410] pt-4">Data Sharing</h2>
          <p>
            We share your physical address and phone number with our logistics partners (e.g., Delhivery) for the sole purpose of delivering and picking up your rental items. We share your measurements with the specific boutique partner fulfilling your order to ensure fit. We do not sell your personal data to third parties.
          </p>

          <h2 className="font-serif text-xl text-[#001410] pt-4">Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access. Payment processing is handled securely via Razorpay.
          </p>
        </div>
      </div>
    </div>
  );
}
