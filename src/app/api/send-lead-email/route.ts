import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Dominios desechables conocidos
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com','yopmail.com','tempmail.com','guerrillamail.com','throwaway.email',
  'sharklasers.com','guerrillamailblock.com','grr.la','guerrillamail.info','spam4.me',
  'trashmail.com','trashmail.net','trashmail.io','tempinbox.com','temp-mail.org',
  'dispostable.com','mailnull.com','spamgourmet.com','10minutemail.com','fakeinbox.com',
  'maildrop.cc','spamherelots.com','spamhereplease.com','discard.email','mailnesia.com',
  'mailnew.com','spamspot.com','spamthisplease.com','superrito.com','throwam.com',
  'trashmail.at','trashmail.io','trashmail.me','trbvm.com','yopmail.fr','cool.fr.nf',
  'jetable.fr.nf','nospam.ze.tc','nomail.xl.cx','mega.zik.dj','speed.1s.fr',
  'courriel.fr.nf','moncourrier.fr.nf','monemail.fr.nf','monmail.fr.nf',
  'dispostable.com','nwytg.net','yevme.com','boun.cr','mailboxy.fun',
]);

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return !!domain && DISPOSABLE_DOMAINS.has(domain);
}

function getEstadoBadge(estado: string): { label: string; bg: string; border: string; text: string } {
  const s = (estado || '').toUpperCase();
  if (s.includes('CRITICO') || s.includes('CRÍTICO') || s.includes('HIGH'))
    return { label: 'CRÍTICO',    bg: '#1F0808', border: '#C84A4A', text: '#C84A4A' };
  if (s.includes('VULNERABLE') || s.includes('MEDIUM') || s.includes('TENSO'))
    return { label: 'VULNERABLE', bg: '#2A2308', border: '#C89B4A', text: '#C89B4A' };
  return   { label: 'SALUDABLE', bg: '#0A1A13', border: '#3EA293', text: '#3EA293' };
}

