"use client";

import React, { useState, useEffect } from 'react';

export default function VendorDirectoryPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"ACTIVE" | "SUSPENDED">("SUSPENDED");
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await fetch("/api/admin/vendors");
      if (!res.ok) throw new Error("Failed to load vendors");
      const data = await res.json();
      setVendors(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatusClick = (id: string, newStatus: "ACTIVE" | "SUSPENDED") => {
    setSelectedVendorId(id);
    setConfirmAction(newStatus);
    setIsConfirmModalOpen(true);
  };

  const confirmActionExecution = async () => {
    if (!selectedVendorId) return;
    
    setIsConfirmModalOpen(false);
    
    try {
      const res = await fetch(`/api/admin/vendors/${selectedVendorId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: confirmAction })
      });
      if (!res.ok) throw new Error("Failed to update vendor status");
      
      setVendors(vendors.map(v => v.id === selectedVendorId ? { ...v, status: confirmAction } : v));
      setSelectedVendorId(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500 font-medium">Loading vendor directory...</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Vendor Directory</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Manage boutique owners and their platform access.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-lg border border-rose-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {vendors.length === 0 ? (
            <div className="p-16 text-center">
              <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">No Vendors Found</h3>
              <p className="text-zinc-500 text-sm mb-6">There are no registered boutiques on the platform yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-[#414846]">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Boutique Name</th>
                  <th className="px-6 py-4">Owner Info</th>
                  <th className="px-6 py-4">Total Inventory</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-[#fcf9f8] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {vendor.logoUrl ? (
                          <img src={vendor.logoUrl} alt="Logo" className="w-8 h-8 rounded-full border border-zinc-200 object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-500">
                            {vendor.boutiqueName.charAt(0)}
                          </div>
                        )}
                        <span className="font-bold text-[#001410]">{vendor.boutiqueName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{vendor.user?.name}</p>
                      <p className="text-[10px] text-zinc-500">{vendor.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 font-bold">{vendor._count?.products} items</td>
                    <td className="px-6 py-4">
                      {vendor.status === "ACTIVE" ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Active</span>
                      ) : vendor.status === "SUSPENDED" ? (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Suspended</span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{vendor.status}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      {vendor.status === "ACTIVE" ? (
                        <button 
                          onClick={() => handleToggleStatusClick(vendor.id, "SUSPENDED")}
                          className="text-xs font-bold text-rose-600 hover:text-rose-800 uppercase tracking-wider hover:underline"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleToggleStatusClick(vendor.id, "ACTIVE")}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-800 uppercase tracking-wider hover:underline"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirmation Modal Overlay */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001410]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-zinc-200 animate-in fade-in zoom-in duration-200">
            <div className={`p-6 border-b border-zinc-100 flex items-center gap-3 ${confirmAction === "SUSPENDED" ? "bg-rose-50/50" : "bg-emerald-50/50"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${confirmAction === "SUSPENDED" ? "bg-rose-100" : "bg-emerald-100"}`}>
                {confirmAction === "SUSPENDED" ? (
                  <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#001410]">{confirmAction === "SUSPENDED" ? "Suspend Vendor" : "Activate Vendor"}</h3>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1">Confirm Action</p>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-zinc-600">
                {confirmAction === "SUSPENDED" 
                  ? "Are you sure you want to suspend this vendor? All of their active products will be taken offline instantly."
                  : "Are you sure you want to reactivate this vendor? They will regain access to their dashboard."}
              </p>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setSelectedVendorId(null);
                }}
                className="px-6 py-2.5 text-xs font-bold text-zinc-600 hover:text-[#001410] uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmActionExecution}
                className={`text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${confirmAction === "SUSPENDED" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
