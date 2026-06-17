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

      <div className="mb-6 mt-12">
        <h2 className="font-serif text-2xl font-medium text-[#001410] tracking-tight">Financial Overview</h2>
        <p className="text-[#414846] mt-1 text-sm">Platform revenue and payout metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#001410] p-6 rounded-2xl shadow-sm text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-1H9v-2h4v-2h-3c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h1V5h2v1h2v2h-4v2h3c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-1v1h-2z"/></svg>
           </div>
           <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Total Platform Revenue</p>
           <p className="font-serif text-4xl font-bold text-white relative z-10">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Total Vendor Earnings</p>
           <p className="font-serif text-4xl font-bold text-[#001410]">₹{totalVendorEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 shadow-sm relative overflow-hidden">
           <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">Platform Profit (Our Cut)</p>
           <p className="font-serif text-4xl font-bold text-emerald-900">₹{totalPlatformProfit.toLocaleString()}</p>
        </div>
      </div>

      <div className="mb-6 mt-12">
        <h2 className="font-serif text-2xl font-medium text-[#001410] tracking-tight">Order Lifecycle</h2>
        <p className="text-[#414846] mt-1 text-sm">Status of all transactions on the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Total Orders</p>
           <p className="font-serif text-3xl font-bold text-[#001410]">{orderStats._count._all}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Successfully Completed</p>
           <p className="font-serif text-3xl font-bold text-emerald-600">{successfulOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Returned</p>
           <p className="font-serif text-3xl font-bold text-[#775a19]">{returnedOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Cancelled / Failed</p>
           <p className="font-serif text-3xl font-bold text-rose-600">{cancelledOrders}</p>
        </div>
      </div>

    </div>
  );
}
