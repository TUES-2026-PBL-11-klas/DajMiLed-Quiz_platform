import { apiService } from './apiService';

export interface AssignCorrectAnswerRequest {
  questionId: number;
  choiceId: number;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const correctAnswerService = {
  assign: async (req: AssignCorrectAnswerRequest): Promise<ApiResponse<null>> => {
    return apiService.post<ApiResponse<null>>('/correct-answers', req);
  },
};
