import { useState, useEffect, useRef } from 'react';

/**
 * Hook for managing timed alert notifications
 * Tracks screen time thresholds and displays alerts
 * @param {Object[]} thresholds - Array of time thresholds and messages
 * @param {string} title - Alert title
 * @param {string} color - Alert color scheme
 */
export default function useAlert({
  thresholds = [
    { threshold: 601, message: "10 minutes left" },
    { threshold: 301, message: "5 minutes left" },
    { threshold: 181, message: "3 minutes left" },
    { threshold: 61,  message: "1 minute left" },
  ],
  title = 'Screen Time Alert',
  color = 'info'
} = {}) {
  // Track alert visibility and current message
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  // Keep track of already triggered thresholds to avoid duplicates
  const firedRef = useRef(new Set());

  useEffect(() => {
    // Check if reminders are enabled in user preferences
    const enabled = localStorage.getItem('usage_reminders_enabled') === 'true';
    if (!enabled) {
      setShow(false);
      return;
    }

    // Set up timer to check remaining time every second
    const interval = setInterval(() => {
      // Get and parse remaining time from localStorage
      const stored = localStorage.getItem('time_remaining');
      const timeRemaining = stored !== null ? parseInt(stored, 10) : NaN;
      if (isNaN(timeRemaining)) return;

      // Check each threshold and show alert if time matches
      thresholds.forEach(({ threshold, message }) => {
        if (timeRemaining === threshold && !firedRef.current.has(threshold)) {
          // Mark threshold as triggered
          firedRef.current.add(threshold);
          // Show alert with threshold message
          setMessage(message);
          setShow(true);

          // Auto-hide alert after 7.5 seconds
          setTimeout(() => {
            setShow(false);
          }, 7500);
        }
      });
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [thresholds]);

  // Handler to manually close alert
  const onClose = () => setShow(false);

  // Expose alert state and controls
  return { show, title, message, color, onClose };
}
