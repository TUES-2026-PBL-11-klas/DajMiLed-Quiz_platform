'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/NavBar';
import { useQuiz } from '@/hooks/useQuiz';
import { QuizResults } from '@/components/Quiz/QuizResults';
import { QuizQuestionView } from '@/components/Quiz/QuizQuestionView';

export default function QuizTakePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { form, loading, error, currentIndex, setCurrentIndex, evaluating, allDone, setAllDone, setAnswers, getAnswer, setAnswer, handleSubmitQuestion } = useQuiz(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !form) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-error font-semibold">{error || 'Quiz not found.'}</p>
        <button onClick={() => router.push('/dashboard')} className="text-primary hover:underline">Back to Dashboard</button>
      </div>
    );
  }

  if (!form.questions || form.questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-on-surface-variant font-medium">This quiz has no questions yet.</p>
          <button onClick={() => router.back()} className="text-primary hover:underline">Go Back</button>
        </div>
      </div>
    );
  }

  if (allDone) {
    return (
      <QuizResults
        form={form}
        getAnswer={getAnswer}
        onRetake={() => { setAnswers({}); setCurrentIndex(0); setAllDone(false); }}
      />
    );
  }

  const questions = form.questions;
  const q = questions[currentIndex];
  const ans = getAnswer(q.id);
  const isLast = currentIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <p className="text-sm text-on-surface-variant font-medium">Question {currentIndex + 1} of {questions.length}</p>
          <div className="flex-1 h-1.5 bg-surface-container-high rounded-full">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
          </div>
        </div>
        <h1 className="font-display font-bold text-xl text-on-surface mb-8">{form.title}</h1>
        <QuizQuestionView
          q={q}
          ans={ans}
          currentIndex={currentIndex}
          isLast={isLast}
          evaluating={evaluating}
          onSetAnswer={setAnswer}
          onSubmit={handleSubmitQuestion}
          onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          onNext={() => setCurrentIndex((i) => i + 1)}
          onFinish={() => setAllDone(true)}
        />
      </main>
    </div>
  );
}
