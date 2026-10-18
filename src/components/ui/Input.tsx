import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', id, type, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const resolvedType = isPassword && showPassword ? 'text' : type;

    // Password toggle replaces any custom rightIcon
    const rightElement = isPassword ? (
      <button
        type="button"
        onClick={() => setShowPassword((v) => !v)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-light hover:text-text-secondary transition-colors cursor-pointer"
        tabIndex={-1}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    ) : rightIcon ? (
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-light">
        {rightIcon}
      </div>
    ) : null;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-text-primary uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-light">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-light/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              leftIcon ? 'pl-10' : ''
            } ${rightElement ? 'pr-10' : ''} ${
              error
                ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                : 'border-border hover:border-border-dark'
            } ${className}`}
            {...props}
          />
          {rightElement}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-text-muted">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

