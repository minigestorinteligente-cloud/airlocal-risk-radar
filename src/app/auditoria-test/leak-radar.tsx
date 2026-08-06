"use client";

import React, { useState } from 'react';

const EMERALD = ['#34F5C5', '#00D1B2', '#12B49B', '#0E9A84', '#0C7D6B', '#0A5F52'];
const BAR_FILL = { green: 'rgba(61,214,140,.5)', yellow: 'rgba(240,200,90,.5)', red: 'rgba(240,100,100,.55)' } as const;
const BAR_TAG  = { green: '#6FE3AE', yellow: '#F0C860', red: '#F06B6B' } as const;

const CATEGORY_ICONS: Record<string, string> = {
  "Comisiones":    "/assets/icon-coin.webp",
  "Limpieza":      "/assets/icon-receipt.webp",
  "Servicios":     "/assets/icon-key.webp",
  "Mantenimiento": "/assets/icon-house.webp",
  "Impuestos":     "/assets/icon-tagdown.webp",
  "Otros":         "/assets/icon-piggybank.webp",
};

type SharedProps = {
  tusCostosPct?: number[];
  benchmarkIdealPct?: number[];
  labels?: string[];
  actualPctRevenue?: number[];
  benchmarkPctRevenue?: number[];
};

/* ─── shared calculators ─────────────────────────────────────────────────── */

function calcSegs(tusCostosPct: number[], labels: string[]) {
  const CX = 110, R = 82, SW = 16, GAP = 9;
  const C = 2 * Math.PI * R;
  const totalC = tusCostosPct.reduce((a, b) => a + (b || 0), 0) || 1;
  let cum = 0;
  return { CX, R, SW, GAP, C, segs: tusCostosPct.map((v, i) => {
    const len = ((v || 0) / totalC) * C;
    const dash = Math.max(0, len - GAP);
    const off  = -cum + GAP / 2;
    cum += len;
    return { i, dash, off, color: EMERALD[i % EMERALD.length], pct: Math.round(v || 0), label: labels[i] || '' };
  })};
}

function calcBars(labels: string[], actualPctRevenue: number[], bench: number[]) {
  const MAX = Math.max(20, ...actualPctRevenue.map(n => n || 0), ...bench.map(n => n || 0));
  return labels.map((lb, i) => {
    const a   = Math.round((actualPctRevenue[i] || 0) * 10) / 10;
    const bi  = Math.round((bench[i] || 0) * 10) / 10;
    const dev = Math.round((a - bi) * 10) / 10;
    let st: keyof typeof BAR_FILL, tag: string;
    if (dev >= 2)       { st = 'red';    tag = `fuga +${dev}pts`; }
    else if (dev <= -1) { st = 'green';  tag = 'bajo ideal'; }
    else                { st = 'yellow'; tag = 'al límite'; }
    return { lb, a, bi, st, tag, w: Math.min(100, Math.round((a / MAX) * 100)), il: Math.min(100, Math.round((bi / MAX) * 100)) };
  });
}

/* ─── LeakDonut ─────────────────────────────────────────────────────────── */

