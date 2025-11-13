/**
 * Reusable Card Component with Glassmorphism
 */

import React from 'react';
import { GLASSMORPHISM, SPACING } from '@/src/utils/theme';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
}) => {
  const baseClasses = `${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${GLASSMORPHISM.shadow}`;
  const hoverClass = hover ? `${GLASSMORPHISM.bgHover} ${GLASSMORPHISM.transition}` : '';
  
  const paddingClasses = {
    sm: SPACING.sm,
    md: SPACING.md,
    lg: SPACING.lg,
  };

  return (
    <div className={`${baseClasses} ${paddingClasses[padding]} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};
