

import axios from 'axios';
import { NextResponse } from 'next/server';
import { LocationInput, getWeatherData, getForecastData } from '@/services/weatherService';

// Force Node.js runtime to ensure env vars are available
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const city = url.searchParams.get('city');
  const lat = url.searchParams.get('lat');
  const lon = url.searchParams.get('lon');
  const units = url.searchParams.get('units') || 'metric';

  // Check for valid parameters
  if (!city && (!lat || !lon)) {
    return NextResponse.json({ error: 'Either city or coordinates (lat/lon) are required' }, { status: 400 });
  }

  // Validate coordinate values if provided
  if (lat !== null && lon !== null) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    if (isNaN(latitude) || isNaN(longitude) || 
        latitude < -90 || latitude > 90 || 
        longitude < -180 || longitude > 180) {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }
  }

  // Read env vars at request time
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const BASE_URL = process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL;

  if (!API_KEY || !BASE_URL) {
    console.error('Missing API_KEY or BASE_URL');
    return NextResponse.json({ error: 'Server misconfiguration: API key or base URL missing' }, { status: 500 });
  }

  try {
    const location = city 
      ? { type: 'city' as const, city }
      : { type: 'coordinates' as const, lat: parseFloat(lat!), lon: parseFloat(lon!) };

    const [weatherRes, forecastRes] = await Promise.all([
      axios.get(location.type === 'city'
        ? `${BASE_URL}/weather?q=${encodeURIComponent(city!)}&units=${units}&appid=${API_KEY}`
        : `${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${API_KEY}`),
      axios.get(location.type === 'city'
        ? `${BASE_URL}/forecast?q=${encodeURIComponent(city!)}&units=${units}&appid=${API_KEY}`
        : `${BASE_URL}/forecast?lat=${location.lat}&lon=${location.lon}&units=${units}&appid=${API_KEY}`)
    ]);

    return NextResponse.json({ weather: weatherRes.data, forecast: forecastRes.data });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const statusCode = err.response?.status === 404 ? 404 : 502;
      const message = err.response?.status === 404 
        ? 'City not found'
        : 'Failed to fetch weather data';
      return NextResponse.json({ error: message }, { status: statusCode });
    }
    console.error('Error fetching data:', err);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 502 });
  }
}
