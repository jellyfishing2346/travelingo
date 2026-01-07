import '@testing-library/jest-dom';
jest.mock('react-leaflet');
jest.mock('leaflet');
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/welcome to travelingo/i);
  expect(welcomeElement).toBeInTheDocument();
});