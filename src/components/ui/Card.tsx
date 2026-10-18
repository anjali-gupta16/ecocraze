import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export default function Card({
  children,
  hoverable = false,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`bg-surface rounded-xl border border-border p-6 transition-all duration-200 ${
        hoverable
          ? 'hover:border-primary-300 hover:shadow-md cursor-pointer'
          : ''
      } ${className}`}
      style={{
        boxShadow: hoverable ? undefined : 'var(--shadow-card)',
      }}
      {...props}
    >
      {children}
    </div>
  );
}
