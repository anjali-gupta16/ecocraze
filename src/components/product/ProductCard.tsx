import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Leaf, Plus, Minus, MessageCircle, Check } from 'lucide-react';
import type { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useTracking } from '../../hooks/useTracking';
import { createWhatsAppUrl, getProductWhatsAppMessage } from '../../lib/whatsapp';
import Badge from '../ui/Badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { logAddToCart } = useTracking();

  // Find lowest bulk tier price to show "As low as ₹XX"
  const lowestPrice = product.bulk_pricing && product.bulk_pricing.length > 0
    ? Math.min(...product.bulk_pricing.map((t) => t.unit_price))
    : product.price;

  const maxSavings = Math.round(((product.price - lowestPrice) / product.price) * 100);

  // Active price for selected stepper quantity
  const getActiveRate = (qty: number) => {
    if (!product.bulk_pricing || product.bulk_pricing.length === 0) return product.price;
    const sorted = [...product.bulk_pricing].sort((a, b) => a.min_qty - b.min_qty);
    let matched = sorted[0].unit_price;
    for (const t of sorted) {
      if (qty >= t.min_qty) matched = t.unit_price;
    }
    return matched;
  };

  const activeUnitPrice = getActiveRate(quantity);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    logAddToCart(product, quantity, activeUnitPrice);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const whatsAppUrl = createWhatsAppUrl(
    getProductWhatsAppMessage(product.name, quantity, activeUnitPrice)
  );

  return (
    <div
      className="group flex flex-col bg-white rounded-2xl border border-border overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary-300 relative"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      {/* Badges Overlay */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between pointer-events-none">
        {maxSavings > 0 ? (
          <Badge variant="amber" size="sm" className="shadow-sm">
            Bulk Deal — Save {maxSavings}%
          </Badge>
        ) : (
          <Badge variant="teal" size="sm">
            Eco-Certified
          </Badge>
        )}
        <div className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-border shadow-xs text-primary-600">
          <Leaf className="w-3.5 h-3.5 fill-primary-600 text-primary-600" />
        </div>
      </div>

      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="block relative aspect-square bg-slate-50 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('plate-selection-sheet.png')) {
              target.src = '/products/plate-selection-sheet.png';
            }
          }}
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[11px] font-medium text-text-light uppercase tracking-wider">
            {product.category.replace('-', ' ')}
          </span>
          <span className="text-text-light">•</span>
          <span className="text-[11px] font-semibold text-text-secondary">
            {product.size}
          </span>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="text-sm font-semibold text-text-primary hover:text-primary-600 line-clamp-2 transition-colors mb-2"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Pricing Breakdown */}
        <div className="mt-auto pt-2 border-t border-border/70 mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-text-primary">
              ₹{activeUnitPrice.toFixed(2)}
            </span>
            <span className="text-xs text-text-muted">/ packet</span>
            {activeUnitPrice < product.price && (
              <span className="text-xs line-through text-text-light ml-auto">
                ₹{product.price.toFixed(2)}
              </span>
            )}
          </div>
          {lowestPrice < product.price && (
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">
              Wholesale tier: As low as ₹{lowestPrice.toFixed(2)}/pkt
            </p>
          )}
        </div>

        {/* Actions: Stepper + Add to Cart */}
        <div className="flex items-center gap-2 mb-2.5">
          {/* Stepper */}
          <div className="flex items-center border border-border rounded-lg bg-slate-50/70 p-0.5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-white text-text-secondary disabled:opacity-30 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-10 text-center text-xs font-bold text-text-primary bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 flex items-center justify-center rounded hover:bg-white text-text-secondary transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex-1 h-9 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold text-white transition-all cursor-pointer ${
              added
                ? 'bg-teal-700'
                : 'bg-primary-600 hover:bg-primary-700 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        </div>

        {/* WhatsApp direct wholesale trigger */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-[#128C7E] bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]" />
          <span>Order on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
