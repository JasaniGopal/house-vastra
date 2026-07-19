import React from 'react';
import prisma from "@/lib/prisma";
import Link from 'next/link';

export default async function AdminDashboardPage() {
  
  // Calculate quick metrics
  const totalVendors = await prisma.vendor.count();
  const totalLiveProducts = await prisma.product.count({ where: { approvalStatus: "APPROVED" }});
  const pendingApprovals = await prisma.product.count({ where: { approvalStatus: "PENDING" }});

  // Financial and Order Metrics
  const orderStats = await prisma.order.aggregate({
    _count: { _all: true },
    _sum: { totalAmount: true, vendorEarnings: true, platformFee: true }
  });

  const successfulOrders = await prisma.order.count({ where: { status: "COMPLETED" }});
  const returnedOrders = await prisma.order.count({ where: { status: "RETURNED" }});
  const cancelledOrders = await prisma.order.count({ where: { status: "CANCELLED" }});

  const totalRevenue = orderStats._sum.totalAmount || 0;
  const totalVendorEarnings = orderStats._sum.vendorEarnings || 0;
  const totalPlatformProfit = orderStats._sum.platformFee || 0;
  const totalDepositsCollected = totalRevenue - totalVendorEarnings - totalPlatformProfit;

  // Active Deposits calculation
  const activeOrders = await prisma.order.aggregate({
    where: {
      status: { notIn: ["COMPLETED", "RETURNED", "CANCELLED"] }
    },
    _sum: { totalAmount: true, vendorEarnings: true, platformFee: true }
  });

  const activeTotal = activeOrders._sum.totalAmount || 0;
  const activeVendor = activeOrders._sum.vendorEarnings || 0;
  const activePlatform = activeOrders._sum.platformFee || 0;
  const activeDepositsHolding = activeTotal - activeVendor - activePlatform;

  return (
    <div className="p-4 md:p-8">
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Overview</h1>
        <p className="text-[#414846] mt-2 text-sm md:text-base">Platform metrics at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/admin/products" className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:border-[#775a19] hover:shadow-md transition-all group cursor-pointer block">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 group-hover:text-[#775a19] transition-colors">Live Inventory</p>
              <p className="font-serif text-4xl font-bold text-[#001410]">{totalLiveProducts}</p>
            </div>
            <svg className="w-5 h-5 text-zinc-300 group-hover:text-[#775a19] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
        </Link>
        <Link href="/admin/vendors" className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:border-[#775a19] hover:shadow-md transition-all group cursor-pointer block">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 group-hover:text-[#775a19] transition-colors">Total Boutiques</p>
              <p className="font-serif text-4xl font-bold text-[#001410]">{totalVendors}</p>
            </div>
            <svg className="w-5 h-5 text-zinc-300 group-hover:text-[#775a19] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
        </Link>
        
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

      <div className="mb-6 mt-12">
        <h2 className="font-serif text-2xl font-medium text-[#001410] tracking-tight">Financial Overview</h2>
        <p className="text-[#414846] mt-1 text-sm">Platform revenue and payout metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-[#001410] p-6 rounded-2xl shadow-sm text-white relative overflow-hidden md:col-span-1">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-1H9v-2h4v-2h-3c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h1V5h2v1h2v2h-4v2h3c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-1v1h-2z"/></svg>
           </div>
           <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Total Platform Revenue</p>
           <p className="font-serif text-3xl font-bold text-white relative z-10">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <Link href="/admin/vendor-earnings" className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden md:col-span-1 hover:border-[#775a19] hover:shadow-md transition-all group cursor-pointer block">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2 group-hover:text-[#775a19] transition-colors">Total Vendor Earnings</p>
               <p className="font-serif text-3xl font-bold text-[#001410]">₹{totalVendorEarnings.toLocaleString()}</p>
             </div>
             <svg className="w-4 h-4 text-zinc-300 group-hover:text-[#775a19] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
           </div>
        </Link>
        <Link href="/admin/revenue" className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 shadow-sm relative overflow-hidden md:col-span-1 hover:border-emerald-500 hover:shadow-md transition-all group cursor-pointer block">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-2 group-hover:text-emerald-900 transition-colors">Platform Profit (Our Cut)</p>
               <p className="font-serif text-3xl font-bold text-emerald-900">₹{totalPlatformProfit.toLocaleString()}</p>
             </div>
             <svg className="w-4 h-4 text-emerald-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
           </div>
        </Link>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden md:col-span-1">
           <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2">Lifetime Deposits Collected</p>
           <p className="font-serif text-3xl font-bold text-[#001410]">₹{totalDepositsCollected.toLocaleString()}</p>
        </div>
        <div className="bg-[#FAF2E8] p-6 rounded-2xl border border-[#E8D8BA] shadow-sm relative overflow-hidden md:col-span-1">
           <p className="text-[#775a19] text-[10px] font-bold uppercase tracking-wider mb-2">Active Deposits (To Return)</p>
           <p className="font-serif text-3xl font-bold text-[#775a19]">₹{activeDepositsHolding.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-6 mt-12">
        <h2 className="font-serif text-2xl font-medium text-[#001410] tracking-tight">Order Lifecycle</h2>
        <p className="text-[#414846] mt-1 text-sm">Status of all transactions on the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/orders" className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:border-[#775a19] hover:shadow-md transition-all group cursor-pointer block">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 group-hover:text-[#775a19] transition-colors">Total Orders</p>
               <p className="font-serif text-3xl font-bold text-[#001410]">{orderStats._count._all}</p>
             </div>
             <svg className="w-4 h-4 text-zinc-300 group-hover:text-[#775a19] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
           </div>
        </Link>
        <Link href="/admin/orders?status=COMPLETED" className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all group cursor-pointer block">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 group-hover:text-emerald-600 transition-colors">Successfully Completed</p>
               <p className="font-serif text-3xl font-bold text-emerald-600">{successfulOrders}</p>
             </div>
             <svg className="w-4 h-4 text-zinc-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
           </div>
        </Link>
        <Link href="/admin/returns" className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:border-[#775a19] hover:shadow-md transition-all group cursor-pointer block">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 group-hover:text-[#775a19] transition-colors">Returned</p>
               <p className="font-serif text-3xl font-bold text-[#775a19]">{returnedOrders}</p>
             </div>
             <svg className="w-4 h-4 text-zinc-300 group-hover:text-[#775a19] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
           </div>
        </Link>
        <Link href="/admin/orders?status=CANCELLED" className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm hover:border-rose-300 hover:shadow-md transition-all group cursor-pointer block">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 group-hover:text-rose-600 transition-colors">Cancelled / Failed</p>
               <p className="font-serif text-3xl font-bold text-rose-600">{cancelledOrders}</p>
             </div>
             <svg className="w-4 h-4 text-zinc-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
           </div>
        </Link>
      </div>

    </div>
  );
}
