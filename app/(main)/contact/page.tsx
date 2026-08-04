"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setErrorMessage(error.message || "Something went wrong. Please try again later.");
    }
  };

  return (
    <main className="min-h-screen bg-[#fcf9f8] pt-24 pb-20 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-[#001410] mb-4">Contact Us</h1>
          <p className="text-zinc-600 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Whether you have a question about an exclusive piece, need assistance with your boutique, or simply want to say hello, our team is here for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8">
          
          {/* Contact Information (Left Column) */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <div>
              <h3 className="font-serif text-xl text-[#001410] mb-3">Get in Touch</h3>
              <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
                We aim to respond to all inquiries within 24 business hours. For immediate assistance regarding an active rental, please call us directly.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E8D8BA] flex items-center justify-center text-[#775a19] shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.89-1.46-5.36-3.93-6.82-6.82l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#001410] uppercase tracking-wider mb-1">Phone Support</h4>
                  <p className="text-sm text-zinc-600">+91 98765 43210</p>
                  <p className="text-xs text-zinc-400 mt-1">Mon-Sat, 9AM-8PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E8D8BA] flex items-center justify-center text-[#775a19] shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#001410] uppercase tracking-wider mb-1">Email Inquiries</h4>
                  <p className="text-sm text-zinc-600">hello@houseofvastra.com</p>
                  <p className="text-xs text-zinc-400 mt-1">support@houseofvastra.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E8D8BA] flex items-center justify-center text-[#775a19] shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#001410] uppercase tracking-wider mb-1">Studio Address</h4>
                  <p className="text-sm text-zinc-600">
                    LOR Flagship Store<br/>
                    123 Couture Avenue,<br/>
                    Bandra West, Mumbai - 400050
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (Right Column) */}
          <div className="md:col-span-3 bg-white p-6 md:p-8 rounded-2xl border border-zinc-100 shadow-sm">
            {status === "success" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <div className="w-16 h-16 bg-[#FAF2E8] rounded-full flex items-center justify-center mb-6 text-[#775a19]">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-serif text-2xl text-[#001410] mb-2">Message Sent</h3>
                <p className="text-zinc-600 text-sm mb-6">
                  Thank you for reaching out. We have received your inquiry and our support team will contact you shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-6 py-3 border border-[#001410] text-[#001410] hover:bg-[#001410] hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3 className="font-serif text-2xl text-[#001410] mb-2">Send us a Message</h3>
                
                {status === "error" && (
                  <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-lg">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#001410]">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full bg-[#fcf9f8] border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#001410]">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-[#fcf9f8] border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#001410]">Subject</label>
                  <select
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-[#fcf9f8] border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] transition-all cursor-pointer appearance-none"
                  >
                    <option value="" disabled>Select a topic</option>
                    <option value="Customer Support">Customer Support / Existing Order</option>
                    <option value="Vendor Inquiry">Boutique Partnership / Vendor Inquiry</option>
                    <option value="Styling Consultation">Styling Consultation</option>
                    <option value="Feedback">Feedback & Suggestions</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#001410]">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    className="w-full bg-[#fcf9f8] border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-2 w-full bg-[#001410] text-white py-4 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#775a19] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Sending..." : "Submit Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
