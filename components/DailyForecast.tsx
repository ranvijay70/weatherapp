'use client';

import { ForecastData } from '../services/weatherService';

interface DailyForecastProps {
  forecastData: ForecastData | null;
  units: 'metric' | 'imperial';
}

// Helper function to determine weather severity for consistent icons
function getSeverityScore(weatherMain: string): number {
  const severity: { [key: string]: number } = {
    'Thunderstorm': 5,
    'Tornado': 5,
    'Snow': 4,
    'Rain': 3,
    'Drizzle': 2,
    'Clouds': 1,
    'Clear': 0
  };
  return severity[weatherMain] || 0;
}

export default function DailyForecast({ forecastData, units }: DailyForecastProps) {
  if (!forecastData?.list) return null;

  // Group forecast data by day and find min/max temperatures
  const dailyData = forecastData.list.reduce((acc: Record<string, any>, item: any) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toLocaleDateString();
    
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date,
        temps: [],
        min: item.main.temp,
        max: item.main.temp,
        weather: item.weather[0]
      };
    }

    acc[dateKey].temps.push(item.main.temp);
    if (item.main.temp < acc[dateKey].min) acc[dateKey].min = item.main.temp;
    if (item.main.temp > acc[dateKey].max) acc[dateKey].max = item.main.temp;

    // Keep the most severe weather condition for the day
    const severity = getSeverityScore(item.weather[0].main);
    if (severity > getSeverityScore(acc[dateKey].weather.main)) {
      acc[dateKey].weather = item.weather[0];
    }

    return acc;
  }, {} as Record<string, {
    date: Date;
    temps: number[];
    min: number;
    max: number;
    weather: { main: string; description: string; icon: string };
  }>);

  type DayForecast = {
    date: Date;
    temps: number[];
    min: number;
    max: number;
    weather: { main: string; description: string; icon: string };
  };

  // Get next 7 days
  const sevenDayForecast = Object.values(dailyData)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 7);

  // Find overall min and max for temperature bar scaling
  const overallMin = Math.min(...sevenDayForecast.map(day => day.min));
  const overallMax = Math.max(...sevenDayForecast.map(day => day.max));
  const tempRange = overallMax - overallMin;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-white">7-Day Forecast</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {sevenDayForecast.map((day) => (
          <div
            key={day.date.toISOString()}
            className="bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <div className="text-center">
              <p className="text-white font-medium">
                {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p className="text-sm text-white/60">
                {day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="flex flex-col items-center mt-2">
              <img
                src={`http://openweathermap.org/img/wn/${day.weather.icon}@2x.png`}
                alt={day.weather.description}
                className="w-16 h-16"
              />
              <div className="text-center w-full">
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-white/80">{Math.round(day.min)}°</span>
                  <div className="h-1 w-16 mx-2 bg-white/20 rounded-full">
                    <div
                      className="h-full bg-white/40 rounded-full"
                      style={{
                        width: `${((day.max - overallMin) / tempRange) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-white/80">{Math.round(day.max)}°</span>
                </div>
                <p className="text-sm text-white/80 capitalize mt-1">
                  {day.weather.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
