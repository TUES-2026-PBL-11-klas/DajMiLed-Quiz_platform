import { handleError } from '../utils/errorHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

export const apiService = {
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  async post<T>(endpoint: string, body: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    try {
      let url = `${API_BASE_URL}${endpoint}`;
      
      if (options.params) {
        const query = new URLSearchParams(options.params).toString();
        url += `?${query}`;
      }

      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      throw new Error(handleError(error, `apiService.request to ${endpoint}`));
    }
  }
};
