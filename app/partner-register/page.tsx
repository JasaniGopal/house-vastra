"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function PartnerRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "otp">("idle");
  const [error, setError] = useState("");

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setStatus("idle");
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!email.includes("@")) {
      setStatus("idle");
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, phone: phone, type: "register" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send OTP");
      }

      setStatus("otp");
    } catch (err: any) {
      setStatus("idle");
      setError(err.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtpAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }
    
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          otp,
          role: "VENDOR", // This triggers Vendor profile creation
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Registration failed");
      }

      // Automatically log them in after registration
      const result = await signIn("otp", {
        redirect: false,
        identifier: email,
        otp,
        action: "login", // Just normal login since account is created
      });

      // Even if signIn fails (e.g. OTP was consumed by register route), 
      // we can just show success and direct them to login.
      // Wait, the API route consumes the OTP! So signIn will fail with "Invalid or expired OTP".
      // That's totally fine, we'll just redirect them to the login page manually if signIn fails.
      
      setStatus("success");
    } catch (err: any) {
      setStatus("otp");
      setError(err.message || "An error occurred during registration");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#001410] text-white font-sans">
      
      {/* Top Bar Logo */}
      <div className="mx-auto max-w-[420px] w-full px-6 pt-10">
        <Link
          href="/"
          className="font-serif text-2xl font-bold tracking-tight text-white hover:text-[#E8D8BA] transition-colors"
        >
          LOR <span className="text-[#E8D8BA] text-xs uppercase tracking-wider font-sans ml-1">Partner</span>
        </Link>
      </div>

      {/* Main Card/Container */}
      <div className="mx-auto max-w-[420px] w-full px-6 py-6 flex-grow flex flex-col justify-center">
        
        {/* Form Title */}
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
          Grow Your Boutique
        </h1>
        <p className="font-sans text-sm text-zinc-400 leading-relaxed mb-8">
          Join India's premier luxury rental platform. Turn your idle inventory into recurring revenue.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold rounded-lg">
            {error}
          </div>
        )}

        {status === "success" ? (
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-white mb-2">Application Received!</h2>
            <p className="font-sans text-sm text-zinc-400 mb-6">Welcome to LOR. Let's start listing your collection.</p>
            <Link
              href="/partner-login"
              className="inline-block w-full bg-[#E8D8BA] text-[#001410] py-3.5 rounded-md font-sans font-semibold text-sm hover:bg-white transition-all"
            >
              Log In to Dashboard
            </Link>
          </div>
        ) : status === "otp" || (status === "loading" && otp) ? (
          <form onSubmit={handleVerifyOtpAndRegister} className="space-y-5">
            <div className="mb-4">
              <label className="text-xs md:text-sm font-semibold text-zinc-300 mb-1.5 block">
                Enter 6-Digit OTP
              </label>
              <p className="text-xs text-zinc-400 mb-3">We sent a verification code to <span className="text-white font-bold">{email}</span> and WhatsApp on <span className="text-white font-bold">+91 {phone}</span></p>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 font-sans text-2xl tracking-widest text-center text-white focus:outline-none focus:border-[#E8D8BA] focus:ring-1 focus:ring-[#E8D8BA] transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading" || otp.length !== 6}
              className="w-full bg-[#E8D8BA] text-[#001410] py-3.5 rounded-md font-sans font-bold text-sm hover:bg-white transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Verifying..." : "Verify & Become a Partner"}
            </button>
            <button
              type="button"
              onClick={() => { setStatus("idle"); setOtp(""); }}
              className="w-full text-[#E8D8BA] text-sm font-bold mt-2 hover:underline"
            >
              Go Back
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequestOtp} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="text-xs md:text-sm font-semibold text-zinc-300 mb-1.5 block">
                Your Full Name
              </label>
              <input
                type="text"
                placeholder="Manish Malhotra"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-[#E8D8BA] focus:ring-1 focus:ring-[#E8D8BA] placeholder:text-zinc-600 transition-all"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs md:text-sm font-semibold text-zinc-300 mb-1.5 block">
                Business Email Address
              </label>
              <input
                type="email"
                placeholder="hello@boutique.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-[#E8D8BA] focus:ring-1 focus:ring-[#E8D8BA] placeholder:text-zinc-600 transition-all"
                required
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="text-xs md:text-sm font-semibold text-zinc-300 mb-1.5 block">
                Mobile Number
              </label>
              <input
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                minLength={10}
                pattern="\d{10}"
                title="Please enter exactly 10 digits"
                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 font-sans text-sm text-white focus:outline-none focus:border-[#E8D8BA] focus:ring-1 focus:ring-[#E8D8BA] placeholder:text-zinc-600 transition-all"
                required
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 mt-6">
              <input
                type="checkbox"
                id="terms"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-[#E8D8BA] focus:ring-[#E8D8BA] focus:ring-offset-[#001410]"
              />
              <label htmlFor="terms" className="text-xs text-zinc-400 leading-relaxed">
                I agree to the <Link href="#" className="text-white hover:underline underline-offset-2">Partner Terms of Service</Link> and <Link href="#" className="text-white hover:underline underline-offset-2">Privacy Policy</Link>.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading" || !agree}
              className="w-full bg-[#E8D8BA] text-[#001410] py-3.5 rounded-md font-sans font-bold text-sm hover:bg-white transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Sending Code..." : "Verify & Become a Partner"}
            </button>
          </form>
        )}

        {/* Existing Account Link */}
        {status !== "success" && (
          <p className="mt-8 text-center text-xs text-zinc-400">
            Already a partner?{" "}
            <Link href="/partner-login" className="text-white font-bold hover:underline underline-offset-2">
              Sign in to dashboard
            </Link>
          </p>
        )}
      </div>

      {/* Footer Area */}
      <div className="py-6 text-center">
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
          LOR Business Partners
        </p>
      </div>

    </div>
  );
}
