import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const CODE_RE = /^[a-z0-9\-_.]{4,80}$/i;

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code || !CODE_RE.test(code)) {
    return NextResponse.json({ error: 'invalid_code' }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from('reports')
    .select('id, assessment_code, report_data, report_level, status')
    .eq('assessment_code', code)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
