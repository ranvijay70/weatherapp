/**
 * Weather icon utility functions
 * Maps OpenWeatherMap icon codes to proper icon URLs and provides helper functions
 */

export const getWeatherIconUrl = (iconCode: string | undefined, size: '1x' | '2x' | '4x' = '2x'): string => {
  if (!iconCode) {
    return getWeatherIconUrl('01d', size); // Default to clear sky day
  }
  
  const sizeSuffix = size === '1x' ? '' : `@${size}`;
  return `https://openweathermap.org/img/wn/${iconCode}${sizeSuffix}.png`;
};

/**
 * Get weather condition category from icon code
 */
export const getWeatherCondition = (iconCode: string | undefined): {
  category: 'clear' | 'clouds' | 'rain' | 'drizzle' | 'thunderstorm' | 'snow' | 'mist' | 'unknown';
  isDay: boolean;
} => {
  if (!iconCode) {
    return { category: 'unknown', isDay: true };
  }

  const code = iconCode.substring(0, 2);
  const isDay = iconCode.endsWith('d');

  switch (code) {
    case '01':
      return { category: 'clear', isDay };
    case '02':
    case '03':
    case '04':
      return { category: 'clouds', isDay };
    case '09':
    case '10':
      return { category: 'rain', isDay };
    case '11':
      return { category: 'thunderstorm', isDay };
    case '13':
      return { category: 'snow', isDay };
    case '50':
      return { category: 'mist', isDay };
    default:
      return { category: 'unknown', isDay };
  }
};

/**
 * Get animation class based on weather condition
 * Returns subtle animations that match the weather type
 */
export const getWeatherAnimation = (iconCode: string | undefined): string => {
  const { category } = getWeatherCondition(iconCode);
  
  switch (category) {
    case 'rain':
    case 'drizzle':
      return 'animate-pulse'; // Gentle pulse for rain
    case 'thunderstorm':
      return 'animate-pulse'; // Pulse for thunderstorms
    case 'snow':
      return ''; // No animation for snow (too distracting)
    case 'clear':
      return ''; // No animation for clear sky
    default:
      return '';
  }
};

/**
 * Get gradient background based on weather condition
 */
export const getWeatherGradient = (iconCode: string | undefined): string => {
  const { category, isDay } = getWeatherCondition(iconCode);
  
  if (!isDay) {
    // Night gradients
    switch (category) {
      case 'clear':
        return 'from-indigo-900 via-purple-900 to-slate-900';
      case 'clouds':
        return 'from-slate-800 via-slate-900 to-black';
      case 'rain':
      case 'drizzle':
        return 'from-slate-900 via-slate-800 to-black';
      case 'thunderstorm':
        return 'from-gray-900 via-slate-900 to-black';
      case 'snow':
        return 'from-slate-800 via-slate-700 to-slate-900';
      default:
        return 'from-purple-900 via-slate-900 to-black';
    }
  } else {
    // Day gradients
    switch (category) {
      case 'clear':
        return 'from-blue-400 via-blue-500 to-blue-600';
      case 'clouds':
        return 'from-gray-400 via-gray-500 to-gray-600';
      case 'rain':
      case 'drizzle':
        return 'from-gray-500 via-gray-600 to-gray-700';
      case 'thunderstorm':
        return 'from-gray-600 via-gray-700 to-gray-800';
      case 'snow':
        return 'from-blue-200 via-blue-300 to-blue-400';
      default:
        return 'from-purple-900 via-slate-900 to-black';
    }
  }
};

