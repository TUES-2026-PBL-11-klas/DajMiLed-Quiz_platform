import { apiService } from './apiService';

export interface AiFormRequest {
  title: string;
  context: string;
  questions?: number;
  difficulty?: string;
}

export interface AiFormResponse {
  id: number;
  title: string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const aiFormService = {
  generate: async (req: AiFormRequest): Promise<ApiResponse<AiFormResponse>> => {
    return apiService.post<ApiResponse<AiFormResponse>>('/ai-form', req);
  },
};
