'use client';

import { WeatherData, ForecastData, AQIData } from '@/src/models/weather.model';
import HourlyForecast from '@/components/weather/hourly-forecast';
import HourlyForecastGraph from '@/components/weather/hourly-forecast-graph';
import DailyForecast from '@/components/weather/daily-forecast';
import AQIDisplay from '@/components/weather/aqi-display';
import { getWeatherIconUrl, getWeatherAnimation } from '@/lib/weather-icons';
import { GLASSMORPHISM, SPACING, TYPOGRAPHY, COLORS } from '@/src/utils/theme';

interface WeatherDisplayProps {
  weather: WeatherData;
  forecast: ForecastData | null;
  aqi: AQIData | null;
}

export default function WeatherDisplay({ weather, forecast, aqi }: WeatherDisplayProps) {
  const weatherIcon = weather.weather[0]?.icon;
  const temperature = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const description = weather.weather[0]?.description || 'N/A';
  const humidity = weather.main.humidity;
  const iconUrl = getWeatherIconUrl(weatherIcon, '4x');
  const animationClass = getWeatherAnimation(weatherIcon);

  return (
    <div className={`space-y-4 sm:space-y-6`}>
      {/* Main Weather Card */}
      <div className={`${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${GLASSMORPHISM.shadow} ${SPACING.md}`}>
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 sm:gap-6">
          <div className="flex-1 text-center md:text-left w-full md:w-auto">
            <h2 className={`${TYPOGRAPHY.heading1} ${COLORS.textPrimary} mb-1 sm:mb-2`}>{weather.name}</h2>
            <p className={`text-lg sm:text-xl md:text-2xl ${COLORS.textTertiary} capitalize mb-3 sm:mb-4`}>{description}</p>
            <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4">
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white">{temperature}°</div>
              {weatherIcon && (
                <img
                  src={iconUrl}
                  alt={description}
                  className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 ${GLASSMORPHISM.transition} hover:scale-110 ${animationClass}`}
                  loading="eager"
                />
              )}
            </div>
          </div>
          <div className={`w-full md:w-auto ${GLASSMORPHISM.bgLight} ${GLASSMORPHISM.roundedSmall} ${SPACING.md} ${GLASSMORPHISM.blurLight} ${GLASSMORPHISM.borderLight}`}>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 sm:gap-5 text-sm sm:text-base">
              <div>
                <p className={`${COLORS.textTertiary} mb-1 text-xs sm:text-sm`}>Feels like</p>
                <p className={`${COLORS.textPrimary} font-semibold text-lg sm:text-xl md:text-2xl`}>{feelsLike}°</p>
              </div>
              <div>
                <p className={`${COLORS.textTertiary} mb-1 text-xs sm:text-sm`}>Humidity</p>
                <p className={`${COLORS.textPrimary} font-semibold text-lg sm:text-xl md:text-2xl`}>{humidity}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AQI Section */}
      {aqi && <AQIDisplay aqi={aqi} />}

      {/* Forecast Sections */}
      {forecast && (
        <>
          <HourlyForecastGraph forecast={forecast} />
          <HourlyForecast forecast={forecast} />
          <DailyForecast forecast={forecast} />
        </>
      )}
    </div>
  );
}
