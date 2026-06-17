"use client";

import React, { useState, useEffect } from 'react';

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Create state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("Failed to load categories");
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name is required.");
      return;
    }
    
    setCreating(true);
    try {
      const slug = newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: newCategoryName.trim(), 
          slug, 
          description: newCategoryDesc.trim() 
        })
      });
      
      if (!res.ok) throw new Error("Failed to create category");
      
      const newCat = await res.json();
      setCategories([newCat, ...categories]);
      
      setIsCreateModalOpen(false);
      setNewCategoryName("");
      setNewCategoryDesc("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCategory = async (id: string, count: number) => {
    if (count > 0) {
      alert("You cannot delete a category that has products attached to it.");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");
      
      setCategories(categories.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-8 text-zinc-500 font-medium">Loading categories...</div>;

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium text-[#001410] tracking-tight">Category Management</h1>
          <p className="text-[#414846] mt-2 text-sm md:text-base">Dynamically manage the clothing categories available to boutiques.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#001410] text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#775a19] transition-colors"
        >
          + Add New Category
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-bold rounded-lg border border-rose-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {categories.length === 0 ? (
            <div className="p-16 text-center">
              <p className="text-zinc-500 text-sm">No categories found.</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left text-[#414846]">
              <thead className="bg-zinc-50 text-xs uppercase font-bold text-zinc-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Attached Products</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#fcf9f8] transition-colors group">
                    <td className="px-6 py-4 font-bold text-[#001410]">{cat.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{cat.slug}</td>
                    <td className="px-6 py-4 text-zinc-500 truncate max-w-[200px]">{cat.description || "—"}</td>
                    <td className="px-6 py-4 font-bold">{cat._count?.products || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteCategory(cat.id, cat._count?.products || 0)}
                        className={`text-xs font-bold uppercase tracking-wider hover:underline ${cat._count?.products > 0 ? "text-zinc-300 cursor-not-allowed" : "text-rose-600 hover:text-rose-800"}`}
                        disabled={cat._count?.products > 0}
                        title={cat._count?.products > 0 ? "Cannot delete category with active products" : "Delete category"}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Category Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001410]/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-zinc-200 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-zinc-100">
              <h3 className="font-serif text-xl font-bold text-[#001410]">Add New Category</h3>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1">Platform Setup</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Sarees, Indo-Western"
                  className="w-full border border-zinc-300 rounded-xl p-4 text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#001410] mb-2 block">
                  Description (Optional)
                </label>
                <textarea 
                  rows={2}
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Brief description of this category..."
                  className="w-full border border-zinc-300 rounded-xl p-4 text-sm focus:outline-none focus:border-[#775a19] focus:ring-1 focus:ring-[#775a19]"
                ></textarea>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewCategoryName("");
                  setNewCategoryDesc("");
                }}
                className="px-6 py-2.5 text-xs font-bold text-zinc-600 hover:text-[#001410] uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateCategory}
                disabled={creating || !newCategoryName.trim()}
                className="bg-[#001410] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#775a19] transition-colors disabled:opacity-50"
              >
                {creating ? "Creating..." : "Save Category"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
