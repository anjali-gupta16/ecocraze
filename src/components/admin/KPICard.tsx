import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string | number;
  change?: number; // e.g. +12.5%
  changePeriod?: string;
  icon?: React.ReactNode;
  subtitle?: string;
}

export default function KPICard({
  label,
  value,
  change,
  changePeriod = 'vs last week',
  icon,
  subtitle,
}: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="bg-white rounded-2xl border border-border p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-text-muted">{label}</span>
        {icon && (
          <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl font-extrabold text-text-primary tracking-tight">
          {value}
        </span>
        {change !== undefined && (
          <div
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{isPositive ? `+${change}%` : `${change}%`}</span>
          </div>
        )}
      </div>

      {(changePeriod || subtitle) && (
        <p className="text-[11px] text-text-light mt-1.5 font-medium">
          {subtitle || `${changePeriod}`}
        </p>
      )}
    </div>
  );
}
