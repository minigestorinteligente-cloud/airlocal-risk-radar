import ReportData from '@/components/ReportData';
import { Suspense } from 'react';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function DarkSkeleton() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center p-16 min-h-[50vh] bg-[#121318]/50 rounded-[24px] border border-zinc-800/40 shadow-sm mt-8">
      {/* Cargador Animado con Logo Completo (@a11.jpg) girando suavemente */}
      <div className="relative flex items-center justify-center mb-8 w-32 h-32">
        <img 
          src="/a11.png" 
          alt="Airlocal AI Sincronizando" 
          className="w-full h-full object-contain animate-[spin_4s_linear_infinite]" 
        />
        <div className="absolute inset-0 flex items-center justify-center -z-10">
           <div className="w-20 h-20 rounded-full bg-[#10b981]/5 blur-2xl animate-pulse"></div>
        </div>
      </div>
      
      {/* Texto de carga elegante sin menciones a arquitectura externa */}
      <p className="text-[#10b981]/70 tracking-[0.2em] font-mono text-[11px] uppercase animate-pulse">
        Airlocal AI: Sincronizando métricas de rentabilidad...
      </p>
    </div>
  );
}

export default async function Home({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const emailParam = resolvedParams?.email as string | undefined;

  return (
    <main className="min-h-screen bg-[#0B0C10] pb-24 flex flex-col items-center font-sans tracking-wide text-zinc-100">
      
      {/* Cabecera AIRLOCAL RISK RADAR (Estilo Patrón Oro) */}
      <div className="w-full py-5 px-6 md:px-10 flex border-b border-zinc-800/30 bg-[#0B0C10] sticky top-0 z-10 items-center justify-between shadow-sm">
        <h1 className="text-[13px] font-bold tracking-widest text-white uppercase flex items-center gap-3">
          <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>
          AIRLOCAL <span className="text-zinc-600 font-medium tracking-widest border-l border-zinc-800 pl-3">RISK RADAR</span>
        </h1>
      </div>

      <div className="w-full max-w-4xl px-4 md:px-0 py-10 flex flex-col items-center">
        {/* Renderiza el Reporte Premium Dashboard */}
        <Suspense fallback={<DarkSkeleton />}>
          <ReportData email={emailParam} />
        </Suspense>
      </div>
    </main>
  )
}