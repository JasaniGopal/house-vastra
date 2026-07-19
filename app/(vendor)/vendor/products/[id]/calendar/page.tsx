"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function VendorProductCalendarPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  
  const [blockedDates, setBlockedDates] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch(`/api/vendor/products/${unwrappedParams.id}/blocked-dates`);
      if (res.ok) {
        const data = await res.json();
        setBlockedDates(data);
      }
    } catch (err) {
      console.error("Failed to fetch blocked dates", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/vendor/products/${unwrappedParams.id}/blocked-dates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate, reason }),
      });

      if (res.ok) {
        setStartDate("");
        setEndDate("");
        setReason("");
        fetchBlockedDates();
      } else {
        alert("Failed to block dates.");
      }
    } catch (err) {
      console.error("Error blocking dates:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm("Are you sure you want to unblock these dates?")) return;
    try {
      const res = await fetch(`/api/vendor/products/${unwrappedParams.id}/blocked-dates/${blockId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchBlockedDates();
      } else {
        alert("Failed to delete blocked date.");
      }
    } catch (err) {
      console.error("Error deleting block:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/vendor/products" className="text-zinc-500 hover:text-[#001410] transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#001410]">Manage Calendar</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-6 md:p-8 mb-8">
        <h2 className="text-lg font-bold text-[#001410] mb-4">Block Dates (Offline Booking)</h2>
        <p className="text-sm text-zinc-500 mb-6">
          If this item is rented offline or unavailable for maintenance, block the dates here so customers cannot rent it online.
        </p>

        <form onSubmit={handleAddBlock} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Start Date</label>
            <input 
              type="date" 
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#775a19]/20 focus:border-[#775a19]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">End Date</label>
            <input 
              type="date" 
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#775a19]/20 focus:border-[#775a19]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Reason (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. Offline rental, Dry cleaning"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#775a19]/20 focus:border-[#775a19]"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[#001410] text-white px-8 py-3 rounded-md font-bold text-sm tracking-wide hover:bg-[#00261f] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Adding..." : "Block Dates"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="p-6 border-b border-zinc-200">
          <h2 className="text-lg font-bold text-[#001410]">Currently Blocked Dates</h2>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-zinc-500">Loading calendar...</div>
        ) : blockedDates.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">No dates are currently blocked for this item.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-200">
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Dates</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Reason</th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {blockedDates.map((block) => (
                  <tr key={block.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-[#001410]">
                      {formatDate(block.startDate)} - {formatDate(block.endDate)}
                    </td>
                    <td className="py-4 px-6 text-sm text-zinc-500">
                      {block.reason || "-"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        onClick={() => handleDeleteBlock(block.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                      >
                        Unblock
                      </button>
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
