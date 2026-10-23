import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  ShoppingCart,
  MessageCircle,
  Plus,
  Minus,
  Check,
  Leaf,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { getProductById, getProducts } from '../../lib/store';
import type { Product } from '../../types';
import { useCart } from '../../contexts/CartContext';
import { useTracking } from '../../hooks/useTracking';
import { createWhatsAppUrl, getProductWhatsAppMessage } from '../../lib/whatsapp';
import BulkPricingTable from '../../components/product/BulkPricingTable';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();
  const { logProductView, logAddToCart } = useTracking();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(id).then((p) => {
      setProduct(p);
      if (p) {
        logProductView(p);
        getProducts().then((all) => {
          setRelated(all.filter((item) => item.category === p.category && item.id !== p.id).slice(0, 3));
        });
      }
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" label="Loading product specifications..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4">
        <ErrorState
          title="Product Not Found"
          message="The requested item might be discontinued or unavailable."
          onRetry={() => navigate('/products')}
        />
      </div>
    );
  }

  // Calculate current unit price based on selected quantity
  const getActiveRate = (qty: number) => {
    if (!product.bulk_pricing || product.bulk_pricing.length === 0) return product.price;
    const sorted = [...product.bulk_pricing].sort((a, b) => a.min_qty - b.min_qty);
    let matched = sorted[0].unit_price;
    for (const t of sorted) {
      if (qty >= t.min_qty) matched = t.unit_price;
    }
    return matched;
  };

  const currentUnitPrice = getActiveRate(quantity);
  const totalAmount = currentUnitPrice * quantity;
  const standardTotal = product.price * quantity;
  const totalSavings = standardTotal - totalAmount;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    logAddToCart(product, quantity, currentUnitPrice);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const whatsAppUrl = createWhatsAppUrl(
    getProductWhatsAppMessage(product.name, quantity, currentUnitPrice)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-8 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link to="/products" className="hover:text-primary-600 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link
          to={`/products?category=${product.category}`}
          className="hover:text-primary-600 capitalize transition-colors"
        >
          {product.category.replace('-', ' ')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-text-primary font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Product Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-border bg-white shadow-sm">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('colorful-dona-bowls.jpg')) {
                  target.src = '/products/colorful-dona-bowls.jpg';
                }
              }}
            />
            <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 fill-white stroke-none" />
              <span>100% Eco Biodegradable</span>
            </div>
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg border border-border text-xs font-semibold text-text-secondary shadow-sm">
              In Stock: {product.stock} packets
            </div>
          </div>

          {/* Eco spec chips */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-center">
              <p className="text-xs font-bold text-emerald-800">Grease-Proof</p>
              <p className="text-[10px] text-emerald-600 mt-0.5">Heavy curry resistant</p>
            </div>
            <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl text-center">
              <p className="text-xs font-bold text-teal-800">Food Safe</p>
              <p className="text-[10px] text-teal-600 mt-0.5">Virgin pulp certified</p>
            </div>
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-center">
              <p className="text-xs font-bold text-amber-800">Microwavable</p>
              <p className="text-[10px] text-amber-600 mt-0.5">Heat tolerant 120°C</p>
            </div>
          </div>
        </div>

        {/* Right: Pricing, Bulk Tiers & Purchase Stepper */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200">
                {product.category.replace('-', ' ')}
              </span>
              <span className="text-xs font-semibold text-text-muted">
                SKU: PC-{product.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary leading-tight">
              {product.name}
            </h1>
            <p className="text-sm font-semibold text-text-secondary mt-1">
              Specification: {product.size}
            </p>
          </div>

          {/* Dynamic Price Display */}
          <div className="p-5 bg-white rounded-2xl border border-border shadow-xs">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-primary-700">
                ₹{currentUnitPrice.toFixed(2)}
              </span>
              <span className="text-sm text-text-muted font-medium">/ packet</span>
              {currentUnitPrice < product.price && (
                <span className="text-base line-through text-text-light font-medium">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
            </div>

            {totalSavings > 0 && (
              <div className="mt-2 flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Bulk Tier Applied! You save ₹{totalSavings.toFixed(0)} on this quantity.
                </span>
              </div>
            )}
          </div>

          {/* Bulk Tier Table Component */}
          {product.bulk_pricing && product.bulk_pricing.length > 0 && (
            <BulkPricingTable
              tiers={product.bulk_pricing}
              currentQty={quantity}
              basePrice={product.price}
            />
          )}

          {/* Interactive Stepper + Total Calculation */}
          <div className="p-5 bg-white rounded-2xl border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold uppercase text-text-primary tracking-wider">
                  Select Packets
                </label>
                <p className="text-[11px] text-text-muted">Min order: 1 packet</p>
              </div>

              {/* Stepper */}
              <div className="flex items-center border border-border rounded-xl bg-slate-50 p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white text-text-secondary disabled:opacity-30 transition-colors shadow-xs"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center text-sm font-bold text-text-primary bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white text-text-secondary transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Volume Presets */}
            <div className="flex items-center gap-2 pt-2 border-t border-border/60">
              <span className="text-[11px] font-semibold text-text-muted">Quick select:</span>
              {[1, 5, 10, 25, 50, 100].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setQuantity(preset)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-all cursor-pointer ${
                    quantity === preset
                      ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                      : 'bg-slate-50 text-text-secondary border-border hover:bg-slate-100'
                  }`}
                >
                  {preset}p
                </button>
              ))}
            </div>

            {/* Estimated Total Calculation */}
            <div className="pt-3 border-t border-border flex justify-between items-baseline text-sm">
              <span className="font-semibold text-text-secondary">Estimated Total ({quantity} packets):</span>
              <span className="text-xl font-extrabold text-text-primary">
                ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Add to Cart & WhatsApp CTAs */}
            <div className="space-y-3 pt-2">
              <Button
                onClick={handleAddToCart}
                variant="primary"
                size="lg"
                className="w-full text-base font-bold shadow-md"
                disabled={product.stock <= 0}
                icon={added ? <Check className="w-5 h-5 stroke-[2.5]" /> : <ShoppingCart className="w-5 h-5" />}
              >
                {added ? 'Added to Cart!' : `Add ${quantity} Packets to Cart`}
              </Button>

              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 rounded-lg flex items-center justify-center gap-2 text-sm font-bold text-white bg-[#25D366] hover:bg-[#20BD5A] transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                <span>Instant Bulk Order on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Delivery & Assurance Perks */}
          <div className="grid grid-cols-2 gap-3 text-xs text-text-secondary">
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-border">
              <Truck className="w-4 h-4 text-primary-600 shrink-0" />
              <span>Dispatch in 24–48 hours</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-border">
              <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
              <span>Full GST Tax Invoice</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description & Technical Table */}
      <div className="mt-16 bg-white rounded-3xl border border-border p-6 sm:p-10 shadow-sm">
        <h2 className="text-xl font-bold text-text-primary mb-4 pb-3 border-b border-border">
          Product Details & Commercial Specifications
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed max-w-3xl mb-8">
          {product.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl text-xs">
          <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
            <span className="font-semibold text-text-muted">Item Category:</span>
            <span className="font-bold text-text-primary capitalize">{product.category.replace('-', ' ')}</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
            <span className="font-semibold text-text-muted">Dimensions / Capacity:</span>
            <span className="font-bold text-text-primary">{product.size}</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
            <span className="font-semibold text-text-muted">Material Base:</span>
            <span className="font-bold text-text-primary">100% Bagasse / Virgin Pulp Kraft</span>
          </div>
          <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
            <span className="font-semibold text-text-muted">Decomposition:</span>
            <span className="font-bold text-text-primary">100% Compostable in 90 Days</span>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-6">
            Frequently Bought Together in This Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
