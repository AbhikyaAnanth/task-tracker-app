import React from 'react';
import { render, screen } from '@testing-library/react';
import FormField from '../FormField';

describe('FormField', () => {
    it('renders label when provided', () => {
        render(
            <FormField label="Username">
                <input />
            </FormField>
        );
        expect(screen.getByText('Username')).toBeInTheDocument();
        expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('renders required indicator when required is true', () => {
        render(
            <FormField label="Password" required>
                <input />
            </FormField>
        );
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders children inside form-input-wrapper', () => {
        render(
            <FormField>
                <input data-testid="child-input" />
            </FormField>
        );
        expect(screen.getByTestId('child-input')).toBeInTheDocument();
    });

    it('renders helpText when provided and no error', () => {
        render(
            <FormField helpText="Enter your email">
                <input />
            </FormField>
        );
        expect(screen.getByText('Enter your email')).toBeInTheDocument();
    });

    it('does not render helpText when error is present', () => {
        render(
            <FormField helpText="Enter your email" error="Invalid email">
                <input />
            </FormField>
        );
        expect(screen.queryByText('Enter your email')).not.toBeInTheDocument();
    });

    it('renders error message and icon when error is present', () => {
        render(
            <FormField error="Required field">
                <input />
            </FormField>
        );
        expect(screen.getByText('Required field')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('alert').querySelector('svg.error-icon')).toBeInTheDocument();
    });

    it('applies has-error class when error is present', () => {
        const { container } = render(
            <FormField error="Error!">
                <input />
            </FormField>
        );
        expect(container.firstChild).toHaveClass('has-error');
    });

    it('applies custom className', () => {
        const { container } = render(
            <FormField className="custom-class">
                <input />
            </FormField>
        );
        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('does not render label if not provided', () => {
        render(
            <FormField>
                <input />
            </FormField>
        );
        expect(screen.queryByText('form-label')).not.toBeInTheDocument();
    });
});