export const dynamic = 'force-dynamic';

import Stripe from 'stripe';

export async function GET(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-08-26.dahlia' });
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return Response.redirect('https://propiqdata.com/auditoria-test', 302);
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const reportId = session.client_reference_id;

    if (reportId) {
      return Response.redirect(
        `https://propiqdata.com/auditoria-test?shared_id=${reportId}&stripe_pago=1`,
        302
      );
    }
  } catch (err) {
    console.error('[stripe-redirect] session retrieve error:', err);
  }

  return Response.redirect('https://propiqdata.com/auditoria-test', 302);
}
