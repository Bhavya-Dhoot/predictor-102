import { render, screen } from '@testing-library/react';
import PredictionCard from '../components/PredictionCard';
describe('PredictionCard', () => {
  it('renders loading', () => {
    render(<PredictionCard prediction="" loading />);
    expect(screen.getByText(/loading prediction/i)).toBeInTheDocument();
  });
  it('renders error', () => {
    render(<PredictionCard prediction="" error="Oops" />);
    expect(screen.getByText(/oops/i)).toBeInTheDocument();
  });
  it('renders parsed JSON', () => {
    render(<PredictionCard prediction="{\"foo\":\"bar\"}" />);
    expect(screen.getByText(/foo/i)).toBeInTheDocument();
    expect(screen.getByText(/bar/i)).toBeInTheDocument();
  });
});
