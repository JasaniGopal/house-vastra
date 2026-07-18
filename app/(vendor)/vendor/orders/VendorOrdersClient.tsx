"use client";

import React, { useState } from "react";
import Image from "next/image";

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  PENDING:    { bg: "bg-zinc-100",   text: "text-zinc-700",   dot: "bg-zinc-400",   label: "Pending" },
  PREPARING:  { bg: "bg-blue-100",   text: "text-blue-800",   dot: "bg-blue-500",   label: "Preparing" },
  DISPATCHED: { bg: "bg-purple-100", text: "text-purple-800", dot: "bg-purple-500", label: "Dispatched" },
  IN_USE:     { bg: "bg-amber-100",  text: "text-amber-800",  dot: "bg-amber-500",  label: "In Use" },
  RETURNED:   { bg: "bg-[#775a19]/10", text: "text-[#775a19]", dot: "bg-[#775a19]", label: "Returned" },
  COMPLETED:  { bg: "bg-emerald-100", text: "text-emerald-800", dot: "bg-emerald-500", label: "Completed" },
  CANCELLED:  { bg: "bg-red-100",   text: "text-red-800",    dot: "bg-red-500",    label: "Cancelled" },
};

function ReadOnlyStatusPill({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </div>
  );
}

function VendorOrderDetailPanel({ order, onClose }: { order: any; onClose: () => void }) {
  if (!order) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 sticky top-0 bg-white z-10">
          <div>
            <p className="font-mono text-xs text-zinc-400 font-bold">{order.orderNumber || order.id.split('-')[0].toUpperCase()}</p>
            <h2 className="font-serif text-xl font-bold text-[#001410] mt-0.5">Rental Detail</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer">
            <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          <div className="flex items-center gap-3">
            <ReadOnlyStatusPill status={order.status} />
          </div>

          <div className="flex gap-4 bg-[#faf9f8] rounded-2xl p-4">
            {order.product?.images?.[0]?.url && (
              <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                <Image src={order.product.images[0].url} alt={order.product.name} fill className="object-cover object-top" sizes="80px" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-serif font-bold text-[#001410] leading-tight">{order.product?.name}</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-zinc-400 uppercase font-bold tracking-wider text-[10px]">Start Date</p>
                  <p className="font-bold text-[#001410]">{new Date(order.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-zinc-400 uppercase font-bold tracking-wider text-[10px]">End Date</p>
                  <p className="font-bold text-[#001410]">{new Date(order.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Customer</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#001410] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                {order.customer?.name?.[0] || "?"}
              </div>
              <div>
                <p className="font-bold text-[#001410]">{order.customer?.name || "Guest Customer"}</p>
                <p className="text-xs text-zinc-400">Renting this outfit</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Your Earnings</p>
            <div className="bg-[#001410] text-white rounded-2xl p-5">
              <p className="text-zinc-400 text-xs mb-1">Total Payout for this Order</p>
              <p className="font-serif text-3xl font-bold text-[#c5a55a]">₹{order.vendorEarnings?.toLocaleString("en-IN")}</p>
              {order.status !== "COMPLETED" && (
                <p className="text-xs text-zinc-400 mt-2">Will be paid out after the item is safely returned.</p>
              )}
            </div>
          </div>
          
          {order.trackingId && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Shipping Tracking</p>
              <div className="bg-zinc-50 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">{order.courierPartner || "Courier"}</p>
                  <p className="font-mono font-bold text-[#001410] text-sm">{order.trackingId}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default function VendorOrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [search, setSearch] = useState("");

  const filtered = initialOrders.filter((o) => {
    const matchesSearch = !search || 
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.product?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Active Rentals</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Track and manage outfits currently rented by customers.</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order or outfit..."
          className="px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#775a19] w-full md:w-72"
        />
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">No Active Rentals Yet</h3>
              <p className="text-zinc-500 text-sm mb-6">You will see orders appear here once customers rent your outfits.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Outfit Rented</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Your Earnings</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-[#414846]">
                {filtered.map((order) => (
                  <tr key={order.id} onClick={() => setSelectedOrder(order)} className="hover:bg-[#fcf9f8] transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-zinc-400">{order.orderNumber || order.id.split('-')[0].toUpperCase()}</p>
                      <p className="text-[10px] text-zinc-300 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {order.product?.images?.[0]?.url && (
                          <img src={order.product.images[0].url} alt="" className="w-8 h-8 rounded-lg object-cover border border-zinc-200 shrink-0" />
                        )}
                        <span className="truncate max-w-[140px] font-bold text-[#001410]">{order.product?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-medium">{new Date(order.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                      <p className="text-zinc-400">to {new Date(order.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#775a19]">
                      ₹{order.vendorEarnings?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <ReadOnlyStatusPill status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedOrder && (
        <VendorOrderDetailPanel order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}
