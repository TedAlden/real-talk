import React from "react";
import { Progress } from "flowbite-react";
import usePersistentTimer from "../../hooks/usePersistentTimer";
import useAuth from "../../hooks/useAuth";

function Timer() {
  const auth = useAuth();
  const totalTimeInSeconds = 1200;

  const {
    timeRemaining,
    timerMinutes,
    timerSeconds,
    resetCountdownTimer,
  } = usePersistentTimer({
    totalTimeInSeconds,
    isTimerActive: auth.loggedIn,
  });

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
