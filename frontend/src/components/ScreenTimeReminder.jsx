import { useState, useEffect } from 'react';
import { HiClock, HiX } from 'react-icons/hi';
import { Alert, Progress } from 'flowbite-react';
import useScreenTime from '../hooks/useScreenTime';
import useAuth from '../hooks/useAuth';

/**
 * ScreenTimeReminder shows time-based reminders about screen time usage
 * Displays a countdown timer and periodic notifications
 */
function ScreenTimeReminder() {
  const auth = useAuth();
  const { 
    dailyUsage, 
    dailyLimit, 
    limitReached, 
    formattedRemaining,
    usagePercentage 
  } = useScreenTime();
  
  const [userPreferences, setUserPreferences] = useState({
    show_reminders: true
  });
  const [showReminder, setShowReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  
  // Load user preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!auth.loggedIn) return;
      
      try {
        const userData = await auth.getUser();
        setUserPreferences({
          show_reminders: userData.anti_addiction?.show_reminders ?? true
        });
      } catch (error) {
        console.error('Error loading reminder preferences:', error);
      }
    };
    
    loadPreferences();
  }, [auth]);
  
  // Show reminder when limit is reached
  useEffect(() => {
    if (limitReached && userPreferences.show_reminders) {
      setReminderMessage("You've reached your daily screen time limit.");
      setShowReminder(true);
    }
  }, [limitReached, userPreferences.show_reminders]);
  
  // Show periodic reminders based on usage
  useEffect(() => {
    if (!userPreferences.show_reminders) return;
    
    // Show reminder at 50%, 75%, 90% of limit
    const thresholds = [0.5, 0.75, 0.9];
    const usageRatio = dailyUsage / dailyLimit;
    
    // Find the highest threshold that was just crossed
    const crossedThreshold = thresholds.find(threshold => {
      // Check if we just crossed this threshold (within 30 seconds)
      const thresholdSeconds = threshold * dailyLimit;
      return dailyUsage >= thresholdSeconds && dailyUsage - 30 < thresholdSeconds;
    });
    
    if (crossedThreshold) {
      const percentUsed = Math.round(crossedThreshold * 100);
      setReminderMessage(`You've used ${percentUsed}% of your daily screen time.`);
      setShowReminder(true);
    }
    
    // Reminder every 20 minutes of continuous usage
    if (dailyUsage % 1200 >= 0 && dailyUsage % 1200 < 30 && dailyUsage > 1200) {
      const minutesUsed = Math.floor(dailyUsage / 60);
      setReminderMessage(`You've been browsing for ${minutesUsed} continuous minutes.`);
      setShowReminder(true);
    }
  }, [dailyUsage, dailyLimit, userPreferences.show_reminders]);
  
  // Auto-hide reminder after 10 seconds
  useEffect(() => {
    if (showReminder) {
      const timer = setTimeout(() => {
        setShowReminder(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [showReminder]);
  
  if (!auth.loggedIn || !userPreferences.show_reminders) {
    return null;
  }
  
  // Fixed timer that displays at the bottom of the page
  return (
    <>
      {/* Always visible time counter */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
        <div className="w-56 rounded-lg bg-white p-3 shadow-lg dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <HiClock className="mr-2 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Time Remaining
              </span>
            </div>
            <span className="text-md font-bold text-blue-600 dark:text-blue-400">
              {formattedRemaining}
            </span>
          </div>
          <Progress
            className="mt-2"
            color={usagePercentage > 90 ? "red" : usagePercentage > 75 ? "yellow" : "blue"}
            progress={usagePercentage}
          />
        </div>
      </div>
      
      {/* Popup reminders */}
      {showReminder && (
        <div className="fixed bottom-24 right-4 z-50 w-80">
          <Alert
            color="warning"
            onDismiss={() => setShowReminder(false)}
            className="items-center"
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-sm font-medium">{reminderMessage}</span>
              <button
                onClick={() => setShowReminder(false)}
                className="ml-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <HiX />
              </button>
            </div>
          </Alert>
        </div>
      )}
    </>
  );
}

export default ScreenTimeReminder; 