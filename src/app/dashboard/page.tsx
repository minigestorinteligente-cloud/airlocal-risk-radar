"use client"

import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, Info, Home, Users, DollarSign, Target, Moon, TrendingUp, Lock 
} from "lucide-react";

export default function DashboardPage() {
  const [data] = useState({
    property_name: "Verde",
    capacity: "1 pax · 1 hab · 1 baños",
    occupancy: "24 noches registradas",
    billing: "3,500",
    expense_ratio: 34.0,
    net_income: 2317,
    break_even: 9,
    avg_price: 146,
    margin_of_safety: 16,
    operational_costs: 1183,
    potential_savings: "5,040",
  });

  const showSupportNote = (topic: string) => {
    alert(`Nota Soporte - ${topic}: Basado en auditoría de estándares AIRLOCAL.`);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-neutral-100 p-4 md:p-8 font-sans antialiased selection:bg-[#10b981]/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <img src="/logo_airlocal_40 px.png" alt="Logo" className="w-10 h-10 object-contain" />
          <div className="flex items-center tracking-tighter">
            <span className="text-xl font-black text-white uppercase">AIRLOCAL</span>
            <span className="mx-2 text-neutral-800 font-light text-xl">|</span>
            <span className="text-[12px] font-bold text-neutral-400 uppercase tracking-[0.3em] pt-1">Risk Radar</span>
          </div>
        </div>

        {/* Pilares Superiores (Originales) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <HeaderTile icon={<Home size={14}/>} label="Inmueble" value={data.property_name} />
          <HeaderTile icon={<Users size={14}/>} label="Capacidad" value={data.capacity} />
          <HeaderTile icon={<Target size={14}/>} label="Ocupación" value={data.occupancy} />
          <HeaderTile icon={<DollarSign size={14}/>} label="Facturación" value={`$${data.billing}`} sub="USD este mes" />
        </div>

        {/* Banner de Auditoría - LECTURA PRINCIPAL */}
        <div className="py-20 px-10 rounded-[2.5rem] border border-[#10b981]/20 bg-[#10b981]/5 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6 text-[12px] font-bold uppercase tracking-[0.4em] text-[#10b981]">
            <CheckCircle2 size={18} /> ESTADO: SALUDABLE
          </div>
          <h1 className="text-6xl font-black mb-8 tracking-tighter text-white uppercase leading-[0.9]">
            Auditoría: <br/>Estado Optimizado
          </h1>
          <p className="text-neutral-300 text-xl md:text-2xl leading-relaxed max-w-4xl font-medium text-left opacity-90">
            Analizamos tu inmueble "{data.property_name}". Análisis enfocado en Gestión Operativa. 
            Control ejemplar de gastos variables ({data.expense_ratio}%). Tienes la solvencia necesaria para cubrir costos fijos con facilidad.
          </p>
        </div>

        {/* Grid de Métricas 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCard onClick={() => showSupportNote("Break-even")} title="Noches Break-even" value={data.break_even} unit="noches/mes" icon={<Moon size={14}/>} />
          <MetricCard onClick={() => showSupportNote("Ingreso Medio")} title="Ingreso Medio / Noche" value={`$${data.avg_price}`} unit="USD" icon={<DollarSign size={14}/>} />
          <MetricCard onClick={() => showSupportNote("Utilidad Neta")} title="Noches de Utilidad Neta" value={data.margin_of_safety} unit="noches" icon={<CheckCircle2 size={14}/>} />
          <MetricCard onClick={() => showSupportNote("Ingreso Neto")} title="Ingreso Neto" value={`$${data.net_income.toLocaleString()}`} unit="USD/mes" isHighlight icon={<DollarSign size={14}/>}/>
        </div>

        {/* LAS 3 CAJAS CON EL MISMO ALTO - CORREGIDO */}
        <div className="space-y-6 pt-4">
          
          {/* CAJA 1 */}
          <div className="bg-[#141414] border border-white/5 rounded-2xl px-8 py-10 min-h-[180px] flex flex-col justify-center space-y-6">
            <div className="flex justify-between items-center text-neutral-500 text-[12px] font-bold uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => showSupportNote("Utilidad")}><CheckCircle2 size={16}/> NOCHES DE UTILIDAD NETA</div>
              <Info size={16} className="cursor-pointer" onClick={() => showSupportNote("Utilidad")} />
            </div>
            <div className="flex items-baseline gap-2 text-left">
              <span className="text-6xl font-black text-white">{data.margin_of_safety}</span>
              <span className="text-lg font-bold text-neutral-700 uppercase">de 30 noches</span>
            </div>
            <Progress value={(data.margin_of_safety / 30) * 100} className="h-3 bg-neutral-900" />
          </div>

          {/* CAJA 2 */}
          <div className="bg-[#141414] border border-white/5 rounded-2xl px-8 py-10 min-h-[180px] flex flex-col justify-center space-y-6">
            <div className="flex justify-between items-center text-neutral-500 text-[12px] font-bold uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => showSupportNote("Gastos")}><TrendingUp size={16}/> CONSUMO DE GASTOS</div>
              <Info size={16} className="cursor-pointer" onClick={() => showSupportNote("Gastos")} />
            </div>
            <div className="flex items-baseline gap-2 text-left">
              <span className="text-6xl font-black text-[#10b981]">{data.expense_ratio.toFixed(1)}%</span>
              <span className="text-lg font-bold text-neutral-700 uppercase">Eficiencia de Operación</span>
            </div>
            <Progress value={data.expense_ratio} className="h-3 bg-neutral-900" />
          </div>

          {/* CAJA 3 - IGUALADA EN ALTO Y PADDING */}
          <div className="bg-[#141414] border border-white/5 rounded-2xl px-8 py-10 min-h-[180px] flex flex-col justify-center space-y-6">
            <div className="flex justify-between items-center text-neutral-500 text-[12px] font-bold uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => showSupportNote("Costos")}><DollarSign size={16}/> COSTOS OPERATIVOS</div>
              <Info size={16} className="cursor-pointer" onClick={() => showSupportNote("Costos")} />
            </div>
            <div className="text-left">
              <span className="text-6xl font-black text-white">${data.operational_costs.toLocaleString()}</span>
              <span className="ml-4 text-lg font-bold text-neutral-700 uppercase tracking-widest">USD Totales</span>
            </div>
            <div className="h-3 w-full bg-neutral-900/30 rounded-full" /> {/* Espaciador para mantener simetría visual con las barras */}
          </div>
          
          {/* Caja de Ahorro con Ultra Blur y Texto Auditoría */}
          <div className="relative overflow-hidden rounded-[3rem] border border-white/10 mt-12 min-h-[600px] flex flex-col items-center justify-center p-12 text-center">
            <div className="absolute inset-0 z-0">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#10b981]/20 to-orange-500/20 rounded-full blur-[120px]" />
            </div>
            <div className="absolute inset-0 backdrop-blur-[140px] bg-black/60 z-10" />
            <div className="relative z-20 space-y-12 max-w-3xl">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                <Lock size={36} className="text-neutral-500" />
              </div>
              <div className="space-y-4">
                <div className="text-[#10b981] font-bold text-sm uppercase tracking-[0.6em]">Ahorro Potencial</div>
                <h2 className="text-7xl md:text-8xl font-black text-white tracking-tighter">
                  ${data.potential_savings} <span className="text-4xl text-neutral-500">USD</span>
                </h2>
              </div>
              <p className="text-neutral-200 text-xl md:text-2xl font-medium leading-relaxed px-8">
                Eres un host eficiente. Tu siguiente paso es el Revenue Management dinámico para maximizar ingresos sin elevar costos.
              </p>
              <button className="bg-[#f97316] hover:bg-[#ea580c] text-white font-black py-8 px-24 rounded-2xl transition-all shadow-[0_25px_60px_rgba(249,115,22,0.4)] uppercase text-xl tracking-[0.2em] active:scale-95">
                Revelar Plan de Acción
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function HeaderTile({ icon, label, value, sub }: any) {
  return (
    <div className="bg-[#141414] p-6 rounded-2xl border border-white/5 flex flex-col items-start gap-2 text-left">
      <div className="flex items-center gap-2 text-neutral-500 text-[12px] font-bold uppercase tracking-widest opacity-70">
        {icon} {label}
      </div>
      <div className="text-white font-bold text-xl tracking-tight">{value}</div>
      {sub && <div className="text-[10px] text-neutral-600 uppercase font-black">{sub}</div>}
    </div>
  );
}

function MetricCard({ title, value, unit, isHighlight = false, icon, onClick }: any) {
  return (
    <Card onClick={onClick} className="bg-[#141414] border-white/5 rounded-[2.5rem] p-12 flex flex-col items-start space-y-8 cursor-pointer hover:bg-[#1a1a1a] transition-all group text-left">
      <div className="w-full flex justify-between text-neutral-500 text-[12px] font-bold uppercase tracking-[0.2em] opacity-70">
        <div className="flex items-center gap-2 group-hover:text-white transition-colors">{icon} {title}</div>
        <Info size={18} />
      </div>
      <div className={`text-8xl font-black tracking-tighter ${isHighlight ? 'text-[#10b981]' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-[12px] text-neutral-500 font-bold uppercase tracking-[0.3em]">{unit}</div>
    </Card>
  );
}