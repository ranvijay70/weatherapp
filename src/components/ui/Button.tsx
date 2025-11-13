/**
 * Reusable Button Component with Glassmorphism
 */

import React from 'react';
import { GLASSMORPHISM } from '@/src/utils/theme';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = `${GLASSMORPHISM.rounded} font-medium ${GLASSMORPHISM.transitionFast} focus:outline-none focus:ring-2 focus:ring-white/50 touch-manipulation`;
  
  const variantClasses = {
    primary: `${GLASSMORPHISM.bgHeavy} ${GLASSMORPHISM.bgHover} ${GLASSMORPHISM.bgActive} ${GLASSMORPHISM.blurLight} ${GLASSMORPHISM.borderMedium} text-white ${GLASSMORPHISM.shadowLight}`,
    secondary: `${GLASSMORPHISM.bgMedium} ${GLASSMORPHISM.bgHover} ${GLASSMORPHISM.bgActive} ${GLASSMORPHISM.blurLight} ${GLASSMORPHISM.borderMedium} text-gray-200`,
    ghost: 'bg-transparent hover:bg-white/10 text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg min-h-[48px]',
    lg: 'px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl min-h-[56px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
