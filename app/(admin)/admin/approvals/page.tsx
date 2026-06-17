import React from 'react';
import prisma from "@/lib/prisma";
import Link from 'next/link';

export default async function AdminApprovalsPage() {
  
  const pendingProducts = await prisma.product.findMany({
    where: { approvalStatus: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      vendor: {
        include: { user: true }
      },
      category: true,
      images: true
    }
  });

  return (
    <div className="p-4 md:p-8">
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Pending Approvals</h1>
        <p className="text-[#414846] mt-2 text-sm md:text-base">Review vendor submissions and set final rental prices.</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {pendingProducts.length === 0 ? (
            <div className="p-16 text-center">
              <svg className="w-12 h-12 text-zinc-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">All Caught Up!</h3>
              <p className="text-zinc-500 text-sm mb-6">There are no pending outfits waiting for approval right now.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Boutique</th>
                  <th className="px-6 py-4">Outfit Details</th>
                  <th className="px-6 py-4">Vendor Expected Rent</th>
                  <th className="px-6 py-4">Submitted On</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-[#414846]">
                {pendingProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#fcf9f8] transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#001410]">{product.vendor.boutiqueName || "Unnamed Boutique"}</p>
                      <p className="text-[10px] uppercase text-zinc-500 tracking-wider">{product.vendor.user.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0].url} alt={product.name} className="w-12 h-12 rounded-md object-cover shrink-0 border border-zinc-200" />
                        ) : (
                          <div className="w-12 h-12 bg-zinc-100 rounded-md shrink-0 border border-zinc-200"></div>
                        )}
                        <div>
                          <p className="font-bold text-[#001410] line-clamp-1">{product.name}</p>
                          <p className="text-xs text-zinc-500 truncate w-48">{product.category.name} | {product.sizes}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-serif text-lg font-bold text-[#001410]">₹{product.vendorExpectedRent?.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-xs text-zinc-500">
                      {product.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/approvals/${product.id}`} 
                        className="bg-rose-50 text-rose-600 font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-rose-600 hover:text-white transition-colors"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
