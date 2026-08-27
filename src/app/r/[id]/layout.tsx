import type { Metadata } from 'next';
import type { ReactNode } from 'react';

const TITLE = 'Diagnóstico Express · AIRLOCAL';
const FALLBACK_DESC = '¿Tu BNB realmente genera ganancias o solo ingresos? Descubre la salud operativa de tu propiedad en 90 segundos.';
const BASE_URL = 'https://propiqdata.com';

/* ── helpers (mirror de page.tsx — no podemos importar desde 'use client') ── */

function parseRiskLevel(rd: any): 'HIGH' | 'MEDIUM' | 'LOW' {
  const raw = (rd?.cabecera?.risk_level || rd?.free?.risk_level || rd?.estado || 'MEDIUM')
    .toString().toLowerCase();
  if (raw.includes('low') || raw.includes('bajo') || raw.includes('optimo') || raw.includes('saludable') || raw.includes('estable')) return 'LOW';
  if (raw.includes('high') || raw.includes('alto') || raw.includes('critico') || raw.includes('crítico')) return 'HIGH';
  return 'MEDIUM';
}

function parseHeroNum(val: any): number {
  return Number(String(val ?? 0).replace(/[^0-9.-]/g, '')) || 0;
}

function riskLabel(level: 'HIGH' | 'MEDIUM' | 'LOW'): string {
  if (level === 'LOW') return 'OPERACIÓN SALUDABLE';
  if (level === 'MEDIUM') return 'MARGEN BAJO PRESIÓN';
  return 'NIVEL CRÍTICO';
}

/* ── data fetch ── */

async function fetchReportMeta(id: string): Promise<{ estado: string; hero: string } | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;

  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/reports?id=eq.${id}&select=report_data`,
      {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return null;

    const rows = await res.json();
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row?.report_data) return null;

    let rd = row.report_data;
    if (typeof rd === 'string') { try { rd = JSON.parse(rd); } catch { return null; } }
    if (rd?.report_data && !rd.free) rd = rd.report_data;

    const level = parseRiskLevel(rd);
    const free = rd?.free || {};
    let hero = '';
    if (free.hero_display) {
      hero = String(free.hero_display);
    } else {
      const amount = parseHeroNum(free.hero_mensual);
      if (amount > 0) hero = `+$${amount.toLocaleString('en-US')} USD/mes`;
    }

    if (!hero) return null;
    return { estado: riskLabel(level), hero };
  } catch {
    return null;
  }
}

/* ── metadata ── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const url = `${BASE_URL}/r/${id}`;
  const imageUrl = `${BASE_URL}/r/${id}/opengraph-image`;

  const meta = await fetchReportMeta(id);
  const description = meta
    ? `Resultado: ${meta.estado} · Potencial identificado: ${meta.hero}. ¿Y tu operación?`
    : FALLBACK_DESC;

  return {
    title: TITLE,
    description,
    openGraph: {
      title: TITLE,
      description,
      url,
      type: 'website',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: TITLE }],
    },
    twitter: {
      card: 'summary_large_image',
      title: TITLE,
      description,
      images: [imageUrl],
    },
  };
}

export default function SharedReportLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
