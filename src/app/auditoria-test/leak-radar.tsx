"use client";

import React, { useState } from 'react';

// Rampa esmeralda (marca) para la dona de composición
const EMERALD = ['#34F5C5', '#00D1B2', '#12B49B', '#0E9A84', '#0C7D6B', '#0A5F52'];
// Semáforo tenue (solo en las barras de desviación)
const BAR_FILL = { green: 'rgba(61,214,140,.5)', yellow: 'rgba(240,200,90,.5)', red: 'rgba(240,100,100,.55)' } as const;
const BAR_TAG = { green: '#6FE3AE', yellow: '#F0C860', red: '#F06B6B' } as const;

export function LeakRadar({
  tusCostosPct = [33, 30, 15, 11, 7, 4],
  benchmarkIdealPct = [15, 10, 12, 5, 18, 3],
  labels = ["Comisiones", "Limpieza", "Servicios", "Mantenimiento", "Impuestos", "Otros"],
  actualPctRevenue,
  benchmarkPctRevenue,
  showEfficientBox = true,
}: {
  tusCostosPct?: number[];
  benchmarkIdealPct?: number[];
  labels?: string[];
  actualPctRevenue?: number[];
  benchmarkPctRevenue?: number[];
  showEfficientBox?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);

  // ── DONA: composición del gasto (% de costos) ──
  const CX = 110, R = 82, SW = 16, GAP = 9;
  const C = 2 * Math.PI * R;
  const totalC = tusCostosPct.reduce((a, b) => a + (b || 0), 0) || 1;
  let cum = 0;
  const segs = tusCostosPct.map((v, i) => {
    const len = ((v || 0) / totalC) * C;
    const dash = Math.max(0, len - GAP);
    const off = -cum + GAP / 2;
    cum += len;
    return { i, dash, off, color: EMERALD[i % EMERALD.length], pct: Math.round(v || 0), label: labels[i] || '' };
  });
  const centerV = hover != null ? `${Math.round(tusCostosPct[hover] || 0)}%` : '100%';
  const centerL = hover != null ? (labels[hover] || '') : 'de tu gasto';

  // ── BARRAS: desviación vs benchmark (% de ingreso) ──
  const hasBars = Array.isArray(actualPctRevenue) && actualPctRevenue.length > 0;
  const actual = actualPctRevenue || [];
  const bench = benchmarkPctRevenue || benchmarkIdealPct;
  const MAX = Math.max(20, ...actual.map(n => n || 0), ...bench.map(n => n || 0));
  const bars = labels.map((lb, i) => {
    const a = Math.round((actual[i] || 0) * 10) / 10;
    const bi = Math.round((bench[i] || 0) * 10) / 10;
    const dev = Math.round((a - bi) * 10) / 10;
    let st: keyof typeof BAR_FILL, tag: string;
    if (dev >= 2) { st = 'red'; tag = `fuga +${dev} pts`; }
    else if (dev <= -1) { st = 'green'; tag = 'bajo el ideal'; }
    else { st = 'yellow'; tag = 'al límite'; }
    return { lb, a, bi, st, tag, w: Math.min(100, Math.round((a / MAX) * 100)), il: Math.min(100, Math.round((bi / MAX) * 100)) };
  });

  return (
    <div className="w-full flex flex-col gap-7 select-none">
      {/* DONA */}
      <div>
        <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500 mb-3">¿Dónde se va tu dinero?</div>
        <div className="flex items-center gap-4">
          <svg width="150" height="150" viewBox="0 0 220 220" className="shrink-0" role="img" aria-label="Composición del gasto por categoría">
            <g transform="rotate(-90 110 110)">
              {segs.map(s => (
                <circle
                  key={s.i} cx={CX} cy={CX} r={R} fill="none"
                  stroke={s.color} strokeWidth={hover === s.i ? SW + 3 : SW} strokeLinecap="round"
                  strokeDasharray={`${s.dash} ${C - s.dash}`} strokeDashoffset={s.off}
                  style={{ opacity: hover == null || hover === s.i ? 1 : 0.28, transition: 'opacity .18s, stroke-width .18s', cursor: 'default' }}
                  onMouseEnter={() => setHover(s.i)} onMouseLeave={() => setHover(null)}
                />
              ))}
            </g>
            <text x="110" y="106" textAnchor="middle" fill="#E8F0ED" fontFamily="ui-monospace, monospace" fontSize="24" fontWeight="600">{centerV}</text>
            <text x="110" y="124" textAnchor="middle" fill="#8A9B94" fontFamily="ui-monospace, monospace" fontSize="9" letterSpacing="1.4" className="uppercase">{centerL}</text>
          </svg>
          <div className="flex flex-col gap-1.5 min-w-0 text-[12px]">
            {segs.map(s => (
              <div key={s.i} className="flex items-center gap-2 text-zinc-400" style={{ cursor: 'default' }}
                onMouseEnter={() => setHover(s.i)} onMouseLeave={() => setHover(null)}>
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.color }} />
                <span className="flex-1 whitespace-nowrap">{s.label}</span>
                <span className="text-white tabular-nums" style={{ fontFamily: 'ui-monospace, monospace' }}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BARRAS SEMÁFORO */}
      {hasBars && (
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500 mb-3">Tu gasto vs el ideal</div>
          <div className="flex flex-col gap-3.5">
            {bars.map((b, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-[13px] text-zinc-200">{b.lb}</span>
                  <span className="text-[11px] text-zinc-500 tabular-nums" style={{ fontFamily: 'ui-monospace, monospace' }}>
                    {b.a}% · ideal {b.bi}% <span style={{ color: BAR_TAG[b.st] }}>{b.tag}</span>
                  </span>
                </div>
                <div className="relative h-[9px] rounded-full" style={{ background: 'rgba(232,240,237,.05)' }}>
                  <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${b.w}%`, background: BAR_FILL[b.st] }} />
                  <div className="absolute w-[1.5px] rounded" style={{ left: `${b.il}%`, top: -4, bottom: -4, background: '#8A9B94', opacity: 0.85 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3.5 text-[10px] text-zinc-600" style={{ fontFamily: 'ui-monospace, monospace' }}>
            <span className="flex items-center gap-1.5"><i className="w-3 h-[3px] rounded-sm inline-block" style={{ background: BAR_FILL.green }} />holgura</span>
            <span className="flex items-center gap-1.5"><i className="w-3 h-[3px] rounded-sm inline-block" style={{ background: BAR_FILL.yellow }} />al límite</span>
            <span className="flex items-center gap-1.5"><i className="w-3 h-[3px] rounded-sm inline-block" style={{ background: BAR_FILL.red }} />fuga</span>
          </div>
        </div>
      )}
    </div>
  );
}
