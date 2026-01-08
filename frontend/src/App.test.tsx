
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';
jest.mock('react-leaflet');
jest.mock('leaflet');

test('renders welcome message', () => {
  render(<App />);
  const welcomeElement = screen.getByText(/welcome to travelingo/i);
  expect(welcomeElement).toBeInTheDocument();
});