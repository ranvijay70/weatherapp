# State Management Guide

## Main Page State (page.tsx)

### State Variables
```typescript
// Weather Data State
const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

// Forecast Data State
const [forecastData, setForecastData] = useState<ForecastData | null>(null);

// Error State
const [error, setError] = useState('');

// Loading State
const [loading, setLoading] = useState(false);
```

### State Updates
1. Initial Load:
   - All states are null/empty
   - Loading is false

2. Search Initiated:
   ```typescript
   setLoading(true);
   setError('');
   ```

3. Search Success:
   ```typescript
   setWeatherData(weather);
   setForecastData(forecast);
   setLoading(false);
   ```

4. Search Error:
   ```typescript
   setError(errorMessage);
   setWeatherData(null);
   setForecastData(null);
   setLoading(false);
   ```

## WeatherDisplay Component State

### Temperature Units
```typescript
const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
```

### Unit Toggle Logic
```typescript
const toggleUnits = () => {
  setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');
};
```

## HourlyForecast Component State

### Slider Position
```typescript
const [currentIndex, setCurrentIndex] = useState(0);
```

### Navigation Logic
```typescript
const handlePrev = () => {
  setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
};

const handleNext = () => {
  setCurrentIndex((prev) => 
    prev < hourlyData.length - 4 ? prev + 1 : prev
  );
};
```

## SearchBar Component State

### Input State
```typescript
const [city, setCity] = useState('');
```

### Form Handling
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (city.trim()) {
    onSearch(city.trim());
    setCity('');  // Reset input after search
  }
};
```

## State Flow Diagram
```
User Input → SearchBar
     ↓
Page Component
     ↓
API Calls (weatherService)
     ↓
Update Main State
     ↓
Distribute to Components:
  → WeatherDisplay
  → HourlyForecast
  → DailyForecast
```

## Best Practices

1. State Initialization
   - Always provide proper initial values
   - Use null for absent data
   - Empty string for error messages
   - False for loading states

2. Error Handling
   - Clear errors before new operations
   - Provide user-friendly error messages
   - Reset data states on error

3. Loading States
   - Show loading indicator during API calls
   - Disable interactions while loading
   - Preserve previous data until new data arrives

4. Data Flow
   - Maintain single source of truth
   - Pass data down through props
   - Use callbacks for upward communication

5. State Updates
   - Use functional updates for state based on previous value
   - Batch related state updates
   - Clear related states together