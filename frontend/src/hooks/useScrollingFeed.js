import { useState, useEffect, useCallback, useRef } from "react";

import useAuth from "../hooks/useAuth";

export default function useScrollingFeed({
  postsPerPage = 5,
  fetchFeedFunction,
}) {
  const auth = useAuth();
  const [viewer, setViewer] = useState(null);
  const [posts, setPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const firstLoad = useRef(true);

  /**
   * Determine viewer
   */
  useEffect(() => {
    const fetchUser = async () => {
      const user = await auth.getUser();
      setViewer(user);
    };
    fetchUser();
  }, [auth]);

  /**
   * Fetch posts from the server.
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
   * Handle scroll event to load more posts when scrolling to the bottom of the
   * feed.
   */
  const handleScroll = useCallback(() => {
    if (feedLoading || !hasMore) return;
    const mainContent = document.getElementById("main-content-scrollable");
    if (
      mainContent.scrollTop + mainContent.clientHeight >=
      mainContent.scrollHeight - 100
    ) {
      setFeedLoading(true);
      fetchPosts(page);
    }
  }, [fetchPosts, page, hasMore, feedLoading]);

  /**
   * Handle post deleted.
   */
  const onPostDeleted = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  /**
   * Handle post created.
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
