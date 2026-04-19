'use client';

import { useEffect, useState } from 'react';
import { formService, FullFormResponse, Question } from '@/services/formService';
import { submissionService, SubmissionResult, type SubmissionRequest } from '@/services/submissionService';
import { AnswerState, evaluateAnswer } from '@/types/quiz';

export function useQuiz(id: string) {
  const [form, setForm] = useState<FullFormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [evaluating, setEvaluating] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  useEffect(() => {
    void (async () => {
      const formId = parseInt(id, 10);
      if (isNaN(formId)) { setError('Invalid quiz ID.'); setLoading(false); return; }
      try {
        const res = await formService.getFormById(formId);
        console.log('Quiz loaded:', res);
        console.log('Form data:', res.data);
        console.log('Questions:', res.data?.questions);
        setForm(res.data);
      } catch (err) {
        console.error('Error loading quiz:', err);
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
    const normalizedType = q.type?.toLowerCase() ?? '';
    const isOpenEnded = normalizedType === 'open_ended' || normalizedType === 'open';

    if (isOpenEnded) {
      if (!ans.openText.trim()) return;
      setEvaluating(true);
      const result = await evaluateAnswer(q.text, ans.openText);
      setAnswer(q.id, { submitted: true, evalResult: result });
      setEvaluating(false);
    } else {
      setAnswer(q.id, { submitted: true });
    }
  };

  const submitQuiz = async (formId: number, questions: Question[]) => {
    const answers: SubmissionRequest['answers'] = [];
    for (const q of questions) {
      const ans = getAnswer(q.id);
      const normalizedType = q.type?.toLowerCase() ?? '';

      if (normalizedType === 'open_ended' || normalizedType === 'open') {
        if (ans.openText.trim()) {
          answers.push({ questionId: q.id, answerText: ans.openText.trim() });
        }
      } else if (normalizedType === 'multiple_answer') {
        for (const cId of ans.multiChoice) {
          answers.push({ questionId: q.id, selectedChoiceId: parseInt(cId) });
        }
      } else if (ans.singleChoice) {
        answers.push({ questionId: q.id, selectedChoiceId: parseInt(ans.singleChoice) });
      }
    }
    try {
      if (answers.length === 0) {
        console.warn('No answers provided for submission');
      }
      const res = await submissionService.submit({ formId, answers });
      setSubmissionResult(res.data);
    } catch (e: unknown) {
      console.error('Submission error:', e);
      // Submission is best-effort - allow users to see results even if submission fails
    }
    setAllDone(true);
  };

  return {
    form, loading, error,
    currentIndex, setCurrentIndex,
    answers, setAnswers,
    evaluating, allDone, setAllDone,
    submissionResult,
    getAnswer, setAnswer,
    handleSubmitQuestion, submitQuiz,
  };
}
