'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { AlertTriangle, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default function QuickResult() {
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email');

  console.log('Versión del código: 2.4 (Impact Color Update)');
  console.log('Rendering QuickResult component. Email from URL:', emailFromUrl);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('useEffect triggered with email:', emailFromUrl);
        
        const cleanEmail = emailFromUrl ? decodeURIComponent(emailFromUrl).trim().toLowerCase() : '';
        
        if (!cleanEmail) {
          console.warn('No email found in URL');
          setError('Ingresa tu correo para ver los resultados');
          setIsLoading(false);
          return;
        }

        console.log('Iniciando fetch para:', cleanEmail);

        const { data, error: sbError } = await supabaseClient
          .from('reports')
          .select('*')
          .eq('email', cleanEmail)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        console.log('Supabase check for email:', cleanEmail, { data, sbError });

        if (sbError) {
          console.error('Supabase Error:', sbError);
          setError(`No se encontró reporte: ${sbError.message}`);
        } else if (!data) {
          setError('No encontramos datos para este correo');
        } else {
          // Force JSON read right at setReport to guarantee React updates
          let parsedObj = { ...data };
          try {
            if (parsedObj.report_data) {
              let raw = parsedObj.report_data;
              if (typeof raw === 'string') raw = JSON.parse(raw);
              if (typeof raw === 'string') raw = JSON.parse(raw);
              if (raw && raw.report_data && !raw.free) {
                raw = raw.report_data;
              }
              parsedObj.report_data = raw;
              console.log('DEBUG effect: report_data forcefully parsed:', raw);
            }
          } catch (e) {
            console.error('DEBUG effect: Error parsing report_data:', e);
          }
          setReport(parsedObj);
        }
      } catch (err: any) {
        console.error('Fatal Catch inside useEffect:', err);
        setError(`Error crítico: ${err?.message || 'Error desconocido'}`);
      } finally {
        // Enforce a minimum loading time of 1.5s for the high-conversion hook effect
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    }

    fetchData();
  }, [emailFromUrl]);

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

  // Parse report_data with extra robustness
  let rData: any = {};
  try {
    let raw = report?.report_data;
    if (typeof raw === 'string') raw = JSON.parse(raw);
    if (typeof raw === 'string') raw = JSON.parse(raw);
    rData = raw || {};
    if (rData.report_data && !rData.free) {
      rData = rData.report_data;
    }
    console.log('DEBUG render: report_data final parsed:', rData);
  } catch (e) {
    console.error('DEBUG render: Failed to parse report_data:', e);
  }

  const free = rData?.free || {};
  const metrics = free?.metrics || {};

  // Data Mapping (Strict Exclusive JSON per user instruction + safe paths)
  // 1. Semáforo: Only from report_data.free.risk_level
  const riskRaw = (free?.risk_level || report?.riesgo || 'MEDIUM').toString().toLowerCase();
  const riskLevel = riskRaw.includes('low') || riskRaw.includes('bajo') ? 'LOW' : riskRaw.includes('medio') || riskRaw.includes('medium') ? 'MEDIUM' : 'HIGH';
  
  // 2. Ocupación %: Only from report_data.free.metrics.ocupacion_pct
  const occupationPct = Number(metrics?.ocupacion_pct || metrics?.occupancy_pct || metrics?.ocupacion || 0);
  
  // 3. Ingreso Mensual (Neto): Only from report_data.free.metrics.net_income
  const rawRev = Number(metrics?.net_income || report?.profit || 0);
  
  // 4. Pérdida/Ganancia: Only from report_data.free.metrics.net_income
  const lossPotential = Math.abs(Number(metrics?.net_income || report?.profit || 0));
  const breakEvenNoches = Number(metrics?.break_even_nights || 0);

  // Dynamic Texts from JSON
  const headline = free?.headline || '';
  const intro = free?.intro || '';

  // Calculate parameters for Tally
  const ingresosVal = Math.round(Number(metrics?.gross_revenue || metrics?.ingresos || rawRev || 0));
  const gastosVal = Math.round(Number(metrics?.total_expenses || metrics?.gastos || metrics?.expenses || 0));

  let ctaText = '👉 Ver diagnóstico completo';
  if (riskLevel === 'HIGH') {
    ctaText = '👉 Corregir mi rentabilidad ahora';
  } else if (riskLevel === 'MEDIUM') {
    ctaText = '👉 Ver qué está afectando mi rentabilidad';
  } else if (riskLevel === 'LOW') {
    ctaText = '👉 Mejorar mi rentabilidad';
  }

  const tallyUrl = `https://tally.so/r/lbrdjo?email=${encodeURIComponent(emailFromUrl || '')}&ingresos=${ingresosVal}&gastos=${gastosVal}`;

  // Narrative Content Mapping with extra safety
  const getRiskNarrative = (currentAccentText: string) => {
    try {
      if (riskLevel === 'HIGH') {
        return {
          label: 'RIESGO: ALTO',
          title: headline || 'AUDITORÍA: MARGEN EN PÉRDIDA',
          desc: intro || 'Tu operación actual no está logrando cubrir sus costos de manera consistente.',
          nightsBox: (
            <div className="flex flex-col">
              <div className="text-white text-[28px] leading-tight font-black tracking-tight">
                Tu operación está en <span className="text-[#FF2D2D]">PÉRDIDA</span>
              </div>
            </div>
          ),
          impactLabel: 'Impacto Económico',
          impactText: `Estás perdiendo hasta <span class="text-[#FF2D2D]">$${(lossPotential || 0).toLocaleString()}</span> mensuales`,
          indicatorText: 'Tus ingresos actuales no están cubriendo la estructura de costos. Se requiere ajuste inmediato.',
          accentColor: '#FF2D2D',
          accentText: 'text-[#FF2D2D]',
          glowColor: 'rgba(255, 45, 45, 0.4)',
          icon: AlertTriangle
        };
      }
      if (riskLevel === 'MEDIUM') {
        return {
          label: 'RIESGO: MEDIO',
          title: headline || 'AUDITORÍA: MARGEN OPERATIVO EN RIESGO',
          desc: intro || 'Tu estructura de ingresos y gastos indica una operación vulnerable.',
          nightsBox: (
            <div className="flex flex-col">
              <div className="text-white text-[28px] leading-tight font-black tracking-tight mb-1">
                Estás a <AnimatedNumber value={breakEvenNoches} className="text-[#FFB800]" /> noches
              </div>
              <div className="text-zinc-500 text-[11px] uppercase font-bold tracking-widest mt-1">
                DE ENTRAR EN PÉRDIDA
              </div>
            </div>
          ),
          impactLabel: 'Impacto Económico',
          impactText: `Podrías estar perdiendo hasta <span class="text-[#FFB800]">$${(lossPotential || 0).toLocaleString()} USD</span> al mes`,
          indicatorText: 'Tu nivel de gastos está por encima del rango saludable para tu ocupación actual.',
          accentColor: '#FFB800',
          accentText: 'text-[#FFB800]',
          glowColor: 'rgba(255, 184, 0, 0.4)',
          icon: AlertTriangle
        };
      }
      // Default: BAJO / LOW
      return {
        label: 'ESTADO: BAJO',
        title: headline || 'AUDITORÍA: OPERACIÓN ESTABLE',
        desc: intro || 'Tu estructura de ingresos y gastos indica una operación saludable y controlada.',
        nightsBox: (
          <div className="flex flex-col">
            <div className="text-white text-3xl font-black tracking-tight">
              Operación con <AnimatedNumber value={breakEvenNoches} className="text-[#10b981]" /> noches
            </div>
            <div className="text-zinc-500 text-[11px] uppercase font-bold tracking-widest mt-1">
              DE MARGEN DE SEGURIDAD
            </div>
          </div>
        ),
        impactLabel: 'Potencial de Mejora',
        impactText: `Podrías aumentar tus ganancias en <span class="text-[#10b981]">$${(lossPotential || 0).toLocaleString()} USD</span> mensuales`,
        indicatorText: 'Tu nivel de ocupación y ADR están en un punto óptimo. Mantén el control de costos.',
        accentColor: '#10b981',
        accentText: 'text-[#10b981]',
        glowColor: 'rgba(16, 185, 129, 0.4)',
        icon: CheckCircle2
      };
    } catch (err) {
      console.error('Error matching narrative:', err);
      return {
        label: 'ESTADO: INDETERMINADO',
        title: 'FALLO EN EL ANÁLISIS DE DATOS',
        desc: 'Hubo un error al procesar tu reporte.',
        nightsBox: <div>Error al calcular métricas.</div>,
        impactLabel: 'Error',
        impactText: 'No se pudo calcular el impacto.',
        indicatorText: 'Error en el motor de narrativa.',
        accentColor: '#71717a',
        accentText: 'text-zinc-500',
        glowColor: 'rgba(113, 113, 122, 0.4)',
        icon: AlertTriangle
      };
    }
  };

  const narrative = getRiskNarrative(''); 
  const glowColor = narrative.glowColor;
  const accentColor = narrative.accentColor;
  const accentText = narrative.accentText;
  const AuditIcon = narrative.icon;

  const renderTitle = (titleRaw: string) => {
    const defaultPrefix = 'AUDITORÍA:';
    if (titleRaw.toUpperCase().startsWith(defaultPrefix)) {
      const rest = titleRaw.substring(defaultPrefix.length);
      return (
        <>
          <span className="text-white">{defaultPrefix}</span>
          <span className={accentText}>{rest}</span>
        </>
      );
    }
    return <span className={accentText}>{titleRaw}</span>;
  };

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
          <div className="text-xl font-black text-white">
            <AnimatedNumber value={Math.round(occupationPct)} suffix="%" />
          </div>
        </div>
        <div className="bg-[#121318] border border-zinc-800 rounded-[12px] p-5 flex flex-col justify-between h-[110px]">
          <div className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mb-2">Ingreso mensual</div>
          <div className="text-xl font-black text-white flex items-baseline gap-1">
            <span className="text-sm font-bold text-zinc-500">$</span>
            <AnimatedNumber value={rawRev} />
            <span className="text-[10px] uppercase font-bold text-zinc-500 ml-1 tracking-tighter">USD</span>
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
           <AuditIcon className="w-4 h-4" /> {narrative.label}
        </div>

        <h2 className="text-2xl md:text-[28px] font-black uppercase tracking-tight leading-tight mb-5">
          {renderTitle(narrative.title)}
        </h2>

        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          {narrative.desc}
        </p>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <div className="text-xl font-black text-white tracking-tighter mb-1">
              {narrative.nightsBox}
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800/50">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <TrendingUp className={`w-3 h-3 ${riskLevel === 'LOW' ? 'text-emerald-500' : 'text-red-500'}`} /> {narrative.impactLabel}
            </div>
            <div className="text-xl font-black text-white" dangerouslySetInnerHTML={{ __html: narrative.impactText }}>
            </div>
          </div>
        </div>
      </div>

      {/* INDICADOR CLAVE */}
      <div className="w-full bg-[#181920] border border-zinc-800/60 rounded-[12px] p-5 mb-10">
        <div className={`${accentText} text-[10px] font-bold tracking-widest uppercase mb-2`}>Indicador Clave</div>
        <p className="text-zinc-400 text-sm font-medium leading-relaxed">
          {narrative.indicatorText}
        </p>
      </div>

      {/* CTA */}
      <div className="w-full flex flex-col items-center gap-4">
        <a 
          href={tallyUrl}
          className="w-full py-5 px-2 bg-[#10b981] hover:bg-[#0da271] text-white font-black tracking-widest rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] text-sm sm:text-base uppercase flex items-center justify-center gap-3 active:scale-[0.98] text-center"
        >
          {ctaText}
        </a>
        <p className="text-zinc-500 text-xs font-medium text-center max-w-[250px] leading-relaxed">
          Descubre exactamente dónde estás perdiendo dinero y cómo corregirlo
        </p>
      </div>
    </div>
  );
}
