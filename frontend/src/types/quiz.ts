export interface EvalResult {
  score: number;
  feedback: string;
  is_correct: boolean;
}

export interface AnswerState {
  singleChoice?: string;
  multiChoice: string[];
  openText: string;
  evalResult?: EvalResult | null;
  submitted: boolean;
}

export const EVAL_URL = 'http://quiz-server-evaluation-service';

export async function evaluateAnswer(question: string, answer: string): Promise<EvalResult | null> {
  try {
    const res = await fetch(`${EVAL_URL}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: '', question, answer, question_type: 'open' }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
