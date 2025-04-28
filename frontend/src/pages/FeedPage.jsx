import { useState, useEffect } from "react";
import FeedItem from "../components/FeedItem";
import FeedTabs from "../components/FeedTabs";
import PostLimitIndicator from "../components/PostLimitIndicator";
import InfiniteScrollLoader from "../components/InfiniteScrollLoader";
import Composer from "../components/Composer";
import HealthyUsageBadges from "../components/HealthyUsageBadges";
import useFeed from "../hooks/useFeed";
import usePostLimit from "../hooks/usePostLimit";
import useAuth from "../hooks/useAuth";
import { FaSpinner } from "react-icons/fa";

/**
 * FeedPage component - Main feed page displaying posts with infinite scrolling
 * Features:
 * - Different feed types (Following, Trending, All)
 * - Post creation with daily limit tracking
 * - Infinite scrolling
 * - Loading/error states
 */
function FeedPage() {
  // Active tab state (following/trending/all)
  const [activeTab, setActiveTab] = useState("following");
  const [viewer, setViewer] = useState(null);
  
  const auth = useAuth();
  
  // Get feed data with the custom hook
  const {
    posts,
    loading,
    error,
    hasMore,
    loadMore,
    refreshFeed,
    handlePostDelete,
    addNewPost
  } = useFeed(activeTab);
  
  // Get post limit data for the current user
  const {
    postCount,
    limit,
    loading: limitLoading,
    hasReachedLimit,
    incrementCount,
    refreshCount
  } = usePostLimit(viewer?._id);
  
  // Set viewer from auth on component mount and auth changes
  useEffect(() => {
    if (auth && auth.getUser) {
      setViewer(auth.getUser());
    }
  }, [auth]);
  
  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
  // Handle new post creation
  const handleNewPost = (postContent) => {
    // Increment post count to update the limit indicator
    incrementCount();
    
    // Refresh feed to show the new post
    refreshFeed();
  };
  
  // Show loading spinner while user data is loading
  if (!viewer) {
    return (
      <div className="flex h-screen items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500" aria-label="Loading user data" />
      </div>
    );
  }
  
  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-2xl font-bold dark:text-white">Feed</h1>
      
      {/* Post limit indicator */}
      <PostLimitIndicator
        postCount={postCount}
        limit={limit}
        isLoading={limitLoading}
      />
      
      {/* Healthy usage badges */}
      <div className="mb-6">
        <HealthyUsageBadges />
      </div>
      
      {/* Post composer - hidden when user has reached daily post limit */}
      {!hasReachedLimit && (
        <div className="mb-6 rounded-lg bg-white p-4 shadow-md dark:border dark:border-gray-700 dark:bg-gray-800">
          <Composer
            onSubmit={handleNewPost}
            mode="createPost"
            disabled={hasReachedLimit}
          />
        </div>
      )}
      
      {/* Feed type tabs */}
      <FeedTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="space-y-4">
        {/* Initial loading state */}
        {loading && posts.length === 0 && (
          <div className="flex h-40 items-center justify-center" aria-live="polite">
            <FaSpinner className="animate-spin text-4xl text-blue-500" aria-label="Loading feed" />
          </div>
        )}
        
        {/* Error state with no posts */}
        {error && posts.length === 0 && (
          <div className="rounded-lg bg-red-100 p-4 text-center dark:bg-red-900/20" aria-live="assertive">
            <p className="text-red-800 dark:text-red-200">
              {typeof error === "string" ? error : "Failed to load posts"}
            </p>
            <button
              onClick={refreshFeed}
              className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* No posts found */}
        {!loading && !error && posts.length === 0 && (
          <div className="rounded-lg bg-white p-8 text-center shadow-md dark:border dark:border-gray-700 dark:bg-gray-800">
            <p className="text-gray-500 dark:text-gray-400">
              {activeTab === "following"
                ? "You're not following anyone yet, or the people you follow haven't posted anything."
                : "No posts found. Be the first to post something!"}
            </p>
          </div>
        )}
        
        {/* Posts list */}
        <div aria-live="polite">
          {posts.map((post) => (
            <FeedItem
              key={post._id}
              post={post}
              viewer={viewer}
              onDelete={handlePostDelete}
            />
          ))}
        </div>
        
        {/* Infinite scroll loader */}
        {posts.length > 0 && (
          <InfiniteScrollLoader
            loading={loading}
            error={error}
            hasMore={hasMore}
            onLoadMore={loadMore}
            onRetry={refreshFeed}
          />
        )}
      </div>
    </div>
  );
}

export default FeedPage; 