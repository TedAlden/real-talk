import { useEffect, useRef, useCallback } from "react";
import { FaSpinner, FaExclamationTriangle, FaArrowDown } from "react-icons/fa";

/**
 * InfiniteScrollLoader component - Handles infinite scrolling functionality
 * Uses IntersectionObserver to detect when user scrolls to the bottom of the content
 * and automatically loads more content
 * 
 * @param {boolean} loading - Whether content is currently loading
 * @param {string|null} error - Error message if loading failed
 * @param {boolean} hasMore - Whether there is more content to load
 * @param {Function} onLoadMore - Callback to load more content
 * @param {Function} onRetry - Callback to retry loading after an error
 */
function InfiniteScrollLoader({ loading, error, hasMore, onLoadMore, onRetry }) {
  const observer = useRef();
  
  // Setup and manage the IntersectionObserver
  const loaderRef = useCallback(
    (node) => {
      // Don't observe while loading
      if (loading) return;
      
      // Disconnect previous observer
      if (observer.current) {
        observer.current.disconnect();
      }
      
      // Create new observer
      observer.current = new IntersectionObserver((entries) => {
        // When the loader element is visible and we have more content to load
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      }, {
        rootMargin: '100px', // Start loading before the element is visible
        threshold: 0.1      // Trigger when at least 10% of the element is visible
      });
      
      // Observe new node
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore, onLoadMore]
  );
  
  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);
  
  // Display error state with retry button
  if (error) {
    return (
      <div 
        className="my-8 flex flex-col items-center justify-center text-center"
        role="alert"
        aria-live="assertive"
      >
        <FaExclamationTriangle className="mb-2 text-3xl text-red-500" aria-hidden="true" />
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {typeof error === "string" ? error : "Failed to load posts"}
        </p>
        <button
          onClick={onRetry}
          className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div
      ref={loaderRef}
      className="my-8 flex items-center justify-center"
      role="status"
      aria-live="polite"
    >
      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <FaSpinner className="mr-2 animate-spin" aria-hidden="true" />
          <span>Loading more posts...</span>
        </div>
      )}
      
      {/* More content available indicator */}
      {!loading && hasMore && (
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <span>Scroll for more</span>
          <FaArrowDown className="ml-2 animate-bounce" aria-hidden="true" />
        </div>
      )}
      
      {/* End of content indicator */}
      {!loading && !hasMore && (
        <p className="text-gray-500 dark:text-gray-400">
          You've reached the end
        </p>
      )}
    </div>
  );
}

export default InfiniteScrollLoader; 