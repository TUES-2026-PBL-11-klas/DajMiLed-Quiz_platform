"use client";

import React, { useState } from 'react';
import { MultipleChoiceQuestion, MultipleAnswerQuestion, OpenEndedQuestion } from '@/components/Quiz';
import { Button } from '@/components/Button';

export default function QuizPage() {
  const [mcqAnswer, setMcqAnswer] = useState<string | undefined>();
  const [multiAnswers, setMultiAnswers] = useState<string[]>([]);
  const [openAnswer, setOpenAnswer] = useState<string>('');

  const mcqOptions = [
    { id: 'a', label: 'By utilizing high-contrast, clinical grid structures and neon highlights.' },
    { id: 'b', label: 'Through intentional white space, rhythmic typography, and a "layered paper" philosophy.' },
    { id: 'c', label: 'By mimicking Skeuomorphic textures like leather and glass precisely.' },
  ];

  const multiOptions = [
    { id: '1', label: 'Asymmetric layout creates visual tension and hierarchy.' },
    { id: '2', label: 'Symmetry is preferred in all modern editorial designs.' },
    { id: '3', label: 'White space guides the reader\'s eye through the composition.' },
    { id: '4', label: 'Typography weight contrast can substitute for color.' },
  ];

  const handleSubmit = () => {
    console.log({ mcqAnswer, multiAnswers, openAnswer });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center py-16 px-6 bg-surface">
      <form
        className="w-full max-w-3xl flex flex-col gap-12"
        onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
      >
        <MultipleChoiceQuestion
          question='How does the "Modern Scholar" aesthetic interpret tactile digital interfaces?'
          options={mcqOptions}
          value={mcqAnswer}
          onChange={setMcqAnswer}
        />

        <div className="h-px bg-outline-variant/10" />

        <MultipleAnswerQuestion
          question="Which principles are central to editorial typography?"
          options={multiOptions}
          values={multiAnswers}
          onChange={setMultiAnswers}
        />

        <div className="h-px bg-outline-variant/10" />

        <OpenEndedQuestion
          question='Describe the role of asymmetry in editorial design layouts.'
          value={openAnswer}
          onChange={setOpenAnswer}
        />

        <div className="flex justify-end pt-4 pb-10">
          <Button type="submit" variant="primary" className="px-10">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
