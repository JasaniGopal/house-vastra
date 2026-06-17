"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductStatusToggle({ 
  productId, 
  initialAvailability 
}: { 
  productId: string, 
  initialAvailability: boolean 
}) {
  const [isAvailable, setIsAvailable] = useState(initialAvailability);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleStatus = async () => {
    setLoading(true);
    const newValue = !isAvailable;
    
    try {
      const res = await fetch(`/api/vendor/products/${productId}/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: newValue })
      });

      if (res.ok) {
        setIsAvailable(newValue);
        router.refresh();
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <button 
        onClick={toggleStatus}
        disabled={loading}
        className={`relative inline-flex h-4 w-8 items-center rounded-full transition-colors ${
          isAvailable ? 'bg-emerald-500' : 'bg-zinc-300'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
            isAvailable ? 'translate-x-4' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
        {isAvailable ? "In Stock" : "Sold Out"}
      </span>
    </div>
  );
}
