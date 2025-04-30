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

  const progressLabel = ((totalTimeInSeconds - timeRemaining) / totalTimeInSeconds) * 100;

  const handleLogin = () => setIsLogin(true);
  const handleLogout = () => setIsLogin(false);

  return (
    <div>
      <Progress progress={progressLabel} size="xl" />
      <p>{timerMinutes}:{String(timerSeconds).padStart(2, "0")}</p>
      {/* <Button onClick={resetCountdownTimer}></Button> */}
      {/* <Button onClick={handleLogin}>Start Timer</Button> */}
    </div>
  );
}

export default Timer;
