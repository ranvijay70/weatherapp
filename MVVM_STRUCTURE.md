# MVVM Architecture Structure

This document describes the MVVM (Model-View-ViewModel) architecture implemented in the Weather App.

## Folder Structure

```
weather-app/
├── src/
│   ├── models/              # Data models and interfaces
│   │   ├── weather.model.ts
│   │   ├── settings.model.ts
│   │   └── location.model.ts
│   ├── viewmodels/          # Business logic and state management
│   │   ├── weather.viewmodel.ts
│   │   ├── settings.viewmodel.ts
│   │   └── map.viewmodel.ts
│   ├── services/            # API calls and external services
│   │   ├── weather.service.ts
│   │   ├── location.service.ts
│   │   └── settings.service.ts
│   ├── hooks/               # Custom React hooks
│   │   ├── use-location.hook.ts
│   │   └── use-auto-location.hook.ts
│   ├── components/          # Reusable UI components
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   └── weather/
│   │       └── SearchBar.view.tsx
│   └── utils/                # Utility functions
│       ├── constants.ts
│       └── formatters.ts
├── app/                      # Next.js pages (Views)
│   ├── page.tsx
│   ├── map/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
├── lib/                      # Shared libraries
│   ├── api-client.ts        # Centralized API client
│   └── weather-icons.ts     # Weather icon utilities
└── app/                      # Next.js App Router pages
```

## Architecture Layers

### 1. Models (`src/models/`)
**Purpose**: Define data structures and types

- `weather.model.ts`: Weather, Forecast, AQI data structures
- `settings.model.ts`: App settings structure
- `location.model.ts`: Location and coordinates structures

### 2. ViewModels (`src/viewmodels/`)
**Purpose**: Business logic, state management, data transformation

- `weather.viewmodel.ts`: Manages weather data fetching and state
- `settings.viewmodel.ts`: Manages settings state and persistence
- `map.viewmodel.ts`: Manages map state and interactions

**Key Features**:
- Class-based pattern with private state management
- Provides hooks for easy consumption in components
- Handles data transformation and validation
- Uses `useRef` to persist ViewModel instances across renders

### 3. Services (`src/services/`)
**Purpose**: API calls, external service integration

- `weather.service.ts`: Weather API calls
- `location.service.ts`: Location services (geolocation, IP-based)
- `settings.service.ts`: Settings persistence (localStorage)

**Key Features**:
- Pure service classes with static methods
- No UI dependencies
- Error handling and data normalization

### 4. Views (`app/` and `src/components/`)
**Purpose**: UI presentation only

- Pages in `app/` use ViewModels via hooks
- Reusable components in `src/components/ui/`
- View components in `src/components/weather/`

**Key Features**:
- No business logic in views
- Receive data via props or hooks
- Handle user interactions and pass to ViewModels

### 5. Hooks (`src/hooks/`)
**Purpose**: Reusable logic hooks

- `use-location.hook.ts`: Location fetching logic
- `use-auto-location.hook.ts`: Auto-location on mount

### 6. Utils (`src/utils/`)
**Purpose**: Utility functions and constants

- `constants.ts`: App-wide constants
- `formatters.ts`: Data formatting functions

## Benefits of MVVM Architecture

1. **Separation of Concerns**: Clear boundaries between data, logic, and presentation
2. **Reusability**: ViewModels and services can be reused across different views
3. **Testability**: Business logic is isolated and easily testable
4. **Maintainability**: Changes to one layer don't affect others
5. **Scalability**: Easy to add new features without affecting existing code

## Usage Example

### View (Page)
```typescript
// app/page.tsx
import { useWeatherViewModel } from '@/src/viewmodels/weather.viewmodel';

export default function Home() {
  const { weather, loading, error, fetchWeatherByCity } = useWeatherViewModel();
  
  return (
    // UI components using weather data
  );
}
```

### ViewModel
```typescript
// src/viewmodels/weather.viewmodel.ts
export function useWeatherViewModel() {
  const [state, setState] = useState<WeatherState>({...});
  
  const fetchWeatherByCity = async (city: string) => {
    // Business logic here
    const data = await WeatherService.getWeatherByCity(city);
    setState({...});
  };
  
  return { ...state, fetchWeatherByCity };
}
```

### Service
```typescript
// src/services/weather.service.ts
export class WeatherService {
  static async getWeatherByCity(city: string): Promise<WeatherResponse> {
    // API call logic
  }
}
```

## Migration Status

- ✅ Models created and migrated
- ✅ ViewModels created (all follow class-based pattern)
- ✅ Services refactored
- ✅ Custom hooks created
- ✅ Reusable UI components created
- ✅ Home page migrated to MVVM
- ✅ Settings page migrated to MVVM
- ✅ Map page migrated to MVVM
- ✅ All legacy components removed
- ✅ API configuration centralized
- ✅ No code duplication

## Next Steps

1. Complete migration of remaining components
2. Add unit tests for ViewModels and Services
3. Add error boundaries
4. Implement proper loading states
5. Add TypeScript strict mode compliance

