import React from 'react';
import prisma from "@/lib/prisma";
import Link from 'next/link';

export default async function AdminDashboardPage() {
  
  // Calculate quick metrics
  const totalVendors = await prisma.vendor.count();
  const totalLiveProducts = await prisma.product.count({ where: { approvalStatus: "APPROVED" }});
  const pendingApprovals = await prisma.product.count({ where: { approvalStatus: "PENDING" }});

  return (
    <div className="p-4 md:p-8">
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Overview</h1>
        <p className="text-[#414846] mt-2 text-sm md:text-base">Platform metrics at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Live Inventory</p>
          <p className="font-serif text-4xl font-bold text-[#001410]">{totalLiveProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Total Boutiques</p>
          <p className="font-serif text-4xl font-bold text-[#001410]">{totalVendors}</p>
        </div>
        
        {/* Action Required Card */}
        <div className={`p-6 rounded-2xl border shadow-sm relative overflow-hidden ${pendingApprovals > 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-zinc-200'}`}>
          {pendingApprovals > 0 && (
            <div className="absolute top-0 right-0 w-16 h-16 bg-rose-100 rounded-bl-full flex items-start justify-end p-3">
               <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
            </div>
          )}
          <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${pendingApprovals > 0 ? 'text-rose-600' : 'text-zinc-500'}`}>Action Required</p>
          <div className="flex items-end justify-between">
            <div>
              <p className={`font-serif text-4xl font-bold ${pendingApprovals > 0 ? 'text-rose-900' : 'text-[#001410]'}`}>{pendingApprovals}</p>
              <p className={`text-xs font-medium mt-1 ${pendingApprovals > 0 ? 'text-rose-700' : 'text-zinc-500'}`}>Pending Approvals</p>
            </div>
            {pendingApprovals > 0 && (
              <Link href="/admin/approvals" className="bg-rose-600 text-white text-[10px] uppercase font-bold tracking-wider px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors">
                Review Now
              </Link>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
