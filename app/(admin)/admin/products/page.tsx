"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LiveInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"OFFLINE" | "ONLINE">("OFFLINE");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  const [selectedVendorId, setSelectedVendorId] = useState<string>("ALL");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/inventory");
      if (!res.ok) throw new Error("Failed to load inventory");
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTakeOfflineClick = (id: string) => {
    setSelectedProductId(id);
    setConfirmAction("OFFLINE");
    setIsConfirmModalOpen(true);
  };

  const handlePutOnlineClick = (id: string) => {
    setSelectedProductId(id);
    setConfirmAction("ONLINE");
    setIsConfirmModalOpen(true);
  };

  const confirmActionExecution = async () => {
    if (!selectedProductId) return;
    
    const isOnline = confirmAction === "ONLINE";
    setIsConfirmModalOpen(false);
    
    try {
      const res = await fetch(`/api/admin/inventory/${selectedProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: isOnline })
      });
      if (!res.ok) throw new Error(`Failed to update status`);
      
      setProducts(products.map(p => p.id === selectedProductId ? { ...p, isAvailable: isOnline } : p));
      setSelectedProductId(null);
    } catch (err: any) {
      setError(err.message);
    }
  };



  const vendors = Array.from(new Set(products.filter(p => p.vendor).map(p => p.vendor.id))).map(id => {
    return products.find(p => p.vendor?.id === id)?.vendor;
  });

  const filteredProducts = selectedVendorId === "ALL" 
    ? products 
    : products.filter(p => p.vendor?.id === selectedVendorId);

  if (loading) return <div className="p-8 text-zinc-500 font-medium">Loading inventory...</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Live Inventory</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Manage all approved products currently on the platform.</p>
        </div>
        <div>
          <select 
            value={selectedVendorId}
            onChange={(e) => setSelectedVendorId(e.target.value)}
            className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-[#001410] focus:outline-none focus:border-[#775a19]"
          >
            <option value="ALL">All Boutiques</option>
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.id}>{vendor.boutiqueName}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-lg border border-rose-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <div className="p-16 text-center">
              <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">No Approved Products</h3>
              <p className="text-zinc-500 text-sm mb-6">There are currently no live products matching this filter.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-[#414846]">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product Details</th>
                  <th className="px-6 py-4">Boutique</th>
                  <th className="px-6 py-4">Final Rent (Per Day)</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#fcf9f8] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0].url} alt={product.name} className="w-12 h-12 rounded-md object-cover shrink-0 border border-zinc-200" />
                        ) : (
                          <div className="w-12 h-12 bg-zinc-100 rounded-md shrink-0 border border-zinc-200"></div>
                        )}
                        <div>
                          <p className="font-bold text-[#001410] line-clamp-1">{product.name}</p>
                          <p className="text-[10px] uppercase text-zinc-500 tracking-wider">{product.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{product.vendor?.boutiqueName}</td>
                    <td className="px-6 py-4 font-bold text-[#001410]">₹{product.rentalPricePerDay?.toString()}</td>
                    <td className="px-6 py-4">
                      {product.isAvailable ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Live / Public</span>
                      ) : (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Offline</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      {product.isAvailable ? (
                        <button 
                          onClick={() => handleTakeOfflineClick(product.id)}
                          className="text-xs font-bold text-rose-600 hover:text-rose-800 uppercase tracking-wider hover:underline"
                        >
                          Take Offline
                        </button>
                      ) : (
                        <button 
                          onClick={() => handlePutOnlineClick(product.id)}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-800 uppercase tracking-wider hover:underline"
                        >
                          Put Live
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
            <div className={`p-6 border-b border-zinc-100 flex items-center gap-3 ${confirmAction === "OFFLINE" ? "bg-rose-50/50" : "bg-emerald-50/50"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${confirmAction === "OFFLINE" ? "bg-rose-100" : "bg-emerald-100"}`}>
                {confirmAction === "OFFLINE" ? (
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
                <h3 className="font-serif text-xl font-bold text-[#001410]">{confirmAction === "OFFLINE" ? "Take Offline" : "Put Live"}</h3>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1">Confirm Action</p>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-zinc-600">
                {confirmAction === "OFFLINE" 
                  ? "Are you sure you want to take this product offline? Customers will no longer be able to see or rent it."
                  : "Are you sure you want to put this product live? It will be immediately visible to customers on the homepage."}
              </p>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setSelectedProductId(null);
                }}
                className="px-6 py-2.5 text-xs font-bold text-zinc-600 hover:text-[#001410] uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmActionExecution}
                className={`text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${confirmAction === "OFFLINE" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
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
