import { supabase } from '@/lib/supabase';
import { Home, Users, CalendarDays, DollarSign, AlertTriangle, TrendingUp, TrendingDown, Lock, CheckCircle2 } from 'lucide-react';
import AnimatedNumber from './AnimatedNumber';
import AnimatedProgressBar from './AnimatedProgressBar';
import InfoTooltip from './InfoTooltip';

export interface ReportRow {
  id: string;
  created_at: string;
  email: string;
  report_data: any;
}

export default async function ReportData({ email }: { email?: string }) {
  if (!email) {
    return (
      <div className="p-8 w-full max-w-2xl mx-auto bg-[#121318] rounded-[16px] border border-dashed border-zinc-800 flex flex-col items-center justify-center gap-4 text-center mt-6">
        <span className="text-zinc-500 text-[11px] font-mono tracking-widest uppercase">AIRLOCAL AI: REQUIERE EMAIL PARA ANÁLISIS DE RENTABILIDAD.</span>
      </div>
    );
  }

  const { data: report, error } = await supabase
    .from('reports')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !report) {
    return (
      <div className="p-8 w-full max-w-2xl mx-auto bg-[#121318] rounded-[16px] border border-dashed border-amber-900/30 flex flex-col items-center justify-center gap-4 text-center mt-6">
        <p className="text-amber-500/70 text-[11px] font-mono tracking-widest uppercase max-w-md">AIRLOCAL AI: EN ESPERA DE DATOS DE RENTABILIDAD DEL INMUEBLE.</p>
      </div>
    );
  }

  // Mapeo exhaustivo del JSON
  const r = report.report_data || {};
  const free = r.free || {};
  const premium = r.premium || {};
  const meta = r.meta || {};
  const summary = free.user_summary || {};
  const metrics = free.metrics || {};

  // Valores Mapeados Raw de JSON
  const propertyNameRaw = summary.property_name || "";
  const propertyName = propertyNameRaw || "tu inmueble";
  const capacity = summary.capacity || "N/A";
  const occupancyStr = summary.activity || "0";
  const revenueStr = summary.gross_income || "0";
  const cleanAuditoriaTitle = free.headline || "";
  const city = summary.city || "tu ciudad";
  const introText = `Analizamos tu inmueble "${propertyName}" en ${city}. ${free.intro || ""}`;
  
  const breakEvenStr = metrics.break_even_nights || "0";
  const adrStr = metrics.avg_nightly_income || "0";
  const netIncomeStr = metrics.net_income || "0";
  const expenseRatio = metrics.expense_ratio !== undefined ? metrics.expense_ratio : "0"; 

  const savingsOpportunityStr = premium.savings_opportunity || "0";
  const hookText = premium.hook_text || "";
  const premiumCTA = meta.premium_cta || "REVELAR PLAN DE ACCIÓN";

  const riskLevelRaw = (free.risk_level || "MEDIUM").toUpperCase();

  const getRiskBgColorHex = (risk: string) => {
    if (risk === 'HIGH') return '#FF2D2D'; // Intense Technical Red (vibrant clone)
    if (risk === 'MEDIUM') return '#FFB800'; // Intense Technical Gold (vibrant clone)
    return '#10b981';
  };

  const getRiskBorderColor = (risk: string) => {
    if (risk === 'HIGH') return 'border-[#FF2D2D]';
    if (risk === 'MEDIUM') return 'border-[#FFB800]';
    return 'border-[#10b981]';
  };

  const getRiskTextColor = (risk: string) => {
    if (risk === 'HIGH') return 'text-[#FF2D2D]';
    if (risk === 'MEDIUM') return 'text-[#FFB800]';
    return 'text-[#10b981]';
  };

  const auditBorder = getRiskBorderColor(riskLevelRaw);
  const auditIconColor = getRiskTextColor(riskLevelRaw);
  const estadoLabel = riskLevelRaw === 'HIGH' ? 'RIESGO: ALTO' : riskLevelRaw === 'MEDIUM' ? 'RIESGO: MEDIO' : 'ESTADO: OPERACIÓN CONTROLADA';
  const AuditIcon = riskLevelRaw === 'LOW' ? CheckCircle2 : AlertTriangle;

  // Cálculos Numéricos (permitiendo guiones para negativos)
  const expenseRatioNum = parseFloat(expenseRatio.toString().replace(/[^\d.-]/g, '')) || 0;
  const expensePctRaw = expenseRatioNum > 1 ? expenseRatioNum : expenseRatioNum * 100;

  const breakEvenNum = parseInt(breakEvenStr.toString().replace(/[^\d.-]/g, '')) || 0;
  const adrNum = parseInt(adrStr.toString().replace(/[^\d.-]/g, '')) || 0;
  const netIncomeNum = parseInt(netIncomeStr.toString().replace(/[^\d.-]/g, '')) || 0;
  const savingsOppNum = parseInt(savingsOpportunityStr.toString().replace(/[^\d.-]/g, '')) || 0;
  const revNum = parseInt(revenueStr.toString().replace(/[^\d.-]/g, '')) || 0;
  
  const totalNights = 30;
  const occMatch = String(occupancyStr).match(/\d+/);
  const occNum = occMatch ? parseInt(occMatch[0], 10) : 0; 
  
  const rawOpCost = metrics.operating_costs !== undefined 
    ? parseFloat(String(metrics.operating_costs).replace(/[^\d.-]/g, '')) 
    : revNum * (expensePctRaw / 100);

  const opCostNum = Math.round(rawOpCost);
  const finalNetIncomeNum = revNum - opCostNum;

  const getNetIncomeColorClass = () => {
    if (finalNetIncomeNum < 0 || riskLevelRaw === 'HIGH') return 'text-[#FF2D2D]';
    if (riskLevelRaw === 'MEDIUM') return 'text-[#FFB800]';
    return 'text-[#10b981]';
  };
  const netIncomeColorClass = getNetIncomeColorClass();
  const NetIncomeIcon = finalNetIncomeNum < 0 ? TrendingDown : TrendingUp;
  
  const netUtilityRaw = metrics.net_utility_nights !== undefined 
    ? parseInt(String(metrics.net_utility_nights).replace(/[^\d.-]/g, '')) 
    : Math.max(0, occNum - breakEvenNum);
  const utilityPercent = (netUtilityRaw / totalNights) * 100;

  const marginOfSafetyStr = metrics.margin_of_safety !== undefined 
    ? metrics.margin_of_safety 
    : netUtilityRaw;
  const marginOfSafetyNum = parseInt(String(marginOfSafetyStr).replace(/[^\d.-]/g, '')) || 0;
  

  // Barras de progreso usan hex puro en inline-style para máxima opacidad y densidad
  const operativGasColorHex = getRiskBgColorHex(riskLevelRaw);

  let rendimientoColorHex = '#10b981'; // Green per user request: "barra verde"
  let rendimientoPercent = (occNum / 30) * 100; // Cálculo dinámico exacto: (noches_ocupadas / 30) * 100

  return (
    <div className="w-full flex flex-col gap-4 font-sans max-w-5xl mx-auto relative mt-2">
      
      {/* BRANDING: Cerebro Hexagonal superior (@a10.jpg Reference) centrado sobre tarjetas */}
      <div className="w-full flex justify-center mb-6">
        <img src="/a10.png" alt="Airlocal Brain" className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.1)]" />
      </div>

      {/* 4 KPIs Top */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#121318] border border-zinc-800 rounded-[12px] p-5 flex flex-col justify-between h-[130px]">
          <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-bold tracking-wider mb-2">
            <Home className="w-3.5 h-3.5" /> Inmueble
          </div>
          <div className="text-[15px] font-bold text-white truncate tracking-wide">{propertyName}</div>
        </div>
        
        <div className="bg-[#121318] border border-zinc-800 rounded-[12px] p-5 flex flex-col justify-between h-[130px]">
          <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-bold tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" /> Capacidad
          </div>
          <div className="text-[13px] font-medium text-zinc-200 truncate leading-tight mt-auto">{capacity}</div>
        </div>
        
        <div className="bg-[#121318] border border-zinc-800 rounded-[12px] p-5 flex flex-col justify-between h-[130px]">
          <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-bold tracking-wider mb-2">
            <CalendarDays className="w-3.5 h-3.5" /> Ocupación
          </div>
          <div className="text-[13px] font-medium text-zinc-200 leading-tight mt-auto">{occupancyStr}</div>
        </div>
        
        <div className="bg-[#121318] border border-zinc-800 rounded-[12px] p-5 flex flex-col justify-between h-[130px]">
          <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-bold tracking-wider mb-2">
            <DollarSign className="w-3.5 h-3.5" /> Facturación
          </div>
          <div className="text-[15px] font-bold text-white flex gap-1 items-baseline mt-auto">
            <AnimatedNumber value={revNum} prefix="$" />
            <span className="text-[11px] text-zinc-500 font-medium">USD</span>
          </div>
        </div>
      </div>

      <div className={`bg-[#121318] border ${auditBorder} rounded-[16px] p-8 mt-1`}>
        <div className={`flex items-center gap-2 ${auditIconColor} text-[13px] font-bold tracking-widest uppercase mb-4`}>
           <AuditIcon className="w-4 h-4" /> {estadoLabel}
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-zinc-100 uppercase tracking-tight leading-tight mb-4">
          {cleanAuditoriaTitle}
        </h2>
        <p className="text-zinc-400 text-base leading-relaxed max-w-4xl">
          {introText}
        </p>
        {free.efficiency_challenge && (
          <div className="mt-6 bg-[#181920] border border-zinc-800/60 rounded-[12px] p-5">
            <div className={`${auditIconColor} text-[11px] font-bold tracking-widest uppercase mb-2`}>
              {typeof free.efficiency_challenge === 'object' && free.efficiency_challenge.title 
                ? free.efficiency_challenge.title 
                : 'Desafío de Eficiencia'}
            </div>
            <p className="text-zinc-400 text-[14px] leading-relaxed">
              {typeof free.efficiency_challenge === 'object' 
                ? free.efficiency_challenge.description 
                : String(free.efficiency_challenge)}
            </p>
          </div>
        )}
      </div>

      {/* Break-even, Ingreso Medio */}
      <div className="grid grid-cols-2 gap-3 mt-1">
        <div className="bg-[#121318] border border-zinc-800 rounded-[12px] p-6 relative flex flex-col justify-between h-[140px]">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[11px] text-zinc-500 font-bold tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21.21 15.89A10 10 0 118 2.83M22 12A10 10 0 0012 2v10z"/></svg> 
              Noches Break-Even
            </div>
            <InfoTooltip content="Noches mínimas de ocupación requeridas para cubrir todos tus costos operativos. A partir de aquí, empiezas a generar ganancias." />
          </div>
          <div className="mt-auto">
            <AnimatedNumber value={breakEvenNum} className="text-4xl md:text-5xl font-black text-white tracking-tighter" duration={1200} />
            <div className="text-[11px] font-medium text-zinc-600 uppercase tracking-widest mt-1">NOCHES/MES</div>
          </div>
        </div>

        <div className="bg-[#121318] border border-zinc-800 rounded-[12px] p-6 relative flex flex-col justify-between h-[140px]">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[11px] text-zinc-500 font-bold tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> 
              Ingreso Medio / Noche
            </div>
            <InfoTooltip content="El dinero neto proyectado que queda en tu cuenta tras descontar comisiones de plataforma y todos los gastos operativos." />
          </div>
          <div className="mt-auto">
            <AnimatedNumber value={adrNum} prefix="$" className="text-4xl md:text-5xl font-black text-white tracking-tighter" duration={1300} />
            <div className="text-[11px] font-medium text-zinc-600 uppercase tracking-widest mt-1">USD</div>
          </div>
        </div>
      </div>

      {/* Fila: Utilidad, Ingreso Neto */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#121318] border border-zinc-800/40 rounded-[12px] p-6 relative flex flex-col justify-between h-[140px]">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[11px] text-zinc-500 font-bold tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> 
              Noches de Utilidad Neta
            </div>
            <InfoTooltip content="El número de noches que se convierten directamente en ganancia pura para tu cuenta, después de cubrir todos los gastos." />
          </div>
          <div className="mt-auto">
            <AnimatedNumber value={netUtilityRaw} className="text-4xl md:text-5xl font-black text-white tracking-tighter" duration={1100} />
            <div className="text-[11px] font-medium text-zinc-600 uppercase tracking-widest mt-1">NOCHES</div>
          </div>
        </div>

        <div className="bg-[#121318] border border-zinc-800/40 rounded-[12px] p-6 relative flex flex-col justify-between h-[140px]">
          <div className="flex justify-between items-center mb-4">
            <div className="text-[11px] text-zinc-500 font-bold tracking-wider flex items-center gap-2">
              <NetIncomeIcon className={`w-4 h-4 ${netIncomeColorClass}`} /> 
              Ingreso Neto
            </div>
            <InfoTooltip content="El dinero neto proyectado que queda en tu cuenta tras descontar comisiones de plataforma y todos los gastos operativos." />
          </div>
          <div className="mt-auto">
            <AnimatedNumber value={finalNetIncomeNum} prefix="$" className={`text-4xl md:text-5xl font-black ${netIncomeColorClass} tracking-tighter`} duration={1500} />
            <div className="text-[11px] font-medium text-zinc-600 uppercase tracking-widest mt-1">USD/MES</div>
          </div>
        </div>
      </div>

      {/* Barras Animadas y Costos Operativos */}
      <div className="flex flex-col gap-3 mt-1">
        <AnimatedProgressBar 
          label="Rendimiento del Mes" 
          highlightText={<AnimatedNumber value={Math.round(rendimientoPercent)} suffix="%" duration={1100} />} 
          textRight="ocupación real" 
          accentColorHex={rendimientoColorHex} 
          percent={rendimientoPercent} 
          infoText="Porcentaje de ocupación real del inmueble sobre el total de noches del mes."
          className="h-[130px]"
        />
        
        <AnimatedProgressBar 
          label="% Gastos Operativos" 
          highlightText={<AnimatedNumber value={expensePctRaw} suffix="%" duration={1600} />} 
          textRight="consumo de gastos" 
          accentColorHex={operativGasColorHex} 
          percent={expensePctRaw} 
          infoText="Proporción de tus ingresos que se destina exclusivamente al pago de costos operativos y mantenimiento."
          className="h-[130px]"
        />

        <div className="bg-[#121318] border border-zinc-800 p-6 rounded-[12px] flex flex-col justify-between h-[130px]">
           <div className="text-[11px] text-zinc-500 font-bold tracking-widest mb-1 flex justify-between items-center">
             <span>Costos Operativos</span>
             <InfoTooltip content="Suma total de gastos: limpieza, consumibles, servicios e impuestos o cuotas asociadas al mes." />
           </div>
            <div className="text-4xl md:text-5xl font-black text-white tracking-tighter mt-auto">
              <AnimatedNumber value={opCostNum} prefix="$" duration={1400} /> <span className="text-[13px] text-zinc-600 font-normal">USD</span>
            </div>
        </div>
      </div>

      {/* CAJA DE TENTACIÓN SUPER LIMPIA E IDÉNTICA AL PATRÓN ORO */}
      <div className="w-full bg-[#121318] border border-zinc-800/50 rounded-[16px] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col items-center text-center mt-6 transition-all group hover:border-zinc-700/50 relative overflow-hidden">
        {/* Glow difuminado elegante */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FF6B35]/[0.02] pointer-events-none"></div>
        
        <div className="w-10 h-10 bg-zinc-800/40 rounded-full flex items-center justify-center mb-5 border border-zinc-700/40">
          <Lock className="w-4 h-4 text-zinc-500" />
        </div>
        
        <div className="flex items-center gap-2 text-[#10b981] font-bold text-[11px] uppercase tracking-widest mb-3">
          <TrendingUp className="w-4 h-4" /> 
          Ahorro Potencial
        </div>
        
        <h3 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
          <AnimatedNumber value={savingsOppNum} prefix="$" duration={1800} /> 
          <span className="text-white"> {
            riskLevelRaw === 'HIGH' ? 'USD en Fuga Detectada' : 
            riskLevelRaw === 'MEDIUM' ? 'USD en Riesgo Operativo' : 
            'USD de Potencial Extra'
          }</span>
        </h3>
        
        <p className="text-zinc-400 text-base max-w-lg leading-relaxed mb-8">
          {hookText}
        </p>
        
        <button className="px-6 py-3.5 bg-[#FF6B35] hover:bg-[#FF5A2A] text-white font-bold tracking-widest rounded-lg transition-all shadow-[0_0_15px_rgba(255,107,53,0.15)] text-[12px] uppercase z-10">
          Revelar Plan para {propertyName}
        </button>
      </div>

    </div>
  );
}
