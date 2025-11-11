'use client';

import { ForecastData } from '@/services/weatherService';
import { getWeatherIconUrl } from '@/lib/weather-icons';

interface DailyForecastProps {
  forecast: ForecastData;
}

export default function DailyForecast({ forecast }: DailyForecastProps) {
  // Group forecast by day
  const dailyData: { [key: string]: typeof forecast.list } = {};

  forecast.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toDateString();

    if (!dailyData[dayKey]) {
      dailyData[dayKey] = [];
    }
    dailyData[dayKey].push(item);
  });

  // Get the first item of each day for daily forecast
  const dailyForecast = Object.entries(dailyData)
    .slice(0, 5)
    .map(([dayKey, items]) => {
      const firstItem = items[0];
      const maxTemp = Math.max(...items.map((item) => item.main.temp));
      const minTemp = Math.min(...items.map((item) => item.main.temp));

      return {
        date: new Date(firstItem.dt * 1000),
        icon: firstItem.weather[0]?.icon,
        description: firstItem.weather[0]?.description,
        maxTemp: Math.round(maxTemp),
        minTemp: Math.round(minTemp),
      };
    });

  if (dailyForecast.length === 0) {
    return null;
  }

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20 shadow-xl">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 md:mb-6">5-Day Forecast</h3>
      <div className="space-y-2 sm:space-y-3">
        {dailyForecast.map((day, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 active:bg-white/15 transition-all"
          >
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
              <p className="text-xs sm:text-sm md:text-base text-white font-medium w-20 sm:w-24 md:w-32 flex-shrink-0">
                {formatDate(day.date)}
              </p>
              {day.icon && (
                <img
                  src={getWeatherIconUrl(day.icon, '2x')}
                  alt={day.description || 'Weather'}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0 transition-transform duration-300 hover:scale-110"
                  loading="lazy"
                />
              )}
              <p className="text-xs sm:text-sm text-gray-300 capitalize hidden md:block flex-1 truncate">
                {day.description}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
              <p className="text-sm sm:text-base md:text-lg font-semibold text-white">{day.maxTemp}°</p>
              <p className="text-xs sm:text-sm md:text-base text-gray-400">{day.minTemp}°</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

