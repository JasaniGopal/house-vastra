"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function PartnerLogin() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "otp_sent" | "verifying_otp">("idle");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if ((status === "otp_sent" || status === "verifying_otp") && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, resendTimer]);

  const [error, setError] = useState("");
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEmail = emailOrPhone.includes("@");
    if (!isEmail) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(emailOrPhone)) {
        setError("Please enter a valid business email or a 10-digit mobile number.");
        return;
      }
    }

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: emailOrPhone }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send OTP");
      }

      setStatus("otp_sent");
      setResendTimer(120); // 2 minutes
    } catch (err: any) {
      setStatus("idle");
      setError(err.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }
    
    setStatus("verifying_otp");
    setError("");

    const result = await signIn("otp", {
      identifier: emailOrPhone,
      otp,
      action: "vendor_login",
      redirect: false,
    });

    if (result?.error) {
      setStatus("otp_sent");
      setError(result.error);
    } else {
      setStatus("success");
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl');
      router.push(callbackUrl || "/vendor");
      router.refresh();
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] font-sans">
      
      {/* Top Bar Logo */}
      <div className="w-full flex justify-center pt-12 pb-8">
        <Link
          href="/"
          className="font-serif text-3xl font-bold tracking-tight text-[#001410] hover:text-[#775a19] transition-colors"
        >
          LOR
        </Link>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-[480px] w-full px-6 flex-grow flex flex-col pt-8">
        
        {/* Form Title */}
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#001410] tracking-tight mb-3">
          Partner Login
        </h1>
        <p className="font-sans text-sm md:text-base text-[#414846] mb-10">
          Enter your registered email or phone to access your boutique dashboard.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold rounded-lg">
            {error}
          </div>
        )}

        {status === "success" ? (
          <div className="p-6 bg-white border border-zinc-200 shadow-sm text-center">
            <h2 className="font-serif text-xl font-semibold text-[#001410] mb-2">Authenticating...</h2>
            <p className="font-sans text-sm text-[#5c6462]">Redirecting to your dashboard.</p>
          </div>
        ) : (status === "otp_sent" || status === "verifying_otp") ? (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="mb-4">
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                Enter 6-Digit Code
              </label>
              <p className="text-xs text-zinc-500 mb-3">We sent a secure code to <span className="font-bold">{emailOrPhone}</span></p>
              <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-white border border-zinc-300 rounded-md px-4 py-3.5 font-sans text-2xl tracking-widest text-center focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410] transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={status === "verifying_otp" || otp.length !== 6}
              className="w-full bg-[#001410] text-white py-4 font-sans font-bold text-[13px] uppercase tracking-[0.15em] hover:bg-[#00261f] transition-all disabled:opacity-70 flex justify-center items-center gap-2"
            >
              <span>{status === "verifying_otp" ? "Verifying..." : "Verify & Login"}</span>
            </button>
            <div className="flex flex-col gap-3 mt-4 text-center">
              {resendTimer > 0 ? (
                <p className="text-xs font-semibold text-zinc-500">
                  Resend code in <span className="font-bold text-[#001410]">{Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestOtp}
                  className="text-xs font-bold text-[#775a19] hover:underline uppercase tracking-wider"
                >
                  Resend Code
                </button>
              )}
              <button
                type="button"
                onClick={() => { setStatus("idle"); setOtp(""); setResendTimer(0); }}
                className="w-full text-[#775a19] text-xs font-bold uppercase tracking-wider hover:underline mt-2"
              >
                Go Back
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            
            {/* Email Address or Phone */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                Business Email or Phone
              </label>
              <input
                type="text"
                placeholder="partner@boutique.com or 9876543210"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full bg-white border border-zinc-300 px-4 py-3.5 font-sans text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410] placeholder:text-zinc-400 transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#001410] text-white py-4 font-sans font-bold text-[13px] uppercase tracking-[0.15em] hover:bg-[#00261f] transition-all disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Code...
                  </>
                ) : (
                  "Login as Partner"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Divider */}
        <div className="mt-10 border-t border-zinc-200"></div>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#414846] mb-3">
            Are you a new designer or boutique owner?
          </p>
          <Link
            href="/partner-register"
            className="text-[13px] font-bold text-[#001410] uppercase tracking-[0.1em] underline underline-offset-4 decoration-2 hover:text-[#775a19] hover:decoration-[#775a19] transition-colors"
          >
            Become a Vendor
          </Link>
        </div>

      </div>

      {/* Footer text */}
      <div className="mt-auto pb-8 pt-12 flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secured by Vastra Encryption Gateway
      </div>
    </div>
  );
}
