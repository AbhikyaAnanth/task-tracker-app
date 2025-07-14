import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import TaskItem from '../TaskItem'

const mockTask = {
  _id: '123',
  title: 'Test Task',
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

describe('TaskItem', () => {
  const mockOnUpdate = vi.fn()
  const mockOnDeleteRequest = vi.fn()

  beforeEach(() => {
    mockOnUpdate.mockClear()
    mockOnDeleteRequest.mockClear()
  })

  test('renders task item with title and actions', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={mockOnUpdate} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    )
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  test('displays checkbox as unchecked for incomplete task', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={mockOnUpdate} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
  })

  test('displays checkbox as checked for completed task', () => {
    const completedTask = { ...mockTask, completed: true }
    
    render(
      <TaskItem 
        task={completedTask} 
        onUpdate={mockOnUpdate} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    )
    
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  test('enters edit mode when edit button is clicked', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={mockOnUpdate} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    )
    
    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)
    
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  test('calls onDeleteRequest when delete button is clicked', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={mockOnUpdate} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    )
    
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    
    expect(mockOnDeleteRequest).toHaveBeenCalledWith(mockTask)
  })

  test('shows creation timestamp', () => {
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={mockOnUpdate} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    )
    
    expect(screen.getByText(/created/i)).toBeInTheDocument()
  })

  test('applies completed class when task is completed', () => {
    const completedTask = { ...mockTask, completed: true }
    
    render(
      <TaskItem 
        task={completedTask} 
        onUpdate={mockOnUpdate} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    )
    
    const taskElement = screen.getByText('Test Task').closest('.task-item')
    expect(taskElement).toHaveClass('completed')
  })
})
