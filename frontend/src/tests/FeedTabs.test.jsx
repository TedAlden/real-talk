import { render, screen, fireEvent } from '@testing-library/react';
import FeedTabs from '../components/FeedTabs';

describe('FeedTabs Component', () => {
  test('renders all tabs', () => {
    render(<FeedTabs activeTab="following" onTabChange={() => {}} />);
    
    expect(screen.getByText('Following')).toBeInTheDocument();
    expect(screen.getByText('Trending')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });
  
  test('marks active tab correctly', () => {
    render(<FeedTabs activeTab="trending" onTabChange={() => {}} />);
    
    // Check that the trending tab has the active class
    const trendingTab = screen.getByText('Trending');
    expect(trendingTab.closest('button')).toHaveClass('border-blue-600');
    
    // Check that other tabs don't have active class
    const followingTab = screen.getByText('Following');
    expect(followingTab.closest('button')).toHaveClass('border-transparent');
  });
  
  test('calls onTabChange with correct tab id when clicked', () => {
    const mockOnTabChange = jest.fn();
    render(<FeedTabs activeTab="following" onTabChange={mockOnTabChange} />);
    
    // Click on the Trending tab
    fireEvent.click(screen.getByText('Trending'));
    
    // Check that the callback was called with 'trending'
    expect(mockOnTabChange).toHaveBeenCalledWith('trending');
    
    // Click on the All tab
    fireEvent.click(screen.getByText('All'));
    
    // Check that the callback was called with 'all'
    expect(mockOnTabChange).toHaveBeenCalledWith('all');
  });
  
  test('sets correct aria-selected attribute for accessibility', () => {
    render(<FeedTabs activeTab="following" onTabChange={() => {}} />);
    
    // The Following tab should have aria-selected="true"
    const followingTab = screen.getByText('Following');
    expect(followingTab.closest('button')).toHaveAttribute('aria-selected', 'true');
    
    // Other tabs should have aria-selected="false"
    const trendingTab = screen.getByText('Trending');
    expect(trendingTab.closest('button')).toHaveAttribute('aria-selected', 'false');
  });
}); 