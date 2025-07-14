import React from 'react';
import { render, screen } from '@testing-library/react';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
    it('renders progress label and percentage', () => {
        render(<ProgressBar completed={3} total={10} />);
        expect(screen.getByText('Progress')).toBeInTheDocument();
        expect(screen.getByText('30%')).toBeInTheDocument();
    });

    it('shows correct percentage for completed and total', () => {
        render(<ProgressBar completed={5} total={20} />);
        expect(screen.getByText('25%')).toBeInTheDocument();
    });

    it('shows 0% when total is 0', () => {
        render(<ProgressBar completed={5} total={0} />);
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('shows motivational message for 100%', () => {
        render(<ProgressBar completed={10} total={10} />);
        expect(screen.getByText('All done! Amazing work!')).toBeInTheDocument();
    });

    it('shows motivational message for >=75%', () => {
        render(<ProgressBar completed={8} total={10} />);
        expect(screen.getByText('Almost there! Keep it up!')).toBeInTheDocument();
    });

    it('shows motivational message for >=50%', () => {
        render(<ProgressBar completed={6} total={10} />);
        expect(screen.getByText("Great progress! You're doing awesome!")).toBeInTheDocument();
    });

    it('shows motivational message for >=25%', () => {
        render(<ProgressBar completed={3} total={10} />);
        expect(screen.getByText("Getting started! You've got this!")).toBeInTheDocument();
    });

    it('shows motivational message for <25%', () => {
        render(<ProgressBar completed={1} total={10} />);
        expect(screen.getByText('Ready to tackle your tasks?')).toBeInTheDocument();
    });

    it('sets correct background color for >=80%', () => {
        render(<ProgressBar completed={8} total={10} />);
        const fill = document.querySelector('.progress-bar-fill');
        expect(fill.style.backgroundColor).toBe('var(--success-color, #38a169)');
    });

    it('sets correct background color for >=50%', () => {
        render(<ProgressBar completed={5} total={10} />);
        const fill = document.querySelector('.progress-bar-fill');
        expect(fill.style.backgroundColor).toBe('var(--primary-color, #1a365d)');
    });

    it('sets correct background color for >=25%', () => {
        render(<ProgressBar completed={3} total={10} />);
        const fill = document.querySelector('.progress-bar-fill');
        expect(fill.style.backgroundColor).toBe('var(--warning-color, #ed8936)');
    });

    it('sets correct background color for <25%', () => {
        render(<ProgressBar completed={1} total={10} />);
        const fill = document.querySelector('.progress-bar-fill');
        expect(fill.style.backgroundColor).toBe('var(--error-color, #e53e3e)');
    });
});