import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

test('sanity check', () => {
  render(<div>hello</div>);
  expect(screen.getByText('hello')).toBeInTheDocument();
});
