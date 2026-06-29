'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { createClient } from '@supabase/supabase-js';
import { AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseClient = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Dynamic neuromarketing textosCopi object for healthy, vulnerable, and critical states
const textosCopi = {
  saludable: {
    title: "🏆 ¡Felicidades! Operación de Bajo Riesgo",
    text: "Tu unidad presenta un rendimiento saludable y una estructura financiera sólida. Sin embargo, el mercado es altamente dinámico. Para blindar tu rentabilidad frente a fluctuaciones futuras, es clave estandarizar tus procesos de captación y automatizar tus políticas de precios dinámicos.",
    bullet: "✓ Todo en orden: margen de ganancias positivo y costos bajo control.",
    color: "#10b981"
  },
  vulnerable: {
    title: "⚠️ Advertencia: Operación Altamente Vulnerable",
    text: "Estás operando extremadamente cerca de tu punto de equilibrio. Una ligera reducción en la ocupación o un leve incremento en tus costos fijos empujará tu flujo de caja a pérdidas netas. Consolidar de inmediato tus tarifas y gastos fijos es crucial para evitar caer en riesgo.",
    bullet: "⚠ Atención requerida: pocos días de margen de seguridad financiera.",
    color: "#FFB800"
  },
  critico: {
    title: "🚨 Alerta Crítica: Operación en Pérdida Consistente",
    text: "Tu negocio se encuentra en un estado grave de sangrado financiero. Los costos operativos reales superan con creces los ingresos generados por la unidad. Cada día que pasa sin una intervención correctiva agrava tu brecha financiera. Se requiere un plan de rescate inmediato.",
    bullet: "✗ Urgente: Acción correctiva inmediata recomendada para frenar pérdidas.",
    color: "#FF2D2D"
  }
};

export default function QuickResultTest() {
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email');
  const statusFromUrl = searchParams.get('status')?.toLowerCase();

  useEffect(() => {
    async function fetchData() {
      try {
        const cleanEmail = emailFromUrl ? decodeURIComponent(emailFromUrl).trim().toLowerCase() : '';
        
        if (!cleanEmail) {
          setError('Ingresa tu correo para ver los resultados');
          setIsLoading(false);
          return;
        }

        if (!supabaseClient) {
          // If Supabase isn't configured, we'll allow testing via URL overrides gracefully
          setIsLoading(false);
          return;
        }

        const { data, sbError } = await supabaseClient
          .from('reports')
          .select('*')
          .eq('email', cleanEmail)
          .order('created_at', { ascending: false })
          .limit(1)
          .single() as any;

        if (sbError) {
          console.error('Supabase Error:', sbError);
          // Don't crash for test route; let them test using the URL parameters
        } else if (data) {
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
            }
          } catch (e) {
            console.error('Error parsing report_data:', e);
          }
          setReport(parsedObj);
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1200);
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

  // Parse report_data
  let rData: any = {};
  try {
    let raw = report?.report_data;
    if (typeof raw === 'string') raw = JSON.parse(raw);
    if (typeof raw === 'string') raw = JSON.parse(raw);
    rData = raw || {};
    if (rData.report_data && !rData.free) {
      rData = rData.report_data;
    }
  } catch (e) {
    console.error('Failed to parse report_data:', e);
  }

  const free = rData?.free || {};
  const metrics = free?.metrics || {};

  // Status mapping logic (Priority to URL param, otherwise DB value)
  let riskLevel = 'MEDIUM';
  if (statusFromUrl === 'saludable') {
    riskLevel = 'LOW';
  } else if (statusFromUrl === 'vulnerable') {
    riskLevel = 'MEDIUM';
  } else if (statusFromUrl === 'critico' || statusFromUrl === 'critica' || statusFromUrl === 'critical') {
    riskLevel = 'HIGH';
  } else {
    const riskRaw = (free?.risk_level || report?.riesgo || 'MEDIUM').toString().toLowerCase();
    riskLevel = riskRaw.includes('low') || riskRaw.includes('bajo') ? 'LOW' : riskRaw.includes('medio') || riskRaw.includes('medium') ? 'MEDIUM' : 'HIGH';
  }

  // Dynamic texts and values (with standard beautiful fallbacks for URL status testing)
  let occupationPct = 54;
  let rawRev = 2100;
  let lossPotential = 2800;
  let breakEvenNoches = 22;
  let headline = '';
  let intro = '';

  if (report) {
    occupationPct = Number(metrics?.ocupacion_pct || metrics?.occupancy_pct || metrics?.ocupacion || 0);
    rawRev = Number(metrics?.net_income || report?.profit || 0);
    lossPotential = Math.abs(Number(metrics?.net_income || report?.profit || 0));
    breakEvenNoches = Number(metrics?.break_even_nights || 0);
    headline = free?.headline || '';
    intro = free?.intro || '';
  }

  // Apply visual overrides for testing statuses
  if (statusFromUrl) {
    if (statusFromUrl === 'saludable') {
      occupationPct = 82;
      rawRev = 3450;
      lossPotential = 1200;
      breakEvenNoches = 14;
      headline = 'AUDITORÍA: OPERACIÓN SALUDABLE';
      intro = 'Tu unidad presenta una estructura estable con excelentes márgenes de seguridad.';
    } else if (statusFromUrl === 'vulnerable') {
      occupationPct = 54;
      rawRev = 2100;
      lossPotential = 2800;
      breakEvenNoches = 22;
      headline = 'AUDITORÍA: MARGEN OPERATIVO EN RIESGO';
      intro = 'Tu estructura de ingresos e impuestos indica una operación sumamente vulnerable.';
    } else if (statusFromUrl === 'critico' || statusFromUrl === 'critica') {
      occupationPct = 28;
      rawRev = 950;
      lossPotential = 4500;
      breakEvenNoches = 29;
      headline = 'AUDITORÍA: MARGEN EN PÉRDIDA CRÍTICA';
      intro = 'Tu operación actual no está logrando cubrir sus costos fijos y está perdiendo flujo de caja diariamente.';
    }
  }

  // Texts for Dynamic Button
  let ctaText = '👉 Ver diagnóstico completo';
  if (riskLevel === 'HIGH') ctaText = '👉 Corregir mi rentabilidad ahora';
  else if (riskLevel === 'MEDIUM') ctaText = '👉 Ver qué está afectando mi rentabilidad';
  else if (riskLevel === 'LOW') ctaText = '👉 Mejorar mi rentabilidad';

  // Selected Copy from Neuromarketing Object
  const selectedKey = riskLevel === 'LOW' ? 'saludable' : riskLevel === 'HIGH' ? 'critico' : 'vulnerable';
  const selectedCopi = textosCopi[selectedKey];

  // Narrative Layout Mappings
  const getRiskNarrative = () => {
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
    // LOW / Saludable
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
  };

  const narrative = getRiskNarrative();
  const AuditIcon = narrative.icon;

  const renderTitle = (titleRaw: string) => {
    const defaultPrefix = 'AUDITORÍA:';
    if (titleRaw.toUpperCase().startsWith(defaultPrefix)) {
      const rest = titleRaw.substring(defaultPrefix.length);
      return (
        <>
          <span className="text-white">{defaultPrefix}</span>
          <span className={narrative.accentText}>{rest}</span>
        </>
      );
    }
    return <span className={narrative.accentText}>{titleRaw}</span>;
  };

  const valEmail = report?.email || emailFromUrl || '';

  const handleRedirect = () => {
    window.location.href = `/auditoria-operativa?email=${encodeURIComponent(valEmail)}`;
  };

  const getBtn1Styles = () => {
    if (riskLevel === 'HIGH') {
      return {
        backgroundColor: '#FF4444',
        color: '#FFFFFF',
        boxShadow: '0 0 28px rgba(255, 68, 68, 0.35)'
      };
    }
    if (riskLevel === 'LOW') {
      return {
        backgroundColor: '#2ECC71',
        color: '#000000',
        boxShadow: '0 0 28px rgba(46, 204, 113, 0.35)'
      };
    }
    // MEDIUM / VULNERABLE
    return {
      backgroundColor: '#FF8C00',
      color: '#FFFFFF',
      boxShadow: '0 0 28px rgba(255, 140, 0, 0.35)'
    };
  };

  return (
    <div className="max-w-[900px] mx-auto px-6 py-12 flex flex-col items-center w-full">
      <Script 
        src="https://tally.so/widgets/embed.js" 
        strategy="lazyOnload" 
      />

      {/* 0. DIAGNÓSTICO EXPRESS BANNER */}
      <div className="w-full bg-[#0E1613] border border-[#10b981]/20 rounded-[12px] px-4 py-3.5 flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-[#10b981] mr-2.5 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          <span className="text-[10px] md:text-xs font-black tracking-wider text-[#00D1B2] uppercase">
            DIAGNÓSTICO EXPRESS COMPLETADO
          </span>
        </div>
        <span className="text-[10px] md:text-xs text-zinc-500 font-bold tracking-wide">
          Gratis · 90 segundos
        </span>
      </div>

      {/* SUBTITLE */}
      <div className="w-full text-left mb-6">
        <h2 className="text-zinc-400 text-sm md:text-base font-medium">
          Resultado para <span className="text-white font-bold">tu operación</span>
        </h2>
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
          borderColor: narrative.accentColor,
          boxShadow: `0 0 30px ${narrative.glowColor}`
        }}
      >
        <div className={`flex items-center gap-2 ${narrative.accentText} text-[11px] font-bold tracking-widest uppercase mb-6`}>
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
      <div 
        className="w-full bg-[#181920] border border-zinc-800/60 border-b-0 rounded-t-[12px] py-5 px-6"
        style={{ 
          borderLeft: `3px solid ${narrative.accentColor}`, 
          borderBottomLeftRadius: '0px', 
          borderBottomRightRadius: '0px' 
        }}
      >
        <div className={`${narrative.accentText} font-bold uppercase mb-2`} style={{ fontSize: '11px', letterSpacing: '2px' }}>
          Indicador Clave
        </div>
        <p className="text-zinc-400 font-medium" style={{ fontSize: '15px', lineHeight: '1.7' }}>
          {narrative.indicatorText}
        </p>
      </div>

      {/* 3A — Bloque BLUR (Paywall) */}
      <div 
        className="w-full bg-[#111111] border border-[#2a2a2a] rounded-b-[16px] p-6 md:p-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
        style={{ 
          borderTopLeftRadius: '0px', 
          borderTopRightRadius: '0px' 
        }}
      >
        <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#00D1B2] uppercase mb-2 block">
          AUDITORÍA OPERATIVA COMPLETA
        </span>
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight">
          Tu plan de acción está aquí.
        </h3>
        <p className="text-xs md:text-sm text-zinc-400 mb-8 leading-relaxed">
          El sistema ya identificó las acciones específicas para tu operación — ordenadas por impacto económico. Completa tu perfil para desbloquearlo.
        </p>

        {/* 4 bloques de contenido con efecto blur */}
        <div className="relative flex flex-col gap-5">
          {[
            "① Plan de acción priorizado por unidad",
            "② Fugas detectadas por categoría de costo",
            "③ Proyección de recuperación mensual en USD",
            "④ Ranking de rentabilidad de tu portafolio"
          ].map((title, i) => (
            <div key={i} className="flex flex-col">
              {/* Blurred content container containing the title and lines */}
              <div 
                className="flex flex-col gap-2 pointer-events-none select-none"
                style={{ filter: 'blur(5px)' }}
              >
                <h4 className="text-xs md:text-sm font-bold text-zinc-300">
                  {title}
                </h4>
                <div className="h-2 bg-zinc-700/40 rounded w-11/12"></div>
                <div className="h-2 bg-zinc-700/30 rounded w-9/12"></div>
                <div className="h-2 bg-zinc-700/20 rounded w-7/12"></div>
              </div>
            </div>
          ))}

          {/* Gradiente fade de abajo */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[140px] pointer-events-none z-10"
            style={{ backgroundImage: 'linear-gradient(transparent, #111111)' }}
          />
        </div>

        {/* Call to action details below the blur area */}
        <div className="mt-8 text-center relative z-20">
          <h4 className="text-sm md:text-base font-bold text-white mb-2">
            Tu operación necesita corrección inmediata.
          </h4>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed max-w-[340px] mx-auto">
            Completa tu perfil operativo en 5 minutos y el sistema genera tu Auditoría Operativa completa.
          </p>

          {/* Dynamic Color Button based on riskLevel */}
          <button 
            onClick={() => window.location.href = `/auditoria-operativa?email=${encodeURIComponent(valEmail)}`}
            className="w-full transition-all hover:opacity-95 hover:scale-[1.01] duration-200 text-center text-sm tracking-wide border-none uppercase mb-3"
            style={{ 
              padding: '16px',
              borderRadius: '12px',
              fontWeight: '800',
              ...getBtn1Styles()
            }}
          >
            🔓 Iniciar mi Auditoría Operativa →
          </button>

          <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
            5 MINUTOS · PLAN PERSONALIZADO · ACCESO INMEDIATO
          </p>
        </div>
      </div>

      {/* 3B — Bloque BRIDGE EXPLICATIVO */}
      <div className="w-full mt-6 bg-[#111111] border border-[#00D1B2]/25 rounded-[14px] p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#00D1B2] uppercase mb-2 block">
          ¿QUÉ INCLUYE LA AUDITORÍA OPERATIVA?
        </span>
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight">
          Tu Diagnóstico Express mostró el problema. La Auditoría te dice cómo resolverlo.
        </h3>
        <p className="text-xs md:text-sm text-zinc-400 mb-6 leading-relaxed">
          Con los datos detallados de tu operación — costos por categoría, capacidad y contexto del mes — el sistema personaliza tu plan y te muestra exactamente qué corregir primero y el potencial de mejora real de cada una de tus unidades.
        </p>

        {/* 4 filas con fondo #1A1A1A */}
        <div className="flex flex-col gap-2.5 mb-6">
          {[
            "① Plan de acción priorizado por unidad",
            "② Fugas detectadas por categoría de costo",
            "③ Proyección de recuperación mensual en USD",
            "④ Ranking de rentabilidad de tu portafolio"
          ].map((title, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between bg-[#1A1A1A] px-4 py-3 rounded-lg border border-zinc-800/20"
            >
              <span className="text-xs font-bold text-zinc-300">
                {title}
              </span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-800/80 px-2.5 py-1 rounded">
                PENDIENTE
              </span>
            </div>
          ))}
        </div>

        {/* Button & Subtext */}
        <button 
          onClick={() => window.location.href = `/auditoria-operativa?email=${encodeURIComponent(valEmail)}`}
          className="w-full bg-transparent border border-[rgba(0,209,178,0.4)] text-[#00D1B2] hover:border-[#00D1B2] hover:bg-[rgba(0,209,178,0.08)] transition-all text-center text-sm mb-3 uppercase tracking-wide"
          style={{ 
            padding: '15px',
            borderRadius: '12px',
            fontWeight: '800'
          }}
        >
          Iniciar mi Auditoría Operativa →
        </button>

        <p className="text-[10px] text-zinc-500 uppercase tracking-widest text-center">
          5 MINUTOS · TU PLAN SE GENERA AL TERMINAR
        </p>
      </div>

      {/* 3C — Bloque CONFIANZA */}
      <div className="w-full mt-6 bg-[#111111] border border-[#2a2a2a] rounded-[12px] p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h3 className="text-sm md:text-base font-bold text-white mb-3">
          ¿Por qué vale la pena?
        </h3>
        <p className="text-xs md:text-sm text-zinc-400 mb-6 leading-relaxed">
          Si no sabes qué está fallando… ya estás perdiendo dinero. La Auditoría Operativa no es un reporte — es un plan de acción priorizado, calculado con los datos reales de tu operación. Sin generalizaciones. Sin promedios de mercado. Tu número, tu propiedad, tu siguiente paso. Y sí — una noche sin reserva te cuesta más que la Auditoría completa.
        </p>

        {/* 3 Checks en verde #2ECC71 */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] md:text-xs font-bold text-[#00D1B2] uppercase tracking-wide">
          <span>✓ Resultado en minutos</span>
          <span className="text-zinc-700 select-none">·</span>
          <span>✓ Basado en tus datos</span>
          <span className="text-zinc-700 select-none">·</span>
          <span>✓ Sin suscripción</span>
        </div>
      </div>

      {/* 3D — FOOTER */}
      <footer className="w-full text-center text-[10px] md:text-xs text-zinc-600 mt-12 mb-6 flex flex-col gap-1 tracking-wide">
        <p className="font-bold">AIRLOCAL™ Risk Radar · by propiqdata.com</p>
        <p>soporte@propiqdata.com · Términos · Privacidad</p>
      </footer>
    </div>
  );
}
