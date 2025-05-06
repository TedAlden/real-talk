import { useState, useEffect } from "react";

// Storage keys for timer persistence
const timerKey = "time_remaining";
const dateKey = "last_login_date";

/**
 * Hook for managing persistent countdown timer across sessions
 * Handles daily timer reset and localStorage synchronization
 * @param {number} totalTimeInSeconds - Total time allocation
 * @param {boolean} isTimerActive - Timer running state
 * @param {Function} onTimeRunout - Callback when timer reaches zero
 */
const usePersistentTimer = ({
  totalTimeInSeconds,
  isTimerActive,
  onTimeRunout,
}) => {
  // Get current date for daily reset check
  const getLoginDate = () => new Date().toISOString().split("T")[0];

  // Initialize timer from storage or default
  const getStoredValues = () => {
    const storedTime = localStorage.getItem(timerKey);
    const storedDate = localStorage.getItem(dateKey);

    // If date has changed, reset countdown timer and store new variables
    if (storedDate !== getLoginDate()) {
      localStorage.setItem(timerKey, storedTime);
      localStorage.setItem(dateKey, getLoginDate());
      return totalTimeInSeconds;
    }
    return storedTime ? parseInt(storedTime) : totalTimeInSeconds;
  };

  // Timer state management
  const [timeRemaining, setTimeRemaining] = useState(getStoredValues);

  // Main timer countdown effect
  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((previous) => {
        const next = previous - 1;
        localStorage.setItem(timerKey, next);
        localStorage.setItem(dateKey, getLoginDate());
        if (next <= 0) {
          clearInterval(interval);
          onTimeRunout?.();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining, onTimeRunout]);

  // Handle time limit updates
  useEffect(() => {
    if (totalTimeInSeconds < timeRemaining) {
      setTimeRemaining(totalTimeInSeconds);
    }
  }, [totalTimeInSeconds]);

  const resetCountdownTimer = () => {
    setTimeRemaining(totalTimeInSeconds);
    localStorage.setItem(timerKey, totalTimeInSeconds);
  };

  return {
    timeRemaining,
    timerMinutes: Math.floor(timeRemaining / 60),
    timerSeconds: timeRemaining % 60,
    resetCountdownTimer,
  };
};

export default usePersistentTimer;
