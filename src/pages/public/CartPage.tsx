import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';

export default function CartPage() {
  const { items, clearCart, totalItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={<ShoppingCart className="w-12 h-12 text-primary-400 stroke-1" />}
          title="Your Cart is Empty"
          description="You haven't added any disposable plates, bowls or tissue papers to your cart yet. Explore our wholesale catalog for great bulk prices."
          actionLabel="Explore Wholesale Catalog"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-primary-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            Wholesale Order Cart ({totalItems} {totalItems === 1 ? 'packet' : 'packets'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 self-start sm:self-auto transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Cart</span>
        </button>
      </div>

      {/* Main Grid: Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}

          {/* Quick Notice */}
          <div className="p-4 bg-primary-50/70 border border-primary-200/60 rounded-xl text-xs text-primary-900 leading-relaxed">
            <span className="font-bold">Wholesale Tier Guarantee:</span> Bulk quantity discounts are calculated automatically based on your packet volume. Add more to unlock higher tier pricing!
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-4">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
