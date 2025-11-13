/**
 * Reusable Input Component with Glassmorphism
 */

import React from 'react';
import { GLASSMORPHISM } from '@/src/utils/theme';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  fullWidth = true,
  className = '',
  ...props
}, ref) => {
  const baseClasses = `px-4 py-3 sm:py-3.5 text-base sm:text-lg ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.bgMedium} ${GLASSMORPHISM.blurLight} border text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent ${GLASSMORPHISM.transitionFast} ${GLASSMORPHISM.shadowLight}`;
  
  const borderClass = error ? 'border-red-400' : GLASSMORPHISM.borderHeavy;
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`${baseClasses} ${borderClass} ${widthClass} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
