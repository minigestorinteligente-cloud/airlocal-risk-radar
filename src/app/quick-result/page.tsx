import { Suspense } from 'react';
import QuickResult from '@/components/QuickResult';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center p-6">
      <div className="w-16 h-16 border-t-2 border-emerald-500 border-solid rounded-full animate-spin"></div>
    </div>
  );
}

export default async function QuickResultPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const emailParam = resolvedParams?.email as string | undefined;

  return (
    <main className="min-h-screen bg-[#0B0C10] font-sans tracking-wide text-zinc-100">
      <Suspense fallback={<LoadingSkeleton />}>
        <QuickResult />
      </Suspense>
    </main>
  );
}
