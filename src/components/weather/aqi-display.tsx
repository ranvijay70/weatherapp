'use client';

import { AQIData } from '@/src/models/weather.model';
import { GLASSMORPHISM, SPACING, TYPOGRAPHY, COLORS } from '@/src/utils/theme';

interface AQIDisplayProps {
  aqi: AQIData | null;
}

// EPA US AQI breakpoints for PM2.5 and PM10 (µg/m³)
type Breakpoint = { cLow: number; cHigh: number; iLow: number; iHigh: number };

const PM25_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
  { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
  { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
  { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
  { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
];

const PM10_BREAKPOINTS: Breakpoint[] = [
  { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
  { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100 },
  { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150 },
  { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200 },
  { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300 },
  { cLow: 425, cHigh: 504, iLow: 301, iHigh: 400 },
  { cLow: 505, cHigh: 604, iLow: 401, iHigh: 500 },
];

function calculateAqi(concentration: number, breakpoints: Breakpoint[]): number | null {
  const bp = breakpoints.find(b => concentration >= b.cLow && concentration <= b.cHigh);
  if (!bp) return null;
  const { cLow, cHigh, iLow, iHigh } = bp;
  const aqi = ((iHigh - iLow) / (cHigh - cLow)) * (concentration - cLow) + iLow;
  return Math.round(aqi);
}

function getAqiStyling(aqi: number): { label: string; color: string; bgColor: string; borderColor: string } {
  if (aqi <= 50) return { label: 'Good', color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-400/50' };
  if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-400/50' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-400/50' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-400/50' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-400', bgColor: 'bg-purple-500/20', borderColor: 'border-purple-400/50' };
  return { label: 'Hazardous', color: 'text-rose-500', bgColor: 'bg-rose-600/20', borderColor: 'border-rose-500/50' };
}

export default function AQIDisplay({ aqi }: AQIDisplayProps) {
  if (!aqi || !aqi.list || aqi.list.length === 0) {
    return null;
  }

  const currentAQI = aqi.list[0];
  const components = currentAQI.components;

  // Compute US AQI using PM2.5 and PM10 (max of both)
  const pm25Aqi = calculateAqi(components.pm2_5, PM25_BREAKPOINTS);
  const pm10Aqi = calculateAqi(components.pm10, PM10_BREAKPOINTS);
  const numericAqi = Math.max(pm25Aqi ?? 0, pm10Aqi ?? 0);
  const aqiInfo = getAqiStyling(numericAqi);

  return (
    <div className={`${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${GLASSMORPHISM.shadow} ${SPACING.md}`}>
      <h3 className={`${TYPOGRAPHY.heading3} ${COLORS.textPrimary} mb-3 sm:mb-4 md:mb-6`}>Air Quality Index</h3>
      
      {/* Main AQI Display (US AQI 0–500) */}
      <div className={`${aqiInfo.bgColor} ${aqiInfo.borderColor} border-2 rounded-lg sm:rounded-xl p-4 sm:p-5 mb-4 sm:mb-6`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm sm:text-base text-gray-300">Current AQI</p>
          <span className={`text-2xl sm:text-3xl md:text-4xl font-bold ${aqiInfo.color}`}>
            {numericAqi}
          </span>
        </div>
        <p className={`text-base sm:text-lg md:text-xl font-semibold ${aqiInfo.color}`}>
          {aqiInfo.label}
        </p>
      </div>

      {/* Pollutant Details */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
          <p className="text-xs sm:text-sm text-gray-400 mb-1">PM2.5</p>
          <p className="text-sm sm:text-base font-semibold text-white">
            {components.pm2_5.toFixed(1)} μg/m³
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
          <p className="text-xs sm:text-sm text-gray-400 mb-1">PM10</p>
          <p className="text-sm sm:text-base font-semibold text-white">
            {components.pm10.toFixed(1)} μg/m³
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
          <p className="text-xs sm:text-sm text-gray-400 mb-1">O₃</p>
          <p className="text-sm sm:text-base font-semibold text-white">
            {components.o3.toFixed(1)} μg/m³
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
          <p className="text-xs sm:text-sm text-gray-400 mb-1">NO₂</p>
          <p className="text-sm sm:text-base font-semibold text-white">
            {components.no2.toFixed(1)} μg/m³
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
          <p className="text-xs sm:text-sm text-gray-400 mb-1">SO₂</p>
          <p className="text-sm sm:text-base font-semibold text-white">
            {components.so2.toFixed(1)} μg/m³
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10">
          <p className="text-xs sm:text-sm text-gray-400 mb-1">CO</p>
          <p className="text-sm sm:text-base font-semibold text-white">
            {components.co.toFixed(1)} μg/m³
          </p>
        </div>
      </div>
    </div>
  );
}

