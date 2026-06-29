import { Suspense } from 'react';
import Link from 'next/link';
import QuickResultTest from '@/components/QuickResultTest';

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] flex flex-col items-center justify-center p-6">
      <div className="w-16 h-16 border-t-2 border-emerald-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
}

export default async function RiskRadarTestPage({ searchParams }: Props) {
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

      {/* Spacing container to ensure QuickResultTest starts below the sticky header */}
      <div className="flex-1 w-full pt-10 md:pt-14">
        <Suspense fallback={<LoadingSkeleton />}>
          <QuickResultTest />
        </Suspense>
      </div>
    </main>
  );
}
