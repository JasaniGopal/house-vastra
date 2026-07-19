"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductCategoryFilter({ categories }: { categories: { id: string, name: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Filter:</label>
      <select
        value={currentCategory}
        onChange={(e) => {
          if (e.target.value === 'all') {
            router.push('/vendor/products');
          } else {
            router.push(`/vendor/products?category=${e.target.value}`);
          }
        }}
        className="bg-white border border-zinc-300 rounded-lg px-3 py-2 text-sm text-[#001410] font-medium focus:outline-none focus:border-[#001410] cursor-pointer"
      >
        <option value="all">All Categories</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
