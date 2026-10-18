import React from 'react';
import type { BulkTier } from '../../types';

interface BulkPricingTableProps {
  tiers: BulkTier[];
  currentQty?: number;
  basePrice: number;
}

export default function BulkPricingTable({
  tiers,
  currentQty = 1,
  basePrice,
}: BulkPricingTableProps) {
  if (!tiers || tiers.length === 0) return null;

  const sortedTiers = [...tiers].sort((a, b) => a.min_qty - b.min_qty);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="bg-primary-50/70 px-4 py-2.5 border-b border-primary-100 flex items-center justify-between">
        <span className="text-xs font-bold text-primary-900 uppercase tracking-wider">
          Wholesale Bulk Price Breaks
        </span>
        <span className="text-[11px] font-semibold text-primary-700 bg-white px-2 py-0.5 rounded-full border border-primary-200">
          Auto-Applied in Cart
        </span>
      </div>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-border bg-slate-50/60 text-text-muted font-semibold">
            <th className="py-2.5 px-4">Quantity Tier</th>
            <th className="py-2.5 px-4">Rate / Packet</th>
            <th className="py-2.5 px-4 text-right">Wholesale Savings</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {sortedTiers.map((tier, idx) => {
            const isMatch =
              currentQty >= tier.min_qty &&
              (tier.max_qty === null || currentQty <= tier.max_qty);

            const savingsPercent = Math.round(
              ((basePrice - tier.unit_price) / basePrice) * 100
            );

            const qtyLabel =
              tier.max_qty === null
                ? `${tier.min_qty}+ packets`
                : `${tier.min_qty}–${tier.max_qty} packets`;

            return (
              <tr
                key={idx}
                className={`transition-colors ${
                  isMatch
                    ? 'bg-primary-50/90 font-bold text-primary-900 border-l-4 border-l-primary-600'
                    : 'hover:bg-slate-50/80 text-text-secondary'
                }`}
              >
                <td className="py-2.5 px-4 flex items-center gap-1.5">
                  {isMatch && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                  )}
                  <span>{qtyLabel}</span>
                </td>
                <td className="py-2.5 px-4 font-semibold text-text-primary">
                  ₹{tier.unit_price.toFixed(2)}
                </td>
                <td className="py-2.5 px-4 text-right">
                  {savingsPercent > 0 ? (
                    <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Save {savingsPercent}%
                    </span>
                  ) : (
                    <span className="text-text-light text-[11px]">Standard MRP</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
