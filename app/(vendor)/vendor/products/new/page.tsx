"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    retailValue: "",
    vendorExpectedRent: "",
    vendorExpectedDeposit: "",
    sizes: ""
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, categoryId: data[0].id }));
          }
        }
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Clean up inputs
      const sizesArray = formData.sizes.split(",").map(s => s.trim()).filter(Boolean);

      // 1. Upload the files first
      if (selectedFiles.length === 0) {
        throw new Error("Please select at least one image or video.");
      }

      setUploadProgress(`Uploading 0 of ${selectedFiles.length} files...`);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress(`Uploading file ${i + 1} of ${selectedFiles.length}...`);
        
        const fileData = new FormData();
        fileData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fileData
        });

        if (!uploadRes.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const uploadJson = await uploadRes.json();
        uploadedUrls.push(uploadJson.url);
      }

      setUploadProgress("Saving outfit details...");

      // 2. Submit the product to the database
      const payload = {
        name: formData.name,
        categoryId: formData.categoryId,
        description: formData.description,
        retailValue: parseFloat(formData.retailValue),
        vendorExpectedRent: parseFloat(formData.vendorExpectedRent),
        vendorExpectedDeposit: parseFloat(formData.vendorExpectedDeposit),
        sizes: formData.sizes,
        images: uploadedUrls // API maps this array of strings
      };

      const res = await fetch("/api/vendor/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to upload outfit");
      }

      router.push("/vendor/products");
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      
      <div className="mb-8">
        <Link href="/vendor/products" className="text-zinc-500 hover:text-[#001410] text-sm font-bold flex items-center gap-2 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Inventory
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Add New Outfit</h1>
        <p className="text-[#414846] mt-2 text-sm">Upload a new designer piece to the Rent Vastra collection.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                Outfit Name
              </label>
              <input
                type="text"
                placeholder="e.g. Midnight Blue Sequin Lehenga"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410]"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                Category
              </label>
              <select
                value={formData.categoryId}
                onChange={e => setFormData({...formData, categoryId: e.target.value})}
                className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410]"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
              Designer & Description
            </label>
            <textarea
              placeholder="Describe the fabric, designer, embroidery work, etc."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                Retail Value (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 150000"
                value={formData.retailValue}
                onChange={e => setFormData({...formData, retailValue: e.target.value})}
                className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410]"
                required
              />
              <p className="text-xs text-zinc-500 mt-1">Original market price.</p>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                Your Expected Rent (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 4000"
                value={formData.vendorExpectedRent}
                onChange={e => setFormData({...formData, vendorExpectedRent: e.target.value})}
                className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410]"
                required
              />
              <p className="text-xs text-zinc-500 mt-1">Desired rental earning.</p>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                Expected Deposit (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 1200"
                value={formData.vendorExpectedDeposit}
                onChange={e => setFormData({...formData, vendorExpectedDeposit: e.target.value})}
                className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410]"
                required
              />
              <p className="text-xs text-zinc-500 mt-1">Desired security deposit.</p>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
              Available Sizes
            </label>
            <input
              type="text"
              placeholder="S, M, L, XL"
              value={formData.sizes}
              onChange={e => setFormData({...formData, sizes: e.target.value})}
              className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410]"
              required
            />
            <p className="text-xs text-zinc-500 mt-1">Separate sizes with commas.</p>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
              Outfit Media (Multiple Images)
            </label>
            <div className="w-full bg-zinc-50 border-2 border-dashed border-zinc-300 rounded-xl p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    const filesArray = Array.from(e.target.files);
                    setSelectedFiles(filesArray);
                    
                    // Generate local preview URLs
                    const urls = filesArray.map(file => URL.createObjectURL(file));
                    setPreviewUrls(urls);
                  }
                }}
                className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#001410] file:text-white hover:file:bg-[#00261f] cursor-pointer"
                required
              />
              <p className="text-xs text-zinc-400 mt-3">Select 4 to 5 images showing different views of the outfit.</p>
            </div>
            
            {/* Image Previews */}
            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100">
                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            
            {selectedFiles.length > 0 && (
              <p className="text-xs text-emerald-600 mt-2 font-bold">{selectedFiles.length} file(s) selected ready for upload.</p>
            )}
          </div>

          <div className="pt-4 border-t border-zinc-100 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#001410] text-white py-3 px-8 font-sans font-bold text-[13px] uppercase tracking-[0.15em] hover:bg-[#00261f] transition-all disabled:opacity-70"
            >
              {loading ? (uploadProgress || "Submitting...") : "Submit for Approval"}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
