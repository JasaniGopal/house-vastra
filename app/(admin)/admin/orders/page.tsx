"use client";

import React, { useState, useEffect } from 'react';

export default function GlobalOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to load global orders");
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500 font-medium">Loading global orders...</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Global Orders</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Monitor all customer rentals across every boutique.</p>
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
              <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">No Orders Found</h3>
              <p className="text-zinc-500 text-sm mb-6">There are currently no active or completed orders on the platform.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-[#414846]">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Boutique</th>
                  <th className="px-6 py-4">Outfit</th>
                  <th className="px-6 py-4">Rental Dates</th>
                  <th className="px-6 py-4">Total Value</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#fcf9f8] transition-colors group">
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{order.id.slice(0, 8)}...</td>
                    <td className="px-6 py-4 font-bold text-[#001410]">{order.customer?.name}</td>
                    <td className="px-6 py-4 font-bold text-[#775a19]">{order.product?.vendor?.boutiqueName}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {order.product?.images && order.product.images.length > 0 && (
                          <img src={order.product.images[0].url} alt="" className="w-8 h-8 rounded-md object-cover border border-zinc-200" />
                        )}
                        <span className="truncate w-32 block">{order.product?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs">{new Date(order.startDate).toLocaleDateString()}</p>
                      <p className="text-[10px] text-zinc-500 uppercase">To</p>
                      <p className="text-xs">{new Date(order.endDate).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#001410]">₹{order.totalAmount?.toString()}</td>
                    <td className="px-6 py-4">
                      <span className="bg-zinc-100 text-zinc-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
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
