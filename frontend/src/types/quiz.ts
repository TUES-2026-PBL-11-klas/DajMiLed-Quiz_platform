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

export const EVAL_URL = 'http://localhost:8000';

export async function evaluateAnswer(question: string, answer: string): Promise<EvalResult | null> {
  try {
    const res = await fetch(`${EVAL_URL}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: '', question, answer }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
