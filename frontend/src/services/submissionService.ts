import { apiService } from './apiService';

interface AnswerRequest {
  questionId: number;
  answerText?: string;
  selectedChoiceId?: number;
}

export interface SubmissionRequest {
  formId: number;
  answers: AnswerRequest[];
}

export interface AnswerResult {
  questionId: number;
  isCorrect: boolean;
  score: number;
}

export interface SubmissionResult {
  submissionId: number;
  totalScore: number;
  results: AnswerResult[];
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const submissionService = {
  submit: async (req: SubmissionRequest): Promise<ApiResponse<SubmissionResult>> => {
    return apiService.post<ApiResponse<SubmissionResult>>('/submissions', req);
  },
};
