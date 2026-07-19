"use client";

import React from 'react';

export default function DownloadCsvButton({ payouts }: { payouts: any[] }) {
  
  const handleDownload = () => {
    if (payouts.length === 0) return;

    // Create CSV Header
    let csvContent = "Date,Reference ID,Status,Amount (INR)\n";

    // Add rows
    payouts.forEach(p => {
      const date = new Date(p.createdAt).toLocaleDateString("en-IN");
      const ref = p.referenceId || "N/A";
      const status = p.status;
      const amount = p.amount;
      
      csvContent += `${date},${ref},${status},${amount}\n`;
    });

    // Create Blob and Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `payouts_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (payouts.length === 0) return null;

  return (
    <button 
      onClick={handleDownload}
      className="text-[10px] font-bold uppercase tracking-wider text-[#775a19] hover:text-[#001410] hover:underline flex items-center gap-1"
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download CSV
    </button>
  );
}
