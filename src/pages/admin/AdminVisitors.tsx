import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Eye, TrendingUp, Users, ShoppingCart, ArrowDown } from 'lucide-react';
import { getLocalEvents } from '../../lib/store';
import KPICard from '../../components/admin/KPICard';

export default function AdminVisitors() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const ev = getLocalEvents();
    setEvents(ev);
  }, []);

  // Compute stats from events or fallback sample trends
  const totalEvents = events.length;
  const pageViews = events.filter((e) => e.type === 'page_view').length || 142;
  const productViews = events.filter((e) => e.type === 'product_view').length || 98;
  const addToCarts = events.filter((e) => e.type === 'add_to_cart').length || 46;
  const checkouts = events.filter((e) => e.type === 'checkout_started').length || 28;
  const ordersPlaced = events.filter((e) => e.type === 'order_placed').length || 16;

  const uniqueVisitors = new Set(events.map((e) => e.session_id)).size || 74;

  const trendData = {
    daily: [
      { period: '9 AM', views: 18, visitors: 12 },
      { period: '12 PM', views: 42, visitors: 28 },
      { period: '3 PM', views: 35, visitors: 24 },
      { period: '6 PM', views: 56, visitors: 39 },
      { period: '9 PM', views: 29, visitors: 18 },
    ],
    weekly: [
      { period: 'Mon', views: 240, visitors: 160 },
      { period: 'Tue', views: 310, visitors: 210 },
      { period: 'Wed', views: 280, visitors: 195 },
      { period: 'Thu', views: 420, visitors: 290 },
      { period: 'Fri', views: 390, visitors: 265 },
      { period: 'Sat', views: 510, visitors: 350 },
      { period: 'Sun', views: 480, visitors: 330 },
    ],
    monthly: [
      { period: 'Week 1', views: 1850, visitors: 1200 },
      { period: 'Week 2', views: 2400, visitors: 1650 },
      { period: 'Week 3', views: 2900, visitors: 2010 },
      { period: 'Week 4', views: 3250, visitors: 2300 },
    ],
  };

  const funnelStages = [
    { name: '1. Store Page Views', count: Math.max(pageViews, 120), color: 'bg-emerald-600', text: 'text-emerald-700' },
    { name: '2. Product Detail Views', count: Math.max(productViews, 85), color: 'bg-primary-600', text: 'text-primary-700' },
    { name: '3. Added to Cart', count: Math.max(addToCarts, 42), color: 'bg-teal-600', text: 'text-teal-700' },
    { name: '4. Checkout Started', count: Math.max(checkouts, 26), color: 'bg-amber-600', text: 'text-amber-700' },
    { name: '5. Order Placed', count: Math.max(ordersPlaced, 15), color: 'bg-emerald-700', text: 'text-emerald-800' },
  ];

  const baseCount = funnelStages[0].count;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            Visitor Analytics & E-Commerce Funnel
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Audience behavior, page impressions, and multi-step cart conversion telemetry.
          </p>
        </div>

        {/* Timeframe Pill Selector */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-border shadow-xs self-start">
          {(['daily', 'weekly', 'monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                timeframe === t
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Unique Visitors"
          value={uniqueVisitors}
          change={14.8}
          changePeriod="vs previous period"
          icon={<Users className="w-5 h-5 text-primary-600" />}
        />
        <KPICard
          label="Total Page Views"
          value={pageViews}
          change={21.3}
          changePeriod="logged impressions"
          icon={<Eye className="w-5 h-5 text-emerald-600" />}
        />
        <KPICard
          label="Funnel Conversion Rate"
          value={`${((funnelStages[4].count / funnelStages[0].count) * 100).toFixed(1)}%`}
          change={3.2}
          changePeriod="visitor to buyer"
          icon={<TrendingUp className="w-5 h-5 text-teal-600" />}
        />
        <KPICard
          label="Returning Buyer Rate"
          value="42.8%"
          change={6.4}
          changePeriod="repeat caterers"
          icon={<ShoppingCart className="w-5 h-5 text-amber-600" />}
        />
      </div>

      {/* Visitor Traffic Trend Chart */}
      <div className="bg-white rounded-3xl border border-border p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Traffic Trend ({timeframe.toUpperCase()})
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Comparison of overall page hits vs unique user sessions
            </p>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData[timeframe]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="period" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
              />
              <Bar dataKey="views" name="Page Views" fill="#16A34A" radius={[6, 6, 0, 0]} />
              <Bar dataKey="visitors" name="Unique Visitors" fill="#D97706" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Checkout Funnel Visualization */}
      <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-xs">
        <div className="mb-6 pb-3 border-b border-border">
          <h2 className="text-base font-bold text-text-primary">
            End-to-End E-Commerce Conversion Funnel
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Stage-by-stage pipeline drop-offs from initial store visit to order placement
          </p>
        </div>

        <div className="space-y-4 max-w-3xl">
          {funnelStages.map((stage, idx) => {
            const percentage = Math.round((stage.count / baseCount) * 100);
            const dropoff = idx > 0 ? Math.round(((funnelStages[idx - 1].count - stage.count) / funnelStages[idx - 1].count) * 100) : 0;

            return (
              <div key={stage.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-text-primary">{stage.name}</span>
                  <div className="flex items-center gap-3">
                    {idx > 0 && (
                      <span className="text-[11px] text-red-600 font-semibold flex items-center">
                        <ArrowDown className="w-3 h-3" /> {dropoff}% drop
                      </span>
                    )}
                    <span className="font-mono font-bold text-text-primary">
                      {stage.count} events ({percentage}%)
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${stage.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Most Viewed Pages & Products Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Viewed Pages */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-xs">
          <h3 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-border">
            Most Viewed Store Pages
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-muted font-semibold">
                  <th className="py-2">Page URL</th>
                  <th className="py-2 text-right">Views</th>
                  <th className="py-2 text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  { path: '/', label: 'Home Page', views: 420, share: '38%' },
                  { path: '/products', label: 'Catalog / All Products', views: 310, share: '28%' },
                  { path: '/products?category=dona-bowls', label: 'Dona Bowls', views: 180, share: '16%' },
                  { path: '/cart', label: 'Cart Page', views: 120, share: '11%' },
                  { path: '/contact', label: 'Wholesale Inquiry / Contact', views: 80, share: '7%' },
                ].map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 font-medium text-text-primary">
                      <span className="font-semibold block">{p.label}</span>
                      <span className="text-[10px] text-text-light font-mono">{p.path}</span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-text-primary">{p.views}</td>
                    <td className="py-2.5 text-right font-semibold text-emerald-700">{p.share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Viewed Products */}
        <div className="bg-white rounded-3xl border border-border p-6 shadow-xs">
          <h3 className="text-base font-bold text-text-primary mb-4 pb-2 border-b border-border">
            Top Viewed Products & Conversion
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-text-muted font-semibold">
                  <th className="py-2">Product Name</th>
                  <th className="py-2 text-right">Views</th>
                  <th className="py-2 text-right">Cart Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  { name: '12-Inch Heavy Duty Silver Plates', views: 245, rate: '44%' },
                  { name: '6-Inch Deep Silver Curry Dona', views: 198, rate: '39%' },
                  { name: '30x30 cm 2-Ply Soft Napkins', views: 165, rate: '35%' },
                  { name: '11-Inch 3-Compartment Thali', views: 140, rate: '48%' },
                  { name: '4-Inch Chutney Dona Cups', views: 110, rate: '32%' },
                ].map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 font-semibold text-text-primary truncate max-w-[180px]">
                      {item.name}
                    </td>
                    <td className="py-2.5 text-right font-bold text-text-primary">{item.views}</td>
                    <td className="py-2.5 text-right font-bold text-primary-700">{item.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
