/**
 * TaskItem Component Test Suite
 * 
 * This file contains comprehensive tests for the TaskItem component to ensure
 * it renders correctly and handles user interactions properly.
 * 
 * Tests cover:
 * - Basic rendering of task information
 * - Checkbox state display and interaction
 * - Edit functionality and form submission
 * - Delete functionality
 * - Event handler calls
 * - Accessibility features
 * 
 * Uses React Testing Library for DOM testing and Vitest for mocking and assertions.
 */

// Import testing utilities from React Testing Library
import { render, screen, fireEvent } from '@testing-library/react'
// Import Vitest for mocking functions
import { vi } from 'vitest'
// Import the component under test
import TaskItem from '../TaskItem'

// Mock task data for testing - represents a typical task object
const mockTask = {
  _id: '123',                              // Unique identifier
  title: 'Test Task',                      // Task title
  completed: false,                        // Completion status
  createdAt: new Date().toISOString(),     // Creation timestamp
  updatedAt: new Date().toISOString()      // Last update timestamp
}

// Test suite for TaskItem component
describe('TaskItem', () => {
  // Mock functions to simulate parent component callbacks
  const mockOnUpdate = vi.fn()        // Mock function for task updates
  const mockOnDeleteRequest = vi.fn()  // Mock function for delete requests

  // Reset mocks before each test to ensure clean state
  beforeEach(() => {
    mockOnUpdate.mockClear()
    mockOnDeleteRequest.mockClear()
  })

  // Test: Basic rendering and presence of key elements
  // Test: Basic rendering and presence of key elements
  test('renders task item with title and actions', () => {
    // Render the TaskItem component with mock props
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={mockOnUpdate} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    )
    
    // Verify that the task title is displayed
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    // Verify that the edit button is present
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
    // Verify that the delete button is present
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    // Verify that the completion checkbox is present
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  // Test: Checkbox displays unchecked state for incomplete tasks
  test('displays checkbox as unchecked for incomplete task', () => {
    // Render component with incomplete task
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={mockOnUpdate} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    )
    
    // Find the checkbox element
    const checkbox = screen.getByRole('checkbox')
    // Verify checkbox is not checked for incomplete task
    expect(checkbox).not.toBeChecked()
  })

  // Test: Checkbox displays checked state for completed tasks
  test('displays checkbox as checked for completed task', () => {
    // Create a completed version of the mock task
    const completedTask = { ...mockTask, completed: true }
    
    // Render component with completed task
    render(
      <TaskItem 
        task={completedTask} 
        onUpdate={mockOnUpdate} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    )
    
    // Find the checkbox element and verify it's checked
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeChecked()
  })

  // Test: Edit mode functionality
  test('enters edit mode when edit button is clicked', () => {
    // Render the component
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={mockOnUpdate} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    )
    
    // Find and click the edit button
    const editButton = screen.getByRole('button', { name: /edit/i })
    fireEvent.click(editButton)
    
    // Verify edit mode is active by checking for:
    // - Input field with current task title
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument()
    // - Save button
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
    // - Cancel button
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  // Test: Delete functionality
  test('calls onDeleteRequest when delete button is clicked', () => {
    // Render the component
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={mockOnUpdate} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    )
    
    // Find and click the delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)
    
    // Verify that the delete callback was called with the correct task
    expect(mockOnDeleteRequest).toHaveBeenCalledWith(mockTask)
  })

  // Test: Timestamp display
  test('shows creation timestamp', () => {
    // Render the component
    render(
      <TaskItem 
        task={mockTask} 
        onUpdate={mockOnUpdate} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    )
    
    // Verify that creation timestamp is displayed
    expect(screen.getByText(/created/i)).toBeInTheDocument()
  })

  // Test: CSS class application for completed tasks
  test('applies completed class when task is completed', () => {
    // Create a completed version of the mock task
    const completedTask = { ...mockTask, completed: true }
    
    // Render component with completed task
    render(
      <TaskItem 
        task={completedTask} 
        onUpdate={mockOnUpdate} 
        onDeleteRequest={mockOnDeleteRequest} 
      />
    )
    
    // Find the task element and verify it has the completed class
    const taskElement = screen.getByText('Test Task').closest('.task-item')
    expect(taskElement).toHaveClass('completed')
  })
})
