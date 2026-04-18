import { renderHook, act, waitFor } from '@testing-library/react'
import { useCreateForm } from './useCreateForm'
import * as formService from '@/services/formService'
import * as questionService from '@/services/questionService'
import * as choiceService from '@/services/choiceService'
import { useRouter } from 'next/navigation'

jest.mock('@/services/formService')
jest.mock('@/services/questionService')
jest.mock('@/services/choiceService')
jest.mock('next/navigation')

describe('useCreateForm', () => {
  const mockRouter = {
    push: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useCreateForm())

    expect(result.current.title).toBe('')
    expect(result.current.context).toBe('')
    expect(result.current.questions.length).toBe(1)
    expect(result.current.saving).toBe(false)
    expect(result.current.error).toBe('')
  })

  it('should update title', () => {
    const { result } = renderHook(() => useCreateForm())

    act(() => {
      result.current.setTitle('New Quiz')
    })

    expect(result.current.title).toBe('New Quiz')
  })

  it('should update context', () => {
    const { result } = renderHook(() => useCreateForm())

    act(() => {
      result.current.setContext('This is a test context for the quiz')
    })

    expect(result.current.context).toBe('This is a test context for the quiz')
  })

  it('should add a new question', () => {
    const { result } = renderHook(() => useCreateForm())

    expect(result.current.questions.length).toBe(1)

    act(() => {
      result.current.addQuestion()
    })

    expect(result.current.questions.length).toBe(2)
  })

  it('should remove a question', () => {
    const { result } = renderHook(() => useCreateForm())

    act(() => {
      result.current.addQuestion()
    })

    expect(result.current.questions.length).toBe(2)

    const firstQuestionId = result.current.questions[0].id

    act(() => {
      result.current.removeQuestion(firstQuestionId)
    })

    expect(result.current.questions.length).toBe(1)
  })

  it('should update question text', () => {
    const { result } = renderHook(() => useCreateForm())

    const questionId = result.current.questions[0].id

    act(() => {
      result.current.updateQuestion(questionId, { text: 'Updated question?' })
    })

    expect(result.current.questions[0].text).toBe('Updated question?')
  })

  it('should change question type and reset choices', () => {
    const { result } = renderHook(() => useCreateForm())

    const questionId = result.current.questions[0].id

    act(() => {
      result.current.changeType(questionId, 'open_ended')
    })

    expect(result.current.questions[0].type).toBe('open_ended')
    expect(result.current.questions[0].choices.length).toBe(0)
  })

  it('should add a choice to a question', () => {
    const { result } = renderHook(() => useCreateForm())

    const questionId = result.current.questions[0].id

    act(() => {
      result.current.addChoice(questionId)
    })

    expect(result.current.questions[0].choices.length).toBe(2)
  })

  it('should remove a choice from a question', () => {
    const { result } = renderHook(() => useCreateForm())

    const questionId = result.current.questions[0].id
    const choiceId = result.current.questions[0].choices[0].id

    act(() => {
      result.current.removeChoice(questionId, choiceId)
    })

    expect(result.current.questions[0].choices.length).toBe(0)
  })

  it('should update choice text', () => {
    const { result } = renderHook(() => useCreateForm())

    const questionId = result.current.questions[0].id
    const choiceId = result.current.questions[0].choices[0].id

    act(() => {
      result.current.updateChoice(questionId, choiceId, 'Option A')
    })

    expect(result.current.questions[0].choices[0].text).toBe('Option A')
  })

  it('should validate empty title', async () => {
    const { result } = renderHook(() => useCreateForm())

    act(() => {
      result.current.setContext('Valid context that is long enough')
    })

    act(() => {
      result.current.handleSave()
    })

    expect(result.current.error).toBe('Please enter a quiz title.')
  })

  it('should validate empty context', async () => {
    const { result } = renderHook(() => useCreateForm())

    act(() => {
      result.current.setTitle('Valid Title')
    })

    act(() => {
      result.current.handleSave()
    })

    expect(result.current.error).toBe('Please enter a quiz context/description.')
  })

  it('should validate context minimum length', async () => {
    const { result } = renderHook(() => useCreateForm())

    act(() => {
      result.current.setTitle('Title')
      result.current.setContext('Short')
    })

    act(() => {
      result.current.handleSave()
    })

    expect(result.current.error).toBe('Context must be at least 30 characters long.')
  })

  it('should validate at least one question', async () => {
    const { result } = renderHook(() => useCreateForm())

    act(() => {
      result.current.setTitle('Title')
      result.current.setContext('This is a valid context that has more than 30 characters')
      const questionId = result.current.questions[0].id
      result.current.removeQuestion(questionId)
    })

    act(() => {
      result.current.handleSave()
    })

    expect(result.current.error).toBe('Add at least one question.')
  })

  it('should validate question text', async () => {
    const { result } = renderHook(() => useCreateForm())

    act(() => {
      result.current.setTitle('Title')
      result.current.setContext('This is a valid context that has more than 30 characters')
    })

    act(() => {
      result.current.handleSave()
    })

    expect(result.current.error).toBe('All questions must have text.')
  })

  it('should validate multiple choice needs at least 2 options', async () => {
    const { result } = renderHook(() => useCreateForm())

    const questionId = result.current.questions[0].id

    act(() => {
      result.current.setTitle('Title')
      result.current.setContext('This is a valid context that has more than 30 characters')
      result.current.updateQuestion(questionId, { text: 'Question?' })
    })

    act(() => {
      result.current.handleSave()
    })

    expect(result.current.error).toBe('Multiple choice questions need at least 2 answer options.')
  })

  it('should save quiz successfully', async () => {
    ;(formService.formService.createForm as jest.Mock).mockResolvedValue({
      data: 123,
    })
    ;(questionService.questionService.createQuestion as jest.Mock).mockResolvedValue({
      data: 1,
    })
    ;(choiceService.choiceService.createChoice as jest.Mock).mockResolvedValue({
      data: 1,
    })

    const { result } = renderHook(() => useCreateForm())

    const questionId = result.current.questions[0].id
    const choiceId = result.current.questions[0].choices[0].id

    act(() => {
      result.current.setTitle('Valid Title')
      result.current.setContext('This is a valid context that has more than 30 characters')
      result.current.updateQuestion(questionId, { text: 'Question 1?' })
      result.current.updateChoice(questionId, choiceId, 'Option 1')
      result.current.addChoice(questionId)
    })

    act(() => {
      const newChoiceId = result.current.questions[0].choices[1].id
      result.current.updateChoice(questionId, newChoiceId, 'Option 2')
    })

    act(() => {
      result.current.handleSave()
    })

    await waitFor(() => {
      expect(result.current.saving).toBe(false)
    })

    expect(formService.formService.createForm).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith('/quiz/123')
  })

  it('should handle save errors', async () => {
    ;(formService.formService.createForm as jest.Mock).mockRejectedValue(
      new Error('Failed to create form')
    )

    const { result } = renderHook(() => useCreateForm())

    const questionId = result.current.questions[0].id
    const choiceId = result.current.questions[0].choices[0].id

    act(() => {
      result.current.setTitle('Valid Title')
      result.current.setContext('This is a valid context that has more than 30 characters')
      result.current.updateQuestion(questionId, { text: 'Question 1?' })
      result.current.updateChoice(questionId, choiceId, 'Option 1')
      result.current.addChoice(questionId)
    })

    act(() => {
      const newChoiceId = result.current.questions[0].choices[1].id
      result.current.updateChoice(questionId, newChoiceId, 'Option 2')
    })

    act(() => {
      result.current.handleSave()
    })

    await waitFor(() => {
      expect(result.current.saving).toBe(false)
    })

    expect(result.current.error).toContain('Failed to create form')
  })
})
