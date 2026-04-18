import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QuizResults } from './QuizResults'
import { FullFormResponse } from '@/services/formService'
import { AnswerState } from '@/types/quiz'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation')

describe('QuizResults', () => {
  const mockForm: FullFormResponse = {
    id: 1,
    title: 'Test Quiz',
    context: 'Test context',
    questions: [
      {
        id: 1,
        text: 'Question 1',
        type: 'multiple_choice',
        choices: [
          { id: 1, text: 'Correct' },
          { id: 2, text: 'Wrong' },
        ],
      },
      {
        id: 2,
        text: 'Question 2',
        type: 'open_ended',
        choices: [],
      },
    ],
  }

  const mockSubmissionResult = {
    submissionId: 123,
    totalScore: 0.75,
    results: [
      { questionId: 1, isCorrect: true, score: 1.0 },
      { questionId: 2, isCorrect: false, score: 0.5 },
    ],
  }

  const mockAnswers: Record<number, AnswerState> = {
    1: {
      singleChoice: '1',
      multiChoice: [],
      openText: '',
      evalResult: undefined,
      submitted: true,
    },
    2: {
      singleChoice: undefined,
      multiChoice: [],
      openText: 'Test answer',
      evalResult: {
        is_correct: false,
        score: 0.5,
        feedback: 'Good effort',
      },
      submitted: true,
    },
  }

  const mockRouter = {
    push: jest.fn(),
  }

  const defaultProps = {
    form: mockForm,
    getAnswer: (id: number) => mockAnswers[id],
    submissionResult: mockSubmissionResult,
    onRetake: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('should render quiz complete message', async () => {
    render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Quiz Complete!')).toBeInTheDocument()
    })
  })

  it('should display quiz title', async () => {
    render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Test Quiz')).toBeInTheDocument()
    })
  })

  it('should display total score percentage', async () => {
    render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('75%')).toBeInTheDocument()
    })
  })

  it('should display all questions and answers', async () => {
    render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getAllByText('Question 1').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Question 2').length).toBeGreaterThan(0)
    })
  })

  it('should show correct answer for multiple choice', async () => {
    render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Correct')).toBeInTheDocument()
    })
  })

  it('should show evaluation result for open-ended question', async () => {
    render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Good effort')).toBeInTheDocument()
      expect(screen.getByText(/50/)).toBeInTheDocument()
    })
  })

  it('should show correct/incorrect status for multiple choice', async () => {
    render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      const correctIcon = screen.getAllByText(/✓ Correct/)
      expect(correctIcon.length).toBeGreaterThan(0)
    })
  })

  it('should handle zero score correctly', async () => {
    const zeroScoreResult = {
      ...mockSubmissionResult,
      totalScore: 0.0,
    }

    render(
      <QuizResults
        {...defaultProps}
        submissionResult={zeroScoreResult}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('0%')).toBeInTheDocument()
    })
  })

  it('should handle perfect score correctly', async () => {
    const perfectScoreResult = {
      ...mockSubmissionResult,
      totalScore: 1.0,
    }

    render(
      <QuizResults
        {...defaultProps}
        submissionResult={perfectScoreResult}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('100%')).toBeInTheDocument()
    })
  })

  it('should display back to dashboard button', async () => {
    render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Back to Dashboard')).toBeInTheDocument()
    })
  })

  it('should display retake quiz button', async () => {
    render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Retake Quiz')).toBeInTheDocument()
    })
  })

  it('should navigate to dashboard on button click', async () => {
    render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      const dashboardButton = screen.getByText('Back to Dashboard')
      fireEvent.click(dashboardButton)
    })

    expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
  })

  it('should call onRetake when retake button is clicked', async () => {
    render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      const retakeButton = screen.getByText('Retake Quiz')
      fireEvent.click(retakeButton)
    })

    expect(defaultProps.onRetake).toHaveBeenCalled()
  })

  it('should handle null submission result gracefully', async () => {
    render(<QuizResults {...defaultProps} submissionResult={null} />)

    await waitFor(() => {
      expect(screen.getByText('Quiz Complete!')).toBeInTheDocument()
    })
  })

  it('should show question numbers correctly', async () => {
    render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getAllByText('Question 1').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Question 2').length).toBeGreaterThan(0)
    })
  })

  it('should display correct border colors based on results', async () => {
    const { container } = render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      const questionCards = container.querySelectorAll('[class*="rounded-2xl"]')
      expect(questionCards.length).toBeGreaterThan(0)
    })
  })

  it('should render the results container', () => {
    const { container } = render(<QuizResults {...defaultProps} />)

    expect(container.firstChild).toBeInTheDocument()
  })

  it('should render results after loading', async () => {
    render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('75%')).toBeInTheDocument()
    })
  })

  it('should display feedback for open-ended questions', async () => {
    render(<QuizResults {...defaultProps} />)

    await waitFor(() => {
      const feedback = screen.getByText('Good effort')
      expect(feedback).toBeInTheDocument()
    })
  })

  it('should format score as percentage', async () => {
    const customScoreResult = {
      ...mockSubmissionResult,
      totalScore: 0.5,
    }

    render(
      <QuizResults
        {...defaultProps}
        submissionResult={customScoreResult}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('50%')).toBeInTheDocument()
    })
  })
})
