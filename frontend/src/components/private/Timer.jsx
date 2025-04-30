import React, { useState } from "react";
import { Button, Progress } from "flowbite-react";
import usePersistentTimer from "../../hooks/usePersistentTimer";

function Timer() {
  const [isLogin, setIsLogin] = useState(false);

  const totalTimeInSeconds = 1200;

  const {
    timeRemaining,
    loginDate,
    timerMinutes,
    timerSeconds,
    resetCountdownTimer,
  } = usePersistentTimer({
    totalTimeInSeconds: 1200,
    isTimerActive: isLogin,
    // onTimeRunout: () => setIsLogin(false),
  });

  const progressLabel =
    100 - ((totalTimeInSeconds - timeRemaining) / totalTimeInSeconds) * 100;

  const handleLogin = () => setIsLogin(true);
  const handleLogout = () => setIsLogin(false);

  return (
    <div>
      <div className="flex justify-center">
        <div className="pointer-events-none absolute dark:text-white">
          {timerMinutes}:{String(timerSeconds).padStart(2, "0")}
        </div>
      </div>
      <Progress progress={progressLabel} size="xl" />
      {/* <Button onClick={resetCountdownTimer}></Button>
      <Button onClick={handleLogin}>Start Timer</Button> */}
    </div>
  );
}

export default Timer;
