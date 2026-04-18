import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

export const mockFormData = {
  id: 1,
  title: 'Sample Quiz',
  context: 'This is a sample quiz for testing purposes',
  questions: [
    {
      id: 1,
      text: 'What is the capital of France?',
      type: 'multiple_choice',
      choices: [
        { id: 1, text: 'Paris' },
        { id: 2, text: 'Lyon' },
        { id: 3, text: 'Marseille' },
      ],
    },
    {
      id: 2,
      text: 'Explain photosynthesis',
      type: 'open_ended',
      choices: [],
    },
  ],
}

export const mockSubmissionResult = {
  submissionId: 1,
  totalScore: 0.85,
  results: [
    { questionId: 1, isCorrect: true, score: 1.0 },
    { questionId: 2, isCorrect: false, score: 0.7 },
  ],
}

export const mockAnswers = {
  1: {
    singleChoice: '1',
    multiChoice: [],
    openText: '',
    evalResult: undefined,
    submitted: false,
  },
  2: {
    singleChoice: undefined,
    multiChoice: [],
    openText: 'Photosynthesis is the process...',
    evalResult: {
      is_correct: false,
      score: 0.7,
      feedback: 'Good start but missing details',
    },
    submitted: true,
  },
}
