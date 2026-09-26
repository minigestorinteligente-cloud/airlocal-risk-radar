import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  const since = req.nextUrl.searchParams.get('since'); // ISO timestamp, optional

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  let query = supabase
    .from('reports')
    .select('id, assessment_code, report_data, report_level, status, riesgo, profit, perdida_potencial, created_at')
    .eq('email', email.toLowerCase().trim())
    .order('created_at', { ascending: false })
    .limit(1);

  if (since) {
    query = query.gte('created_at', since) as typeof query;
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
