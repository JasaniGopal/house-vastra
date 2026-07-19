"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/admin/customers");
      if (!res.ok) throw new Error("Failed to load customers data");
      const data = await res.json();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async (customerId: string, currentStatus: boolean) => {
    const actionStr = currentStatus ? "unban" : "ban";
    if (!confirm(`Are you sure you want to ${actionStr} this customer?`)) return;

    try {
      const res = await fetch(`/api/admin/customers/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: !currentStatus }),
      });
      if (!res.ok) throw new Error(`Failed to ${actionStr} customer`);
      
      // Optimistically update
      setCustomers(customers.map(c => c.id === customerId ? { ...c, isBanned: !currentStatus } : c));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500 font-medium">Loading customer database...</div>;

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
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Customer CRM</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Manage registered shoppers and review their rental history.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-xl border border-zinc-200 shadow-sm">
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Total Customers</p>
          <p className="font-serif text-3xl font-bold text-[#001410]">{customers.length}</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-lg border border-rose-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {customers.length === 0 ? (
            <div className="p-16 text-center">
              <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">No Customers Yet</h3>
              <p className="text-zinc-500 text-sm mb-6">There are currently no registered customers on the platform.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-[#414846]">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Join Date</th>
                  <th className="px-6 py-4 text-center">Lifetime Rentals</th>
                  <th className="px-6 py-4 text-right">Lifetime Spend</th>
                  <th className="px-6 py-4 text-right">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#fcf9f8] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-zinc-500 uppercase">
                          {customer.name ? customer.name.charAt(0) : "C"}
                        </div>
                        <div>
                          <p className="font-bold text-[#001410]">{customer.name || "Unknown"}</p>
                          <p className="text-xs font-mono text-zinc-500 mt-1">{customer.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[#001410]">{customer.email}</p>
                      <p className="text-xs text-zinc-500 mt-1">{customer.phone || "No phone provided"}</p>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-[#775a19]">
                      {customer._count.orders}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[#001410]">
                      ₹{customer.totalSpent?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      {customer.isBanned ? (
                        <>
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mr-2">Banned</span>
                          <button 
                            onClick={() => handleBanToggle(customer.id, customer.isBanned)}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 uppercase tracking-wider hover:underline"
                          >
                            Unban
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider mr-2">Active</span>
                          <button 
                            onClick={() => handleBanToggle(customer.id, customer.isBanned)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-800 uppercase tracking-wider hover:underline"
                          >
                            Ban
                          </button>
                        </>
                      )}
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
