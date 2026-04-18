'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/Button';
import { formService, FullFormResponse } from '@/services/formService';
import { correctAnswerService } from '@/services/correctAnswerService';
import { CheckCircle2, Circle } from 'lucide-react';

export default function SetAnswersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState<FullFormResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Record<number, number[]>>({});

  useEffect(() => {
    void (async () => {
      const formId = parseInt(id, 10);
      if (isNaN(formId)) { setError('Invalid form ID.'); setLoading(false); return; }
      try {
        const res = await formService.getFormById(formId);
        setForm(res.data);
      } catch {
        setError('Could not load quiz.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const toggle = (questionId: number, choiceId: number) => {
    setSelected((prev) => {
      const current = prev[questionId] ?? [];
      return { ...prev, [questionId]: current.includes(choiceId) ? current.filter((c) => c !== choiceId) : [...current, choiceId] };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      for (const [qId, choiceIds] of Object.entries(selected)) {
        for (const choiceId of choiceIds) {
          await correctAnswerService.assign({ questionId: parseInt(qId), choiceId });
        }
      }
      router.push('/my-forms');
    } catch {
      setError('Failed to save some answers. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const gradableQuestions = form?.questions.filter((q) => q.type !== 'open_ended') ?? [];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      <NavBar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display font-extrabold text-3xl mb-2">Set Correct Answers</h1>
        <p className="text-on-surface-variant mb-10">{form?.title} — select the correct choice(s) for each question.</p>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

        {gradableQuestions.length === 0 && (
          <p className="text-on-surface-variant text-center py-16">No gradable questions — open-ended questions are graded by AI.</p>
        )}

        <div className="flex flex-col gap-6 mb-8">
          {gradableQuestions.map((q, i) => (
            <div key={q.id} className="rounded-2xl bg-surface-container p-6 border border-outline-variant/20">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Question {i + 1}</p>
              <p className="font-semibold text-on-surface mb-4">{q.text}</p>
              <div className="flex flex-col gap-2">
                {q.choices?.map((c) => {
                  const checked = (selected[q.id] ?? []).includes(c.id);
                  return (
                    <button key={c.id} type="button" onClick={() => toggle(q.id, c.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-colors ${checked ? 'bg-primary/10 border-primary text-primary' : 'bg-surface-container-low border-outline-variant/30 text-on-surface hover:border-primary/40'}`}>
                      {checked ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <Circle className="w-4 h-4 shrink-0 opacity-40" />}
                      {c.text}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-end">
          <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
          <Button variant="primary" isLoading={saving} onClick={handleSave} disabled={gradableQuestions.length === 0}>Save Answers</Button>
        </div>
      </main>
    </div>
  );
}
