/**
 * Theme and Design System Constants
 * Glassmorphism design system
 */

export const GLASSMORPHISM = {
  // Background styles
  bg: 'bg-white/10',
  bgHover: 'hover:bg-white/15',
  bgActive: 'active:bg-white/20',
  bgLight: 'bg-white/5',
  bgMedium: 'bg-white/10',
  bgHeavy: 'bg-white/20',
  
  // Backdrop blur
  blur: 'backdrop-blur-md',
  blurLight: 'backdrop-blur-sm',
  blurHeavy: 'backdrop-blur-lg',
  
  // Borders
  border: 'border border-white/20',
  borderLight: 'border border-white/10',
  borderMedium: 'border border-white/20',
  borderHeavy: 'border border-white/30',
  borderActive: 'border-white/40',
  
  // Shadows
  shadow: 'shadow-xl',
  shadowLight: 'shadow-lg',
  shadowHeavy: 'shadow-2xl',
  
  // Rounded corners
  rounded: 'rounded-xl',
  roundedSmall: 'rounded-lg',
  roundedLarge: 'rounded-2xl',
  roundedFull: 'rounded-full',
  
  // Transitions
  transition: 'transition-all duration-300',
  transitionFast: 'transition-all duration-200',
  transitionSlow: 'transition-all duration-500',
} as const;

export const GLASS_CARD = `${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${GLASSMORPHISM.shadow}`;
export const GLASS_BUTTON = `${GLASSMORPHISM.bgMedium} ${GLASSMORPHISM.blurLight} ${GLASSMORPHISM.roundedSmall} ${GLASSMORPHISM.borderMedium} ${GLASSMORPHISM.shadowLight}`;
export const GLASS_INPUT = `${GLASSMORPHISM.bgMedium} ${GLASSMORPHISM.blurLight} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.borderHeavy}`;

// Spacing constants
export const SPACING = {
  xs: 'p-2',
  sm: 'p-3 sm:p-4',
  md: 'p-4 sm:p-5 md:p-6',
  lg: 'p-6 sm:p-8 md:p-10',
  gapXs: 'gap-2',
  gapSm: 'gap-3 sm:gap-4',
  gapMd: 'gap-4 sm:gap-6',
  gapLg: 'gap-6 sm:gap-8',
} as const;

// Typography constants
export const TYPOGRAPHY = {
  heading1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold',
  heading2: 'text-xl sm:text-2xl md:text-3xl font-bold',
  heading3: 'text-lg sm:text-xl md:text-2xl font-bold',
  body: 'text-sm sm:text-base md:text-lg',
  bodySmall: 'text-xs sm:text-sm md:text-base',
  label: 'text-sm font-medium',
} as const;

// Layout constants
export const LAYOUT = {
  containerMaxWidth: 'max-w-4xl',
  containerMaxWidthSmall: 'max-w-2xl',
  containerPadding: 'p-3 sm:p-4 md:p-6 lg:p-8',
  sectionSpacing: 'mb-4 sm:mb-6 md:mb-8',
} as const;

// Colors
export const COLORS = {
  textPrimary: 'text-white',
  textSecondary: 'text-gray-200',
  textTertiary: 'text-gray-300',
  textError: 'text-red-400',
  bgGradient: 'bg-gradient-to-br from-purple-900 via-slate-900 to-black',
} as const;

