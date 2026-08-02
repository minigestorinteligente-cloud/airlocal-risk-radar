'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const LEVEL_CONFIG: Record<string, { label: string; color: string; glow: string; icon: string }> = {
  CRÍTICO:    { label: 'RIESGO CRÍTICO',   color: '#ef4444', glow: 'rgba(239,68,68,0.25)',   icon: '🔴' },
  VULNERABLE: { label: 'VULNERABLE',        color: '#f59e0b', glow: 'rgba(245,158,11,0.25)', icon: '🟡' },
  SALUDABLE:  { label: 'SALUDABLE',         color: '#34f5c5', glow: 'rgba(52,245,197,0.25)', icon: '🟢' },
};

function getLevelKey(report: any): string {
  const raw: string =
    report?.nivel_alerta ||
    report?.report_data?.nivel_alerta ||
    report?.report_data?.free?.nivel_alerta ||
    report?.report_data?.cabecera?.nivel_alerta ||
    '';
  const up = raw.toUpperCase();
  if (up.includes('CRÍTICO') || up.includes('CRITICO')) return 'CRÍTICO';
  if (up.includes('VULNERABLE')) return 'VULNERABLE';
  return 'SALUDABLE';
}

function getHeadline(report: any): string {
  return (
    report?.report_data?.cabecera?.headline ||
    report?.report_data?.free?.headline ||
    report?.titulo_principal ||
    ''
  );
}

function getPotencial(report: any): string {
  const val =
    report?.report_data?.guardian_conclusion?.kpis?.impacto_mensual_detectado ||
    report?.report_data?.free?.hero_mensual ||
    report?.potencial_mensual ||
    null;
  if (!val) return '';
  const str = String(val);
  if (str.startsWith('+') || str.includes('$')) return str + ' USD/mes';
  const num = Number(str.replace(/[^0-9.-]/g, ''));
  if (!isNaN(num) && num > 0) return `+$${num.toLocaleString()} USD/mes`;
  return str;
}

function getPropertyName(report: any): string {
  return report?.property_name || report?.report_data?.free?.user_summary?.property_name || 'Propiedad analizada';
}

export default function SharedReportPage() {
  const params = useParams();
  const id = params?.id as string;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id || !supabase) { setLoading(false); setNotFound(true); return; }
    supabase
      .from('reports')
      .select('id, property_name, nivel_alerta, titulo_principal, potencial_mensual, report_data, created_at')
      .eq('id', id)
      .single()
      .then(({ data, error }: { data: any; error: any }) => {
        if (error || !data) { setNotFound(true); } else { setReport(data); }
        setLoading(false);
      });
  }, [id]);

  const levelKey = report ? getLevelKey(report) : 'SALUDABLE';
  const cfg = LEVEL_CONFIG[levelKey];
  const headline = report ? getHeadline(report) : '';
  const potencial = report ? getPotencial(report) : '';
  const propertyName = report ? getPropertyName(report) : '';

  return (
    <div style={{ minHeight: '100vh', background: '#0a0c0a', color: '#f3f5ef', fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 6vw', borderBottom: '1px solid #252b21', backdropFilter: 'blur(6px)', background: 'rgba(10,12,10,0.85)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/assets/logo-mark.webp" alt="AIRLOCAL" style={{ height: 28, width: 'auto', filter: 'drop-shadow(0 0 8px rgba(52,245,197,0.35))' }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 14, letterSpacing: '0.03em', color: '#f3f5ef' }}>AIRLOCAL</span>
            <span style={{ fontSize: 10.5, color: '#98a190', letterSpacing: '0.03em' }}>Inteligencia operativa | BNB</span>
          </div>
        </Link>
        <Link href="/auditoria-test" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13, color: '#0a0c0a', background: '#34f5c5', padding: '9px 18px', borderRadius: 100, textDecoration: 'none' }}>
          Probar gratis
        </Link>
      </nav>

      {/* CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8vw 6vw' }}>
        {loading && (
          <div style={{ textAlign: 'center', color: '#98a190' }}>
            <div style={{ width: 40, height: 40, border: '2px solid #34f5c5', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ fontSize: 13 }}>Cargando diagnóstico…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!loading && notFound && (
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <p style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Diagnóstico no encontrado</p>
            <p style={{ color: '#98a190', marginBottom: 28, lineHeight: 1.6 }}>El enlace puede haber expirado o ser incorrecto.</p>
            <Link href="/auditoria-test" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#34f5c5', color: '#0a0c0a', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 100, textDecoration: 'none' }}>
              Hacer mi diagnóstico gratis
            </Link>
          </div>
        )}

        {!loading && report && (
          <div style={{ width: '100%', maxWidth: 580 }}>
            {/* Badge */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#98a190', background: '#12160f', border: '1px solid #252b21', padding: '6px 14px', borderRadius: 100 }}>
                Diagnóstico Express compartido
              </span>
            </div>

            {/* Main card */}
            <div style={{ background: 'linear-gradient(180deg, #12160f, #0d100d)', border: `1px solid ${cfg.color}40`, borderRadius: 24, padding: '32px 28px', boxShadow: `0 0 60px -20px ${cfg.glow}`, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 13 }}>{cfg.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: cfg.color, fontFamily: 'JetBrains Mono, monospace' }}>
                  {cfg.label}
                </span>
              </div>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 22, lineHeight: 1.25, color: '#f3f5ef', marginBottom: 8 }}>
                {headline || propertyName}
              </p>
              <p style={{ fontSize: 13, color: '#98a190', marginBottom: 0 }}>📍 {propertyName}</p>

              {potencial && (
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #252b21' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#666f60', marginBottom: 6, fontFamily: 'JetBrains Mono, monospace' }}>
                    Potencial recuperable identificado
                  </p>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 26, color: cfg.color }}>
                    {potencial}
                  </p>
                </div>
              )}
            </div>

            {/* CTA banner */}
            <div style={{ background: '#12160f', border: '1px solid #252b21', borderRadius: 20, padding: '28px 24px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800, fontSize: 18, lineHeight: 1.3, marginBottom: 8 }}>
                ¿Cómo está <em>tu</em> operación?
              </p>
              <p style={{ fontSize: 13, color: '#98a190', marginBottom: 22, lineHeight: 1.6 }}>
                Descubre en 90 segundos si tu BNB realmente genera ganancias — sin registrarte ni conectar nada.
              </p>
              <Link
                href="/auditoria-test"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#34f5c5', color: '#0a0c0a', fontWeight: 700, fontSize: 15, padding: '16px 32px', borderRadius: 100, textDecoration: 'none', boxShadow: '0 0 40px rgba(52,245,197,0.25)' }}
              >
                Hacer mi Diagnóstico Express gratis
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </Link>
              <p style={{ fontSize: 11, color: '#666f60', marginTop: 12 }}>Sin registro · Sin tarjeta · 90 segundos</p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ padding: '24px 6vw', borderTop: '1px solid #252b21', textAlign: 'center', fontSize: 11.5, color: '#666f60' }}>
        © 2026 AIRLOCAL · propiqdata.com
      </footer>
    </div>
  );
}
