import { NextRequest, NextResponse } from 'next/server';

// Thin server-side proxy that adds the WEBHOOK_SECRET header before
// forwarding to the MicroApps portal. Keeps the secret out of the browser bundle.
export async function POST(request: NextRequest) {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) {
    console.error('[portal-webhook] WEBHOOK_SECRET not configured');
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const resp = await fetch('https://microapps-portal-22.vercel.app/api/webhooks/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-webhook-secret': secret,
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      console.error('[portal-webhook] upstream error:', resp.status, text);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[portal-webhook] fetch error:', err);
    return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
  }
}
