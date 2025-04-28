import { useState, useEffect, useCallback } from "react";
import { getUserDailyPostCount } from "../api/feedService";

// Default daily post limit (used as fallback)
const DEFAULT_DAILY_LIMIT = 5;

/**
 * Custom hook to track user's daily post limit and usage
 * Fetches current post count and limit from the API
 * 
 * @param {string} userId - ID of the user to track post limit for
 * @returns {Object} Post limit state and helper functions
 */
export default function usePostLimit(userId) {
  const [postCount, setPostCount] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_DAILY_LIMIT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  /**
   * Fetch the user's daily post count and limit from the API
   */
  const fetchPostCount = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUserDailyPostCount(userId);
      
      if (response.success === false) {
        throw new Error(response.message || "Failed to fetch post count");
      }
      
      // Extract and set post count and limit
      setPostCount(response.data.count || 0);
      setLimit(response.data.limit || DEFAULT_DAILY_LIMIT);
    } catch (err) {
      console.error("Error fetching post count:", err);
      setError(err.message || "Error fetching post count");
      
      // Use default values to prevent UI breaking
      setPostCount(0);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  // Fetch post count when component mounts or userId changes
  useEffect(() => {
    fetchPostCount();
  }, [fetchPostCount]);
  
  /**
   * Increment the post count by 1
   * Used when user creates a new post
   */
  const incrementCount = useCallback(() => {
    setPostCount(prevCount => prevCount + 1);
  }, []);
  
  // Check if user has reached their daily post limit
  const hasReachedLimit = postCount >= limit;
  
  return {
    postCount,
    limit,
    loading,
    error,
    hasReachedLimit,
    incrementCount,
    refreshCount: fetchPostCount
  };
} 