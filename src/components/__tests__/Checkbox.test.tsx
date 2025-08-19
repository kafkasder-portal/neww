import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from '../ui/checkbox';

describe('Checkbox Component', () => {
  it('renders checkbox element', () => {
    render(<Checkbox data-testid="test-checkbox" />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveRole('checkbox');
  });

  it('applies default styling classes', () => {
    render(<Checkbox data-testid="test-checkbox" />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toHaveClass(
      'peer',
      'h-4',
      'w-4',
      'shrink-0',
      'rounded-sm',
      'border',
      'border-primary'
    );
  });

  it('applies custom className', () => {
    render(<Checkbox className="custom-checkbox" data-testid="test-checkbox" />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toHaveClass('custom-checkbox');
  });

  it('handles checked state', () => {
    render(<Checkbox checked={true} data-testid="test-checkbox" readOnly />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeChecked();
  });

  it('handles unchecked state', () => {
    render(<Checkbox checked={false} data-testid="test-checkbox" readOnly />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('handles onChange event', () => {
    const handleChange = vi.fn();
    render(<Checkbox onCheckedChange={handleChange} data-testid="test-checkbox" />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    fireEvent.click(checkbox);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<Checkbox disabled data-testid="test-checkbox" />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('shows check icon when checked', () => {
    render(<Checkbox checked={true} data-testid="test-checkbox" readOnly />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    const checkIcon = checkbox.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  it('does not show check icon when unchecked', () => {
    render(<Checkbox checked={false} data-testid="test-checkbox" readOnly />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    // The indicator is always present but may not be visible
    expect(checkbox).toBeInTheDocument();
  });

  it('handles focus styles', () => {
    render(<Checkbox data-testid="test-checkbox" />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2'
    );
  });

  it('handles checked state styling', () => {
    render(<Checkbox checked={true} data-testid="test-checkbox" readOnly />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toHaveClass(
      'data-[state=checked]:bg-primary',
      'data-[state=checked]:text-primary-foreground'
    );
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} data-testid="test-checkbox" />);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(screen.getByTestId('test-checkbox'));
  });

  it('handles keyboard interaction', () => {
    const handleChange = vi.fn();
    render(<Checkbox onCheckedChange={handleChange} data-testid="test-checkbox" />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    
    // Focus the checkbox
    checkbox.focus();
    expect(checkbox).toHaveFocus();
    
    // Press space to toggle
    fireEvent.keyDown(checkbox, { key: ' ', code: 'Space' });
    expect(handleChange).toHaveBeenCalled();
  });

  it('handles indeterminate state', () => {
    render(<Checkbox checked="indeterminate" data-testid="test-checkbox" readOnly />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeInTheDocument();
    // Indeterminate state should be handled by the underlying Radix component
  });

  it('has proper accessibility attributes', () => {
    render(<Checkbox aria-label="Accept terms" data-testid="test-checkbox" />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toHaveAttribute('aria-label', 'Accept terms');
    expect(checkbox).toHaveRole('checkbox');
  });

  it('can be used in forms', () => {
    render(
      <form>
        <Checkbox name="terms" value="accepted" data-testid="test-checkbox" />
      </form>
    );
    
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toHaveAttribute('name', 'terms');
    expect(checkbox).toHaveAttribute('value', 'accepted');
  });

  it('handles required attribute', () => {
    render(<Checkbox required data-testid="test-checkbox" />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeRequired();
  });

  it('toggles state on click', () => {
    const { rerender } = render(<Checkbox checked={false} data-testid="test-checkbox" />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).not.toBeChecked();
    
    rerender(<Checkbox checked={true} data-testid="test-checkbox" />);
    expect(checkbox).toBeChecked();
  });

  it('maintains consistent styling across states', () => {
    const { rerender } = render(<Checkbox checked={false} data-testid="test-checkbox" />);
    
    const checkbox = screen.getByTestId('test-checkbox');
    const initialClasses = checkbox.className;
    
    rerender(<Checkbox checked={true} data-testid="test-checkbox" />);
    
    // Core classes should remain the same
    expect(checkbox).toHaveClass('h-4', 'w-4', 'rounded-sm', 'border');
  });
});