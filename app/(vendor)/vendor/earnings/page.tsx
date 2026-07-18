import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from 'next/link';

export default async function VendorEarningsPage() {
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

  // 1. Fetch completed/returned orders to calculate earnings
  const orders = await prisma.order.findMany({
    where: {
      product: { vendorId: vendor.id },
      status: { in: ["COMPLETED", "RETURNED"] }
    },
    include: {
      product: true
    },
    orderBy: { createdAt: "desc" }
  });

  let totalLifetimeEarnings = 0;
  let currentPendingPayout = 0;

  orders.forEach(order => {
    totalLifetimeEarnings += order.vendorEarnings;
    if (!order.payoutId) {
      currentPendingPayout += order.vendorEarnings;
    }
  });

  // 2. Fetch payout history
  const payouts = await prisma.payout.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: "desc" }
  });

  // 3. Unpaid orders (for the breakdown table)
  const unpaidOrders = orders.filter(o => !o.payoutId);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Earnings & Payouts</h1>
        <p className="text-[#414846] mt-2 text-sm md:text-base">Track your revenue and payout history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Pending Payout Card */}
        <div className="bg-[#001410] p-8 rounded-3xl border border-[#00261f] shadow-lg relative overflow-hidden group text-white flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-24 h-24 text-[#775a19]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-1H9v-2h4v-2h-3c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h1V5h2v1h2v2h-4v2h3c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-1v1h-2z" />
            </svg>
          </div>
          <div>
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Pending Balance</p>
            <p className="font-serif text-5xl font-bold text-[#c5a55a] relative z-10">
              ₹{currentPendingPayout.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
            <p className="text-sm text-zinc-300">
              This balance includes earnings from completed rentals that have not yet been disbursed. Payouts are typically processed bi-weekly.
            </p>
          </div>
        </div>

        {/* Lifetime Earnings Card */}
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm relative overflow-hidden group flex flex-col justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Lifetime Earnings</p>
            <p className="font-serif text-5xl font-bold text-[#001410] relative z-10">
              ₹{totalLifetimeEarnings.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-zinc-100 relative z-10 flex items-center justify-between">
             <div>
               <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-1">Total Payouts Received</p>
               <p className="font-mono font-bold text-[#001410]">{payouts.length}</p>
             </div>
             <Link href="/vendor/settings" className="text-xs font-bold text-[#775a19] hover:underline">
               Manage Bank Details →
             </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Unpaid Orders Breakdown */}
        <div>
          <h2 className="font-serif text-xl font-bold text-[#001410] mb-4">Unpaid Orders</h2>
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {unpaidOrders.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">
                No pending orders to be paid out.
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider border-b border-zinc-200">
                  <tr>
                    <th className="px-4 py-3">Order / Item</th>
                    <th className="px-4 py-3">Date Completed</th>
                    <th className="px-4 py-3 text-right">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {unpaidOrders.map(order => (
                    <tr key={order.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3">
                        <p className="font-bold text-[#001410]">{order.product?.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{order.orderNumber || order.id.split('-')[0].toUpperCase()}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">
                        {new Date(order.updatedAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[#775a19]">
                        ₹{order.vendorEarnings?.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Payout History */}
        <div>
          <h2 className="font-serif text-xl font-bold text-[#001410] mb-4">Payout History</h2>
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            {payouts.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">
                No payouts have been processed yet.
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider border-b border-zinc-200">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Reference ID</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {payouts.map(payout => (
                    <tr key={payout.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-xs font-medium text-[#001410]">
                        {new Date(payout.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                        {payout.referenceId || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {payout.status === "PAID" ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">Paid</span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-1 rounded-full">{payout.status}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[#001410]">
                        ₹{payout.amount?.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
