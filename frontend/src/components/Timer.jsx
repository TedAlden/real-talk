import { Progress } from "flowbite-react";
import usePersistentTimer from "../hooks/usePersistentTimer";
import useAuth from "../hooks/useAuth";

/**
 * Timer component that tracks daily usage time and applies grayscale effect
 * Auto-logs out user when time runs out
 */
function Timer() {
  const { loggedIn, logout } = useAuth();

  const { timeLimit, timeRemaining } = usePersistentTimer({
    isTimerActive: loggedIn,
    onTimeRunout: logout,
  });

  const getTimerMinutes = () => Math.floor(timeRemaining / 60);
  const getTimerSeconds = () => timeRemaining % 60;
  const getProgress = () => (timeRemaining / timeLimit) * 100;

  return (
    <div className="w-full" role="timerbar">
      <div className="flex justify-center">
        <div className="pointer-events-none absolute dark:text-white">
          {getTimerMinutes()}:{getTimerSeconds().toString().padStart(2, "0")}
        </div>
      </div>
      <Progress progress={getProgress()} size="xl" />
    </div>
  );
}

export default Timer;
