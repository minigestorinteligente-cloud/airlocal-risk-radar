import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getEstadoBadge(estado: string): { label: string; bg: string; border: string; text: string } {
  const s = (estado || '').toUpperCase();
  if (s.includes('CRITICO') || s.includes('CRÍTICO') || s.includes('HIGH'))
    return { label: 'CRÍTICO',    bg: '#1F0808', border: '#C84A4A', text: '#C84A4A' };
  if (s.includes('VULNERABLE') || s.includes('MEDIUM') || s.includes('TENSO'))
    return { label: 'VULNERABLE', bg: '#2A2308', border: '#C89B4A', text: '#C89B4A' };
  return   { label: 'SALUDABLE', bg: '#0A1A13', border: '#3EA293', text: '#3EA293' };
}

function buildPremiumEmailHtml(data: {
  property_name: string;
  estado: string;
  score: number;
  hero_mensual: number;
  report_id: string;
}): string {
  const { property_name, estado, score, hero_mensual, report_id } = data;
  const propName = property_name || 'Tu Propiedad';
  const badge = getEstadoBadge(estado);
  const potAmount = hero_mensual > 0 ? `$${hero_mensual.toLocaleString('es')}` : '$0';
  const reportUrl = `https://propiqdata.com/auditoria-test?shared_id=${report_id}`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AIRLOCAL — Tu Auditoría Operativa está lista</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');
</style>
</head>
<body style="margin:0; padding:0; background-color:#0D0F0E; font-family: 'Inter', Arial, Helvetica, sans-serif;">

<!-- Preheader -->
<div style="display:none; max-height:0; overflow:hidden; opacity:0;">
  ${propName} — score ${score}/100, potencial +${potAmount} USD/mes. Tu análisis completo está listo.
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D0F0E; padding: 32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

      <!-- HEADER -->
      <tr>
        <td style="padding: 8px 8px 32px 8px;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-family: 'Montserrat', Arial, Helvetica, sans-serif; font-weight:900; font-size:20px; color:#FFFFFF; letter-spacing: 0.5px;">
                AIRLOCAL<span style="color:#3EA293;">™</span>
              </td>
            </tr>
            <tr>
              <td style="font-family: 'Inter', Arial, Helvetica, sans-serif; font-size:11px; color:#8A8D8C; letter-spacing: 1.5px; text-transform:uppercase; padding-top:2px;">
                Auditoría Operativa &nbsp;|&nbsp; BNB
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CARD -->
      <tr>
        <td style="background-color:#15181A; border:1px solid #2A2D2C; border-radius:16px; padding:40px 32px;">

          <!-- Label -->
          <div style="font-family:'Inter', Arial, Helvetica, sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#3EA293; text-align:center; margin-bottom:12px;">
            Auditoría Operativa Completada ✓
          </div>

          <!-- Nombre propiedad -->
          <div style="font-family:'Montserrat', Arial, Helvetica, sans-serif; font-weight:800; font-size:28px; line-height:1.2; color:#FFFFFF; text-align:center; margin-bottom:24px;">
            ${propName}
          </div>

          <!-- Badge de estado -->
          <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 28px auto;">
            <tr>
              <td style="background-color:${badge.bg}; border:1px solid ${badge.border}; border-radius:24px; padding:10px 20px;">
                <span style="font-family:'Inter', Arial, Helvetica, sans-serif; font-weight:700; font-size:12px; letter-spacing:1.5px; color:${badge.text};">
                  ● ESTADO: ${badge.label}
                </span>
              </td>
            </tr>
          </table>

          <!-- Score + Potencial en dos columnas -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td width="48%" style="background-color:#1A1D1F; border:1px solid #2A2D2C; border-radius:12px; padding:20px 16px; text-align:center; vertical-align:top;">
                <div style="font-family:'Inter', Arial, Helvetica, sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#8A8D8C; margin-bottom:8px;">
                  Score de Salud
                </div>
                <div style="font-family:'Montserrat', Arial, Helvetica, sans-serif; font-weight:900; font-size:38px; color:#FFFFFF; line-height:1;">
                  ${score}<span style="font-size:16px; font-weight:700; color:#8A8D8C;">/100</span>
                </div>
              </td>
              <td width="4%">&nbsp;</td>
              <td width="48%" style="background-color:#0D1F1B; border:1px solid #3EA293; border-radius:12px; padding:20px 16px; text-align:center; vertical-align:top;">
                <div style="font-family:'Inter', Arial, Helvetica, sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#3EA293; margin-bottom:8px;">
                  Potencial Económico
                </div>
                <div style="font-family:'Montserrat', Arial, Helvetica, sans-serif; font-weight:900; font-size:28px; color:#3EA293; line-height:1;">
                  +${potAmount}
                </div>
                <div style="font-family:'Inter', Arial, Helvetica, sans-serif; font-size:11px; font-weight:600; color:#3EA293; margin-top:4px;">
                  USD/mes
                </div>
              </td>
            </tr>
          </table>

          <!-- Copy -->
          <div style="font-family:'Inter', Arial, Helvetica, sans-serif; font-size:15px; line-height:1.6; color:#C9CCCB; text-align:center; margin-bottom:28px;">
            Tu <strong style="color:#FFFFFF;">Auditoría Operativa</strong> de <strong style="color:#FFFFFF;">${propName}</strong> está lista. Incluye el desglose completo de fugas, el plan de acción priorizado y las palancas de mayor impacto en tu rentabilidad.
          </div>

          <!-- CTA -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <a href="${reportUrl}" target="_blank" style="display:inline-block; background-color:#92E83F; color:#0D0F0E; font-family:'Montserrat', Arial, Helvetica, sans-serif; font-weight:800; font-size:14px; letter-spacing:0.5px; text-decoration:none; padding:16px 32px; border-radius:8px;">
                  VER MI REPORTE COMPLETO →
                </a>
              </td>
            </tr>
          </table>

          <div style="font-family:'Inter', Arial, Helvetica, sans-serif; font-size:12px; color:#6B6E6D; text-align:center; margin-top:20px;">
            El link es permanente — accede cuando quieras.
          </div>

        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="padding: 28px 8px 8px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-family:'Inter', Arial, Helvetica, sans-serif; font-size:12px; color:#6B6E6D;">
                AIRLOCAL™ by propiqdata.com
              </td>
              <td align="right" style="font-family:'Inter', Arial, Helvetica, sans-serif; font-size:12px; color:#6B6E6D;">
                <a href="https://propiqdata.com/terms" style="color:#6B6E6D; text-decoration:none;">Términos</a>&nbsp;&nbsp;
                <a href="https://propiqdata.com/privacy" style="color:#6B6E6D; text-decoration:none;">Privacidad</a>&nbsp;&nbsp;
                <a href="mailto:soporte@propiqdata.com" style="color:#6B6E6D; text-decoration:none;">Soporte</a>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="font-family:'Inter', Arial, Helvetica, sans-serif; font-size:11px; color:#4A4C4B; padding-top:12px;">
                © 2026 AIRLOCAL
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
  </td></tr>
</table>

</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, property_name, estado, score, hero_mensual, report_id } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return Response.json({ ok: false, reason: 'invalid_email' }, { status: 400 });
    }
    if (!report_id) {
      return Response.json({ ok: false, reason: 'missing_report_id' }, { status: 400 });
    }

    // Dedup: el premium report tiene un solo ID — solo se envía si el reporte se creó
    // en los últimos 10 min (fresco) para evitar reenvíos por retries del frontend.
    const grace10m = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from('reports')
      .select('id, created_at')
      .eq('id', report_id)
      .eq('report_level', 'premium')
      .gte('created_at', grace10m)
      .limit(1);

    if (!existing || existing.length === 0) {
      return Response.json({ ok: false, reason: 'report_too_old_or_not_found' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const potStr = hero_mensual > 0 ? `$${Number(hero_mensual).toLocaleString('es')}` : '$0';

    const { error: resendError } = await resend.emails.send({
      from: 'AIRLOCAL <soporte@propiqdata.com>',
      to: email,
      subject: `${property_name || 'Tu propiedad'} — tu Auditoría Operativa está lista (score ${score}/100)`,
      html: buildPremiumEmailHtml({
        property_name,
        estado,
        score: Number(score) || 0,
        hero_mensual: Number(hero_mensual) || 0,
        report_id,
      }),
    });

    if (resendError) {
      console.error('Resend premium error:', resendError);
      return Response.json({ ok: false, reason: 'send_error' }, { status: 500 });
    }

    return Response.json({ ok: true });

  } catch (err) {
    console.error('send-premium-email error:', err);
    return Response.json({ ok: false, reason: 'server_error' }, { status: 500 });
  }
}
