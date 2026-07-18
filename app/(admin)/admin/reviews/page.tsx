"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= rating ? "text-amber-400" : "text-zinc-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((d) => { setReviews(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const approve = async (id: string) => {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: true }),
    });
    const updated = await res.json();
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, isApproved: true } : r));
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/admin/reviews/${deleteTarget}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== deleteTarget));
    setDeleteTarget(null);
  };

  const pending = reviews.filter((r) => !r.isApproved);
  const approved = reviews.filter((r) => r.isApproved);

  if (loading) return <div className="p-8 text-zinc-500 animate-pulse">Loading reviews...</div>;

  const ReviewCard = ({ review }: { review: any }) => (
    <div className={`bg-white border rounded-2xl p-5 shadow-sm ${!review.isApproved ? "border-amber-200" : "border-zinc-200"}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <StarRating rating={review.rating} />
          <p className="font-bold text-sm text-[#001410] mt-1">{review.customer?.name}</p>
          <p className="text-xs text-zinc-400">{review.product?.name}</p>
        </div>
        <p className="text-xs text-zinc-400 shrink-0">{new Date(review.createdAt).toLocaleDateString("en-IN")}</p>
      </div>
      {review.comment && (
        <p className="text-sm text-zinc-600 mb-4 leading-relaxed">{review.comment}</p>
      )}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setDeleteTarget(review.id)}
          className="text-xs font-bold text-zinc-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
        >
          Delete
        </button>
        {!review.isApproved && (
          <button
            onClick={() => approve(review.id)}
            className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            ✓ Approve & Publish
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-[#775a19] transition-colors mb-4 group">
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </Link>
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Review Moderation</h1>
        <p className="text-[#414846] mt-2 text-sm">Approve or remove customer reviews before they go live on product pages.</p>
      </div>

      {/* Pending Queue */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-serif text-xl font-bold text-[#001410]">Pending Approval</h2>
          {pending.length > 0 && (
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full">{pending.length}</span>
          )}
        </div>
        {pending.length === 0 ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 text-center">
            <p className="text-emerald-700 font-bold">All caught up!</p>
            <p className="text-emerald-600 text-sm mt-1">No reviews are waiting for approval.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </div>

      {/* Approved */}
      <div>
        <h2 className="font-serif text-xl font-bold text-[#001410] mb-4">Live Reviews ({approved.length})</h2>
        {approved.length === 0 ? (
          <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-8 text-center">
            <p className="text-zinc-500 text-sm">No approved reviews yet. Approved reviews will appear here and on product pages.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approved.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-serif text-xl font-bold text-[#001410] mb-2">Delete Review?</h3>
            <p className="text-zinc-500 text-sm mb-6">This will permanently remove the review and it cannot be recovered.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="text-sm font-bold text-zinc-500 hover:text-[#001410] cursor-pointer">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
