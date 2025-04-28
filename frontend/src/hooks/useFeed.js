import { useState, useEffect, useCallback } from "react";
import { getFollowingFeed, getAllFeed, getTrendingFeed } from "../api/feedService";
import { useCacheUpdater } from "./useUserCache";

/**
 * Custom hook for fetching and managing feed data
 * Handles loading, pagination, error states, and caching
 * 
 * @param {string} feedType - Type of feed to fetch ('following', 'trending', or 'all')
 * @returns {Object} Feed state and helper functions
 */
export default function useFeed(feedType = "all") {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const updateCache = useCacheUpdater();
  
  /**
   * Fetches feed data based on the specified feed type
   * 
   * @param {number} page - Page number to fetch
   * @param {boolean} append - Whether to append the new posts or replace existing ones
   */
  const fetchFeed = useCallback(async (page = 1, append = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Select the appropriate API call based on feed type
      let response;
      switch (feedType) {
        case "following":
          response = await getFollowingFeed(page);
          break;
        case "trending":
          response = await getTrendingFeed(page);
          break;
        case "all":
        default:
          response = await getAllFeed(page);
          break;
      }
      
      // Handle API error
      if (response.success === false) {
        throw new Error(response.message || `Failed to fetch ${feedType} feed`);
      }
      
      const newPosts = response.data || [];
      
      // Update user cache with all user IDs from posts
      if (newPosts.length > 0) {
        const userIds = newPosts.map(post => post.user_id);
        updateCache(userIds);
      }
      
      // If no more posts or fewer posts than limit, we've reached the end
      if (newPosts.length === 0 || newPosts.length < 10) {
        setHasMore(false);
      }
      
      // Update posts state (either append or replace)
      setPosts(prevPosts => append ? [...prevPosts, ...newPosts] : newPosts);
      setPage(page);
    } catch (err) {
      console.error(`Error fetching ${feedType} feed:`, err);
      setError(err.message || `Error fetching ${feedType} feed`);
    } finally {
      setLoading(false);
    }
  }, [feedType, updateCache]);
  
  // Initial load when feedType changes
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchFeed(1, false);
  }, [feedType, fetchFeed]);
  
  /**
   * Load more posts (next page)
   * Only triggers if not currently loading and more posts are available
   */
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchFeed(page + 1, true);
    }
  }, [loading, hasMore, page, fetchFeed]);
  
  /**
   * Refresh feed - clear posts and start from page 1
   */
  const refreshFeed = useCallback(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    fetchFeed(1, false);
  }, [fetchFeed]);
  
  /**
   * Handle post deletion - remove post from state
   * 
   * @param {string} postId - ID of the post to remove
   */
  const handlePostDelete = useCallback((postId) => {
    if (!postId) return;
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  }, []);
  
  /**
   * Add new post to the beginning of the feed
   * 
   * @param {Object} post - Post object to add
   */
  const addNewPost = useCallback((post) => {
    if (!post) return;
    setPosts(prevPosts => [post, ...prevPosts]);
  }, []);
  
  return {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    refreshFeed,
    handlePostDelete,
    addNewPost
  };
} 