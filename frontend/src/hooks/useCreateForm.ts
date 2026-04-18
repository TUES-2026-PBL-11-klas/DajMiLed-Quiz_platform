'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DraftQuestion, QuestionType, uid } from '@/types/form';
import { formService } from '@/services/formService';
import { questionService } from '@/services/questionService';
import { choiceService } from '@/services/choiceService';

export function useCreateForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    { id: uid(), text: '', type: 'multiple_choice', choices: [{ id: uid(), text: '' }] },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = () => {
    setQuestions((qs) => [
      ...qs,
      { id: uid(), text: '', type: 'multiple_choice', choices: [{ id: uid(), text: '' }] },
    ]);
  };

  const removeQuestion = (qId: string) => {
    setQuestions((qs) => qs.filter((q) => q.id !== qId));
  };

  const updateQuestion = (qId: string, patch: Partial<DraftQuestion>) => {
    setQuestions((qs) => qs.map((q) => (q.id === qId ? { ...q, ...patch } : q)));
  };

  const changeType = (qId: string, type: QuestionType) => {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qId
          ? { ...q, type, choices: type === 'open_ended' ? [] : q.choices.length > 0 ? q.choices : [{ id: uid(), text: '' }] }
          : q
      )
    );
  };

  const addChoice = (qId: string) => {
    setQuestions((qs) =>
      qs.map((q) => (q.id === qId ? { ...q, choices: [...q.choices, { id: uid(), text: '' }] } : q))
    );
  };

  const removeChoice = (qId: string, cId: string) => {
    setQuestions((qs) =>
      qs.map((q) => (q.id === qId ? { ...q, choices: q.choices.filter((c) => c.id !== cId) } : q))
    );
  };

  const updateChoice = (qId: string, cId: string, text: string) => {
    setQuestions((qs) =>
      qs.map((q) =>
        q.id === qId ? { ...q, choices: q.choices.map((c) => (c.id === cId ? { ...c, text } : c)) } : q
      )
    );
  };

  const handleSave = async () => {
    setError('');
    if (!title.trim()) { setError('Please enter a quiz title.'); return; }
    if (questions.length === 0) { setError('Add at least one question.'); return; }
    for (const q of questions) {
      if (!q.text.trim()) { setError('All questions must have text.'); return; }
      if (q.type !== 'open_ended' && q.choices.filter((c) => c.text.trim()).length < 2) {
        setError('Multiple choice questions need at least 2 answer options.');
        return;
      }
    }

    setSaving(true);
    try {
      const formRes = await formService.createForm(title.trim());
      const formId = formRes.data;
      for (const q of questions) {
        const qRes = await questionService.createQuestion({ formId, text: q.text.trim(), type: q.type });
        const questionId = qRes.data;
        for (const c of q.choices.filter((ch) => ch.text.trim())) {
          await choiceService.createChoice({ questionId, text: c.text.trim() });
        }
      }
      router.push(`/quiz/${formId}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save quiz. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return {
    title, setTitle,
    questions,
    saving,
    error,
    addQuestion,
    removeQuestion,
    updateQuestion,
    changeType,
    addChoice,
    removeChoice,
    updateChoice,
    handleSave,
  };
}
