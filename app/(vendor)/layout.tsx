"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [vendorProfile, setVendorProfile] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/partner-login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/vendor/profile");
        if (res.ok) {
          const data = await res.json();
          setVendorProfile(data);
        }
      } catch (error) {
        console.error("Failed to fetch vendor profile", error);
      }
    }
    
    if (session?.user?.role === "VENDOR") {
      fetchProfile();
    }
  }, [session]);

  const navItems = [
    { name: 'Dashboard', href: '/vendor', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'My Products', href: '/vendor/products', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
    { name: 'Orders', href: '/vendor/orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Earnings', href: '/vendor/earnings', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Guidelines', href: '/vendor/guidelines', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Settings', href: '/vendor/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { name: 'Help & Support', href: '/vendor/support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="font-serif text-xl font-bold text-[#001410] tracking-tight">LOR <span className="text-[#775a19] text-xs uppercase tracking-wider font-sans ml-1">Vendor</span></div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-[#001410]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isSidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-[#001410]/40 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-zinc-200 flex flex-col transition-transform duration-300 z-50 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="hidden md:flex p-6 items-center border-b border-zinc-100">
          <Link href="/" className="font-serif text-2xl font-bold text-[#001410] tracking-tight">
            LOR <span className="block text-[#775a19] text-[10px] uppercase tracking-[0.2em] font-sans mt-0.5">Vendor Portal</span>
          </Link>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-1 overflow-y-auto mt-4 md:mt-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive 
                    ? 'bg-[#FAF2E8] text-[#775a19] font-bold shadow-sm border border-[#E8D8BA]' 
                    : 'text-zinc-500 hover:text-[#001410] hover:bg-zinc-50 border border-transparent'
                }`}
              >
                <svg className={`w-5 h-5 ${isActive ? 'text-[#775a19]' : 'text-zinc-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-zinc-100 mb-safe">
          <div className="flex items-center gap-3 px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="w-8 h-8 rounded-full bg-[#001410] text-white flex items-center justify-center font-serif font-bold text-xs shrink-0">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'V'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-[#001410] truncate">{session?.user?.name || 'Loading...'}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider truncate">
                {vendorProfile?.boutiqueName || 'Boutique Partner'}
              </p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/partner-login" })} className="w-full flex items-center gap-2 mt-4 px-4 py-2 text-xs text-zinc-400 hover:text-[#001410] transition-colors font-bold uppercase tracking-wider">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
