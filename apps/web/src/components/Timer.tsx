"use client";

import { useEffect, useState, useRef } from "react";
import { useQuizStore } from "@/store/useQuizStore";

export function Timer() {
  const { timeRemaining, updateTimer, isTimeUp } = useQuizStore();
  const [localTime, setLocalTime] = useState(timeRemaining);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef(timeRemaining);

  // Sync local time with store time when store changes (but not from our own updates)
  useEffect(() => {
    if (timeRemaining !== lastUpdateRef.current) {
      setLocalTime(timeRemaining);
      lastUpdateRef.current = timeRemaining;
    }
  }, [timeRemaining]);

  // Timer countdown logic
  useEffect(() => {
    if (localTime <= 0 || isTimeUp) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      const newTime = localTime - 1;
      setLocalTime(newTime);
      lastUpdateRef.current = newTime;
      updateTimer(newTime);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [localTime, isTimeUp, updateTimer]);

  const getTimerColor = (time: number) => {
    if (time <= 5) return "text-red-500";
    if (time <= 10) return "text-yellow-500";
    return "text-blue-500";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`text-2xl font-bold ${getTimerColor(localTime)}`}>
      {formatTime(localTime)}
    </div>
  );
}
