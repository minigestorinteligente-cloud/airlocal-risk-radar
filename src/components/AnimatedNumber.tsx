"use client";

import { useEffect, useRef } from "react";

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
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let startTimestamp: number | null = null;
    let fallbackTimer: NodeJS.Timeout;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Función de "easing" para un efecto casino fluido al final (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeProgress * value);
      
      if (spanRef.current) {
        spanRef.current.textContent = `${prefix}${currentVal.toLocaleString('en-US')}${suffix}`;
      }
      
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        if (spanRef.current) {
          spanRef.current.textContent = `${prefix}${value.toLocaleString('en-US')}${suffix}`;
        }
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    // Fallback de seguridad por si requestAnimationFrame es bloqueado en móviles (ej: ahorro de energía)
    fallbackTimer = setTimeout(() => {
      if (spanRef.current) {
        spanRef.current.textContent = `${prefix}${value.toLocaleString('en-US')}${suffix}`;
      }
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    }, duration + 150);

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      clearTimeout(fallbackTimer);
    };
  }, [value, duration, prefix, suffix]);

  return (
    <span ref={spanRef} className={className} translate="no">
      {prefix}{(0).toLocaleString('en-US')}{suffix}
    </span>
  );
}
