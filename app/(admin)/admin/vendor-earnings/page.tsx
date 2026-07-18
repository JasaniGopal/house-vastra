"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminVendorEarningsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVendorId, setSelectedVendorId] = useState<string>("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to load earnings data");
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500 font-medium">Loading earnings details...</div>;

  const vendors = Array.from(new Set(orders.map(o => o.product?.vendor?.id).filter(Boolean))).map(id => {
    return orders.find(o => o.product?.vendor?.id === id)?.product?.vendor;
  });

  const filteredOrders = selectedVendorId === "ALL"
    ? orders
    : orders.filter(o => o.product?.vendor?.id === selectedVendorId);

  const totalVendorEarnings = filteredOrders.reduce((sum, order) => sum + (order.vendorEarnings || 0), 0);

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
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Vendor Earnings</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Detailed breakdown of vendor earnings per product transaction.</p>
        </div>
        <div className="flex flex-col md:items-end gap-4">
          <select 
            value={selectedVendorId}
            onChange={(e) => setSelectedVendorId(e.target.value)}
            className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-[#001410] focus:outline-none focus:border-[#775a19] w-full md:w-auto"
          >
            <option value="ALL">All Boutiques</option>
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.id}>{vendor.boutiqueName}</option>
            ))}
          </select>
          <div className="bg-[#FAF2E8] px-6 py-4 rounded-xl border border-[#E8D8BA] shadow-sm w-full">
            <p className="text-[#775a19] text-xs font-bold uppercase tracking-wider mb-1">Total Vendor Earnings</p>
            <p className="font-serif text-3xl font-bold text-[#001410]">₹{totalVendorEarnings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-lg border border-rose-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="p-16 text-center">
              <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">No Transactions Found</h3>
              <p className="text-zinc-500 text-sm mb-6">There are currently no transactions matching this filter.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-[#414846]">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Boutique</th>
                  <th className="px-6 py-4">Outfit Rented</th>
                  <th className="px-6 py-4 text-right">Platform Profit</th>
                  <th className="px-6 py-4 text-right text-[#001410]">Vendor Cut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredOrders.map((order) => (
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
                    <td className="px-6 py-4 text-right font-medium text-zinc-400">₹{order.platformFee?.toString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#001410] bg-[#fcf9f8]">₹{order.vendorEarnings?.toString()}</td>
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
