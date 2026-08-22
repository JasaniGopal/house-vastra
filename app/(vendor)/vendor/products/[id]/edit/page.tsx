"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { use } from 'react';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  
  // Advanced Image Management State
  interface GalleryItem {
    id?: string;
    url: string;
    file?: File;
  }
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    gender: "WOMEN",
    description: "",
    retailValue: "",
    vendorExpectedRent: "",
    vendorExpectedDeposit: "",
    sizes: "",
    approvalStatus: "",
    rejectionReason: null as string | null,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Categories
        const catRes = await fetch("/api/categories");
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }

        // Fetch Product Data
        const prodRes = await fetch(`/api/vendor/products/${id}`);
        if (!prodRes.ok) {
          throw new Error("Failed to load product data");
        }
        const product = await prodRes.json();
        
        setFormData({
          name: product.name,
          categoryId: product.categoryId,
          gender: product.gender || "WOMEN",
          description: product.description,
          retailValue: product.retailValue.toString(),
          vendorExpectedRent: product.vendorExpectedRent.toString(),
          vendorExpectedDeposit: product.vendorExpectedDeposit.toString(),
          sizes: product.sizes,
          approvalStatus: product.approvalStatus,
          rejectionReason: product.rejectionReason,
        });
        
        
        // Sort by sequence if available
        const sortedImages = [...(product.images || [])].sort((a: any, b: any) => {
          if (a.sequence !== undefined && b.sequence !== undefined) return a.sequence - b.sequence;
          if (a.isPrimary) return -1;
          if (b.isPrimary) return 1;
          return 0;
        });

        setGallery(sortedImages.map((img: any) => ({
          id: img.id,
          url: img.url
        })));
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let orderedImageUrls: string[] = [];

      for (let i = 0; i < gallery.length; i++) {
        const item = gallery[i];
        if (item.file) {
          setUploadProgress(`Uploading new image...`);
          const fileData = new FormData();
          fileData.append("file", item.file);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: fileData
          });

          if (!uploadRes.ok) throw new Error(`Failed to upload new image`);
          
          const uploadJson = await uploadRes.json();
          orderedImageUrls.push(uploadJson.url);
        } else {
          orderedImageUrls.push(item.url);
        }
      }

      setUploadProgress("Saving outfit details...");

      // 2. Submit the product update to the database
      const res = await fetch(`/api/vendor/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          orderedImageUrls
        })
      });

      if (!res.ok) {
        throw new Error("Failed to save changes");
      }

      router.push("/vendor/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this outfit? This action cannot be undone.")) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/vendor/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete outfit");
      
      router.push("/vendor/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500 font-medium">Loading outfit details...</div>;

  const moveImage = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === gallery.length - 1) return;
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    const newGallery = [...gallery];
    const temp = newGallery[index];
    newGallery[index] = newGallery[newIndex];
    newGallery[newIndex] = temp;
    setGallery(newGallery);
  };

  const removeImage = (index: number) => {
    const newGallery = [...gallery];
    newGallery.splice(index, 1);
    setGallery(newGallery);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/vendor/products" className="text-zinc-500 hover:text-[#001410] text-sm font-bold flex items-center gap-2 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Inventory
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Edit Outfit</h1>
        </div>
        <button 
          onClick={handleDelete}
          disabled={deleting}
          className="bg-white border border-rose-200 text-rose-600 py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-rose-50 transition-all w-fit disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete Outfit"}
        </button>
      </div>

      {formData.approvalStatus === "REJECTED" && (
        <div className="mb-8 p-6 bg-rose-50 border-2 border-rose-200 rounded-2xl">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-rose-900 mb-1">Outfit Rejected</h3>
              <p className="text-sm text-rose-700 font-medium mb-3">
                <strong>Admin Feedback:</strong> {formData.rejectionReason}
              </p>
              <p className="text-xs text-rose-600/80">
                Please fix the issues mentioned above. Saving changes to this outfit will automatically re-submit it for approval.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">Outfit Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410]" required />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">Category</label>
              <select value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410]" required>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">Gender</label>
              <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410]" required>
                <option value="WOMEN">Women</option>
                <option value="MEN">Men</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">Designer & Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410]" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">Retail Value (₹)</label>
              <input type="number" value={formData.retailValue} onChange={e => setFormData({...formData, retailValue: e.target.value})} className="w-full border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410]" required />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">Your Expected Rent (₹)</label>
              <input type="number" value={formData.vendorExpectedRent} onChange={e => setFormData({...formData, vendorExpectedRent: e.target.value})} className="w-full border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410]" required />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">Expected Deposit (₹)</label>
              <input type="number" value={formData.vendorExpectedDeposit} onChange={e => setFormData({...formData, vendorExpectedDeposit: e.target.value})} className="w-full border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410]" required />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">Available Sizes</label>
            <input type="text" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} className="w-full border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410]" required />
          </div>

          <div>
             <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-4 block border-t border-zinc-100 pt-6">Image Gallery</label>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Unified Gallery */}
                {gallery.map((item, index) => (
                  <div key={item.id || `new-${index}`} className={`relative aspect-square rounded-lg overflow-hidden border-2 bg-zinc-100 group ${item.file ? 'border-[#001410]' : 'border-zinc-200'}`}>
                    {item.file && (
                      <div className="absolute top-0 left-0 bg-[#001410] text-white text-[9px] font-bold px-2 py-1 rounded-br-lg z-10">NEW</div>
                    )}
                    {index === 0 && !item.file && (
                      <div className="absolute top-2 left-2 bg-[#A8813C] text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">Cover Image</div>
                    )}
                    {index === 0 && item.file && (
                      <div className="absolute top-2 right-2 bg-[#A8813C] text-white text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">Cover Image</div>
                    )}
                    <img src={item.url} className="w-full h-full object-cover" />
                    
                    <button 
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 z-20"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <button 
                        type="button"
                        onClick={() => moveImage(index, 'left')}
                        disabled={index === 0}
                        className="bg-white/90 backdrop-blur text-[#001410] p-1.5 rounded-full shadow-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <button 
                        type="button"
                        onClick={() => moveImage(index, 'right')}
                        disabled={index === gallery.length - 1}
                        className="bg-white/90 backdrop-blur text-[#001410] p-1.5 rounded-full shadow-sm hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
             </div>
             
             {/* Upload More Area */}
             <div className="w-full bg-zinc-50 border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      const filesArray = Array.from(e.target.files);
                      const newItems = filesArray.map(file => ({
                        url: URL.createObjectURL(file),
                        file
                      }));
                      setGallery([...gallery, ...newItems]);
                    }
                  }}
                  className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#001410] file:text-white hover:file:bg-[#00261f] cursor-pointer"
                />
                <p className="text-xs text-zinc-400 mt-3">Select more images to add to this outfit's gallery.</p>
             </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
            <p className="text-sm text-emerald-600 font-medium">{uploadProgress}</p>
            <button type="submit" disabled={saving || deleting} className="bg-[#001410] text-white py-3 px-8 font-sans font-bold text-[13px] uppercase tracking-[0.15em] hover:bg-[#00261f] transition-all disabled:opacity-70">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
