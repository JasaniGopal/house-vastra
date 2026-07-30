"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const isEmail = emailOrPhone.includes("@");
    if (!isEmail) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(emailOrPhone)) {
        setStatus("idle");
        setError("Please enter a valid email or a 10-digit mobile number.");
        return;
      }
    }

    const result = await signIn("credentials", {
      emailOrPhone,
      password,
      redirect: false,
    });

    if (result?.error) {
      setStatus("idle");
      setError("Invalid email or password.");
    } else {
      setStatus("success");
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl');
      router.push(callbackUrl || "/");
      router.refresh();
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
          Welcome Back
        </h1>
        <p className="font-sans text-sm text-[#5c6462] leading-relaxed mb-8">
          Log in to access your curated closet and bookings.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold rounded-lg">
            {error}
          </div>
        )}

        {status === "success" ? (
          <div className="p-6 bg-white border border-zinc-200 rounded-xl text-center shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-[#001410] mb-2">Welcome Back!</h2>
            <p className="font-sans text-sm text-[#5c6462] mb-6">Successfully logged in. Let&apos;s find your next dream outfit.</p>
            <Link
              href="/"
              className="inline-block w-full bg-[#001410] text-white py-3.5 rounded-md font-sans font-semibold text-sm hover:bg-[#00261f] transition-all"
            >
              Go to Homepage
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address or Phone */}
            <div>
              <label className="text-xs md:text-sm font-semibold text-[#001410] mb-1.5 block">
                Email or Mobile Number
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs md:text-sm font-semibold text-[#001410] block">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-semibold text-[#775a19] hover:underline">
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] placeholder:text-zinc-400 transition-all"
                  required
                />
                
                {/* Eye Icon Button */}
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

            {/* Remember me checkbox */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-zinc-300 text-[#001410] focus:ring-[#775a19] cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-3 text-xs md:text-sm font-sans text-zinc-500 cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-[#001410] text-white py-3.5 rounded-md font-sans font-semibold text-sm hover:bg-[#00261f] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{status === "loading" ? "Logging In..." : "Log In"}</span>
              {status !== "loading" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
          </form>
        )}

        {/* Separator */}
        <div className="relative flex py-6 items-center">
          <div className="flex-grow border-t border-zinc-200"></div>
          <span className="flex-shrink mx-4 text-[10px] font-sans font-bold text-zinc-400 tracking-wider">
            OR CONTINUE WITH
          </span>
          <div className="flex-grow border-t border-zinc-200"></div>
        </div>

        {/* Google OAuth button */}
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: '/' })}
          className="w-full border border-zinc-200 bg-white rounded-md py-3 font-sans font-semibold text-sm flex items-center justify-center gap-3 hover:bg-zinc-50 active:scale-[0.99] transition-all cursor-pointer shadow-sm text-zinc-700"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Google</span>
        </button>

        {/* Redirect toggle Link */}
        <p className="mt-8 text-center text-xs md:text-sm font-sans text-zinc-500">
          Already have an account?{" "}
          <Link href="/register" className="font-bold text-[#001410] hover:text-[#775a19] transition-colors">
            Sign Up
          </Link>
        </p>

      </div>

      {/* Footer Block */}
      <footer className="mx-auto max-w-[420px] w-full px-6 pb-10 flex flex-col items-center gap-4 text-center">
        
        {/* Help / Policies links */}
        <div className="flex flex-wrap gap-4 text-xs font-sans text-zinc-500 justify-center">
          <Link href="/help" className="hover:text-[#001410] transition-colors">Help Center</Link>
          <Link href="/sustainability" className="hover:text-[#001410] transition-colors">Sustainability</Link>
          <Link href="/curation" className="hover:text-[#001410] transition-colors">Curation Policy</Link>
        </div>

        {/* Language selector block */}
        <div className="flex items-center gap-1.5 text-xs font-sans text-zinc-500">
          <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.003 9.003 0 018.716 2.253M12 3a9.003 9.003 0 00-8.716 2.253m0 0A9.003 9.003 0 0112 12m0 0c2.485 0 4.5-4.03 4.5-9M12 12c-2.485 0-4.5-4.03-4.5-9" />
          </svg>
          <span>English (Global)</span>
        </div>

      </footer>

    </div>
  );
}
