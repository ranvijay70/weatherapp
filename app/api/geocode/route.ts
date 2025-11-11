import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q')?.trim()
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '5', 10) || 5, 10)

  if (!q || q.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Server missing OPENWEATHER_API_KEY' }, { status: 500 })
  }

  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=${limit}&appid=${apiKey}`
    const res = await fetch(geoUrl, { next: { revalidate: 60 } })
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: `Geocode failed: ${text || res.status}` }, { status: 502 })
    }
    const data = await res.json()
    // Shape: [{ name, local_names, lat, lon, country, state }]
    const suggestions = (Array.isArray(data) ? data : []).map((item: any) => ({
      name: item?.name || '',
      country: item?.country || '',
      state: item?.state || '',
      lat: item?.lat,
      lon: item?.lon,
    })).filter((s: any) => typeof s.lat === 'number' && typeof s.lon === 'number')

    return NextResponse.json({ suggestions })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown geocode error'
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
