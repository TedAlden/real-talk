import { useEffect, useState } from 'react';
import useScreenTime from '../hooks/useScreenTime';
import useAuth from '../hooks/useAuth';

/**
 * GrayscaleFilter applies a progressive grayscale filter to the entire app
 * based on the user's screen time usage.
 * 
 * As the user approaches their daily limit, the app gradually turns grayscale,
 * making it less visually stimulating to discourage excessive use.
 */
function GrayscaleFilter() {
  const auth = useAuth();
  const { grayscaleLevel, limitReached } = useScreenTime();
  const [appliedLevel, setAppliedLevel] = useState(0);
  const [bedtimeGrayscale, setBedtimeGrayscale] = useState(false);
  
  // Check if current time is within bedtime grayscale period
  useEffect(() => {
    const checkBedtimeGrayscale = async () => {
      if (!auth.loggedIn) return;
      
      try {
        const userData = await auth.getUser();
        const bedtimeSettings = userData.anti_addiction?.bedtime_grayscale;
        
        if (bedtimeSettings?.enabled) {
          const now = new Date();
          const currentTime = now.getHours() * 60 + now.getMinutes();
          
          // Parse start and end times
          const [startHours, startMinutes] = bedtimeSettings.start_time.split(':').map(Number);
          const [endHours, endMinutes] = bedtimeSettings.end_time.split(':').map(Number);
          
          const startTime = startHours * 60 + startMinutes;
          const endTime = endHours * 60 + endMinutes;
          
          // Check if current time is within the bedtime period
          // Handle cases where bedtime crosses midnight
          if (startTime > endTime) {
            // Period crosses midnight (e.g., 22:00 to 06:00)
            setBedtimeGrayscale(currentTime >= startTime || currentTime <= endTime);
          } else {
            // Normal period within the same day
            setBedtimeGrayscale(currentTime >= startTime && currentTime <= endTime);
          }
        } else {
          setBedtimeGrayscale(false);
        }
      } catch (error) {
        console.error('Error checking bedtime grayscale:', error);
      }
    };
    
    // Check bedtime settings immediately
    checkBedtimeGrayscale();
    
    // Set up interval to check bedtime settings every minute
    const bedtimeInterval = setInterval(checkBedtimeGrayscale, 60 * 1000);
    
    return () => clearInterval(bedtimeInterval);
  }, [auth]);
  
  // Calculate the final grayscale level based on usage and bedtime settings
  useEffect(() => {
    // If bedtime grayscale is active, set to 100% grayscale
    if (bedtimeGrayscale) {
      setAppliedLevel(1);
    } else {
      // Otherwise use the level based on screen time usage
      setAppliedLevel(grayscaleLevel);
    }
  }, [grayscaleLevel, bedtimeGrayscale]);
  
  // Apply the grayscale filter to the root element
  useEffect(() => {
    const rootElement = document.documentElement;
    
    // Only apply if there's some grayscale to apply
    if (appliedLevel > 0) {
      // Calculate filter value (0 to 100%)
      const filterValue = `grayscale(${Math.min(100, Math.round(appliedLevel * 100))}%)`;
      rootElement.style.filter = filterValue;
      
      // Add transition effect for smoother experience
      rootElement.style.transition = 'filter 0.5s ease-in-out';
    } else {
      // Remove filter when not needed
      rootElement.style.filter = '';
    }
    
    return () => {
      // Clean up filter when component unmounts
      rootElement.style.filter = '';
      rootElement.style.transition = '';
    };
  }, [appliedLevel]);
  
  // Render nothing - this is just a utility component
  return null;
}

export default GrayscaleFilter; 