import React from "react";
import { Progress } from "flowbite-react";
import usePersistentTimer from "../hooks/usePersistentTimer";
import useAuth from "../hooks/useAuth";

import { useContext, useEffect } from "react";
import { GrayscaleContext } from "../App";

/**
 * Timer component that tracks daily usage time and applies grayscale effect
 * Auto-logs out user when time runs out
 */
function Timer() {
  const auth = useAuth();
  // Default usage time limit in seconds
  const defaultTotal = 1200;

  // Get stored time limit and grayscale settings
  const stored = localStorage.getItem("usage_time_limit");
  const totalTimeInSeconds = stored ?
    parseInt(stored, 10)
    : defaultTotal;

  // Get stored grayscale level (0-100%)
  const storedGray = localStorage.getItem("usage_grayscale_level");
  const thresholdFraction = storedGray
    ? parseInt(storedGray, 10) / 100
    : 1;

  const { logout } = useAuth();
  const { setGrayscale } = useContext(GrayscaleContext);

  const { timeRemaining, timerMinutes, timerSeconds } =
    usePersistentTimer({
      totalTimeInSeconds,
      isTimerActive: auth.loggedIn,
      // Auto logout line VVVVVVVVVVVVVVVVVV
      onTimeRunout: logout,
    });
  
  // Update grayscale effect based on remaining time
  useEffect(() => {
    const halfWay = totalTimeInSeconds / 2;
    setGrayscale(timeRemaining >= halfWay ? thresholdFraction : 1);
  }, [timeRemaining, setGrayscale]);

  // Calculate progress percentage
  const progressLabel =
    100 - ((totalTimeInSeconds - timeRemaining) / totalTimeInSeconds) * 100;

  return (
    <div className="w-full" role="timerbar">
      <div className="flex justify-center">
        <div className="pointer-events-none absolute dark:text-white">
          {timerMinutes}:{String(timerSeconds).padStart(2, "0")}
        </div>
      </div>
      <Progress progress={progressLabel} size="xl" />
    </div>
  );
}

export default Timer;
