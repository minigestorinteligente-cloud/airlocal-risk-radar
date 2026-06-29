'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { createClient } from '@supabase/supabase-js';
import { AlertTriangle, CheckCircle2, TrendingUp, Lock, Unlock } from 'lucide-react';
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
    bullet: "⚠ Atención requerida: pocos dias de margen de seguridad financiera.",
    color: "#FFB800"
  },
  critico: {
    title: "🚨 Alerta Crítica: Operación en Pérdida Consistente",
    text: "Tu negocio se encuentra en un estado grave de sangrado financiero. Los costos operativos reales superan con creces los ingresos generados por la unidad. Cada día que pasa sin una intervención correctiva agrava tu brecha financiera. Se requiere un plan de rescate inmediato.",
    bullet: "✗ Urgente: Acción correctiva inmediata recomendada para frenar pérdidas.",
    color: "#FF2D2D"
  }
};

export default function QuickResult() {
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email');
  const statusFromUrl = searchParams.get('status')?.toLowerCase();
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  // Dynamic Calculated Data based on N8N variables and robust fallbacks
  const commissionVal = Number(metrics?.platfom_commission || report?.report_data?.platfom_commission || (statusFromUrl === 'saludable' ? 120 : statusFromUrl === 'critico' ? 750 : 450));
  const cleaningVal = Number(metrics?.cleaning_cost || report?.report_data?.cleaning_cost || (statusFromUrl === 'saludable' ? 180 : statusFromUrl === 'critico' ? 500 : 300));
  const servicesVal = Number(metrics?.services_cost || report?.report_data?.services_cost || (statusFromUrl === 'saludable' ? 100 : statusFromUrl === 'critico' ? 400 : 200));
  const maintenanceVal = Number(metrics?.maintenence_cost || report?.report_data?.maintenence_cost || (statusFromUrl === 'saludable' ? 80 : statusFromUrl === 'critico' ? 250 : 150));
  const taxVal = Number(metrics?.tax_cost || report?.report_data?.tax_cost || (statusFromUrl === 'saludable' ? 150 : statusFromUrl === 'critico' ? 350 : 250));
  const hiddenVal = Number(metrics?.Hidden_cost || report?.report_data?.Hidden_cost || (statusFromUrl === 'saludable' ? 20 : statusFromUrl === 'critico' ? 100 : 50));

  const totalCostsVal = commissionVal + cleaningVal + servicesVal + maintenanceVal + taxVal + hiddenVal;

  const calculatedData = {
    ahorroLimpieza: Math.round(cleaningVal * 0.25) || 75,
    porcentajeOta: Math.round((commissionVal / (rawRev || 1)) * 100) || 15,
    fugaComisiones: Math.round(commissionVal * 0.35) || 150,
    excesoServicios: Math.round((servicesVal / (totalCostsVal || 1)) * 100) || 12,
    recuperacionAnual: Math.round((cleaningVal * 0.25 + commissionVal * 0.35 + servicesVal * 0.15) * 12) || 3840,
    percentilActual: riskLevel === 'LOW' ? 72 : riskLevel === 'MEDIUM' ? 40 : 15,
    percentilObjetivo: riskLevel === 'LOW' ? 90 : riskLevel === 'MEDIUM' ? 78 : 65,
    userOccupancy: Math.round(occupationPct)
  };

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

      {/* 1. COMPONENTE METRICAS (Fijo) */}
      <div className="grid grid-cols-2 gap-4 w-full mb-6">
        <div className="bg-[#121318] border border-zinc-800 rounded-[16px] p-6 flex flex-col justify-between h-[120px] transition-all hover:border-zinc-700/50">
          <div className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mb-2">OCUPACIÓN</div>
          <div className="text-2xl font-black text-white">
            <AnimatedNumber value={Math.round(occupationPct)} suffix="%" />
          </div>
        </div>
        <div className="bg-[#121318] border border-zinc-800 rounded-[16px] p-6 flex flex-col justify-between h-[120px] transition-all hover:border-zinc-700/50">
          <div className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mb-2">INGRESO MENSUAL</div>
          <div className="text-2xl font-black text-white flex items-baseline gap-1">
            <span className="text-sm font-bold text-zinc-500">$</span>
            <AnimatedNumber value={rawRev} />
            <span className="text-[10px] uppercase font-bold text-zinc-500 ml-1 tracking-tighter">USD</span>
          </div>
        </div>
      </div>

      {/* 2. COMPONENTE ALERTA DE RIESGO (Lógica Intocable) */}
      <div 
        className="w-full bg-[#121318] border-2 rounded-[24px] p-8 mb-8 relative overflow-hidden transition-all duration-500"
        style={{ 
          borderColor: narrative.accentColor,
          boxShadow: `0 0 30px ${narrative.glowColor}`
        }}
      >
        <div className={`flex items-center gap-2 ${narrative.accentText} text-[11px] font-bold tracking-widest uppercase mb-4`}>
           <AuditIcon className="w-4 h-4" /> {narrative.label}
        </div>

        <h2 className="text-2xl md:text-[28px] font-black text-white uppercase tracking-tight leading-tight mb-4">
          {renderTitle(narrative.title)}
        </h2>

        <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-medium">
          {narrative.desc}
        </p>

        <div className="pt-6 border-t border-zinc-800/50 flex flex-col gap-4">
          {/* Si es Riesgo Medio / Vulnerable (?status=vulnerable), incluimos obligatoriamente el indicador de noches */}
          {riskLevel === 'MEDIUM' && (
            <div className="flex flex-col">
              <div className="text-white text-lg font-black tracking-tight">
                Estás a <AnimatedNumber value={breakEvenNoches} className="text-[#FFB800]" /> noches de entrar en pérdida
              </div>
            </div>
          )}

          <div className="flex flex-col">
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <TrendingUp className={`w-3.5 h-3.5 ${riskLevel === 'LOW' ? 'text-emerald-500' : 'text-red-500'}`} /> Impacto Económico Detectado
            </div>
            <div className="text-xl md:text-2xl font-black text-white" dangerouslySetInnerHTML={{ __html: narrative.impactText }} />
          </div>
        </div>
      </div>

      {/* 3. COMPONENTE TACÓMETRO */}
      <div className="w-full bg-[#121318] border border-zinc-800 rounded-[24px] p-6 md:p-8 mb-8 relative overflow-hidden group">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#00D1B2] uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D1B2] shadow-[0_0_8px_rgba(0,209,178,0.6)]"></span>
            TACÓMETRO DE EFICIENCIA OPERATIVA
          </span>
          <span className="text-[10px] bg-zinc-800/80 px-2 py-0.5 rounded text-zinc-400 font-mono font-bold">
            Salud: {Math.max(10, 100 - (metrics?.expense_ratio || (rawRev > 0 ? Math.round((lossPotential / rawRev) * 100) : 48)))}/100
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Tacómetro SVG Visual */}
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <div className="relative w-48 h-24 overflow-hidden mb-4">
              <svg viewBox="0 0 200 100" className="w-48 h-24">
                {/* Fondo Gris */}
                <path 
                  d="M20,100 A80,80 0 0,1 180,100" 
                  fill="none" 
                  stroke="#1E2028" 
                  strokeWidth="14" 
                  strokeLinecap="round" 
                />
                {/* Arco de Color */}
                <path 
                  d="M20,100 A80,80 0 0,1 180,100" 
                  fill="none" 
                  stroke={riskLevel === 'LOW' ? '#10b981' : riskLevel === 'MEDIUM' ? '#FFB800' : '#FF2D2D'} 
                  strokeWidth="14" 
                  strokeLinecap="round" 
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * Math.max(10, 100 - (metrics?.expense_ratio || (rawRev > 0 ? Math.round((lossPotential / rawRev) * 100) : 48)))) / 100}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              {/* Aguja Giratoria */}
              <div 
                className="absolute bottom-0 left-1/2 w-1 h-20 bg-[#00D1B2] rounded-t-full origin-bottom transition-transform duration-1000 ease-out shadow-[0_0_10px_rgba(0,209,178,0.5)]"
                style={{ 
                  transform: `translateX(-50%) rotate(${(Math.max(10, 100 - (metrics?.expense_ratio || (rawRev > 0 ? Math.round((lossPotential / rawRev) * 100) : 48))) / 100) * 180 - 90}deg)`
                }}
              />
              <div className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full bg-white border-2 border-[#121318] -translate-x-1/2 translate-y-1/2 shadow-md z-20" />
            </div>

            <div className="text-center">
              <span className="text-2xl font-black text-white">
                {Math.max(10, 100 - (metrics?.expense_ratio || (rawRev > 0 ? Math.round((lossPotential / rawRev) * 100) : 48)))}
              </span>
              <span className="text-zinc-500 text-xs font-bold"> / 100</span>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                Score de Salud Financiera
              </div>
            </div>
          </div>

          {/* Micro-tareas de optimización */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
              MICRO-TAREAS AUTOMATIZADAS RECOMENDADAS:
            </h4>
            {[
              { id: 1, text: "Optimizar canales directos para reducir comisiones", category: "Comisiones", action: "Ajustar recargo OTA" },
              { id: 2, text: "Auditar tarifas de limpieza contra la competencia", category: "Limpieza", action: "Optimizar Limpieza" },
              { id: 3, text: "Automatizar apagado de A/C para reducir costos de energía", category: "Servicios", action: "Configurar Domótica" },
            ].map((alertItem) => (
              <div key={alertItem.id} className="bg-[#1A1B22] border border-zinc-800/40 p-3.5 rounded-xl flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-xs text-white font-semibold leading-snug">
                    {alertItem.text}
                  </span>
                  <span className="text-[9px] text-[#00D1B2]/70 font-extrabold uppercase tracking-wide mt-1">
                    Fuga de {alertItem.category}
                  </span>
                </div>
                <button 
                  onClick={() => alert(`Conectando con n8n: Activando tarea de automatización '${alertItem.action}'...`)}
                  className="shrink-0 text-[10px] font-black uppercase bg-[#10b981] text-[#0B0B0C] px-4 py-2 rounded-lg transition-all hover:bg-[#10b981]/90 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                >
                  ACTIVAR
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. COMPONENTE RADAR DE FUGAS (Vista s34) */}
      <div className="w-full bg-[#111111] border border-zinc-800 rounded-[24px] p-6 md:p-8 mb-8 animate-in fade-in duration-500">
        <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#00D1B2] uppercase mb-2 block flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00D1B2] shadow-[0_0_8px_rgba(0,209,178,0.6)]"></span>
          ANÁLISIS DE COSTOS DETALLADO
        </span>
        <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight">
          Radar de Fugas Invisibles
        </h3>
        <p className="text-xs md:text-sm text-zinc-400 mb-8 leading-relaxed font-medium">
          Desglose exacto de tus costos operativos del período analizado con indicadores de eficiencia y potencial de ahorro estimado por categoría.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Comisión de Plataformas', value: commissionVal, desc: 'Airbnb / Booking.com', ratio: Math.min(20, Math.round((commissionVal / (rawRev || 1)) * 100)) || 15, maxLimit: 12, rec: 'Canalizar reservas directas.' },
            { label: 'Costo de Limpieza', value: cleaningVal, desc: 'Tarifa por rotación', ratio: Math.min(20, Math.round((cleaningVal / (rawRev || 1)) * 100)) || 10, maxLimit: 10, rec: 'Auditar tarifas contra competencia.' },
            { label: 'Servicios Básicos', value: servicesVal, desc: 'Luz, Agua, Internet', ratio: Math.min(20, Math.round((servicesVal / (rawRev || 1)) * 100)) || 7, maxLimit: 5, rec: 'Instalar domótica inteligente.' },
            { label: 'Mantenimiento', value: maintenanceVal, desc: 'Reparaciones preventivas', ratio: Math.min(20, Math.round((maintenanceVal / (rawRev || 1)) * 100)) || 5, maxLimit: 4, rec: 'Plan preventivo mensual.' },
            { label: 'Impuestos y Licencias', value: taxVal, desc: 'Tasa local / Licencia', ratio: Math.min(20, Math.round((taxVal / (rawRev || 1)) * 100)) || 8, maxLimit: 8, rec: 'Exenciones fiscales aplicables.' },
            { label: 'Otros Gastos', value: hiddenVal, desc: 'Costos ocultos y varios', ratio: Math.min(20, Math.round((hiddenVal / (rawRev || 1)) * 100)) || 2, maxLimit: 3, rec: 'Rastreo digital de consumibles.' }
          ].map((cost, idx) => {
            const isExceeded = cost.ratio > cost.maxLimit;
            return (
              <div key={idx} className="bg-[#1A1B22] border border-zinc-800/40 p-4 rounded-xl flex flex-col justify-between h-[135px] transition-all hover:border-zinc-700/50">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span className="text-xs font-bold text-white block">{cost.label}</span>
                      <span className="text-[10px] text-zinc-500 font-medium">{cost.desc}</span>
                    </div>
                    <span className="text-sm font-extrabold text-white font-mono">
                      ${cost.value} <span className="text-[10px] text-zinc-500 font-bold">USD</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-zinc-800/60 h-2 rounded-full overflow-hidden mt-3 mb-2">
                    <div 
                      className={`h-full rounded-full ${isExceeded ? 'bg-red-500' : 'bg-[#10b981]'}`}
                      style={{ width: `${(cost.ratio / 20) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2 pt-2 border-t border-zinc-800/30 text-[10px]">
                  <span className="text-zinc-500 font-bold uppercase tracking-wide">RECOMENDACIÓN:</span>
                  <span className={`font-bold ${isExceeded ? 'text-red-400' : 'text-[#10b981]'}`}>
                    {cost.rec}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. COMPONENTE RESUMEN ECONÓMICO (Plan de Acción Completo Nítido - Vista s33) */}
      <div 
        className="w-full bg-[#111111] border border-zinc-800 rounded-[24px] p-6 md:p-8 relative overflow-hidden transition-all duration-500 min-h-[300px]"
      >
        <div className="flex flex-col gap-4">
          <span className="text-[10px] md:text-xs font-bold tracking-widest text-[#00D1B2] uppercase block flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
            PLAN DE ACCIÓN OPERATIVO PREMIUM
          </span>
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight">
            Tu plan de acción completo está listo.
          </h3>
          
          <div className="space-y-4 pt-2">
            {[
              { 
                title: "① Plan de acción priorizado por unidad", 
                desc: `Se detectó que negociando una tarifa plana de limpieza mensual y redirigiendo un ${calculatedData.porcentajeOta}% del volumen de OTA hacia el motor de reservas directas de Airlocal, se optimizará el flujo libre de caja de manera inmediata.`, 
                impact: "+$320 USD/MES" 
              },
              { 
                title: "② Fugas detectadas por categoría de costo", 
                desc: `Comisión de plataformas sobrepasada por no modular el mark-up de precios y un consumo excedentario del ${calculatedData.excesoServicios}% en servicios básicos atribuible a la gestión operativa analizada.`, 
                impact: "-$210 USD/MES" 
              },
              { 
                title: "③ Proyección de recuperación anual", 
                desc: "Aplicando los focos de optimización descritos basados en tus costos reales, se proyecta un rescate anualizado de capital de manera 100% pasiva.", 
                impact: "+$8,100 USD/AÑO" 
              },
              { 
                title: "④ Ranking de rentabilidad de tu portafolio", 
                desc: `Esta unidad con ${calculatedData.userOccupancy}% de ocupación se localiza en el percentil ${calculatedData.percentilActual}% del mercado de tu ciudad. Al automatizar las tareas prioritarias, ascenderá limpiamente al percentil ${calculatedData.percentilObjetivo}% del top regional.`, 
                impact: "PERCENTIL 18% TOP" 
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#1A1B22] border border-zinc-800/40 p-4 rounded-xl transition-all hover:border-zinc-700/50">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="text-xs md:text-sm font-black text-[#00D1B2] uppercase tracking-wide">
                    {item.title}
                  </h4>
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-[#10b981] px-2.5 py-0.5 rounded font-black tracking-wider uppercase">
                    {item.impact}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FLOATING TEST CONTROLLER FOR EASY SIMULATION */}
      <div className="fixed bottom-6 right-6 z-50 bg-[#121318]/95 border border-[#00D1B2]/20 rounded-xl p-3 shadow-2xl flex items-center gap-3 backdrop-blur-md animate-bounce">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#00D1B2]">
          {isPremiumUnlocked ? "👑 Premium Unlocked" : "⚡ Modo Demo"}
        </span>
        <button
          onClick={() => setIsPremiumUnlocked(!isPremiumUnlocked)}
          className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
            isPremiumUnlocked 
              ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30' 
              : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/30'
          }`}
        >
          {isPremiumUnlocked ? "Bloquear" : "Simular Pago 💳"}
        </button>
      </div>

      {/* 3D — FOOTER */}
      <footer className="w-full text-center text-[10px] md:text-xs text-zinc-600 mt-12 mb-6 flex flex-col gap-1 tracking-wide">
        <p className="font-bold">AIRLOCAL™ Risk Radar · by propiqdata.com</p>
        <p>soporte@propiqdata.com · Términos · Privacidad</p>
      </footer>
    </div>
  );
}
