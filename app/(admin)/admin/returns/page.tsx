"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReturnsManagementPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/returns");
      if (!res.ok) throw new Error("Failed to load returns data");
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDepositAction = async (orderId: string, action: "REFUNDED" | "WITHHELD") => {
    if (!confirm(`Are you sure you want to mark this deposit as ${action}?`)) return;

    try {
      const res = await fetch(`/api/admin/returns/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositStatus: action }),
      });
      if (!res.ok) throw new Error("Failed to update deposit status");
      
      // Optimistically update
      setOrders(orders.map(o => o.id === orderId ? { ...o, depositStatus: action } : o));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500 font-medium">Loading deposit records...</div>;

  const totalHeldDeposits = orders
    .filter(o => o.depositStatus === "HELD")
    .reduce((sum, order) => sum + (order.totalAmount - order.vendorEarnings - order.platformFee), 0);

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
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Returns & Deposits</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Manage security deposits for orders that are currently out or returned.</p>
        </div>
        <div className="bg-[#FAF2E8] px-6 py-4 rounded-xl border border-[#E8D8BA] shadow-sm">
          <p className="text-[#775a19] text-xs font-bold uppercase tracking-wider mb-1">Active Deposits Held</p>
          <p className="font-serif text-3xl font-bold text-[#001410]">₹{totalHeldDeposits.toLocaleString()}</p>
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
              <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">No Active Records</h3>
              <p className="text-zinc-500 text-sm mb-6">There are currently no active rentals to manage deposits for.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-[#414846]">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Outfit Rented</th>
                  <th className="px-6 py-4">Order Status</th>
                  <th className="px-6 py-4 text-right">Deposit Amt</th>
                  <th className="px-6 py-4 text-right">Deposit Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((order) => {
                  const depositAmount = order.totalAmount - order.vendorEarnings - order.platformFee;

                  return (
                    <tr key={order.id} className="hover:bg-[#fcf9f8] transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-zinc-500">{order.id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 font-bold text-[#001410]">{order.customer?.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {order.product?.images && order.product.images.length > 0 && (
                            <img src={order.product.images[0].url} alt="" className="w-8 h-8 rounded-md object-cover border border-zinc-200" />
                          )}
                          <span className="truncate w-32 block font-medium text-[#001410]">{order.product?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-zinc-100 text-zinc-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-[#775a19]">₹{depositAmount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        {order.depositStatus === "HELD" && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Held</span>
                        )}
                        {order.depositStatus === "REFUNDED" && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Refunded</span>
                        )}
                        {order.depositStatus === "WITHHELD" && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Withheld (Damage)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {order.depositStatus === "HELD" ? (
                          <>
                            <button 
                              onClick={() => handleDepositAction(order.id, "REFUNDED")}
                              className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors"
                            >
                              Refund
                            </button>
                            <button 
                              onClick={() => handleDepositAction(order.id, "WITHHELD")}
                              className="text-[10px] font-bold text-rose-600 border border-rose-200 hover:bg-rose-50 px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors"
                            >
                              Withhold
                            </button>
                          </>
                        ) : (
                          <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Processed</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
