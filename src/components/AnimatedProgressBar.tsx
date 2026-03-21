"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Info } from 'lucide-react';
import InfoTooltip from './InfoTooltip';

export default function AnimatedProgressBar({ 
  label, 
  textRight, 
  highlightText, 
  accentColor,
  accentColorHex,
  percent, 
  infoText = "",
  className = ""
}: any) {
  // Fuerza bruta: asegurarse de que el ancho sea válido y se asigne directo al DOM
  const safeWidth = Math.max(0, Math.min(100, isNaN(percent) ? 0 : percent));

  return (
    <div className={`bg-[#121318] border border-zinc-800 p-5 rounded-[12px] flex flex-col justify-between transition-colors hover:border-zinc-700/50 ${className || 'h-[130px]'}`}>
      <div className="flex justify-between items-center text-zinc-500 text-[11px] font-bold tracking-widest mb-1">
        <div className="flex items-center gap-2">
          {label === '% Gastos Operativos' ? (
             <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          ) : (
             <TrendingUp className="w-4 h-4 text-zinc-600" />
          )}
          {label}
        </div>
        {infoText ? <InfoTooltip content={infoText} /> : <Info className="w-4 h-4 text-zinc-700" />}
      </div>
      
      <div className="mt-auto">
        <div className="flex items-baseline gap-2 text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
          {highlightText} <span className="text-[13px] text-zinc-500 font-medium tracking-normal">{textRight}</span>
        </div>
        
        <div className="w-full bg-[#111827] rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${accentColor || ''}`}
            style={{ width: `${Math.min(Math.max(0, percent), 100)}%`, ...(accentColorHex ? { backgroundColor: accentColorHex } : {}) }}
          ></div>
        </div>
      </div>
    </div>
  )
}
