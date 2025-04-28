import axiosInstance from "./axios";
import { apiErrorResponse } from "./apiUtils";

/**
 * Fetch feed posts from users the current user is following
 * 
 * @param {number} page - Page number for pagination (defaults to 1)
 * @param {number} limit - Number of posts per page (defaults to 10)
 * @returns {Promise<Object>} Response with posts data or error
 */
export async function getFollowingFeed(page = 1, limit = 10) {
  try {
    const response = await axiosInstance.get(
      `/api/posts?following=true&page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching following feed:", error);
    return apiErrorResponse(error);
  }
}

/**
 * Fetch all posts for the main feed (chronological order)
 * 
 * @param {number} page - Page number for pagination (defaults to 1)
 * @param {number} limit - Number of posts per page (defaults to 10)
 * @returns {Promise<Object>} Response with posts data or error
 */
export async function getAllFeed(page = 1, limit = 10) {
  try {
    const response = await axiosInstance.get(
      `/api/posts?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching all posts feed:", error);
    return apiErrorResponse(error);
  }
}

/**
 * Fetch trending posts (sorted by popularity)
 * 
 * @param {number} page - Page number for pagination (defaults to 1)
 * @param {number} limit - Number of posts per page (defaults to 10)
 * @returns {Promise<Object>} Response with posts data or error
 */
export async function getTrendingFeed(page = 1, limit = 10) {
  try {
    const response = await axiosInstance.get(
      `/api/feeds/trending?page=${page}&limit=${limit}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching trending feed:", error);
    return apiErrorResponse(error);
  }
}

/**
 * Get the user's daily post count and limit
 * Used to track and display how many posts a user has made today
 * 
 * @param {string} userId - ID of the user to get post count for
 * @returns {Promise<Object>} Response with count, limit and has_reached_limit data
 */
export async function getUserDailyPostCount(userId) {
  if (!userId) {
    return { 
      success: false, 
      message: "User ID is required to fetch post count" 
    };
  }
  
  try {
    const response = await axiosInstance.get(
      `/api/users/${userId}/daily-post-count`
    );
    return response;
  } catch (error) {
    console.error("Error fetching user daily post count:", error);
    return apiErrorResponse(error);
  }
} 