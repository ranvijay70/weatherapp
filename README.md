## Weather App (Next.js)

A responsive weather application built with Next.js App Router and Tailwind CSS. Search any city or use your current location to view current weather, 24-hour forecast, 5-day forecast, and AQI.

### Features
- Current weather with icon, temperature, feels-like, and humidity
- 24-hour and 5-day forecasts
- AQI panel (when coordinates available)
- Debounced search-as-you-type and submit search
- Use current location (geolocation)
- Mobile-first, accessible UI

### Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS (v4 syntax)
- Axios with resilient API client and retries

### Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` in the project root:
   ```env
   OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
   OPENWEATHER_GEO_BASE_URL=https://api.openweathermap.org/geo/1.0
   OPENWEATHER_API_KEY=YOUR_OPENWEATHER_API_KEY
   ```
   
   **Note:** `OPENWEATHER_GEO_BASE_URL` is optional (defaults to `https://api.openweathermap.org/geo/1.0` if not provided)
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the app at `http://localhost:3000`.

### Folder Structure
```
weather-app/
  app/
    api/weather/route.ts      # API route proxying OpenWeather
    globals.css               # Tailwind v4 styles
    layout.tsx                # Root layout
    page.tsx                  # Home page
  components/
    SearchBar.tsx             # Search input with debounced onChange + geolocation
    WeatherDisplay.tsx        # Main weather card and sections
    ui/
      no-data-found.tsx       # Empty state component
    weather/
      aqi-display.tsx         # AQI panel
      daily-forecast.tsx      # 5-day forecast list
      hourly-forecast.tsx     # 24-hour forecast list
  hooks/
    use-weather.ts            # Reusable weather fetching hook (optional)
  lib/
    api-client.ts             # Axios client with retries and error normalization
    weather-icons.ts          # Icon/gradient helpers
  services/
    weatherService.ts         # Types for Weather, Forecast, AQI
  README.md
```

Notes:
- Duplicate/legacy files have been removed to avoid repetition:
  - `src/hooks/use-weather.ts` (duplicate of `hooks/use-weather.ts`)
  - `components/DailyForecast.tsx` and `components/HourlyForecast.tsx` (superseded by `components/weather/*`)

### API Route
`app/api/weather/route.ts` uses the shared Axios client in `lib/api-client.ts` to call OpenWeather endpoints for current weather, forecast, and (optionally) AQI. It validates inputs and returns normalized JSON consumed by the UI.

### Search Behavior
- Type in the search box to trigger a debounced onChange search (600ms) for inputs with length ≥ 2.
- Press Enter or tap the Search button to submit immediately.
- Use the 📍 button to fetch weather via geolocation.

Mobile considerations:
- Input uses `type="search"`, `inputMode="search"`, and disables auto-correct/capitalize to improve phone UX.
- Styles ensure visibility on gradient backgrounds with adequate contrast and borders.

### Coding Standards
- TypeScript with explicit interfaces for public APIs
- No duplicate code or unused legacy components
- Clear, descriptive names and early returns
- Minimal, meaningful comments and small, focused components

### Environment Variables
- `OPENWEATHER_BASE_URL` (required) - Base URL for weather API (e.g., `https://api.openweathermap.org/data/2.5`)
- `OPENWEATHER_GEO_BASE_URL` (optional) - Base URL for geocoding API (defaults to `https://api.openweathermap.org/geo/1.0`)
- `OPENWEATHER_API_KEY` (required) - Your OpenWeatherMap API key

### Scripts
```json
"dev": "next dev",
"build": "next build",
"start": "next start"
```

### Troubleshooting
- If the search field doesn’t appear on mobile, ensure you’re building with the updated styles and that your browser isn’t caching old CSS. The input has been tuned for visibility and accessibility across devices.
- If API calls fail, verify your `.env.local` values and that your key is valid and not rate-limited.
