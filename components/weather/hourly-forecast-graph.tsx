'use client';

import { ForecastData } from '@/src/models/weather.model';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { GLASSMORPHISM, SPACING, TYPOGRAPHY, COLORS } from '@/src/utils/theme';

interface HourlyForecastGraphProps {
  forecast: ForecastData;
}

export default function HourlyForecastGraph({ forecast }: HourlyForecastGraphProps) {
  // Get next 24 hours of forecast (8 3-hour intervals)
  const hourlyData = forecast.list.slice(0, 8).map((item) => {
    const date = new Date(item.dt * 1000);
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    const hour = date.getHours();
    const isNight = hour >= 18 || hour < 6;
    
    return {
      time,
      hour: date.getHours(),
      temp: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      icon: item.weather[0]?.icon,
      description: item.weather[0]?.description,
      isNight,
    };
  });

  if (hourlyData.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-1">{data.time}</p>
          <p className="text-white text-sm">Temperature: <span className="font-bold">{data.temp}°</span></p>
          <p className="text-gray-300 text-sm">Feels like: <span className="font-semibold">{data.feelsLike}°</span></p>
          <p className="text-gray-300 text-sm">Humidity: <span className="font-semibold">{data.humidity}%</span></p>
          <p className="text-gray-300 text-xs capitalize mt-1">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${GLASSMORPHISM.shadow} ${SPACING.md}`}>
      <h3 className={`${TYPOGRAPHY.heading3} ${COLORS.textPrimary} mb-4 sm:mb-6`}>24-Hour Forecast (Graph)</h3>
      <div className="w-full h-64 sm:h-80 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="#e5e7eb"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#e5e7eb' }}
            />
            <YAxis 
              stroke="#e5e7eb"
              style={{ fontSize: '12px' }}
              tick={{ fill: '#e5e7eb' }}
              label={{ value: '°C', angle: -90, position: 'insideLeft', fill: '#e5e7eb' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#60a5fa"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTemp)"
              dot={{ fill: '#60a5fa', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className={`mt-4 flex flex-wrap ${SPACING.gapXs} justify-center`}>
        {hourlyData.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col items-center ${GLASSMORPHISM.bgLight} ${GLASSMORPHISM.roundedSmall} p-2 min-w-[60px] ${GLASSMORPHISM.blurLight} ${GLASSMORPHISM.borderLight}`}
          >
            <p className={`text-xs ${COLORS.textTertiary} mb-1`}>{item.time}</p>
            <p className={`text-sm font-semibold ${COLORS.textPrimary}`}>{item.temp}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}

