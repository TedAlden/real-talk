import { FaInfoCircle } from "react-icons/fa";

/**
 * PostLimitIndicator component - Displays a user's daily post limit progress
 * Changes color based on how close the user is to their limit
 * 
 * @param {number} postCount - Number of posts made today
 * @param {number} limit - Maximum allowed posts per day
 * @param {boolean} isLoading - Whether the post count is still loading
 */
function PostLimitIndicator({ postCount, limit, isLoading = false }) {
  // Calculate percentage for progress bar
  const percentage = Math.min(100, (postCount / limit) * 100);
  const hasReachedLimit = postCount >= limit;
  
  // Determine progress bar color based on usage
  const getProgressBarColor = () => {
    if (hasReachedLimit) return "bg-red-500";
    if (percentage > 75) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  return (
    <div 
      className="mb-4 rounded-lg bg-white p-4 shadow-sm dark:border dark:border-gray-700 dark:bg-gray-800"
      aria-labelledby="post-limit-header"
    >
      <div className="flex items-center justify-between">
        <h3 
          id="post-limit-header" 
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Daily Post Limit
        </h3>
        {isLoading ? (
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
        ) : (
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {postCount} / {limit}
          </span>
        )}
      </div>
      
      {/* Progress bar */}
      <div 
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
        aria-hidden="true"
      >
        <div
          className={`h-full rounded-full ${getProgressBarColor()}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={postCount}
          aria-valuemin="0"
          aria-valuemax={limit}
          aria-label={`${postCount} of ${limit} posts used`}
        ></div>
      </div>
      
      {/* Warning message when limit reached */}
      {hasReachedLimit && (
        <div 
          className="mt-2 flex items-center text-sm text-red-500"
          role="alert"
        >
          <FaInfoCircle className="mr-1" aria-hidden="true" />
          <span>You've reached your daily post limit</span>
        </div>
      )}
    </div>
  );
}

export default PostLimitIndicator; 