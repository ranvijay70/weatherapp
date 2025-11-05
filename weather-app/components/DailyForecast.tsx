'use client';

import { ForecastData } from '@/services/weatherService';

interface DailyForecastProps {
  forecastData: ForecastData | null;
  units: 'metric' | 'imperial';
}

export default function DailyForecast({ forecastData, units }: DailyForecastProps) {
  if (!forecastData?.list) return null;

  // Group forecast data by day
  const dailyData = forecastData.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = item;
    }
    return acc;
  }, {} as Record<string, typeof forecastData.list[0]>);

  // Get next 3 days
  const threeDayForecast = Object.values(dailyData).slice(1, 4);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-white">3-Day Forecast</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {threeDayForecast.map((day) => (
          <div
            key={day.dt}
            className="bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <p className="text-white font-medium">
              {new Date(day.dt * 1000).toLocaleDateString([], {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <div className="flex items-center justify-between mt-2">
              <img
                src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
                className="w-16 h-16"
              />
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {Math.round(day.main.temp)}°{units === 'metric' ? 'C' : 'F'}
                </p>
                <p className="text-sm text-white/80 capitalize">
                  {day.weather[0].description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}