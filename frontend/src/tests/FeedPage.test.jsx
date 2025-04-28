import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FeedPage from '../pages/FeedPage';
import useFeed from '../hooks/useFeed';
import usePostLimit from '../hooks/usePostLimit';
import useAuth from '../hooks/useAuth';

// Mock the necessary hooks
jest.mock('../hooks/useFeed');
jest.mock('../hooks/usePostLimit');
jest.mock('../hooks/useAuth');

const mockPosts = [
  {
    _id: 'post1',
    user_id: 'user1',
    content: 'Test post 1',
    likes: [],
    comments: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: 'post2',
    user_id: 'user2',
    content: 'Test post 2',
    likes: ['user1'],
    comments: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const mockUser = {
  _id: 'user1',
  username: 'testuser',
};

describe('FeedPage Component', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock useAuth
    useAuth.mockReturnValue({
      getUser: jest.fn().mockReturnValue(mockUser),
    });
    
    // Mock useFeed
    useFeed.mockReturnValue({
      posts: [],
      loading: false,
      error: null,
      hasMore: true,
      loadMore: jest.fn(),
      refreshFeed: jest.fn(),
      handlePostDelete: jest.fn(),
      addNewPost: jest.fn(),
    });
    
    // Mock usePostLimit
    usePostLimit.mockReturnValue({
      postCount: 0,
      limit: 5,
      loading: false,
      hasReachedLimit: false,
      incrementCount: jest.fn(),
      refreshCount: jest.fn(),
    });
  });

  test('renders feed page with tabs', () => {
    render(
      <MemoryRouter>
        <FeedPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Feed')).toBeInTheDocument();
    expect(screen.getByText('Following')).toBeInTheDocument();
    expect(screen.getByText('Trending')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  test('displays post limit indicator', () => {
    usePostLimit.mockReturnValue({
      postCount: 3,
      limit: 5,
      loading: false,
      hasReachedLimit: false,
      incrementCount: jest.fn(),
      refreshCount: jest.fn(),
    });

    render(
      <MemoryRouter>
        <FeedPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Daily Post Limit')).toBeInTheDocument();
    expect(screen.getByText('3 / 5')).toBeInTheDocument();
  });

  test('changes feed type when clicking on tabs', () => {
    render(
      <MemoryRouter>
        <FeedPage />
      </MemoryRouter>
    );

    // Initially following tab should be active
    expect(useFeed).toHaveBeenLastCalledWith('following');
    
    // Click on Trending tab
    fireEvent.click(screen.getByText('Trending'));
    
    // The hook should be called with trending
    expect(useFeed).toHaveBeenLastCalledWith('trending');
  });

  test('displays posts when available', () => {
    useFeed.mockReturnValue({
      posts: mockPosts,
      loading: false,
      error: null,
      hasMore: true,
      loadMore: jest.fn(),
      refreshFeed: jest.fn(),
      handlePostDelete: jest.fn(),
      addNewPost: jest.fn(),
    });

    render(
      <MemoryRouter>
        <FeedPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Test post 1')).toBeInTheDocument();
    expect(screen.getByText('Test post 2')).toBeInTheDocument();
  });

  test('displays loading state when fetching posts', () => {
    useFeed.mockReturnValue({
      posts: [],
      loading: true,
      error: null,
      hasMore: true,
      loadMore: jest.fn(),
      refreshFeed: jest.fn(),
      handlePostDelete: jest.fn(),
      addNewPost: jest.fn(),
    });

    render(
      <MemoryRouter>
        <FeedPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays error state when fetch fails', () => {
    useFeed.mockReturnValue({
      posts: [],
      loading: false,
      error: 'Failed to load feed',
      hasMore: false,
      loadMore: jest.fn(),
      refreshFeed: jest.fn(),
      handlePostDelete: jest.fn(),
      addNewPost: jest.fn(),
    });

    render(
      <MemoryRouter>
        <FeedPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Failed to load feed')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  test('hides composer when post limit is reached', () => {
    usePostLimit.mockReturnValue({
      postCount: 5,
      limit: 5,
      loading: false,
      hasReachedLimit: true,
      incrementCount: jest.fn(),
      refreshCount: jest.fn(),
    });

    render(
      <MemoryRouter>
        <FeedPage />
      </MemoryRouter>
    );

    // Composer should not be rendered
    expect(screen.queryByPlaceholderText(/what's on your mind/i)).not.toBeInTheDocument();
    expect(screen.getByText("You've reached your daily post limit")).toBeInTheDocument();
  });
}); 