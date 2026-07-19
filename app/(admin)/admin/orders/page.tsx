"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const STATUS_FLOW = ["PENDING", "PREPARING", "DISPATCHED", "IN_USE", "RETURNED", "COMPLETED", "CANCELLED"];

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  PENDING:    { bg: "bg-zinc-100",   text: "text-zinc-700",   dot: "bg-zinc-400",   label: "Pending" },
  PREPARING:  { bg: "bg-blue-100",   text: "text-blue-800",   dot: "bg-blue-500",   label: "Preparing" },
  DISPATCHED: { bg: "bg-purple-100", text: "text-purple-800", dot: "bg-purple-500", label: "Dispatched" },
  IN_USE:     { bg: "bg-amber-100",  text: "text-amber-800",  dot: "bg-amber-500",  label: "In Use" },
  RETURNED:   { bg: "bg-[#775a19]/10", text: "text-[#775a19]", dot: "bg-[#775a19]", label: "Returned" },
  COMPLETED:  { bg: "bg-emerald-100", text: "text-emerald-800", dot: "bg-emerald-500", label: "Completed" },
  CANCELLED:  { bg: "bg-red-100",   text: "text-red-800",    dot: "bg-red-500",    label: "Cancelled" },
};

const DEPOSIT_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  HELD:      { bg: "bg-amber-50",   text: "text-amber-700",  label: "Held" },
  REFUNDED:  { bg: "bg-emerald-50", text: "text-emerald-700", label: "Refunded" },
  WITHHELD:  { bg: "bg-red-50",     text: "text-red-700",    label: "Withheld" },
};

