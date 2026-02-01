"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownProps {
  targetDate: string; // Format: "YYYY-MM-DDTHH:mm:ss" or ISO string
  className?: string;
  onComplete?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Countdown({
  targetDate,
  className,
  onComplete,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onComplete]);

  if (isComplete) {
    return (
      <div className={cn("text-green-600 font-semibold", className)}>
        Disponible maintenant !
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold orbitron">{timeLeft.days}</span>
        <span className="text-xs text-muted-foreground">j</span>
      </div>
      <span className="text-muted-foreground">:</span>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold orbitron">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className="text-xs text-muted-foreground">h</span>
      </div>
      <span className="text-muted-foreground">:</span>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold orbitron">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className="text-xs text-muted-foreground">m</span>
      </div>
      <span className="text-muted-foreground">:</span>
      <div className="flex items-center gap-1">
        <span className="text-2xl font-bold orbitron">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <span className="text-xs text-muted-foreground">s</span>
      </div>
    </div>
  );
}
