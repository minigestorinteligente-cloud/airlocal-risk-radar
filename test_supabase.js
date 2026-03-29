const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xfdztydfwreoxawqdgvx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZHp0eWRmd3Jlb3hhd3FkZ3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTU5MTUsImV4cCI6MjA4NjQ5MTkxNX0.mjR0eI1qzHOxZBvl8AXvRbzXeHW4g6dRFXbDUiYCM6g';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Probando conexión a Supabase...');
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('email', 'quick11@gmail.com')
    .limit(1);

  if (error) {
    console.error('Error de conexión:', error);
  } else {
    console.log('Conexión Exitosa. Datos encontrados:');
    console.log(JSON.stringify(data, null, 2));
  }
}

testConnection();
