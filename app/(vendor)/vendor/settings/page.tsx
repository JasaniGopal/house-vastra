"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VendorSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    boutiqueName: "",
    description: "",
    gstin: "",
    bankAccount: "",
    ifscCode: "",
    logoUrl: ""
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/vendor/profile");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            boutiqueName: data.boutiqueName || "",
            description: data.description || "",
            gstin: data.gstin || "",
            bankAccount: data.bankAccount || "",
            ifscCode: data.ifscCode || "",
            logoUrl: data.logoUrl || ""
          });
        }
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/vendor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
      router.refresh(); // Refresh layout to update boutique name in sidebar
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-zinc-500 font-medium">Loading profile...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Boutique Settings</h1>
        <p className="text-[#414846] mt-2 text-sm">Manage your business profile and payout details.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 md:p-8">
        
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Business Details */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#775a19] mb-4 border-b border-zinc-100 pb-2">Business Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                  Boutique Name
                </label>
                <input
                  type="text"
                  value={formData.boutiqueName}
                  onChange={e => setFormData({...formData, boutiqueName: e.target.value})}
                  className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410]"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                  GSTIN (Tax ID)
                </label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={e => setFormData({...formData, gstin: e.target.value})}
                  className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410]"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                Boutique Description
              </label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410]"
              />
            </div>
          </div>

          {/* Section 2: Payout Details */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#775a19] mb-4 border-b border-zinc-100 pb-2">Payout Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={formData.bankAccount}
                  onChange={e => setFormData({...formData, bankAccount: e.target.value})}
                  className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410] font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={e => setFormData({...formData, ifscCode: e.target.value})}
                  className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410] font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Branding */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#775a19] mb-4 border-b border-zinc-100 pb-2">Branding</h2>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                Logo URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={formData.logoUrl}
                onChange={e => setFormData({...formData, logoUrl: e.target.value})}
                className="w-full bg-white border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-[#001410] focus:ring-1 focus:ring-[#001410]"
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#001410] text-white py-3 px-8 font-sans font-bold text-[13px] uppercase tracking-[0.15em] hover:bg-[#00261f] transition-all disabled:opacity-70"
            >
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
