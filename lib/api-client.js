import axios from 'axios';
import { API_CONFIG } from '@/config/api';

/**
 * API Client with Firebase Authentication
 * Manages all HTTP requests to the DEM backend
 */
class APIClient {
  constructor() {
    this.authToken = null;
    this.tokenRefreshCallback = null;
    
    // Create axios instance
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  setupInterceptors() {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      (config) => {
        // Only add auth token if it exists and skipAuth is not set
        if (this.authToken && !config.skipAuth) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        
        // Remove skipAuth flag before sending (internal use only)
        delete config.skipAuth;
        
        // Log requests in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => {
        // Log successful responses in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API] Response:`, response.status, response.config.url);
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Try to refresh token
          if (this.tokenRefreshCallback) {
            try {
              const newToken = await this.tokenRefreshCallback();
              if (newToken) {
                this.setAuthToken(newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return this.client(originalRequest);
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              this.handleUnauthorized();
              return Promise.reject(refreshError);
            }
          } else {
            this.handleUnauthorized();
          }
        }

        // Log errors in development
        if (process.env.NODE_ENV === 'development') {
          if (error.response) {
            // Server responded with error status
            console.error('[API] Error:', error.response.status, error.config?.url);
            console.error('[API] Error data:', error.response.data);
          } else if (error.request) {
            // Request made but no response received (network error)
            console.error('[API] Network Error - No response received');
            console.error('[API] Request URL:', error.config?.url);
            console.error('[API] Base URL:', error.config?.baseURL);
            console.error('[API] Full URL:', `${error.config?.baseURL}${error.config?.url}`);
            console.error('[API] Error message:', error.message);
          } else {
            // Error in request setup
            console.error('[API] Request setup error:', error.message);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Set Firebase ID token for authentication
   * @param {string} token - Firebase ID token
   */
  setAuthToken(token) {
    this.authToken = token;
    console.log('[API Client] Auth token set');
  }

  /**
   * Clear authentication token
   */
  clearAuthToken() {
    this.authToken = null;
    console.log('[API Client] Auth token cleared');
  }

  /**
   * Set callback for token refresh
   * @param {Function} callback - Function that returns a new token
   */
  setTokenRefreshCallback(callback) {
    this.tokenRefreshCallback = callback;
  }

  /**
   * Handle unauthorized access
   */
  handleUnauthorized() {
    console.error('[API Client] Unauthorized access detected');
    this.clearAuthToken();
    
    // Redirect to login if we're in the browser
    if (typeof window !== 'undefined') {
      // Store current path for redirect after login
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/';
    }
  }

  /**
   * Get the axios client instance
   * @returns {AxiosInstance}
   */
  getClient() {
    return this.client;
  }

  /**
   * Check if client is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.authToken;
  }
}

// Create singleton instance
export const apiClient = new APIClient();

// Export the class for testing
export default APIClient;
