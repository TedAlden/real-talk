import { renderHook, act } from '@testing-library/react-hooks';
import useFeed from '../hooks/useFeed';
import { getFollowingFeed, getAllFeed, getTrendingFeed } from '../api/feedService';

// Mock the API services
jest.mock('../api/feedService', () => ({
  getFollowingFeed: jest.fn(),
  getAllFeed: jest.fn(),
  getTrendingFeed: jest.fn(),
}));

// Mock the user cache updater
jest.mock('../hooks/useUserCache', () => ({
  useCacheUpdater: jest.fn().mockReturnValue(jest.fn()),
}));

describe('useFeed Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    getFollowingFeed.mockResolvedValue({
      success: true,
      data: [
        { _id: 'post1', user_id: 'user1', content: 'Test post 1' },
        { _id: 'post2', user_id: 'user2', content: 'Test post 2' },
      ],
    });
    
    getAllFeed.mockResolvedValue({
      success: true,
      data: [
        { _id: 'post3', user_id: 'user3', content: 'Test post 3' },
        { _id: 'post4', user_id: 'user4', content: 'Test post 4' },
      ],
    });
    
    getTrendingFeed.mockResolvedValue({
      success: true,
      data: [
        { _id: 'post5', user_id: 'user5', content: 'Test post 5' },
        { _id: 'post6', user_id: 'user6', content: 'Test post 6' },
      ],
    });
  });

  test('fetches following feed by default', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFeed('following'));
    
    // Initially should be loading
    expect(result.current.loading).toBe(true);
    expect(result.current.posts).toEqual([]);
    
    await waitForNextUpdate();
    
    // After loading
    expect(result.current.loading).toBe(false);
    expect(result.current.posts).toHaveLength(2);
    expect(result.current.posts[0]._id).toBe('post1');
    expect(getFollowingFeed).toHaveBeenCalledWith(1);
  });

  test('fetches trending feed when specified', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFeed('trending'));
    
    // Initially should be loading
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    // After loading
    expect(result.current.loading).toBe(false);
    expect(result.current.posts).toHaveLength(2);
    expect(result.current.posts[0]._id).toBe('post5');
    expect(getTrendingFeed).toHaveBeenCalledWith(1);
  });

  test('fetches all feed when specified', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFeed('all'));
    
    await waitForNextUpdate();
    
    expect(result.current.posts).toHaveLength(2);
    expect(result.current.posts[0]._id).toBe('post3');
    expect(getAllFeed).toHaveBeenCalledWith(1);
  });

  test('handles load more correctly', async () => {
    getAllFeed.mockResolvedValueOnce({
      success: true,
      data: [{ _id: 'post1', user_id: 'user1' }],
    });
    
    getAllFeed.mockResolvedValueOnce({
      success: true,
      data: [{ _id: 'post2', user_id: 'user2' }],
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useFeed('all'));
    
    // Wait for initial load
    await waitForNextUpdate();
    expect(result.current.posts).toHaveLength(1);
    
    // Load more
    act(() => {
      result.current.loadMore();
    });
    
    // Should be loading again
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    // Should now have both posts
    expect(result.current.posts).toHaveLength(2);
    expect(result.current.posts[0]._id).toBe('post1');
    expect(result.current.posts[1]._id).toBe('post2');
  });

  test('handles errors correctly', async () => {
    getAllFeed.mockRejectedValueOnce(new Error('API error'));
    
    const { result, waitForNextUpdate } = renderHook(() => useFeed('all'));
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('API error');
    expect(result.current.posts).toHaveLength(0);
  });

  test('refresh resets and fetches new data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFeed('all'));
    
    // Wait for initial load
    await waitForNextUpdate();
    
    // Mock a new response for refresh
    getAllFeed.mockResolvedValueOnce({
      success: true,
      data: [{ _id: 'new-post', user_id: 'user7' }],
    });
    
    // Call refresh
    act(() => {
      result.current.refreshFeed();
    });
    
    // Should be loading
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    // Should have new data
    expect(result.current.posts).toHaveLength(1);
    expect(result.current.posts[0]._id).toBe('new-post');
  });

  test('handle post deletion removes post from state', async () => {
    getAllFeed.mockResolvedValueOnce({
      success: true,
      data: [
        { _id: 'post1', user_id: 'user1' },
        { _id: 'post2', user_id: 'user2' },
      ],
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useFeed('all'));
    
    await waitForNextUpdate();
    expect(result.current.posts).toHaveLength(2);
    
    // Delete a post
    act(() => {
      result.current.handlePostDelete('post1');
    });
    
    // Should have one post remaining
    expect(result.current.posts).toHaveLength(1);
    expect(result.current.posts[0]._id).toBe('post2');
  });
}); 