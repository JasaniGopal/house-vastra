"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-amber-100 text-amber-800",
  RESOLVED_REFUND: "bg-emerald-100 text-emerald-800",
  RESOLVED_WITHHOLD: "bg-red-100 text-red-800",
};
const STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  RESOLVED_REFUND: "Refunded",
  RESOLVED_WITHHOLD: "Withheld",
};

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/disputes")
      .then((r) => r.json())
      .then((d) => { setDisputes(d); setLoading(false); });
  }, []);

  const openDetail = (dispute: any) => {
    setSelected(dispute);
    setNotes(dispute.adminNotes || "");
  };

  const resolve = async (status: string) => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/disputes/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: notes, status }),
      });
      const updated = await res.json();
      setDisputes((prev) => prev.map((d) => d.id === updated.id ? { ...d, ...updated } : d));
      setSelected(null);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500 animate-pulse">Loading disputes...</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#775a19] transition-colors mb-4 group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Dispute & Damage Resolution</h1>
        <p className="text-[#414846] mt-2 text-sm">Manage damage claims and deposit resolutions.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {disputes.length === 0 ? (
          <div className="p-16 text-center">
            <p className="font-serif text-xl text-[#001410] mb-2">No Disputes Filed</p>
            <p className="text-zinc-500 text-sm">Open disputes from the Returns & Deposits page when an item is returned damaged.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Order / Item</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Reason</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {disputes.map((d) => (
                <tr key={d.id} className="hover:bg-[#fcf9f8] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#001410]">{d.order?.product?.name}</p>
                    <p className="text-xs text-zinc-400 font-mono">{d.order?.orderNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-[#001410]">{d.order?.customer?.name}</p>
                    <p className="text-xs text-zinc-400">{d.order?.customer?.email}</p>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-zinc-600 truncate">{d.reason}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider ${STATUS_STYLES[d.status] || "bg-zinc-100 text-zinc-500"}`}>
                      {STATUS_LABELS[d.status] || d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openDetail(d)}
                      className="text-xs font-bold text-[#775a19] hover:underline cursor-pointer"
                    >
                      View Detail →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-xl">
            <h3 className="font-serif text-2xl font-bold text-[#001410] mb-1">Dispute Detail</h3>
            <p className="text-zinc-500 text-sm mb-6 font-mono">{selected.order?.orderNumber}</p>

            <div className="bg-zinc-50 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-1">Item</p>
              <p className="font-bold text-[#001410]">{selected.order?.product?.name}</p>
              <p className="text-sm text-zinc-500 mt-1">{selected.order?.customer?.name} · {selected.order?.customer?.email}</p>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">Reported Reason</p>
              <p className="text-sm text-amber-900">{selected.reason}</p>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Admin Notes (Internal)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add internal notes about the damage claim..."
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-[#001410] focus:outline-none focus:border-[#775a19]"
              />
            </div>

            <div className="flex flex-col gap-3">
              {selected.status === "OPEN" && (
                <>
                  <button
                    onClick={() => resolve("RESOLVED_REFUND")}
                    disabled={saving}
                    className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    ✓ Resolve — Refund Deposit to Customer
                  </button>
                  <button
                    onClick={() => resolve("RESOLVED_WITHHOLD")}
                    disabled={saving}
                    className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    ✗ Resolve — Withhold Deposit (Damage Found)
                  </button>
                </>
              )}
              {selected.status !== "OPEN" && (
                <div className={`text-center py-3 rounded-xl font-bold text-sm ${STATUS_STYLES[selected.status]}`}>
                  {STATUS_LABELS[selected.status]} — Already Resolved
                </div>
              )}
              <button
                onClick={() => setSelected(null)}
                className="w-full py-2 text-sm font-bold text-zinc-500 hover:text-[#001410] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
