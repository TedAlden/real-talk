/**
 * Displays the user's daily post count and limit status
 * @param {number} posts - Number of posts made today by the user
 */
function DailyPostCounter({ posts }) {
  // Maximum number of posts allowed per day
  const DAILY_POST_LIMIT = 1;
  
  // Check if user has reached their daily post limit
  const isLimitReached = posts >= DAILY_POST_LIMIT;
  
  return (
    <div className="text-gray-900 dark:text-white">
      <div className={`font-semibold ${isLimitReached ? 'text-red-500 dark:text-red-400' : ''}`}>
        Posts Today: {posts}/{DAILY_POST_LIMIT}
      </div>
      {isLimitReached && (
        <div className="mt-1 text-sm text-red-500 dark:text-red-400">
          Daily post limit reached
        </div>
      )}
    </div>
  );
}

export default DailyPostCounter;