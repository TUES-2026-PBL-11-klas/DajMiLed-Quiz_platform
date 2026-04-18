'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/Button';
import { FullFormResponse } from '@/services/formService';
import { AnswerState } from '@/types/quiz';
import { SubmissionResult } from '@/services/submissionService';
import { CheckCircle } from 'lucide-react';

interface Props {
  form: FullFormResponse;
  getAnswer: (questionId: number) => AnswerState;
  submissionResult: SubmissionResult | null;
  onRetake: () => void;
}

export function QuizResults({ form, getAnswer, submissionResult, onRetake }: Props) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-display font-extrabold text-3xl text-on-surface mb-2">Quiz Complete!</h1>
          <p className="text-on-surface-variant">{form.title}</p>
          {submissionResult && (
            <div className="mt-4 inline-block px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20">
              <p className="font-display font-bold text-2xl text-primary">{Math.round(submissionResult.totalScore * 100)}%</p>
              <p className="text-sm text-on-surface-variant">Total Score</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {form.questions.map((q, i) => {
            const ans = getAnswer(q.id);
            const result = submissionResult?.results.find((r) => r.questionId === q.id);
            const normalizedType = q.type?.toLowerCase() ?? '';
            const isOpenEnded = normalizedType === 'open_ended' || normalizedType === 'open';

            return (
              <div key={q.id} className={`rounded-2xl bg-surface-container p-6 border ${result ? (result.isCorrect ? 'border-green-300' : 'border-amber-300') : 'border-outline-variant/20'}`}>
                <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Question {i + 1}</p>
                <p className="font-semibold text-on-surface mb-3">{q.text}</p>
                {(normalizedType === 'multiple_choice' || normalizedType === 'single_choice' || normalizedType === 'closed') && (
                  <p className="text-sm text-on-surface-variant"><span className="font-bold">Your answer: </span>{q.choices?.find((c) => c.id.toString() === ans.singleChoice)?.text || 'Not answered'}</p>
                )}
                {normalizedType === 'multiple_answer' && (
                  <p className="text-sm text-on-surface-variant"><span className="font-bold">Your answers: </span>{ans.multiChoice.length > 0 ? q.choices?.filter((c) => ans.multiChoice.includes(c.id.toString())).map((c) => c.text).join(', ') : 'Not answered'}</p>
                )}
                {isOpenEnded && (
                  <div>
                    <p className="text-sm text-on-surface-variant mb-2"><span className="font-bold">Your answer: </span>{ans.openText || 'Not answered'}</p>
                    {ans.evalResult && (
                      <div className={`mt-3 p-3 rounded-xl text-sm ${ans.evalResult.is_correct ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
                        <p className="font-bold mb-1">{ans.evalResult.is_correct ? '✓ Correct' : '○ Partial'} — Score: {Math.round(ans.evalResult.score * 100)}%</p>
                        <p>{ans.evalResult.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
                {result && !isOpenEnded && (
                  <p className={`text-xs font-bold mt-2 ${result.isCorrect ? 'text-green-600' : 'text-amber-600'}`}>{result.isCorrect ? '✓ Correct' : '✗ Incorrect'} — {Math.round(result.score * 100)}%</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center mt-10">
          <Button variant="secondary" onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
          <Button variant="primary" onClick={onRetake}>Retake Quiz</Button>
        </div>
      </div>
    </div>
  );
}
