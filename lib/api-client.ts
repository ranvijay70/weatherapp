import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition?: (error: AxiosError) => boolean;
}

interface ApiClientConfig {
  baseURL: string;
  apiKey: string;
  timeout?: number;
  retryConfig?: RetryConfig;
}

class ApiClient {
  private client: AxiosInstance;
  private apiKey: string;
  private retryConfig: RetryConfig;

  constructor(config: ApiClientConfig) {
    this.apiKey = config.apiKey;
    this.retryConfig = config.retryConfig || {
      retries: 3,
      retryDelay: 1000,
      retryCondition: (error: AxiosError) => {
        // Retry on network errors or 5xx status codes
        return (
          !error.response ||
          (error.response.status >= 500 && error.response.status < 600)
        );
      },
    };

    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000, // 10 seconds default timeout
      params: {
        appid: this.apiKey, // Add API key to all requests by default
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add logging, headers, etc.
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add any global headers here
        config.headers = config.headers || {};
        
        // Log request in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
      },
      (error: AxiosError) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors globally, transform responses
    this.client.interceptors.response.use(
      (response) => {
        // Log response in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle retry logic
        if (this.shouldRetry(error, originalRequest)) {
          return this.retryRequest(originalRequest, error);
        }

        // Transform error for consistent error handling
        const transformedError = this.transformError(error);
        return Promise.reject(transformedError);
      }
    );
  }

  private shouldRetry(error: AxiosError, config?: InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number }): boolean {
    if (!config || config._retry) {
      return false;
    }

    // Check if we've exceeded max retries
    const retryCount = config._retryCount || 0;
    if (retryCount >= this.retryConfig.retries) {
      return false;
    }

    if (this.retryConfig.retryCondition) {
      return this.retryConfig.retryCondition(error);
    }

    return false;
  }

  private async retryRequest(
    config: InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number },
    error: AxiosError
  ): Promise<any> {
    config._retry = true;

    // Get current retry count
    const retryCount = config._retryCount || 0;

    // Check if we've exceeded max retries
    if (retryCount >= this.retryConfig.retries) {
      throw this.transformError(error);
    }

    // Calculate delay with exponential backoff
    const delay = this.retryConfig.retryDelay * Math.pow(2, retryCount);
    
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Increment retry count
    config._retryCount = retryCount + 1;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Retry] Attempt ${config._retryCount} for ${config.url}`);
    }

    return this.client.request(config);
  }

  private transformError(error: AxiosError): Error {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 404:
          return new Error(data?.message || 'Resource not found');
        case 401:
          return new Error('Unauthorized - Invalid API key');
        case 429:
          return new Error('Too many requests - Rate limit exceeded');
        case 500:
        case 502:
        case 503:
          return new Error('Server error - Please try again later');
        default:
          return new Error(data?.message || `Request failed with status ${status}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      if (error.code === 'ECONNABORTED') {
        return new Error('Request timeout - Please try again');
      }
      return new Error('Network error - Please check your connection');
    } else {
      // Error setting up the request
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Public method to make GET requests
  async get<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(endpoint, config);
      return response.data;
    } catch (error) {
      // Error is already transformed by interceptor
      throw error;
    }
  }

  // Public method to make POST requests (for future use)
  async post<T = any>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(endpoint, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Method to update API key if needed
  updateApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    this.client.defaults.params = {
      ...this.client.defaults.params,
      appid: apiKey,
    };
  }
}

// Factory function to create API client instance
export function createApiClient(config: ApiClientConfig): ApiClient {
  if (!config.baseURL || !config.apiKey) {
    throw new Error('baseURL and apiKey are required');
  }
  return new ApiClient(config);
}

// Export singleton instance creator (for server-side usage)
let apiClientInstance: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!apiClientInstance) {
    const baseURL = process.env.OPENWEATHER_BASE_URL;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!baseURL || !apiKey) {
      throw new Error('OPENWEATHER_BASE_URL and OPENWEATHER_API_KEY must be set in environment variables');
    }

    apiClientInstance = createApiClient({
      baseURL,
      apiKey,
      timeout: 10000,
      retryConfig: {
        retries: 3,
        retryDelay: 1000,
      },
    });
  }

  return apiClientInstance;
}

export type { ApiClient, ApiClientConfig, RetryConfig };

