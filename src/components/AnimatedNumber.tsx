"use client";

import { useEffect, useState } from "react";

export default function AnimatedNumber({ 
  value, 
  prefix = "", 
  suffix = "", 
  duration = 1500, 
  className = "" 
}: { 
  value: number, 
  prefix?: string, 
  suffix?: string, 
  duration?: number, 
  className?: string 
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Función de "easing" para un efecto casino fluido al final (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * value));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  const formattedCount = count.toLocaleString('en-US');

  return (
    <span className={className}>
      {prefix}{formattedCount}{suffix}
    </span>
  );
}
