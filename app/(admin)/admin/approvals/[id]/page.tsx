"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function AdminReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [product, setProduct] = useState<any>(null);
  
  // Admin fields
  const [rentalPrice, setRentalPrice] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [isTrending, setIsTrending] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) throw new Error("Failed to load product details");
        const data = await res.json();
        setProduct(data);
        
        // Pre-fill with vendor's expected rent + a markup (e.g., 20% margin)
        // This is just a helper for the admin
        if (data.vendorExpectedRent) {
          const suggestedPrice = Math.ceil(data.vendorExpectedRent * 1.2);
          setRentalPrice(suggestedPrice.toString());
        }
        if (data.vendorExpectedDeposit) {
          setSecurityDeposit(data.vendorExpectedDeposit.toString());
        }
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleApprove = async () => {
    if (!rentalPrice || parseFloat(rentalPrice) <= 0) {
      setError("Please set a valid final rental price.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/products/${id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rentalPrice: parseFloat(rentalPrice),
          securityDeposit: parseFloat(securityDeposit || "0"),
          isTrending
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to approve product");
      }

      router.push("/admin/approvals");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleRejectClick = () => {
    setIsRejectModalOpen(true);
  };

  const confirmRejection = async () => {
    if (rejectionReasonInput.trim() === "") {
      setError("You must provide a reason for rejection.");
      setIsRejectModalOpen(false);
      return;
    }
    
    setSaving(true);
    setIsRejectModalOpen(false);
    try {
      const res = await fetch(`/api/admin/products/${id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalStatus: "REJECTED",
          rejectionReason: rejectionReasonInput.trim()
        })
      });

      if (!res.ok) throw new Error("Failed to reject product");
      
      router.push("/admin/approvals");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500 font-medium">Loading review details...</div>;
  if (!product) return <div className="p-8 text-rose-500 font-medium">Product not found.</div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/admin/approvals" className="text-zinc-500 hover:text-[#001410] text-sm font-bold flex items-center gap-2 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Pending Approvals
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Review Outfit</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleRejectClick}
            disabled={saving}
            className="bg-white border border-rose-200 text-rose-600 py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-rose-50 transition-all disabled:opacity-50"
          >
            Reject
          </button>
          <button 
            onClick={handleApprove}
            disabled={saving}
            className="bg-emerald-600 text-white py-3 px-8 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saving ? "Processing..." : "Approve & Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Images */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
             <h2 className="font-serif text-xl font-medium text-[#001410] mb-6 border-b border-zinc-100 pb-4">Outfit Gallery</h2>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {product.images?.map((img: any) => (
                  <div key={img.id} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100">
                    <img src={img.url} className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
             <h2 className="font-serif text-xl font-medium text-[#001410] mb-6 border-b border-zinc-100 pb-4">Details provided by Vendor</h2>
             
             <div className="space-y-6">
               <div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 mb-1">Outfit Name</p>
                 <p className="text-base font-medium text-[#001410]">{product.name}</p>
               </div>
               <div>
                 <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 mb-1">Description</p>
                 <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">{product.description}</p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 mb-1">Category</p>
                   <p className="text-sm font-medium text-[#001410]">{product.category?.name}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 mb-1">Sizes</p>
                   <p className="text-sm font-medium text-[#001410]">{product.sizes}</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Col: Pricing Engine */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border-2 border-[#001410] shadow-md relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-[#fcf9f8] rounded-bl-full -z-10"></div>
             
             <h2 className="font-serif text-xl font-medium text-[#001410] mb-6">Pricing Engine</h2>
             
             <div className="space-y-4 mb-8">
               <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                 <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Retail Value</span>
                 <span className="font-serif text-lg text-zinc-400 line-through">₹{product.retailValue?.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                 <span className="text-xs font-bold uppercase tracking-wider text-[#775a19]">Vendor Wants</span>
                 <span className="font-serif text-xl font-bold text-[#775a19]">₹{product.vendorExpectedRent?.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center pb-4 border-b border-zinc-100">
                 <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Vendor Exp. Deposit</span>
                 <span className="font-serif text-lg font-medium text-zinc-600">₹{product.vendorExpectedDeposit?.toLocaleString()}</span>
               </div>
             </div>

             <div className="mb-6">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                  Set Final Rental Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-xl text-zinc-400">₹</span>
                  <input 
                    type="number" 
                    value={rentalPrice} 
                    onChange={e => setRentalPrice(e.target.value)} 
                    className="w-full border-2 border-emerald-500 rounded-xl pl-8 pr-4 py-4 font-serif text-2xl font-bold text-[#001410] focus:outline-none focus:ring-4 focus:ring-emerald-50" 
                    placeholder="0.00"
                    required 
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-2 font-medium">
                  This is the exact price the customer will see and pay on the website.
                </p>
             </div>

             <div className="mb-6">
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                  Set Final Security Deposit (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-xl text-zinc-400">₹</span>
                  <input 
                    type="number" 
                    value={securityDeposit} 
                    onChange={e => setSecurityDeposit(e.target.value)} 
                    className="w-full border border-zinc-300 rounded-xl pl-8 pr-4 py-3 font-serif text-xl text-[#001410] focus:outline-none focus:border-emerald-500" 
                    placeholder="0.00"
                    required 
                  />
                </div>
             </div>

             <div className="flex items-center gap-3 bg-amber-50 p-4 rounded-xl border border-amber-200 cursor-pointer" onClick={() => setIsTrending(!isTrending)}>
               <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${isTrending ? 'bg-amber-500 border-amber-500' : 'bg-white border-amber-300'}`}>
                 {isTrending && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
               </div>
               <div>
                 <p className="text-sm font-bold text-amber-900">Show in Trending Carousel</p>
                 <p className="text-[10px] text-amber-700">Display this outfit prominently on the homepage.</p>
               </div>
             </div>
          </div>

          <div className="bg-[#fcf9f8] p-6 rounded-2xl border border-zinc-200">
             <h3 className="text-xs font-bold uppercase tracking-wider text-[#001410] mb-2">Margin Calculator</h3>
             <div className="flex justify-between items-center text-sm">
               <span className="text-zinc-500">Platform Profit:</span>
               <span className="font-bold text-emerald-600">
                 ₹{(parseFloat(rentalPrice || "0") - (product.vendorExpectedRent || 0)).toLocaleString()}
               </span>
             </div>
             <div className="w-full h-2 bg-zinc-200 rounded-full mt-3 overflow-hidden flex">
               <div className="bg-[#775a19] h-full" style={{ width: `${(product.vendorExpectedRent / parseFloat(rentalPrice || "1")) * 100}%`}}></div>
               <div className="bg-emerald-500 h-full flex-1"></div>
             </div>
             <div className="flex justify-between text-[9px] uppercase font-bold text-zinc-400 mt-1">
               <span>Vendor Cut</span>
               <span>House Cut</span>
             </div>
          </div>

        </div>

      </div>

      {/* Rejection Modal Overlay */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001410]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-zinc-200 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-100 flex items-center gap-3 bg-rose-50/50">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#001410]">Reject Outfit</h3>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1">Provide Feedback to Boutique</p>
              </div>
            </div>
            
            <div className="p-6">
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                Reason for Rejection <span className="text-rose-500">*</span>
              </label>
              <textarea 
                rows={4}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="e.g. The images are too blurry, please upload high-quality photos with good lighting..."
                className="w-full border border-zinc-300 rounded-xl p-4 text-sm focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                autoFocus
              ></textarea>
              <p className="text-[10px] text-zinc-500 font-medium mt-2">This exact message will be shown to the vendor on their dashboard so they can fix the issue and re-submit.</p>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectionReasonInput("");
                }}
                className="px-6 py-2.5 text-xs font-bold text-zinc-600 hover:text-[#001410] uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRejection}
                disabled={rejectionReasonInput.trim() === ""}
                className="bg-rose-600 text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
