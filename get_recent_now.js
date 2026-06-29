const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xfdztydfwreoxawqdgvx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZHp0eWRmd3Jlb3hhd3FkZ3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTU5MTUsImV4cCI6MjA4NjQ5MTkxNX0.mjR0eI1qzHOxZBvl8AXvRbzXeHW4g6dRFXbDUiYCM6g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getRecentReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('email', 'malenasoloads@gmail.com')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error(error);
  } else {
    data.forEach(r => {
      let rData = {};
      try {
        rData = typeof r.report_data === 'string' ? JSON.parse(r.report_data) : r.report_data;
        if (typeof rData === 'string') rData = JSON.parse(rData);
      } catch(e) {}
      const free = rData?.free || rData?.report_data?.free || {};
      const metrics = free?.metrics || {};
      console.log(`Created: ${r.created_at} | ID: ${r.id} | Risk: ${free.risk_level} | BE: ${metrics.break_even_nights} | MS: ${metrics.margin_of_safety} | Net: ${metrics.net_income} | Headline: ${free.headline}`);
    });
  }
}

getRecentReports();
