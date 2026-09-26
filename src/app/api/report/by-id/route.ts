import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('reports')
    .select('id, assessment_code, report_data, report_level, status, riesgo, profit, perdida_potencial, created_at')
    .eq('id', id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
