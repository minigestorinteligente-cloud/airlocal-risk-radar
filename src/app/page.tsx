import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0C] text-[#eeeeee] font-sans selection:bg-[#00FFD1]/30 overflow-x-hidden">
      
      {/* 1. HEADER */}
      <header className="w-full py-5 px-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-[#0B0B0C] sticky top-0 z-50">
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

      {/* 2. HERO SECTION */}
      <section className="w-full max-w-[1400px] mx-auto px-6 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-16 lg:gap-12">
        
        {/* Izquierda: Copy Principal */}
        <div className="w-full lg:w-5/12 flex flex-col items-start text-left relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#161618] border border-white/5 text-zinc-300 font-mono text-[10px] uppercase tracking-widest mb-8 rounded-full shadow-sm">
            <div className="w-1.5 h-1.5 bg-[#00FFD1] rounded-full shadow-[0_0_5px_#00FFD1]"></div>
            AIRLOCAL <span className="text-zinc-600">|</span> RISK RADAR
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Descubre si tu propiedad está dejando utilidad… <span className="text-[#00FFD1]">o entrando en zona de riesgo.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed font-medium">
            Mide en menos de 90 segundos si esta unidad está sana, vulnerable o crítica, usando ocupación, ingresos y gastos reales.
          </p>

          <ul className="space-y-4 mb-12">
            {[
              "Detecta si la ocupación realmente sostiene los costos",
              "Identifica si el margen está sano o bajo presión",
              "Recibe una señal clara de qué corregir primero"
            ].map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-4 text-zinc-300 font-medium md:text-lg">
                <svg className="w-6 h-6 text-[#00FFD1] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/diagnostico"
              className="inline-flex items-center justify-center px-10 py-4 bg-[#00FFD1] text-[#0B0B0C] text-sm font-bold uppercase tracking-widest transition-all hover:bg-[#00e5bc] rounded-full shadow-[0_6px_20px_rgba(0,255,209,0.3)] hover:shadow-[0_8px_25px_rgba(0,255,209,0.4)]"
            >
              Hacer diagnóstico gratis
            </Link>
          </div>
        </div>

        {/* Derecha: Imagen Real del Reporte en lugar de Mockup CSS */}
        <div className="w-full lg:w-7/12 flex justify-center relative">
          <div className="relative w-full max-w-[600px]">
             {/* Resplandor de fondo base */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80%] bg-[#00FFD1]/10 rounded-[100px] blur-[100px] pointer-events-none"></div>
             {/* Imagen del reporte real provisto */}
             <img 
               src="/a10.png" 
               alt="Reporte Premium AIRLOCAL Risk Radar" 
               className="relative z-10 w-full h-auto object-contain rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/5 opacity-90 transition-opacity hover:opacity-100"
             />
          </div>
        </div>
      </section>

      {/* 3. PAIN POINTS SECTION */}
      <section className="w-full bg-[#121214] py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
              ¿Te suena familiar?
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 font-medium leading-relaxed">
              Muchas unidades facturan, pero no todas dejan utilidad real. El problema no es trabajar más: es no ver a tiempo qué está drenando el margen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Ingresos que se ven bien, pero no cuadran",
              "Gastos ocultos que drenan rentabilidad",
              "Semanas débiles que llegan sin aviso",
              "Decisiones tomadas por intuición",
              "Demasiadas métricas, poca claridad",
              "Horas perdidas en Excel o plataformas"
            ].map((pain, idx) => (
              <div key={idx} className="bg-[#161618] border border-white/5 rounded-2xl p-8 hover:border-[#00FFD1]/20 transition-all shadow-lg group">
                <div className="w-10 h-10 rounded-full bg-[#0B0B0C] border border-white/5 flex items-center justify-center text-zinc-500 font-mono text-[10px] mb-6 group-hover:text-[#00FFD1] group-hover:border-[#00FFD1]/30 transition-colors">
                  {String(idx+1).padStart(2,'0')}
                </div>
                <p className="text-zinc-300 font-bold text-[17px] leading-snug">{pain}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SOLUTION SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col lg:flex-row gap-16 md:gap-20">
        <div className="w-full lg:w-5/12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-8 leading-[1.15]">
            AIRLOCAL te muestra el estado real de tu unidad
          </h2>
          <p className="text-lg text-zinc-400 font-medium mb-12 leading-relaxed">
            No necesitas otro dashboard lleno de métricas. Necesitas un veredicto claro: si la unidad está saludable, vulnerable o en riesgo.
          </p>

          <div className="space-y-4">
            {[
              {
                title: "Veredicto claro en 90 segundos",
                desc: "Para saber si esta unidad está sana, vulnerable o entrando en pérdida."
              },
              {
                title: "Señal exacta de dónde se rompe el margen",
                desc: "Para detectar si el problema viene de ocupación, gasto o presión operativa."
              },
              {
                title: "Umbral de salud visible",
                desc: "Para entender cuánto margen tienes antes de entrar en zona de riesgo."
              },
              {
                title: "Acción recomendada basada en números",
                desc: "Para decidir qué corregir primero sin adivinar."
              }
            ].map((benefit, idx) => (
              <div key={idx} className="flex flex-col bg-[#161618]/50 p-5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-5 h-5 rounded-full bg-[#00FFD1]/10 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FFD1]"></div>
                  </div>
                  <span className="text-white font-bold text-[15px]">{benefit.title}</span>
                </div>
                <span className="text-zinc-400 font-medium text-sm pl-8">{benefit.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-7/12 flex items-center justify-center relative">
          <div className="relative w-full max-w-[500px]">
             {/* Imagen secundaria real */}
             <img 
               src="/a11.png" 
               alt="Radar de Rentabilidad AIRLOCAL" 
               className="relative z-10 w-full h-auto object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/5 opacity-80 transition-opacity hover:opacity-100"
             />
          </div>
        </div>
      </section>

      {/* 5. WHAT IT ANALYZES SECTION */}
      <section className="w-full py-24 md:py-32 bg-[#0B0B0C] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16 md:gap-20 relative z-10">
          <div className="w-full md:w-1/3">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
              Qué analiza<br/> este diagnóstico
            </h2>
            <p className="text-zinc-500 mt-6 font-mono text-[10px] uppercase tracking-widest pl-4 border-l border-[#00FFD1]/30">
              Variables de Auditoría
            </p>
          </div>

          <div className="w-full md:w-2/3">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12 border-t border-white/5 pt-12 md:pt-4">
               {[
                 { title: "Ocupación útil", desc: "Para saber si las noches vendidas realmente sostienen la operación." },
                 { title: "Ingreso real", desc: "Para ver cuánto produce la unidad más allá del bruto." },
                 { title: "Gasto operativo", desc: "Para detectar cuánto se está comiendo tu margen antes de verlo." },
                 { title: "Presión del margen", desc: "Para entender qué tan cerca estás de una zona de riesgo." },
                 { title: "Riesgo de pérdida", desc: "Para anticiparte antes de cerrar un mes malo." },
                 { title: "Oportunidad de mejora", desc: "Para encontrar dinero escondido sin aumentar ruido." }
               ].map((pto, idx) => (
                  <div key={idx} className="flex flex-col group">
                    <div className="flex gap-4 items-center mb-2">
                       <span className="text-[#00FFD1]/30 font-mono text-xs group-hover:text-[#00FFD1] transition-colors">[{String(idx+1).padStart(2,'0')}]</span>
                       <span className="text-zinc-200 font-bold text-[17px]">{pto.title}</span>
                    </div>
                    <p className="text-zinc-400 text-sm font-medium pl-9">{pto.desc}</p>
                  </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS SECTION */}
      <section className="w-full bg-[#121214] py-24 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-20 text-center">
            Cómo funciona
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative text-center md:text-left">
            <div className="hidden md:block absolute top-[28px] left-12 right-12 h-[1px] bg-white/5 z-0"></div>
            
            {[
              { title: "Ingresa 4 datos básicos", desc: "No necesitas conectar PMS financieros. Datos simples para un análisis rápido." },
              { title: "AIRLOCAL evalúa la unidad", desc: "Correlacionamos costos contra ocupación real para revelar fugas ocultas." },
              { title: "Recibes tu Risk Radar", desc: "Obtienes el veredicto final para saber con certeza el estado de la propiedad." }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center md:items-start bg-[#121214]">
                <div className="w-14 h-14 rounded-full bg-[#161618] border border-white/5 flex items-center justify-center text-lg font-bold text-[#00FFD1] mb-8 shadow-lg">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-zinc-400 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PREVIEW STATES SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="mb-16 md:mb-20 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
            Tu propiedad ya está en uno de estos 3 estados
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-medium">
            La pregunta no es si facturó. La pregunta es si realmente está sana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SALUDABLE */}
          <div className="bg-[#161618] border border-white/5 rounded-2xl p-8 relative overflow-hidden shadow-lg group flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[#10B981]"></div>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981]"></div>
                <div className="text-[#10B981] font-bold text-[10px] uppercase tracking-widest">Saludable</div>
            </div>
            <p className="text-[19px] text-white font-bold leading-snug mb-3">
              La unidad sostiene su margen.
            </p>
            <p className="text-sm text-zinc-400 mb-8 font-medium">
              Tu ocupación y tu estructura de costos están en equilibrio saludable.
            </p>
            
            <div className="mt-auto">
              <div className="bg-[#0B0B0C] border border-white/5 rounded-xl p-5 mb-5 shadow-inner">
                 <div className="text-zinc-500 font-mono text-[9px] uppercase tracking-widest mb-2 flex items-center gap-2">
                   <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   Acción recomendada
                 </div>
                 <div className="text-zinc-200 font-medium text-sm leading-relaxed">
                   Mantener tarifa y monitorear semanalmente.
                 </div>
              </div>
              <div className="flex items-center gap-2 text-[#10B981] font-mono text-xs font-bold bg-[#10B981]/10 px-4 py-2 rounded-lg w-fit border border-[#10B981]/20">
                 Margen &gt; 35%
              </div>
            </div>
          </div>

          {/* VULNERABLE */}
          <div className="bg-[#161618] border border-white/5 rounded-2xl p-8 relative overflow-hidden shadow-lg group flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[#F59E0B]"></div>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_10px_#F59E0B]"></div>
                <div className="text-[#F59E0B] font-bold text-[10px] uppercase tracking-widest">Vulnerable</div>
            </div>
            <p className="text-[19px] text-white font-bold leading-snug mb-3">
              El margen empieza a comprimirse.
            </p>
            <p className="text-sm text-zinc-400 mb-8 font-medium">
              La unidad factura, pero ya muestra presión operativa o consumo alto de gastos.
            </p>
            
            <div className="mt-auto">
              <div className="bg-[#0B0B0C] border border-white/5 rounded-xl p-5 mb-5 shadow-inner">
                 <div className="text-[#F59E0B]/70 font-mono text-[9px] uppercase tracking-widest mb-2 flex items-center gap-2">
                   <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                   Acción recomendada
                 </div>
                 <div className="text-zinc-200 font-medium text-sm leading-relaxed">
                   Revisar pricing, costos variables o estrategia de ocupación.
                 </div>
              </div>
              <div className="flex items-center gap-2 text-[#F59E0B] font-mono text-xs font-bold bg-[#F59E0B]/10 px-4 py-2 rounded-lg w-fit border border-[#F59E0B]/20">
                 Margen 15–35%
              </div>
            </div>
          </div>

          {/* CRÍTICO */}
          <div className="bg-[#161618] border border-white/5 rounded-2xl p-8 relative overflow-hidden shadow-lg group flex flex-col h-full">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-[#EF4444]"></div>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_10px_#EF4444]"></div>
                <div className="text-[#EF4444] font-bold text-[10px] uppercase tracking-widest">Crítico</div>
            </div>
            <p className="text-[19px] text-white font-bold leading-snug mb-3">
              La unidad ya está en zona de riesgo.
            </p>
            <p className="text-sm text-zinc-400 mb-8 font-medium">
              Tus costos están rompiendo el margen y la operación puede entrar en pérdida.
            </p>
            
            <div className="mt-auto">
              <div className="bg-[#0B0B0C] border border-[#EF4444]/10 rounded-xl p-5 mb-5 shadow-inner">
                 <div className="text-[#EF4444]/80 font-mono text-[9px] uppercase tracking-widest mb-2 flex items-center gap-2">
                   <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   Acción recomendada
                 </div>
                 <div className="text-zinc-200 font-medium text-sm leading-relaxed">
                   Intervenir de inmediato: pricing, estructura de costos o desactivación temporal.
                 </div>
              </div>
              <div className="flex items-center gap-2 text-[#EF4444] font-mono text-xs font-bold bg-[#EF4444]/10 px-4 py-2 rounded-lg w-fit border border-[#EF4444]/20">
                 Margen &lt; 15%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA FINAL */}
      <section className="w-full bg-[#161618] py-24 md:py-32 px-6 border-t border-white/5 shadow-[inset_0_20px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
            Si una unidad parece funcionar, <br className="hidden lg:block"/>
            <span className="text-[#00FFD1]">pero el margen ya está roto,</span> <br className="hidden lg:block"/>
            mejor saberlo hoy.
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 font-medium mb-12">
            Haz el chequeo rápido y recibe tu AIRLOCAL Risk Radar.
          </p>
          <Link 
            href="/diagnostico"
            className="inline-flex items-center justify-center px-12 py-5 bg-[#00FFD1] text-[#0B0B0C] text-sm font-bold uppercase tracking-widest transition-all hover:bg-[#00e5bc] rounded-full shadow-[0_6px_25px_rgba(0,255,209,0.3)] hover:shadow-[0_8px_30px_rgba(0,255,209,0.4)]"
          >
            Analizar esta unidad
          </Link>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="w-full py-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 text-zinc-600 font-mono text-[10px] tracking-widest bg-[#0B0B0C] uppercase border-t border-white/5">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
          <span>AIRLOCAL | Risk Radar</span>
        </div>
        <div>© {new Date().getFullYear()} Todos los derechos reservados.</div>
      </footer>
      
    </main>
  );
}