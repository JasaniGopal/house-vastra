import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

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

  // Fetch actual live orders tied to this vendor's products to calculate earnings
  const orders = await prisma.order.findMany({
    where: {
      product: {
        vendorId: vendor.id
      },
      status: {
        in: ["COMPLETED", "RETURNED"]
      }
    },
    include: {
      product: true
    }
  });

  // Since we don't have a live checkout yet, this will naturally be 0.
  let totalEarnings = 0;
  orders.forEach(order => {
    // Assuming vendor gets their expected rent. Admin might take a cut, but this is simple logic for now.
    totalEarnings += order.product.vendorExpectedRent || 0; 
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Earnings & Payouts</h1>
        <p className="text-[#414846] mt-2 text-sm md:text-base">Track your revenue from rented outfits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
             <svg className="w-24 h-24 text-[#001410]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-1H9v-2h4v-2h-3c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h1V5h2v1h2v2h-4v2h3c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-1v1h-2z"/></svg>
           </div>
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Total Earnings</p>
           <p className="font-serif text-4xl font-bold text-[#001410] relative z-10">₹{totalEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Pending Payout</p>
           <p className="font-serif text-4xl font-bold text-[#001410]">₹0</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
           <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Total Rentals</p>
           <p className="font-serif text-4xl font-bold text-[#001410]">{orders.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100">
          <h2 className="font-serif text-xl font-medium text-[#001410]">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <div className="p-16 text-center">
              <svg className="w-12 h-12 text-zinc-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">No Transactions Yet</h3>
              <p className="text-zinc-500 text-sm mb-6">Earnings will appear here after your outfits have been rented and returned.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Outfit Rented</th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-[#414846]">
                {orders.map((order, i) => (
                  <tr key={i} className="hover:bg-[#fcf9f8] transition-colors group">
                    <td className="px-6 py-4">{order.createdAt.toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-[#001410]">{order.product.name}</td>
                    <td className="px-6 py-4">#{order.id.split('-')[0].toUpperCase()}</td>
                    <td className="px-6 py-4 font-bold text-[#001410]">₹{order.product.vendorExpectedRent}</td>
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