function buildEmailHtml(data: {
  property_name: string;
  estado: string;
  hero_mensual: number;
  score: number;
  email: string;
  report_id?: string;
}): string {
  const { property_name, estado, hero_mensual, report_id } = data;
  const propName = property_name || 'Tu Propiedad';
  const badge = getEstadoBadge(estado);
  const potentialAmount = hero_mensual > 0 ? `$${hero_mensual.toLocaleString('es')}` : '$0';
  const auditUrl = report_id
    ? `https://propiqdata.com/auditoria-test?shared_id=${report_id}`
    : 'https://propiqdata.com/auditoria-test';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AIRLOCAL — Tu Auditoría Operativa te espera</title>
</head>
<body style="margin:0; padding:0; background-color:#0D0F0E; font-family: 'Inter', Arial, Helvetica, sans-serif;">

<!-- Preheader -->
<div style="display:none; max-height:0; overflow:hidden; opacity:0;">
  ${propName} sigue perdiendo ${potentialAmount} USD/mes — el desglose completo te está esperando.
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D0F0E; padding: 32px 16px;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

        <!-- HEADER / LOGO -->
        <tr>
          <td style="padding: 8px 8px 32px 8px;">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family: 'Montserrat', Arial, sans-serif; font-weight:900; font-size:20px; color:#FFFFFF; letter-spacing: 0.5px;">
                  AIRLOCAL<span style="color:#3EA293;">™</span>
                </td>
              </tr>
              <tr>
                <td style="font-family: 'Inter', Arial, sans-serif; font-size:11px; color:#8A8D8C; letter-spacing: 1.5px; text-transform:uppercase; padding-top:2px;">
                  Inteligencia Operativa &nbsp;|&nbsp; BNB
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- TARJETA PRINCIPAL -->
        <tr>
          <td style="background-color:#15181A; border:1px solid #2A2D2C; border-radius:16px; padding:40px 32px;">

            <!-- Label superior -->
            <div style="font-family:'Inter', Arial, sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#3EA293; text-align:center; margin-bottom:12px;">
              Diagnóstico Operativo
            </div>

            <!-- Nombre propiedad -->
            <div style="font-family:'Montserrat', Arial, sans-serif; font-weight:800; font-size:28px; line-height:1.2; color:#FFFFFF; text-align:center; margin-bottom:24px;">
              ${propName}
            </div>

            <!-- Badge de estado (dinámico) -->
            <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto 28px auto;">
              <tr>
                <td style="background-color:${badge.bg}; border:1px solid ${badge.border}; border-radius:24px; padding:10px 20px;">
                  <span style="font-family:'Inter', Arial, sans-serif; font-weight:700; font-size:12px; letter-spacing:1.5px; color:${badge.text};">
                    ● ESTADO: ${badge.label}
                  </span>
                </td>
              </tr>
            </table>

            <!-- Copy principal -->
            <div style="font-family:'Inter', Arial, sans-serif; font-size:15px; line-height:1.6; color:#C9CCCB; text-align:center; margin-bottom:28px;">
              Tu diagnóstico ya lo dijo: <strong style="color:#FFFFFF;">${propName}</strong> está dejando dinero sobre la mesa.
              Ese número es una <strong style="color:#FFFFFF;">estimación inicial, sin desglose de costos.</strong>
            </div>

            <!-- Caja de impacto económico -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D1F1B; border:1px solid #3EA293; border-radius:12px; margin-bottom:28px;">
              <tr>
                <td style="padding:24px; text-align:center;">
                  <div style="font-family:'Inter', Arial, sans-serif; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:#3EA293; margin-bottom:8px;">
                    Potencial Económico Identificado
                  </div>
                  <div style="font-family:'JetBrains Mono', 'Courier New', monospace; font-weight:700; font-size:32px; color:#3EA293;">
                    +${potentialAmount} USD/mes
                  </div>
                </td>
              </tr>
            </table>

            <!-- Lista de lo que falta ver -->
            <div style="font-family:'Inter', Arial, sans-serif; font-size:14px; line-height:1.9; color:#C9CCCB; margin-bottom:28px; padding-left:4px;">
              <div style="color:#8A8D8C; font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:10px;">Todavía no sabes</div>
              — Dónde exactamente se está yendo ese dinero<br>
              — Qué tan lejos estás de entrar en pérdida<br>
              — Qué mover primero para recuperarlo
            </div>

            <!-- CTA -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="${auditUrl}" target="_blank" style="display:inline-block; background-color:#92E83F; color:#0D0F0E; font-family:'Montserrat', Arial, sans-serif; font-weight:800; font-size:14px; letter-spacing:0.5px; text-decoration:none; padding:16px 32px; border-radius:8px;">
                    COMPLETAR MI AUDITORÍA OPERATIVA →
                  </a>
                </td>
              </tr>
            </table>

            <div style="font-family:'Inter', Arial, sans-serif; font-size:12px; color:#6B6E6D; text-align:center; margin-top:20px;">
              Cada mes que pasa sin corregirlo, ese margen se sigue reduciendo.
            </div>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="padding: 28px 8px 8px 8px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:'Inter', Arial, sans-serif; font-size:12px; color:#6B6E6D;">
                  AIRLOCAL™ by propiqdata.com
                </td>
                <td align="right" style="font-family:'Inter', Arial, sans-serif; font-size:12px; color:#6B6E6D;">
                  <a href="https://propiqdata.com/terms" style="color:#6B6E6D; text-decoration:none;">Términos</a>&nbsp;&nbsp;
                  <a href="https://propiqdata.com/privacy" style="color:#6B6E6D; text-decoration:none;">Privacidad</a>&nbsp;&nbsp;
                  <a href="mailto:soporte@propiqdata.com" style="color:#6B6E6D; text-decoration:none;">Soporte</a>
                </td>
              </tr>
              <tr>
                <td colspan="2" style="font-family:'Inter', Arial, sans-serif; font-size:11px; color:#4A4C4B; padding-top:12px;">
                  © 2026 AIRLOCAL
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, property_name, estado, hero_mensual, score, report_id } = body;

    // 1. Validar formato
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return Response.json({ ok: false, reason: 'invalid_email' }, { status: 400 });
    }

    // 2. Bloquear emails desechables
    if (isDisposableEmail(email)) {
      return Response.json({ ok: false, reason: 'disposable_email' }, { status: 400 });
    }

    // 3. Deduplicar: no enviar si ya se envió en las últimas 24h
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existing } = await supabase
      .from('reports')
      .select('id, created_at')
      .eq('email', email.toLowerCase())
      .gte('created_at', since)
      .limit(1);

    if (existing && existing.length > 0) {
      return Response.json({ ok: false, reason: 'already_sent_24h' });
    }

    // 4. Enviar email via Resend (lazy init para que no explote en build-time sin la key)
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: resendError } = await resend.emails.send({
      from: 'AIRLOCAL <soporte@propiqdata.com>',
      to: email,
      subject: `${property_name || 'Tu propiedad'} — encontramos +${hero_mensual > 0 ? `$${Number(hero_mensual).toLocaleString('es')}` : '$0'} USD/mes atrapados`,
      html: buildEmailHtml({ property_name, estado, hero_mensual: Number(hero_mensual) || 0, score: Number(score) || 0, email, report_id }),
    });

    if (resendError) {
      console.error('Resend error:', resendError);
      return Response.json({ ok: false, reason: 'send_error' }, { status: 500 });
    }

    return Response.json({ ok: true });

  } catch (err) {
    console.error('send-lead-email error:', err);
    return Response.json({ ok: false, reason: 'server_error' }, { status: 500 });
  }
}
