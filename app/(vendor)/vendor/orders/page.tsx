import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function VendorOrdersPage() {
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

  // Fetch actual live orders tied to this vendor's products
  const orders = await prisma.order.findMany({
    where: {
      product: {
        vendorId: vendor.id
      }
    },
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      product: true
    }
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Active Rentals</h1>
        <p className="text-[#414846] mt-2 text-sm md:text-base">Track and manage outfits currently rented by customers.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <div className="p-16 text-center">
              <svg className="w-12 h-12 text-zinc-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">No Active Rentals Yet</h3>
              <p className="text-zinc-500 text-sm mb-6">You will see orders appear here once customers rent your outfits.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Outfit Rented</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-[#414846]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#fcf9f8] transition-colors group">
                    <td className="px-6 py-4 font-bold text-[#001410]">#{order.id.split('-')[0].toUpperCase()}</td>
                    <td className="px-6 py-4">{order.customer?.name || "Guest Customer"}</td>
                    <td className="px-6 py-4 font-bold text-[#001410]">
                      {order.product.name}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {order.startDate.toLocaleDateString()} to {order.endDate.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {order.status}
                      </span>
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
