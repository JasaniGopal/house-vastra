"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
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
        
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#001410] tracking-tight mb-2">
          New Password
        </h1>
        <p className="font-sans text-sm text-[#5c6462] leading-relaxed mb-8">
          Enter your new password below to securely access your account.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold rounded-lg">
            {error}
          </div>
        )}

        {status === "success" ? (
          <div className="p-6 bg-white border border-zinc-200 rounded-xl text-center shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-[#001410] mb-2">Password Reset!</h2>
            <p className="font-sans text-sm text-[#5c6462] mb-6">Your password has been successfully updated.</p>
            <Link
              href="/login"
              className="inline-block w-full bg-[#001410] text-white py-3.5 rounded-md font-sans font-semibold text-sm hover:bg-[#00261f] transition-all"
            >
              Log In Now
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="text-xs md:text-sm font-semibold text-[#001410] mb-1.5 block">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] placeholder:text-zinc-400 transition-all"
                required
                disabled={!token}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs md:text-sm font-semibold text-[#001410] mb-1.5 block">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-md px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19] placeholder:text-zinc-400 transition-all"
                required
                disabled={!token}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={status === "loading" || !token}
                className="w-full bg-[#001410] text-white py-3.5 rounded-md font-sans font-semibold text-sm md:text-base hover:bg-[#00261f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="pb-10"></div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
