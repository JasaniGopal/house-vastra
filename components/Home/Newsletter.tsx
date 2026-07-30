"use client";

import React, { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Network error. Please try again later.");
    }
  };

  return (
    <section className="w-full py-20 bg-[#001410] text-white overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-6 md:px-16 flex flex-col items-center text-center">
        
        {/* Title */}
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
          Join the Inner Circle
        </h2>

        {/* Subtitle */}
        <p className="font-sans text-sm md:text-base text-[#c1c8c5] max-w-[500px] leading-relaxed mb-8">
          Subscribe to receive early access to new collections and exclusive styling tips.
        </p>

        {/* Form Container */}
        {status === "success" ? (
          <div className="w-full max-w-[500px] p-4 bg-white/5 border border-white/10 rounded-lg animate-fade-in">
            <p className="font-sans text-sm md:text-base text-[#c6ede2] font-semibold">
              Thank you for subscribing! Welcome to the Inner Circle.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[520px] flex flex-col sm:flex-row gap-3 items-stretch justify-center"
          >
            <div className="flex-grow relative">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                disabled={status === "loading"}
                className="w-full h-full px-5 py-3.5 bg-transparent border border-white/20 rounded-md focus:border-[#775a19] focus:outline-none text-white font-sans text-sm md:text-base placeholder:text-[#5c6462] transition-colors duration-300 disabled:opacity-50"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-3.5 bg-[#775a19] text-white font-sans font-semibold rounded-md hover:bg-[#8e6e23] active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed transition-all duration-300 disabled:opacity-50 text-sm md:text-base whitespace-nowrap"
            >

              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 font-sans text-xs md:text-sm text-red-400">
            {errorMessage}
          </p>
        )}

      </div>
    </section>
  );
}
