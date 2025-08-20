import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button, Card, CardHeader, CardTitle, CardContent, FormLabel, FormInput } from '../components/ui/corporate/CorporateComponents'

expect.extend(toHaveNoViolations)

describe('Accessibility Tests', () => {
  it('Button component should have no accessibility violations', async () => {
    const { container } = render(
      <Button>Accessible Button</Button>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Input component should have no accessibility violations', async () => {
    const { container } = render(
      <FormInput aria-label="Test input" />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Card component should have no accessibility violations', async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
      </Card>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Form elements should have proper labels', async () => {
    const { container } = render(
      <form>
        <FormLabel htmlFor="name">Name:</FormLabel>
        <FormInput id="name" name="name" />
        <Button type="submit">Submit</Button>
      </form>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Interactive elements should be keyboard accessible', async () => {
    const { container } = render(
      <div>
        <Button tabIndex={0}>Clickable Button</Button>
        <FormInput tabIndex={0} />
      </div>
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
