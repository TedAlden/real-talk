import { render, screen, fireEvent } from '@testing-library/react';
import InfiniteScrollLoader from '../components/InfiniteScrollLoader';

// Mock Intersection Observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});

window.IntersectionObserver = mockIntersectionObserver;

describe('InfiniteScrollLoader Component', () => {
  test('renders loading state', () => {
    render(
      <InfiniteScrollLoader
        loading={true}
        error={null}
        hasMore={true}
        onLoadMore={jest.fn()}
        onRetry={jest.fn()}
      />
    );
    
    expect(screen.getByText('Loading more posts...')).toBeInTheDocument();
  });
  
  test('renders error state and retry button', () => {
    const onRetryMock = jest.fn();
    render(
      <InfiniteScrollLoader
        loading={false}
        error="Failed to load posts"
        hasMore={true}
        onLoadMore={jest.fn()}
        onRetry={onRetryMock}
      />
    );
    
    expect(screen.getByText('Failed to load posts')).toBeInTheDocument();
    
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);
    
    expect(onRetryMock).toHaveBeenCalled();
  });
  
  test('renders end message when no more posts', () => {
    render(
      <InfiniteScrollLoader
        loading={false}
        error={null}
        hasMore={false}
        onLoadMore={jest.fn()}
        onRetry={jest.fn()}
      />
    );
    
    expect(screen.getByText("You've reached the end")).toBeInTheDocument();
  });
  
  test('renders scroll for more indicator when more content available', () => {
    render(
      <InfiniteScrollLoader
        loading={false}
        error={null}
        hasMore={true}
        onLoadMore={jest.fn()}
        onRetry={jest.fn()}
      />
    );
    
    expect(screen.getByText('Scroll for more')).toBeInTheDocument();
  });
  
  test('sets up IntersectionObserver to trigger onLoadMore', () => {
    const onLoadMoreMock = jest.fn();
    render(
      <InfiniteScrollLoader
        loading={false}
        error={null}
        hasMore={true}
        onLoadMore={onLoadMoreMock}
        onRetry={jest.fn()}
      />
    );
    
    // Get the callback passed to the IntersectionObserver
    const [observerCallback] = mockIntersectionObserver.mock.calls[0];
    
    // Simulate intersection
    observerCallback([{ isIntersecting: true }]);
    
    // Check that onLoadMore was called
    expect(onLoadMoreMock).toHaveBeenCalled();
  });
  
  test('does not call onLoadMore when isIntersecting is false', () => {
    const onLoadMoreMock = jest.fn();
    render(
      <InfiniteScrollLoader
        loading={false}
        error={null}
        hasMore={true}
        onLoadMore={onLoadMoreMock}
        onRetry={jest.fn()}
      />
    );
    
    // Get the callback passed to the IntersectionObserver
    const [observerCallback] = mockIntersectionObserver.mock.calls[0];
    
    // Simulate non-intersection
    observerCallback([{ isIntersecting: false }]);
    
    // Check that onLoadMore was not called
    expect(onLoadMoreMock).not.toHaveBeenCalled();
  });
  
  test('does not trigger onLoadMore when hasMore is false', () => {
    const onLoadMoreMock = jest.fn();
    render(
      <InfiniteScrollLoader
        loading={false}
        error={null}
        hasMore={false}
        onLoadMore={onLoadMoreMock}
        onRetry={jest.fn()}
      />
    );
    
    // Get the callback passed to the IntersectionObserver
    const [observerCallback] = mockIntersectionObserver.mock.calls[0];
    
    // Simulate intersection
    observerCallback([{ isIntersecting: true }]);
    
    // Check that onLoadMore was not called
    expect(onLoadMoreMock).not.toHaveBeenCalled();
  });
}); 