"use client";

import React from 'react';

export function LeakRadar({
  tusCostosPct = [32, 21, 14, 11, 18, 4],
  benchmarkIdealPct = [12, 20, 12, 8, 43, 5],
  labels = ["Comisiones", "Limpieza", "Servicios", "Mantenimiento", "Impuestos", "Otros"],
  showEfficientBox = true,
}: {
  tusCostosPct?: number[];
  benchmarkIdealPct?: number[];
  labels?: string[];
  showEfficientBox?: boolean;
}) {
  const radarCenter = 150;
  const maxRadius = 100;
  const concentricLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getRadarPointUser = (index: number) => {
    const angle = (index * 60 - 90) * (Math.PI / 180);
    const userCost = tusCostosPct[index] ?? 0;
    const idealCost = benchmarkIdealPct[index] ?? 1;
    
    const deviation = userCost / (idealCost || 1);
    const R_ideal = 70;
    let r = R_ideal;
    
    if (deviation > 1) {
      const excess = deviation - 1;
      r = R_ideal + (maxRadius - R_ideal) * Math.min(1.0, excess / 2.0);
    } else {
      r = R_ideal * deviation;
    }
    
    const x = radarCenter + r * Math.cos(angle);
    const y = radarCenter + r * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const userPoints = (tusCostosPct || [32, 21, 14, 11, 18, 4])
    .map((_, idx) => getRadarPointUser(idx))
    .join(" ");

  const idealPoints = Array.from({ length: 6 }).map((_, idx) => {
    const angle = (idx * 60 - 90) * (Math.PI / 180);
    const r = 70; 
    const x = radarCenter + r * Math.cos(angle);
    const y = radarCenter + r * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  // Identify efficient categories
  const efficientCategories = labels.map((label, index) => {
    const userCost = tusCostosPct[index] ?? 0;
    const idealCost = benchmarkIdealPct[index] ?? 1;
    const excess = userCost - idealCost;
    return { label, excess };
  }).filter(cat => cat.excess <= 3); // list those with 3% or less excess

  return (
    <div className="relative w-full max-w-[320px] flex flex-col items-center justify-center select-none">
      
      {/* Radar SVG */}
      <div className="relative w-full aspect-square flex items-center justify-center">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* Radial Gradient for Glow Effect */}
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00D1B2" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#00D1B2" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#00D1B2" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Concentric Hexagons Grid (Increased opacity for crisp definition) */}
          {concentricLevels.map((lvl, levelIdx) => {
            const points = Array.from({ length: 6 }).map((_, idx) => {
              const angle = (idx * 60 - 90) * (Math.PI / 180);
              const r = maxRadius * lvl;
              const x = radarCenter + r * Math.cos(angle);
              const y = radarCenter + r * Math.sin(angle);
              return `${x},${y}`;
            }).join(" ");
            return (
              <polygon 
                key={levelIdx} 
                points={points} 
                fill="none" 
                stroke="rgba(255,255,255,0.08)" 
                strokeWidth="1" 
              />
            );
          })}

          {/* Radial Grid Axis (Increased opacity) */}
          {Array.from({ length: 6 }).map((_, idx) => {
            const angle = (idx * 60 - 90) * (Math.PI / 180);
            const x = radarCenter + maxRadius * Math.cos(angle);
            const y = radarCenter + maxRadius * Math.sin(angle);
            return (
              <line 
                key={idx} 
                x1={radarCenter} 
                y1={radarCenter} 
                x2={x} 
                y2={y} 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="1" 
              />
            );
          })}

          {/* Benchmark Ideal Hexagon (Dashed line) */}
          <polygon 
            points={idealPoints} 
            fill="none" 
            stroke="rgba(255,255,255,0.2)" 
            strokeWidth="1.5" 
            strokeDasharray="3,3" 
          />

          {/* User Data Polygon Glow Filled Area */}
          <polygon 
            points={userPoints} 
            fill="url(#radarGlow)" 
          />

          {/* User Data Polygon Outline (Teal/Cian Sharp Border) */}
          <polygon 
            points={userPoints} 
            fill="none" 
            stroke="#00D1B2" 
            strokeWidth="2" 
          />

          {/* User Vertices Dots */}
          {tusCostosPct.map((_, idx) => {
            const pts = getRadarPointUser(idx).split(",");
            const x = parseFloat(pts[0] ?? '150');
            const y = parseFloat(pts[1] ?? '150');
            return (
              <circle 
                key={idx} 
                cx={x} 
                cy={y} 
                r="4.5" 
                fill="#00D1B2" 
                stroke="#0B0C10" 
                strokeWidth="1.5" 
              />
            );
          })}

          {/* Vertex Labels (Dynamic Inline Excess Percentages) */}
          {labels.map((label, idx) => {
            const angle = (idx * 60 - 90) * (Math.PI / 180);
            const x = radarCenter + 120 * Math.cos(angle);
            const y = radarCenter + 120 * Math.sin(angle);
            
            const cosVal = Math.cos(angle);
            const anchor = Math.abs(cosVal) < 0.1 ? 'middle' : cosVal > 0.1 ? 'start' : 'end';
            
            const userCost = tusCostosPct[idx] ?? 0;
            const idealCost = benchmarkIdealPct[idx] ?? 1;
            const excess = userCost - idealCost;
            const displayLabel = excess > 0 ? `${label} (+${excess}%)` : label;

            return (
              <text 
                key={idx} 
                x={x} 
                y={y + 4} 
                fill="rgba(255,255,255,0.5)" 
                fontSize="9.5" 
                fontWeight="700"
                textAnchor={anchor}
                className="font-sans uppercase tracking-wider"
              >
                {displayLabel}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend below the radar */}
      <div className="mt-4 flex items-center gap-6 text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest justify-center select-none w-full">
        <div className="flex items-center gap-2 select-none">
          <span className="h-[2px] w-4 bg-[#00D1B2] rounded" />
          <span>Tú</span>
        </div>
        <div className="flex items-center gap-2 select-none">
          <span className="h-[2px] w-4 border-t-2 border-dashed border-zinc-600" />
          <span>Benchmark ideal</span>
        </div>
      </div>

      {/* Rubros Eficientes Container */}
      {showEfficientBox && efficientCategories.length > 0 && (
        <div className="mt-6 w-full rounded-2xl border border-[#161B26] bg-[#0E1218]/40 p-4 text-left shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-[1px] w-4 bg-[#00D1B2]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00D1B2]">
              Rubros Eficientes
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {efficientCategories.map((cat) => {
              const isFullyOptimized = cat.excess <= 0;
              return (
                <span 
                  key={cat.label} 
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold leading-none flex items-center gap-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.15)] ${
                    isFullyOptimized
                      ? 'bg-[#10B981]/5 border border-[#10B981]/25 text-[#10B981]'
                      : 'bg-white/5 border border-white/10 text-zinc-300'
                  }`}
                >
                  {cat.label}
                  {isFullyOptimized ? (
                    <span className="text-[10px] text-[#10B981] font-bold">✓</span>
                  ) : (
                    <span className="text-[8px] opacity-80">(+{cat.excess}%)</span>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
