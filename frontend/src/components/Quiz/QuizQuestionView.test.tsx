import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizQuestionView } from './QuizQuestionView'
import { Question } from '@/services/formService'
import { AnswerState } from '@/types/quiz'

describe('QuizQuestionView', () => {
  const mockQuestion: Question = {
    id: 1,
    text: 'What is 2 + 2?',
    type: 'multiple_choice',
    choices: [
      { id: 1, text: '3' },
      { id: 2, text: '4' },
      { id: 3, text: '5' },
    ],
  }

  const mockOpenQuestion: Question = {
    id: 2,
    text: 'Explain the water cycle',
    type: 'open_ended',
    choices: [],
  }

  const mockAnswer: AnswerState = {
    singleChoice: undefined,
    multiChoice: [],
    openText: '',
    evalResult: undefined,
    submitted: false,
  }

  const defaultProps = {
    q: mockQuestion,
    ans: mockAnswer,
    currentIndex: 0,
    isLast: false,
    evaluating: false,
    onSetAnswer: jest.fn(),
    onSubmit: jest.fn(),
    onPrev: jest.fn(),
    onNext: jest.fn(),
    onFinish: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render multiple choice question', () => {
    render(<QuizQuestionView {...defaultProps} />)

    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
  })

  it('should render open-ended question', () => {
    render(
      <QuizQuestionView {...defaultProps} q={mockOpenQuestion} />
    )

    expect(screen.getByText('Explain the water cycle')).toBeInTheDocument()
  })

  it('should render previous button disabled on first question', () => {
    const { container } = render(<QuizQuestionView {...defaultProps} />)

    const prevButton = container.querySelector('button[disabled]')
    expect(prevButton).toHaveTextContent('Previous')
  })

  it('should render previous button enabled not on first question', () => {
    const { container } = render(
      <QuizQuestionView {...defaultProps} currentIndex={1} />
    )

    const prevButton = container.querySelector('button:not([disabled])')
    expect(prevButton).toBeInTheDocument()
  })

  it('should call onPrev when previous is clicked', () => {
    const { container } = render(
      <QuizQuestionView {...defaultProps} currentIndex={1} />
    )

    const prevButton = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent.includes('Previous')
    )

    if (prevButton) {
      fireEvent.click(prevButton)
    }

    expect(defaultProps.onPrev).toHaveBeenCalled()
  })

  it('should show Next button when not last question and answer is submitted', () => {
    render(
      <QuizQuestionView
        {...defaultProps}
        ans={{ ...mockAnswer, submitted: true }}
      />
    )

    expect(screen.getByText(/Next/)).toBeInTheDocument()
  })

  it('should show Finish button when last question and answer is submitted', () => {
    render(
      <QuizQuestionView
        {...defaultProps}
        isLast={true}
        ans={{ ...mockAnswer, submitted: true }}
      />
    )

    expect(screen.getByText('Finish Quiz')).toBeInTheDocument()
  })

  it('should show loading animation while evaluating', () => {
    render(
      <QuizQuestionView
        {...defaultProps}
        q={mockOpenQuestion}
        ans={{ ...mockAnswer, submitted: true }}
        evaluating={true}
      />
    )

    expect(screen.getByText('AI is evaluating your answer...')).toBeInTheDocument()
  })

  it('should show evaluation result when available', () => {
    const answerWithResult: AnswerState = {
      ...mockAnswer,
      submitted: true,
      evalResult: {
        is_correct: true,
        score: 0.9,
        feedback: 'Great answer!',
      },
    }

    render(
      <QuizQuestionView
        {...defaultProps}
        q={mockOpenQuestion}
        ans={answerWithResult}
      />
    )

    expect(screen.getByText(/90/)).toBeInTheDocument()
    expect(screen.getByText('Great answer!')).toBeInTheDocument()
  })

  it('should show "Answer recorded" for non-open-ended questions', () => {
    render(
      <QuizQuestionView
        {...defaultProps}
        ans={{ ...mockAnswer, submitted: true }}
      />
    )

    expect(screen.getByText('Answer recorded.')).toBeInTheDocument()
  })

  it('should handle uppercase question types', () => {
    const uppercaseQuestion = {
      ...mockQuestion,
      type: 'MULTIPLE_CHOICE' as string,
    }

    render(<QuizQuestionView {...defaultProps} q={uppercaseQuestion} />)

    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
  })

  it('should handle OPEN type question', () => {
    const openQuestion = {
      ...mockOpenQuestion,
      type: 'OPEN' as string,
    }

    render(<QuizQuestionView {...defaultProps} q={openQuestion} />)

    expect(screen.getByText('Explain the water cycle')).toBeInTheDocument()
  })

  it('should submit form on button click', () => {
    render(<QuizQuestionView {...defaultProps} />)

    const submitButton = screen.getByText('Submit Answer')
    fireEvent.click(submitButton)

    expect(defaultProps.onSubmit).toHaveBeenCalledWith(mockQuestion)
  })

  it('should call onNext when next button is clicked', () => {
    render(
      <QuizQuestionView
        {...defaultProps}
        ans={{ ...mockAnswer, submitted: true }}
      />
    )

    const nextButton = screen.getByText(/Next/)
    fireEvent.click(nextButton)

    expect(defaultProps.onNext).toHaveBeenCalled()
  })

  it('should call onFinish when finish button is clicked', () => {
    render(
      <QuizQuestionView
        {...defaultProps}
        isLast={true}
        ans={{ ...mockAnswer, submitted: true }}
      />
    )

    const finishButton = screen.getByText('Finish Quiz')
    fireEvent.click(finishButton)

    expect(defaultProps.onFinish).toHaveBeenCalled()
  })

  it('should show evaluation error message when service unavailable', () => {
    const answerWithNullResult: AnswerState = {
      ...mockAnswer,
      submitted: true,
      evalResult: null,
    }

    render(
      <QuizQuestionView
        {...defaultProps}
        q={mockOpenQuestion}
        ans={answerWithNullResult}
      />
    )

    expect(
      screen.getByText(/Evaluation service not available/)
    ).toBeInTheDocument()
  })

  it('should display partial score for open-ended questions', () => {
    const answerWithPartialScore: AnswerState = {
      ...mockAnswer,
      submitted: true,
      evalResult: {
        is_correct: false,
        score: 0.5,
        feedback: 'Partially correct',
      },
    }

    render(
      <QuizQuestionView
        {...defaultProps}
        q={mockOpenQuestion}
        ans={answerWithPartialScore}
      />
    )

    expect(screen.getByText(/50/)).toBeInTheDocument()
    expect(screen.getByText('Partially correct')).toBeInTheDocument()
  })
})
