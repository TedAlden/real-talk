import { useState, useEffect, useRef } from 'react';

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
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const firedRef = useRef(new Set());

  useEffect(() => {
    const enabled = localStorage.getItem('usage_reminders_enabled') === 'true';
    if (!enabled) {
      setShow(false);
      return;
    }

    const interval = setInterval(() => {
      const stored = localStorage.getItem('time_remaining');
      const timeRemaining = stored !== null ? parseInt(stored, 10) : NaN;
      if (isNaN(timeRemaining)) return;

      thresholds.forEach(({ threshold, message }) => {
        if (timeRemaining === threshold && !firedRef.current.has(threshold)) {
          firedRef.current.add(threshold);
          setMessage(message);
          setShow(true);

          setTimeout(() => {
            setShow(false);
          }, 7500);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [thresholds]);

  const onClose = () => setShow(false);

  return { show, title, message, color, onClose };
}
