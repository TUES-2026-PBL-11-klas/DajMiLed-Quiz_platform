'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/Button';
import { aiFormService } from '@/services/aiFormService';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles } from 'lucide-react';

export default function AiGeneratePage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [questions, setQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="font-semibold text-on-surface">You must be logged in to generate a quiz.</p>
          <button onClick={() => router.push('/login')} className="text-primary hover:underline">Go to Login</button>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!title.trim() || context.trim().length < 30) {
      setError('Title is required and context must be at least 30 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await aiFormService.generate({ title: title.trim(), context: context.trim(), questions, difficulty });
      router.push(`/quiz/${res.data.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to generate quiz. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      <NavBar />
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-7 h-7 text-primary" />
          <h1 className="font-display font-extrabold text-3xl">Generate with AI</h1>
        </div>
        <p className="text-on-surface-variant mb-10">Paste your curriculum text and let AI build the quiz for you.</p>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>}

        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-2">Quiz Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Chapter 4 – Photosynthesis" className="w-full px-5 py-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 focus:ring-2 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/40 outline-none font-semibold" />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-2">Curriculum Text <span className="font-normal opacity-60">(min. 30 chars)</span></label>
            <textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="Paste your lesson content, notes, or any text to generate quiz questions from..." rows={8} className="w-full px-5 py-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 focus:ring-2 focus:ring-primary text-on-surface placeholder:text-on-surface-variant/40 outline-none resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">Number of Questions</label>
              <input type="number" min={1} max={20} value={questions} onChange={(e) => setQuestions(parseInt(e.target.value) || 5)} className="w-full px-5 py-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 focus:ring-2 focus:ring-primary text-on-surface outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-2">Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full px-5 py-3 rounded-2xl bg-surface-container-low border border-outline-variant/30 focus:ring-2 focus:ring-primary text-on-surface outline-none">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 justify-end mt-2">
            <Button variant="secondary" onClick={() => router.back()}>Cancel</Button>
            <Button variant="primary" isLoading={loading} onClick={handleGenerate}>
              <Sparkles className="w-4 h-4 mr-1 inline" /> Generate Quiz
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
