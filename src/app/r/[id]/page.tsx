'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import AnimatedNumber from '../../../components/AnimatedNumber';
import DiagnosticShowcase from '../../../components/DiagnosticShowcase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

/* ── helpers ── */

function parseRiskLevel(rd: any): 'HIGH' | 'MEDIUM' | 'LOW' {
  const raw = (rd?.cabecera?.risk_level || rd?.free?.risk_level || rd?.estado || 'MEDIUM').toString().toLowerCase();
  if (raw.includes('low') || raw.includes('bajo') || raw.includes('optimo') || raw.includes('saludable') || raw.includes('estable')) return 'LOW';
  if (raw.includes('high') || raw.includes('alto') || raw.includes('critico') || raw.includes('crítico')) return 'HIGH';
  return 'MEDIUM';
}

function parseOccupationPct(rd: any): number {
  const metrics = rd?.free?.metrics || {};
  if (metrics.occupancy_rate) {
    const v = Number(metrics.occupancy_rate);
    return Math.round(v <= 1 ? v * 100 : v);
  }
  const activity: string = rd?.free?.user_summary?.activity || '';
  const occupied = (() => { const m = activity.match(/^(\d+)/); return m ? Number(m[1]) : 0; })();
  const available = (() => {
    if (activity.includes(' de ')) {
      const p = activity.split(' de ');
      if (p[1]) { const m = p[1].match(/^(\d+)/); if (m) return Number(m[1]); }
    }
    return 30;
  })();
  return occupied ? Math.round((occupied / available) * 100) : 0;
}

function parseHeroNum(val: any): number {
  return Number(String(val ?? 0).replace(/[^0-9.-]/g, '')) || 0;
}

function renderTitle(raw: string, accentText: string) {
  const prefix = 'AUDITORÍA:';
  if (raw.toUpperCase().startsWith(prefix)) {
    const rest = raw.substring(prefix.length);
    return <><span className="text-white">{prefix}</span><span className={accentText}>{rest}</span></>;
  }
  return <span className={accentText}>{raw}</span>;
}

/* ── page ── */

