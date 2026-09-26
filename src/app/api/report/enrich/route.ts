import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_RIESGO = ['CRÍTICO', 'VULNERABLE', 'SALUDABLE'];

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'invalid_body' }, { status: 400 }); }

  const { id, riesgo, profit, perdida_potencial } = body;

  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
  }
  if (riesgo !== undefined && !VALID_RIESGO.includes(riesgo)) {
    return NextResponse.json({ error: 'invalid_riesgo' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase
    .from('reports')
    .update({
      riesgo,
      profit: profit ?? null,
      perdida_potencial: perdida_potencial ?? null,
      status: 'analyzed',
    })
    .eq('id', id)
    .neq('status', 'confirmed');

  if (error) {
    return NextResponse.json({ error: 'update_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
