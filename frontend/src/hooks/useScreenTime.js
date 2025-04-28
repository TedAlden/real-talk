import { useState, useEffect, useCallback, useRef } from 'react';
import { updateUser, updateHealthyStreak } from '../api/userService';
import useAuth from './useAuth';

/**
 * Hook for tracking screen time and enforcing usage limits
 * 
 * @returns {Object} Screen time tracking functions and state
 */
export default function useScreenTime() {
  const auth = useAuth();
  const [user, setUser] = useState(null);
  const [dailyUsage, setDailyUsage] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(60 * 60); // Default 1 hour in seconds
  const [limitReached, setLimitReached] = useState(false);
  const [grayscaleLevel, setGrayscaleLevel] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isActive, setIsActive] = useState(true);
  
  const activityInterval = useRef(null);
  const lastUpdateTime = useRef(Date.now());
  const needsReset = useRef(false);

  // Check if the current day is different from the last activity date
  const shouldResetDaily = useCallback((lastActivityDate) => {
    if (!lastActivityDate) return true;
    
    const now = new Date();
    const last = new Date(lastActivityDate);
    
    return now.getDate() !== last.getDate() || 
           now.getMonth() !== last.getMonth() || 
           now.getFullYear() !== last.getFullYear();
  }, []);

  // Update streak when day changes
  const updateStreak = useCallback(async (userId, currentUsage, currentLimit) => {
    if (!userId) return;
    
    // Check if user has maintained their limit
    const maintainedLimit = currentUsage <= currentLimit;
    
    try {
      // Update streak on the server
      await updateHealthyStreak(userId, maintainedLimit);
    } catch (error) {
      console.error('Error updating healthy streak:', error);
    }
  }, []);

  // Load user data and initialize screen time tracking
  useEffect(() => {
    const loadUserData = async () => {
      if (!auth.loggedIn) return;
      
      try {
        const userData = await auth.getUser();
        setUser(userData);
        
        // Set daily limit from user preferences (convert mins to seconds)
        const limitInSeconds = (userData.anti_addiction?.daily_limit_mins || 60) * 60;
        setDailyLimit(limitInSeconds);
        
        // Check if we need to reset the daily counter
        if (shouldResetDaily(userData.usage_stats?.last_activity)) {
          // Before resetting, update the streak based on previous day's usage
          if (userData.usage_stats?.daily_usage !== undefined) {
            await updateStreak(
              userData._id, 
              userData.usage_stats.daily_usage, 
              limitInSeconds
            );
          }
          
          needsReset.current = true;
        } else {
          // Set current usage from user data
          setDailyUsage(userData.usage_stats?.daily_usage || 0);
          
          // Check if limit already reached
          setLimitReached(userData.usage_stats?.daily_usage >= limitInSeconds);
          
          // Calculate grayscale level based on usage and threshold
          const threshold = userData.anti_addiction?.grayscale_threshold || 0.8;
          const usageRatio = userData.usage_stats?.daily_usage / limitInSeconds;
          
          if (usageRatio >= 1) {
            setGrayscaleLevel(1); // Full grayscale
          } else if (usageRatio >= threshold) {
            // Progressive grayscale between threshold and 100%
            const progressiveLevel = (usageRatio - threshold) / (1 - threshold);
            setGrayscaleLevel(progressiveLevel);
          }
        }
      } catch (error) {
        console.error('Error loading user data for screen time:', error);
      }
    };
    
    loadUserData();
  }, [auth, shouldResetDaily, updateStreak]);

  // Track active time spent on the app
  useEffect(() => {
    if (!auth.loggedIn || !user) return;
    
    // Helper function to update usage time
    const updateUsageTime = async () => {
      if (!isVisible || !isActive) return;
      
      const now = Date.now();
      const timeSpent = Math.floor((now - lastUpdateTime.current) / 1000);
      lastUpdateTime.current = now;
      
      if (timeSpent <= 0) return;
      
      // Reset daily usage if needed
      if (needsReset.current) {
        setDailyUsage(0);
        needsReset.current = false;
      }
      
      // Update daily usage
      const newUsage = dailyUsage + timeSpent;
      setDailyUsage(newUsage);
      
      // Check if limit is reached
      if (newUsage >= dailyLimit && !limitReached) {
        setLimitReached(true);
      }
      
      // Update grayscale level if enabled
      if (user.anti_addiction?.grayscale_enabled) {
        const threshold = user.anti_addiction.grayscale_threshold || 0.8;
        const usageRatio = newUsage / dailyLimit;
        
        if (usageRatio >= 1) {
          setGrayscaleLevel(1); // Full grayscale
        } else if (usageRatio >= threshold) {
          // Progressive grayscale between threshold and 100%
          const progressiveLevel = (usageRatio - threshold) / (1 - threshold);
          setGrayscaleLevel(progressiveLevel);
        }
      }
      
      // Update user data in database every 30 seconds
      if (newUsage % 30 === 0 || limitReached) {
        try {
          await updateUser(user._id, {
            "usage_stats.daily_usage": newUsage,
            "usage_stats.last_activity": new Date()
          });
        } catch (error) {
          console.error('Error updating screen time usage:', error);
        }
      }
    };
    
    // Set up interval to update usage time
    activityInterval.current = setInterval(updateUsageTime, 1000);
    
    // Page visibility change listener
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
      
      if (!document.hidden) {
        lastUpdateTime.current = Date.now(); // Reset timer when becoming visible
      }
    };
    
    // User activity listeners
    const resetActivityTimer = () => {
      setIsActive(true);
      lastUpdateTime.current = Date.now();
    };
    
    const checkInactivity = () => {
      // Mark as inactive after 2 minutes of no interaction
      setIsActive(false);
    };
    
    // Event listeners for tracking visibility and activity
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('mousemove', resetActivityTimer);
    document.addEventListener('keypress', resetActivityTimer);
    document.addEventListener('click', resetActivityTimer);
    document.addEventListener('scroll', resetActivityTimer);
    
    // Check for inactivity
    const inactivityTimer = setTimeout(checkInactivity, 2 * 60 * 1000);
    
    return () => {
      clearInterval(activityInterval.current);
      clearTimeout(inactivityTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('mousemove', resetActivityTimer);
      document.removeEventListener('keypress', resetActivityTimer);
      document.removeEventListener('click', resetActivityTimer);
      document.removeEventListener('scroll', resetActivityTimer);
    };
  }, [auth.loggedIn, user, isVisible, isActive, dailyUsage, dailyLimit, limitReached]);

  // Format time as mm:ss or hh:mm:ss
  const formatTime = (seconds) => {
    if (seconds < 0) seconds = 0;
    
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    dailyUsage,
    dailyLimit,
    limitReached, 
    grayscaleLevel,
    timeRemaining: Math.max(0, dailyLimit - dailyUsage),
    formattedUsage: formatTime(dailyUsage),
    formattedLimit: formatTime(dailyLimit),
    formattedRemaining: formatTime(dailyLimit - dailyUsage),
    usagePercentage: Math.min(100, (dailyUsage / dailyLimit) * 100)
  };
} 