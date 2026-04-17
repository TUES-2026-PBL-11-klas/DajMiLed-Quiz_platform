import { apiService } from './apiService';
import { authToken } from '../utils/authToken';

export interface AuthResponse {
  status: string;
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

  getToken: authToken.get,
  saveToken: authToken.save,
  logout: authToken.remove,
  getAuthHeader: authToken.getAuthHeader
};
