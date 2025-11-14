/**
 * Reusable Card Component with Glassmorphism
 */

import React from 'react';
import { GLASSMORPHISM, SPACING } from '@/src/utils/theme';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  fullWidth?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
  fullWidth = true,
  ...props
}) => {
  const baseClasses = `${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${GLASSMORPHISM.shadow}`;
  const hoverClass = hover ? `${GLASSMORPHISM.bgHover} ${GLASSMORPHISM.transition}` : '';
  const widthClass = fullWidth ? 'w-full' : '';
  
  const paddingClasses = {
    sm: SPACING.sm,
    md: SPACING.md,
    lg: SPACING.lg,
  };

  return (
    <div className={`${baseClasses} ${paddingClasses[padding]} ${hoverClass} ${widthClass} ${className}`} {...props}>
      {children}
    </div>
  );
};
