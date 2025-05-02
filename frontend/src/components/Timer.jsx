import React from "react";
import { Progress } from "flowbite-react";
import usePersistentTimer from "../hooks/usePersistentTimer";
import useAuth from "../hooks/useAuth";

import { useContext, useEffect } from "react";
import { GrayscaleContext } from "../App";

function Timer() {
  const auth = useAuth();
  // pull the user’s choice (in seconds) from localStorage or fallback to 20m
  const defaultTotal = 1200;
  const stored = localStorage.getItem("usage_time_limit");
  const totalTimeInSeconds = stored ?
    parseInt(stored, 10)
    : defaultTotal;

  const { logout } = useAuth();
  const { setGrayscale } = useContext(GrayscaleContext);

  const { timeRemaining, timerMinutes, timerSeconds } =
    usePersistentTimer({
      totalTimeInSeconds,
      isTimerActive: auth.loggedIn,
      // Auto logout line VVVVVVVVVVVVVVVVVV
      onTimeRunout: logout,
    });
  
  useEffect(() => {
    const halfWay = totalTimeInSeconds / 2;
    if (timeRemaining <= halfWay) {
      setGrayscale(1);
    } else {
      setGrayscale(0);
    }
  }, [timeRemaining, setGrayscale]);

  const progressLabel =
    100 - ((totalTimeInSeconds - timeRemaining) / totalTimeInSeconds) * 100;

  return (
    <div className="w-full">
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
