import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Hook for managing infinite scrolling feed of posts.
 * Handles pagination, scroll events, and post CRUD operations.
 * 
 * @param {Object} viewer - Current user viewing the feed.
 * @param {number} postsPerPage - Number of posts to load per page.
 * @param {Function} fetchFeedFunction - API call to fetch posts.
 */
export default function useScrollingFeed({
  viewer,
  postsPerPage = 5,
  fetchFeedFunction,
}) {
  // Feed state management
  const [posts, setPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const firstLoad = useRef(true);

  // Distance from bottom to trigger next page
  const scrollMargin = 10;

  /**
   * Fetch posts from the server.
   * 
   * @param {number} pageNumber - Current page number to fetch.
   */
  const fetchPosts = useCallback(
    async (pageNumber) => {
      if (feedLoading) return;
      setFeedLoading(true);
      try {
        const response = await fetchFeedFunction({
          limit: postsPerPage,
          offset: postsPerPage * pageNumber,
        });
        if (response.success !== false) {
          setPage(pageNumber + 1);
          setPosts((prevPosts) => [...prevPosts, ...response.data]);
          setHasMore(response.data.length === postsPerPage);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setHasMore(false);
      } finally {
        setFeedLoading(false);
      }
    },
    [feedLoading, fetchFeedFunction, postsPerPage],
  );

  /**
   * Handle scroll event to load more posts when scrolling to the bottom of the feed.
   */
  const handleScroll = useCallback(() => {
    if (feedLoading || !hasMore) return;
    const mainContent = document.getElementById("main-content-scrollable");
    if (
      mainContent.scrollTop + mainContent.clientHeight >=
      mainContent.scrollHeight - scrollMargin
    ) {
      setFeedLoading(true);
      fetchPosts(page);
    }
  }, [fetchPosts, page, hasMore, feedLoading]);

  /**
   * Handle post deletion.
   * 
   * @param {string} postId - ID of the post to delete.
   */
  const onPostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  /**
   * Handle post creation.
   * 
   * @param {Object} post - New post to add to the feed.
   */
  const onPostCreated = (post) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  };

  /**
   * Load first page of posts on initial render.
   */
  useEffect(() => {
    if (firstLoad.current && viewer?._id) {
      fetchPosts(page);
      firstLoad.current = false;
    }
  }, [fetchPosts, page, viewer]);

  /**
   * Add scroll event listener to main content area.
   */
  useEffect(() => {
    const mainContent = document.getElementById("main-content-scrollable");
    mainContent.addEventListener("scroll", handleScroll);
    return () => mainContent.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return {
    posts,
    feedLoading,
    hasMore,
    onPostDeleted,
    onPostCreated,
  };
}
