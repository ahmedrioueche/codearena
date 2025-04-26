import React, { useMemo } from "react";
import useScreen from "../../../../../hooks/useScreen";

interface TimeProgressBarProps {
  currentTime: number; // In seconds
  averageTime: number; // In minutes
}

const TimeProgressBar: React.FC<TimeProgressBarProps> = ({
  currentTime,
  averageTime,
}) => {
  const { isMobile } = useScreen();
  const averageTimeInSeconds = averageTime * 60; // Convert minutes to seconds

  const progress = useMemo(() => {
    if (averageTimeInSeconds <= 0) return 0; // Prevent NaN by handling division by zero
    const percentage = (currentTime / averageTimeInSeconds) * 100;
    return Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100
  }, [currentTime, averageTimeInSeconds]);

  const progressColor = useMemo(() => {
    if (currentTime === 0 || averageTimeInSeconds <= 0) return "bg-gray-400"; // Initial state (Gray)
    if (currentTime > averageTimeInSeconds) return "bg-red-500"; // Over time (Red)
    if (progress > 80) return "bg-yellow-500"; // Approaching limit (Yellow)
    return "bg-gradient-to-r from-light-primary to-dark-primary dark:from-dark-primary dark:to-light-primary"; // Default (Gradient)
  }, [currentTime, averageTimeInSeconds, progress]);

  const timeRemaining = useMemo(() => {
    const remaining = Math.max(averageTimeInSeconds - currentTime, 0);
    return Math.ceil(remaining / 60); // Convert back to minutes
  }, [currentTime, averageTimeInSeconds]);

  const progressText = useMemo(() => {
    if (currentTime === 0) return "Just started...";
    if (progress >= 100) return "Time Over!";
    if (progress > 80) return "Almost done!";
    return `${timeRemaining} minutes left`;
  }, [currentTime, progress, timeRemaining]);

  return (
    <div className="w-full max-w-[400px] flex flex-col items-center space-y-2">
      {/* Label for better UX */}
      {!isMobile && (
        <p className="text-sm font-medium text-light-foreground dark:text-dark-foreground">
          {progressText}
        </p>
      )}

      {/* Progress Bar Container */}
      <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-full shadow-inner overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-in-out ${progressColor}`}
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
    </div>
  );
};

export default TimeProgressBar;
