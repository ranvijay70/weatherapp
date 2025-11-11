
import { NextResponse } from 'next/server';
import { getApiClient } from '@/lib/api-client';

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
    return NextResponse.json(
      { error: 'Either city or coordinates (lat/lon) are required' },
      { status: 400 }
    );
  }

  // Validate coordinate values if provided
  if (lat !== null && lon !== null) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    if (
      isNaN(latitude) ||
      isNaN(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }
  }

  try {
    const apiClient = getApiClient();

    // Build query parameters
    const weatherParams: Record<string, string> = {
      units,
    };

    const forecastParams: Record<string, string> = {
      units,
    };

    if (city) {
      weatherParams.q = city;
      forecastParams.q = city;
    } else {
      weatherParams.lat = lat!;
      weatherParams.lon = lon!;
      forecastParams.lat = lat!;
      forecastParams.lon = lon!;
    }

    // Make parallel requests for weather and forecast
    const [weatherData, forecastData] = await Promise.all([
      apiClient.get('/weather', { params: weatherParams }),
      apiClient.get('/forecast', { params: forecastParams }),
    ]);

    // Get coordinates for AQI (from weather data response)
    const aqiLat = weatherData.coord?.lat || (city ? null : parseFloat(lat!));
    const aqiLon = weatherData.coord?.lon || (city ? null : parseFloat(lon!));

    // Fetch AQI data if coordinates are available
    let aqiData = null;
    if (aqiLat !== null && aqiLon !== null && !isNaN(aqiLat) && !isNaN(aqiLon)) {
      try {
        aqiData = await apiClient.get('/air_pollution', {
          params: { lat: aqiLat.toString(), lon: aqiLon.toString() },
        });
      } catch (aqiError) {
        // AQI is optional, so we don't fail the entire request if it fails
        console.warn('Failed to fetch AQI data:', aqiError);
      }
    }

    return NextResponse.json({
      weather: weatherData,
      forecast: forecastData,
      aqi: aqiData,
    });
  } catch (err) {
    // Error is already transformed by the API client
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
    const statusCode = errorMessage.includes('not found') ? 404 : 502;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
