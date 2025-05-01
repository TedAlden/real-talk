function DailyPostCounter({ posts }) {
  const DAILY_POST_LIMIT = 1;
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