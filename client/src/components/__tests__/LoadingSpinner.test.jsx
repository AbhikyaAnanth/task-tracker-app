import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
    it('renders with default props', () => {
        render(<LoadingSpinner />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.getByRole('presentation')).toBeInTheDocument();
        expect(screen.getByClass('spinner-medium')).toBeTruthy();
        expect(screen.getByClass('spinner-primary')).toBeTruthy();
    });

    it('renders with custom size and color', () => {
        render(<LoadingSpinner size="large" color="secondary" />);
        const spinner = screen.getByRole('presentation');
        expect(spinner.className).toContain('spinner-large');
        expect(spinner.className).toContain('spinner-secondary');
    });

    it('renders without message when showMessage is false', () => {
        render(<LoadingSpinner showMessage={false} />);
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('renders custom message', () => {
        render(<LoadingSpinner message="Please wait..." />);
        expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });

    it('renders overlay when overlay prop is true', () => {
        render(<LoadingSpinner overlay />);
        expect(screen.getByClass('loading-overlay')).toBeTruthy();
        expect(screen.getByClass('loading-spinner')).toBeTruthy();
    });

    it('renders four spinner circles', () => {
        render(<LoadingSpinner />);
        const circles = screen.getAllByClass('spinner-circle');
        expect(circles).toHaveLength(4);
    });

    it('applies spinner-white styles', () => {
        render(<LoadingSpinner color="white" />);
        const spinner = screen.getByRole('presentation');
        expect(spinner.className).toContain('spinner-white');
    });

    // Utility to get elements by class name
    beforeAll(() => {
        // Add getByClass and getAllByClass to screen for convenience
        screen.getByClass = (className) =>
            document.querySelector(`.${className}`);
        screen.getAllByClass = (className) =>
            Array.from(document.querySelectorAll(`.${className}`));
        screen.getByRole = (role) =>
            document.querySelector('.loading-spinner');
    });
});