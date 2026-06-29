"use client";

import React from 'react';
import { TrendingUp } from 'lucide-react';

export function HealthGauge({ score, riskLevel }: { score: number; riskLevel?: string }) {
  const colors = {
    LOW: {
      start: "#00D1B2",
      end: "#10B981",
      accent: "#00D1B2"
    },
    MEDIUM: {
      start: "#FFB800",
      end: "#FFA800",
      accent: "#FFB800"
    },
    HIGH: {
      start: "#FF2D2D",
      end: "#E02424",
      accent: "#FF2D2D"
    }
  };

  // 1. Dynamic colors of the gauge based strictly on score_final (score)
  const scoreClamped = Math.min(100, Math.max(0, score));
  const scoreRisk = scoreClamped >= 70 ? 'LOW' : scoreClamped >= 40 ? 'MEDIUM' : 'HIGH';
  const gaugeColors = colors[scoreRisk];

  // 2. Textual badge color aligned with cabecera.risk_level (riskLevel)
  const badgeRisk = (riskLevel?.toUpperCase() as 'LOW' | 'MEDIUM' | 'HIGH') || 'MEDIUM';
  const badgeColors = colors[badgeRisk] || colors.MEDIUM;

  const cx = 100;
  const cy = 105;
  const r = 70;

  // Calculate tip coordinates for the circle dot at the end of progress
  const angleInRad = Math.PI - (scoreClamped / 100) * Math.PI;
  const tx = cx + r * Math.cos(angleInRad);
  const ty = cy - r * Math.sin(angleInRad);

  // Generate ticks (radial scale marks)
  const ticks = [];
  const totalTicks = 11; // 0%, 10%, ..., 100%
  for (let i = 0; i < totalTicks; i++) {
    const tickAngle = Math.PI - (i / (totalTicks - 1)) * Math.PI;
    const rInner = 78;
    const rOuter = 88;
    const x1 = cx + rInner * Math.cos(tickAngle);
    const y1 = cy - rInner * Math.sin(tickAngle);
    const x2 = cx + rOuter * Math.cos(tickAngle);
    const y2 = cy - rOuter * Math.sin(tickAngle);
    ticks.push({ x1, y1, x2, y2 });
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-2 transition-all duration-300 hover:scale-102 shrink-0 select-none w-full max-w-[320px]">
      
      {/* SVG Canvas for Gauge, Ticks, and Tip Circle (Scaled up to match Radar Chart) */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <svg viewBox="0 0 200 130" className="w-full h-full">
          <defs>
            <linearGradient id="healthGaugeGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gaugeColors.start} />
              <stop offset="100%" stopColor={gaugeColors.end} />
            </linearGradient>
          </defs>

          {/* Radial Ticks Background (Thicker for higher definition) */}
          {ticks.map((tick, index) => (
            <line
              key={index}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke="#222530"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}

          {/* Background Arc (Thicker stroke) */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="#171A24"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Active Progress Arc (Thicker stroke) */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="url(#healthGaugeGradient2)"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="220"
            strokeDashoffset={220 - (220 * scoreClamped) / 100}
            className="transition-all duration-1000 ease-out"
          />

          {/* Dot Indicator at the tip of the progress */}
          <circle
            cx={tx}
            cy={ty}
            r="10"
            fill={gaugeColors.accent}
            stroke="#0B0C10"
            strokeWidth="4"
            className="transition-all duration-1000 ease-out"
          />
          <circle
            cx={tx}
            cy={ty}
            r="3"
            fill="#0B0C10"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Score text overlay - massive typography */}
        <div className="absolute bottom-2 left-0 right-0 flex items-baseline justify-center select-none">
          <span className="font-sans text-6xl md:text-7xl font-black text-white tracking-tighter leading-none select-none">
            {score}
          </span>
          <span className="text-zinc-500 font-sans text-base md:text-lg font-bold ml-1 leading-none select-none">
            /100
          </span>
        </div>
      </div>

      {/* Score de Salud Badge */}
      <div className="mt-4 px-3.5 py-1.5 bg-[#0E1218] border border-[#161B26] rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
        <TrendingUp className="w-3.5 h-3.5" style={{ color: badgeColors.accent }} />
        Score de Salud Operativa: {score}/100
      </div>
    </div>
  );
}
