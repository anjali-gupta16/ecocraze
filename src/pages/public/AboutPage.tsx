import React from 'react';
import { Leaf, Award, Recycle, Users, Factory, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
          About Ecocraze
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-text-primary mt-4 tracking-tight leading-tight">
          Pioneering Sustainable Disposables for India’s Food Service Industry
        </h1>
        <p className="text-sm sm:text-base text-text-secondary mt-4 leading-relaxed">
          Ecocraze connects caterers, cloud kitchens, street food vendors, and institutional buyers directly with high-volume automatic rotary manufacturing hubs.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {[
          { label: 'Units Manufactured Daily', val: '2.5M+' },
          { label: 'Active Commercial Buyers', val: '500+' },
          { label: 'Plastic Eliminated Annually', val: '1,200 Tons' },
          { label: 'Cities with 48h Delivery', val: '45+' },
        ].map((s, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-border p-6 text-center shadow-xs">
            <p className="text-2xl sm:text-3xl font-extrabold text-primary-600">{s.val}</p>
            <p className="text-xs text-text-muted mt-1 font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-2xl border border-border p-8 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-text-primary mb-2">100% Tree-Free Bagasse</h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            We use sugarcane bagasse residue and recycled kraft pulp that completely compost within 90 days in standard soil conditions, leaving zero microplastic footprints.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-8 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <Factory className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-text-primary mb-2">Direct Rotary Factory Lines</h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            By eliminating multiple layers of wholesale middlemen and mandi distributors, we provide factory-direct prices with transparent per-packet bulk tier tables.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-8 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-text-primary mb-2">Commercial Rigidity & Strength</h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Tested under boiling oil, hot sambar, heavy biryani servings, and acidic gravies. Zero warping, zero sogginess, and leak-proof confidence for your events.
          </p>
        </div>
      </div>
    </div>
  );
}
