export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-08-26.dahlia' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const body      = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';
  const secret    = process.env.STRIPE_WEBHOOK_SECRET ?? '';

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err: any) {
    console.error('[stripe-webhook] signature error:', err.message);
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return Response.json({ ok: true, ignored: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const reportId = session.client_reference_id;

  if (!reportId) {
    console.warn('[stripe-webhook] no client_reference_id in session', session.id);
    return Response.json({ ok: false, reason: 'no_report_id' });
  }

  if (session.payment_status !== 'paid') {
    console.warn('[stripe-webhook] payment not paid, status:', session.payment_status);
    return Response.json({ ok: false, reason: 'not_paid' });
  }

  // 1. Marcar el report como premium en Supabase
  const { error: updateErr } = await supabase
    .from('reports')
    .update({ report_level: 'premium' })
    .eq('id', reportId);

  if (updateErr) {
    console.error('[stripe-webhook] supabase update error:', updateErr);
    return Response.json({ ok: false, reason: 'db_update_failed' }, { status: 500 });
  }

  // 2. Disparar n8n para generar el reporte premium (fire-and-forget)
  const { data: report } = await supabase
    .from('reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (report) {
    const n8nWebhookUrl = process.env.N8N_PREMIUM_WEBHOOK_URL;
    if (n8nWebhookUrl) {
      const payload = new URLSearchParams();
      const rd = report.report_data || {};
      Object.entries({
        property_name:        report.property_name    || '',
        country:              report.country           || '',
        city:                 report.city              || '',
        property_type:        report.property_type     || '',
        market_type:          report.market_type       || '',
        rooms:                String(rd.rooms          ?? report.rooms          ?? ''),
        bathrooms:            String(rd.bathrooms      ?? report.bathrooms      ?? ''),
        beds:                 String(rd.beds           ?? report.beds           ?? ''),
        nightly_rate:         String(rd.nightly_rate   ?? report.nightly_rate   ?? ''),
        occupancy_rate:       String(rd.occupancy_rate ?? report.occupancy_rate ?? ''),
        management_cost:      String(rd.management_cost ?? 0),
        cleaning_cost:        String(rd.cleaning_cost   ?? 0),
        supplies_cost:        String(rd.supplies_cost   ?? 0),
        services_cost:        String(rd.services_cost   ?? 0),
        maintenence_cost:     String(rd.maintenence_cost ?? 0),
        tax_cost:             String(rd.tax_cost         ?? 0),
        Hidden_cost:          String(rd.Hidden_cost      ?? 0),
        stability_perception: String(rd.stability_perception ?? ''),
        risk_perception:      String(rd.risk_perception      ?? ''),
        no_major_risk:        String(rd.no_major_risk        ?? ''),
        email:                report.email            || '',
        assessment_code:      report.assessment_code  || '',
        uuid:                 report.id,
      }).forEach(([k, v]) => payload.append(k, v));

      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      }).catch((err) => console.error('[stripe-webhook] n8n trigger error:', err));
    }
  }

  console.log('[stripe-webhook] report upgraded to premium:', reportId);
  return Response.json({ ok: true, report_id: reportId });
}
