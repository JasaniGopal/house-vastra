import React from 'react';
import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function VendorProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user.role !== "VENDOR" && session.user.role !== "ADMIN")) {
    redirect("/partner-login");
  }

  const vendor = await prisma.vendor.findUnique({
    where: { userId: session.user.id },
  });

  if (!vendor) {
    redirect("/partner-login");
  }

  const products = await prisma.product.findMany({
    where: { vendorId: vendor.id },
    orderBy: { createdAt: "desc" },
    include: { category: true, images: true }
  });

  return (
    <div className="p-4 md:p-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">My Products</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Manage your boutique's uploaded inventory.</p>
        </div>
        <Link href="/vendor/products/new" className="bg-[#001410] text-white py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#00261f] hover:shadow-lg transition-all w-fit shrink-0">
          + Add New Outfit
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {products.length === 0 ? (
            <div className="p-16 text-center">
              <svg className="w-12 h-12 text-zinc-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
              <h3 className="text-[#001410] font-serif text-xl font-medium mb-2">No Outfits Yet</h3>
              <p className="text-zinc-500 text-sm mb-6">You haven't uploaded any products to your boutique.</p>
              <Link href="/vendor/products/new" className="text-[#775a19] font-bold text-sm uppercase tracking-wider hover:underline">
                Upload First Outfit
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Outfit Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Retail Value</th>
                  <th className="px-6 py-4">Expected Rent</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-[#414846]">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-[#fcf9f8] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0].url} alt={product.name} className="w-12 h-12 rounded-md object-cover shrink-0 border border-zinc-200" />
                        ) : (
                          <div className="w-12 h-12 bg-zinc-100 rounded-md shrink-0 border border-zinc-200"></div>
                        )}
                        <div>
                          <p className="font-bold text-[#001410] line-clamp-1">{product.name}</p>
                          <p className="text-xs text-zinc-500 truncate w-48">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.category.name}</td>
                    <td className="px-6 py-4 font-medium text-zinc-500">₹{product.retailValue.toString()}</td>
                    <td className="px-6 py-4 font-bold text-[#001410]">₹{product.vendorExpectedRent?.toString()}</td>
                    <td className="px-6 py-4">
                      {product.approvalStatus === "APPROVED" && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Live</span>
                      )}
                      {product.approvalStatus === "PENDING" && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Pending Review</span>
                      )}
                      {product.approvalStatus === "REJECTED" && (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Rejected</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/vendor/products/${product.id}/edit`} className="text-xs font-bold text-[#775a19] hover:text-[#001410] uppercase tracking-wider hover:underline">
                        Edit
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
