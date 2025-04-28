import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FeedItem from '../components/FeedItem';
import { likePost } from '../api/postService';

// Mock the necessary modules
jest.mock('../api/postService', () => ({
  likePost: jest.fn(),
}));

jest.mock('../hooks/useUserCache', () => ({
  useCachedUser: jest.fn().mockImplementation((userId) => ({
    _id: userId,
    username: 'testuser',
    profile_picture: 'https://example.com/profile.jpg',
  })),
}));

const mockPost = {
  _id: 'post123',
  user_id: 'user123',
  content: 'Test post content',
  likes: ['user456'],
  comments: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockViewer = {
  _id: 'viewer123',
  username: 'vieweruser',
};

describe('FeedItem Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders post content correctly', () => {
    render(
      <MemoryRouter>
        <FeedItem post={mockPost} viewer={mockViewer} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test post content')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });

  test('handles like action correctly', async () => {
    likePost.mockResolvedValue({ success: true });
    
    const onLikeMock = jest.fn();
    
    render(
      <MemoryRouter>
        <FeedItem post={mockPost} viewer={mockViewer} onLike={onLikeMock} />
      </MemoryRouter>
    );

    // Find and click the like button
    const likeButton = screen.getByLabelText('Like');
    fireEvent.click(likeButton);

    // Verify API call
    expect(likePost).toHaveBeenCalledWith('post123', 'viewer123', true);
    
    // Verify callback
    await waitFor(() => {
      expect(onLikeMock).toHaveBeenCalledWith('post123', true);
    });
  });

  test('shows correct like count', () => {
    render(
      <MemoryRouter>
        <FeedItem post={{ ...mockPost, likes: ['user1', 'user2', 'user3'] }} viewer={mockViewer} />
      </MemoryRouter>
    );

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('displays edited indicator when post has been updated', () => {
    const updatedPost = {
      ...mockPost,
      created_at: '2023-01-01T12:00:00Z',
      updated_at: '2023-01-02T12:00:00Z',
    };
    
    render(
      <MemoryRouter>
        <FeedItem post={updatedPost} viewer={mockViewer} />
      </MemoryRouter>
    );

    expect(screen.getByText(/edited/i)).toBeInTheDocument();
  });
}); 