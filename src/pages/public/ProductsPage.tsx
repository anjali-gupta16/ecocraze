import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { getProducts } from '../../lib/store';
import type { Product, Category } from '../../types';
import ProductGrid from '../../components/product/ProductGrid';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const categoryParam = searchParams.get('category') as Category | null;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'savings'>('featured');

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All Products' },
    { key: 'dona-bowls', label: 'Paper Dona Bowls' },
    { key: 'tissue-papers', label: 'Tissue Papers & Rolls' },
  ];

  const activeCategory = categoryParam || 'all';

  const handleSelectCategory = (cat: string) => {
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.size.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'savings') {
      result.sort((a, b) => {
        const getLowest = (p: Product) =>
          p.bulk_pricing?.length ? Math.min(...p.bulk_pricing.map((t) => t.unit_price)) : p.price;
        const saveA = a.price - getLowest(a);
        const saveB = b.price - getLowest(b);
        return saveB - saveA;
      });
    }

    return result;
  }, [products, activeCategory, searchTerm, sortBy]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSortBy('featured');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-text-primary">
          Wholesale Disposable Tableware Catalog
        </h1>
        <p className="text-sm text-text-muted mt-2">
          Transparent factory prices with automated tiered bulk discounts on every packet.
        </p>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-sm mb-8 space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => handleSelectCategory(cat.key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-50 text-text-secondary hover:bg-slate-100 hover:text-text-primary border border-border'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border">
          {/* Search Box */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-text-light absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by product, size, or material (e.g. 12 inch, bagasse, 2-ply)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-lg border border-border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-text-light shrink-0" />
            <span className="text-xs font-semibold text-text-muted hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="py-2 px-3 text-xs sm:text-sm rounded-lg border border-border bg-slate-50 font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="featured">Featured / Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="savings">Biggest Bulk Savings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs sm:text-sm font-semibold text-text-secondary">
          Showing <span className="font-bold text-text-primary">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>

        {(activeCategory !== 'all' || searchTerm) && (
          <button
            onClick={handleClearFilters}
            className="text-xs font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={filteredProducts}
        loading={loading}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
