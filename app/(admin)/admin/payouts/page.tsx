"use client";

import React, { useState, useEffect } from 'react';

export default function PayoutsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"PENDING" | "HISTORY">("PENDING");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "PENDING") {
        const res = await fetch("/api/admin/payouts/pending");
        if (!res.ok) throw new Error("Failed to load pending balances");
        setVendors(await res.json());
      } else {
        const res = await fetch("/api/admin/payouts/history");
        if (!res.ok) throw new Error("Failed to load payout history");
        setPayouts(await res.json());
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (vendorId: string, amount: number) => {
    if (!window.confirm(`Are you sure you want to mark ₹${amount} as paid for this vendor? Ensure you have sent the bank transfer.`)) return;
    
    try {
      const res = await fetch("/api/admin/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId, amount })
      });
      
      if (!res.ok) throw new Error("Failed to process payout");
      
      // Remove vendor from pending list
      setVendors(vendors.filter(v => v.id !== vendorId));
      alert("Payout marked as Paid successfully!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Financials & Payouts</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Manage platform earnings and settle boutique payouts.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-lg border border-rose-200">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-zinc-200">
        <button 
          onClick={() => setActiveTab("PENDING")}
          className={`px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "PENDING" ? "border-[#775a19] text-[#001410]" : "border-transparent text-zinc-400 hover:text-zinc-600"}`}
        >
          Pending Balances
        </button>
        <button 
          onClick={() => setActiveTab("HISTORY")}
          className={`px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "HISTORY" ? "border-[#775a19] text-[#001410]" : "border-transparent text-zinc-400 hover:text-zinc-600"}`}
        >
          Payout History
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-zinc-500 font-medium text-center">Loading...</div>
        ) : activeTab === "PENDING" ? (
          <div className="overflow-x-auto">
            {vendors.length === 0 ? (
              <div className="p-16 text-center">
                <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">All Settled Up</h3>
                <p className="text-zinc-500 text-sm mb-6">There are currently no pending payouts owed to vendors.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left text-[#414846]">
                <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Boutique Name</th>
                    <th className="px-6 py-4">Bank Details</th>
                    <th className="px-6 py-4">Unpaid Orders</th>
                    <th className="px-6 py-4">Amount Owed</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {vendors.map((vendor) => (
                    <tr key={vendor.id} className="hover:bg-[#fcf9f8] transition-colors group">
                      <td className="px-6 py-4 font-bold text-[#001410]">{vendor.boutiqueName}</td>
                      <td className="px-6 py-4 font-mono text-xs">
                        <p>ACC: {vendor.bankAccount || "Not Provided"}</p>
                        <p className="text-[10px] text-zinc-500">IFSC: {vendor.ifscCode || "Not Provided"}</p>
                      </td>
                      <td className="px-6 py-4 font-medium">{vendor.pendingOrdersCount} orders</td>
                      <td className="px-6 py-4 font-bold text-[#001410]">₹{vendor.pendingAmount.toString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleMarkAsPaid(vendor.id, vendor.pendingAmount)}
                          className="bg-[#001410] text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#775a19] transition-colors"
                          disabled={!vendor.bankAccount || vendor.pendingAmount <= 0}
                          title={!vendor.bankAccount ? "Missing Bank Details" : "Mark Paid"}
                        >
                          Mark as Paid
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {payouts.length === 0 ? (
              <div className="p-16 text-center">
                <p className="text-zinc-500 text-sm">No payout history found.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left text-[#414846]">
                <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Boutique</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Orders Included</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-[#fcf9f8] transition-colors">
                      <td className="px-6 py-4 font-medium">{new Date(payout.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold text-[#001410]">{payout.vendor?.boutiqueName}</td>
                      <td className="px-6 py-4 font-bold text-emerald-600">₹{payout.amount.toString()}</td>
                      <td className="px-6 py-4 font-medium">{payout._count?.orders || 0}</td>
                      <td className="px-6 py-4">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {payout.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
