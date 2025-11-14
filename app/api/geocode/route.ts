import { NextResponse } from 'next/server';
import { getGeocodeClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/src/config/api.constants';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim();
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '5', 10) || 5, 10);

  if (!q || q.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const geocodeClient = getGeocodeClient();
    
    // Use centralized API client with proper error handling
    const data = await geocodeClient.get(API_ENDPOINTS.GEOCODE_DIRECT, {
      params: {
        q,
        limit: limit.toString(),
      },
    });

    // Shape: [{ name, local_names, lat, lon, country, state }]
    interface GeocodeItem {
      name?: string;
      country?: string;
      state?: string;
      lat?: number;
      lon?: number;
    }
    
    const suggestions = (Array.isArray(data) ? data : []).map((item: GeocodeItem) => ({
      name: item?.name || '',
      country: item?.country || '',
      state: item?.state || '',
      lat: item?.lat,
      lon: item?.lon,
    })).filter((s): s is { name: string; country: string; state: string; lat: number; lon: number } => 
      typeof s.lat === 'number' && typeof s.lon === 'number'
    );

    return NextResponse.json({ suggestions });
  } catch (err) {
    // Error is already transformed by the API client
    const errorMessage = err instanceof Error ? err.message : 'Unknown geocode error';
    return NextResponse.json({ error: errorMessage }, { status: 502 });
  }
}
