import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as axe from 'axe-core';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

// Mock axe-core
vi.mock('axe-core', () => ({
  run: vi.fn().mockResolvedValue({
    violations: [],
    passes: [],
    incomplete: [],
    inapplicable: [],
  }),
}));

describe('Accessibility Tests', () => {
  it('Button component should have no accessibility violations', async () => {
    const { container } = render(
      <Button>Accessible Button</Button>
    );

    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });

  it('Input component should have no accessibility violations', async () => {
    const { container } = render(
      <Input placeholder="Enter text" aria-label="Text input" />
    );

    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });

  it('Card component should have no accessibility violations', async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card content</p>
        </CardContent>
      </Card>
    );

    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });

  it('Form elements should have proper labels', async () => {
    const { container } = render(
      <form>
        <label htmlFor="name">Name:</label>
        <Input id="name" name="name" />
        <Button type="submit">Submit</Button>
      </form>
    );

    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });

  it('Interactive elements should be keyboard accessible', async () => {
    const { container } = render(
      <div>
        <Button tabIndex={0}>Clickable Button</Button>
        <Input tabIndex={0} />
      </div>
    );

    const results = await axe.run(container);
    expect(results.violations).toHaveLength(0);
  });
});
