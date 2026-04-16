import { apiService } from './apiService';

export interface AuthResponse {
  message: string;
  data: {
    token: string;
    username: string;
    role: string;
  };
}

export const authService = {
  login: async (credentials: Record<string, string>): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>('/auth/login', credentials);
  },

  register: async (credentials: Record<string, string>): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>('/auth/register', credentials);
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt_token');
    }
    return null;
  },

  saveToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwt_token', token);
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
    }
  },

  getAuthHeader: (): Record<string, string> => {
    const token = authService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};
