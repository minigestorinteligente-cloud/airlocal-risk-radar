import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIRLOCAL | ¿Tu STR realmente genera lo que crees?",
  description: "Descubre si tu alquiler vacacional genera ganancias reales o solo ingresos. Diagnóstico operativo en 90 segundos para propietarios de STR en Latinoamérica.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#080C0A] text-[#E8F0ED] overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

        .font-serif-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-mono-data { font-family: 'JetBrains Mono', monospace; }

        [data-reveal] {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.75s cubic-bezier(.22,1,.36,1), transform 0.75s cubic-bezier(.22,1,.36,1);
        }
        [data-reveal].in { opacity: 1; transform: translateY(0); }

        [data-reveal-x] {
          opacity: 0;
          transform: translateX(-24px);
          transition: opacity 0.75s cubic-bezier(.22,1,.36,1), transform 0.75s cubic-bezier(.22,1,.36,1);
        }
        [data-reveal-x].in { opacity: 1; transform: translateX(0); }

        /* Glass morphism */
        .glass {
          background: rgba(10, 18, 13, 0.72);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(52, 245, 197, 0.10);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03),
            0 60px 120px rgba(0,0,0,0.65),
            0 24px 48px rgba(0,0,0,0.40),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        /* 3D icon card */
        .icon-3d {
          transform: perspective(800px) rotateX(8deg) rotateY(-6deg);
          transition: transform 0.4s ease;
          filter: drop-shadow(0 20px 40px rgba(0,0,0,0.6)) drop-shadow(0 4px 12px rgba(52,245,197,0.15));
        }
        .icon-3d:hover {
          transform: perspective(800px) rotateX(4deg) rotateY(-3deg) scale(1.04);
        }

        /* Report glass tilt */
        .report-glass {
          transform: perspective(1200px) rotateX(3deg) rotateY(-6deg) rotateZ(1deg);
        }

        /* Shimmer text */
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .text-shimmer {
          background: linear-gradient(90deg, #34F5C5 0%, #00D1B2 35%, #ffffff 50%, #00D1B2 65%, #34F5C5 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }

        /* Pulse */
        @keyframes pulse-out {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .pulse-ring::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: #34F5C5;
          animation: pulse-out 2s ease-out infinite;
        }

        /* Float */
        @keyframes float-y {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .float { animation: float-y 6s ease-in-out infinite; }
        .float-d1 { animation: float-y 6s ease-in-out 0.6s infinite; }
        .float-d2 { animation: float-y 6s ease-in-out 1.2s infinite; }

        /* Noise texture overlay */
        .noise::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.35;
          mix-blend-mode: overlay;
        }

        /* Stripe section */
        .stripe-bg {
          background-image: repeating-linear-gradient(
            -45deg,
            rgba(52,245,197,0.012) 0px,
            rgba(52,245,197,0.012) 1px,
            transparent 1px,
            transparent 12px
          );
        }
      ` }} />

      {/* ─── HEADER ─── */}
      <header className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b border-white/[0.06] bg-[#080C0A]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#34F5C5] text-[#080C0A] flex items-center justify-center font-bold text-xs shadow-[0_0_16px_rgba(52,245,197,0.5)]">A</div>
            <span className="font-bold tracking-[0.2em] text-white uppercase text-[11px]">AIRLOCAL</span>
            <span className="text-[#34F5C5]/40 text-xs">·</span>
            <span className="text-zinc-500 text-[11px] font-medium tracking-wider">Risk Radar</span>
          </div>
          <span className="font-mono-data text-[9px] text-zinc-700 uppercase tracking-[0.18em] pl-10">Inteligencia operativa · STR</span>
        </div>
        <Link
          href="/auditoria-test"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#34F5C5] text-[#080C0A] text-[11px] font-bold uppercase tracking-widest rounded-full hover:bg-[#00D1B2] transition-colors shadow-[0_0_24px_rgba(52,245,197,0.25)]"
        >
          Comenzar gratis
        </Link>
      </header>

      {/* ─── HERO — La pregunta que nadie se hace ─── */}
      <section className="relative w-full min-h-[95vh] flex flex-col items-center justify-center px-6 py-24 overflow-hidden">
        {/* Map background — sutil */}
        <div className="absolute inset-0">
          <Image src="/hero-map-bg.png" alt="" fill className="object-cover opacity-[0.12] saturate-0" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080C0A] via-transparent to-[#080C0A]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_40%,rgba(52,245,197,0.06),transparent)]" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">

          {/* Overline */}
          <div className="inline-flex items-center gap-3 mb-10" data-reveal>
            <div className="h-px w-8 bg-[#34F5C5]/40" />
            <span className="font-mono-data text-[#34F5C5] text-[11px] uppercase tracking-[0.25em]">Para propietarios de alquiler vacacional · STR</span>
            <div className="h-px w-8 bg-[#34F5C5]/40" />
          </div>

          {/* Headline — serif editorial */}
          <h1 className="font-serif-display text-5xl md:text-6xl lg:text-[80px] font-black text-white leading-[1.08] tracking-tight mb-8" data-reveal style={{ transitionDelay: '0.08s' }}>
            ¿Tu operación<br/>
            realmente genera<br/>
            <span className="text-shimmer">ganancias…</span><br/>
            <span className="text-zinc-400 font-bold" style={{ fontStyle: 'italic' }}>o solo ingresos?</span>
          </h1>

          {/* Body */}
          <p className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed mb-4" data-reveal style={{ transitionDelay: '0.16s' }}>
            La mayoría de propietarios con buena ocupación<br/>
            <strong className="text-zinc-200">nunca ha verificado si realmente gana dinero.</strong>
          </p>
          <p className="font-mono-data text-zinc-600 text-xs uppercase tracking-widest mb-14" data-reveal style={{ transitionDelay: '0.22s' }}>
            No es culpa tuya. Los números que ves no son los que importan.
          </p>

          {/* Cards flotantes */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 lg:gap-8 mb-14 w-full" data-reveal style={{ transitionDelay: '0.28s' }}>
            <div className="float w-[160px] lg:w-[200px]">
              <Image src="/card-saludable.png" alt="Saludable" width={200} height={280} className="w-full h-auto drop-shadow-[0_30px_40px_rgba(52,245,197,0.18)]" />
            </div>
            <div className="float-d1 w-[160px] lg:w-[200px] sm:-mt-5">
              <Image src="/card-vulnerable.png" alt="Vulnerable" width={200} height={280} className="w-full h-auto drop-shadow-[0_30px_40px_rgba(245,158,11,0.15)]" />
            </div>
            <div className="float-d2 w-[160px] lg:w-[200px]">
              <Image src="/card-critico.png" alt="Crítico" width={200} height={280} className="w-full h-auto drop-shadow-[0_30px_40px_rgba(239,68,68,0.18)]" />
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4" data-reveal style={{ transitionDelay: '0.34s' }}>
            <Link
              href="/auditoria-test"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#34F5C5] text-[#080C0A] font-bold text-[15px] uppercase tracking-widest rounded-full hover:bg-[#00D1B2] hover:-translate-y-0.5 transition-all shadow-[0_12px_40px_rgba(52,245,197,0.3)] hover:shadow-[0_20px_50px_rgba(52,245,197,0.4)]"
            >
              Descubrir la verdad de mi operación →
            </Link>
            <p className="font-mono-data text-zinc-600 text-xs uppercase tracking-widest">Sin instalación · Sin tarjeta · 90 segundos</p>
          </div>
        </div>
      </section>

      {/* ─── PROBLEMA — El dinero invisible ─── */}
      <section className="w-full py-32 lg:py-40 px-6 border-t border-white/[0.05] stripe-bg">
        <div className="max-w-6xl mx-auto">

          <div className="max-w-3xl mb-20" data-reveal-x>
            <p className="font-mono-data text-[#34F5C5] text-[10px] uppercase tracking-[0.3em] mb-6">El problema real</p>
            <h2 className="font-serif-display text-4xl md:text-5xl lg:text-[58px] font-black text-white leading-[1.1] mb-6">
              El problema no es<br/>tu ocupación.
            </h2>
            <div className="w-10 h-[2px] bg-[#34F5C5] mb-8" />
            <p className="text-xl text-zinc-400 leading-relaxed">
              Es que <strong className="text-white">sin los números correctos</strong>, cada decisión es una apuesta. No un plan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-24">
            {[
              { n: '01', h: 'No sabes tu punto de equilibrio real', b: 'Cuántas noches mínimas necesitas para no perder dinero este mes. Sin eso, no sabes qué tan cerca del filo estás operando.' },
              { n: '02', h: 'Tienes costos que no estás midiendo', b: 'Comisiones, limpieza, mantenimiento, impuestos. Cada uno erosiona el margen en silencio, mes a mes.' },
              { n: '03', h: 'No puedes compararte con el mercado', b: 'Sin benchmark, no sabes si tu gasto operativo es eficiente o si estás regalando margen sin darte cuenta.' },
              { n: '04', h: 'Optimizas lo visible. Ignoras lo que duele.', b: 'La ocupación se ve. Las fugas de rentabilidad no. Ahí es exactamente donde está el dinero que se pierde.' },
            ].map((p, i) => (
              <div
                key={i}
                className="rounded-2xl p-8 lg:p-10 bg-[#0C1410] border border-white/[0.06] hover:border-[#34F5C5]/15 transition-all group cursor-default"
                data-reveal
                style={{ transitionDelay: `${i * 0.09}s` }}
              >
                <span className="font-mono-data text-zinc-700 text-[10px] tracking-[0.25em] block mb-5">{p.n}</span>
                <h3 className="font-serif-display text-xl md:text-2xl font-bold text-white mb-4 leading-snug group-hover:text-[#34F5C5] transition-colors">{p.h}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{p.b}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto text-center py-20 border-y border-white/[0.06]" data-reveal>
            <p className="font-serif-display text-3xl md:text-4xl lg:text-[52px] font-bold text-white leading-[1.15]">
              Cada mes sin esta claridad<br/>
              <span className="text-[#34F5C5]">es dinero que ya no vuelve.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ─── LOS 3 AGENTES — Qué obtienes ─── */}
      <section className="w-full py-32 lg:py-40 px-6 bg-[#060A07]">
        <div className="max-w-6xl mx-auto">

          <div className="text-center max-w-3xl mx-auto mb-24" data-reveal>
            <p className="font-mono-data text-[#34F5C5] text-[10px] uppercase tracking-[0.3em] mb-6">Lo que obtienes</p>
            <h2 className="font-serif-display text-4xl md:text-5xl lg:text-[58px] font-black text-white leading-[1.1] mb-6">
              Tu copiloto operativo.<br/>
              <span className="text-zinc-500 font-bold" style={{ fontStyle: 'italic' }}>Tres perspectivas. Una decisión.</span>
            </h2>
            <p className="text-zinc-500 text-lg leading-relaxed">
              No es inteligencia artificial que te da datos.<br/>
              Es un proceso que te dice <strong className="text-zinc-300">exactamente qué hacer.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5">

            {/* Guardián */}
            <div
              className="flex flex-col gap-8 p-8 lg:p-10 rounded-2xl bg-[#0C1410] border border-white/[0.07] hover:border-[#34F5C5]/20 transition-all"
              data-reveal style={{ transitionDelay: '0s' }}
            >
              <div className="icon-3d w-28 h-28 mx-auto lg:mx-0">
                <Image src="/logo-shield.png" alt="El Guardián" width={112} height={112} className="w-full h-auto" />
              </div>
              <div>
                <p className="font-mono-data text-[#34F5C5]/60 text-[9px] uppercase tracking-[0.3em] font-bold mb-3">El Guardián</p>
                <h3 className="font-serif-display text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                  Sabe si existe<br/>un problema real.
                </h3>
                <p className="text-zinc-500 leading-relaxed">
                  No asume. <strong className="text-zinc-300">Verifica.</strong> Analiza tu estado operativo y te dice en números si tu margen es sostenible o si ya estás perdiendo.
                </p>
              </div>
              <div className="mt-auto pt-6 border-t border-white/[0.06]">
                <p className="font-mono-data text-zinc-700 text-[11px]">Score operativo · Punto de equilibrio · Colchón</p>
              </div>
            </div>

            {/* Cazafugas — destacado */}
            <div
              className="flex flex-col gap-8 p-8 lg:p-10 rounded-2xl bg-[#0C1A14] border border-[#34F5C5]/20 lg:-translate-y-4 shadow-[0_40px_80px_rgba(52,245,197,0.06)]"
              data-reveal style={{ transitionDelay: '0.1s' }}
            >
              <div className="icon-3d w-28 h-28 mx-auto lg:mx-0">
                <Image src="/logo-radar.png" alt="El Cazafugas" width={112} height={112} className="w-full h-auto" />
              </div>
              <div>
                <p className="font-mono-data text-[#34F5C5] text-[9px] uppercase tracking-[0.3em] font-bold mb-3">El Cazafugas</p>
                <h3 className="font-serif-display text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                  Encuentra exactamente<br/>dónde se pierde.
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Comisiones. Limpieza. Precios bajos. Cada fuga tiene <strong className="text-white">un número concreto</strong> y un potencial de recuperación estimado.
                </p>
              </div>
              <div className="mt-auto pt-6 border-t border-[#34F5C5]/10">
                <p className="font-mono-data text-[#34F5C5]/50 text-[11px]">Radiografía operativa · Fugas · Potencial USD/mes</p>
              </div>
            </div>

            {/* Estratega */}
            <div
              className="flex flex-col gap-8 p-8 lg:p-10 rounded-2xl bg-[#0C1410] border border-white/[0.07] hover:border-[#34F5C5]/20 transition-all"
              data-reveal style={{ transitionDelay: '0.2s' }}
            >
              <div className="icon-3d w-28 h-28 mx-auto lg:mx-0">
                <Image src="/logo-compass.png" alt="El Estratega" width={112} height={112} className="w-full h-auto" />
              </div>
              <div>
                <p className="font-mono-data text-[#34F5C5]/60 text-[9px] uppercase tracking-[0.3em] font-bold mb-3">El Estratega</p>
                <h3 className="font-serif-display text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                  Decide qué corregir<br/>primero.
                </h3>
                <p className="text-zinc-500 leading-relaxed">
                  Con todas las variables sobre la mesa, <strong className="text-zinc-300">prioriza la acción de mayor retorno</strong>. No más dudas. Un paso claro.
                </p>
              </div>
              <div className="mt-auto pt-6 border-t border-white/[0.06]">
                <p className="font-mono-data text-zinc-700 text-[11px]">Plan de acción · Impacto priorizado · Próximo paso</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── EL DIAGNÓSTICO — Glass report ─── */}
      <section className="relative w-full py-32 lg:py-48 px-6 overflow-hidden">
        {/* Map bg sutil */}
        <div className="absolute inset-0">
          <Image src="/hero-map-bg.png" alt="" fill className="object-cover opacity-[0.06] saturate-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080C0A] via-[#080C0A]/70 to-[#080C0A]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

            {/* Left — copy */}
            <div data-reveal-x>
              <p className="font-mono-data text-[#34F5C5] text-[10px] uppercase tracking-[0.3em] mb-6">El diagnóstico real</p>
              <h2 className="font-serif-display text-4xl md:text-5xl font-black text-white leading-[1.1] mb-8">
                Así luce<br/>tu reporte.
              </h2>
              <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                No es una demo ni una ilustración.<br/>
                <strong className="text-white">Es el producto exacto que recibirás.</strong>
              </p>
              <p className="text-zinc-600 leading-relaxed mb-12 text-sm">
                Eliminamos la incertidumbre de entrada: ya sabes exactamente qué información tendrás para tomar decisiones. No tienes que imaginarlo.
              </p>
              <div className="space-y-4">
                {[
                  'Estado operativo con score 0–100',
                  'Punto de equilibrio y margen real estimado',
                  'Fugas identificadas con monto USD/mes',
                  'Plan de acción ordenado por impacto',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-5 h-5 rounded-full bg-[#34F5C5]/10 border border-[#34F5C5]/25 flex items-center justify-center shrink-0">
                      <span className="text-[#34F5C5] text-[10px] font-bold">✓</span>
                    </span>
                    <span className="text-zinc-300 text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Glass report floating */}
            <div className="flex items-center justify-center" data-reveal style={{ transitionDelay: '0.1s' }}>
              <div className="report-glass glass rounded-2xl overflow-hidden w-full max-w-md">

                {/* Report header */}
                <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
                  <div>
                    <p className="font-mono-data text-[9px] text-zinc-600 uppercase tracking-widest mb-1">AUDITORÍA OPERATIVA COMPLETA</p>
                    <p className="text-white font-bold text-base">Villa Coral · Cancún, MX</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#34F5C5]/10 border border-[#34F5C5]/20 text-[#34F5C5] font-mono-data text-[10px] font-bold">
                    <span className="relative w-1.5 h-1.5 rounded-full bg-[#34F5C5] pulse-ring" /> SALUDABLE
                  </span>
                </div>

                {/* Score row */}
                <div className="px-6 py-5 grid grid-cols-3 gap-4 border-b border-white/[0.05]">
                  <div>
                    <p className="font-mono-data text-zinc-700 text-[9px] uppercase tracking-wider mb-1.5">Score</p>
                    <p className="text-white font-bold text-3xl" style={{ fontFamily: 'JetBrains Mono' }}>86<span className="text-zinc-600 text-base">/100</span></p>
                  </div>
                  <div>
                    <p className="font-mono-data text-zinc-700 text-[9px] uppercase tracking-wider mb-1.5">Margen neto</p>
                    <p className="text-white font-bold text-3xl" style={{ fontFamily: 'JetBrains Mono' }}>38<span className="text-zinc-600 text-base">%</span></p>
                  </div>
                  <div>
                    <p className="font-mono-data text-zinc-700 text-[9px] uppercase tracking-wider mb-1.5">Potencial</p>
                    <p className="text-[#34F5C5] font-bold text-3xl" style={{ fontFamily: 'JetBrains Mono' }}>+$420</p>
                  </div>
                </div>

                {/* Equilibrio */}
                <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
                  <p className="text-zinc-500 text-sm">Punto de equilibrio</p>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-bold text-sm font-mono-data">8 noches / mes</span>
                    <span className="text-[10px] text-zinc-600 font-mono-data">Colchón: 14 noches</span>
                  </div>
                </div>

                {/* Fugas */}
                <div className="px-6 py-5">
                  <p className="font-mono-data text-zinc-600 text-[9px] uppercase tracking-widest mb-4">FUGAS DETECTADAS · $420/mes</p>
                  <div className="space-y-3.5">
                    {[
                      { l: 'Comisiones OTA', v: '+$180', w: 72, c: '#F06B6B' },
                      { l: 'Limpieza', v: '+$150', w: 58, c: '#F0C860' },
                      { l: 'Precio sin optimizar', v: '+$90', w: 36, c: '#34F5C5' },
                    ].map((f, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="text-zinc-400 text-xs">{f.l}</span>
                          <span className="font-mono-data text-xs font-bold" style={{ color: f.c }}>{f.v}/mes</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/[0.04]">
                          <div className="h-full rounded-full opacity-60" style={{ width: `${f.w}%`, background: f.c }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Estratega footer */}
                <div className="px-6 py-4 bg-[#34F5C5]/5 border-t border-[#34F5C5]/10">
                  <p className="font-mono-data text-[10px] text-[#34F5C5] uppercase tracking-widest mb-1">PRÓXIMA ACCIÓN RECOMENDADA</p>
                  <p className="text-zinc-300 text-sm">Renegociar comisiones OTA — mayor impacto económico inmediato.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="w-full py-20 px-6 border-y border-white/[0.05] bg-[#060A07]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { n: '90s', l: 'para obtener tu diagnóstico completo' },
            { n: '3', l: 'perspectivas de análisis en un solo reporte' },
            { n: '$0', l: 'costo del diagnóstico base — sin tarjeta' },
            { n: '1', l: 'decisión clara al final de cada auditoría' },
          ].map((s, i) => (
            <div key={i} className="text-center" data-reveal style={{ transitionDelay: `${i * 0.07}s` }}>
              <p className="font-mono-data text-[#34F5C5] text-4xl md:text-5xl font-bold mb-2">{s.n}</p>
              <p className="text-zinc-600 text-xs leading-relaxed max-w-[140px] mx-auto">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CÓMO FUNCIONA — Mínimo ─── */}
      <section className="w-full py-32 lg:py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-20" data-reveal>
            <p className="font-mono-data text-[#34F5C5] text-[10px] uppercase tracking-[0.3em] mb-6">El proceso</p>
            <h2 className="font-serif-display text-4xl md:text-5xl font-black text-white leading-[1.1]">
              Tres pasos.<br/>
              <span className="text-zinc-500 font-bold" style={{ fontStyle: 'italic' }}>Sin integraciones, sin sistemas.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#34F5C5]/15 to-transparent" />
            {[
              { n: '01', h: 'Ingresa tus datos', b: 'Ingresos, gastos, noches. Sin conectar ningún sistema.' },
              { n: '02', h: 'Analizamos en tiempo real', b: 'Comparamos tu operación contra benchmarks del mercado.' },
              { n: '03', h: 'Recibes tu diagnóstico', b: 'Estado, fugas, plan. Exactamente como lo viste arriba.' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center" data-reveal style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="w-20 h-20 rounded-full bg-[#0C1410] border border-white/[0.08] flex items-center justify-center mb-6 z-10">
                  <span className="font-mono-data text-[#34F5C5] font-bold">{s.n}</span>
                </div>
                <h3 className="font-serif-display text-xl font-bold text-white mb-3">{s.h}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="relative w-full py-48 lg:py-64 px-6 overflow-hidden">
        {/* Map bg */}
        <div className="absolute inset-0">
          <Image src="/hero-map-bg.png" alt="" fill className="object-cover opacity-[0.1] saturate-0" />
          <div className="absolute inset-0 bg-[#080C0A]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(52,245,197,0.07),transparent)]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="h-px w-16 bg-[#34F5C5]/40 mb-12" data-reveal />

          <h2 className="font-serif-display text-5xl md:text-6xl lg:text-[76px] font-black text-white leading-[1.05] tracking-tight mb-8" data-reveal style={{ transitionDelay: '0.06s' }}>
            Comprueba si existe<br/>
            un problema real<br/>
            <span className="text-[#34F5C5]">en tu operación.</span>
          </h2>

          <p className="text-xl text-zinc-400 max-w-xl leading-relaxed mb-4" data-reveal style={{ transitionDelay: '0.12s' }}>
            No prometemos ahorrarte dinero.<br/>
            <strong className="text-white">Prometemos mostrarte la verdad operativa.</strong>
          </p>
          <p className="text-zinc-700 font-mono-data text-xs uppercase tracking-widest mb-16" data-reveal style={{ transitionDelay: '0.16s' }}>
            Una vez la veas, el siguiente paso se hace solo evidente.
          </p>

          <div className="flex flex-col items-center gap-5" data-reveal style={{ transitionDelay: '0.22s' }}>
            <Link
              href="/auditoria-test"
              className="inline-flex items-center justify-center gap-3 px-12 md:px-16 py-5 md:py-6 bg-[#34F5C5] text-[#080C0A] font-bold text-base uppercase tracking-widest rounded-full hover:bg-[#00D1B2] hover:-translate-y-1 transition-all shadow-[0_12px_50px_rgba(52,245,197,0.35)] hover:shadow-[0_24px_70px_rgba(52,245,197,0.45)]"
            >
              Quiero saber la verdad →
            </Link>
            <div className="flex items-center gap-5 text-zinc-700 font-mono-data text-[11px] uppercase tracking-widest">
              <span>Sin registro</span>
              <span className="text-[#34F5C5]/20">·</span>
              <span>Sin tarjeta</span>
              <span className="text-[#34F5C5]/20">·</span>
              <span>STR en Latinoamérica</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="w-full border-t border-white/[0.05] py-14 px-6 md:px-12 bg-[#060A07]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-[#34F5C5] text-[#080C0A] flex items-center justify-center font-bold text-[10px]">A</div>
              <span className="font-bold tracking-[0.2em] text-zinc-400 uppercase text-[10px]">AIRLOCAL™ Risk Radar</span>
            </div>
            <p className="font-mono-data text-zinc-700 text-[9px] leading-relaxed text-center md:text-left">
              by propiqdata.com · Inteligencia operativa para STR en Latam
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex gap-5 text-zinc-700 text-xs">
              <Link href="/terms" className="hover:text-[#34F5C5] transition-colors">Términos</Link>
              <Link href="/privacy" className="hover:text-[#34F5C5] transition-colors">Privacidad</Link>
              <a href="mailto:soporte@propiqdata.com" className="hover:text-[#34F5C5] transition-colors">soporte@propiqdata.com</a>
            </div>
            <p className="font-mono-data text-zinc-800 text-[10px] uppercase tracking-widest">© 2026 AIRLOCAL</p>
          </div>
        </div>
      </footer>

      {/* ─── SCROLL REVEAL ─── */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          var all = document.querySelectorAll('[data-reveal],[data-reveal-x]');
          if(!('IntersectionObserver' in window)){
            all.forEach(function(el){ el.classList.add('in'); }); return;
          }
          var io = new IntersectionObserver(function(entries){
            entries.forEach(function(e){
              if(e.isIntersecting){
                var d = parseFloat(e.target.style.transitionDelay)||0;
                setTimeout(function(){ e.target.classList.add('in'); }, d*1000);
                io.unobserve(e.target);
              }
            });
          },{threshold:0.12});
          all.forEach(function(el){ io.observe(el); });
        })();
      ` }} />

    </main>
  );
}
