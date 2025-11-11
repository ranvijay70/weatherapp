'use client';

import { useEffect, useRef } from 'react';
import { ForecastData } from '../services/weatherService';

interface HourlyForecastProps {
  forecastData: ForecastData | null;
  units: 'metric' | 'imperial';
}

interface HourData {
  time: Date;
  temp: number;
  feelsLike: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
}

export default function HourlyForecast({ forecastData, units }: HourlyForecastProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!forecastData?.list || !canvasRef.current) return;

    // Get next 24 hours of data
    const hourlyData: HourData[] = forecastData.list
      .slice(0, 8)
      .map(item => ({
        time: new Date(item.dt * 1000),
        temp: item.main.temp,
        feelsLike: item.main.feels_like,
        weather: item.weather[0]
      }));

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Reset transform and clear
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set dimensions
    const padding = 40;
    const width = rect.width - padding * 2;
    const height = rect.height - padding * 2;

    // Find temperature range
    const temps = hourlyData.map(h => h.temp);
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);
    const tempRange = maxTemp - minTemp;

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Vertical grid lines (time)
    for (let i = 0; i <= hourlyData.length - 1; i++) {
      const x = padding + (i * width) / (hourlyData.length - 1);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height + padding);
      ctx.stroke();
    }

    // Horizontal grid lines (temperature)
    const tempStep = Math.ceil(tempRange / 4);
    for (let temp = Math.floor(minTemp); temp <= Math.ceil(maxTemp); temp += tempStep) {
      const y = padding + height - ((temp - minTemp) * height) / tempRange;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width + padding, y);
      ctx.stroke();

      // Temperature labels
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.round(temp)}°`, padding - 10, y + 4);
    }

    // Draw temperature line
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    hourlyData.forEach((hour, i) => {
      const x = padding + (i * width) / (hourlyData.length - 1);
      const y = padding + height - ((hour.temp - minTemp) * height) / tempRange;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw time labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';
    hourlyData.forEach((hour, i) => {
      const x = padding + (i * width) / (hourlyData.length - 1);
      const time = hour.time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        hour12: true
      });
      ctx.fillText(time, x, height + padding + 20);
    });

    // Draw dots and icons
    hourlyData.forEach((hour, i) => {
      const x = padding + (i * width) / (hourlyData.length - 1);
      const y = padding + height - ((hour.temp - minTemp) * height) / tempRange;

      // Draw dot
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [forecastData, units]);

  if (!forecastData?.list) return null;

  const hourlyData = forecastData.list.slice(0, 8);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-white">24-Hour Forecast</h3>
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
        <canvas
          ref={canvasRef}
          className="w-full h-64"
          style={{ width: '100%', height: '256px' }}
        />
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mt-6">
          {hourlyData.map((hour) => (
            <div
              key={hour.dt}
              className="text-center"
            >
              <img
                src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}.png`}
                alt={hour.weather[0].description}
                className="w-8 h-8 mx-auto"
              />
              <p className="text-xs text-white/60 capitalize">
                {hour.weather[0].description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
