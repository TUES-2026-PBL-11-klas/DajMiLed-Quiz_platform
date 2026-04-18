import { renderHook, act, waitFor } from '@testing-library/react'
import { useQuiz } from './useQuiz'
import * as formService from '@/services/formService'
import * as submissionService from '@/services/submissionService'

jest.mock('@/services/formService')
jest.mock('@/services/submissionService')

describe('useQuiz', () => {
  const mockFormData = {
    id: 1,
    title: 'Test Quiz',
    context: 'Test context',
    questions: [
      {
        id: 1,
        text: 'Question 1',
        type: 'multiple_choice',
        choices: [
          { id: 1, text: 'Option 1' },
          { id: 2, text: 'Option 2' },
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

  beforeEach(() => {
    jest.clearAllMocks()
    ;(formService.formService.getFormById as jest.Mock).mockResolvedValue({
      data: mockFormData,
    })
  })

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useQuiz('1'))
    expect(result.current.loading).toBe(true)
  })

  it('should load form data successfully', async () => {
    const { result } = renderHook(() => useQuiz('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.form).toEqual(mockFormData)
    expect(result.current.error).toBe('')
  })

  it('should handle form loading errors', async () => {
    ;(formService.formService.getFormById as jest.Mock).mockRejectedValue(
      new Error('Quiz not found')
    )

    const { result } = renderHook(() => useQuiz('99'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Quiz not found or server is unavailable.')
  })

  it('should handle invalid quiz ID', async () => {
    const { result } = renderHook(() => useQuiz('not-a-number'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Invalid quiz ID.')
  })

  it('should track current question index', async () => {
    const { result } = renderHook(() => useQuiz('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.currentIndex).toBe(0)

    act(() => {
      result.current.setCurrentIndex(1)
    })

    expect(result.current.currentIndex).toBe(1)
  })

  it('should get and set answers', async () => {
    const { result } = renderHook(() => useQuiz('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const initialAnswer = result.current.getAnswer(1)
    expect(initialAnswer.submitted).toBe(false)
    expect(initialAnswer.singleChoice).toBeUndefined()

    act(() => {
      result.current.setAnswer(1, { singleChoice: '2' })
    })

    const updatedAnswer = result.current.getAnswer(1)
    expect(updatedAnswer.singleChoice).toBe('2')
  })

  it('should submit quiz and call submission service', async () => {
    const mockSubmissionResult = {
      submissionId: 123,
      totalScore: 0.75,
      results: [
        { questionId: 1, isCorrect: true, score: 1.0 },
        { questionId: 2, isCorrect: false, score: 0.5 },
      ],
    }

    ;(submissionService.submissionService.submit as jest.Mock).mockResolvedValue({
      data: mockSubmissionResult,
    })

    const { result } = renderHook(() => useQuiz('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.setAnswer(1, { singleChoice: '1' })
      result.current.setAnswer(2, { openText: 'Test answer' })
    })

    act(() => {
      result.current.submitQuiz(1, mockFormData.questions)
    })

    await waitFor(() => {
      expect(result.current.allDone).toBe(true)
    })

    expect(submissionService.submissionService.submit).toHaveBeenCalled()
  })

  it('should handle submission errors gracefully', async () => {
    ;(submissionService.submissionService.submit as jest.Mock).mockRejectedValue(
      new Error('Submission failed')
    )

    const { result } = renderHook(() => useQuiz('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.submitQuiz(1, mockFormData.questions)
    })

    await waitFor(() => {
      expect(result.current.allDone).toBe(true)
    })
  })

  it('should format answers correctly for submission', async () => {
    ;(submissionService.submissionService.submit as jest.Mock).mockResolvedValue({
      data: { submissionId: 123, totalScore: 1.0, results: [] },
    })

    const { result } = renderHook(() => useQuiz('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    act(() => {
      result.current.setAnswer(1, { singleChoice: '2' })
      result.current.setAnswer(2, { openText: 'My answer' })
    })

    act(() => {
      result.current.submitQuiz(1, mockFormData.questions)
    })

    await waitFor(() => {
      expect(submissionService.submissionService.submit).toHaveBeenCalledWith(
        expect.objectContaining({
          formId: 1,
          answers: expect.arrayContaining([
            { questionId: 1, selectedChoiceId: 2 },
            { questionId: 2, answerText: 'My answer' },
          ]),
        })
      )
    })
  })
})
