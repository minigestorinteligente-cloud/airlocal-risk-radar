import Link from 'next/link';
import Image from 'next/image';
// Force redeploy: 2026-05-05T15:20:00Z
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIRLOCAL Risk Radar | Diagnóstico de Rentabilidad para Airbnb",
  description: "Descubre si tu propiedad está generando dinero o perdiéndolo sin darte cuenta. Diagnóstico en 90 segundos, sin Excel ni sistemas complejos.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0C] text-[#eeeeee] font-sans selection:bg-[#00FFD1]/30 overflow-x-hidden">
      
      {/* 0. STICKY ANNOUNCEMENT BAR */}
      <div className="fixed top-0 left-0 w-full h-10 bg-[#0B0B0C]/90 backdrop-blur-md border-b border-white/5 z-[60] flex items-center justify-center px-4">
        <p className="text-[10px] sm:text-xs font-bold tracking-widest text-white uppercase">
          🔥 Diagnóstico gratis por tiempo limitado <span className="text-[#00FFD1] ml-1">(valor real $47)</span>
        </p>
      </div>

      {/* 1. HEADER */}
      <header className="w-full py-5 px-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-[#0B0B0C] sticky top-10 z-50">
        <div className="flex items-center gap-3 font-bold tracking-widest text-white uppercase text-xs">
          <div className="w-8 h-8 rounded-full bg-[#00FFD1] text-[#0B0B0C] flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(0,255,209,0.3)]">A</div>
          <div>AIRLOCAL <span className="text-zinc-500 font-medium ml-2">| Risk Radar</span></div>
        </div>
        <Link 
          href="/diagnostico"
          className="hidden md:inline-flex items-center justify-center px-7 py-3 bg-[#00FFD1] text-[#0B0B0C] text-xs font-bold uppercase tracking-widest transition-all hover:bg-[#00e5bc] rounded-full shadow-[0_4px_14px_rgba(0,255,209,0.25)]"
        >
          Hacer diagnóstico gratis
        </Link>
      </header>

      {/* 2. HERO SECTION FULL WIDTH CENTRADO */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center pt-28 pb-32 px-6 overflow-hidden">
        {/* Background Image Optimizado */}
        <div className="absolute inset-0 pointer-events-none">
          <Image 
            src="/hero-map-bg.png" 
            alt="Background Map" 
            fill 
            className="object-cover" 
            priority 
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float-subtle {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          .animate-float-subtle {
            animation: float-subtle 4s ease-in-out infinite;
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}} />

        {/* Hero Content (Centered) */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#161618] border border-[#00FFD1]/20 text-zinc-200 font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-8 rounded-full shadow-[0_0_15px_rgba(0,255,209,0.1)] animate-fade-in-up" style={{ opacity: 0, animationDelay: '0s' }}>
            🔥 Oferta Limitada: <span className="text-[#00D1B2] font-black">GRATIS</span> <span className="text-zinc-500 font-normal normal-case tracking-normal">(valor real $47)</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-extrabold tracking-tight text-white mb-6 leading-[1.1] animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.1s' }}>
            Descubre si tu Airbnb está generando dinero…<br/>
            <span className="text-[#00D1B2]">o si lo estás perdiendo</span><br/>
            sin darte cuenta
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-[#00D1B2] font-bold tracking-tight mb-5 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.2s' }}>
            Sin Excel. Sin sistemas complejos. Sin adivinar.
          </p>

          {/* Texto soporte */}
          <p className="text-base md:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed font-medium mb-12 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.3s' }}>
            Detecta tu rentabilidad real, identifica fugas y entiende qué corregir en minutos.
          </p>

          {/* Texto sobre Tarjetas */}
          <p className="text-sm md:text-base text-zinc-400 font-medium tracking-wide mb-6 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.35s' }}>
            Tu propiedad hoy está en uno de estos 3 estados:
          </p>

          {/* Tarjetas Visuales (Stacked mobile, Row desktop) */}
          <div className="mb-12 lg:mb-14 w-full flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-8 overflow-visible animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.4s' }}>
            
            {/* Saludable */}
            <div className="w-[200px] lg:w-[260px] animate-float-subtle" style={{ animationDelay: '0s' }}>
              <img src="/card-saludable.png" alt="Estado Saludable" className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(0,255,209,0.2)]" />
            </div>

            {/* Vulnerable */}
            <div className="w-[200px] lg:w-[260px] animate-float-subtle" style={{ animationDelay: '0.2s' }}>
              <img src="/card-vulnerable.png" alt="Estado Vulnerable" className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" />
            </div>

            {/* Critico */}
            <div className="w-[200px] lg:w-[260px] animate-float-subtle" style={{ animationDelay: '0.4s' }}>
              <img src="/card-critico.png" alt="Estado Crítico" className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(255,100,100,0.2)]" />
            </div>

          </div>

          {/* CTA Hero */}
          <div className="flex flex-col items-center animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.6s' }}>
            <Link 
              href="/diagnostico"
              className="inline-flex items-center justify-center px-8 md:px-12 py-5 bg-[#00FFD1] text-[#0B0B0C] text-[15px] sm:text-base font-black uppercase tracking-widest transition-all hover:bg-[#00e5bc] rounded-full shadow-[0_8px_30px_rgba(0,255,209,0.3)] hover:shadow-[0_12px_40px_rgba(0,255,209,0.4)] mb-4 transform hover:-translate-y-1"
            >
              VER MI DIAGNÓSTICO AHORA →
            </Link>
            
            {/* Microcopy */}
            <div className="text-zinc-400 font-medium text-sm tracking-wide">
              Resultado en 90 segundos · Sin registro · Datos reales
            </div>
          </div>

        </div>
      </section>

      {/* 4. DIAGNÓSTICO Y DECISIONES */}
      <section className="w-full bg-[#0B0B0C] py-32 lg:py-40 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto mb-20 lg:mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
              Esto no es un reporte.<br className="hidden md:block"/>
              <span className="text-[#00FFD1]">Es un diagnóstico con decisiones claras.</span>
            </h2>
            <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed">
              No solo te muestra números.<br className="hidden sm:block"/>
              Te dice exactamente qué está pasando… y qué debes hacer.
            </p>
          </div>

          {/* Grid 2 Cols: Qué Analiza vs 3 Estados */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
            
            {/* Bloque Qué Analiza */}
            <div className="bg-[#161618] border border-white/5 rounded-[32px] p-10 md:p-14 shadow-xl flex flex-col justify-center relative overflow-hidden">
              {/* Glow sutil */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-[#00FFD1]/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
              
              <h3 className="text-2xl text-white font-bold mb-10 flex items-center gap-4 relative z-10">
                <div className="w-3 h-3 rounded-full bg-[#00FFD1] shadow-[0_0_10px_#00FFD1]"></div>
                Qué analizamos
              </h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex items-start gap-4 text-lg md:text-xl text-zinc-300 font-medium">
                  <span className="text-[#00FFD1] mt-1 text-sm">✔</span> Ocupación real vs punto de equilibrio
                </li>
                <li className="flex items-start gap-4 text-lg md:text-xl text-zinc-300 font-medium">
                  <span className="text-[#00FFD1] mt-1 text-sm">✔</span> Ingresos vs costos operativos
                </li>
                <li className="flex items-start gap-4 text-lg md:text-xl text-zinc-300 font-medium">
                  <span className="text-[#00FFD1] mt-1 text-sm">✔</span> Margen estimado
                </li>
                <li className="flex items-start gap-4 text-lg md:text-xl text-zinc-300 font-medium">
                  <span className="text-[#00FFD1] mt-1 text-sm">✔</span> Riesgo de pérdida
                </li>
              </ul>
            </div>

            {/* Bloque Los 3 Estados */}
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl text-white font-bold mb-10">
                Tu propiedad cae en uno de estos 3 escenarios:
              </h3>
              <div className="space-y-10">
                {/* Saludable */}
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mt-1">
                    <div className="w-3 h-3 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981]"></div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-2">Estado Saludable</h4>
                    <p className="text-lg text-zinc-400 leading-relaxed">Estás generando utilidad real.<br/>Puedes escalar con control.</p>
                  </div>
                </div>
                {/* Vulnerable */}
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center mt-1">
                    <div className="w-3 h-3 rounded-full bg-[#F59E0B] shadow-[0_0_10px_#F59E0B]"></div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-2">Estado Vulnerable</h4>
                    <p className="text-lg text-zinc-400 leading-relaxed">Tu margen está bajo presión.<br/>Estás a pocas decisiones de perder dinero.</p>
                  </div>
                </div>
                {/* Crítico */}
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mt-1">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444] shadow-[0_0_10px_#EF4444]"></div>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white mb-2">Estado Crítico</h4>
                    <p className="text-lg text-zinc-400 leading-relaxed">Estás operando en pérdida.<br/>Cada mes sin ajustar te cuesta dinero.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA SECCIÓN */}
          <div className="flex justify-center mt-16">
            <Link 
              href="/diagnostico"
              className="inline-flex items-center justify-center px-12 py-6 bg-[#00FFD1] text-[#0B0B0C] text-[15px] sm:text-base font-black uppercase tracking-widest transition-all hover:bg-[#00e5bc] rounded-full shadow-[0_8px_30px_rgba(0,255,209,0.3)] hover:shadow-[0_12px_40px_rgba(0,255,209,0.4)] transform hover:-translate-y-1"
            >
              VER MI DIAGNÓSTICO AHORA →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. SECCIÓN DE CONVERSIÓN: DATOS -> DECISIONES */}
      <section className="relative w-full py-32 lg:py-48 px-6 overflow-hidden border-t border-white/5">
        {/* Background igual al Hero (Optimizado) */}
        <div className="absolute inset-0 pointer-events-none">
          <Image 
            src="/hero-map-bg.png" 
            alt="Background Map" 
            fill 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fade-in-up-delay {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fade-in-up-delay 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        ` }} />

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
              Convierte tus datos<br className="hidden md:block"/>
              <span className="text-[#00FFD1]">en decisiones correctas</span>
            </h2>
            <p className="text-xl md:text-2xl text-zinc-400 font-bold max-w-3xl mx-auto leading-relaxed">
              Si no sabes qué está fallando…<br className="hidden sm:block"/> 
              <span className="text-white">ya estás perdiendo dinero</span>
            </p>
          </div>

          {/* Grid de 4 Dolores (4 en una fila para desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-24">
            {[
              { 
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
                title: 'Ganancia o Pérdida',
                headline: 'No sabes si ganas o pierdes',
                text: 'Tu ocupación puede verse bien… y aun así estar en pérdida.',
                color: 'text-teal-400',
                bg: 'bg-teal-400/10'
              },
              { 
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
                title: 'Fuga de Margen',
                headline: 'Dónde se fuga tu rentabilidad',
                text: 'Precios mal ajustados y costos invisibles sin base.',
                color: 'text-amber-400',
                bg: 'bg-amber-400/10'
              },
              { 
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                title: 'Prioridad Clara',
                headline: 'Qué corregir primero',
                text: 'Tienes muchas variables pero ninguna prioridad real.',
                color: 'text-blue-400',
                bg: 'bg-blue-400/10'
              },
              { 
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
                title: 'Contexto de Mercado',
                headline: 'Estás operando sin contexto',
                text: 'Sin comparación real de si vas bien o mal.',
                color: 'text-purple-400',
                bg: 'bg-purple-400/10'
              }
            ].map((pain, idx) => (
              <div 
                key={idx} 
                className="bg-[#121214] border border-white/10 rounded-[24px] p-8 lg:p-10 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_15px_30px_rgba(0,255,209,0.5)] group opacity-0 animate-fade-up"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div className={`w-12 h-12 rounded-xl ${pain.bg} border border-white/5 flex items-center justify-center mb-6 ${pain.color} shadow-inner group-hover:scale-110 transition-transform`}>
                  {pain.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 tracking-tight group-hover:text-[#00FFD1] transition-colors">{pain.headline}</h3>
                <p className="text-zinc-400 leading-relaxed font-medium text-sm md:text-base">{pain.text}</p>
              </div>
            ))}
          </div>

          {/* Transición Narrativa */}
          <div className="text-center mb-16 opacity-0 animate-fade-up" style={{ animationDelay: '0.8s' }}>
            <p className="text-xl md:text-2xl font-bold text-white mb-2">
              Todo esto te empuja a un resultado claro:
            </p>
            <div className="w-12 h-1 bg-[#00FFD1] mx-auto rounded-full"></div>
          </div>

          {/* Estados en Fila */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 opacity-0 animate-fade-up" style={{ animationDelay: '1s' }}>
            {/* Saludable */}
            <div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-2xl p-6 text-center group hover:bg-[#10B981]/10 transition-all">
              <div className="w-3 h-3 rounded-full bg-[#10B981] mx-auto mb-4 shadow-[0_0_10px_#10B981]"></div>
              <h4 className="text-white font-bold text-lg mb-1">SALUDABLE</h4>
              <p className="text-zinc-500 text-sm">Utilidad real y escalable</p>
            </div>
            {/* Vulnerable */}
            <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/40 rounded-2xl p-8 text-center scale-105 shadow-[0_0_30px_rgba(245,158,11,0.1)] relative z-20 group hover:bg-[#F59E0B]/20 transition-all">
              <div className="w-3 h-3 rounded-full bg-[#F59E0B] mx-auto mb-4 shadow-[0_0_10px_#F59E0B] animate-pulse"></div>
              <h4 className="text-white font-bold text-xl mb-1 tracking-tight">VULNERABLE</h4>
              <p className="text-zinc-400 text-sm font-medium">Margen bajo presión constante</p>
            </div>
            {/* Crítico */}
            <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-2xl p-6 text-center group hover:bg-[#EF4444]/10 transition-all">
              <div className="w-3 h-3 rounded-full bg-[#EF4444] mx-auto mb-4 shadow-[0_0_10px_#EF4444]"></div>
              <h4 className="text-white font-bold text-lg mb-1">CRÍTICO</h4>
              <p className="text-zinc-500 text-sm">Operando en pérdida mensual</p>
            </div>
          </div>

          {/* CTA SECCIÓN */}
          <div className="flex flex-col items-center opacity-0 animate-fade-up" style={{ animationDelay: '1.2s' }}>
            <Link 
              href="/diagnostico"
              className="inline-flex items-center justify-center px-12 py-6 bg-[#00FFD1] text-[#0B0B0C] text-[15px] sm:text-base font-black uppercase tracking-widest transition-all hover:bg-[#00e5bc] rounded-full shadow-[0_15px_40px_rgba(0,255,209,0.3)] hover:shadow-[0_20px_50px_rgba(0,255,209,0.4)] mb-6 transform hover:scale-105"
            >
              VER MI DIAGNÓSTICO AHORA →
            </Link>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              Antes de seguir perdiendo dinero sin darte cuenta
            </p>
          </div>
        </div>
      </section>

      {/* NUEVAS SECCIONES DE VALOR Y CONVERSIÓN */}
      <section className="relative w-full py-24 lg:py-32 px-6 overflow-hidden bg-[#0B0B0C]">
        <div className="relative z-10 max-w-6xl mx-auto">
          
          {/* 5.1. CÓMO FUNCIONA */}
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Cómo funciona en menos de 90 segundos</h2>
            <p className="text-xl text-[#00FFD1] font-bold">Sin Excel. Sin integraciones. Sin complicarte.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-40 relative">
            {/* Línea conectora Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-12"></div>
            
            {[
              { step: '01', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, text: 'Ingresas los datos básicos de tu propiedad' },
              { step: '02', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, text: 'Analizamos ingresos, costos y punto de equilibrio' },
              { step: '03', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>, text: 'Detectamos fugas, errores y riesgos ocultos' },
              { step: '04', icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, text: 'Te mostramos qué corregir primero' }
            ].map((s, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center opacity-0 animate-fade-up" style={{ animationDelay: `${idx * 0.2}s` }}>
                <div className="w-16 h-16 rounded-2xl bg-[#161618] border border-white/5 flex items-center justify-center mb-6 text-[#00FFD1] shadow-xl">
                  {s.icon}
                </div>
                <div className="text-[10px] font-black text-[#00FFD1] uppercase tracking-[0.2em] mb-3">Paso {s.step}</div>
                <p className="text-white font-medium text-base leading-relaxed max-w-[180px]">{s.text}</p>
              </div>
            ))}
          </div>

          {/* 5.2. QUÉ RECIBES */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">No solo ves números.<br/>Sabes exactamente qué hacer.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-32">
            {[
              { 
                icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                title: 'Estado real de tu propiedad',
                text: 'Saludable, vulnerable o crítico. Sin interpretaciones.'
              },
              { 
                icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                title: 'Tu rentabilidad real estimada',
                text: 'Cuánto estás ganando… o perdiendo realmente.'
              },
              { 
                icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
                title: 'Fugas detectadas automáticamente',
                text: 'Precios, ocupación o costos mal optimizados.'
              },
              { 
                icon: <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                title: 'Plan de acción claro',
                text: 'Qué corregir, dónde actuar y por dónde empezar.',
                highlight: true
              }
            ].map((card, idx) => (
              <div 
                key={idx} 
                className={`p-10 rounded-[32px] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  card.highlight 
                  ? 'bg-[#161618] border-[#00FFD1]/40 shadow-[0_0_40px_rgba(0,255,209,0.1)]' 
                  : 'bg-[#121214] border-white/5 hover:border-white/10'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${card.highlight ? 'bg-[#00FFD1] text-[#0B0B0C]' : 'bg-[#161618] text-[#00FFD1] border border-white/5'}`}>
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{card.title}</h3>
                <p className="text-zinc-400 text-lg leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>

          {/* 5.3. PRUEBA / CONFIANZA */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl font-medium text-white mb-4">
              Basado en <span className="text-[#00FFD1]">datos reales</span>, no estimaciones.<br/>
              Comparado contra propiedades similares en tu zona.
            </p>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              No necesitas PMS ni herramientas avanzadas. Solo claridad.
            </p>
          </div>

          {/* CTA FINAL DE SECCIÓN */}
          <div className="flex flex-col items-center">
            <Link 
              href="/diagnostico"
              className="inline-flex items-center justify-center px-12 py-6 bg-[#00FFD1] text-[#0B0B0C] text-[15px] sm:text-base font-black uppercase tracking-widest transition-all hover:bg-[#00e5bc] rounded-full shadow-[0_15px_40px_rgba(0,255,209,0.3)] hover:shadow-[0_20px_50px_rgba(0,255,209,0.4)] mb-6 transform hover:scale-105"
            >
              VER MI DIAGNÓSTICO AHORA →
            </Link>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              Antes de seguir perdiendo dinero sin darte cuenta
            </p>
          </div>

        </div>
      </section>

      {/* 6. CIERRE DE ALTO IMPACTO: SIMPLIFICADO */}
      <section className="w-full relative py-32 md:py-40 px-6 border-t border-white/5 overflow-hidden bg-[#0B0B0C]">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#00FFD1]/5 to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Accent Line */}
          <div className="w-16 h-1 bg-[#00FFD1] mb-12 rounded-full shadow-[0_0_15px_#00FFD1]"></div>
          
          {/* Headline Directo */}
          <h2 className="text-4xl md:text-6xl lg:text-[72px] font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
            Seguir operando sin claridad<br/>
            <span className="text-[#00FFD1]">te está costando dinero.</span>
          </h2>

          {/* Subtexto */}
          <div className="mb-12">
            <p className="text-xl md:text-2xl text-zinc-400 font-medium mb-6 leading-relaxed">
              Cada día que pasa sin entender tus números…
            </p>
            <p className="text-2xl md:text-3xl font-bold text-white mb-12">
              👉 Es dinero que se pierde sin que lo veas.
            </p>
            
            <p className="text-xl md:text-2xl font-bold text-[#00FFD1] max-w-2xl mx-auto border-y border-white/5 py-8">
              👉 Operar sin diagnóstico no es una decisión segura.<br className="hidden sm:block"/> 
              <span className="text-white">Es una apuesta.</span>
            </p>
          </div>

          {/* Bloque Clave: Control */}
          <div className="mb-20 w-full max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">Este diagnóstico no te da más datos.<br/>Te da control.</h3>
            
            <div className="bg-[#121214] border border-white/5 rounded-[32px] p-8 md:p-10 text-left">
              <p className="text-sm font-black text-[#00FFD1] uppercase tracking-[0.2em] mb-6">En menos de 90 segundos sabes:</p>
              <ul className="space-y-5">
                {[
                  'Si estás ganando o perdiendo',
                  'Dónde se está rompiendo tu margen',
                  'Qué debes corregir primero'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-lg md:text-xl text-white font-medium">
                    <span className="text-[#00FFD1] text-xl">✔</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA FINAL */}
          <div className="flex flex-col items-center">
            <Link 
              href="/diagnostico"
              className="inline-flex items-center justify-center px-12 py-6 bg-[#00FFD1] text-[#0B0B0C] text-lg font-black uppercase tracking-widest transition-all hover:bg-[#00e5bc] rounded-full shadow-[0_15px_50px_rgba(0,255,209,0.4)] hover:shadow-[0_20px_60px_rgba(0,255,209,0.5)] mb-8 transform hover:scale-105"
            >
              VER MI DIAGNÓSTICO AHORA →
            </Link>
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest bg-[#161618] px-6 py-3 rounded-full border border-white/5">
              Gratis hoy. Resultado en segundos.
            </span>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="w-full bg-[#0B0B0C] border-t border-white/5 pt-20 pb-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {/* Col 1: Brand */}
            <div className="flex flex-col gap-6 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 font-bold tracking-widest text-white uppercase text-xs">
                <div className="w-8 h-8 rounded-full bg-[#00FFD1] text-[#0B0B0C] flex items-center justify-center font-black text-sm shadow-[0_0_10px_rgba(0,255,209,0.2)]">A</div>
                <span>AIRLOCAL™ Risk Radar</span>
              </div>
              <p className="text-zinc-500 text-[11px] leading-relaxed max-w-xs mx-auto md:mx-0 font-medium">
                by propiqdata.com<br/><br/>
                Tu copiloto de rentabilidad inteligente.<br/>
                Predice riesgos y maximiza ganancias.
              </p>
            </div>

            {/* Col 2: Soporte */}
            <div className="text-center md:text-left">
              <h4 className="text-white text-[11px] font-bold uppercase tracking-widest mb-6">Soporte</h4>
              <p className="text-zinc-500 text-xs mb-2">soporte@propiqdata.com</p>
              <p className="text-zinc-600 text-[10px] uppercase tracking-wider">Respuesta en menos de 24h</p>
            </div>

            {/* Col 3: Legal */}
            <div className="text-center md:text-left">
              <h4 className="text-white text-[11px] font-bold uppercase tracking-widest mb-6">Legal</h4>
              <nav className="flex flex-col gap-4">
                <Link href="/terms" className="text-zinc-500 text-[11px] hover:text-[#00FFD1] transition-colors">Términos y Condiciones</Link>
                <Link href="/privacy" className="text-zinc-500 text-[11px] hover:text-[#00FFD1] transition-colors">Política de Privacidad</Link>
              </nav>
            </div>

            {/* Col 4: Value */}
            <div className="flex flex-col gap-4 items-center md:items-start">
              <div className="flex items-center gap-3 text-zinc-500 text-[11px] font-medium">
                <span className="text-[#00FFD1] font-bold">✔</span> Diagnóstico en 90 segundos
              </div>
              <div className="flex items-center gap-3 text-zinc-500 text-[11px] font-medium">
                <span className="text-[#00FFD1] font-bold">✔</span> Sin registro obligatorio
              </div>
              <div className="flex items-center gap-3 text-zinc-500 text-[11px] font-medium">
                <span className="text-[#00FFD1] font-bold">✔</span> Basado en datos reales
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col items-center text-center gap-2">
            <p className="text-zinc-600 font-mono text-[10px] tracking-[0.2em] uppercase">
              © 2026 AIRLOCAL by propiqdata.com
            </p>
            <p className="text-zinc-700 font-mono text-[9px] uppercase tracking-widest">
              Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
      
    </main>
  );
}