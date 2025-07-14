import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Modal from '../Modal'

describe('Modal', () => {
  const mockOnClose = vi.fn()
  const mockOnConfirm = vi.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
    mockOnConfirm.mockClear()
  })

  test('does not render when isOpen is false', () => {
    render(
      <Modal 
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Modal"
        message="Test message"
      />
    )
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
  })

  test('renders modal when isOpen is true', () => {
    render(
      <Modal 
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Modal"
        message="Test message"
      />
    )
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Test message')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  test('calls onClose when cancel button is clicked', () => {
    render(
      <Modal 
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Modal"
        message="Test message"
      />
    )
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('calls onConfirm when confirm button is clicked', () => {
    render(
      <Modal 
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Modal"
        message="Test message"
      />
    )
    
    const confirmButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(confirmButton)
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })

  test('calls onClose when backdrop is clicked', () => {
    render(
      <Modal 
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Modal"
        message="Test message"
      />
    )
    
    const backdrop = screen.getByText('Test Modal').closest('.modal-backdrop')
    fireEvent.click(backdrop)
    
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('does not call onClose when modal container is clicked', () => {
    render(
      <Modal 
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Modal"
        message="Test message"
      />
    )
    
    const modalContainer = screen.getByText('Test Modal').closest('.modal-container')
    fireEvent.click(modalContainer)
    
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  test('disables confirm button when disabled prop is true', () => {
    render(
      <Modal 
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Modal"
        message="Test message"
        disabled={true}
      />
    )
    
    const confirmButton = screen.getByRole('button', { name: /delete/i })
    expect(confirmButton).toBeDisabled()
  })

  test('uses custom button text when provided', () => {
    render(
      <Modal 
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Test Modal"
        message="Test message"
        confirmText="Confirm Action"
        cancelText="Go Back"
      />
    )
    
    expect(screen.getByRole('button', { name: /confirm action/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument()
  })
})
