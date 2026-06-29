const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://xfdztydfwreoxawqdgvx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZHp0eWRmd3Jlb3hhd3FkZ3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTU5MTUsImV4cCI6MjA4NjQ5MTkxNX0.mjR0eI1qzHOxZBvl8AXvRbzXeHW4g6dRFXbDUiYCM6g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getReport() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('id', '19282423-c74e-4db9-8abd-0736a84d56fe')
    .single();

  if (error) {
    console.error(error);
  } else {
    fs.writeFileSync('malena_report_green.json', JSON.stringify(data, null, 2));
    console.log('Successfully wrote malena_report_green.json');
  }
}

getReport();
