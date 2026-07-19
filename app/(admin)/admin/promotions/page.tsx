"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PromotionsManagementPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [oncePerUser, setOncePerUser] = useState(false);

  // Custom Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setErrorModalOpen(true);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/promotions");
      if (!res.ok) throw new Error("Failed to load promotions");
      const data = await res.json();
      setCoupons(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) return;

    try {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discountType,
          discountValue,
          usageLimit: usageLimit || null,
          oncePerUser
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create coupon");
      
      setCoupons([data, ...coupons]);
      setCode("");
      setDiscountValue("");
      setUsageLimit("");
      setOncePerUser(false);
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/promotions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      setCoupons(coupons.map(c => c.id === id ? { ...c, isActive: !currentStatus } : c));
    } catch (err: any) {
      showError(err.message);
    }
  };

  const handleDeleteCoupon = (id: string) => {
    setCouponToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!couponToDelete) return;
    
    try {
      const res = await fetch(`/api/admin/promotions/${couponToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete coupon");
      
      setCoupons(coupons.filter(c => c.id !== couponToDelete));
      setDeleteModalOpen(false);
      setCouponToDelete(null);
    } catch (err: any) {
      setDeleteModalOpen(false);
      showError(err.message);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500 font-medium">Loading promotions...</div>;

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
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Promotions & Discounts</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Generate and manage promotional coupon codes for marketing campaigns.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-[#001410] mb-4">Create New Code</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Coupon Code</label>
                <input 
                  type="text" 
                  value={code} 
                  onChange={(e) => setCode(e.target.value.toUpperCase())} 
                  placeholder="e.g. DIWALI25" 
                  className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm font-bold text-[#001410] focus:outline-none focus:border-[#775a19] uppercase"
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Type</label>
                  <select 
                    value={discountType} 
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm font-bold text-[#001410] focus:outline-none focus:border-[#775a19]"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Value</label>
                  <input 
                    type="number" 
                    value={discountValue} 
                    onChange={(e) => setDiscountValue(e.target.value)} 
                    placeholder={discountType === "PERCENTAGE" ? "25" : "500"} 
                    className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm font-bold text-[#001410] focus:outline-none focus:border-[#775a19]"
                    required 
                    min="1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Usage Limit (Optional)</label>
                <input 
                  type="number" 
                  value={usageLimit} 
                  onChange={(e) => setUsageLimit(e.target.value)} 
                  placeholder="Leave empty for unlimited" 
                  className="w-full px-4 py-2 border border-zinc-200 rounded-xl text-sm font-bold text-[#001410] focus:outline-none focus:border-[#775a19]"
                  min="1"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="oncePerUser"
                  checked={oncePerUser}
                  onChange={(e) => setOncePerUser(e.target.checked)}
                  className="w-4 h-4 text-[#775a19] border-zinc-300 rounded focus:ring-[#775a19] focus:ring-2"
                />
                <label htmlFor="oncePerUser" className="text-sm font-medium text-[#414846] select-none cursor-pointer">
                  Limit to one use per customer
                </label>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-[#001410] text-white rounded-xl font-bold text-sm hover:bg-[#775a19] transition-colors"
              >
                Generate Code
              </button>
            </form>
          </div>
        </div>

        {/* List of Coupons */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              {coupons.length === 0 ? (
                <div className="p-16 text-center">
                  <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">No Promotions Created</h3>
                  <p className="text-zinc-500 text-sm mb-6">Create your first discount code using the form.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left text-[#414846]">
                  <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Code</th>
                      <th className="px-6 py-4">Discount</th>
                      <th className="px-6 py-4 text-center">Usage</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {coupons.map((coupon) => (
                      <tr key={coupon.id} className="hover:bg-[#fcf9f8] transition-colors group">
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-[#001410] tracking-widest text-base">{coupon.code}</span>
                          {coupon.oncePerUser && (
                            <span className="block text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">
                              1 per user
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-[#775a19]">
                            {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-zinc-600">
                          {coupon.usageCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ""}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button 
                              onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors ${
                                coupon.isActive 
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-800"
                                  : "bg-zinc-100 text-zinc-500 hover:bg-emerald-100 hover:text-emerald-800"
                              }`}
                            >
                              {coupon.isActive ? "Active" : "Inactive"}
                            </button>
                            <button
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete Coupon"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-xl">
            <h3 className="font-serif text-xl font-bold text-[#001410] mb-2">Delete Coupon?</h3>
            <p className="text-zinc-500 text-sm mb-6">Are you sure you want to permanently delete this coupon? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-zinc-500 hover:text-[#001410] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-xl">
            <h3 className="font-serif text-xl font-bold text-red-600 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Error
            </h3>
            <p className="text-zinc-600 text-sm mb-6">{errorMessage}</p>
            <div className="flex justify-end">
              <button 
                onClick={() => setErrorModalOpen(false)}
                className="px-4 py-2 bg-[#001410] text-white text-sm font-bold rounded-lg hover:bg-[#775a19] transition-colors"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
