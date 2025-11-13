/**
 * Weather Map Page - Inspired by Zoom Earth
 * Interactive weather map with multiple layers and satellite imagery
 */

'use client';

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import AppBar from '@/components/AppBar';
import { COLORS, GLASSMORPHISM, TYPOGRAPHY, SPACING } from '@/src/utils/theme';
import { LocationService } from '@/src/services/location.service';
import { MapSearch } from '@/src/components/map/MapSearch';
import { MapEventHandler } from '@/src/components/map/MapEventHandler';
import { WeatherService } from '@/src/services/weather.service';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });

const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
const LayersControl = dynamic(() => import('react-leaflet').then((mod) => mod.LayersControl), { ssr: false });
const ZoomControl = dynamic(() => import('react-leaflet').then((mod) => mod.ZoomControl), { ssr: false });

// Leaflet CSS will be loaded dynamically in useEffect

type BaseMapType = 'standard' | 'satellite' | 'terrain';
type WeatherLayerType = 'temperature' | 'precipitation' | 'wind' | 'clouds' | 'pressure' | null;

export default function WeatherMapPage() {
  const [mounted, setMounted] = useState(false);
  const [baseMap, setBaseMap] = useState<BaseMapType>('satellite');
  const [weatherLayer, setWeatherLayer] = useState<WeatherLayerType>(null);
  const [opacity, setOpacity] = useState(0.7);
  const [lat, setLat] = useState(25.5941); // Default to Patna, India
  const [lon, setLon] = useState(85.1376);
  const [zoom, setZoom] = useState(10);
  const [showControls, setShowControls] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; lat: number; lon: number } | null>(null);
  const [weatherInfo, setWeatherInfo] = useState<any>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Load Leaflet CSS and fix icon issue dynamically
    Promise.all([
      import('leaflet/dist/leaflet.css'),
      import('leaflet').then((L) => {
        delete (L.default.Icon.Default.prototype as any)._getIconUrl;
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
      }),
    ]).then(() => {
      setMounted(true);
    });
    
    // Get coordinates from URL params if available
    const urlLat = searchParams.get('lat');
    const urlLon = searchParams.get('lon');
    if (urlLat && urlLon) {
      setLat(parseFloat(urlLat));
      setLon(parseFloat(urlLon));
    } else {
      // Try to get user's current location
      LocationService.getLocationWithFallback()
        .then((coords) => {
          if (coords) {
            setLat(coords.lat);
            setLon(coords.lon);
          }
        })
        .catch(() => {
          // Use default location
        });
    }
  }, [searchParams]);

  const getBaseMapUrl = (type: BaseMapType) => {
    switch (type) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getWeatherLayerUrl = (layer: WeatherLayerType) => {
    if (!layer) return null;
    // Note: OpenWeatherMap map tiles require a paid subscription
    // For demo purposes, we'll use a placeholder approach
    // In production, you would use: `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${API_KEY}`
    // Alternative: You can use free weather map services like:
    // - Windy.com API
    // - Meteomatics
    // - WeatherAPI.com
    return null; // Weather layers would be added here with proper API key
  };

  const getLayerIcon = (layer: WeatherLayerType) => {
    switch (layer) {
      case 'temperature':
        return '🌡️';
      case 'precipitation':
        return '🌧️';
      case 'wind':
        return '💨';
      case 'clouds':
        return '☁️';
      case 'pressure':
        return '📊';
      default:
        return '';
    }
  };

  const getLayerColor = (layer: WeatherLayerType) => {
    switch (layer) {
      case 'temperature':
        return 'from-red-500 to-blue-500';
      case 'precipitation':
        return 'from-blue-400 to-blue-800';
      case 'wind':
        return 'from-cyan-400 to-cyan-700';
      case 'clouds':
        return 'from-gray-300 to-gray-600';
      case 'pressure':
        return 'from-purple-400 to-purple-700';
      default:
        return '';
    }
  };

  const handleLocationSelect = useCallback(async (lat: number, lon: number, name: string) => {
    setSelectedLocation({ name, lat, lon });
    setLat(lat);
    setLon(lon);
    setZoom(12);

    // Fetch weather for selected location
    setLoadingWeather(true);
    try {
      const data = await WeatherService.getWeatherByCoordinates(lat, lon);
      setWeatherInfo(data.weather);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  const handleMapClick = useCallback(async (lat: number, lon: number) => {
    setSelectedLocation({ name: 'Selected Location', lat, lon });
    setLat(lat);
    setLon(lon);

    // Fetch weather for clicked location
    setLoadingWeather(true);
    try {
      const data = await WeatherService.getWeatherByCoordinates(lat, lon);
      setWeatherInfo(data.weather);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setLoadingWeather(false);
    }
  }, []);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleMoveEnd = useCallback((newLat: number, newLon: number) => {
    setLat(newLat);
    setLon(newLon);
  }, []);

  if (!mounted) {
    return (
      <div className={`min-h-screen ${COLORS.bgGradient} flex items-center justify-center`}>
        <div className={`${COLORS.textPrimary} text-xl`}>Loading map...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${COLORS.bgGradient} relative`}>
      {/* Top Controls Panel */}
      {showControls && (
        <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-col gap-3 sm:gap-4">
          {/* Main Controls */}
          <div className={`${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${GLASSMORPHISM.shadow} ${SPACING.sm}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3">
              <h1 className={`${TYPOGRAPHY.heading2} ${COLORS.textPrimary} flex items-center gap-2`}>
                <span>🌍</span>
                Weather Map
              </h1>
              <AppBar />
            </div>

            {/* Search Bar */}
            <div className="mb-3">
              <MapSearch onLocationSelect={handleLocationSelect} />
            </div>

            {/* Base Map Selection */}
            <div className="mb-3">
              <p className={`text-xs ${COLORS.textTertiary} mb-2`}>Base Map</p>
              <div className="flex flex-wrap gap-2">
                {(['standard', 'satellite', 'terrain'] as BaseMapType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setBaseMap(type)}
                    className={`px-3 py-2 ${GLASSMORPHISM.roundedSmall} text-sm font-medium ${GLASSMORPHISM.transitionFast} capitalize ${
                      baseMap === type
                        ? 'bg-blue-500 text-white shadow-lg'
                        : `${GLASSMORPHISM.bgLight} ${COLORS.textTertiary} ${GLASSMORPHISM.bgHover}`
                    }`}
                  >
                    {type === 'standard' && '🗺️'} {type === 'satellite' && '🛰️'} {type === 'terrain' && '⛰️'} {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Layers */}
            <div>
              <p className={`text-xs ${COLORS.textTertiary} mb-2`}>Weather Layers</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setWeatherLayer(null)}
                  className={`px-3 py-2 ${GLASSMORPHISM.roundedSmall} text-sm font-medium ${GLASSMORPHISM.transitionFast} ${
                    weatherLayer === null
                      ? 'bg-gray-600 text-white shadow-lg'
                      : `${GLASSMORPHISM.bgLight} ${COLORS.textTertiary} ${GLASSMORPHISM.bgHover}`
                  }`}
                >
                  None
                </button>
                {(['temperature', 'precipitation', 'wind', 'clouds', 'pressure'] as WeatherLayerType[]).map((layer) => (
                  <button
                    key={layer}
                    onClick={() => setWeatherLayer(layer)}
                    className={`px-3 py-2 ${GLASSMORPHISM.roundedSmall} text-sm font-medium ${GLASSMORPHISM.transitionFast} capitalize ${
                      weatherLayer === layer
                        ? `bg-gradient-to-r ${getLayerColor(layer)} text-white shadow-lg`
                        : `${GLASSMORPHISM.bgLight} ${COLORS.textTertiary} ${GLASSMORPHISM.bgHover}`
                    }`}
                  >
                    {getLayerIcon(layer)} {layer}
                  </button>
                ))}
              </div>
            </div>

            {/* Opacity Control */}
            {weatherLayer && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <label className={`text-xs ${COLORS.textTertiary} whitespace-nowrap`}>
                    Opacity: {Math.round(opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Legend Panel */}
          {weatherLayer && showLegend && (
            <div className={`${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${GLASSMORPHISM.shadow} ${SPACING.sm}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-sm font-semibold ${COLORS.textPrimary}`}>Legend</h3>
                <button
                  onClick={() => setShowLegend(false)}
                  className={`text-xs ${COLORS.textTertiary} ${GLASSMORPHISM.bgHover} px-2 py-1 ${GLASSMORPHISM.roundedSmall}`}
                >
                  ✕
                </button>
              </div>
              <div className={`text-xs ${COLORS.textTertiary} space-y-1`}>
                {weatherLayer === 'temperature' && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded"></div>
                    <span>Cold → Hot</span>
                  </div>
                )}
                {weatherLayer === 'precipitation' && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-blue-200 via-blue-500 to-blue-800 rounded"></div>
                    <span>Light → Heavy Rain</span>
                  </div>
                )}
                {weatherLayer === 'wind' && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-cyan-300 via-cyan-500 to-cyan-700 rounded"></div>
                    <span>Calm → Strong Wind</span>
                  </div>
                )}
                {weatherLayer === 'clouds' && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-700 rounded"></div>
                    <span>Clear → Cloudy</span>
                  </div>
                )}
                {weatherLayer === 'pressure' && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-300 via-purple-500 to-purple-700 rounded"></div>
                    <span>Low → High Pressure</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Toggle Controls Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className={`absolute top-4 right-4 z-[1001] ${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${GLASSMORPHISM.shadow} p-2 ${COLORS.textPrimary} ${GLASSMORPHISM.transitionFast} ${GLASSMORPHISM.bgHover}`}
        aria-label="Toggle controls"
      >
        {showControls ? '👁️' : '⚙️'}
      </button>

      {/* Legend Toggle */}
      {weatherLayer && (
        <button
          onClick={() => setShowLegend(!showLegend)}
          className={`absolute bottom-20 right-4 z-[1001] ${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${GLASSMORPHISM.shadow} p-2 ${COLORS.textPrimary} ${GLASSMORPHISM.transitionFast} ${GLASSMORPHISM.bgHover}`}
          aria-label="Toggle legend"
        >
          📊
        </button>
      )}

      {/* Weather Info Panel */}
      {weatherInfo && (
        <div className={`absolute bottom-4 left-4 z-[1000] ${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${GLASSMORPHISM.shadow} ${SPACING.sm} max-w-xs`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-semibold ${COLORS.textPrimary}`}>
              {selectedLocation?.name || 'Weather Info'}
            </h3>
            <button
              onClick={() => {
                setWeatherInfo(null);
                setSelectedLocation(null);
              }}
              className={`text-xs ${COLORS.textTertiary} ${GLASSMORPHISM.bgHover} px-2 py-1 ${GLASSMORPHISM.roundedSmall}`}
            >
              ✕
            </button>
          </div>
          {loadingWeather ? (
            <div className={`text-xs ${COLORS.textTertiary}`}>Loading...</div>
          ) : (
            <>
              <div className={`text-2xl font-bold ${COLORS.textPrimary} mb-1`}>
                {Math.round(weatherInfo.main.temp)}°C
              </div>
              <div className={`text-xs ${COLORS.textTertiary} capitalize mb-2`}>
                {weatherInfo.weather[0]?.description}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className={COLORS.textTertiary}>Feels like:</span>
                  <span className={`${COLORS.textPrimary} ml-1`}>{Math.round(weatherInfo.main.feels_like)}°C</span>
                </div>
                <div>
                  <span className={COLORS.textTertiary}>Humidity:</span>
                  <span className={`${COLORS.textPrimary} ml-1`}>{weatherInfo.main.humidity}%</span>
                </div>
                {weatherInfo.wind && (
                  <div>
                    <span className={COLORS.textTertiary}>Wind:</span>
                    <span className={`${COLORS.textPrimary} ml-1`}>{Math.round(weatherInfo.wind.speed)} m/s</span>
                  </div>
                )}
                {weatherInfo.main.pressure && (
                  <div>
                    <span className={COLORS.textTertiary}>Pressure:</span>
                    <span className={`${COLORS.textPrimary} ml-1`}>{weatherInfo.main.pressure} hPa</span>
                  </div>
                )}
              </div>
              <div className={`text-xs ${COLORS.textTertiary} mt-2 pt-2 border-t border-white/10`}>
                {lat.toFixed(4)}, {lon.toFixed(4)}
              </div>
            </>
          )}
        </div>
      )}

      {/* Location Info Panel (when no weather info) */}
      {!weatherInfo && (
        <div className={`absolute bottom-4 left-4 z-[1000] ${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${GLASSMORPHISM.shadow} ${SPACING.sm} max-w-xs`}>
          <div className={`text-xs ${COLORS.textTertiary} mb-1`}>Location</div>
          <div className={`text-sm ${COLORS.textPrimary} font-medium`}>
            {lat.toFixed(4)}, {lon.toFixed(4)}
          </div>
          <div className={`text-xs ${COLORS.textTertiary} mt-1`}>Zoom: {zoom}</div>
          <div className={`text-xs ${COLORS.textTertiary} mt-2 pt-2 border-t border-white/10`}>
            Click on map to view weather
          </div>
        </div>
      )}
      
      {/* Map Container */}
      <div className="h-screen w-full">
        <MapContainer
          center={[lat, lon]}
          zoom={zoom}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          className="z-0"
          zoomControl={false}
        >
          <MapEventHandler
            onMapClick={handleMapClick}
            onZoomChange={handleZoomChange}
            onMoveEnd={handleMoveEnd}
          />
          <TileLayer
            attribution={
              baseMap === 'satellite'
                ? '&copy; <a href="https://www.esri.com/">Esri</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                : baseMap === 'terrain'
                ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
            url={getBaseMapUrl(baseMap)}
          />
          
          {/* Weather Overlay Layer */}
          {weatherLayer && getWeatherLayerUrl(weatherLayer) && (
            <TileLayer
              url={getWeatherLayerUrl(weatherLayer)!}
              opacity={opacity}
              attribution='&copy; <a href="https://openweathermap.org">OpenWeatherMap</a>'
            />
          )}
          
          {/* Note: Weather overlay layers require API subscription */}
          {weatherLayer && !getWeatherLayerUrl(weatherLayer) && (
            <div className="leaflet-control leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px' }}>
              <div className={`${GLASSMORPHISM.bg} ${GLASSMORPHISM.blur} ${GLASSMORPHISM.rounded} ${GLASSMORPHISM.border} ${SPACING.xs} text-xs ${COLORS.textPrimary}`}>
                <p>Weather layer selected: {weatherLayer}</p>
                <p className={COLORS.textTertiary}>Click map to view weather data</p>
              </div>
            </div>
          )}

          {/* Marker */}
          <Marker position={[lat, lon]}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-gray-800">📍 {selectedLocation?.name || 'Current Location'}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {lat.toFixed(4)}, {lon.toFixed(4)}
                </p>
                {weatherLayer && (
                  <p className="text-xs text-gray-500 mt-1">
                    {getLayerIcon(weatherLayer)} {weatherLayer} layer active
                  </p>
                )}
                {weatherInfo && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-lg font-bold text-gray-800">{Math.round(weatherInfo.main.temp)}°C</p>
                    <p className="text-xs text-gray-600 capitalize">{weatherInfo.weather[0]?.description}</p>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>

          {/* Zoom Controls */}
          <ZoomControl position="bottomright" />
        </MapContainer>
      </div>
    </div>
  );
}
