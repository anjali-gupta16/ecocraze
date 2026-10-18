import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export default function Spinner({ size = 'md', className = '', label }: SpinnerProps) {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 p-4 ${className}`}>
      <div
        className={`${sizeMap[size]} rounded-full border-primary-200 border-t-primary-600 animate-spin`}
      />
      {label && <p className="text-sm font-medium text-text-muted">{label}</p>}
    </div>
  );
}
