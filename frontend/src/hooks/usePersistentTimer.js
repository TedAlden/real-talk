import { useState, useEffect } from "react";

// LocalStorage keys for timer state
const TIME_LIMIT_KEY = "usage_time_limit";
const TIME_REMAINING_KEY = "time_remaining";
const LAST_LOGIN_DATE_KEY = "last_login_date";
const DEFAULT_TIME_LIMIT = 20 * 60; // Default 20 minute time limit

/**
 * Get the current date in YYYY-MM-DD format.
 */
const getCurrentDate = () => new Date().toISOString().split("T")[0];

/**
 * Get the time limit from localStorage or set it to the default.
 */
const getTimeLimit = () => {
  const storedTimeLimit = localStorage.getItem(TIME_LIMIT_KEY);
  if (!storedTimeLimit) {
    const timeLimit = DEFAULT_TIME_LIMIT;
    localStorage.setItem(TIME_LIMIT_KEY, timeLimit);
    return timeLimit;
  }
  return parseInt(storedTimeLimit);
};

/**
 * Get the last login date from localStorage or set it to the current date.
*/
const getLastLoginDate = () => {
  const storedDate = localStorage.getItem(LAST_LOGIN_DATE_KEY);
  if (!storedDate) {
    const currentDate = getCurrentDate();
    localStorage.setItem(LAST_LOGIN_DATE_KEY, currentDate);
    return currentDate;
  }
  return storedDate;
};

/**
 * Get the remaining time from localStorage or set it to the time limit.
 */
const getTimeRemaining = () => {
  const storedTimeRemaining = localStorage.getItem(TIME_REMAINING_KEY);
  if (!storedTimeRemaining) {
    const timeRemaining = getTimeLimit();
    localStorage.setItem(TIME_REMAINING_KEY, timeRemaining);
    return timeRemaining;
  }
  return parseInt(storedTimeRemaining);
};

/**
 * Hook for managing persistent countdown timer across sessions.
 * Handles daily timer reset and localStorage synchronization.
 * @param {number} totalTimeInSeconds - Total time allocation.
 * @param {boolean} isTimerActive - Timer running state.
 * @param {Function} onTimeRunout - Callback when timer reaches zero.
 */
const usePersistentTimer = ({
  isTimerActive,
  onTimeRunout,
}) => {
  const [timeLimit, setTimeLimit] = useState(DEFAULT_TIME_LIMIT);
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_TIME_LIMIT);

  useEffect(() => {
    // Read values from localStorage
    const _timeLimit = getTimeLimit();
    const _timeRemaining = getTimeRemaining();
    const _lastLoginDate = getLastLoginDate();
    const _currentDate = getCurrentDate();

    // Set time limit...
    setTimeLimit(_timeLimit);

    // Set time remaining...
    // If the user's last login was not today (i.e., it was yesterday or
    // earlier), reset their daily usage timer to the time limit.
    if (_lastLoginDate !== _currentDate) {
      localStorage.setItem(TIME_REMAINING_KEY, _timeLimit);
      localStorage.setItem(LAST_LOGIN_DATE_KEY, _currentDate);
      setTimeRemaining(_timeLimit);
    } else {
      setTimeRemaining(_timeRemaining);
    }

  }, []);

  // Main timer countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Only decrement the time remaining if the timer is active
      if (isTimerActive) {
        // Decrement time remaining by 1 second
        setTimeRemaining((previousTimeRemaining) => {
          const newTimeRemaining = previousTimeRemaining - 1;
          localStorage.setItem(TIME_REMAINING_KEY, newTimeRemaining);
          localStorage.setItem(LAST_LOGIN_DATE_KEY, getCurrentDate());
          // If time remaining reaches 0, kill the setInterval
          if (newTimeRemaining <= 0) {
            clearInterval(interval);
            // Call the onTimeRunout callback if provided
            onTimeRunout?.();
          }
          return newTimeRemaining;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerActive, onTimeRunout]);

  /**
   * Set a new maximum time limit for the timer.
   */
  const setLimit = (newTimeLimit) => {
    // Ensure the new time limit is a positive number
    if (isNaN(newTimeLimit) || newTimeLimit <= 0) {
      throw new Error("Invalid time limit");
    }
    // Update the time limit in localStorage and state
    setTimeLimit(newTimeLimit);
    localStorage.setItem(TIME_LIMIT_KEY, newTimeLimit);
    // If the new time limit is less than the current time remaining, set the
    // time remaining to the new time limit. This ensures that the user doesn't
    // have more time than the new limit.
    if (timeRemaining > newTimeLimit) {
      setTimeRemaining(newTimeLimit);
      localStorage.setItem(TIME_REMAINING_KEY, newTimeLimit);
    }
  };

  return {
    timeLimit,
    timeRemaining,
    setLimit,
  };
};

export default usePersistentTimer;
