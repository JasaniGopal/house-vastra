import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from 'next/link';
import LogoutButton from '@/app/components/LogoutButton';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Military-grade security: only ADMIN allowed
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/partner-login");
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] flex flex-col md:flex-row font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-zinc-200 flex flex-col shadow-sm shrink-0">
        <div className="p-6 md:p-8 flex items-center gap-3 border-b border-zinc-100">
          <div className="w-8 h-8 bg-[#775a19] rounded-md flex items-center justify-center shrink-0">
            <span className="text-white font-serif font-bold text-sm">A</span>
          </div>
          <div>
            <span className="font-serif text-lg font-bold text-[#001410] tracking-tight leading-none block">Admin Portal</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#775a19]">System Control</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          <Link href="/admin/approvals" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#414846] hover:bg-zinc-50 hover:text-[#001410] transition-colors group">
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-[#775a19] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Pending Approvals
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-100">
           <div className="bg-zinc-50 rounded-xl p-4 flex flex-col items-center justify-center text-center">
             <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center mb-2">
               <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
               </svg>
             </div>
             <p className="text-xs font-bold text-[#001410] w-full truncate px-2">{session.user.name || session.user.email}</p>
             <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1 mb-3">Admin</p>
             <LogoutButton />
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#fcf9f8]">
        {children}
      </main>
      
    </div>
  );
}
