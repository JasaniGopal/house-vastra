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
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [newSelectedFiles, setNewSelectedFiles] = useState<File[]>([]);
  const [newPreviewUrls, setNewPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    retailValue: "",
    vendorExpectedRent: "",
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
          description: product.description,
          retailValue: product.retailValue.toString(),
          vendorExpectedRent: product.vendorExpectedRent.toString(),
          sizes: product.sizes,
          approvalStatus: product.approvalStatus,
          rejectionReason: product.rejectionReason,
        });
        
        setExistingImages(product.images || []);
        
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
      let uploadedUrls: string[] = [];

      // 1. Upload any brand new images first
      if (newSelectedFiles.length > 0) {
        setUploadProgress(`Uploading 0 of ${newSelectedFiles.length} new files...`);
        for (let i = 0; i < newSelectedFiles.length; i++) {
          setUploadProgress(`Uploading ${i + 1} of ${newSelectedFiles.length} files...`);
          const fileData = new FormData();
          fileData.append("file", newSelectedFiles[i]);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: fileData
          });

          if (!uploadRes.ok) {
            throw new Error(`Failed to upload image ${i + 1}`);
          }

          const uploadJson = await uploadRes.json();
          uploadedUrls.push(uploadJson.url);
        }
      }

      setUploadProgress("Saving outfit details...");

      // 2. Submit the product update to the database
      const res = await fetch(`/api/vendor/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          deletedImageIds,
          newImageUrls: uploadedUrls
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
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">Designer & Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410]" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">Retail Value (₹)</label>
              <input type="number" value={formData.retailValue} onChange={e => setFormData({...formData, retailValue: e.target.value})} className="w-full border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410]" required />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">Your Expected Rent (₹)</label>
              <input type="number" value={formData.vendorExpectedRent} onChange={e => setFormData({...formData, vendorExpectedRent: e.target.value})} className="w-full border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410]" required />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">Available Sizes</label>
            <input type="text" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} className="w-full border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410]" required />
          </div>

          <div>
             <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-4 block border-t border-zinc-100 pt-6">Image Gallery</label>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {/* Existing Images */}
                {existingImages.filter(img => !deletedImageIds.includes(img.id)).map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 group">
                    <img src={img.url} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setDeletedImageIds([...deletedImageIds, img.id])}
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                
                {/* New Image Previews */}
                {newPreviewUrls.map((url, index) => (
                  <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#001410] bg-zinc-100 group">
                    <div className="absolute top-0 left-0 bg-[#001410] text-white text-[9px] font-bold px-2 py-1 rounded-br-lg z-10">NEW</div>
                    <img src={url} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => {
                        const newFiles = [...newSelectedFiles];
                        newFiles.splice(index, 1);
                        setNewSelectedFiles(newFiles);
                        
                        const newUrls = [...newPreviewUrls];
                        newUrls.splice(index, 1);
                        setNewPreviewUrls(newUrls);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-rose-500 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 z-10"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
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
                      setNewSelectedFiles([...newSelectedFiles, ...filesArray]);
                      
                      const urls = filesArray.map(file => URL.createObjectURL(file));
                      setNewPreviewUrls([...newPreviewUrls, ...urls]);
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
