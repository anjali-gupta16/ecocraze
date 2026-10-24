import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  Layers,
  Sparkles,
  MessageCircle,
  Star,
  Quote,
} from 'lucide-react';
import { getProducts } from '../../lib/store';
import type { Product } from '../../types';
import CategoryCard from '../../components/product/CategoryCard';
import ProductGrid from '../../components/product/ProductGrid';
import Button from '../../components/ui/Button';
import { createWhatsAppUrl } from '../../lib/whatsapp';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      // Pick 4 featured products
      setFeaturedProducts(data.slice(0, 4));
      setLoading(false);
    });
  }, []);

  const whatsAppQuoteUrl = createWhatsAppUrl(
    'Hello Ecocraze! I need a wholesale quote for my catering / restaurant requirements.'
  );

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50/60 via-canvas to-canvas pt-12 sm:pt-20 pb-12 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <div className="inline-flex items-center gap-2 self-start bg-emerald-100/80 text-primary-800 px-3.5 py-1.5 rounded-full border border-primary-300/60 text-xs font-bold tracking-wide">
                <Leaf className="w-3.5 h-3.5 text-primary-700" />
                <span>100% Eco-Friendly & Food Grade Certified</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight leading-[1.15]">
                Direct Wholesale for{' '}
                <span className="text-primary-600 underline decoration-primary-200 decoration-wavy underline-offset-8">
                  Dona Bowls
                </span>
                {' '}& Tissues
              </h1>

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed max-w-2xl">
                Serving restaurants, caterers, food stalls, and event organisers across India.
                Unlock automatic volume discounts up to <span className="font-bold text-amber-700">30% off</span> on bulk cartons with fast pan-India dispatch.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link to="/products">
                  <Button variant="primary" size="lg" className="shadow-lg font-bold" icon={<ArrowRight className="w-4 h-4 ml-1" />}>
                    Browse Wholesale Catalog
                  </Button>
                </Link>

                <a
                  href={whatsAppQuoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-50 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                  <span>Request Custom Bulk Quote</span>
                </a>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/80">
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-primary-700">₹0.45</p>
                  <p className="text-xs text-text-muted mt-0.5 font-medium">Starting unit price</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-primary-700">500+</p>
                  <p className="text-xs text-text-muted mt-0.5 font-medium">Verified Caterers</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-extrabold text-primary-700">24-48h</p>
                  <p className="text-xs text-text-muted mt-0.5 font-medium">Fast Dispatch</p>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-primary-200/60 shadow-2xl bg-white p-3">
                <img
                  src="/products/colorful-dona-bowls.jpg"
                  alt="Ecocraze Dona Bowls and Tableware Collection"
                  className="rounded-2xl w-full h-[380px] object-cover object-center"
                />

                {/* Floating Badge 1 */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 border border-border shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary">Tiered Bulk Savings</p>
                    <p className="text-[11px] text-emerald-600 font-semibold">Save more on 10+ and 50+ packs</p>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-full px-3.5 py-1.5 border border-border shadow-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-text-primary">GST Tax Invoice Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
            Explore Categories
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-3">
            High-Grade Disposable Supplies
          </h2>
          <p className="text-sm text-text-muted mt-2">
            Manufactured with strict quality controls for heavy gravies, hot snacks, and dining elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CategoryCard
            category="dona-bowls"
            title="Paper Dona Bowls"
            subtitle="Deep curry, chaat, and sweet bowls with leak-proof lining (100ml to 450ml jumbo sizes)."
            itemCount="4 Products"
            imageUrl="/products/colorful-dona-bowls.jpg"
          />
          <CategoryCard
            category="tissue-papers"
            title="Tissue Papers & Rolls"
            subtitle="Soft paper table napkins, dispenser tissues, and absorbent kitchen paper rolls."
            itemCount="4 Products"
            imageUrl="/products/ojas-paper-napkins.jpg"
          />
        </div>
      </section>

      {/* 3. WHY CHOOSE US */}
      <section className="bg-white py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              Why Ecocraze
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-3">
              Built for Commercial Kitchens & Caterers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Leaf className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-1.5">100% Eco-Friendly</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Biodegradable bagasse and recyclable kraft paper, 100% food-grade compliant.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-1.5">Tiered Wholesale Rates</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Save 10% to 30% as your order volume increases. Transparent per-packet savings.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-1.5">Pan-India Logistics</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Reliable freight delivery with e-Way billing and express dispatch within 48 hours.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-1.5">GST Input Credit</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Valid B2B tax invoices provided with every shipment to claim maximum GST input.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
              Wholesale Bestsellers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-2">
              Featured Products & Bulk Deals
            </h2>
          </div>
          <Link to="/products" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
            <span>View All 8 Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} loading={loading} />
      </section>

      {/* 5. BULK DEALS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-800 to-primary-950 text-white p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block bg-amber-500 text-slate-900 font-extrabold text-xs uppercase px-3 py-1 rounded-full tracking-wider mb-4">
              Enterprise & Distributor Program
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Ordering More Than 100 Cartons or Need Custom Logo Branding?
            </h2>
            <p className="text-primary-100 text-sm sm:text-base mt-4 leading-relaxed">
              We supply directly from state-of-the-art automatic rotary press lines.
              Get factory-direct rates, custom brand printing on tissue napkins and plates, and scheduled recurring dispatches.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <a
                href={whatsAppQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors shadow-lg"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                <span>Chat with Wholesale Manager on WhatsApp</span>
              </a>

              <Link to="/contact">
                <Button variant="secondary" size="md" className="border-white text-white hover:bg-white/10">
                  Request Callback
                </Button>
              </Link>
            </div>
          </div>

          {/* Background decorative leaf */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
            <Leaf className="w-96 h-96" />
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
            Client Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary mt-3">
            Trusted by 500+ Indian Businesses
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: 'The 12-inch silver plates hold heavy wedding daal makhani and gravies without sagging. The 50+ packet tier pricing saved our catering business over ₹18,000 last season!',
              name: 'Rajesh Sharma',
              role: 'Owner, Sharma Grand Caterers (Jaipur)',
              rating: 5,
            },
            {
              quote: 'We switched our 6 restaurant outlets to Ecocraze interfold dispenser napkins. Reduced napkin waste by almost 30% and delivery is always on time.',
              name: 'Ananya Deshmukh',
              role: 'Procurement Head, Desi Bowls Cafe (Pune)',
              rating: 5,
            },
            {
              quote: 'WhatsApp ordering is seamless! I just send my monthly requirement and the dispatch happens next day with full GST invoices. Top notch reliability.',
              name: 'Mohd. Imran',
              role: 'Partner, Royal Biryani & Catering (Hyderabad)',
              rating: 5,
            },
          ].map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-none" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-xs font-bold text-text-primary">{t.name}</p>
                  <p className="text-[11px] text-text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