export function LeakDonut({
  tusCostosPct   = [33, 30, 15, 11, 7, 4],
  labels         = ["Comisiones", "Limpieza", "Servicios", "Mantenimiento", "Impuestos", "Otros"],
  actualCosts,
}: Pick<SharedProps, 'tusCostosPct' | 'labels'> & { actualCosts?: number[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const { CX, R, SW, C, segs } = calcSegs(tusCostosPct, labels);
  const centerV = hover != null ? `${Math.round(tusCostosPct[hover] || 0)}%` : '100%';
  const centerL = hover != null ? (labels[hover] || '') : 'de tu gasto';

  return (
    <div className="flex flex-col gap-2 select-none h-full">
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">¿Dónde se va tu dinero?</div>
      {/* En md el donut y leyenda se apilan; en lg+ van en fila */}
      <div className="flex flex-col lg:flex-row items-center gap-5 flex-1">
        {/* Donut — 200px fijo, se centra en cualquier ancho */}
        <svg width="200" height="200" viewBox="0 0 220 220" className="shrink-0" role="img" aria-label="Composición del gasto">
          <g transform="rotate(-90 110 110)">
            {segs.map(s => (
              <circle
                key={s.i} cx={CX} cy={CX} r={R} fill="none"
                stroke={s.color} strokeWidth={hover === s.i ? SW + 4 : SW} strokeLinecap="round"
                strokeDasharray={`${s.dash} ${C - s.dash}`} strokeDashoffset={s.off}
                style={{ opacity: hover == null || hover === s.i ? 1 : 0.25, transition: 'opacity .18s, stroke-width .18s', cursor: 'default' }}
                onMouseEnter={() => setHover(s.i)} onMouseLeave={() => setHover(null)}
              />
            ))}
          </g>
          {/* Usar var(--font-geist-sans) para coincidir con el resto de la página */}
          <text x="110" y="103" textAnchor="middle" fill="#E8F0ED" style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 28, fontWeight: 700 }}>{centerV}</text>
          <text x="110" y="124" textAnchor="middle" fill="#8A9B94" style={{ fontFamily: 'var(--font-geist-sans)', fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' }}>{centerL}</text>
        </svg>
        {/* Leyenda: ocupa todo el ancho restante, sin truncar */}
        <div className="flex flex-col justify-center gap-[10px] w-full lg:flex-1 min-w-0">
          {segs.map(s => {
            const icon = CATEGORY_ICONS[s.label];
            return (
              <div key={s.i} className="flex items-center gap-3 cursor-default"
                onMouseEnter={() => setHover(s.i)} onMouseLeave={() => setHover(null)}
                style={{ opacity: hover == null || hover === s.i ? 1 : 0.4, transition: 'opacity .15s' }}>
                {icon
                  ? <img src={icon} alt="" aria-hidden className="w-6 h-6 object-contain shrink-0" />
                  : <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />}
                <span className="flex-1 text-[14px] text-zinc-300">{s.label}</span>
                <span className="text-[15px] font-bold text-white tabular-nums shrink-0">{s.pct}%</span>
                {actualCosts?.[s.i] != null && (
                  <span className="text-[12px] text-zinc-500 tabular-nums shrink-0">·&nbsp;${Math.round(actualCosts[s.i]).toLocaleString()}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── LeakBars ──────────────────────────────────────────────────────────── */

export function LeakBars({
  labels            = ["Comisiones", "Limpieza", "Servicios", "Mantenimiento", "Impuestos", "Otros"],
  actualPctRevenue  = [],
  benchmarkPctRevenue,
  benchmarkIdealPct = [15, 10, 12, 5, 18, 3],
}: Pick<SharedProps, 'labels' | 'actualPctRevenue' | 'benchmarkPctRevenue' | 'benchmarkIdealPct'>) {
  const bench = benchmarkPctRevenue || benchmarkIdealPct;
  const bars  = calcBars(labels, actualPctRevenue, bench);

  return (
    <div className="flex flex-col gap-3 select-none h-full">
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-500">Tu gasto vs el ideal</div>
      <div className="flex flex-col gap-3 flex-1">
        {bars.map((b, i) => {
          const icon = CATEGORY_ICONS[b.lb];
          return (
            <div key={i}>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0 shrink">
                  {icon && <img src={icon} alt="" aria-hidden className="w-4 h-4 object-contain shrink-0 opacity-80" />}
                  <span className="text-[13px] text-zinc-200 truncate">{b.lb}</span>
                </div>
                <span className="text-[10px] text-zinc-500 tabular-nums shrink-0" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                  {b.a}% <span className="text-zinc-600">·{b.bi}%</span> <span style={{ color: BAR_TAG[b.st] }}>{b.tag}</span>
                </span>
              </div>
              <div className="relative h-[10px] rounded-full" style={{ background: 'rgba(232,240,237,.05)' }}>
                <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${b.w}%`, background: BAR_FILL[b.st] }} />
                <div className="absolute w-[1.5px] rounded" style={{ left: `${b.il}%`, top: -4, bottom: -4, background: '#8A9B94', opacity: 0.85 }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-4 mt-1 text-[10px] text-zinc-600" style={{ fontFamily: 'var(--font-geist-sans)' }}>
        <span className="flex items-center gap-1.5"><i className="w-3 h-[3px] rounded-sm inline-block" style={{ background: BAR_FILL.green }} />holgura</span>
        <span className="flex items-center gap-1.5"><i className="w-3 h-[3px] rounded-sm inline-block" style={{ background: BAR_FILL.yellow }} />al límite</span>
        <span className="flex items-center gap-1.5"><i className="w-3 h-[3px] rounded-sm inline-block" style={{ background: BAR_FILL.red }} />fuga</span>
      </div>
    </div>
  );
}

/* ─── LeakRadar (combined — kept for any other usage) ───────────────────── */

export function LeakRadar({
  tusCostosPct    = [33, 30, 15, 11, 7, 4],
  benchmarkIdealPct = [15, 10, 12, 5, 18, 3],
  labels          = ["Comisiones", "Limpieza", "Servicios", "Mantenimiento", "Impuestos", "Otros"],
  actualPctRevenue,
  benchmarkPctRevenue,
}: SharedProps & { showEfficientBox?: boolean }) {
  const hasBars = Array.isArray(actualPctRevenue) && actualPctRevenue.length > 0;
  return (
    <div className="w-full select-none flex flex-col md:flex-row md:gap-6 gap-6">
      <div className="md:w-[44%] shrink-0 min-w-0">
        <LeakDonut tusCostosPct={tusCostosPct} labels={labels} />
      </div>
      {hasBars && (
        <>
          <div className="hidden md:block w-px bg-white/5 self-stretch shrink-0" />
          <div className="flex-1 min-w-0">
            <LeakBars labels={labels} actualPctRevenue={actualPctRevenue} benchmarkPctRevenue={benchmarkPctRevenue} benchmarkIdealPct={benchmarkIdealPct} />
          </div>
        </>
      )}
    </div>
  );
}
