"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import SlideOutCart from "./Cart/SlideOutCart";

export default function Header() {
  const { data: session } = useSession();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/collections?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMobileExpanded = (category: string) => {
    if (mobileExpanded === category) setMobileExpanded(null);
    else setMobileExpanded(category);
  };

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

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? "bg-white/90 backdrop-blur-md border-b border-[#c1c8c5]/30 py-4 shadow-sm"
            : "bg-[#fcf9f8] py-5"
          }`}
      >
        <div className="mx-auto max-w-[1280px] px-4 md:px-16">
          <div className="flex items-center justify-between">

            {/* Left Side: Burger Menu (Mobile) + Logo */}
            <div className="flex items-center gap-1 md:gap-0">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex p-2 -ml-2 text-[#001410] hover:text-[#775a19] lg:hidden cursor-pointer"
                aria-label="Open navigation drawer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
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
                className="flex items-center"
              >
                <Image src="/images/logo.jpeg" alt="LOR Logo" width={120} height={42} className="object-contain w-[80px] h-auto md:w-[120px]" priority />
              </Link>
            </div>

            {/* Center: Navigation Links (Desktop Only) */}
            <nav className="hidden lg:flex items-center gap-8 h-full">

              {/* Ethnic Dropdown */}
              <div className="relative group h-full flex items-center py-2 cursor-pointer">
                <Link
                  href="/search?category=ethnic"
                  className="text-sm font-sans font-bold tracking-wider text-[#414846] group-hover:text-[#775a19] transition-colors uppercase flex items-center gap-1.5"
                >
                  Ethnic
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute top-[120%] left-1/2 -translate-x-1/2 w-48 bg-white shadow-xl rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 py-2 border border-zinc-100 before:absolute before:-top-6 before:left-0 before:w-full before:h-6">
                  <Link href="/collections?category=Lehengas" className="block px-5 py-2.5 text-sm text-[#414846] hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors font-medium">Lehengas</Link>
                  <Link href="/collections?category=Kurtas & Sets" className="block px-5 py-2.5 text-sm text-[#414846] hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors font-medium">Kurtas & Sets</Link>
                  <Link href="/collections?category=Sarees" className="block px-5 py-2.5 text-sm text-[#414846] hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors font-medium">Sarees</Link>
                  <Link href="/collections?category=Sherwanis" className="block px-5 py-2.5 text-sm text-[#414846] hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors font-medium">Sherwanis</Link>
                </div>
              </div>

              {/* Western Dropdown */}
              <div className="relative group h-full flex items-center py-2 cursor-pointer">
                <Link
                  href="/search?category=western"
                  className="text-sm font-sans font-bold tracking-wider text-[#414846] group-hover:text-[#775a19] transition-colors uppercase flex items-center gap-1.5"
                >
                  Western
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute top-[120%] left-1/2 -translate-x-1/2 w-48 bg-white shadow-xl rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 py-2 border border-zinc-100 before:absolute before:-top-6 before:left-0 before:w-full before:h-6">
                  <Link href="/collections?category=Dresses & Gowns" className="block px-5 py-2.5 text-sm text-[#414846] hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors font-medium">Dresses & Gowns</Link>
                  <Link href="/collections?category=Suits & Blazers" className="block px-5 py-2.5 text-sm text-[#414846] hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors font-medium">Suits & Blazers</Link>
                  <Link href="/collections?category=Tops & Shirts" className="block px-5 py-2.5 text-sm text-[#414846] hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors font-medium">Tops & Shirts</Link>
                  <Link href="/collections?category=Trousers & Skirts" className="block px-5 py-2.5 text-sm text-[#414846] hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors font-medium">Trousers & Skirts</Link>
                </div>
              </div>

              {/* Accessories Dropdown */}
              <div className="relative group h-full flex items-center py-2 cursor-pointer">
                <Link
                  href="/search?category=accessories"
                  className="text-sm font-sans font-bold tracking-wider text-[#414846] group-hover:text-[#775a19] transition-colors uppercase flex items-center gap-1.5"
                >
                  Accessories
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                <div className="absolute top-[120%] left-1/2 -translate-x-1/2 w-48 bg-white shadow-xl rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 py-2 border border-zinc-100 before:absolute before:-top-6 before:left-0 before:w-full before:h-6">
                  <Link href="/collections?category=Jewelry" className="block px-5 py-2.5 text-sm text-[#414846] hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors font-medium">Jewelry</Link>
                  <Link href="/collections?category=Footwear" className="block px-5 py-2.5 text-sm text-[#414846] hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors font-medium">Footwear</Link>
                  <Link href="/collections?category=Bags & Clutches" className="block px-5 py-2.5 text-sm text-[#414846] hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors font-medium">Bags & Clutches</Link>
                  <Link href="/collections?category=Headwear" className="block px-5 py-2.5 text-sm text-[#414846] hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors font-medium">Headwear</Link>
                </div>
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 md:gap-6">
              {/* User Controls (Desktop Only) */}
              <div className="hidden md:flex items-center gap-3">
                {session ? (
                  <div className="relative group flex items-center h-full py-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 text-sm font-sans font-bold tracking-wider text-[#414846] hover:text-[#775a19] transition-colors uppercase"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      {session.user?.name?.split(' ')[0] || "Account"}
                    </Link>
                    <div className="absolute top-[120%] right-0 w-48 bg-white shadow-xl rounded-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 py-2 border border-zinc-100 before:absolute before:-top-6 before:left-0 before:w-full before:h-6">
                      <Link href="/profile" className="block px-5 py-2.5 text-sm text-[#414846] hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors font-medium">My Dashboard</Link>
                      <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left block px-5 py-2.5 text-sm text-[#414846] hover:bg-[#fcf9f8] hover:text-[#775a19] transition-colors font-medium">Log Out</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-sm font-sans font-bold tracking-wider text-[#414846] hover:text-[#775a19] transition-colors uppercase"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="bg-[#001410] text-white text-xs font-sans py-2 px-4 border border-transparent rounded hover:border-[#775a19] hover:bg-[#00261f] transition-all font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>

              {/* Utility Icons */}
              <div className="flex items-center gap-1 sm:gap-3">
                {/* Search */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 text-[#001410] hover:text-[#775a19] transition-colors"
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
                </button>

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="relative p-1.5 text-[#001410] hover:text-[#775a19] transition-colors"
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
                  {wishlistItems.length > 0 && (
                    <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#775a19] text-[9px] font-bold text-white font-sans">
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>

                {/* Cart Bag */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-1.5 text-[#001410] hover:text-[#775a19] transition-colors cursor-pointer"
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
                  {cartItems.length > 0 && (
                    <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#775a19] text-[9px] font-bold text-white font-sans">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay / Backdrop */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        aria-hidden="true"
      />

      {/* Mobile Drawer Menu Container */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[80%] max-w-[320px] bg-white z-50 shadow-2xl flex flex-col p-6 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-5 right-5 text-zinc-500 hover:text-zinc-800 cursor-pointer transition-colors"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* My Account Button */}
        {session && (
          <Link
            href="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 w-full bg-zinc-100 px-4 py-3 rounded-xl text-[#001410] font-sans font-semibold text-base mt-8 hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 text-[#001410]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <div className="flex flex-col">
              <span>My Account</span>
              <span className="text-xs text-zinc-500 font-normal">{session.user?.name}</span>
            </div>
          </Link>
        )}

        {/* Search Input */}
        <form action="/collections" className="relative w-full mt-4 mb-6" onSubmit={() => setIsMobileMenuOpen(false)}>
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </span>
          <input
            type="text"
            name="q"
            placeholder="Search collections..."
            className="w-full bg-zinc-50 border border-zinc-100 rounded-xl pl-10 pr-4 py-2.5 text-sm font-sans focus:outline-none focus:bg-white focus:border-[#775a19]"
          />
        </form>

        {/* Menu Navigation Links */}
        <nav className="flex flex-col gap-2">
          {/* Ethnic Accordion */}
          <div className="flex flex-col">
            <button
              onClick={() => toggleMobileExpanded('ethnic')}
              className="flex items-center justify-between py-3 text-[#414846] font-sans font-medium text-base hover:text-[#775a19] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <svg className="w-5 h-5 text-[#414846]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path d="M5.5 3h13l1.5 4.5L16 9v12H8V9L4 7.5 5.5 3Z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 3v5" />
                </svg>
                <span>Ethnic</span>
              </div>
              <svg className={`w-4 h-4 transition-transform duration-300 ${mobileExpanded === 'ethnic' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded === 'ethnic' ? 'max-h-48 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
              <div className="flex flex-col pl-9 gap-3 mt-1">
                <Link href="/collections?category=Lehengas" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-zinc-500 hover:text-[#775a19] transition-colors">Lehengas</Link>
                <Link href="/collections?category=Kurtas & Sets" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-zinc-500 hover:text-[#775a19] transition-colors">Kurtas & Sets</Link>
                <Link href="/collections?category=Sarees" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-zinc-500 hover:text-[#775a19] transition-colors">Sarees</Link>
                <Link href="/collections?category=Sherwanis" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-zinc-500 hover:text-[#775a19] transition-colors">Sherwanis</Link>
              </div>
            </div>
          </div>

          {/* Western Accordion */}
          <div className="flex flex-col">
            <button
              onClick={() => toggleMobileExpanded('western')}
              className="flex items-center justify-between py-3 text-[#414846] font-sans font-medium text-base hover:text-[#775a19] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <svg className="w-5 h-5 text-[#414846]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a2.5 2.5 0 0 1 4 2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 17.5L12 10l10 7.5A1.5 1.5 0 0 1 21 20H3a1.5 1.5 0 0 1-1-2.5Z" />
                </svg>
                <span>Western</span>
              </div>
              <svg className={`w-4 h-4 transition-transform duration-300 ${mobileExpanded === 'western' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded === 'western' ? 'max-h-48 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
              <div className="flex flex-col pl-9 gap-3 mt-1">
                <Link href="/collections?category=Dresses & Gowns" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-zinc-500 hover:text-[#775a19] transition-colors">Dresses & Gowns</Link>
                <Link href="/collections?category=Suits & Blazers" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-zinc-500 hover:text-[#775a19] transition-colors">Suits & Blazers</Link>
                <Link href="/collections?category=Tops & Shirts" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-zinc-500 hover:text-[#775a19] transition-colors">Tops & Shirts</Link>
                <Link href="/collections?category=Trousers & Skirts" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-zinc-500 hover:text-[#775a19] transition-colors">Trousers & Skirts</Link>
              </div>
            </div>
          </div>

          {/* Accessories Accordion */}
          <div className="flex flex-col">
            <button
              onClick={() => toggleMobileExpanded('accessories')}
              className="flex items-center justify-between py-3 text-[#414846] font-sans font-medium text-base hover:text-[#775a19] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <svg className="w-5 h-5 text-[#414846]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12l4 6-10 12L2 9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 3 8 9l4 12 4-12-3-6" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 9h20" />
                </svg>
                <span>Accessories</span>
              </div>
              <svg className={`w-4 h-4 transition-transform duration-300 ${mobileExpanded === 'accessories' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${mobileExpanded === 'accessories' ? 'max-h-48 opacity-100 mb-2' : 'max-h-0 opacity-0'}`}>
              <div className="flex flex-col pl-9 gap-3 mt-1">
                <Link href="/collections?category=Jewelry" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-zinc-500 hover:text-[#775a19] transition-colors">Jewelry</Link>
                <Link href="/collections?category=Footwear" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-zinc-500 hover:text-[#775a19] transition-colors">Footwear</Link>
                <Link href="/collections?category=Bags & Clutches" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-zinc-500 hover:text-[#775a19] transition-colors">Bags & Clutches</Link>
                <Link href="/collections?category=Headwear" onClick={() => setIsMobileMenuOpen(false)} className="text-sm text-zinc-500 hover:text-[#775a19] transition-colors">Headwear</Link>
              </div>
            </div>
          </div>
          <Link
            href="#how-it-works"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-4 py-3 text-[#414846] font-sans font-medium text-base hover:text-[#775a19] hover:translate-x-1 transition-all"
          >
            <svg className="w-5 h-5 text-[#414846]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span>How it Works</span>
          </Link>
          <Link
            href="/support"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-4 py-3 text-[#414846] font-sans font-medium text-base hover:text-[#775a19] hover:translate-x-1 transition-all"
          >
            <svg className="w-5 h-5 text-[#414846]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            <span>Support</span>
          </Link>
        </nav>

        {/* Footer Login/Signup Buttons */}
        <div className="mt-auto pt-6 flex flex-col gap-3">
          {session ? (
            <button
              onClick={() => { setIsMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}
              className="w-full border border-[#001410] text-[#001410] bg-white py-3.5 text-center font-sans font-bold text-sm rounded-md hover:bg-zinc-100 active:scale-[0.98] transition-all cursor-pointer"
            >
              Log Out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-[#001410] text-white py-3.5 text-center font-sans font-bold text-sm rounded-md hover:bg-[#00261f] active:scale-[0.98] transition-all cursor-pointer"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full border border-[#001410] text-[#001410] bg-white py-3.5 text-center font-sans font-bold text-sm rounded-md hover:bg-[#FAF2E8]/30 active:scale-[0.98] transition-all cursor-pointer"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* GLOBAL SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-[#fcf9f8]/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full border-b border-[#E8D8BA]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-6 flex items-center gap-4">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Lehengas, Designers, or Colors..."
                  className="w-full bg-transparent border-none text-xl md:text-3xl lg:text-4xl font-serif text-[#001410] placeholder:text-zinc-300 focus:outline-none focus:ring-0"
                />
              </form>
              <button onClick={() => setIsSearchOpen(false)} className="shrink-0 p-2 text-[#001410] hover:text-[#775a19] transition-colors rounded-full hover:bg-zinc-100">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-16 w-full flex-1 overflow-y-auto">
            <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6">Trending Searches</h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/collections?category=Lehengas" onClick={() => setIsSearchOpen(false)} className="px-5 py-2.5 bg-white border border-[#E8D8BA] text-[#001410] text-sm rounded-full hover:bg-[#FAF2E8] transition-colors">
                Bridal Lehengas
              </Link>
              <Link href="/collections?category=Sherwanis" onClick={() => setIsSearchOpen(false)} className="px-5 py-2.5 bg-white border border-[#E8D8BA] text-[#001410] text-sm rounded-full hover:bg-[#FAF2E8] transition-colors">
                Ivory Sherwanis
              </Link>
              <Link href="/collections?category=Sarees" onClick={() => setIsSearchOpen(false)} className="px-5 py-2.5 bg-white border border-[#E8D8BA] text-[#001410] text-sm rounded-full hover:bg-[#FAF2E8] transition-colors">
                Sabyasachi Heritage
              </Link>
              <Link href="/collections?occasion=Wedding" onClick={() => setIsSearchOpen(false)} className="px-5 py-2.5 bg-white border border-[#E8D8BA] text-[#001410] text-sm rounded-full hover:bg-[#FAF2E8] transition-colors">
                Wedding Guest
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Slide Out Cart */}
      <SlideOutCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