export default function SharedReportPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const shouldConfirm = searchParams?.get('confirm') === 'true';

  const [report, setReport]       = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!id || !supabase) { setLoading(false); setNotFound(true); return; }
    supabase
      .from('reports')
      .select('id, riesgo, profit, perdida_potencial, report_data, status')
      .eq('id', id)
      .single()
      .then(({ data, error }: { data: any; error: any }) => {
        if (error || !data) setNotFound(true); else setReport(data);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!shouldConfirm || !report || !supabase) return;
    if (report.status === 'confirmed') { setConfirmed(true); return; }
    supabase.from('reports').update({ status: 'confirmed' }).eq('id', report.id)
      .then(({ error }: { error: any }) => { if (!error) setConfirmed(true); });
  }, [shouldConfirm, report]);

  /* derive */
  const rd      = report?.report_data || {};
  const free    = rd.free || {};
  const metrics = free.metrics || {};
  const summary = free.user_summary || {};
  const cab     = rd.cabecera || {};

  const riskLevel   = report ? parseRiskLevel(rd) : 'MEDIUM';
  const isMedium    = riskLevel === 'MEDIUM';
  const isHigh      = riskLevel === 'HIGH';
  const isLow       = riskLevel === 'LOW';
  const accentColor = isHigh ? '#FF2D2D' : isMedium ? '#FFB800' : '#00B894';
  const accentText  = isHigh ? 'text-[#FF2D2D]' : isMedium ? 'text-[#FFB800]' : 'text-[#00B894]';
  const glowColor   = isHigh ? 'rgba(255,45,45,0.4)' : isMedium ? 'rgba(255,184,0,0.4)' : 'rgba(0,184,148,0.4)';
  const AuditIcon   = isLow ? CheckCircle2 : AlertTriangle;
  const narrLabel   = isHigh ? 'Nivel de Alerta Operativa: Alto' : isMedium ? 'Nivel de Alerta Operativa: Medio' : 'Nivel de Alerta Operativa: Bajo';

  const headline       = cab.headline || free.headline || '';
  const impactText     = free.impact_text || cab.intro || '';
  const heroDisplay    = free.hero_display;
  const heroMensual    = parseHeroNum(free.hero_mensual);
  const heroAnual      = parseHeroNum(free.hero_anual);
  const fmtMensual     = heroMensual.toLocaleString('en-US');
  const fmtAnual       = heroAnual.toLocaleString('en-US');
  const propName       = summary.property_name || 'Propiedad';
  const location       = summary.location || '';
  const capacity       = summary.capacity || '';
  const activity       = summary.activity || '';
  const avgNightly     = Math.round(Number(metrics.avg_nightly_income || 0));
  const occupationPct  = report ? parseOccupationPct(rd) : 0;
  const marginSafety   = Number(metrics.margin_of_safety ?? 9);
  const colchonTitulo  = cab.colchon?.titulo;
  const colchonLabel   = cab.colchon?.label;

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        .no-scrollbar-inline::-webkit-scrollbar { display: none !important; }
        .num-mono { font-family: 'Montserrat', Inter, sans-serif; font-weight: 900; }
      `}</style>

      {/* NAV */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0B0C10]/90 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <img src="/assets/logo-mark.webp" alt="AIRLOCAL" style={{ height: 28, filter: 'drop-shadow(0 0 8px rgba(0,209,178,0.35))' }} />
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-sm tracking-wide text-white uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>AIRLOCAL</span>
            <span className="text-[10px] text-zinc-500 tracking-wide">Inteligencia operativa BNB</span>
          </div>
        </Link>
        <Link href="/auditoria-test" className="text-[#0B0B0C] bg-[#00D1B2] hover:bg-[#00bfa3] font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors no-underline">
          Diagnosticar mi propiedad
        </Link>
      </header>

      {/* CONFIRMATION BANNER */}
      {confirmed && (
        <div className="flex items-center justify-center gap-2 py-2.5 px-6 bg-[#00D1B2]/5 border-b border-[#00D1B2]/15">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00D1B2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#00D1B2]">Correo verificado · Diagnóstico registrado exitosamente</span>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
          <div style={{ width: 36, height: 36, border: '2px solid #00D1B2', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Cargando diagnóstico…</p>
        </div>
      )}

      {/* NOT FOUND */}
      {!loading && notFound && (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center px-6">
          <p className="text-2xl font-black uppercase tracking-tight">Diagnóstico no encontrado</p>
          <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">El enlace puede haber expirado o ser incorrecto.</p>
          <Link href="/auditoria-test" className="bg-[#00D1B2] text-[#0B0B0C] font-bold text-sm px-8 py-3.5 rounded-full no-underline">Hacer mi diagnóstico gratis</Link>
        </div>
      )}

      {/* REPORT */}
      {!loading && report && (
        <>
        <div className="px-4 md:px-8 lg:px-16 xl:px-24 py-10 max-w-[1100px] mx-auto">
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-left w-full">

            {/* ENCABEZADO INTRODUCTORIO */}
            <div className="text-center flex flex-col items-center gap-2 pb-2">
              <span className="text-[#00D1B2] text-[10px] md:text-xs font-extrabold uppercase tracking-[0.2em]">
                DIAGNÓSTICO EXPRESS
              </span>
              <h2 className="text-white text-xl md:text-3xl font-black tracking-tight leading-tight max-w-xl">
                La salud operativa de esta propiedad, en números.
              </h2>
              <p className="text-zinc-400 text-sm md:text-base max-w-md leading-relaxed">
                Una lectura rápida de ocupación, tarifa, margen y nivel de riesgo.
              </p>
            </div>

            {/* CABECERA propiedad */}
            <div className="w-full bg-gradient-to-b from-[#1A1D23] to-[#0B0C10] border border-[#2E333C]/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold text-[#00D1B2] uppercase tracking-widest">PROPIEDAD AUDITADA</span>
                <h2 className="text-xl md:text-2xl font-black text-white leading-tight">{propName}</h2>
                {location && <span className="text-xs text-zinc-400 font-medium">📍 {location}</span>}
              </div>
              {(capacity || activity) && (
                <div className="md:text-right flex flex-col gap-1">
                  <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest md:text-right">ESPECIFICACIONES DE OPERACIÓN</span>
                  <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-semibold">
                    {capacity}{capacity && activity ? ' — ' : ''}{activity}
                  </p>
                </div>
              )}
            </div>

            {/* MÉTRICAS */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-gradient-to-b from-[#1A1D23] to-[#0B0C10] border border-[#2E333C]/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 flex flex-col justify-between h-[140px]">
                <div className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">OCCUPANCY RATE</div>
                <div>
                  <div className="text-2xl font-black text-white num-mono"><AnimatedNumber value={occupationPct} suffix="%" /></div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-1">Ocupación real del mes</div>
                </div>
              </div>
              <div className="bg-gradient-to-b from-[#1A1D23] to-[#0B0C10] border border-[#2E333C]/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 flex flex-col justify-between h-[140px]">
                <div className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">ADR ACTUAL</div>
                <div>
                  <div className="text-2xl font-black text-white flex items-baseline gap-1 num-mono">
                    <span className="text-sm font-bold text-zinc-500">$</span>
                    <AnimatedNumber value={avgNightly} />
                    <span className="text-[10px] uppercase font-bold text-zinc-500 ml-1 tracking-tighter">USD</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-1">Tarifa promedio diaria</div>
                </div>
              </div>
            </div>

            {/* NARRATIVE CARD */}
            <div
              className="w-full bg-[#121318] border-2 rounded-[24px] p-8 relative overflow-hidden text-left"
              style={{ borderColor: accentColor, boxShadow: `0 0 30px ${glowColor}` }}
            >
              <div className={`flex items-center gap-2 ${accentText} text-[11px] font-bold tracking-widest uppercase mb-4`}>
                <AuditIcon className="w-4 h-4" /> {narrLabel}
              </div>
              <h2 className="text-2xl md:text-[28px] font-black text-white uppercase tracking-tight leading-tight mb-4">
                {renderTitle(headline || narrLabel, accentText)}
              </h2>
              {impactText && (
                <p
                  className="text-zinc-400 text-sm leading-relaxed mb-6 font-medium"
                  dangerouslySetInnerHTML={{ __html: impactText.replace(/text-\[#[0-9A-Fa-f]{3,6}\]/g, accentText) }}
                />
              )}
              <div className="pt-6 border-t border-zinc-800/50 flex flex-col gap-4">
                {(isMedium || isLow) && (
                  <div className="text-white text-lg font-black tracking-tight">
                    {isLow
                      ? <>{colchonTitulo || `Tienes ${marginSafety} noches de colchón`} / {colchonLabel || 'DE MARGEN DE SEGURIDAD'}</>
                      : <>Estás a <span className={`${accentText} font-black`}>{marginSafety}</span> noches / DE ENTRAR EN PÉRDIDA</>
                    }
                  </div>
                )}
                <div>
                  <div className={`text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-2`}>
                    <TrendingUp className={`w-3.5 h-3.5 ${accentText}`} /> IMPACTO ECONÓMICO
                  </div>
                  <div className="text-xl md:text-2xl font-black text-white">
                    Potencial Económico Identificado:{' '}
                    {heroDisplay
                      ? <span className={`font-black num-mono ${accentText}`}>{heroDisplay}</span>
                      : <><span className={`font-black num-mono ${accentText}`}>+${fmtMensual} USD/mes</span>{heroAnual > 0 && <span className="num-mono"> (+${fmtAnual} USD/año)</span>}</>
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* PUENTE + IMAGEN + CAPTION */}
            <div className="flex flex-col items-center text-center gap-3 pt-10">
              <span className="text-[#00D1B2] text-[10px] md:text-xs font-extrabold uppercase tracking-[0.2em]">
                AHORA MIRA TU OPERACIÓN
              </span>
              <h3
                className="text-white text-2xl md:text-3xl font-black tracking-tight leading-tight max-w-xl"
                style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
              >
                ¿Tu BNB realmente genera ganancias o solo ingresos?
              </h3>
              <p className="text-zinc-400 text-sm md:text-base max-w-md leading-relaxed">
                Obtén una primera lectura de tu operación en 90 segundos.
              </p>
              <img
                src="/assets/Product_module_transparent.webp"
                alt="El Guardián · El Cazafugas · El Estratega"
                style={{ width: 'min(100%, 1050px)', height: 'auto', display: 'block', marginTop: '8px' }}
              />
              <span className="text-[#00D1B2] text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.2em] mt-1">
                DIAGNÓSTICO OPERATIVO AIRLOCAL
              </span>
              <p className="text-white text-sm md:text-base font-semibold max-w-lg leading-snug">
                Entiende tu operación. Detecta fugas. Decide qué priorizar.
              </p>
            </div>

            {/* CTA ÚNICO — diagnóstico nuevo, sin shared_id */}
            <div className="flex flex-col items-center gap-3 pb-10">
              <Link
                href="/auditoria-test"
                className="w-full max-w-md bg-[#00D1B2] hover:bg-[#00D1B2]/90 text-[#0B0B0C] font-extrabold text-xs md:text-sm uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_0_30px_rgba(0,209,178,0.35)] transition-all duration-300 hover:scale-[1.02] text-center no-underline block"
                style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
              >
                EMPEZAR MI DIAGNÓSTICO GRATIS →
              </Link>
              <span className="text-[9px] font-extrabold text-neutral-500 uppercase tracking-widest">
                90 SEGUNDOS · SIN INSTALACIÓN · CON TUS PROPIOS NÚMEROS
              </span>
            </div>

          </div>
        </div>

        <DiagnosticShowcase descriptionText="" />

        <div className="flex flex-col items-center gap-3 py-10 px-6">
          <Link
            href="/auditoria-test"
            className="w-full max-w-md bg-[#00D1B2] hover:bg-[#00D1B2]/90 text-[#0B0B0C] font-extrabold text-xs md:text-sm uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_0_30px_rgba(0,209,178,0.35)] transition-all duration-300 hover:scale-[1.02] text-center no-underline block"
            style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
          >
            EMPEZAR MI DIAGNÓSTICO GRATIS →
          </Link>
          <span className="text-[9px] font-extrabold text-neutral-500 uppercase tracking-widest">
            90 SEGUNDOS · SIN INSTALACIÓN · CON TUS PROPIOS NÚMEROS
          </span>
        </div>

        <footer style={{ borderTop: '1px solid #1a1f1a', padding: '40px 6vw 32px', backgroundColor: '#0a0c0a' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-mark.webp" alt="AIRLOCAL" style={{ height: '28px', opacity: 0.8 }} />
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="/terms" style={{ color: '#52525b', fontSize: '12px', textDecoration: 'none' }}>Términos</a>
              <a href="/privacy" style={{ color: '#52525b', fontSize: '12px', textDecoration: 'none' }}>Privacidad</a>
              <a href="/refund" style={{ color: '#52525b', fontSize: '12px', textDecoration: 'none' }}>Reembolso</a>
              <a href="mailto:soporte@propiqdata.com" style={{ color: '#52525b', fontSize: '12px', textDecoration: 'none' }}>soporte@propiqdata.com</a>
            </div>
            <p style={{ color: '#3f4740', fontSize: '11px', margin: 0 }}>© 2026 AIRLOCAL · propiqdata.com</p>
          </div>
        </footer>
        </>
      )}
    </div>
  );
}
