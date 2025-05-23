import { useState, useEffect, useRef } from "react";

const REMINDERS_ENABLED_KEY = "usage_reminders_enabled";
const TIME_REMAINING_KEY = "time_remaining";

const REMINDER_TIMEOUT = 10 * 1000; // 10 seconds
const DEFAULT_REMINDERS_ENABLED = true;
const DEFAULT_THRESHOLDS = [
  { threshold: 10 * 60, message: "10 minutes left" },
  { threshold: 5 * 60, message: "5 minutes left" },
  { threshold: 3 * 60, message: "3 minutes left" },
  { threshold: 1 * 60, message: "1 minute left" },
];

/**
 * Get the remaining time from localStorage or set it to the time limit.
 */
const getRemindersEnabled = () => {
  const storedRemindersEnabled = localStorage.getItem(REMINDERS_ENABLED_KEY);
  if (!storedRemindersEnabled) {
    localStorage.setItem(REMINDERS_ENABLED_KEY, DEFAULT_REMINDERS_ENABLED);
    return DEFAULT_REMINDERS_ENABLED;
  }
  return storedRemindersEnabled === "true";
};

/**
 * Hook for managing timed alert notifications.
 * Tracks screen time thresholds and displays alerts.
 * @param {Object[]} thresholds - Array of time thresholds and messages.
 * @param {string} title - Alert title.
 * @param {string} color - Alert color scheme.
 */
export default function useAlert({
  thresholds = DEFAULT_THRESHOLDS,
  title = "Screen Time Alert",
  color = "info",
} = {}) {
  // Track alert visibility and current message
  const [remindersEnabled, setRemindersEnabled] = useState(DEFAULT_REMINDERS_ENABLED);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  // Keep track of already triggered thresholds to avoid duplicates
  const firedRef = useRef(new Set());

  useEffect(() => {
    setRemindersEnabled(getRemindersEnabled());
  }, []);

  useEffect(() => {
    // Set up timer to check remaining time every second
    const interval = setInterval(() => {
      // Get and parse remaining time from localStorage
      const stored = localStorage.getItem(TIME_REMAINING_KEY);
      const timeRemaining = stored !== null ? parseInt(stored, 10) : NaN;
      if (isNaN(timeRemaining)) return;

      // Check each threshold and show alert if time matches
      thresholds.forEach(({ threshold, message }) => {
        if (
          timeRemaining === threshold &&
          !firedRef.current.has(threshold) &&
          remindersEnabled
        ) {
          // Mark threshold as triggered
          firedRef.current.add(threshold);
          // Show alert with threshold message
          setMessage(message);
          setShow(true);
          // Auto-hide alert after 7.5 seconds
          setTimeout(() => {
            setShow(false);
          }, REMINDER_TIMEOUT);
        }
      });
    }, 1000);
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [thresholds, remindersEnabled]);

  // Handler to manually close alert
  const onClose = () => setShow(false);

  // Expose alert state and controls
  return { show, title, message, color, onClose };
}
