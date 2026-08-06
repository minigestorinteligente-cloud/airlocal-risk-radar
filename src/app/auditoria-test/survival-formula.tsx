"use client";

import React from 'react';
import { Scale, ShieldCheck, Tag, TrendingUp } from 'lucide-react';

export function SurvivalFormula({
  breakEven = 9,
  margin = 11,
  baseCost = 47,
  marginOfSafety = 11,
}: {
  breakEven?: number;
  margin?: number;
  baseCost?: number;
  marginOfSafety?: number;
}) {
  const ms = Number(marginOfSafety) || 0;
  const mCol = Number(margin) || 0;
  const mColColor = mCol > 7 ? '#00D1B2' : mCol >= 3 ? '#F0B432' : '#FF4C4C';
  const mColBorder = mCol > 7 ? 'border-[#00D1B2]/30' : mCol >= 3 ? 'border-[#F0B432]/30' : 'border-[#FF4C4C]/30';
  const mColBg = mCol > 7 ? 'bg-[#00D1B2]/[0.02]' : mCol >= 3 ? 'bg-[#F0B432]/[0.02]' : 'bg-[#FF4C4C]/[0.02]';
  const mColIconBg = mCol > 7 ? 'bg-[#00D1B2]/5 border-[#00D1B2]/20' : mCol >= 3 ? 'bg-[#F0B432]/5 border-[#F0B432]/20' : 'bg-[#FF4C4C]/5 border-[#FF4C4C]/20';
  const msColor = ms > 7 ? '#00D1B2' : ms >= 3 ? '#F0B432' : '#FF4C4C';
  const msBorder = ms > 7 ? 'border-[#00D1B2]/30' : ms >= 3 ? 'border-[#F0B432]/30' : 'border-[#FF4C4C]/30';
  const msBg = ms > 7 ? 'bg-[#00D1B2]/[0.02]' : ms >= 3 ? 'bg-[#F0B432]/[0.02]' : 'bg-[#FF4C4C]/[0.02]';
  const msIconBg = ms > 7 ? 'bg-[#00D1B2]/5 border-[#00D1B2]/20' : ms >= 3 ? 'bg-[#F0B432]/5 border-[#F0B432]/20' : 'bg-[#FF4C4C]/5 border-[#FF4C4C]/20';
  return (
    <div className="mt-12 text-left w-full">
      <div className="mb-6 flex items-center gap-2">
        <span className="h-[1px] w-5 bg-[#00D1B2]" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300">
          Métricas de supervivencia
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 w-full">
        {/* Card 1: Break-Even */}
        <div className="flex justify-between items-start p-5 rounded-2xl bg-[#0E1218]/60 border border-[#161B26] min-h-[130px] hover:border-neutral-700 transition-all duration-300">
          <div className="flex flex-col gap-3 text-left max-w-[65%]">
            <div className="w-8 h-8 rounded-lg bg-white/[0.02] flex items-center justify-center border border-white/5 text-neutral-400 shrink-0">
              <Scale className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                BREAK-EVEN
              </span>
              <p className="mt-1 text-[10px] leading-normal text-neutral-500">
                Punto de equilibrio mínimo para mantener la unidad operativa.
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-baseline gap-1 pt-1 shrink-0">
            <span className="font-sans text-4xl font-black text-white tracking-tighter leading-none select-none">
              {breakEven}
            </span>
            <span className="text-[9px] font-bold text-neutral-500 lowercase select-none">
              noches
            </span>
          </div>
        </div>

        {/* Card 2: Colchón Operativo — color dinámico según umbral */}
        <div className={`flex justify-between items-start p-5 rounded-2xl ${mColBg} border ${mColBorder} min-h-[130px] transition-all duration-300`}>
          <div className="flex flex-col gap-3 text-left max-w-[65%]">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${mColIconBg} shrink-0`} style={{ color: mColColor }}>
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: mColColor }}>
                COLCHÓN OPERATIVO
              </span>
              <p className="mt-1 text-[10px] leading-normal text-neutral-500">
                {mCol <= 3
                  ? 'Sin colchón: cualquier caída de ocupación genera pérdida.'
                  : mCol <= 7
                  ? 'Colchón ajustado. Evita gastos imprevistos este mes.'
                  : 'Margen de seguridad frente a imprevistos del mercado.'}
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-baseline gap-1 pt-1 shrink-0">
            <span className="font-sans text-4xl font-black tracking-tighter leading-none select-none" style={{ color: mColColor }}>
              {margin}
            </span>
            <span className="text-[9px] font-bold lowercase select-none" style={{ color: mColColor }}>
              noches
            </span>
          </div>
        </div>

        {/* Card 3: Piso de Tarifa */}
        <div className="flex justify-between items-start p-5 rounded-2xl bg-[#0E1218]/60 border border-[#161B26] min-h-[130px] hover:border-neutral-700 transition-all duration-300">
          <div className="flex flex-col gap-3 text-left max-w-[65%]">
            <div className="w-8 h-8 rounded-lg bg-white/[0.02] flex items-center justify-center border border-white/5 text-neutral-400 shrink-0">
              <Tag className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                PISO DE TARIFA
              </span>
              <p className="mt-1 text-[10px] leading-normal text-neutral-500">
                Tarifa mínima calculada según tus costos fijos.
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-baseline gap-1 pt-1 shrink-0">
            <span className="font-sans text-4xl font-black text-white tracking-tighter leading-none select-none">
              ${baseCost}
            </span>
            <span className="text-[9px] font-bold text-neutral-500 uppercase select-none">
              USD
            </span>
          </div>
        </div>

        {/* Card 4: Margen de Seguridad — color dinámico según umbral */}
        <div className={`flex justify-between items-start p-5 rounded-2xl ${msBg} border ${msBorder} min-h-[130px] transition-all duration-300`}>
          <div className="flex flex-col gap-3 text-left max-w-[65%]">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${msIconBg} shrink-0`} style={{ color: msColor }}>
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: msColor }}>
                MARGEN DE SEGURIDAD
              </span>
              <p className="mt-1 text-[10px] leading-normal text-neutral-500">
                {ms <= 3
                  ? 'Zona de riesgo: cualquier caída de ocupación genera pérdida.'
                  : ms <= 7
                  ? 'Margen ajustado. Evita gastos imprevistos este mes.'
                  : 'Colchón operativo saludable frente a imprevistos del mercado.'}
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-baseline gap-1 pt-1 shrink-0">
            <span className="font-sans text-4xl font-black tracking-tighter leading-none select-none" style={{ color: msColor }}>
              {marginOfSafety}
            </span>
            <span className="text-[9px] font-bold lowercase select-none" style={{ color: msColor }}>
              noches
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
