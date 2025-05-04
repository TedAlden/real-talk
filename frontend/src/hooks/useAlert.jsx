import { useState, useEffect, useRef } from 'react';

export default function useAlert({
  thresholds = [601, 301, 181, 61],
  title = 'Time Warning',
  color = 'info'
} = {}) {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const firedRef = useRef(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem('time_remaining');
      const timeRemaining = stored !== null ? parseInt(stored, 10) : NaN;
      if (isNaN(timeRemaining)) return;

      thresholds.forEach((t) => {
        if (timeRemaining === t && !firedRef.current.has(t)) {
          firedRef.current.add(t);
          setMessage(`Only ${t} seconds remaining!`);
          setShow(true);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [thresholds]);

  const onClose = () => setShow(false);

  return { show, title, message, color, onClose };
}
