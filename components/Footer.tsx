import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#fcf9f8] text-[#1c1b1b] pt-16 pb-8 border-t border-[#c1c8c5]/30">
      <div className="mx-auto max-w-[1280px] px-4 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12 pb-12">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#001410] hover:text-[#775a19] transition-colors">
              Rent Vastra
            </Link>
            <p className="text-sm font-sans text-[#414846] leading-relaxed max-w-[240px]">
              Curated designer ethnic wear for your defining moments. Rent luxury, sustainably.
            </p>
            {/* Social & Share Icons */}
            <div className="flex items-center gap-3 mt-1">
              {/* Instagram Icon */}
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#1c1b1b] hover:text-[#775a19] transition-colors p-1" 
                aria-label="Instagram"
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
                    d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316A2.192 2.192 0 0 0 14.502 4h-5c-.7 0-1.343.372-1.681.977l-.994 1.198Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15.75a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                  />
                </svg>
              </a>

              {/* Share Icon */}
              <button 
                className="text-[#1c1b1b] hover:text-[#775a19] transition-colors p-1" 
                aria-label="Share page"
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
                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-3">
            <h4 className="font-sans text-sm font-bold text-[#001410] tracking-wide">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-1">
              <Link href="/collections" className="text-sm font-sans text-[#414846] hover:text-[#001410] transition-colors">
                All Collections
              </Link>
              <Link href="/how-it-works" className="text-sm font-sans text-[#414846] hover:text-[#001410] transition-colors">
                How it Works
              </Link>
              <Link href="/about" className="text-sm font-sans text-[#414846] hover:text-[#001410] transition-colors">
                About Us
              </Link>
              <Link href="/blog" className="text-sm font-sans text-[#414846] hover:text-[#001410] transition-colors">
                Blog
              </Link>
            </nav>
          </div>

          {/* Support Column */}
          <div className="flex flex-col gap-3">
            <h4 className="font-sans text-sm font-bold text-[#001410] tracking-wide">
              Support
            </h4>
            <nav className="flex flex-col gap-1">
              <Link href="/faqs" className="text-sm font-sans text-[#414846] hover:text-[#001410] transition-colors">
                FAQs
              </Link>
              <Link href="/shipping" className="text-sm font-sans text-[#414846] hover:text-[#001410] transition-colors">
                Shipping & Returns
              </Link>
              <Link href="/terms" className="text-sm font-sans text-[#414846] hover:text-[#001410] transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm font-sans text-[#414846] hover:text-[#001410] transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>

          {/* Contact Us Column */}
          <div className="flex flex-col gap-3">
            <h4 className="font-sans text-sm font-bold text-[#001410] tracking-wide">
              Contact Us
            </h4>
            <div className="flex flex-col gap-1">
              {/* Email */}
              <a 
                href="mailto:hello@rentvastra.com" 
                className="flex items-center gap-1 text-sm font-sans text-[#414846] hover:text-[#001410] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <span>hello@rentvastra.com</span>
              </a>

              {/* Phone */}
              <a 
                href="tel:+919876543210" 
                className="flex items-center gap-1 text-sm font-sans text-[#414846] hover:text-[#001410] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a20.373 20.373 0 0 1-6.705-6.705c-.386-.44-.223-.927.153-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                <span>+91 98765 43210</span>
              </a>

              {/* Location */}
              <div className="flex items-center gap-1 text-sm font-sans text-[#414846]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright banner */}
        <div className="mt-6 pt-6 border-t border-[#c1c8c5]/20">
          <p className="text-sm text-[#414846] font-sans">
            &copy; 2024 Rent Vastra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
