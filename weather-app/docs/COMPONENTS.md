# Components Documentation

## SearchBar.tsx

This component creates a modern search input for city names.

### Key Features:
- Modern glassmorphism design with blur effects
- Real-time input handling
- Form submission handling
- Responsive design

### Props:
```typescript
interface SearchBarProps {
  onSearch: (city: string) => void;  // Callback function when search is submitted
}
```

### Key Functions:
- `handleSubmit`: Handles form submission and validates input
- State management using `useState` for the city input

### Styling:
- Uses Tailwind CSS for modern glass-like effect
- Custom animations and transitions
- Backdrop blur for glass effect
- Gradient background with blur

## WeatherDisplay.tsx

The main component for displaying weather information.

### Key Features:
- Dynamic backgrounds based on weather conditions
- Temperature unit toggle (°C/°F)
- Current weather display
- Integration with hourly and daily forecasts

### Props:
```typescript
interface WeatherDisplayProps {
  weatherData: WeatherData | null;    // Current weather data
  forecastData: ForecastData | null;  // Forecast data
  error?: string;                     // Error message if any
}
```

### Key Functions:
- `getWeatherBackground`: Returns appropriate gradient based on weather
- `toggleUnits`: Handles temperature unit switching
- `convertTemp`: Converts temperatures between Celsius and Fahrenheit

### Weather Backgrounds:
- Clear: Blue sky gradients
- Clouds: Gray gradients
- Rain: Dark blue gradients
- Snow: Light blue gradients
- Thunderstorm: Dark purple gradients

## HourlyForecast.tsx

Displays a sliding 24-hour forecast.

### Key Features:
- Horizontal sliding carousel
- 3-hour interval forecasts
- Temperature and weather icon display
- Navigation controls

### Props:
```typescript
interface HourlyForecastProps {
  forecastData: ForecastData | null;  // Hourly forecast data
  units: 'metric' | 'imperial';       // Temperature units
}
```

### Key Functions:
- `handlePrev`: Navigate to previous hours
- `handleNext`: Navigate to next hours
- Automatic data slicing for 24-hour view

### UI Features:
- Smooth sliding animation
- Responsive design
- Weather icons
- Temperature display

## DailyForecast.tsx

Shows a 3-day weather forecast.

### Key Features:
- Grid layout for daily forecasts
- Daily weather summaries
- Temperature and condition display

### Props:
```typescript
interface DailyForecastProps {
  forecastData: ForecastData | null;  // Daily forecast data
  units: 'metric' | 'imperial';       // Temperature units
}
```

### Key Functions:
- Data grouping by day
- Temperature conversion handling
- Date formatting and display

### Display Features:
- Weather icons
- Daily temperatures
- Weather descriptions
- Responsive grid layout