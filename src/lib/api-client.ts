import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Create axios instance with default config,
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle common errors
      if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login
        localStorage.removeItem('auth-token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

// Global API functions
export class ApiService {
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await apiClient.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private static handleError(error: unknown): ApiError {
    if (error instanceof AxiosError) {
      const response = error.response;
      if (response) {
        return {
          message: response.data?.message || error.message,
          status: response.status,
          errors: response.data?.errors,
        };
      }
    }
    return {
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      status: 500,
    };
  }
}