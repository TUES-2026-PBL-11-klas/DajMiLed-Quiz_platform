import { apiService } from './apiService';
import { authService } from './authService';
import { ApiResponse } from './formService';

export interface CreateQuestionRequest {
  formId: number;
  text: string;
  type: string;
}

export const questionService = {
  createQuestion: async (request: CreateQuestionRequest): Promise<ApiResponse<number>> => {
    return apiService.post<ApiResponse<number>>('/questions', request, {
      headers: authService.getAuthHeader()
    });
  }
};
