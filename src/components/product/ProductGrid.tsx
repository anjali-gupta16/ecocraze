import React from 'react';
import type { Product } from '../../types';
import ProductCard from './ProductCard';
import EmptyState from '../ui/EmptyState';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onClearFilters?: () => void;
}

export default function ProductGrid({
  products,
  loading = false,
  onClearFilters,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-border p-4 flex flex-col gap-3 animate-pulse"
          >
            <div className="aspect-square bg-slate-200 rounded-xl" />
            <div className="h-4 bg-slate-200 rounded w-2/3" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-6 bg-slate-200 rounded w-1/3 mt-2" />
            <div className="h-9 bg-slate-200 rounded-lg mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="We couldn't find any items matching your current filters or search term."
        actionLabel={onClearFilters ? "Reset Filters" : undefined}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
