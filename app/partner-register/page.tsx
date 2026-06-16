"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function PartnerRegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [boutiqueName, setBoutiqueName] = useState(""); // Though our API doesn't take boutiqueName yet, we can update it or just let the API create a default one. Wait, the API creates default. We should just ask for Name, Email, Password. Let's add boutiqueName and update the API if needed? Or just ask for the basics to get them in the door. Let's ask for the basics.
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "VENDOR", // This triggers Vendor profile creation
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Registration failed");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("idle");
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
          Rent Vastra <span className="text-[#E8D8BA] text-xs uppercase tracking-wider font-sans ml-1">Partner</span>
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
            <p className="font-sans text-sm text-zinc-400 mb-6">Welcome to Rent Vastra. Let's start listing your collection.</p>
            <Link
              href="/partner-login"
              className="inline-block w-full bg-[#E8D8BA] text-[#001410] py-3.5 rounded-md font-sans font-semibold text-sm hover:bg-white transition-all"
            >
              Log In to Dashboard
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Password */}
            <div>
              <label className="text-xs md:text-sm font-semibold text-zinc-300 mb-1.5 block">
                Secure Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-md pl-4 pr-12 py-3 font-sans text-sm text-white focus:outline-none focus:border-[#E8D8BA] focus:ring-1 focus:ring-[#E8D8BA] placeholder:text-zinc-600 transition-all"
                  required
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L17.772 17.772m0 0a3 3 0 11-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
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
              {status === "loading" ? "Creating Profile..." : "Become a Partner"}
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
          Rent Vastra Business Partners
        </p>
      </div>

    </div>
  );
}
