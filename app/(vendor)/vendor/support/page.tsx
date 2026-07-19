"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VendorSupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // We could fetch past tickets here if we created a GET route, but for simplicity we'll just show the form.
  // Actually, fetching past tickets is a nice touch. Let's assume we'll just have the form for now.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/vendor/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message })
      });

      if (!res.ok) {
        throw new Error("Failed to send message.");
      }

      setSuccess("Your message has been sent to the admin team. We will get back to you shortly.");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Help & Support</h1>
        <p className="text-[#414846] mt-2 text-sm md:text-base">Contact the platform administrators for help with payouts, damaged items, or other issues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Contact Form */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 md:p-8">
          <h2 className="font-serif text-xl font-bold text-[#001410] mb-6">Send a Message</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">What do you need help with?</label>
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410]"
                required
              >
                <option value="" disabled>Select a topic...</option>
                <option value="Payout Issue">Payout Issue / Delay</option>
                <option value="Damaged Item">Customer Damaged My Item</option>
                <option value="Rejected Product">Question About Rejected Product</option>
                <option value="Update Boutique Profile">Update Boutique Profile</option>
                <option value="Other">Other / General Inquiry</option>
              </select>
            </div>
            
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">Message</label>
              <textarea 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Please describe your issue in detail. If it's about a specific order or product, please include the Order ID or Product Name."
                className="w-full border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410]"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#001410] text-white py-3 px-8 font-sans font-bold text-[13px] uppercase tracking-[0.15em] hover:bg-[#00261f] transition-all disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <div className="bg-[#faf9f8] p-6 rounded-2xl border border-zinc-100">
            <h3 className="font-bold text-[#001410] mb-2">Need quick answers?</h3>
            <p className="text-sm text-zinc-500 mb-4">Check out our platform rules and guidelines before submitting a ticket.</p>
            <Link href="/vendor/guidelines" className="text-sm font-bold text-[#775a19] hover:underline flex items-center gap-1">
              Read Guidelines
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          
          <div className="bg-[#faf9f8] p-6 rounded-2xl border border-zinc-100">
            <h3 className="font-bold text-[#001410] mb-2">Emergency?</h3>
            <p className="text-sm text-zinc-500 mb-4">For urgent issues regarding a live rental or an immediate pickup, please call us.</p>
            <p className="font-mono text-sm font-bold text-[#001410]">+91 9168899557</p>
            <p className="text-xs text-zinc-400 mt-1">Available 9 AM - 8 PM (IST)</p>
          </div>
        </div>

      </div>
    </div>
  );
}
