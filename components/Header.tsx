"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount] = useState(2); // Mock cart items
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? "bg-white/90 backdrop-blur-md border-b border-outline-variant/30 py-4 shadow-sm"
            : "bg-surface py-5"
          }`}
      >
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center justify-between">

            {/* Left Side: Burger Menu (Mobile Only) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex p-2 text-primary hover:text-secondary lg:hidden"
              aria-label="Open navigation drawer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            {/* Brand Logo (Serif font) */}
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-tight text-primary hover:text-[#00261f] transition-colors"
            >
              Rent Vastra
            </Link>

            {/* Center: Navigation Links (Desktop Only) */}
            <nav className="hidden lg:flex items-center gap-md">
              <Link
                href="/search?category=ethnic"
                className="text-label-lg text-on-surface-variant hover:text-secondary transition-colors font-bold uppercase"
              >
                Ethnic
              </Link>
              <Link
                href="/search?category=western"
                className="text-label-lg text-on-surface-variant hover:text-secondary transition-colors font-bold uppercase"
              >
                Western
              </Link>
              <Link
                href="/search?category=accessories"
                className="text-label-lg text-on-surface-variant hover:text-secondary transition-colors font-bold uppercase"
              >
                Accessories
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-sm md:gap-md">
              {/* User Controls (Desktop Only) */}
              <div className="hidden md:flex items-center gap-sm">
                <Link
                  href="/login"
                  className="text-label-lg text-on-surface-variant hover:text-secondary transition-colors font-bold uppercase"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-white text-label-md py-2 px-4 border border-transparent rounded hover:border-secondary hover:bg-[#00261f] transition-all font-bold uppercase tracking-wider"
                >
                  Register
                </Link>
              </div>

              {/* Utility Icons */}
              <div className="flex items-center gap-xs sm:gap-sm">
                {/* Search */}
                <Link
                  href="/search"
                  className="p-1.5 text-primary hover:text-secondary transition-colors"
                  aria-label="Search outfits"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </Link>

                {/* Wishlist */}
                <Link
                  href="/profile?tab=wishlist"
                  className="p-1.5 text-primary hover:text-secondary transition-colors"
                  aria-label="View wishlist"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </Link>

                {/* Cart Bag */}
                <Link
                  href="/checkout"
                  className="relative p-1.5 text-primary hover:text-secondary transition-colors"
                  aria-label="View shopping cart"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white font-sans">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

    </>
  );
}
