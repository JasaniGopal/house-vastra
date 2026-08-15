"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const isEmail = emailOrPhone.includes("@");
    if (!isEmail) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(emailOrPhone)) {
        setError("Please enter a valid email or a 10-digit mobile number.");
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

      setStep(2);
      setStatus("idle");
      setResendTimer(120); // 2 minutes
    } catch (err: any) {
      setStatus("idle");
      setError(err.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }
    // Proceed to password step
    setError("");
    setStep(3);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: emailOrPhone, otp, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to reset password");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("idle");
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fcf9f8] text-[#1c1b1b] font-sans">
      
      {/* Top Bar Logo */}
      <div className="mx-auto max-w-[420px] w-full px-6 pt-10">
        <Link
          href="/"
          className="font-serif text-2xl font-bold tracking-tight text-[#001410] hover:text-[#775a19] transition-colors"
        >
          LOR
        </Link>
      </div>

      {/* Main Card/Container */}
      <div className="mx-auto max-w-[420px] w-full px-6 py-6 flex-grow flex flex-col justify-center">
        
        {/* Form Title */}
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#001410] tracking-tight mb-2">
          Reset Password
        </h1>
        <p className="font-sans text-sm text-[#5c6462] leading-relaxed mb-8">
          {step === 1 && "Enter your registered email or phone number and we will send you a code to reset your password."}
          {step === 2 && `We sent a 6-digit code to ${emailOrPhone}.`}
          {step === 3 && status !== "success" && "Create a new strong password."}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold rounded-lg">
            {error}
          </div>
        )}

        {status === "success" ? (
          <div className="p-6 bg-white border border-zinc-200 rounded-xl text-center shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-[#001410] mb-2">Password Reset!</h2>
            <p className="font-sans text-sm text-[#5c6462] mb-6">Your password has been successfully updated. You can now log in with your new password.</p>
            <Link
              href="/login"
              className="inline-block w-full bg-[#001410] text-white py-3.5 rounded-md font-sans font-semibold text-sm hover:bg-[#00261f] transition-all"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            {step === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-5">
                <div>
                  <label className="text-xs md:text-sm font-semibold text-[#001410] mb-1.5 block">
                    Email or 10-digit Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="ananya@example.com or 9876543210"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] placeholder:text-zinc-400 transition-all"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-[#001410] text-white py-3.5 rounded-md font-sans font-semibold text-sm md:text-base hover:bg-[#00261f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Sending Code..." : "Send Reset Code"}
                  </button>
                </div>
                
                <div className="text-center pt-4">
                  <p className="text-xs text-[#5c6462]">
                    Remembered your password?{" "}
                    <Link href="/login" className="font-semibold text-[#001410] hover:text-[#775a19] transition-colors">
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="text-xs md:text-sm font-semibold text-[#001410] mb-1.5 block">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 font-sans text-2xl tracking-widest text-center focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={otp.length !== 6}
                  className="w-full bg-[#001410] text-white py-3.5 rounded-md font-sans font-semibold text-sm hover:bg-[#00261f] active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  Verify Code
                </button>
                
                <div className="flex flex-col gap-3 mt-4 text-center">
                  {resendTimer > 0 ? (
                    <p className="text-xs font-semibold text-zinc-500">
                      Resend code in <span className="font-bold text-[#001410]">{Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequestOtp()}
                      className="text-xs font-bold text-[#775a19] hover:underline"
                    >
                      Didn't receive a code? Resend OTP
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setStep(1); setOtp(""); setResendTimer(0); setError(""); }}
                    className="w-full text-[#775a19] text-sm font-bold hover:underline"
                  >
                    Go Back
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="text-xs md:text-sm font-semibold text-[#001410] mb-1.5 block">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] placeholder:text-zinc-400 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#001410] transition-colors p-1"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs md:text-sm font-semibold text-[#001410] mb-1.5 block">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] placeholder:text-zinc-400 transition-all"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-[#001410] text-white py-3.5 rounded-md font-sans font-semibold text-sm md:text-base hover:bg-[#00261f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Updating..." : "Reset Password"}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {/* Optional bottom spacing for mobile */}
      <div className="pb-10"></div>
    </div>
  );
}
