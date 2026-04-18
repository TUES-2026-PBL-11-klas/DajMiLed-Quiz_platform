export type QuestionType = 'multiple_choice' | 'multiple_answer' | 'open_ended';

export interface DraftChoice {
  id: string;
  text: string;
}

export interface DraftQuestion {
  id: string;
  text: string;
  type: QuestionType;
  choices: DraftChoice[];
}

export const TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: 'Multiple Choice (single answer)',
  multiple_answer: 'Multiple Answer (multiple correct)',
  open_ended: 'Open Ended (text answer)',
};

export function uid(): string {
  return Math.random().toString(36).slice(2);
}
