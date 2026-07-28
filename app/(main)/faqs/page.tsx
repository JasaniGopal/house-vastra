"use client";

import React, { useState } from 'react';

const faqs = [
  {
    q: "How long is the rental period?",
    a: "We offer standard 4-day and extended 8-day rental periods. Your rental begins on the day the outfit is delivered to you."
  },
  {
    q: "Do I need to dry clean the outfit before returning?",
    a: "No! Please do not attempt to wash, iron, or dry clean the outfit yourself. Our boutique partners use specialized, eco-friendly dry cleaning processes after every rental."
  },
  {
    q: "What happens if I accidentally damage the outfit?",
    a: "We understand that minor wear and tear (like a loose bead or slight hem dust) happens. These are covered. However, significant damage (tears, permanent stains) will be assessed, and you may be charged up to the retail value of the garment."
  },
  {
    q: "How does the sizing work?",
    a: "Many of our outfits are adjustable. You can check the specific measurements on the product page. You can also upload your exact measurements to your profile, and our stylists will verify the fit before shipping."
  },
  {
    q: "Can I cancel my order?",
    a: "Yes, you can cancel your order for a full refund up to 14 days before your scheduled delivery date. Cancellations within 14 days are subject to a 50% cancellation fee."
  }
];

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-[#fcf9f8] min-h-screen pt-24 pb-24 font-sans">
      <div className="max-w-[800px] mx-auto px-6 md:px-8">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#001410] mb-8 tracking-tight">Frequently Asked Questions</h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-[#c1c8c5]/40 rounded-xl overflow-hidden">
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-serif text-lg text-[#001410] pr-4">{faq.q}</span>
                <svg className={`w-5 h-5 text-zinc-400 transition-transform ${openIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-[#414846] leading-relaxed border-t border-zinc-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-[#FAF2E8] border border-[#E8D8BA] rounded-xl text-center">
          <p className="text-[#001410] font-medium mb-2">Still have questions?</p>
          <p className="text-sm text-zinc-600">Email us at support@lookonrent.com or call +91 9168899557.</p>
        </div>
      </div>
    </div>
  );
}
