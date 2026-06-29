"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function DiagnosticoPage() {
  useEffect(() => {
    const loadTally = () => {
      // @ts-ignore
      if (typeof Tally !== 'undefined') {
        // @ts-ignore
        Tally.loadEmbeds();
      } else {
        const scriptId = 'tally-js';
        if (!document.getElementById(scriptId)) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = 'https://tally.so/widgets/embed.js';
          script.onload = () => {
            // @ts-ignore
            if (typeof Tally !== 'undefined') {
              // @ts-ignore
              Tally.loadEmbeds();
            }
          };
          script.onerror = () => {
            // Fallback: load directly if script fails
            document.querySelectorAll('iframe[data-tally-src]:not([src])').forEach((el) => {
              const iframe = el as HTMLIFrameElement;
              if (iframe.dataset.tallySrc) {
                iframe.src = iframe.dataset.tallySrc;
              }
            });
          };
          document.body.appendChild(script);
        } else {
          // If script already exists but Tally isn't initialized yet
          document.querySelectorAll('iframe[data-tally-src]:not([src])').forEach((el) => {
            const iframe = el as HTMLIFrameElement;
            if (iframe.dataset.tallySrc) {
              iframe.src = iframe.dataset.tallySrc;
            }
          });
        }
      }
    };

    loadTally();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const iframe = document.querySelector('iframe[title*="Risk Radar"]') as HTMLIFrameElement | null;
        if (iframe && iframe.contentWindow) {
          const iframeDoc = iframe.contentWindow.document;
          const tallyLogo = iframeDoc.querySelector('.tally-popup-footer') || iframeDoc.querySelector('[data-tally-badge]');
          if (tallyLogo) {
            tallyLogo.remove();
            clearInterval(interval);
          }
        }
      } catch (error) {
        // Silently catch Same-Origin Policy (SOP) exceptions to avoid runtime errors in the browser console
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0B0C] text-[#eeeeee] font-sans selection:bg-[#00FFD1]/30 flex flex-col overflow-x-hidden">
      
      {/* 1. HEADER */}
      <header className="w-full py-5 px-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-[#0B0B0C] sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="w-8 h-8 rounded-full bg-[#00FFD1] text-[#0B0B0C] flex items-center justify-center font-black text-sm shadow-[0_0_15px_rgba(0,255,209,0.3)]">A</div>
          <div className="font-bold tracking-widest text-white uppercase text-[11px] md:text-xs flex items-center">
            AIRLOCAL <span className="text-[#39a698] font-bold border-l border-white/10 pl-2 ml-2 md:pl-3 md:ml-3">RISK RADAR</span>
          </div>
        </Link>
        <Link 
          href="/"
          className="hidden md:inline-flex items-center justify-center px-7 py-3 border border-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all hover:bg-white/5 rounded-full"
        >
          Volver al Inicio
        </Link>
      </header>

      <section className="flex-1 w-full max-w-4xl mx-auto px-6 pt-12 pb-12 md:pt-16 md:pb-20 flex flex-col items-center">
        
        {/* Encabezado */}
        <div className="text-center mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block px-3 py-1.5 rounded-full border border-[#39a698]/20 bg-[#39a698]/10 text-[#39a698] text-[10px] md:text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(57,166,152,0.1)] animate-pulse">
            AIRLOCAL | DIAGNÓSTICO EXPRESS
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            Haz un chequeo rápido de tu unidad
          </h1>
          <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Con solo 4 datos, AIRLOCAL puede mostrarte si tu operation está saludable, vulnerable o en riesgo.
          </p>
        </div>

        {/* Tally Embed Container */}
        <div className="w-full relative animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both" style={{ width: '100%', position: 'relative' }}>
          
          {/* Subtle Background Glow behind embed */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#39a698]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

          <iframe 
            data-tally-src="https://tally.so/embed/J90N87?alignLeft=1&dynamicHeight=1&transparentBackground=1" 
            loading="lazy" 
            width="100%" 
            height="526" 
            frameBorder="0" 
            marginHeight={0} 
            marginWidth={0} 
            title="Risk Radar AIRLOCAL QUICK"
            style={{ 
              display: 'block',
              width: '100%',
              border: 'none',
              position: 'relative',
              zIndex: 1
            }}
          />
          
        </div>

      </section>

    </main>
  );
}
