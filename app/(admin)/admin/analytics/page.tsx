"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">{label}</p>
      <p className={`font-serif text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-zinc-500 font-medium animate-pulse">Loading analytics...</div>;
  if (!data) return <div className="p-8 text-red-500">Failed to load analytics data.</div>;

  const { kpis, revenueChart, topProducts } = data;
  const maxGross = Math.max(...(revenueChart.map((r: any) => r.gross) as number[]), 1);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#775a19] transition-colors mb-4 group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Analytics & Reporting</h1>
        <p className="text-[#414846] mt-2 text-sm">Live financial overview of your platform.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={`₹${(kpis.totalRevenue || 0).toLocaleString("en-IN")}`} sub="All orders" color="text-[#001410]" />
        <StatCard label="Platform Profit" value={`₹${(kpis.totalPlatformProfit || 0).toLocaleString("en-IN")}`} sub="After vendor payouts" color="text-emerald-700" />
        <StatCard label="Deposit Liability" value={`₹${(kpis.depositLiability || 0).toLocaleString("en-IN")}`} sub="Owed to customers" color="text-amber-600" />
        <StatCard label="Active Rentals" value={String(kpis.totalActiveOrders || 0)} sub={`${kpis.totalCustomers || 0} total customers`} color="text-[#775a19]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-[#001410] mb-6">Revenue — Last 6 Months</h2>
          {revenueChart.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-zinc-400 text-sm">No order data yet</div>
          ) : (
            <div className="flex items-end gap-3 h-48">
              {revenueChart.map((r: any) => {
                const monthLabel = MONTHS[parseInt(r.month.split("-")[1]) - 1];
                const grossHeight = Math.max((r.gross / maxGross) * 100, 2);
                const profitHeight = Math.max((r.profit / maxGross) * 100, 2);
                return (
                  <div key={r.month} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="relative w-full flex items-end gap-1 h-40">
                      <div
                        className="flex-1 bg-[#001410]/10 rounded-t-lg group-hover:bg-[#001410]/20 transition-all"
                        style={{ height: `${grossHeight}%` }}
                        title={`Gross: ₹${r.gross.toLocaleString("en-IN")}`}
                      />
                      <div
                        className="flex-1 bg-[#775a19] rounded-t-lg group-hover:bg-[#775a19]/80 transition-all"
                        style={{ height: `${profitHeight}%` }}
                        title={`Profit: ₹${r.profit.toLocaleString("en-IN")}`}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400">{monthLabel}</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex items-center gap-6 mt-4">
            <span className="flex items-center gap-2 text-xs text-zinc-500"><span className="w-3 h-3 rounded-sm bg-[#001410]/10 inline-block" /> Gross Revenue</span>
            <span className="flex items-center gap-2 text-xs text-zinc-500"><span className="w-3 h-3 rounded-sm bg-[#775a19] inline-block" /> Platform Profit</span>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-[#001410] mb-6">Top 5 Products</h2>
          {topProducts.length === 0 ? (
            <div className="text-zinc-400 text-sm text-center py-8">No rental data yet</div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((p: any, i: number) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <span className="text-zinc-300 font-bold text-xl w-6 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#001410] truncate">{p.name}</p>
                    <p className="text-xs text-zinc-500">{p.rentals} rentals • ₹{(p.revenue || 0).toLocaleString("en-IN")}</p>
                  </div>
                  <div className="w-1.5 h-8 rounded-full bg-[#775a19]" style={{ opacity: 1 - i * 0.15 }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
