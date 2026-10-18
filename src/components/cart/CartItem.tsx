import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';
import { useCart } from '../../contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity, unit_price, tier_label } = item;

  const savingsPerPacket = Math.max(0, product.price - unit_price);
  const totalItemSavings = savingsPerPacket * quantity;
  const lineTotal = unit_price * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-border transition-all hover:border-slate-300">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link
          to={`/products/${product.id}`}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-slate-50 shrink-0 border border-border"
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('plate-selection-sheet.png')) {
                target.src = '/products/plate-selection-sheet.png';
              }
            }}
          />
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            to={`/products/${product.id}`}
            className="text-sm font-semibold text-text-primary hover:text-primary-600 truncate block"
          >
            {product.name}
          </Link>
          <p className="text-xs text-text-muted mt-0.5">{product.size}</p>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs font-bold text-text-primary">
              ₹{unit_price.toFixed(2)}/pkt
            </span>
            {savingsPerPacket > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Tag className="w-3 h-3" />
                {tier_label || 'Bulk Tier Applied'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stepper, Line Total & Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-border rounded-lg bg-slate-50/70 p-0.5">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
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
            onChange={(e) => updateQuantity(product.id, Math.max(1, parseInt(e.target.value) || 1))}
            className="w-12 text-center text-xs font-bold text-text-primary bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-white text-text-secondary transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right min-w-[80px]">
          <div className="text-sm font-bold text-text-primary">
            ₹{lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          {totalItemSavings > 0 && (
            <div className="text-[11px] font-semibold text-emerald-600">
              Save ₹{totalItemSavings.toFixed(0)}
            </div>
          )}
        </div>

        {/* Remove */}
        <button
          onClick={() => removeFromCart(product.id)}
          className="text-text-light hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          title="Remove from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
