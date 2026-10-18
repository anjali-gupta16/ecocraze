import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  title: string;
  subtitle: string;
  itemCount: string;
  imageUrl: string;
}

export default function CategoryCard({
  category,
  title,
  subtitle,
  itemCount,
  imageUrl,
}: CategoryCardProps) {
  return (
    <Link
      to={`/products?category=${category}`}
      className="group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent" />
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-primary-800 text-xs font-bold px-2.5 py-1 rounded-full border border-border/50">
          {itemCount}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-text-primary group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center text-xs font-bold text-primary-600 group-hover:text-primary-700">
          <span>Explore Wholesale Catalog</span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
