import { apiService } from './apiService';
import { authService } from './authService';
import { ApiResponse } from './formService';

export interface CreateChoiceRequest {
  questionId: number;
  text: string;
}

export const choiceService = {
  createChoice: async (request: CreateChoiceRequest): Promise<ApiResponse<number>> => {
    return apiService.post<ApiResponse<number>>('/choices', request, {
      headers: authService.getAuthHeader()
    });
  }
};
