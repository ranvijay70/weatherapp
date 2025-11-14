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

### Folder Structure (MVVM Architecture)
```
weather-app/
  app/
    api/
      geocode/route.ts        # Geocoding API route
      weather/route.ts        # Weather API route
    map/page.tsx              # Weather map page
    settings/page.tsx         # Settings page
    layout.tsx                # Root layout
    page.tsx                  # Home page
  lib/
    api-client.ts             # Centralized Axios client with retries/timeout
    weather-icons.ts          # Weather icon utilities
  src/
    components/               # View components (UI only)
      layout/
        AppBar.view.tsx       # App navigation bar
      map/
        MapEventHandler.tsx   # Map event handlers
        MapSearch.tsx         # Map search component
      ui/
        Button.tsx            # Reusable button
        Card.tsx              # Reusable card
        Input.tsx             # Reusable input
        LoadingSpinner.view.tsx
        no-data-found.tsx     # Empty state
      weather/
        SearchBar.view.tsx    # Search bar with suggestions
        WeatherDisplay.view.tsx
        aqi-display.tsx
        daily-forecast.tsx
        hourly-forecast.tsx
        hourly-forecast-graph.tsx
    config/
      api.config.ts           # Server-side API configuration (env vars)
      api.constants.ts        # Client-safe API constants
    hooks/
      use-auto-location.hook.ts
      use-location.hook.ts
    models/                   # Data models/types
      location.model.ts
      settings.model.ts
      weather.model.ts
    services/                 # Business logic layer
      location.service.ts
      settings.service.ts
      weather.service.ts
    utils/
      constants.ts            # Application constants
      formatters.ts           # Data formatting utilities
      theme.ts                # Design system constants
    viewmodels/               # ViewModels (state management)
      map.viewmodel.ts
      settings.viewmodel.ts
      weather.viewmodel.ts
  README.md
```

**Architecture Notes:**
- **MVVM Pattern**: Models (data), Views (components), ViewModels (state/logic)
- **Separation of Concerns**: Services handle API calls, ViewModels manage state, Views render UI
- **No Duplication**: API keys/URLs centralized in `src/config/api.config.ts`
- **Consistent Structure**: All ViewModels follow class-based pattern with hooks

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

### Reusability & Responsiveness
- **Reusable Components**: All UI components (`Card`, `Button`, `Input`, etc.) are fully reusable with configurable props
- **Responsive Design**: Mobile-first approach with consistent breakpoints (sm, md, lg, xl)
- **Theme System**: Centralized design tokens in `src/utils/theme.ts` for consistent styling
- **Component Props**: All components extend standard HTML attributes for maximum flexibility
- **Responsive Utilities**: Pre-defined responsive classes for text, padding, margins, and spacing

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
