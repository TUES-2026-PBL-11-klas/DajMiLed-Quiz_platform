'use client';

import React from 'react';
import { Button } from '@/components/Button';
import { MultipleChoiceQuestion } from '@/components/Quiz/MultipleChoiceQuestion';
import { MultipleAnswerQuestion } from '@/components/Quiz/MultipleAnswerQuestion';
import { OpenEndedQuestion } from '@/components/Quiz/OpenEndedQuestion';
import { Question } from '@/services/formService';
import { AnswerState } from '@/types/quiz';
import { CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  q: Question;
  ans: AnswerState;
  currentIndex: number;
  isLast: boolean;
  evaluating: boolean;
  onSetAnswer: (qId: number, partial: Partial<AnswerState>) => void;
  onSubmit: (q: Question) => void;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
}

export function QuizQuestionView({ q, ans, currentIndex, isLast, evaluating, onSetAnswer, onSubmit, onPrev, onNext, onFinish }: Props) {
  const options = q.choices?.map((c) => ({ id: c.id.toString(), label: c.text })) ?? [];

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!ans.submitted) onSubmit(q); }} className="flex flex-col gap-8">
      {q.type === 'multiple_choice' && (
        <MultipleChoiceQuestion question={q.text} options={options} value={ans.singleChoice} onChange={(val) => onSetAnswer(q.id, { singleChoice: val })} />
      )}
      {q.type === 'multiple_answer' && (
        <MultipleAnswerQuestion question={q.text} options={options} values={ans.multiChoice} onChange={(vals) => onSetAnswer(q.id, { multiChoice: vals })} />
      )}
      {q.type === 'open_ended' && (
        <OpenEndedQuestion question={q.text} value={ans.openText} onChange={(val) => onSetAnswer(q.id, { openText: val })} />
      )}

      {ans.submitted && q.type === 'open_ended' && (
        <div>
          {evaluating && (
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Evaluating your answer...
            </div>
          )}
          {ans.evalResult && (
            <div className={`p-4 rounded-xl text-sm ${ans.evalResult.is_correct ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {ans.evalResult.is_correct ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                Score: {Math.round(ans.evalResult.score * 100)}%
              </div>
              <p>{ans.evalResult.feedback}</p>
            </div>
          )}
          {ans.evalResult === null && (
            <p className="text-xs text-on-surface-variant/60">(Evaluation service not available — answer recorded.)</p>
          )}
        </div>
      )}

      {ans.submitted && q.type !== 'open_ended' && (
        <div className="flex items-center gap-2 text-sm text-primary font-medium">
          <CheckCircle className="w-4 h-4" />
          Answer recorded.
        </div>
      )}

      <div className="flex items-center justify-between pt-4">
        <button type="button" onClick={onPrev} disabled={currentIndex === 0} className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary disabled:opacity-40 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <div className="flex gap-3">
          {!ans.submitted && <Button type="submit" variant="primary" isLoading={evaluating}>Submit Answer</Button>}
          {ans.submitted && !isLast && (
            <Button type="button" variant="primary" onClick={onNext}>Next <ChevronRight className="w-4 h-4 inline ml-1" /></Button>
          )}
          {ans.submitted && isLast && (
            <Button type="button" variant="primary" onClick={onFinish}>Finish Quiz</Button>
          )}
        </div>
      </div>
    </form>
  );
}
