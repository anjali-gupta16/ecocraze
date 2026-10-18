import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { createWhatsAppUrl, getCartWhatsAppMessage } from '../../lib/whatsapp';
import Button from '../ui/Button';

interface CartSummaryProps {
  onCheckout?: () => void;
  showCheckoutBtn?: boolean;
}

export default function CartSummary({
  onCheckout,
  showCheckoutBtn = true,
}: CartSummaryProps) {
  const { items, subtotal, totalSavings, totalItems } = useCart();

  // Free shipping threshold: ₹999
  const freeShippingThreshold = 999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const grandTotal = subtotal + shippingFee;

  const whatsAppItems = items.map((i) => ({
    name: i.product.name,
    qty: i.quantity,
    price: i.unit_price,
  }));
  const whatsAppUrl = createWhatsAppUrl(getCartWhatsAppMessage(whatsAppItems, grandTotal));

  return (
    <div className="bg-white rounded-2xl border border-border p-6 shadow-sm sticky top-24">
      <h3 className="text-base font-bold text-text-primary pb-3 border-b border-border">
        Order Summary
      </h3>

      {/* Savings Callout Banner */}
      {totalSavings > 0 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-amber-900">
              Bulk Savings Applied!
            </p>
            <p className="text-[11px] text-amber-700 mt-0.5">
              You are saving <span className="font-bold">₹{totalSavings.toFixed(0)}</span> with tier discounts on this order.
            </p>
          </div>
        </div>
      )}

      {/* Breakdown */}
      <div className="space-y-3 py-4 text-xs">
        <div className="flex justify-between text-text-secondary">
          <span>Items Total ({totalItems} packets)</span>
          <span className="font-semibold text-text-primary">
            ₹{(subtotal + totalSavings).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {totalSavings > 0 && (
          <div className="flex justify-between text-emerald-700 font-semibold">
            <span>Wholesale Tier Discount</span>
            <span>- ₹{totalSavings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        )}

        <div className="flex justify-between text-text-secondary">
          <span>Discounted Subtotal</span>
          <span className="font-semibold text-text-primary">
            ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between text-text-secondary">
          <span className="flex items-center gap-1">
            Shipping Fee
            {subtotal >= freeShippingThreshold && (
              <span className="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.2 rounded font-bold">
                FREE
              </span>
            )}
          </span>
          <span className="font-semibold text-text-primary">
            {shippingFee === 0 ? '₹0.00' : `₹${shippingFee.toFixed(2)}`}
          </span>
        </div>

        {subtotal < freeShippingThreshold && subtotal > 0 && (
          <p className="text-[11px] text-primary-700 bg-primary-50 p-2 rounded-lg">
            Add ₹{(freeShippingThreshold - subtotal).toFixed(0)} more for <span className="font-bold">Free Dispatch</span>!
          </p>
        )}

        <div className="pt-3 border-t border-border flex justify-between items-baseline">
          <div>
            <span className="text-sm font-bold text-text-primary">Grand Total</span>
            <p className="text-[10px] text-text-light">Includes applicable GST</p>
          </div>
          <span className="text-xl font-bold text-primary-700">
            ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="space-y-2.5 pt-2">
        {showCheckoutBtn && (
          onCheckout ? (
            <Button
              onClick={onCheckout}
              variant="primary"
              size="lg"
              className="w-full text-sm font-bold"
              disabled={items.length === 0}
              icon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              Proceed to Checkout
            </Button>
          ) : (
            <Link to="/checkout" className="block">
              <Button
                variant="primary"
                size="lg"
                className="w-full text-sm font-bold"
                disabled={items.length === 0}
                icon={<ArrowRight className="w-4 h-4 ml-1" />}
              >
                Proceed to Checkout
              </Button>
            </Link>
          )
        )}

        {/* WhatsApp Order Option */}
        {items.length > 0 && (
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-white bg-[#25D366] hover:bg-[#20BD5A] transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-white stroke-none" />
            <span>Order Entire Cart on WhatsApp</span>
          </a>
        )}
      </div>

      {/* Trust Badges */}
      <div className="mt-5 pt-4 border-t border-border space-y-2 text-[11px] text-text-muted">
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-primary-600 shrink-0" />
          <span>Pan-India B2B freight & dispatch in 24-48 hrs</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-primary-600 shrink-0" />
          <span>GST tax invoices generated for all corporate orders</span>
        </div>
      </div>
    </div>
  );
}
