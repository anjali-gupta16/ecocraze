import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'amber' | 'teal' | 'gray' | 'red' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  children,
  variant = 'green',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    green: 'bg-primary-50 text-primary-700 border-primary-200',
    amber: 'bg-amber-100 text-amber-800 border-amber-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    gray: 'bg-slate-100 text-slate-700 border-slate-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
