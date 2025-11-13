'use client';

import { ForecastData } from '@/src/models/weather.model';
import { getWeatherIconUrl } from '@/lib/weather-icons';
import { GLASSMORPHISM, SPACING, TYPOGRAPHY, COLORS } from '@/src/utils/theme';

interface HourlyForecastProps {
  forecast: ForecastData;
}

export default function HourlyForecast({ forecast }: HourlyForecastProps) {
  // Get next 24 hours of forecast (8 3-hour intervals)
  const hourlyData = forecast.list.slice(0, 8);

  const formatTime = (dt: number) => {
    const date = new Date(dt * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  };

  if (hourlyData.length === 0) {
    return null;
  }

  return (
    <div className={`${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${GLASSMORPHISM.shadow} ${SPACING.md}`}>
      <h3 className={`${TYPOGRAPHY.heading3} ${COLORS.textPrimary} mb-3 sm:mb-4 md:mb-6`}>24-Hour Forecast</h3>
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className={`flex ${SPACING.gapSm} min-w-max pb-2 sm:pb-3`}>
          {hourlyData.map((item, index) => {
            const icon = item.weather[0]?.icon;
            const temp = Math.round(item.main.temp);
            const time = formatTime(item.dt);
            const iconUrl = getWeatherIconUrl(icon, '2x');

            return (
              <div
                key={index}
                className={`flex flex-col items-center ${GLASSMORPHISM.bgLight} ${GLASSMORPHISM.roundedSmall} p-2.5 sm:p-3 md:p-4 min-w-[70px] sm:min-w-[90px] md:min-w-[100px] ${GLASSMORPHISM.blurLight} ${GLASSMORPHISM.borderLight} flex-shrink-0 ${GLASSMORPHISM.transitionFast} hover:scale-105`}
              >
                <p className={`text-xs sm:text-sm ${COLORS.textTertiary} mb-1.5 sm:mb-2 whitespace-nowrap`}>{time}</p>
                {icon && (
                  <img
                    src={iconUrl}
                    alt={item.weather[0]?.description || 'Weather'}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-1.5 sm:mb-2 transition-transform duration-300"
                    loading="lazy"
                  />
                )}
                <p className={`text-sm sm:text-base md:text-lg font-semibold ${COLORS.textPrimary}`}>{temp}°</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

