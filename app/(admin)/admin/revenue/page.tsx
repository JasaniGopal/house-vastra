"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlatformRevenuePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to load revenue data");
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500 font-medium">Loading revenue details...</div>;

  const totalPlatformProfit = orders.reduce((sum, order) => sum + (order.platformFee || 0), 0);

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#775a19] transition-colors mb-4 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Platform Revenue</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Detailed breakdown of platform profit per transaction.</p>
        </div>
        <div className="bg-emerald-50 px-6 py-4 rounded-xl border border-emerald-200 shadow-sm">
          <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">Total Platform Profit</p>
          <p className="font-serif text-3xl font-bold text-emerald-900">₹{totalPlatformProfit.toLocaleString()}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-lg border border-rose-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <div className="p-16 text-center">
              <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">No Revenue Yet</h3>
              <p className="text-zinc-500 text-sm mb-6">There are currently no transactions to display.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-[#414846]">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Boutique</th>
                  <th className="px-6 py-4">Outfit Rented</th>
                  <th className="px-6 py-4 text-right">Vendor Cut</th>
                  <th className="px-6 py-4 text-right text-emerald-700">Platform Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#fcf9f8] transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{order.id.slice(0, 8)}...</td>
                    <td className="px-6 py-4 font-bold text-[#775a19]">{order.product?.vendor?.boutiqueName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {order.product?.images && order.product.images.length > 0 && (
                          <img src={order.product.images[0].url} alt="" className="w-8 h-8 rounded-md object-cover border border-zinc-200" />
                        )}
                        <span className="truncate w-48 block font-medium text-[#001410]">{order.product?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-zinc-600">₹{order.vendorEarnings?.toString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-emerald-600 bg-emerald-50/30">₹{order.platformFee?.toString()}</td>
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
