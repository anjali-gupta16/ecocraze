import React from 'react';
import { Check, Clock, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';
import type { OrderStatus } from '../../types';

interface OrderTimelineProps {
  status: OrderStatus;
  createdAt: string;
}

export default function OrderTimeline({ status, createdAt }: OrderTimelineProps) {
  if (status === 'cancelled') {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
        <XCircle className="w-5 h-5 shrink-0" />
        <div>
          <h4 className="text-sm font-bold">Order Cancelled</h4>
          <p className="text-xs text-red-600 mt-0.5">
            This order has been cancelled. Any amount paid will be refunded to the original payment source.
          </p>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: Check },
    { key: 'processing', label: 'Packaging', icon: Package },
    { key: 'shipped', label: 'Dispatched', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  ];

  const orderMap: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
  };

  const currentIndex = orderMap[status] ?? 1;

  return (
    <div className="py-4">
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-primary-600 transition-all duration-500 -z-0"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors border-2 ${
                  isCurrent
                    ? 'bg-primary-600 border-primary-600 text-white shadow-md ring-4 ring-primary-100'
                    : isDone
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[11px] font-semibold mt-2 text-center whitespace-nowrap ${
                  isCurrent
                    ? 'text-primary-700 font-bold'
                    : isDone
                    ? 'text-text-primary'
                    : 'text-text-light'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-text-light text-center mt-4">
        Ordered on {new Date(createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
    </div>
  );
}
