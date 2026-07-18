"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const COURIER_PARTNERS = ["Delhivery", "DTDC", "BlueDart", "Shiprocket", "India Post", "FedEx", "Other"];

const STATUS_FLOW = ["PENDING", "PREPARING", "DISPATCHED", "IN_USE", "RETURNED", "COMPLETED", "CANCELLED"];
const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-zinc-100 text-zinc-600",
  PREPARING: "bg-blue-100 text-blue-800",
  DISPATCHED: "bg-purple-100 text-purple-800",
  IN_USE: "bg-[#775a19]/10 text-[#775a19]",
  RETURNED: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const COURIER_URLS: Record<string, string> = {
  Delhivery: "https://www.delhivery.com/track/package/",
  DTDC: "https://tracking.dtdc.com/ctbs-tracking/customerInterface.tr?submitName=showCITrack&cType=self&cnNo=",
  BlueDart: "https://www.bluedart.com/tracking?trackFor=0&track=",
  Shiprocket: "https://shiprocket.co/tracking/",
  "India Post": "https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx",
  FedEx: "https://www.fedex.com/apps/fedextrack/?tracknumbers=",
  Other: "",
};

export default function ShippingPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState("");
  const [courierPartner, setCourierPartner] = useState("Delhivery");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => { setOrders(Array.isArray(d) ? d : d.orders || []); setLoading(false); });
  }, []);

  const startEdit = (order: any) => {
    setEditingId(order.id);
    setTrackingId(order.trackingId || "");
    setCourierPartner(order.courierPartner || "Delhivery");
  };

  const saveShipping = async (orderId: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingId, courierPartner }),
      });
      const updated = await res.json();
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, ...updated } : o));
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, ...updated } : o));
  };

  if (loading) return <div className="p-8 text-zinc-500 animate-pulse">Loading orders...</div>;

  const activeOrders = orders.filter((o) => !["COMPLETED", "CANCELLED"].includes(o.status));

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#775a19] transition-colors mb-4 group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Logistics & Shipping</h1>
        <p className="text-[#414846] mt-2 text-sm">Manage tracking IDs and dispatch status for all active orders.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {activeOrders.length === 0 ? (
          <div className="p-16 text-center">
            <p className="font-serif text-xl text-[#001410] mb-2">No Active Orders</p>
            <p className="text-zinc-500 text-sm">Active orders will appear here for you to track and dispatch.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">Order</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Item</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-left">Tracking</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {activeOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#fcf9f8] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-mono text-xs font-bold text-zinc-400">{order.orderNumber}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#001410]">{order.customer?.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#001410] max-w-[180px] truncate">{order.product?.name}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1.5 rounded-lg uppercase tracking-wider cursor-pointer border-none focus:outline-none focus:ring-1 focus:ring-[#775a19] ${STATUS_STYLES[order.status] || "bg-zinc-100"}`}
                      >
                        {STATUS_FLOW.map((s) => (
                          <option key={s} value={s}>{s.replace("_", " ")}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === order.id ? (
                        <div className="flex flex-col gap-2">
                          <select
                            value={courierPartner}
                            onChange={(e) => setCourierPartner(e.target.value)}
                            className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-[#775a19]"
                          >
                            {COURIER_PARTNERS.map((c) => <option key={c}>{c}</option>)}
                          </select>
                          <input
                            type="text"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            placeholder="Tracking ID..."
                            className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#775a19]"
                          />
                        </div>
                      ) : order.trackingId ? (
                        <div>
                          <p className="text-[10px] text-zinc-400 uppercase font-bold">{order.courierPartner}</p>
                          {COURIER_URLS[order.courierPartner] ? (
                            <a
                              href={`${COURIER_URLS[order.courierPartner]}${order.trackingId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-xs text-[#775a19] hover:underline"
                            >
                              {order.trackingId} ↗
                            </a>
                          ) : (
                            <p className="font-mono text-xs text-zinc-600">{order.trackingId}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-300 italic">No tracking set</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingId === order.id ? (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditingId(null)} className="text-xs text-zinc-400 hover:text-zinc-600 font-bold cursor-pointer">Cancel</button>
                          <button
                            onClick={() => saveShipping(order.id)}
                            disabled={saving}
                            className="text-xs bg-[#001410] text-white px-3 py-1.5 rounded-lg font-bold hover:bg-[#775a19] transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(order)}
                          className="text-xs font-bold text-[#775a19] hover:underline cursor-pointer"
                        >
                          {order.trackingId ? "Update" : "Add Tracking"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
