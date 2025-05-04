import React from "react";
import { Progress } from "flowbite-react";
import usePersistentTimer from "../hooks/usePersistentTimer";
import useAuth from "../hooks/useAuth";

import { useContext, useEffect, useState } from "react";
import { GrayscaleContext } from "../App";

function Timer() {
  const auth = useAuth();
  const totalTimeInSeconds = 1200;

  const { logout } = useAuth();
  const { setGrayscale } = useContext(GrayscaleContext);
  const [isAdmin, setIsAdmin] = useState(false);
  const { timeRemaining, timerMinutes, timerSeconds, resetCountdownTimer } =
    usePersistentTimer({
      totalTimeInSeconds,
      isTimerActive: auth.loggedIn && !isAdmin,
      // Auto logout line VVVVVVVVVVVVVVVVVV
      onTimeRunout: logout,
    });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await auth.getUser();
        if (user && user.is_admin) {
          resetCountdownTimer();
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [auth, resetCountdownTimer]);

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
