import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Vercel Cron llama a las rutas mediante un GET request.
export async function GET(request: Request) {
  try {
    console.log('[Cron] Ejecutando ping de mantenimiento para Supabase...');
    
    // Hacemos una consulta extremadamente ligera para registrar actividad en la base de datos
    // y evitar que Supabase pause el proyecto por inactividad.
    const { data, error } = await supabase
      .from('reports')
      .select('id')
      .limit(1);

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase se ha mantenido despierto exitosamente.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Cron] Error al intentar despertar Supabase:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Error de conexión con Supabase' 
    }, { status: 500 });
  }
}
