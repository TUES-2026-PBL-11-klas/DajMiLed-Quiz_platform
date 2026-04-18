'use client';

import { useEffect, useState } from 'react';
import { formService, FullFormResponse, Question } from '@/services/formService';
import { AnswerState, evaluateAnswer } from '@/types/quiz';

export function useQuiz(id: string) {
  const [form, setForm] = useState<FullFormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [evaluating, setEvaluating] = useState(false);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    void (async () => {
      const formId = parseInt(id, 10);
      if (isNaN(formId)) {
        setError('Invalid quiz ID.');
        setLoading(false);
        return;
      }
      try {
        const res = await formService.getFormById(formId);
        setForm(res.data);
      } catch {
        setError('Quiz not found or server is unavailable.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const getAnswer = (questionId: number): AnswerState =>
    answers[questionId] ?? { singleChoice: undefined, multiChoice: [], openText: '', evalResult: undefined, submitted: false };

  const setAnswer = (questionId: number, partial: Partial<AnswerState>) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { ...getAnswer(questionId), ...partial } }));
  };

  const handleSubmitQuestion = async (q: Question) => {
    const ans = getAnswer(q.id);
    if (q.type === 'open_ended') {
      if (!ans.openText.trim()) return;
      setEvaluating(true);
      const result = await evaluateAnswer(q.text, ans.openText);
      setAnswer(q.id, { submitted: true, evalResult: result });
      setEvaluating(false);
    } else {
      setAnswer(q.id, { submitted: true });
    }
  };

  return {
    form, loading, error,
    currentIndex, setCurrentIndex,
    answers, setAnswers,
    evaluating, allDone, setAllDone,
    getAnswer, setAnswer,
    handleSubmitQuestion,
  };
}
