import { useState, useEffect } from "react";

const timerKey = "time_remaining";
const dateKey = "last_login_date";

const usePersistentTimer = ({
  totalTimeInSeconds,
  isTimerActive,
  onTimeRunout,
}) => {
  const getLoginDate = () => new Date().toISOString().split("T")[0];

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

  const [timeRemaining, setTimeRemaining] = useState(getStoredValues);

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

  useEffect(() => {
    if (totalTimeInSeconds < timeRemaining) {setTimeRemaining(totalTimeInSeconds)}
    
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
