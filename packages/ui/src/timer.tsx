import { JSX, useEffect, useState, useCallback, useRef } from "react";

export interface TimerProps {
  initialTime: number; // Time in seconds
  onTimeUp: () => void;
  onTick?: (remainingTime: number) => void;
  isRunning?: boolean;
  isPaused?: boolean;
  showProgress?: boolean;
}

export function Timer({
  initialTime,
  onTimeUp,
  onTick,
  isRunning = true,
  isPaused = false,
  showProgress = true,
}: TimerProps): JSX.Element {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(isRunning);
  const hasTriggeredTimeUp = useRef(false);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }, []);

  // Calculate progress percentage
  const progressPercentage = ((initialTime - timeLeft) / initialTime) * 100;

  useEffect(() => {
    setTimeLeft(initialTime);
    hasTriggeredTimeUp.current = false;
  }, [initialTime]);

  useEffect(() => {
    setIsActive(isRunning && !isPaused);
  }, [isRunning, isPaused]);

  // Handle time up callback
  useEffect(() => {
    if (timeLeft === 0 && !hasTriggeredTimeUp.current) {
      hasTriggeredTimeUp.current = true;
      // Use setTimeout to ensure this runs after the current render cycle
      setTimeout(() => {
        onTimeUp();
      }, 0);
    }
  }, [timeLeft, onTimeUp]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          onTick?.(newTime);

          if (newTime <= 0) {
            setIsActive(false);
            return 0;
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft, onTick]);

  // Determine timer color based on remaining time
  const getTimerColor = () => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage <= 20) return "text-red-600";
    if (percentage <= 40) return "text-orange-500";
    if (percentage <= 60) return "text-yellow-500";
    return "text-green-600";
  };

  const getProgressColor = () => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage <= 20) return "bg-red-500";
    if (percentage <= 40) return "bg-orange-500";
    if (percentage <= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className={`flex flex-col items-center space-y-2`}>
      {/* Timer Display */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div
            className={`text-3xl font-bold ${getTimerColor()} transition-colors duration-300`}
          >
            {formatTime(timeLeft)}
          </div>
          {!isActive && timeLeft > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-sm text-gray-500 bg-white/80 px-2 py-1 rounded">
                Paused
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {showProgress && (
        <div className="w-full max-w-xs">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
