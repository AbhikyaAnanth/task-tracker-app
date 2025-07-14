import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import TaskForm from '../TaskForm'
import ToastProvider from '../ToastProvider'

// Mock the validation utility
vi.mock('../../utils/validation', () => ({
  validateTaskTitle: vi.fn((title) => {
    if (!title || !title.trim()) return 'Task title is required'
    if (title.length > 40) return 'Task title cannot exceed 40 characters'
    return null
  }),
  validateTaskDescription: vi.fn((description) => {
    if (description && description.length > 500) return 'Task description cannot exceed 500 characters'
    return null
  })
}))

const renderWithProviders = (component) => {
  return render(
    <ToastProvider>
      {component}
    </ToastProvider>
  )
}

describe('TaskForm', () => {
  const mockAddTask = vi.fn()

  beforeEach(() => {
    mockAddTask.mockClear()
  })

  test('renders task form with input and button', () => {
    renderWithProviders(<TaskForm addTask={mockAddTask} />)
    
    expect(screen.getByPlaceholderText('Enter your task title...')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Add a description (optional)...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument()
  })

  test('updates input value when user types', () => {
    renderWithProviders(<TaskForm addTask={mockAddTask} />)
    
    const input = screen.getByPlaceholderText('Enter your task title...')
    fireEvent.change(input, { target: { value: 'New task' } })
    
    expect(input.value).toBe('New task')
  })

  test('calls addTask when form is submitted with valid input', async () => {
    renderWithProviders(<TaskForm addTask={mockAddTask} />)
    
    const input = screen.getByPlaceholderText('Enter your task title...')
    const button = screen.getByRole('button', { name: /add task/i })
    
    fireEvent.change(input, { target: { value: 'New task' } })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(mockAddTask).toHaveBeenCalledWith({ title: 'New task', description: '' })
    })
  })

  test('shows error when task title exceeds 40 characters', () => {
    renderWithProviders(<TaskForm addTask={mockAddTask} />)
    
    const input = screen.getByPlaceholderText('Enter your task title...')
    const longTitle = 'a'.repeat(41)
    
    fireEvent.change(input, { target: { value: longTitle } })
    fireEvent.click(screen.getByRole('button', { name: /add task/i }))
    
    expect(screen.getByText('Task title cannot exceed 40 characters')).toBeInTheDocument()
    expect(mockAddTask).not.toHaveBeenCalled()
  })

  test('shows character count warning when approaching title limit', () => {
    renderWithProviders(<TaskForm addTask={mockAddTask} />)
    
    const input = screen.getByPlaceholderText('Enter your task title...')
    const nearLimitTitle = 'a'.repeat(36)
    
    fireEvent.change(input, { target: { value: nearLimitTitle } })
    
    const charCount = screen.getByText('36/40 characters')
    expect(charCount).toHaveClass('warning')
  })

  test('disables submit button when input is empty', () => {
    renderWithProviders(<TaskForm addTask={mockAddTask} />)
    
    const button = screen.getByRole('button', { name: /add task/i })
    expect(button).toBeDisabled()
  })

  test('enables submit button when input has content', () => {
    renderWithProviders(<TaskForm addTask={mockAddTask} />)
    
    const input = screen.getByPlaceholderText('Enter your task title...')
    const button = screen.getByRole('button', { name: /add task/i })
    
    fireEvent.change(input, { target: { value: 'New task' } })
    
    expect(button).not.toBeDisabled()
  })

  test('handles description input correctly', () => {
    renderWithProviders(<TaskForm addTask={mockAddTask} />)
    
    const titleInput = screen.getByPlaceholderText('Enter your task title...')
    const descriptionInput = screen.getByPlaceholderText('Add a description (optional)...')
    
    fireEvent.change(titleInput, { target: { value: 'Test task' } })
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } })
    
    expect(titleInput.value).toBe('Test task')
    expect(descriptionInput.value).toBe('Test description')
  })
})
