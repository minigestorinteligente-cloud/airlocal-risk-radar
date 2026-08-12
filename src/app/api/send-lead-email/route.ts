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

function getEstadoConfig(estado: string) {
  const s = (estado || '').toUpperCase();
  if (s.includes('CRITICO') || s.includes('CRÍTICO') || s.includes('HIGH'))
    return { label: 'CRÍTICO', color: '#E53E3E', emoji: '🔴' };
  if (s.includes('VULNERABLE') || s.includes('MEDIUM') || s.includes('TENSO'))
    return { label: 'VULNERABLE', color: '#D69E2E', emoji: '🟡' };
  return { label: 'SALUDABLE', color: '#38A169', emoji: '🟢' };
}

function buildEmailHtml(data: {
  property_name: string;
  estado: string;
  hero_mensual: number;
  score: number;
  email: string;
}): string {
  const { property_name, estado, hero_mensual, score } = data;
  const estadoConfig = getEstadoConfig(estado);
  const propName = property_name || 'Tu Propiedad';
  const potencial = hero_mensual > 0 ? `+$${hero_mensual.toLocaleString()} USD/mes` : 'Potencial por calcular';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Diagnóstico AIRLOCAL</title>
</head>
<body style="margin:0;padding:0;background:#0B0C10;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B0C10;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <span style="font-size:13px;font-weight:900;letter-spacing:4px;color:#00D1B2;text-transform:uppercase;">AIRLOCAL™</span>
          <span style="font-size:13px;font-weight:400;color:#4A5568;letter-spacing:2px;"> | INTELIGENCIA OPERATIVA</span>
        </td></tr>

        <!-- HERO -->
        <tr><td style="background:#111318;border:1px solid #1E2330;border-radius:20px;padding:40px 36px 36px;text-align:center;margin-bottom:24px;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:3px;color:#4A5568;text-transform:uppercase;">DIAGNÓSTICO OPERATIVO</p>
          <h1 style="margin:0 0 6px;font-size:28px;font-weight:900;color:#FFFFFF;letter-spacing:-0.5px;">${propName}</h1>
          <p style="margin:0 0 28px;font-size:13px;color:#4A5568;">Tu diagnóstico express está listo</p>

          <!-- Estado badge -->
          <div style="display:inline-block;background:${estadoConfig.color}18;border:1px solid ${estadoConfig.color}44;border-radius:100px;padding:10px 24px;margin-bottom:28px;">
            <span style="font-size:13px;font-weight:900;color:${estadoConfig.color};letter-spacing:2px;text-transform:uppercase;">
              ${estadoConfig.emoji} ESTADO: ${estadoConfig.label}
            </span>
          </div>

          <!-- Potencial -->
          <div style="background:#0B0C10;border:1px solid #1E2330;border-radius:16px;padding:24px;margin-bottom:28px;">
            <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:3px;color:#4A5568;text-transform:uppercase;">POTENCIAL ECONÓMICO IDENTIFICADO</p>
            <p style="margin:0;font-size:36px;font-weight:900;color:#00D1B2;letter-spacing:-1px;">${potencial}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#4A5568;">estimado inicial sin desglose de costos</p>
          </div>

          <!-- Score -->
          <div style="background:#0B0C10;border:1px solid #1E2330;border-radius:16px;padding:20px;margin-bottom:32px;">
            <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:3px;color:#4A5568;text-transform:uppercase;">SCORE DE SALUD OPERATIVA</p>
            <p style="margin:0;font-size:32px;font-weight:900;color:#FFFFFF;">${score}<span style="font-size:16px;color:#4A5568;font-weight:400;">/100</span></p>
          </div>

          <!-- CTA -->
          <p style="margin:0 0 16px;font-size:13px;color:#A0AEC0;line-height:1.6;">
            Tu diagnóstico gratuito te mostró el panorama general.<br>
            El análisis completo revela <strong style="color:#FFFFFF;">exactamente dónde se va el dinero</strong> y qué mover primero.
          </p>

          <div style="background:#161B26;border:1px solid #2D3748;border-radius:12px;padding:16px;margin-bottom:24px;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:2px;color:#4A5568;text-transform:uppercase;">CÓDIGO DE ACCESO BETA</p>
            <p style="margin:0;font-size:22px;font-weight:900;color:#00D1B2;letter-spacing:4px;">BETA2026</p>
            <p style="margin:4px 0 0;font-size:11px;color:#4A5568;">Acceso ilimitado · Sin costo durante el beta</p>
          </div>

          <a href="https://propiqdata.com/auditoria-test" style="display:inline-block;background:linear-gradient(135deg,#00D1B2,#00FFD1);color:#0B0C10;font-size:13px;font-weight:900;letter-spacing:2px;text-transform:uppercase;padding:16px 36px;border-radius:100px;text-decoration:none;">
            Ver mi análisis completo →
          </a>
        </td></tr>

        <!-- SEPARADOR -->
        <tr><td style="height:24px;"></td></tr>

        <!-- LO QUE INCLUYE -->
        <tr><td style="background:#111318;border:1px solid #1E2330;border-radius:20px;padding:32px 36px;">
          <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:3px;color:#4A5568;text-transform:uppercase;">LO QUE VAS A VER</p>
          ${[
            ['📊','Radiografía operativa','Benchmark vs. propiedades similares'],
            ['🔍','Fugas detectadas','Rubros exactos donde se pierde dinero'],
            ['⚡','Plan de acción priorizado','Qué mover primero para recuperar rentabilidad'],
            ['📈','Proyección financiera','Escenarios con y sin intervención'],
          ].map(([icon, title, desc]) => `
          <div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:20px;">
            <span style="font-size:20px;flex-shrink:0;">${icon}</span>
            <div>
              <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#FFFFFF;">${title}</p>
              <p style="margin:0;font-size:12px;color:#4A5568;">${desc}</p>
            </div>
          </div>`).join('')}
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="padding:28px 0 0;text-align:center;">
          <p style="margin:0 0 8px;font-size:11px;color:#2D3748;">
            AIRLOCAL™ by <a href="https://propiqdata.com" style="color:#00D1B2;text-decoration:none;">propiqdata.com</a>
          </p>
          <p style="margin:0;font-size:10px;color:#1E2330;">
            Recibiste este email porque completaste un diagnóstico en propiqdata.com.<br>
            © 2026 AIRLOCAL. Todos los derechos reservados.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, property_name, estado, hero_mensual, score } = body;

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
      subject: `${property_name || 'Tu propiedad'} — tu diagnóstico AIRLOCAL está listo`,
      html: buildEmailHtml({ property_name, estado, hero_mensual: Number(hero_mensual) || 0, score: Number(score) || 0, email }),
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
