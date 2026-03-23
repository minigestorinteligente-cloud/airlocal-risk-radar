'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AlertTriangle, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';

export default function QuickResult({ email }: { email?: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!email) {
        setError('Email no proporcionado');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: sbError } = await supabase
          .from('reports')
          .select('*')
          .eq('email', email)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (sbError || !data) {
          setError('No se encontraron datos para este correo');
        } else {
          setReport(data.report_data);
        }
      } catch (err) {
        setError('Error al conectar con la base de datos');
      } finally {
        // Enforce a minimum loading time of 1.5s for the high-conversion hook effect
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    }

    fetchData();
  }, [email]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center p-6">
        <div className="relative flex items-center justify-center mb-8 w-32 h-32">
          <img 
            src="/a11.png" 
            alt="Análisis en curso" 
            className="w-full h-full object-contain animate-[spin_4s_linear_infinite]" 
          />
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-20 h-20 rounded-full bg-emerald-500/5 blur-2xl animate-pulse"></div>
          </div>
        </div>
        <p className="text-emerald-500/70 tracking-[0.2em] font-mono text-sm uppercase animate-pulse text-center">
          Analizando tu rentabilidad real...
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">{error || 'Error desconocido'}</p>
        <a href="/" className="mt-8 px-6 py-3 bg-zinc-800 rounded-lg text-sm font-bold uppercase tracking-widest hover:bg-zinc-700 transition-colors">
          Volver al inicio
        </a>
      </div>
    );
  }

  const free = report.free || {};
  const metrics = free.metrics || {};
  const summary = free.user_summary || {};
  const premium = report.premium || {};

  const riskLevel = (free.risk_level || 'MEDIUM').toUpperCase();
  const rawRev = parseInt(String(summary.gross_income || '0').replace(/[^\d]/g, '')) || 0;
  const occupationPct = metrics.occupancy_rate || (parseInt(String(summary.activity || '0').replace(/[^\d]/g, '')) / 30 * 100);
  const breakEvenMsg = metrics.break_even_nights || "0";
  const lossPotential = parseInt(String(premium.savings_opportunity || '0').replace(/[^\d]/g, '')) || 0;

  // Custom Labels & Messages
  const getRiskLabel = () => {
    if (riskLevel === 'HIGH') return 'RIESGO: ALTO';
    if (riskLevel === 'MEDIUM') return 'RIESGO: MEDIO';
    return 'ESTADO: BAJO';
  };

  const getAuditTitle = () => {
    if (riskLevel === 'HIGH') return 'Operación en pérdida potencial';
    if (riskLevel === 'MEDIUM') return 'Margen operativo en riesgo';
    return 'Operación optimizada';
  };

  const getDescText = () => {
    const status = riskLevel === 'HIGH' ? 'en riesgo' : riskLevel === 'MEDIUM' ? 'vulnerable' : 'estable';
    return `Tu estructura de ingresos y gastos indica una operación ${status}. Podrías estar perdiendo rentabilidad sin notarlo.`;
  };

  const getGlowColor = () => {
    if (riskLevel === 'HIGH') return 'rgba(255, 45, 45, 0.4)';
    if (riskLevel === 'MEDIUM') return 'rgba(255, 184, 0, 0.4)';
    return 'rgba(16, 185, 129, 0.4)';
  };

  const glowColor = getGlowColor();
  const accentColor = riskLevel === 'HIGH' ? '#FF2D2D' : riskLevel === 'MEDIUM' ? '#FFB800' : '#10b981';
  const accentText = riskLevel === 'HIGH' ? 'text-[#FF2D2D]' : riskLevel === 'MEDIUM' ? 'text-[#FFB800]' : 'text-[#10b981]';
  const AuditIcon = riskLevel === 'LOW' ? CheckCircle2 : AlertTriangle;

  return (
    <div className="max-w-xl mx-auto px-6 py-12 flex flex-col items-center">
      {/* HEADER */}
      <div className="flex flex-col items-center mb-12">
        <div className="w-16 h-16 mb-4">
          <img src="/a10.png" alt="Airlocal" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-xs font-bold tracking-[0.3em] text-white uppercase flex items-center gap-3">
          AIRLOCAL <span className="text-zinc-600 font-medium border-l border-zinc-800 pl-3">RISK RADAR</span>
        </h1>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-3 w-full mb-6">
        <div className="bg-[#121318] border border-zinc-800 rounded-[12px] p-5 flex flex-col justify-between h-[110px]">
          <div className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mb-2">Ocupación</div>
          <div className="text-xl font-bold text-white">
            <AnimatedNumber value={Math.round(occupationPct)} suffix="%" />
          </div>
        </div>
        <div className="bg-[#121318] border border-zinc-800 rounded-[12px] p-5 flex flex-col justify-between h-[110px]">
          <div className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mb-2">Ingreso mensual</div>
          <div className="text-xl font-bold text-white flex items-baseline gap-1">
            <span className="text-sm font-medium text-zinc-500">$</span>
            <AnimatedNumber value={rawRev} />
            <span className="text-[10px] text-zinc-500 ml-1">USD</span>
          </div>
        </div>
      </div>

      {/* MAIN RISK CARD */}
      <div 
        className="w-full bg-[#121318] border rounded-[20px] p-8 mb-8 relative group transition-all duration-500"
        style={{ 
          borderColor: accentColor,
          boxShadow: `0 0 30px ${glowColor}`
        }}
      >
        <div className={`flex items-center gap-2 ${accentText} text-[11px] font-bold tracking-widest uppercase mb-6`}>
           <AuditIcon className="w-4 h-4" /> {getRiskLabel()}
        </div>

        <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-tight mb-4">
          Auditoría: <span className={accentText}>{getAuditTitle()}</span>
        </h2>

        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          {getDescText()}
        </p>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <div className="text-4xl font-black text-white tracking-tighter mb-1">
              <span className="text-zinc-200">Estás a </span>
              <AnimatedNumber value={parseInt(String(breakEvenMsg))} className={accentText} />
              <span className="text-zinc-200"> noches</span>
            </div>
            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">de entrar en pérdida</div>
          </div>

          <div className="pt-6 border-t border-zinc-800/50">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <TrendingUp className="w-3 h-3 text-red-500" /> Impacto Económico
            </div>
            <div className="text-xl font-black text-white">
              Podrías estar perdiendo hasta <span className="text-red-500">${lossPotential.toLocaleString()} USD</span> al mes
            </div>
          </div>
        </div>
      </div>

      {/* INDICADOR CLAVE */}
      <div className="w-full bg-[#181920] border border-zinc-800/60 rounded-[12px] p-5 mb-10">
        <div className="text-emerald-500 text-[10px] font-bold tracking-widest uppercase mb-2">Indicador Clave</div>
        <p className="text-zinc-400 text-sm font-medium leading-relaxed">
          Tu nivel de gastos está por encima del rango saludable para tu ocupación actual.
        </p>
      </div>

      {/* CTA */}
      <div className="w-full flex flex-col items-center gap-4">
        <a 
          href={`/?email=${email}`}
          className="w-full py-5 bg-[#10b981] hover:bg-[#0da271] text-white font-black tracking-widest rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] text-base uppercase flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          👉 Ver diagnóstico completo
        </a>
        <p className="text-zinc-500 text-xs font-medium text-center max-w-[250px] leading-relaxed">
          Descubre exactamente dónde estás perdiendo dinero y cómo corregirlo
        </p>
      </div>
    </div>
  );
}
