# Styling Guide

## Color Schemes

### Weather-based Gradients
```css
/* Clear Sky */
from-sky-400 via-blue-500 to-blue-600

/* Cloudy */
from-gray-400 via-gray-500 to-gray-600

/* Rain */
from-blue-700 via-blue-800 to-gray-800

/* Snow */
from-blue-100 via-blue-200 to-gray-200

/* Thunderstorm */
from-gray-700 via-purple-900 to-gray-900

/* Default */
from-indigo-500 via-purple-500 to-pink-500
```

## Glassmorphism Effects
Used in search bar and weather cards:
```css
/* Base glass effect */
bg-white/10 backdrop-blur-md

/* Glass border */
border-2 border-white/20

/* Glass hover state */
hover:bg-white/30
```

## Animations
```css
/* Fade in animation */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Pulse animation for loading states */
animate-pulse

/* Smooth transitions */
transition-all duration-200
```

## Responsive Design
```css
/* Mobile First Approach */
.container {
  /* Base styles (mobile) */
  width: 100%;
  padding: 1rem;
  
  /* Tablet and up */
  @screen md {
    max-width: 768px;
    padding: 2rem;
  }
  
  /* Desktop */
  @screen lg {
    max-width: 1024px;
  }
}
```

## Layout Components

### Cards
```css
/* Weather Card */
rounded-2xl shadow-2xl max-w-4xl

/* Forecast Card */
bg-white/10 rounded-lg backdrop-blur-sm
```

### Typography
```css
/* Headings */
text-4xl font-bold text-white

/* Body Text */
text-lg text-white/80

/* Secondary Text */
text-sm text-white/60
```

## Interactive Elements

### Buttons
```css
/* Primary Button */
bg-white/20 hover:bg-white/30 
text-white rounded-full
transition-all duration-200

/* Disabled State */
disabled:opacity-50 
disabled:cursor-not-allowed
```

### Inputs
```css
/* Search Input */
bg-white/10 backdrop-blur-md
text-white placeholder-white/60
rounded-full outline-none
border-2 border-white/20
focus:border-white/40
```

## Best Practices

1. Use Tailwind's built-in responsive classes (sm:, md:, lg:)
2. Maintain consistent spacing with Tailwind's spacing scale
3. Use semantic color names in gradients
4. Keep animations subtle and smooth
5. Ensure sufficient contrast for accessibility
6. Use consistent border radius across similar elements
7. Maintain consistent padding and margin scales