function StatusPill({ status, onChange }: { status: string; onChange: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all hover:opacity-80 ${cfg.bg} ${cfg.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
        <svg className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-zinc-200 z-30 overflow-hidden">
          {STATUS_FLOW.map((s) => {
            const c = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={(e) => { e.stopPropagation(); onChange(s); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center gap-2 hover:bg-zinc-50 transition-colors ${s === status ? "bg-zinc-50" : ""}`}
              >
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                <span className={c.text}>{c.label}</span>
                {s === status && <svg className="w-3 h-3 ml-auto text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrderDetailPanel({ order, onClose, onStatusChange }: { order: any; onClose: () => void; onStatusChange: (id: string, status: string) => void }) {
  if (!order) return null;

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const deposit = DEPOSIT_CONFIG[order.depositStatus] || DEPOSIT_CONFIG.HELD;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 sticky top-0 bg-white z-10">
          <div>
            <p className="font-mono text-xs text-zinc-400 font-bold">{order.orderNumber}</p>
            <h2 className="font-serif text-xl font-bold text-[#001410] mt-0.5">Order Detail</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer">
            <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Status + Deposit */}
          <div className="flex items-center gap-3 flex-wrap">
            <StatusPill status={order.status} onChange={(s) => onStatusChange(order.id, s)} />
            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${deposit.bg} ${deposit.text}`}>
              Deposit: {deposit.label}
            </span>
          </div>

          {/* Item */}
          <div className="flex gap-4 bg-[#faf9f8] rounded-2xl p-4">
            {order.product?.images?.[0]?.url && (
              <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0 bg-zinc-100">
                <Image src={order.product.images[0].url} alt={order.product.name} fill className="object-cover object-top" sizes="80px" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-serif font-bold text-[#001410] leading-tight">{order.product?.name}</p>
              <p className="text-xs text-zinc-400 mt-1">from {order.product?.vendor?.boutiqueName}</p>
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

          {/* Customer */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Customer</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#001410] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                {order.customer?.name?.[0] || "?"}
              </div>
              <div>
                <p className="font-bold text-[#001410]">{order.customer?.name}</p>
                <p className="text-xs text-zinc-400">{order.customer?.email}</p>
              </div>
            </div>
            {order.shippingAddress && (
              <p className="text-xs text-zinc-500 mt-3 bg-zinc-50 p-3 rounded-xl leading-relaxed">{order.shippingAddress}</p>
            )}
          </div>

          {/* Shipping */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Shipping</p>
            {order.trackingId ? (
              <div className="bg-zinc-50 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-bold">{order.courierPartner || "Courier"}</p>
                  <p className="font-mono font-bold text-[#001410] text-sm">{order.trackingId}</p>
                </div>
                <Link href={`/admin/shipping`} className="text-xs text-[#775a19] font-bold hover:underline">Update →</Link>
              </div>
            ) : (
              <div className="bg-zinc-50 rounded-xl p-3 flex items-center justify-between">
                <p className="text-xs text-zinc-400 italic">No tracking ID set yet</p>
                <Link href={`/admin/shipping`} className="text-xs text-[#775a19] font-bold hover:underline">Add Tracking →</Link>
              </div>
            )}
          </div>

          {/* Coupon */}
          {order.couponCode && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Promo Applied</p>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold text-emerald-800 font-mono tracking-wide">{order.couponCode}</span>
                <span className="text-emerald-600 text-xs ml-auto">-₹{order.discountAmount?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          )}

          {/* Financial Breakdown */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Financial Breakdown</p>
            <div className="bg-[#001410] text-white rounded-2xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Total Charged</span>
                <span className="font-bold">₹{order.totalAmount?.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Vendor Earnings</span>
                <span className="font-bold text-[#c5a55a]">₹{order.vendorEarnings?.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                <span className="text-zinc-400">Platform Profit</span>
                <span className="font-bold text-emerald-400">₹{order.platformFee?.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Disputes */}
          {order.dispute && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Dispute Filed</p>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-sm font-bold text-amber-800">{order.dispute.status.replace("_", " ")}</p>
                <p className="text-xs text-amber-700 mt-1">{order.dispute.reason}</p>
                <Link href="/admin/disputes" className="text-xs font-bold text-[#775a19] mt-2 inline-block hover:underline">Manage Dispute →</Link>
              </div>
            </div>
          )}

          <div className="text-xs text-zinc-400 text-center pt-2">
            Order placed: {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
      </div>
    </>
  );
}

function GlobalOrdersContent() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => { setOrders(Array.isArray(d) ? d : d.orders || []); setLoading(false); })
      .catch(() => { setError("Failed to load orders"); setLoading(false); });
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = !statusFilter || o.status === statusFilter;
    const matchesSearch = !search || 
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.product?.name?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) return <div className="p-8 text-zinc-500 font-medium animate-pulse">Loading global orders...</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Global Orders</h1>
          <p className="text-[#414846] mt-2 text-sm">Monitor all customer rentals across every boutique.</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order, customer, or item..."
          className="px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#775a19] w-full md:w-72"
        />
      </div>

      {statusFilter && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-zinc-500">Filtered by:</span>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_CONFIG[statusFilter]?.bg} ${STATUS_CONFIG[statusFilter]?.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[statusFilter]?.dot}`} />
            {STATUS_CONFIG[statusFilter]?.label || statusFilter}
          </span>
          <Link href="/admin/orders" className="text-xs text-zinc-400 hover:text-zinc-600">Clear ×</Link>
        </div>
      )}

      {error && <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-lg border border-rose-200">{error}</div>}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-16 text-center">
              <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">No Orders Found</h3>
              <p className="text-zinc-500 text-sm">There are no orders matching your current filter.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-[#414846]">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-[#fcf9f8] transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-zinc-400">{order.orderNumber || order.id.slice(0, 8) + "..."}</p>
                      <p className="text-[10px] text-zinc-300 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#001410]">{order.customer?.name}</p>
                      <p className="text-xs text-zinc-400">{order.customer?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {order.product?.images?.[0]?.url && (
                          <img src={order.product.images[0].url} alt="" className="w-8 h-8 rounded-lg object-cover border border-zinc-200 shrink-0" />
                        )}
                        <span className="truncate max-w-[140px] font-medium">{order.product?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <p className="font-medium">{new Date(order.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                      <p className="text-zinc-400">to {new Date(order.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#001410]">₹{order.totalAmount?.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <StatusPill status={order.status} onChange={(s) => handleStatusChange(order.id, s)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

export default function GlobalOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500">Loading...</div>}>
      <GlobalOrdersContent />
    </Suspense>
  );
}
