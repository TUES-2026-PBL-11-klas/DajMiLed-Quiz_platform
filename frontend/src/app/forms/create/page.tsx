'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/Button';
import { QuestionCard } from '@/components/Form/QuestionCard';
import { useCreateForm } from '@/hooks/useCreateForm';
import { useAuth } from '@/hooks/useAuth';
import { PlusCircle } from 'lucide-react';

export default function CreateFormPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { title, setTitle, context, setContext, questions, saving, error, addQuestion, removeQuestion, updateQuestion, changeType, addChoice, removeChoice, updateChoice, handleSave } = useCreateForm();

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="font-semibold text-on-surface">You must be logged in to create a quiz.</p>
          <button onClick={() => router.push('/login')} className="text-primary hover:underline">Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      <NavBar activeLink="create" />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="font-display font-extrabold text-3xl mb-2">Create a Quiz</h1>
        <p className="text-on-surface-variant mb-10">Build your quiz below. Add questions and answer options, then save.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
        )}

        <div className="mb-10">
          <label className="block text-sm font-bold text-on-surface-variant mb-2" htmlFor="title">Quiz Title</label>
          <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Introduction to Philosophy" className="w-full px-5 py-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 focus:ring-2 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/40 outline-none text-lg font-semibold" />
        </div>

        <div className="mb-10">
          <label className="block text-sm font-bold text-on-surface-variant mb-2" htmlFor="context">Quiz Description/Context (minimum 30 characters)</label>
          <textarea id="context" value={context} onChange={(e) => setContext(e.target.value)} placeholder="Describe the topic, learning objectives, or any context for this quiz..." rows={3} className="w-full px-5 py-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 focus:ring-2 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/40 outline-none text-base" />
          <p className="text-xs text-on-surface-variant mt-1">{context.length} / 30 characters minimum</p>
        </div>

        <div className="flex flex-col gap-6 mb-8">
          {questions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              totalCount={questions.length}
              onUpdate={updateQuestion}
              onRemove={removeQuestion}
              onChangeType={changeType}
              onAddChoice={addChoice}
              onRemoveChoice={removeChoice}
              onUpdateChoice={updateChoice}
            />
          ))}
        </div>

        <button type="button" onClick={addQuestion} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-outline-variant/40 text-on-surface-variant hover:border-primary hover:text-primary transition-colors font-semibold mb-10">
          <PlusCircle className="w-5 h-5" />
          Add Question
        </button>

        <div className="flex gap-4 justify-end">
          <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
          <Button variant="primary" isLoading={saving} onClick={handleSave}>Save Quiz</Button>
        </div>
      </main>
    </div>
  );
}
