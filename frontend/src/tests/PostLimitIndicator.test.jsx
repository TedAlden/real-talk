import { render, screen } from '@testing-library/react';
import PostLimitIndicator from '../components/PostLimitIndicator';

describe('PostLimitIndicator Component', () => {
  test('renders with correct post count and limit', () => {
    render(<PostLimitIndicator postCount={3} limit={5} />);
    
    expect(screen.getByText('Daily Post Limit')).toBeInTheDocument();
    expect(screen.getByText('3 / 5')).toBeInTheDocument();
  });
  
  test('shows loading state when isLoading is true', () => {
    render(<PostLimitIndicator postCount={0} limit={5} isLoading={true} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  test('displays warning when limit is reached', () => {
    render(<PostLimitIndicator postCount={5} limit={5} />);
    
    expect(screen.getByText("You've reached your daily post limit")).toBeInTheDocument();
  });
  
  test('uses green color for progress bar when below 75%', () => {
    render(<PostLimitIndicator postCount={3} limit={5} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('bg-green-500');
  });
  
  test('uses yellow color for progress bar when above 75%', () => {
    render(<PostLimitIndicator postCount={4} limit={5} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('bg-yellow-500');
  });
  
  test('uses red color for progress bar when at limit', () => {
    render(<PostLimitIndicator postCount={5} limit={5} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('bg-red-500');
  });
  
  test('sets correct aria values for accessibility', () => {
    render(<PostLimitIndicator postCount={3} limit={5} />);
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '3');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '5');
  });
}); 