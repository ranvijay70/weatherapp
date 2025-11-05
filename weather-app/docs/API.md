# API Integration Documentation

## weatherService.ts

This service handles all API interactions with OpenWeatherMap.

### Interfaces

```typescript
// Current weather data structure
export interface WeatherData {
  name: string;          // City name
  main: {
    temp: number;        // Current temperature
    feels_like: number;  // Feels like temperature
    humidity: number;    // Humidity percentage
  };
  weather: Array<{
    main: string;        // Main weather condition
    description: string; // Detailed weather description
    icon: string;       // Weather icon code
  }>;
}

// Forecast data structure
export interface ForecastData {
  list: Array<{
    dt: number;         // Timestamp
    main: {
      temp: number;     // Temperature
      feels_like: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    dt_txt: string;    // Date and time text
  }>;
}
```

### Functions

#### getWeatherData
```typescript
export const getWeatherData = async (
  city: string, 
  units: 'metric' | 'imperial' = 'metric'
) => {
  // Fetches current weather for a city
  // Returns WeatherData or throws error
}
```

#### getForecastData
```typescript
export const getForecastData = async (
  city: string, 
  units: 'metric' | 'imperial' = 'metric'
) => {
  // Fetches 5-day forecast with 3-hour steps
  // Returns ForecastData or throws error
}
```

### Error Handling
Both functions include comprehensive error handling:
- Network errors
- API errors
- Invalid city names
- Rate limiting
- Generic errors

### Environment Variables
Required environment variables:
```
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key
NEXT_PUBLIC_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
```

### API Endpoints Used
1. Current Weather:
   ```
   GET /weather?q={city}&units={units}&appid={API_KEY}
   ```

2. 5-day Forecast:
   ```
   GET /forecast?q={city}&units={units}&appid={API_KEY}
   ```

### Units
- metric: Celsius, meters/sec
- imperial: Fahrenheit, miles/hour

### Response Processing
- Temperature conversion handled automatically by API
- Timestamps converted to local time
- Weather icons mapped to OpenWeather icon codes