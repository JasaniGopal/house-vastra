"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';

// Dynamic Product Interface
export interface DisplayProduct {
  id: string;
  brand: string;
  name: string;
  rentalPrice: string;
  retailPrice: string;
  image: string;
  category: string;
  occasions: string[];
}

// Reusable Product Card Component
const ProductCard = ({ product, priority = false }: { product: DisplayProduct, priority?: boolean }) => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link href={`/product/${product.id}`} className="group flex flex-col gap-3 relative">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          priority={priority}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-in-out" 
        />
        {/* Heart Icon */}
        <button 
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-white/70 backdrop-blur-md rounded-xl flex items-center justify-center text-[#001410] hover:bg-white hover:text-red-500 transition-colors shadow-sm"
        >
          <svg className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1">
        <h3 className="font-serif text-base md:text-lg text-[#001410] leading-snug mb-3 pr-4">{product.name}</h3>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="font-serif text-lg md:text-xl font-medium text-[#001410]">₹{product.rentalPrice}</div>
            <div className="text-[10px] md:text-xs text-zinc-500 mt-0.5">Retail: ₹{product.retailPrice}</div>
          </div>
          <div className="text-[10px] md:text-xs font-bold text-[#A8813C] uppercase tracking-wider md:hidden border-b border-[#A8813C] pb-0.5">Rent Now</div>
        </div>
      </div>
    </Link>
  );
};

