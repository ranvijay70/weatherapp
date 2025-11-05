'use client';

import { useState } from 'react';
import { ForecastData } from '@/services/weatherService';

interface HourlyForecastProps {
  forecastData: ForecastData | null;
  units: 'metric' | 'imperial';
}

export default function HourlyForecast({ forecastData, units }: HourlyForecastProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  if (!forecastData?.list) return null;

  // Get next 24 hours of forecast (8 items, as data is in 3-hour intervals)
  const hourlyData = forecastData.list.slice(0, 8);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev < hourlyData.length - 4 ? prev + 1 : prev
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-white">Hourly Forecast</h3>
      <div className="relative">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 p-2 rounded-full 
                   disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
        >
          ←
        </button>
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 25}%)` }}
          >
            {hourlyData.map((hour, index) => (
              <div
                key={hour.dt}
                className="flex-none w-1/4 px-2"
              >
                <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm">
                  <p className="text-sm text-white">
                    {new Date(hour.dt * 1000).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                  <img
                    src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                    alt={hour.weather[0].description}
                    className="mx-auto w-12 h-12"
                  />
                  <p className="text-lg font-semibold text-white">
                    {Math.round(hour.main.temp)}°{units === 'metric' ? 'C' : 'F'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleNext}
          disabled={currentIndex >= hourlyData.length - 4}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/20 p-2 rounded-full 
                   disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 transition-colors"
        >
          →
        </button>
      </div>
    </div>
  );
}