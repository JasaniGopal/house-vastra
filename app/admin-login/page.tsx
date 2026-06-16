"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setStatus("idle");
      setError("Invalid admin credentials. Access Denied.");
    } else {
      setStatus("success");
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#001410] font-sans">
      
      {/* Top Bar Logo */}
      <div className="w-full flex justify-center pt-12 pb-8">
        <Link
          href="/"
          className="font-serif text-3xl font-bold tracking-tight text-white hover:text-[#A8813C] transition-colors"
        >
          RENT VASTRA
        </Link>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-[480px] w-full px-6 flex-grow flex flex-col pt-8">
        
        {/* Form Title */}
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-white tracking-tight mb-3">
          Admin Login
        </h1>
        <p className="font-sans text-sm md:text-base text-zinc-400 mb-10">
          Enter your superuser credentials to access God Mode.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-rose-950/50 border border-rose-900 text-rose-400 text-sm font-bold rounded-lg">
            {error}
          </div>
        )}

        {status === "success" ? (
          <div className="p-6 bg-zinc-900 border border-zinc-800 shadow-lg text-center">
            <h2 className="font-serif text-xl font-semibold text-white mb-2">System Override Granted</h2>
            <p className="font-sans text-sm text-zinc-400">Redirecting to control center...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Address */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-300 mb-2 block">
                Admin Email
              </label>
              <input
                type="email"
                placeholder="admin@rentvastra.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-white px-4 py-3.5 font-sans text-sm focus:outline-none focus:border-[#A8813C] focus:ring-1 focus:ring-[#A8813C] placeholder:text-zinc-600 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-zinc-300 block">
                  Access Key
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white pl-4 pr-12 py-3.5 font-sans text-sm focus:outline-none focus:border-[#A8813C] focus:ring-1 focus:ring-[#A8813C] placeholder:text-zinc-600 transition-all"
                  required
                />
                
                {/* Eye Icon Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-600 hover:text-white cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#A8813C] text-[#001410] py-4 font-sans font-bold text-[13px] uppercase tracking-[0.15em] hover:bg-[#8A6A32] transition-all disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-[#001410]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  "Login as Admin"
                )}
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Footer text */}
      <div className="mt-auto pb-8 pt-12 flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secured by Vastra Encryption Gateway
      </div>
    </div>
  );
}
