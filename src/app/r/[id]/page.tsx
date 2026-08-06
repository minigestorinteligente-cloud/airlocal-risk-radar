'use client';

import { useEffect, useState, Fragment } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { HealthGauge } from '../../auditoria-test/health-gauge';
import { AgentSectionHeader } from '../../../components/AgentSectionHeader';
import AnimatedNumber from '../../../components/AnimatedNumber';

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
  const activeScore    = Number(rd.tacometro?.score_final ?? 53);
  const marginSafety   = Number(metrics.margin_of_safety ?? 9);
  const colchonTitulo  = cab.colchon?.titulo;
  const colchonLabel   = cab.colchon?.label;

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .no-scrollbar-inline::-webkit-scrollbar { display: none !important; }
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
        <div className="px-4 md:px-8 lg:px-16 xl:px-24 py-10 max-w-[1100px] mx-auto">
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-left w-full">

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
                  <div className="text-2xl font-black text-white"><AnimatedNumber value={occupationPct} suffix="%" /></div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-1">Ocupación real del mes</div>
                </div>
              </div>
              <div className="bg-gradient-to-b from-[#1A1D23] to-[#0B0C10] border border-[#2E333C]/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 flex flex-col justify-between h-[140px]">
                <div className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">ADR ACTUAL</div>
                <div>
                  <div className="text-2xl font-black text-white flex items-baseline gap-1">
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
                      ? <span className={`font-black ${accentText}`}>{heroDisplay}</span>
                      : <><span className={`font-black ${accentText}`}>+${fmtMensual} USD/mes</span>{heroAnual > 0 && <> (+${fmtAnual} USD/año)</>}</>
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* BOTÓN "VER MI DIAGNÓSTICO OPERATIVO" — carga el reporte compartido en auditoria-test con los datos pre-llenados */}
            <div className="flex flex-col items-center gap-2">
              <Link
                href={`/auditoria-test?shared_id=${report?.id}`}
                className="w-full max-w-md bg-[#00D1B2] hover:bg-[#00D1B2]/90 text-[#0B0B0C] font-extrabold text-xs md:text-sm uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_0_30px_rgba(0,209,178,0.35)] transition-all duration-300 hover:scale-[1.02] text-center no-underline block"
                style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
              >
                VER MI DIAGNÓSTICO OPERATIVO →
              </Link>
              <span className="text-[9px] font-extrabold text-neutral-500 uppercase tracking-widest">
                ACCESO INSTANTÁNEO · DIAGNÓSTICO 100% PERSONALIZADO
              </span>
            </div>

            {/* BLURRED PREMIUM SECTION */}

              {/* separator */}
              <div className="w-full pt-6 mt-2 mb-4 border-t border-white/5 flex flex-col items-center gap-1 text-center">
                <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase">SECUENCIA DE AUDITORÍA OPERATIVA</span>
                <div className="w-12 h-[2px] rounded-full" style={{ backgroundColor: accentColor }} />
              </div>

              {/* blurred preview — progress bar only, fades out immediately */}
              <div className="relative overflow-hidden" style={{ maxHeight: 110 }}>
                <div className="filter blur-[7px] pointer-events-none select-none opacity-25">

              {/* progress bar */}
              <div
                className="w-full bg-[#121318]/90 border-2 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4 text-left overflow-x-auto no-scrollbar-inline"
                style={{ borderColor: accentColor, boxShadow: `0 0 30px ${glowColor}`, scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {([
                  { num: 1, name: 'DIAGNÓSTICO',   sub: 'Entiende tu estado actual' },
                  { num: 2, name: 'FUGAS',          sub: 'Encuentra el dinero perdido' },
                  { num: 3, name: 'ESTRATEGIA',     sub: 'Define el siguiente movimiento' },
                  { num: 4, name: 'PROYECCIÓN',     sub: 'Visualiza tu potencial' },
                  { num: 5, name: 'PLAN DE ACCIÓN', sub: 'Ejecuta y mejora' },
                ] as { num: number; name: string; sub: string }[]).map((step, idx) => (
                  <Fragment key={step.num}>
                    <div className="flex items-center gap-3 min-w-fit">
                      <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 text-white flex items-center justify-center text-xs font-black shrink-0">{step.num}</div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase tracking-wider text-white leading-none mb-1">{step.name}</span>
                        <span className="text-[10px] font-semibold text-zinc-400 leading-none">{step.sub}</span>
                      </div>
                    </div>
                    {idx < 4 && <div className="h-[1px] flex-1 min-w-[15px] max-w-[40px] hidden xl:block" style={{ background: 'linear-gradient(to right,rgba(255,255,255,0.1),transparent)' }} />}
                  </Fragment>
                ))}
              </div>

                {/* fase 1 */}
                <div className="w-full border border-[#2A2F36] rounded-[20px] p-6 md:p-8 bg-transparent">
                  <AgentSectionHeader fase={1} agent="guardian" />
                  <section className="relative w-full overflow-hidden bg-[#0B0C10] px-4 md:px-6 py-12 rounded-3xl border border-[#2E333C]/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch w-full">
                      <div className="flex flex-col items-center p-6 md:p-8 border border-[#161B26] rounded-2xl bg-[#0E1218]/60">
                        <HealthGauge score={activeScore} riskLevel={riskLevel} />
                        <div className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase mt-4">ESTADO DE SALUD</div>
                        <div className="text-sm font-semibold text-neutral-200 text-center mt-1">
                          {activeScore >= 70 ? 'Operación estable. Requiere seguimiento.' : 'Operación vulnerable. Áreas prioritarias detectadas.'}
                        </div>
                      </div>
                      <div className="flex flex-col justify-start items-start p-6 md:p-8 border border-[#161B26] rounded-2xl bg-[#0E1218]/60 gap-4">
                        <div className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest">Conclusión del Guardián</div>
                        <p className="text-neutral-200 text-sm leading-relaxed font-semibold">El análisis operativo detectó oportunidades de mejora priorizadas por impacto económico real.</p>
                        <div className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest mt-2">Veredicto Operativo</div>
                        <div className="h-4 bg-white/5 rounded w-3/4" />
                        <div className="h-4 bg-white/5 rounded w-1/2" />
                      </div>
                    </div>
                  </section>
                </div>

                {/* fase 2 */}
                <div className="w-full border border-[#2A2F36] rounded-[20px] p-6 md:p-8 bg-transparent">
                  <AgentSectionHeader fase={2} agent="leakHunter" />
                  <div className="w-full bg-[#0B0C10] rounded-3xl border border-[#2E333C]/40 p-8 flex flex-col gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-start gap-4 border-b border-white/5 pb-6">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex-shrink-0" />
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="h-3 bg-white/10 rounded w-2/3" />
                          <div className="h-3 bg-white/5 rounded w-full" />
                          <div className="h-3 bg-white/5 rounded w-4/5" />
                        </div>
                        <div className="h-5 bg-white/10 rounded w-16 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* fase 3 */}
                <div className="w-full border border-[#2A2F36] rounded-[20px] p-6 md:p-8 bg-transparent">
                  <AgentSectionHeader fase={3} agent="strategist" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="border border-white/10 rounded-2xl p-6 bg-[#0E1218]/60 flex flex-col gap-3">
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                        <div className="h-8 bg-white/5 rounded w-1/3" />
                        <div className="h-3 bg-white/5 rounded w-full" />
                        <div className="h-3 bg-white/5 rounded w-3/4" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* fase 4 */}
                <div className="w-full border border-[#2A2F36] rounded-[20px] p-6 md:p-8 bg-transparent">
                  <AgentSectionHeader fase={4} agent="oracle" />
                  <div className="w-full bg-[#0B0C10] rounded-3xl border border-[#2E333C]/40 p-8 flex flex-col gap-6">
                    <div className="h-48 bg-white/5 rounded-2xl w-full" />
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl" />)}
                    </div>
                  </div>
                </div>

                {/* fase 5 */}
                <div className="w-full border border-[#2A2F36] rounded-[20px] p-6 md:p-8 bg-transparent">
                  <AgentSectionHeader fase={5} agent="none" />
                  <div className="flex flex-col gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="border border-white/10 rounded-2xl p-6 bg-[#0E1218]/60 flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="h-3 bg-white/10 rounded w-1/3" />
                          <div className="h-3 bg-white/5 rounded w-full" />
                          <div className="h-3 bg-white/5 rounded w-5/6" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>{/* end blur */}

                {/* fade gradient at bottom of preview */}
                <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #0B0C10)' }} />
              </div>{/* end overflow-hidden preview */}

              {/* CTA — OPCIÓN 3: hook con número real + primario gratis + secundario pago */}
              <div className="w-full flex flex-col items-center text-center gap-6 py-10 px-4">

                {/* Hook con el número real del reporte compartido — mensual + anual */}
                <p className="text-base md:text-lg text-zinc-300 leading-relaxed max-w-lg">
                  <span className="text-white font-black">{propName}</span> tiene identificados{' '}
                  <span className={`font-black ${accentText}`}>
                    {heroDisplay
                      ? heroDisplay
                      : heroAnual > 0
                        ? `+$${fmtMensual} USD/mes (+$${fmtAnual} USD/año)`
                        : `+$${fmtMensual} USD/mes`
                    }
                  </span>{' '}
                  atrapados en su operación.
                </p>

                {/* Headline principal */}
                <h3
                  className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight max-w-md leading-tight"
                  style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
                >
                  ¿Y el tuyo?
                </h3>

                <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-sm -mt-2">
                  El mismo análisis en 90 segundos — completamente gratis.
                </p>

                {/* Agentes */}
                <div className="flex flex-col gap-4 w-full max-w-xs text-left">
                  {([
                    { img: '/assets/icon-guardian.webp', q: '¿Es viable tu operación actual?' },
                    { img: '/assets/icon-cazafugas.webp', q: '¿Dónde exactamente se pierde dinero?' },
                    { img: '/assets/icon-estratega.webp', q: '¿Qué cambiarías primero para recuperarlo?' },
                  ] as { img: string; q: string }[]).map(({ img, q }) => (
                    <div key={q} className="flex items-center gap-4">
                      <img src={img} alt="" style={{ width: 44, height: 44, objectFit: 'contain', flexShrink: 0 }} />
                      <span className="text-zinc-200 text-sm font-semibold">{q}</span>
                    </div>
                  ))}
                </div>

                {/* CTA primario — adquisición */}
                <Link
                  href="/auditoria-test"
                  className="w-full max-w-md bg-[#00D1B2] hover:bg-[#00D1B2]/90 text-[#0B0B0C] font-extrabold text-xs md:text-sm uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_0_30px_rgba(0,209,178,0.35)] transition-all duration-300 hover:scale-[1.02] text-center no-underline block"
                  style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
                >
                  EMPEZAR MI DIAGNÓSTICO GRATIS →
                </Link>

                <span className="text-[9px] font-extrabold text-neutral-500 uppercase tracking-widest">
                  SIN REGISTRO · SIN TARJETA · 90 SEGUNDOS
                </span>


              </div>

          </div>
        </div>
      )}
    </div>
  );
}
