export const dynamic = 'force-dynamic';

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-08-26.dahlia' });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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

  // Marcar el report como premium en Supabase.
  // El flujo de generación del reporte premium lo completa el frontend
  // al volver de Stripe (localStorage → handlePremiumSubmit → n8n).
  const { error: updateErr } = await supabase
    .from('reports')
    .update({ report_level: 'premium' })
    .eq('id', reportId);

  if (updateErr) {
    console.error('[stripe-webhook] supabase update error:', updateErr);
    return Response.json({ ok: false, reason: 'db_update_failed' }, { status: 500 });
  }

  console.log('[stripe-webhook] report marked premium:', reportId);
  return Response.json({ ok: true, report_id: reportId });
}
