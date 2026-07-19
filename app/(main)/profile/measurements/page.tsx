"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function MeasurementsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    height: "",
    bust: "",
    waist: "",
    hips: "",
    customNotes: ""
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchMeasurements();
    }
  }, [status]);

  const fetchMeasurements = async () => {
    try {
      const res = await fetch('/api/profile/measurements');
      if (res.ok) {
        const data = await res.json();
        if (data.id) {
          setFormData({
            height: data.height || "",
            bust: data.bust || "",
            waist: data.waist || "",
            hips: data.hips || "",
            customNotes: data.customNotes || ""
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/profile/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        showToast("Measurement Profile saved successfully!");
      } else {
        showToast("Failed to save profile.");
      }
    } catch (err) {
      showToast("Error saving profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-[#fcf9f8] font-sans pb-24">
      <div className="max-w-[800px] mx-auto px-4 md:px-8 pt-8 md:pt-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#775a19] transition-colors mb-4 group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Measurement Profile</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Ensure a perfect fit for your luxury rentals.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#001410] uppercase tracking-wider mb-2">Height</label>
              <input 
                type="text" 
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 5'6&quot;"
                className="w-full border border-zinc-300 rounded px-4 py-3 text-sm focus:border-[#001410] focus:ring-0 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#001410] uppercase tracking-wider mb-2">Bust (Inches)</label>
              <input 
                type="text" 
                name="bust"
                value={formData.bust}
                onChange={handleChange}
                placeholder="e.g. 34&quot;"
                className="w-full border border-zinc-300 rounded px-4 py-3 text-sm focus:border-[#001410] focus:ring-0 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#001410] uppercase tracking-wider mb-2">Waist (Inches)</label>
              <input 
                type="text" 
                name="waist"
                value={formData.waist}
                onChange={handleChange}
                placeholder="e.g. 28&quot;"
                className="w-full border border-zinc-300 rounded px-4 py-3 text-sm focus:border-[#001410] focus:ring-0 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#001410] uppercase tracking-wider mb-2">Hips (Inches)</label>
              <input 
                type="text" 
                name="hips"
                value={formData.hips}
                onChange={handleChange}
                placeholder="e.g. 38&quot;"
                className="w-full border border-zinc-300 rounded px-4 py-3 text-sm focus:border-[#001410] focus:ring-0 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#001410] uppercase tracking-wider mb-2">Custom Tailoring Notes</label>
            <textarea 
              name="customNotes"
              value={formData.customNotes}
              onChange={handleChange}
              placeholder="e.g. Please ensure blouse length is slightly longer, prefer loose fit around arms."
              className="w-full border border-zinc-300 rounded px-4 py-3 text-sm focus:border-[#001410] focus:ring-0 outline-none h-32 resize-none"
            ></textarea>
          </div>
          
          <button 
            type="submit"
            disabled={saving}
            className="w-full md:w-auto self-end bg-[#001410] text-white px-8 py-4 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* Custom Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-4 md:right-8 z-50 transition-all duration-300 transform translate-y-0 opacity-100">
          <div className="bg-[#001410] text-white px-6 py-4 rounded-sm shadow-2xl flex items-center gap-3 border border-[#775a19]/30">
            <svg className="w-5 h-5 text-[#775a19]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span className="font-sans text-xs md:text-[13px] uppercase font-bold tracking-wider">{toastMessage}</span>
          </div>
        </div>
      )}
    </main>
  );
}
