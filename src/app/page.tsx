import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIRLOCAL Risk Radar | ¿Tu propiedad realmente genera lo que crees?",
  description: "La mayoría de propietarios con buena ocupación nunca lo ha verificado. Descubre la verdad operativa de tu propiedad en menos de 90 segundos.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0A0F0D] text-[#E8F0ED] font-sans overflow-x-hidden">

      {/* ─── ESTILOS GLOBALES + ANIMACIONES ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

        * { box-sizing: border-box; }

        .font-display { font-family: 'Manrope', sans-serif; }
        .font-mono-data { font-family: 'JetBrains Mono', monospace; }

        /* Reveal on scroll */
        [data-reveal] {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
        }
        [data-reveal].revealed {
          opacity: 1;
          transform: translateY(0);
        }
        [data-reveal-left] {
          opacity: 0;
          transform: translateX(-28px);
          transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
        }
        [data-reveal-left].revealed {
          opacity: 1;
          transform: translateX(0);
        }

        /* Hero headline shimmer */
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .text-shimmer {
          background: linear-gradient(90deg, #34F5C5 0%, #00D1B2 40%, #ffffff 50%, #00D1B2 60%, #34F5C5 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        /* Pulse dot */
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .pulse-dot::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: currentColor;
          animation: pulse-ring 1.6s ease-out infinite;
        }

        /* Floating card */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .card-float { animation: float 5s ease-in-out infinite; }
        .card-float-delay { animation: float 5s ease-in-out 0.8s infinite; }
        .card-float-delay2 { animation: float 5s ease-in-out 1.6s infinite; }

        /* Gradient border */
        .gradient-border {
          background: linear-gradient(#0A0F0D, #0A0F0D) padding-box,
                      linear-gradient(135deg, #34F5C5, transparent 60%) border-box;
          border: 1px solid transparent;
        }

        /* Section divider glow */
        .glow-line {
          background: linear-gradient(90deg, transparent, #34F5C5, transparent);
          height: 1px;
        }

        /* Ticker / stat number */
        @keyframes count-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Step connector */
        .step-connector {
          position: absolute;
          left: 50%;
          top: 100%;
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, #34F5C5, transparent);
        }
      ` }} />

      {/* ─── 1. HEADER ─── */}
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-[#0A0F0D]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#34F5C5] text-[#0A0F0D] flex items-center justify-center font-black text-sm shadow-[0_0_20px_rgba(52,245,197,0.4)]">A</div>
          <div className="font-bold tracking-widest text-white uppercase text-[11px] flex items-center gap-2">
            AIRLOCAL <span className="text-zinc-600 font-normal">|</span> <span className="text-zinc-400 font-medium normal-case tracking-normal text-xs">Risk Radar</span>
          </div>
        </div>
        <Link
          href="/auditoria-test"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#34F5C5] text-[#0A0F0D] text-xs font-black uppercase tracking-widest rounded-full transition-all hover:bg-[#00D1B2] shadow-[0_0_20px_rgba(52,245,197,0.3)]"
        >
          Comenzar auditoría →
        </Link>
      </header>

      {/* ─── 2. HERO — LA DUDA ─── */}
      <section className="relative w-full min-h-[95vh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#34F5C5 1px, transparent 1px), linear-gradient(90deg, #34F5C5 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(52,245,197,0.07),transparent)]" />

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">

          {/* Overline badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 border border-[#34F5C5]/20 rounded-full bg-[#34F5C5]/5 mb-10" data-reveal>
            <span className="relative w-2 h-2 rounded-full bg-[#34F5C5] pulse-dot" />
            <span className="font-mono-data text-[#34F5C5] text-[11px] font-bold uppercase tracking-[0.2em]">Auditoría operativa · Gratis</span>
          </div>

          {/* Main headline */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-[76px] font-black tracking-tight text-white leading-[1.05] mb-8" data-reveal style={{ transitionDelay: '0.1s' }}>
            ¿Tu propiedad<br/>
            realmente genera<br/>
            <span className="text-shimmer">lo que crees?</span>
          </h1>

          {/* Sub */}
          <p className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl leading-relaxed mb-6" data-reveal style={{ transitionDelay: '0.2s' }}>
            La mayoría de propietarios con buena ocupación<br className="hidden sm:block" />
            <strong className="text-white"> nunca lo ha verificado.</strong>
          </p>

          <p className="font-mono-data text-[#34F5C5]/80 text-sm tracking-widest uppercase mb-16" data-reveal style={{ transitionDelay: '0.3s' }}>
            Sigue leyendo. La respuesta tarda 90 segundos.
          </p>

          {/* Estado cards — floating preview */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-8 w-full" data-reveal style={{ transitionDelay: '0.4s' }}>
            <div className="card-float w-[180px] lg:w-[220px]">
              <Image src="/card-saludable.png" alt="Estado Saludable" width={220} height={300} className="w-full h-auto drop-shadow-[0_0_30px_rgba(52,245,197,0.2)]" />
            </div>
            <div className="card-float-delay w-[180px] lg:w-[220px] md:-mt-4">
              <Image src="/card-vulnerable.png" alt="Estado Vulnerable" width={220} height={300} className="w-full h-auto drop-shadow-[0_0_20px_rgba(255,200,0,0.15)]" />
            </div>
            <div className="card-float-delay2 w-[180px] lg:w-[220px]">
              <Image src="/card-critico.png" alt="Estado Crítico" width={220} height={300} className="w-full h-auto drop-shadow-[0_0_30px_rgba(255,80,80,0.2)]" />
            </div>
          </div>

          <p className="mt-8 text-zinc-600 text-sm font-mono-data uppercase tracking-widest" data-reveal style={{ transitionDelay: '0.5s' }}>
            Tu operación ya está en uno de estos tres estados. El diagnóstico te dice cuál.
          </p>
        </div>
      </section>

      <div className="glow-line w-full" />

      {/* ─── 3. EL PROBLEMA INVISIBLE ─── */}
      <section className="w-full py-32 lg:py-40 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="max-w-3xl mb-20" data-reveal-left>
            <p className="font-mono-data text-[#34F5C5] text-xs uppercase tracking-[0.25em] mb-5">El problema real</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[60px] font-black text-white leading-[1.1] tracking-tight">
              El problema no es<br/>tu ocupación.
            </h2>
            <div className="w-12 h-1 bg-[#34F5C5] rounded-full mt-6 mb-8" />
            <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed">
              Es que <strong className="text-white">sin los números correctos</strong>, estás tomando decisiones de negocio a ciegas.
            </p>
          </div>

          {/* Pain cards — 4 in grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-20">
            {[
              {
                n: '01',
                headline: 'No sabes cuál es tu punto de equilibrio real',
                body: 'Cuántas noches mínimas necesitas para no perder dinero este mes. Si no lo sabes, no sabes qué tan cerca del filo estás.',
              },
              {
                n: '02',
                headline: 'Tienes costos que no estás midiendo',
                body: 'Comisiones, limpieza, mantenimiento acumulado, impuestos. Cada uno erosiona el margen en silencio.',
              },
              {
                n: '03',
                headline: 'No puedes compararte con propiedades similares',
                body: 'Sin benchmark externo, no sabes si tu gasto operativo es eficiente o si estás regalando margen.',
              },
              {
                n: '04',
                headline: 'Optimizas lo que se ve. Ignoras lo que duele.',
                body: 'La ocupación es visible. Las fugas de rentabilidad no. Ahí está el dinero que se pierde sin que lo veas.',
              },
            ].map((p, i) => (
              <div
                key={i}
                className="gradient-border rounded-2xl p-8 lg:p-10 bg-[#0D1410] group hover:bg-[#101710] transition-colors"
                data-reveal
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span className="font-mono-data text-[#34F5C5]/40 text-[11px] font-bold uppercase tracking-[0.2em] block mb-5">{p.n}</span>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-4 leading-snug">{p.headline}</h3>
                <p className="text-zinc-500 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>

          {/* Bridge statement */}
          <div className="max-w-4xl mx-auto text-center py-16 border-y border-white/5" data-reveal>
            <p className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.15]">
              Cada mes sin esta claridad<br/>
              <span className="text-[#34F5C5]">es dinero que ya se fue.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ─── 4. EL MÉTODO — Los 3 capítulos ─── */}
      <section className="w-full py-32 lg:py-40 px-6 bg-[#080D0A]">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-20" data-reveal>
            <p className="font-mono-data text-[#34F5C5] text-xs uppercase tracking-[0.25em] mb-5">Cómo funciona</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-[60px] font-black text-white leading-[1.1] tracking-tight">
              No es un software.<br/>
              <span className="text-zinc-400 font-medium">Es un proceso de 3 capítulos.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Guardián */}
            <div className="flex flex-col gap-6 p-8 lg:p-10 rounded-2xl bg-[#0D1410] border border-white/5 hover:border-[#34F5C5]/20 transition-all" data-reveal style={{ transitionDelay: '0s' }}>
              <div className="w-20 h-20">
                <Image src="/logo-shield.png" alt="El Guardián" width={80} height={80} className="w-full h-auto" />
              </div>
              <div>
                <p className="font-mono-data text-[#34F5C5] text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Capítulo 01</p>
                <h3 className="font-display text-2xl md:text-3xl font-black text-white mb-4">El Guardián</h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  Confirma si existe un problema operativo real. No analiza números. <strong className="text-white">Verifica si merece investigar.</strong>
                </p>
              </div>
              <div className="mt-auto pt-6 border-t border-white/5">
                <p className="font-mono-data text-[#34F5C5] text-xs">→ Estado · Score · Punto de equilibrio</p>
              </div>
            </div>

            {/* Cazafugas */}
            <div className="flex flex-col gap-6 p-8 lg:p-10 rounded-2xl bg-[#0D1410] border border-[#34F5C5]/20 shadow-[0_0_40px_rgba(52,245,197,0.05)] hover:shadow-[0_0_60px_rgba(52,245,197,0.1)] transition-all lg:-translate-y-4" data-reveal style={{ transitionDelay: '0.1s' }}>
              <div className="w-20 h-20">
                <Image src="/logo-radar.png" alt="El Cazafugas" width={80} height={80} className="w-full h-auto" />
              </div>
              <div>
                <p className="font-mono-data text-[#34F5C5] text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Capítulo 02</p>
                <h3 className="font-display text-2xl md:text-3xl font-black text-white mb-4">El Cazafugas</h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  Encuentra exactamente dónde se pierde el dinero. Comisiones, limpieza, precios, ocupación. <strong className="text-white">Con número exacto.</strong>
                </p>
              </div>
              <div className="mt-auto pt-6 border-t border-white/5">
                <p className="font-mono-data text-[#34F5C5] text-xs">→ Radiografía · Fugas · Potencial</p>
              </div>
            </div>

            {/* Estratega */}
            <div className="flex flex-col gap-6 p-8 lg:p-10 rounded-2xl bg-[#0D1410] border border-white/5 hover:border-[#34F5C5]/20 transition-all" data-reveal style={{ transitionDelay: '0.2s' }}>
              <div className="w-20 h-20">
                <Image src="/logo-compass.png" alt="El Estratega" width={80} height={80} className="w-full h-auto" />
              </div>
              <div>
                <p className="font-mono-data text-[#34F5C5] text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Capítulo 03</p>
                <h3 className="font-display text-2xl md:text-3xl font-black text-white mb-4">El Estratega</h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  Decide qué corregir primero para generar el mayor impacto económico. <strong className="text-white">No más variables. Una prioridad.</strong>
                </p>
              </div>
              <div className="mt-auto pt-6 border-t border-white/5">
                <p className="font-mono-data text-[#34F5C5] text-xs">→ Plan priorizado · Acción · Retorno</p>
              </div>
            </div>
          </div>

          {/* Note */}
          <p className="text-center text-zinc-600 text-sm font-mono-data mt-10 uppercase tracking-widest" data-reveal>
            En realidad no son personajes. Son capítulos de una auditoría.
          </p>
        </div>
      </section>

      <div className="glow-line w-full" />

      {/* ─── 5. LA EVIDENCIA — El producto real ─── */}
      <section className="w-full py-32 lg:py-40 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left — copy */}
            <div data-reveal-left>
              <p className="font-mono-data text-[#34F5C5] text-xs uppercase tracking-[0.25em] mb-5">El producto final</p>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-8">
                No te mostramos<br/>una demo.
              </h2>
              <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed mb-6">
                Te mostramos <strong className="text-white">el diagnóstico real</strong>, exactamente como lo recibirás.
              </p>
              <p className="text-zinc-500 leading-relaxed mb-10">
                Eso elimina la incertidumbre. Ya sabes exactamente qué recibirás. No tienes que imaginarlo.
              </p>

              <div className="space-y-4">
                {[
                  'Tu estado operativo con score 0–100',
                  'Punto de equilibrio y colchón real',
                  'Fugas detectadas con monto estimado',
                  'Plan de acción priorizado por impacto',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-5 h-5 rounded-full bg-[#34F5C5]/10 border border-[#34F5C5]/30 flex items-center justify-center shrink-0">
                      <span className="text-[#34F5C5] text-[10px] font-bold">✓</span>
                    </span>
                    <span className="text-zinc-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — visual "report card" mock */}
            <div className="flex flex-col gap-4" data-reveal>
              {/* Score card mock */}
              <div className="rounded-2xl border border-[#34F5C5]/20 bg-[#0D1410] p-6 shadow-[0_0_40px_rgba(52,245,197,0.05)]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-mono-data text-[10px] text-zinc-600 uppercase tracking-widest mb-1">DIAGNÓSTICO COMPLETADO</p>
                    <p className="font-display text-white font-bold text-lg">Villa Coral · Cancún, MX</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-data text-[10px] text-zinc-600 uppercase tracking-widest mb-1">ESTADO</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34F5C5]/10 border border-[#34F5C5]/30 text-[#34F5C5] text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34F5C5]" /> SALUDABLE
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                  <div>
                    <p className="font-mono-data text-zinc-600 text-[9px] uppercase tracking-widest mb-1">Score</p>
                    <p className="font-display text-white text-2xl font-black">86<span className="text-zinc-500 text-sm">/100</span></p>
                  </div>
                  <div>
                    <p className="font-mono-data text-zinc-600 text-[9px] uppercase tracking-widest mb-1">Margen</p>
                    <p className="font-display text-white text-2xl font-black">38<span className="text-zinc-500 text-sm">%</span></p>
                  </div>
                  <div>
                    <p className="font-mono-data text-zinc-600 text-[9px] uppercase tracking-widest mb-1">Potencial</p>
                    <p className="font-display text-[#34F5C5] text-2xl font-black">+$420</p>
                  </div>
                </div>
              </div>

              {/* Cazafugas mini */}
              <div className="rounded-2xl border border-white/5 bg-[#0D1410] p-6">
                <p className="font-mono-data text-[10px] text-zinc-600 uppercase tracking-widest mb-4">FUGAS DETECTADAS</p>
                <div className="space-y-3">
                  {[
                    { label: 'Comisiones', amount: '+$180', bar: 72, color: '#F06B6B' },
                    { label: 'Limpieza', amount: '+$150', bar: 58, color: '#F0C860' },
                    { label: 'Crecimiento comercial', amount: '+$90', bar: 36, color: '#34F5C5' },
                  ].map((f, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1.5">
                        <span className="text-zinc-300 text-sm">{f.label}</span>
                        <span className="font-mono-data text-xs font-bold" style={{ color: f.color }}>{f.amount}/mes</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5">
                        <div className="h-full rounded-full" style={{ width: `${f.bar}%`, background: f.color, opacity: 0.6 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-center font-mono-data text-zinc-700 text-[11px] uppercase tracking-widest">
                Este es el diagnóstico real. No una ilustración.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. PRUEBA SOCIAL / STATS ─── */}
      <section className="w-full py-20 px-6 border-y border-white/5 bg-[#080D0A]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { n: '90s', label: 'para obtener tu diagnóstico completo' },
              { n: '3', label: 'capítulos de análisis operativo' },
              { n: '$0', label: 'costo del diagnóstico base' },
              { n: '1', label: 'pregunta que responde: ¿soy rentable?' },
            ].map((s, i) => (
              <div key={i} className="text-center" data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
                <p className="font-display text-4xl md:text-5xl font-black text-[#34F5C5] mb-2">{s.n}</p>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-[160px] mx-auto">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. CÓMO INGRESAR — Fricción removida ─── */}
      <section className="w-full py-32 lg:py-40 px-6">
        <div className="max-w-4xl mx-auto">

          <div className="text-center mb-20" data-reveal>
            <p className="font-mono-data text-[#34F5C5] text-xs uppercase tracking-[0.25em] mb-5">El proceso</p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-[1.1]">
              Tres pasos.<br/>
              <span className="text-zinc-500 font-medium">Ninguno requiere integraciones.</span>
            </h2>
          </div>

          <div className="relative flex flex-col md:flex-row gap-0 md:gap-4 lg:gap-0">
            {/* Connector line desktop */}
            <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-[#34F5C5]/20 to-transparent" />

            {[
              { n: '01', headline: 'Ingresa tus datos básicos', body: 'Ingresos, costos, noches ocupadas. Sin sistema, sin PMS, sin integración.' },
              { n: '02', headline: 'Analizamos en tiempo real', body: 'Nuestro motor compara tu operación contra benchmarks del mercado.' },
              { n: '03', headline: 'Recibes tu diagnóstico', body: 'Estado, fugas, plan. Exactamente como lo viste en el ejemplo anterior.' },
            ].map((step, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center px-4 lg:px-8 relative" data-reveal style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="w-20 h-20 rounded-full bg-[#0D1410] border border-[#34F5C5]/30 flex items-center justify-center mb-6 relative z-10 shadow-[0_0_30px_rgba(52,245,197,0.08)]">
                  <span className="font-mono-data text-[#34F5C5] font-bold text-lg">{step.n}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">{step.headline}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. CTA FINAL — La invitación ─── */}
      <section className="relative w-full py-40 lg:py-56 px-6 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(#34F5C5 1px, transparent 1px), linear-gradient(90deg, #34F5C5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Center glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(52,245,197,0.06),transparent)]" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">

          <p className="font-mono-data text-[#34F5C5] text-xs uppercase tracking-[0.3em] mb-8" data-reveal>
            El siguiente paso
          </p>

          <h2 className="font-display text-5xl md:text-6xl lg:text-[80px] font-black text-white leading-[1.05] tracking-tight mb-10" data-reveal style={{ transitionDelay: '0.1s' }}>
            Comprueba si realmente<br/>
            existe un problema<br/>
            <span className="text-[#34F5C5]">en tu operación.</span>
          </h2>

          <p className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl leading-relaxed mb-6" data-reveal style={{ transitionDelay: '0.15s' }}>
            No prometemos ahorrarte dinero.<br/>
            <strong className="text-white">Prometemos mostrarte la verdad operativa.</strong>
          </p>

          <p className="text-zinc-600 font-mono-data text-sm mb-16" data-reveal style={{ transitionDelay: '0.2s' }}>
            Una vez la veas, la auditoría deja de sentirse como una venta.<br/>
            Pasa a sentirse como el siguiente paso lógico.
          </p>

          <div className="flex flex-col items-center gap-6" data-reveal style={{ transitionDelay: '0.25s' }}>
            <Link
              href="/auditoria-test"
              className="inline-flex items-center justify-center gap-3 px-10 md:px-14 py-5 md:py-6 bg-[#34F5C5] text-[#0A0F0D] font-display text-base md:text-lg font-black uppercase tracking-widest rounded-full transition-all hover:bg-[#00D1B2] hover:-translate-y-1 shadow-[0_8px_40px_rgba(52,245,197,0.3)] hover:shadow-[0_16px_60px_rgba(52,245,197,0.4)]"
            >
              Quiero saber la verdad →
            </Link>
            <div className="flex items-center gap-6 text-zinc-600 font-mono-data text-xs uppercase tracking-widest">
              <span>Sin registro</span>
              <span className="text-[#34F5C5]/30">·</span>
              <span>Sin tarjeta</span>
              <span className="text-[#34F5C5]/30">·</span>
              <span>90 segundos</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. FOOTER ─── */}
      <footer className="w-full border-t border-white/5 py-16 px-6 md:px-12 bg-[#080D0A]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-10">

          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#34F5C5] text-[#0A0F0D] flex items-center justify-center font-black text-sm">A</div>
              <span className="font-bold tracking-widest text-white uppercase text-[11px]">AIRLOCAL™ Risk Radar</span>
            </div>
            <p className="text-zinc-600 text-xs font-mono-data leading-relaxed text-center md:text-left">
              by propiqdata.com<br/>
              Claridad operativa para propietarios de corta estancia.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex gap-6 text-zinc-600 text-xs">
              <Link href="/terms" className="hover:text-[#34F5C5] transition-colors">Términos</Link>
              <Link href="/privacy" className="hover:text-[#34F5C5] transition-colors">Privacidad</Link>
              <a href="mailto:soporte@propiqdata.com" className="hover:text-[#34F5C5] transition-colors">soporte@propiqdata.com</a>
            </div>
            <p className="font-mono-data text-zinc-700 text-[10px] uppercase tracking-widest">© 2026 AIRLOCAL by propiqdata.com</p>
          </div>
        </div>
      </footer>

      {/* ─── SCROLL REVEAL SCRIPT ─── */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          var els = document.querySelectorAll('[data-reveal], [data-reveal-left]');
          if (!('IntersectionObserver' in window)) {
            els.forEach(function(el) { el.classList.add('revealed'); });
            return;
          }
          var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(e) {
              if (e.isIntersecting) {
                var delay = e.target.style.transitionDelay || '0s';
                setTimeout(function() {
                  e.target.classList.add('revealed');
                }, parseFloat(delay) * 1000);
                obs.unobserve(e.target);
              }
            });
          }, { threshold: 0.15 });
          els.forEach(function(el) { obs.observe(el); });
        })();
      ` }} />

    </main>
  );
}
