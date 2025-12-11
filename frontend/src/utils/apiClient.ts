import { API_CONFIG } from '../config/api.config';
import { cookieStorage } from './cookieStorage';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<string> | null = null;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.defaultHeaders = API_CONFIG.HEADERS;
  }

  /**
   * Get headers with authentication token
   */
  private getHeaders(customHeaders?: Record<string, string>, requiresAuth = true): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };

    if (requiresAuth) {
      const token = cookieStorage.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;

    this.refreshPromise = (async () => {
      try {
        const refreshToken = cookieStorage.getRefreshToken();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`, {
          method: 'POST',
          headers: this.defaultHeaders,
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          throw new Error('Token refresh failed');
        }

        const data = await response.json();

        // Store new tokens
        cookieStorage.setToken(data.accessToken);
        
        if (data.refreshToken) {
          cookieStorage.setRefreshToken(data.refreshToken);
        }

        return data.accessToken;
      } catch (error) {
        // Clear tokens and redirect to login
        cookieStorage.clearAll();
        window.location.href = '/login';
        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Make API request with automatic token refresh
   */
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers: customHeaders, requiresAuth = true } = options;

    const makeRequest = async (token?: string): Promise<Response> => {
      const headers = customHeaders 
        ? { ...this.getHeaders(customHeaders, requiresAuth) }
        : this.getHeaders(undefined, requiresAuth);

      // Override token if provided (used after refresh)
      if (token && requiresAuth) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const config: RequestInit = {
        method,
        headers,
      };

      if (body) {
        config.body = JSON.stringify(body);
      }

      return fetch(`${this.baseURL}${endpoint}`, config);
    };

    try {
      let response = await makeRequest();

      // If 401 Unauthorized and we have a refresh token, try to refresh
      if (response.status === 401 && requiresAuth && cookieStorage.hasRefreshToken()) {
        try {
          const newToken = await this.refreshAccessToken();
          response = await makeRequest(newToken);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          throw refreshError;
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  /**
   * Convenience methods
   */
  get<T>(endpoint: string, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', requiresAuth });
  }

  post<T>(endpoint: string, body?: any, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body, requiresAuth });
  }

  put<T>(endpoint: string, body?: any, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body, requiresAuth });
  }

  patch<T>(endpoint: string, body?: any, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body, requiresAuth });
  }

  delete<T>(endpoint: string, requiresAuth = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', requiresAuth });
  }
}

export const apiClient = new ApiClient();