import Link from 'next/link';

export default function DiagnosticoPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-[#eeeeee] font-sans selection:bg-[#94f03d]/30 flex flex-col overflow-x-hidden">
      
      {/* Header Minimalista */}
      <header className="w-full py-6 px-6 md:px-12 flex items-center justify-between md:justify-center border-b border-white/5 sticky top-0 z-50 bg-[#080808]/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <svg className="w-5 h-5 text-[#94f03d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1" />
          </svg>
          <span className="text-[11px] md:text-xs font-bold tracking-widest text-white uppercase flex items-center">
            AIRLOCAL <span className="text-zinc-500 font-medium border-l border-white/10 pl-2 ml-2 md:pl-3 md:ml-3">DIAGNÓSTICO EXPRESS</span>
          </span>
        </Link>
      </header>

      <section className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">
        
        {/* Encabezado */}
        <div className="text-center mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block px-3 py-1.5 rounded-full border border-[#94f03d]/20 bg-[#94f03d]/10 text-[#94f03d] text-[10px] md:text-xs font-bold tracking-widest uppercase mb-6">
            AIRLOCAL | DIAGNÓSTICO EXPRESS
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            Haz un chequeo rápido de tu unidad
          </h1>
          <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Con solo 4 datos, AIRLOCAL puede mostrarte si tu operación está saludable, vulnerable o en riesgo.
          </p>
        </div>

        {/* Tally Embed Container */}
        <div className="w-full bg-[#141414] border border-white/5 rounded-[24px] p-2 shadow-2xl relative min-h-[600px] flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
          
          {/* Subtle Background Glow behind embed */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#94f03d]/10 rounded-full blur-[100px] pointer-events-none"></div>

          {/* 
            TODO: SUSTITUIR ESTE BLOQUE POR EL IFRAME/EMBED DE TALLY.
            Por ejemplo, si es un iframe:
            <iframe 
               data-tally-src="URL_DEL_FORMULARIO?transparentBackground=1" 
               width="100%" 
               height="100%" 
               frameBorder="0" 
               marginHeight={0} 
               marginWidth={0} 
               title="Diagnostico AIRLOCAL"
               className="relative z-10 w-full h-full min-h-[600px] rounded-[20px]"
            ></iframe>
          */}
          
          <div className="relative z-10 w-full h-full min-h-[550px] border border-dashed border-white/10 rounded-[20px] flex flex-col items-center justify-center bg-white/[0.01]">
             <svg className="w-10 h-10 text-zinc-600 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
             </svg>
             <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest text-center px-4 leading-relaxed">
               [ Espacio reservado para Embed de Tally ]<br/>
               <span className="text-zinc-600 mt-2 block">Reemplazar este bloque con el iframe real</span>
             </p>
          </div>
          
        </div>

        {/* Pie de Nota */}
        <div className="mt-8 text-zinc-500 text-sm text-center flex items-center gap-2 justify-center animate-in fade-in duration-700 delay-300 fill-mode-both">
          <svg className="w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          No necesitas ser exacto. Una estimación razonable es suficiente.
        </div>

      </section>

    </main>
  );
}