function CollectionsContent() {
  const searchParams = useSearchParams();
  const occasionParam = searchParams.get('occasion');
  const categoryParam = searchParams.get('category');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(
    occasionParam ? [occasionParam] : []
  );
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [occasions, setOccasions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  // Reset visible count when products change
  useEffect(() => {
    setVisibleCount(12);
  }, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (selectedCategories.length > 0) {
          query.set('category', selectedCategories.join(','));
        }
        if (selectedOccasions.length > 0) {
          query.set('occasion', selectedOccasions.join(','));
        }
        query.set('sort', selectedSort);
        if (maxPrice < 50000) {
          query.set('maxPrice', maxPrice.toString());
        }
        if (selectedSize) {
          query.set('size', selectedSize);
        }
        
        const qParam = searchParams.get('q');
        if (qParam) {
          query.set('q', qParam);
        }

        const res = await fetch(`/api/products?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((p: any) => ({
            id: p.id,
            brand: p.vendor?.boutiqueName || "Boutique",
            name: p.name,
            rentalPrice: p.rentalPrice4Day?.toLocaleString() || "0",
            retailPrice: p.retailValue?.toLocaleString() || "0",
            image: p.images?.[0]?.url || "/images/placeholder.jpg",
            category: p.category?.name || "Uncategorized",
            occasions: p.occasions?.map((occ: any) => occ.name) || [],
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategories, selectedOccasions, selectedSort, maxPrice, selectedSize, searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    const fetchOccasions = async () => {
      try {
        const res = await fetch("/api/occasions");
        if (res.ok) {
          const data = await res.json();
          setOccasions(data);
        }
      } catch (err) {
        console.error("Failed to fetch occasions", err);
      }
    };

    fetchCategories();
    fetchOccasions();
  }, []);

  // Update occasion filter if URL changes directly
  useEffect(() => {
    if (occasionParam) {
      setSelectedOccasions(occasionParam.split(','));
    } else {
      setSelectedOccasions([]);
    }
  }, [occasionParam]);

  // Update category filter if URL changes directly
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories(categoryParam.split(','));
    } else {
      setSelectedCategories([]);
    }
  }, [categoryParam]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const toggleOccasion = (occ: string) => {
    setSelectedOccasions(prev => prev.includes(occ) ? prev.filter(o => o !== occ) : [...prev, occ]);
  };

  const toggleSize = (size: string) => {
    setSelectedSize(prev => prev === size ? '' : size);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setSelectedSize('');
  };

  // Since we are doing backend filtering now, products state is already filtered.
  // We can just use 'products' directly for rendering, except maybe Size which isn't backend-filtered yet.
  const filteredProducts = products; // or add size filtering if needed

  const isEmptyState = !loading && filteredProducts.length === 0;

  return (
    <main className="min-h-screen bg-[#fcf9f8] font-sans pb-24">
      
      {/* Top Header Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-8 border-b border-zinc-200/60">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-center md:text-left text-[#001410] mb-4 md:mb-6 tracking-tight leading-tight">Explore <br className="hidden md:block lg:hidden" />Collections</h1>
        <p className="text-sm md:text-base text-zinc-600 max-w-[600px] text-center md:text-left mx-auto md:mx-0 leading-relaxed">
          Curated heritage pieces from India's most prestigious couturiers, available for your next defining moment. Experience luxury that transcends ownership.
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-10 flex flex-col md:flex-row gap-8 lg:gap-16">
        
        {/* --- MOBILE: Horizontal Pill Filters --- */}
        <div className="md:hidden flex flex-col gap-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center gap-2 border border-zinc-300 rounded-lg px-4 py-2 text-xs font-bold text-[#001410] whitespace-nowrap bg-white hover:bg-zinc-50">
              Category
              <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </button>
            <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center gap-2 border border-zinc-300 rounded-lg px-4 py-2 text-xs font-bold text-[#001410] whitespace-nowrap bg-white hover:bg-zinc-50">
              Occasion
              <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </button>
            <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center gap-2 border border-zinc-300 rounded-lg px-4 py-2 text-xs font-bold text-[#001410] whitespace-nowrap bg-white hover:bg-zinc-50">
              Size
              <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </button>
            <button onClick={() => setIsMobileFilterOpen(true)} className="flex items-center gap-2 border border-zinc-300 rounded-lg px-4 py-2 text-xs font-bold text-[#001410] whitespace-nowrap bg-white hover:bg-zinc-50">
              Price
              <svg className="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </button>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 mb-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">{isEmptyState ? 0 : filteredProducts.length} Pieces Found</span>
            <div className="relative flex items-center gap-1 cursor-pointer shrink-0">
              <span className="text-[10px] font-bold text-[#001410] uppercase tracking-wider pointer-events-none whitespace-nowrap">Sort:</span>
              <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)} className="bg-transparent border-none text-[10px] font-bold text-[#001410] uppercase tracking-wider focus:ring-0 appearance-none pr-4 py-2 cursor-pointer z-10 w-auto text-right">
                <option value="newest">New Arrivals</option>
                <option value="price_asc">Price Low-High</option>
                <option value="price_desc">Price High-Low</option>
              </select>
              <svg className="w-3 h-3 text-[#001410] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* --- DESKTOP: Sticky Left Sidebar Filters --- */}
        <div className="hidden md:flex flex-col w-[240px] shrink-0 gap-10 sticky top-24 h-fit">
          
          {/* Sort By Dropdown */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#001410] uppercase">Sort By</span>
            <div className="relative">
               <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)} className="w-full bg-zinc-100/50 border-none rounded-lg px-4 py-3 text-xs font-medium text-[#001410] focus:ring-0 appearance-none cursor-pointer">
                 <option value="newest">New Arrivals</option>
                 <option value="price_asc">Price: Low to High</option>
                 <option value="price_desc">Price: High to Low</option>
               </select>
               <svg className="w-3 h-3 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#001410] uppercase">Category</span>
            <div className="relative">
              <select 
                value={selectedCategories[0] || ''} 
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedCategories([e.target.value]);
                  } else {
                    setSelectedCategories([]);
                  }
                }} 
                className="w-full bg-zinc-100/50 border-none rounded-lg px-4 py-3 text-xs font-medium text-[#001410] focus:ring-0 appearance-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <svg className="w-3 h-3 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </div>

          {/* Occasion Filter */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#001410] uppercase">Occasion</span>
            <div className="relative">
              <select 
                value={selectedOccasions[0] || ''} 
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedOccasions([e.target.value]);
                  } else {
                    setSelectedOccasions([]);
                  }
                }} 
                className="w-full bg-zinc-100/50 border-none rounded-lg px-4 py-3 text-xs font-medium text-[#001410] focus:ring-0 appearance-none cursor-pointer capitalize"
              >
                <option value="">All Occasions</option>
                {occasions.map(occ => (
                  <option key={occ.id} value={occ.name}>{occ.name}</option>
                ))}
              </select>
              <svg className="w-3 h-3 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </div>
          </div>

          {/* Size Filter */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#001410] uppercase">Size</span>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button 
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`w-10 h-10 border text-xs transition-colors ${
                    selectedSize === size 
                      ? 'border-[#001410] bg-[#001410] font-bold text-white' 
                      : 'border-zinc-200 bg-white font-medium text-zinc-600 hover:border-[#001410] hover:text-[#001410]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Price Range Filter */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] font-bold tracking-[0.15em] text-[#001410] uppercase">Max Daily Price</span>
            <div className="mt-2 relative">
               <input 
                 type="range" 
                 min="1000" 
                 max="50000" 
                 step="1000"
                 value={maxPrice}
                 onChange={(e) => setMaxPrice(Number(e.target.value))}
                 className="w-full accent-[#001410] cursor-pointer"
               />
               <div className="flex justify-between items-center mt-2 text-[10px] font-bold text-zinc-500">
                 <span>₹1,000</span>
                 <span className="text-[#001410]">Up to ₹{maxPrice.toLocaleString()}</span>
               </div>
            </div>
          </div>

        </div>

        {/* --- Product Grid & Empty State --- */}
        <div className="flex-1 flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center h-full">
              <h2 className="font-serif text-2xl md:text-3xl text-[#001410] mb-3">Loading Collections...</h2>
            </div>
          ) : isEmptyState ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center h-full">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#001410] mb-3">No pieces found</h2>
              <p className="text-sm text-zinc-500 mb-8 max-w-sm">
                We couldn't find any items matching your exact filters. Try adjusting your selections or clearing filters.
              </p>
              <button 
                onClick={clearFilters}
                className="bg-[#001410] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#775a19] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                {filteredProducts.slice(0, visibleCount).map((product, idx) => (
                  <ProductCard key={product.id} product={product} priority={idx < 4} />
                ))}
              </div>
              
              {/* Pagination/Load More */}
              <div className="mt-16 flex justify-center text-center">
                 {visibleCount < filteredProducts.length ? (
                   <button onClick={() => setVisibleCount(prev => prev + 12)} className="border border-[#001410] text-[#001410] px-8 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#001410] hover:text-white transition-colors">
                      Load More Pieces
                   </button>
                 ) : (
                   <p className="text-sm text-zinc-500 italic">You've seen all pieces for this selection.</p>
                 )}
              </div>
            </>
          )}
        </div>

      </div>

      {/* --- Mobile Filter Modal --- */}
      <div 
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 md:hidden ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMobileFilterOpen(false)}
      >
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 transition-transform duration-300 transform ${isMobileFilterOpen ? 'translate-y-0' : 'translate-y-full'} max-h-[85vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h3 className="font-serif text-2xl font-bold text-[#001410]">Filters</h3>
            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 -mr-2">
              <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex flex-col gap-10 overflow-y-auto pb-6 -mx-6 px-6 no-scrollbar">
            {/* Sort By */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#001410] uppercase">Sort By</span>
              <div className="relative">
                 <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)} className="w-full bg-zinc-100/50 border-none rounded-lg px-4 py-3 text-xs font-medium text-[#001410] focus:ring-0 appearance-none">
                   <option value="newest">New Arrivals</option>
                   <option value="price_asc">Price: Low to High</option>
                   <option value="price_desc">Price: High to Low</option>
                 </select>
                 <svg className="w-3 h-3 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#001410] uppercase">Category</span>
              <div className="relative">
                <select 
                  value={selectedCategories[0] || ''} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedCategories([e.target.value]);
                    } else {
                      setSelectedCategories([]);
                    }
                  }} 
                  className="w-full bg-zinc-100/50 border-none rounded-lg px-4 py-3 text-xs font-medium text-[#001410] focus:ring-0 appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={`mob-cat-${cat.id}`} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <svg className="w-3 h-3 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </div>
            </div>

            {/* Occasion Filter */}
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#001410] uppercase">Occasion</span>
              <div className="relative">
                <select 
                  value={selectedOccasions[0] || ''} 
                  onChange={(e) => {
                    if (e.target.value) {
                      setSelectedOccasions([e.target.value]);
                    } else {
                      setSelectedOccasions([]);
                    }
                  }} 
                  className="w-full bg-zinc-100/50 border-none rounded-lg px-4 py-3 text-xs font-medium text-[#001410] focus:ring-0 appearance-none cursor-pointer capitalize"
                >
                  <option value="">All Occasions</option>
                  {occasions.map(occ => (
                    <option key={`mob-occ-${occ.id}`} value={occ.name}>{occ.name}</option>
                  ))}
                </select>
                <svg className="w-3 h-3 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </div>
            </div>

            {/* Daily Price Range Filter */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#001410] uppercase">Max Daily Price</span>
              <div className="mt-2 relative">
                 <input 
                   type="range" 
                   min="1000" 
                   max="50000" 
                   step="1000"
                   value={maxPrice}
                   onChange={(e) => setMaxPrice(Number(e.target.value))}
                   className="w-full accent-[#001410] cursor-pointer"
                 />
                 <div className="flex justify-between items-center mt-2 text-[10px] font-bold text-zinc-500">
                   <span>₹1,000</span>
                   <span className="text-[#001410]">Up to ₹{maxPrice.toLocaleString()}</span>
                 </div>
              </div>
            </div>

            {/* Size Filter */}
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#001410] uppercase">Size</span>
              <div className="flex flex-wrap gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                  <button 
                    key={`mob-${size}`}
                    onClick={() => toggleSize(size)}
                    className={`w-10 h-10 border text-xs transition-colors ${
                      selectedSize === size 
                        ? 'border-[#001410] bg-[#001410] font-bold text-white' 
                        : 'border-zinc-200 bg-white font-medium text-zinc-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-4 bg-white border-t border-zinc-100 shrink-0">
            <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-[#001410] text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#00261f]">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcf9f8] flex items-center justify-center font-serif text-2xl text-[#001410]">Loading Collections...</div>}>
      <CollectionsContent />
    </Suspense>
  );
}
