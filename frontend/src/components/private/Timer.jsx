import React, { useState } from "react";
import { Button, Progress } from "flowbite-react";
import usePersistentTimer from "../../hooks/usePersistentTimer";

function Timer() {
  const [isLogin, setIsLogin] = useState(false);

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

  const progressLabel = timeRemaining / timerSeconds;

  const handleLogin = () => setIsLogin(true);
  const handleLogout = () => setIsLogin(false);

  return (
    <div>
      <Progress progress={progressLabel} size="xl" labelProgress="45%" />
      <Button onClick={resetCountdownTimer}></Button>
    </div>
  );
}

export default Timer;
