import { apiService } from './apiService';
import { authService } from './authService';

export interface Choice {
  id: number;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  type: string;
  choices?: Choice[];
}

export interface FormResponse {
  id: number;
  title: string;
  createdBy: number;
}

export interface FullFormResponse extends FormResponse {
  questions: Question[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const formService = {
  getForms: async (page = 0, size = 10): Promise<ApiResponse<Page<FormResponse>>> => {
    return apiService.get<ApiResponse<Page<FormResponse>>>('/forms', {
      params: { page: page.toString(), size: size.toString() }
    });
  },

  getFormById: async (id: number): Promise<ApiResponse<FullFormResponse>> => {
    return apiService.get<ApiResponse<FullFormResponse>>(`/forms/${id}`);
  },

  getMyForms: async (page = 0, size = 10): Promise<ApiResponse<Page<FormResponse>>> => {
    return apiService.get<ApiResponse<Page<FormResponse>>>('/forms/me', {
      headers: authService.getAuthHeader(),
      params: { page: page.toString(), size: size.toString() }
    });
  },

  createForm: async (title: string): Promise<ApiResponse<number>> => {
    return apiService.post<ApiResponse<number>>('/forms', { title }, {
      headers: authService.getAuthHeader()
    });
  }
};
