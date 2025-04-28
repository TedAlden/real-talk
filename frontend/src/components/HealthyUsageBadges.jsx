import { useState, useEffect } from 'react';
import { HiBadgeCheck, HiClock, HiScale } from 'react-icons/hi';
import useAuth from '../hooks/useAuth';
import useScreenTime from '../hooks/useScreenTime';

/**
 * Badge definitions - each badge has criteria for earning it
 */
const badges = [
  {
    id: 'balanced_user',
    title: 'Balanced User',
    description: 'Stay under your daily limit for 3 consecutive days',
    icon: <HiScale className="h-8 w-8 text-blue-500" />,
    criteria: (user) => (user.usage_stats?.healthy_days_streak >= 3)
  },
  {
    id: 'mindful_poster',
    title: 'Mindful Poster',
    description: 'Post no more than once per day for a week',
    icon: <HiBadgeCheck className="h-8 w-8 text-green-500" />,
    criteria: (user) => {
      // This would need a more complex implementation in real usage
      // For now, we just check if they have the usage_stats field set up
      return user.usage_stats ? true : false;
    }
  },
  {
    id: 'time_guardian',
    title: 'Time Guardian',
    description: 'Set up screen time limits and grayscale mode',
    icon: <HiClock className="h-8 w-8 text-purple-500" />,
    criteria: (user) => (
      user.anti_addiction?.daily_limit_mins && 
      user.anti_addiction?.grayscale_enabled
    )
  },
];

/**
 * HealthyUsageBadges displays achievement badges for maintaining 
 * healthy app usage habits
 */
function HealthyUsageBadges() {
  const auth = useAuth();
  const { dailyUsage, dailyLimit } = useScreenTime();
  const [user, setUser] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  
  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!auth.loggedIn) return;
      
      try {
        const userData = await auth.getUser();
        setUser(userData);
        
        // Check which badges the user has earned
        if (userData) {
          const earned = badges.filter(badge => badge.criteria(userData));
          setEarnedBadges(earned);
        }
      } catch (error) {
        console.error('Error loading user data for badges:', error);
      }
    };
    
    loadUserData();
  }, [auth, dailyUsage, dailyLimit]);
  
  // Don't show anything if gamification is disabled or user not logged in
  if (!auth.loggedIn || !user?.anti_addiction?.gamification_enabled) {
    return null;
  }
  
  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
        Healthy Usage Achievements
      </h3>
      
      {earnedBadges.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You haven't earned any badges yet. Keep using the app responsibly to earn rewards!
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {earnedBadges.map(badge => (
            <div 
              key={badge.id}
              className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-700"
            >
              <div className="mb-2 rounded-full bg-gray-100 p-2 dark:bg-gray-600">
                {badge.icon}
              </div>
              <h4 className="text-md mb-1 font-semibold text-gray-900 dark:text-white">
                {badge.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {/* Display badges still to earn */}
      {earnedBadges.length < badges.length && (
        <>
          <h4 className="mb-2 mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            Badges to earn:
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {badges.filter(badge => !earnedBadges.some(earned => earned.id === badge.id))
              .map(badge => (
                <div 
                  key={badge.id}
                  className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-3 text-center opacity-60 shadow-sm grayscale dark:border-gray-700 dark:bg-gray-700"
                >
                  <div className="mb-1 rounded-full bg-gray-100 p-1.5 dark:bg-gray-600">
                    {badge.icon}
                  </div>
                  <h4 className="text-sm mb-1 font-semibold text-gray-900 dark:text-white">
                    {badge.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {badge.description}
                  </p>
                </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default HealthyUsageBadges; 