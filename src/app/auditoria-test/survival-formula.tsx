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

        {/* Card 2: Colchón Operativo */}
        <div className="flex justify-between items-start p-5 rounded-2xl bg-[#0E1218]/60 border border-[#161B26] min-h-[130px] hover:border-neutral-700 transition-all duration-300">
          <div className="flex flex-col gap-3 text-left max-w-[65%]">
            <div className="w-8 h-8 rounded-lg bg-white/[0.02] flex items-center justify-center border border-white/5 text-neutral-400 shrink-0">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                COLCHÓN OPERATIVO
              </span>
              <p className="mt-1 text-[10px] leading-normal text-neutral-500">
                Margen de seguridad frente a imprevistos del mercado.
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-baseline gap-1 pt-1 shrink-0">
            <span className="font-sans text-4xl font-black text-white tracking-tighter leading-none select-none">
              {margin}
            </span>
            <span className="text-[9px] font-bold text-neutral-500 lowercase select-none">
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

        {/* Card 4: Margen de Seguridad */}
        <div className="flex justify-between items-start p-5 rounded-2xl bg-[#00D1B2]/[0.02] border border-[#00D1B2]/30 shadow-[0_0_15px_rgba(0,209,178,0.05)] min-h-[130px] hover:border-[#00D1B2]/50 transition-all duration-300">
          <div className="flex flex-col gap-3 text-left max-w-[65%]">
            <div className="w-8 h-8 rounded-lg bg-[#00D1B2]/5 flex items-center justify-center border border-[#00D1B2]/20 text-[#00D1B2] shrink-0">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D1B2]">
                MARGEN DE SEGURIDAD
              </span>
              <p className="mt-1 text-[10px] leading-normal text-neutral-500">
                Resultado neto que sostiene tu operación rentable.
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-baseline gap-1 pt-1 shrink-0">
            <span className="font-sans text-4xl font-black text-[#00D1B2] tracking-tighter leading-none select-none">
              {marginOfSafety}
            </span>
            <span className="text-[9px] font-bold text-[#00D1B2] lowercase select-none">
              noches
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
