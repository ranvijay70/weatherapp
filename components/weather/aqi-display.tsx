'use client';

import { AQIData } from '@/services/weatherService';

interface AQIDisplayProps {
  aqi: AQIData | null;
}

const AQI_LEVELS = {
  1: { label: 'Good', color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-400/50' },
  2: { label: 'Fair', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-400/50' },
  3: { label: 'Moderate', color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-400/50' },
  4: { label: 'Poor', color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-400/50' },
  5: { label: 'Very Poor', color: 'text-red-600', bgColor: 'bg-red-600/20', borderColor: 'border-red-600/50' },
};

export default function AQIDisplay({ aqi }: AQIDisplayProps) {
  if (!aqi || !aqi.list || aqi.list.length === 0) {
    return null;
  }

  const currentAQI = aqi.list[0];
  const aqiValue = currentAQI.main.aqi;
  const aqiInfo = AQI_LEVELS[aqiValue as keyof typeof AQI_LEVELS] || AQI_LEVELS[1];
  const components = currentAQI.components;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20 shadow-xl">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4 md:mb-6">Air Quality Index</h3>
      
      {/* Main AQI Display */}
      <div className={`${aqiInfo.bgColor} ${aqiInfo.borderColor} border-2 rounded-lg sm:rounded-xl p-4 sm:p-5 mb-4 sm:mb-6`}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm sm:text-base text-gray-300">Current AQI</p>
          <span className={`text-2xl sm:text-3xl md:text-4xl font-bold ${aqiInfo.color}`}>
            {aqiValue}
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

