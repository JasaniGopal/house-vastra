import React from 'react';
import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function VendorDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
    redirect("/partner-login");
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    redirect("/partner-login");
  }

  // Fetch earnings
  const earningsData = await prisma.order.aggregate({
    where: {
      product: { vendorId: vendor.id },
      status: { in: ["COMPLETED", "RETURNED"] }
    },
    _sum: { vendorEarnings: true }
  });
  const totalEarnings = earningsData._sum.vendorEarnings || 0;

  // Fetch active rentals
  const activeRentals = await prisma.order.count({
    where: {
      product: { vendorId: vendor.id },
      status: { in: ["PREPARING", "DISPATCHED", "IN_USE"] }
    }
  });

  // Fetch actual metrics
  const totalInventory = await prisma.product.count({
    where: { vendorId: vendor.id }
  });

  const pendingApprovals = await prisma.product.count({
    where: { vendorId: vendor.id, approvalStatus: "PENDING" }
  });

  // Fetch recent uploads instead of fake orders
  const recentUploads = await prisma.product.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { category: true, images: true }
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Dashboard Overview</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">
            Welcome back, {session.user.name}. Here's what's happening with {vendor.boutiqueName || 'your boutique'} today.
          </p>
        </div>
        <Link href="/vendor/products/new" className="bg-[#001410] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] hover:shadow-lg transition-all w-fit">
          + Add New Outfit
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        {/* Metric 1 (Total Earnings - LIVE) */}
        <Link href="/vendor/earnings" className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group hover:border-[#775a19] transition-all cursor-pointer block">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <svg className="w-16 h-16 text-[#775a19]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-1H9v-2h4v-2h-3c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h1V5h2v1h2v2h-4v2h3c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-1v1h-2z"/></svg>
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 group-hover:text-[#775a19] transition-colors">Total Earnings</p>
              <p className="font-serif text-3xl font-bold text-[#001410]">₹{totalEarnings.toLocaleString("en-IN")}</p>
            </div>
            <svg className="w-5 h-5 text-zinc-300 group-hover:text-[#775a19] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="text-zinc-400 text-xs">View payouts</span>
          </div>
        </Link>

        {/* Metric 2 (Active Rentals - LIVE) */}
        <Link href="/vendor/orders" className="bg-[#001410] p-6 rounded-2xl border border-[#00261f] shadow-lg relative overflow-hidden group text-white hover:border-[#775a19] transition-all cursor-pointer block">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 group-hover:text-[#775a19] transition-colors">Active Rentals</p>
              <p className="font-serif text-3xl font-bold text-white">{activeRentals}</p>
            </div>
            <svg className="w-5 h-5 text-zinc-500 group-hover:text-[#775a19] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="text-zinc-400 text-xs">Currently with customers</span>
          </div>
        </Link>

        {/* Metric 3 (Pending Approvals - LIVE) */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-16 h-16 text-[#775a19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Pending Approval</p>
          <p className="font-serif text-3xl font-bold text-[#001410] relative z-10">{pendingApprovals}</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
             {pendingApprovals > 0 ? (
               <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[10px] font-bold">Requires Admin Action</span>
             ) : (
               <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">All caught up</span>
             )}
          </div>
        </div>

        {/* Metric 4 (Total Inventory - LIVE) */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <svg className="w-16 h-16 text-[#775a19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Total Inventory</p>
          <p className="font-serif text-3xl font-bold text-[#001410] relative z-10">{totalInventory}</p>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="text-zinc-400 text-xs">Total outfits uploaded</span>
          </div>
        </div>
      </div>

      {/* Recent Uploads Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium text-[#001410]">Recent Uploads</h2>
          <Link href="/vendor/products" className="text-xs font-bold uppercase tracking-wider text-[#775a19] hover:text-[#001410] transition-colors">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          {recentUploads.length === 0 ? (
            <div className="p-12 text-center text-zinc-500">
              <p>You haven't uploaded any outfits yet.</p>
              <Link href="/vendor/products/new" className="text-[#775a19] font-bold mt-2 inline-block hover:underline">Upload your first outfit</Link>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Outfit Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Your Rent/Day</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-[#414846]">
                {recentUploads.map((product) => (
                  <tr key={product.id} className="hover:bg-[#fcf9f8] transition-colors group">
                    <td className="px-6 py-4 font-bold text-[#001410]">
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0].url} alt={product.name} className="w-10 h-10 rounded-md object-cover shrink-0 border border-zinc-200" />
                        ) : (
                          <div className="w-10 h-10 bg-zinc-100 rounded-md shrink-0 border border-zinc-200"></div>
                        )}
                        <span className="line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.category.name}</td>
                    <td className="px-6 py-4 font-bold text-[#001410]">₹{product.vendorExpectedRent?.toString()}</td>
                    <td className="px-6 py-4">
                      {product.approvalStatus === "APPROVED" && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Live</span>
                      )}
                      {product.approvalStatus === "PENDING" && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Pending Review</span>
                      )}
                      {product.approvalStatus === "REJECTED" && (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Rejected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
