"use client";

import { Suspense, useState, useEffect, Fragment } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, TrendingUp, CheckCircle2, Clock, DollarSign, BarChart3, RefreshCw, Target, Search, ClipboardCheck, Coins, Lock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Manrope, Inter } from 'next/font/google';
import AnimatedNumber from '../../components/AnimatedNumber';
import { HealthGauge } from "./health-gauge";
import { LeakRadar, LeakDonut, LeakBars } from "./leak-radar";
import { SurvivalFormula } from "./survival-formula";
import { AgentSectionHeader } from "../../components/AgentSectionHeader";

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['700'],
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseClient = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export const dynamic = 'force-dynamic';

const extractNumericValue = (val: any) => {
  if (val === undefined || val === null) return 0;
  const str = String(val);
  const num = Number(str.replace(/[^0-9.-]/g, ''));
  return isNaN(num) ? 0 : num;
};

const parseHeroAmount = (val: any, fallbackSuffix: string) => {
  if (val === undefined || val === null) return { value: '', suffix: fallbackSuffix };
  const str = String(val);
  if (str.includes("USD")) {
    const parts = str.split("USD");
    const valPart = parts[0].trim();
    const suffixPart = "USD" + (parts[1] || "");
    return { value: valPart, suffix: suffixPart.trim() };
  }
  const num = Number(str.replace(/[^0-9.-]/g, ''));
  if (!isNaN(num) && num > 0) {
    return { value: `+$${num.toLocaleString()}`, suffix: fallbackSuffix };
  }
  return { value: str, suffix: fallbackSuffix };
};

const adaptConclusionTone = (text: string, mode: string) => {
  if (!text) return "";
  const cleanMode = (mode || "").trim().toUpperCase();
  if (cleanMode === "RECUPERACION") {
    return text;
  }

  let adapted = text;

  if (cleanMode === "MEJORA") {
    const replacements = [
      { search: /fugas operativas relevantes/gi, replace: "oportunidades claras de mejora" },
      { search: /fugas operativas confirmadas/gi, replace: "oportunidades de mejora identificadas" },
      { search: /fugas recuperables confirmadas/gi, replace: "oportunidades de mejora identificadas" },
      { search: /fugas operativas/gi, replace: "áreas prioritarias de optimización" },
      { search: /fugas recuperables/gi, replace: "oportunidades de mejora" },
      { search: /fugas detectadas/gi, replace: "oportunidades de mejora identificadas" },
      { search: /fugas/gi, replace: "oportunidades de mejora" },
      { search: /desviación crítica/gi, replace: "diferencia a revisar" },
      { search: /desviaciones críticas/gi, replace: "diferencias a revisar" },
      { search: /desviación/gi, replace: "diferencia frente al benchmark" },
      { search: /desviaciones/gi, replace: "diferencias frente al benchmark" },
      { search: /riesgo operativo crítico/gi, replace: "oportunidad prioritaria de mejora" },
      { search: /riesgo crítico/gi, replace: "oportunidad de mejora" },
      { search: /riesgo operativo/gi, replace: "espacio de mejora operativa" },
      { search: /vulnerable/gi, replace: "con espacio para fortalecer" }
    ];

    replacements.forEach(r => {
      adapted = adapted.replace(r.search, r.replace);
    });

    if (!adapted.toLowerCase().includes("fortalecer el rendimiento")) {
      adapted = adapted.trim();
      if (!adapted.endsWith(".")) adapted += ".";
      adapted += " El benchmark identifica oportunidades concretas para fortalecer el rendimiento.";
    }
  } else if (cleanMode === "OPTIMIZACION") {
    const replacements = [
      { search: /fugas operativas relevantes/gi, replace: "oportunidades de optimización" },
      { search: /fugas operativas confirmadas/gi, replace: "oportunidades de optimización incremental" },
      { search: /fugas recuperables confirmadas/gi, replace: "oportunidades de optimización incremental" },
      { search: /fugas operativas/gi, replace: "oportunidades puntuales de optimización" },
      { search: /fugas recuperables/gi, replace: "oportunidades de optimización" },
      { search: /fugas detectadas/gi, replace: "oportunidades de optimización" },
      { search: /fugas confirmadas/gi, replace: "oportunidades de optimización incremental" },
      { search: /fugas/gi, replace: "oportunidades de optimización" },
      { search: /problemas operativos/gi, replace: "oportunidades de optimización" },
      { search: /desviación crítica/gi, replace: "desviación operativa" },
      { search: /desviaciones críticas/gi, replace: "puntos de atención" },
      { search: /desviación/gi, replace: "ajuste fino" },
      { search: /desviaciones/gi, replace: "ajustes finos" },
      { search: /riesgo operativo crítico/gi, replace: "oportunidad de optimización incremental" },
      { search: /riesgo crítico/gi, replace: "oportunidad para seguir fortaleciendo la rentabilidad" },
      { search: /riesgo operativo/gi, replace: "área de optimización" },
      { search: /vulnerable/gi, replace: "con espacio para optimización incremental" }
    ];

    replacements.forEach(r => {
      adapted = adapted.replace(r.search, r.replace);
    });

    if (!adapted.toLowerCase().includes("desempeño sólido")) {
      adapted = "La operación ya presenta un desempeño sólido. " + adapted;
    }
    if (!adapted.toLowerCase().includes("seguir fortaleciendo la rentabilidad")) {
      adapted = adapted.trim();
      if (!adapted.endsWith(".")) adapted += ".";
      adapted += " Existen oportunidades puntuales para seguir fortaleciendo la rentabilidad.";
    }
  }

  return adapted;
};

const getNormalizedState = (estado: string) => {
  const clean = (estado || "").trim().toUpperCase();
  if (clean.includes("SALUD") || clean.includes("OPTIM") || clean.includes("VERDE") || clean.includes("GOOD") || clean.includes("OK")) {
    return { label: "🟢 SÓLIDA", className: "text-emerald-400 bg-emerald-950/40" };
  }
  if (clean.includes("CRITIC") || clean.includes("PELIGRO") || clean.includes("ROJO") || clean.includes("BAD") || clean.includes("ERROR") || clean.includes("FAIL")) {
    return { label: "🔴 CRÍTICA", className: "text-rose-400 bg-rose-950/40" };
  }
  return { label: "🟡 ATENCIÓN", className: "text-orange-400 bg-orange-950/40" };
};

const formatMetrica = (pilarName: string, metricaStr: string) => {
  const pilar = (pilarName || "").toLowerCase();
  const str = metricaStr || "";
  
  if (pilar.includes("ocupac") || pilar.includes("occupanc")) {
    const pctMatch = str.match(/(\d+)\s*%/g);
    if (pctMatch && pctMatch.length >= 2) {
      return {
        line1: `${pctMatch[0]} de ocupación`,
        line2: `Objetivo AIRLOCAL: ${pctMatch[1]}`
      };
    } else if (pctMatch && pctMatch.length === 1) {
      return {
        line1: `${pctMatch[0]} de ocupación`,
        line2: `Objetivo AIRLOCAL: 65%`
      };
    }
    const nums = str.match(/\d+/g);
    if (nums && nums.length >= 2) {
      return {
        line1: `${nums[0]}% de ocupación`,
        line2: `Objetivo AIRLOCAL: ${nums[1]}%`
      };
    }
    return { line1: str, line2: "" };
  }
  
  if (pilar.includes("colch") || pilar.includes("seguridad") || pilar.includes("margin") || pilar.includes("safety")) {
    const nums = str.match(/\d+/g);
    if (nums && nums.length >= 2) {
      const labelNights1 = Number(nums[0]) === 1 ? "noche" : "noches";
      const labelNights2 = Number(nums[1]) === 1 ? "noche" : "noches";
      return {
        line1: `${nums[0]} ${labelNights1} de margen`,
        line2: `Objetivo AIRLOCAL: ${nums[1]} ${labelNights2}`
      };
    } else if (nums && nums.length === 1) {
      const labelNights = Number(nums[0]) === 1 ? "noche" : "noches";
      return {
        line1: `${nums[0]} ${labelNights} de margen`,
        line2: `Objetivo AIRLOCAL: 10 noches`
      };
    }
    return { line1: str, line2: "" };
  }
  
  if (pilar.includes("eficiencia") || pilar.includes("expense") || pilar.includes("gasto")) {
    const pctMatch = str.match(/(\d+)\s*%/g);
    if (pctMatch && pctMatch.length >= 2) {
      return {
        line1: `${pctMatch[0]} de gastos operativos`,
        line2: `Benchmark recomendado: ${pctMatch[1]}`
      };
    } else if (pctMatch && pctMatch.length === 1) {
      return {
        line1: `${pctMatch[0]} de gastos operativos`,
        line2: `Benchmark recomendado: 40%`
      };
    }
    const nums = str.match(/\d+/g);
    if (nums && nums.length >= 2) {
      return {
        line1: `${nums[0]}% de gastos operativos`,
        line2: `Benchmark recomendado: ${nums[1]}%`
      };
    }
    return { line1: str, line2: "" };
  }

  if (pilar.includes("rentabilidad") || pilar.includes("neto") || pilar.includes("utilidad")) {
    const pctMatch = str.match(/(\d+\.?\d*)\s*%/g);
    if (pctMatch && pctMatch.length >= 2) {
      return {
        line1: `${pctMatch[0]} de margen neto`,
        line2: `Objetivo AIRLOCAL: ${pctMatch[1]}`
      };
    } else if (pctMatch && pctMatch.length === 1) {
      return {
        line1: `${pctMatch[0]} de margen neto`,
        line2: `Objetivo AIRLOCAL: 45%`
      };
    }
    const nums = str.match(/\d+/g);
    if (nums && nums.length >= 2) {
      return {
        line1: `${nums[0]}% de margen neto`,
        line2: `Objetivo AIRLOCAL: ${nums[1]}%`
      };
    }
    return { line1: str, line2: "" };
  }
  
  if (str.toLowerCase().includes("vs")) {
    const parts = str.split(/vs/i);
    return {
      line1: parts[0].trim(),
      line2: `Objetivo: ${parts[1].trim()}`
    };
  }
  
  return { line1: str, line2: "" };
};

const parsePotencial = (impactText: string) => {
  if (!impactText) return null;
  const match = impactText.match(/\+\$([0-9,.]+)/) || impactText.match(/\$([0-9,.]+)/);
  if (match) {
    const amount = match[0];
    const cleanAmount = amount.startsWith('+') ? amount : `+${amount}`;
    return `${cleanAmount} USD/mes`;
  }
  return null;
};

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] flex flex-col items-center justify-center p-6">
      <div className="w-16 h-16 border-t-2 border-[#00D1B2] border-solid rounded-full animate-spin"></div>
    </div>
  );
}

function AuditoriaFormContent() {
  const searchParams = useSearchParams();

  // CONTROL DE PASOS (1: ID, 2: Operación, 3: Costos, 4: Entorno, 5: Resultados Blur)
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('status') || params.get('report_id')) return 4;
    }
    return 0;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [n8nReport, setN8nReport] = useState<any>(null);
  const [isFetchingReport, setIsFetchingReport] = useState(false);

  // Comunica el paso actual al body para que el CSS pueda mostrar/ocultar el sweep
  useEffect(() => {
    document.body.setAttribute('data-auditoria-step', String(currentStep));
    return () => { document.body.removeAttribute('data-auditoria-step'); };
  }, [currentStep]);
  const [betaEmail, setBetaEmail] = useState('');
  const [isBetaSubmitted, setIsBetaSubmitted] = useState(false);
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPlaceholderForm, setShowPlaceholderForm] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [validationMsg, setValidationMsg] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  interface FormDataState {
    property_name: string;
    country: string;
    city: string;
    property_type: string;
    market_type: string;
    Max_guest: number | string;
    max_guests: number | string;
    bedrooms: number | string;
    bathrooms: number | string;
    occupied_nights: number;
    available_nights: number;
    gross_income: number | string;
    platfom_commission: number | string;
    cleaning_cost: number | string;
    services_cost: number | string;
    maintenence_cost: number | string;
    tax_cost: number | string;
    Hidden_cost: number | string;
    approximate_expenses: number | string;
    competitive_adr: number | string;
    stability_perception: string;
    risk_perception: string;
    no_major_risk: string;
    email: string;
  }

  const [formData, setFormData] = useState<FormDataState>({
    property_name: '',
    country: '',
    city: '',
    property_type: 'Apartamento',
    market_type: '',
    Max_guest: '',
    max_guests: '',
    bedrooms: '',
    bathrooms: '',
    occupied_nights: 0,
    available_nights: 0,
    gross_income: '',
    platfom_commission: '',
    cleaning_cost: '',
    services_cost: '',
    maintenence_cost: '',
    tax_cost: '',
    Hidden_cost: '',
    approximate_expenses: '',
    competitive_adr: '',
    stability_perception: 'Se mantuvieron',
    risk_perception: 'Totalmente bajo control',
    no_major_risk: 'Nada en particular (por ahora)',
    email: '',
  });

  // PERSISTENCIA DE DATOS Y MECANISMO DE RESPALDO (FALLBACK) PARA PRUEBAS
  useEffect(() => {
    // Intentar leer el email de la URL
    const urlEmail = searchParams.get('email');
    
    // Intentar leer datos del localStorage (solo en el navegador)
    let localEmail = '';
    let localCountry = '';
    let localCity = '';
    let localName = '';
    if (typeof window !== 'undefined') {
      try {
        localEmail = localStorage.getItem("user_email") || localStorage.getItem("email") || '';
        localCountry = localStorage.getItem("user_country") || localStorage.getItem("country") || '';
        localCity = localStorage.getItem("user_city") || localStorage.getItem("city") || '';
        localName = localStorage.getItem("property_name") || localStorage.getItem("name") || '';
      } catch (e) {
        console.warn("No se pudo acceder a localStorage:", e);
      }
    }

    // Auto-asignación de email de pruebas si está vacío en URL y localStorage
    const emailToUse = urlEmail || localEmail || 'malenasoloads@gmail.com';

    setFormData(prev => ({
      ...prev,
      property_name: searchParams.get('property_name') || searchParams.get('name') || localName || prev.property_name || '',
      country: searchParams.get('country') || localCountry || prev.country || '',
      city: searchParams.get('city') || localCity || prev.city || '',
      email: emailToUse,
    }));

  }, [searchParams]);

  // CARGA DE REPORTE COMPARTIDO — cuando viene de /r/[id] con ?shared_id=<uuid>
  useEffect(() => {
    const sharedId = searchParams.get('shared_id');
    if (!sharedId || !supabaseClient) return;

    setCurrentStep(4);
    setIsFetchingReport(true);

    supabaseClient
      .from('reports')
      .select('*')
      .eq('id', sharedId)
      .single()
      .then(({ data, error }: { data: any; error: any }) => {
        if (data && !error) {
          let parsedObj = { ...data };
          try {
            if (parsedObj.report_data) {
              let raw = parsedObj.report_data;
              if (typeof raw === 'string') raw = JSON.parse(raw);
              if (typeof raw === 'string') raw = JSON.parse(raw);
              if (raw && raw.report_data && !raw.free) raw = raw.report_data;
              parsedObj.report_data = raw;
            }
          } catch (e) { /* already parsed */ }

          setN8nReport(parsedObj);
          setShowPlaceholderForm(true);

          // Pre-fill only the non-sensitive fields from the report
          const rd = parsedObj.report_data || {};
          const summary = rd.free?.user_summary || {};
          const metrics = rd.free?.metrics || {};
          setFormData(prev => ({
            ...prev,
            property_name: summary.property_name || prev.property_name,
            gross_income: summary.gross_income || metrics.gross_income || prev.gross_income,
          }));
        }
        setIsFetchingReport(false);
      });
  }, [searchParams]);

  // MANEJO DE CAMBIOS E INTERACCIONES EN INPUTS (Limpieza de 0 inicial y soporte de strings vacíos)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number'
        ? (value === '' ? '' : Math.round(Number(value)))
        : value
    }));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '0' || Number(value) === 0) {
      setFormData(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectPropertyType = (type: string) => {
    setFormData(prev => ({ ...prev, property_type: type }));
  };

  const handleSelectMarketType = (type: string) => {
    setFormData(prev => ({ ...prev, market_type: type }));
  };

  const handleSelectPerception = (field: 'stability_perception' | 'risk_perception' | 'no_major_risk', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showValidation = (msg: string) => {
    setValidationMsg(msg);
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.property_name.trim()) {
        showValidation('Ingresa el nombre de tu propiedad para continuar.');
        return;
      }
      if (!formData.market_type) {
        showValidation('Selecciona el tipo de mercado (Urbano o Vacacional).');
        return;
      }
      if (!String(formData.max_guests).trim() || Number(formData.max_guests) < 1) {
        showValidation('Indica cuántos huéspedes máximo admite tu propiedad.');
        return;
      }
      if (!String(formData.bedrooms).trim() || Number(formData.bedrooms) < 1) {
        showValidation('Indica cuántas habitaciones tiene tu propiedad.');
        return;
      }
      if (!String(formData.bathrooms).trim() || Number(formData.bathrooms) < 1) {
        showValidation('Indica cuántos baños tiene tu propiedad.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!String(formData.gross_income).trim() || Number(formData.gross_income) <= 0) {
        showValidation('Ingresa el ingreso mensual estimado de tu propiedad.');
        return;
      }
      if (!String(formData.approximate_expenses).trim() || Number(formData.approximate_expenses) < 0) {
        showValidation('Ingresa los gastos operativos aproximados de tu propiedad.');
        return;
      }
      if (Number(formData.occupied_nights) <= 0) {
        showValidation('Indica cuántas noches estuvo ocupada tu propiedad el último mes.');
        return;
      }
      if (Number(formData.available_nights) <= 0) {
        showValidation('Indica cuántas noches estuvo disponible tu propiedad.');
        return;
      }
      if (Number(formData.occupied_nights) > Number(formData.available_nights)) {
        showValidation('Las noches ocupadas no pueden superar las noches disponibles.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleOpenCheckout = () => {
    const costs = [
      { val: formData.platfom_commission, label: 'Comisión OTA / Plataformas' },
      { val: formData.cleaning_cost,       label: 'Limpieza Total' },
      { val: formData.services_cost,       label: 'Servicios Básicos / Gas / Luz' },
      { val: formData.maintenence_cost,    label: 'Mantenimiento / Reparaciones' },
      { val: formData.tax_cost,            label: 'Impuestos y Licencias' },
      { val: formData.Hidden_cost,         label: 'Otros Gastos Ocultos' },
    ];
    const missing = costs.find(c => String(c.val).trim() === '');
    if (missing) {
      showValidation(`Completa el campo "${missing.label}" para desbloquear el análisis completo.`);
      return;
    }
    setIsCheckoutModalOpen(true);
    setAccessCode('');
    setCheckoutError('');
  };

  const handleConfirmCheckout = () => {
    if (accessCode.toUpperCase() === 'BETA2026') {
      setIsCheckoutModalOpen(false);
      handlePremiumSubmit();
    } else {
      setCheckoutError('Código inválido. Intenta de nuevo.');
    }
  };

  const handlePremiumSubmit = async () => {
    setIsSubmitting(true);
    setIsFetchingReport(true);
    setErrorMessage('');

    const finalEmail = formData.email.trim() || 'malenasoloads@gmail.com';
    const assessmentCode = n8nReport?.assessment_code || '';
    const reportUuid = n8nReport?.id || '';

    const payload: Record<string, any> = {
      property_name: String(formData.property_name),
      country: String(formData.country || 'España'),
      city: String(formData.city || 'Madrid'),
      property_type: String(formData.property_type),
      market_type: String(formData.market_type || ''),
      Max_guest: Math.round(Number(formData.Max_guest)),
      bedrooms: Math.round(Number(formData.bedrooms)),
      bathrooms: Math.round(Number(formData.bathrooms)),
      occupied_nights: Math.round(Number(formData.occupied_nights)),
      available_nights: Math.round(Number(formData.available_nights)),
      gross_income: Math.round(Number(formData.gross_income)),
      platfom_commission: Math.round(Number(formData.platfom_commission || 0)),
      cleaning_cost: Math.round(Number(formData.cleaning_cost || 0)),
      services_cost: Math.round(Number(formData.services_cost || 0)),
      maintenence_cost: Math.round(Number(formData.maintenence_cost || 0)),
      tax_cost: Math.round(Number(formData.tax_cost || 0)),
      Hidden_cost: Math.round(Number(formData.Hidden_cost || 0)),
      stability_perception: String(formData.stability_perception),
      risk_perception: String(formData.risk_perception),
      no_major_risk: String(formData.no_major_risk),
      email: String(finalEmail),
      assessment_code: String(assessmentCode),
      uuid: String(reportUuid)
    };

    console.log("PAYLOAD WEBHOOK ENVIADO A N8N PARA ETAPA 2 (PREMIUM):", payload);

    try {
      const searchParamsPayload = new URLSearchParams();
      Object.keys(payload).forEach(key => {
        searchParamsPayload.append(key, String(payload[key]));
      });

      await fetch("https://n8n.propiqdata.com/webhook/risk-radar-v3", {
        method: "POST",
        mode: 'no-cors',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: searchParamsPayload.toString()
      });

      console.log("Datos Premium enviados con éxito. Consultando Supabase para reporte Premium...");

      let fetchedData = null;
      if (supabaseClient) {
        // Polling loop
        for (let attempt = 0; attempt < 8; attempt++) {
          console.log(`Intentando consultar Supabase Premium (intento ${attempt + 1})...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data, error: sbError } = await supabaseClient
            .from('reports')
            .select('*')
            .eq('assessment_code', n8nReport.assessment_code)
            .single() as any;

          if (data && data.report_level === 'premium' && data.status === 'COMPLETED' && data.report_data !== null) {
            let parsedObj = { ...data };
            try {
              if (parsedObj.report_data) {
                let raw = parsedObj.report_data;
                if (typeof raw === 'string') raw = JSON.parse(raw);
                if (typeof raw === 'string') raw = JSON.parse(raw);
                if (raw && raw.report_data && !raw.free) {
                  raw = raw.report_data;
                }
                parsedObj.report_data = raw;
              }
            } catch (e) {
              console.error('Error parsing report_data:', e);
            }
            fetchedData = parsedObj;
            console.log("Reporte Premium obtenido exitosamente:", fetchedData);
            break;
          }
        }
      }

      if (fetchedData) {
        setN8nReport(fetchedData);
        setIsUnlocked(true);
      }
      
    } catch (error: any) {
      console.error("ERROR EN EL ENVÍO A N8N PREMIUM:", error);
    } finally {
      setIsFetchingReport(false);
      setShowPlaceholderForm(false);
      setIsSubmitting(false);
    }
  };


  // CÁLCULOS MATEMÁTICOS DEL CEREBRO N8N (LOCAL FALLBACK DE ALTO RENDIMIENTO)
  const calculateResults = () => {
    const safeNum = (val: any) => isNaN(Number(val)) ? 0 : Number(val);

    const input = {
      property_name: formData.property_name || "Mi Propiedad",
      city: formData.city || "tu ciudad",
      country: formData.country || "España",
      occupied_nights: safeNum(formData.occupied_nights),
      available_nights: safeNum(formData.available_nights || 30),
      gross_income: safeNum(formData.gross_income),
      costs: {
        comision: safeNum(formData.platfom_commission),
        limpieza: safeNum(formData.cleaning_cost),
        servicios: safeNum(formData.services_cost),
        mantenimiento: safeNum(formData.maintenence_cost),
        impuestos: safeNum(formData.tax_cost),
        otros: safeNum(formData.Hidden_cost)
      }
    };

    const total_costs = isUnlocked
      ? Object.values(input.costs).reduce((a, b) => a + b, 0)
      : safeNum(formData.approximate_expenses || 1400);
    const net_income = input.gross_income - total_costs;
    const expense_ratio = input.gross_income > 0 ? Math.round((total_costs / input.gross_income) * 100) : 0;
    const factorX = input.gross_income > 0 ? (total_costs / input.gross_income).toFixed(1) : "0.0";

    const avg_price = input.occupied_nights > 0 ? (input.gross_income / input.occupied_nights) : 0;
    const break_even_nights = avg_price > 0 ? total_costs / avg_price : 0;
    const margin_of_safety = net_income > 0 ? Math.max(0, input.occupied_nights - break_even_nights) : 0;

    let headline = "", argument = "", eff_desc = "", riskLevel = "", premiumHeadline = "", premiumHook = "";
    const scopeNote = "Análisis enfocado en Gestión Operativa (gastos de funcionamiento).";

    // --- LÓGICA DE AUDITORÍA Y COLORES ---
    if (expense_ratio >= 75 || net_income <= 0) { 
        riskLevel = "HIGH"; // Activa ROJO en Lovable
        headline = "AUDITORÍA: RIESGO OPERATIVO CRÍTICO";
        argument = `${scopeNote} Tus costos operativos consumen el ${expense_ratio}% de tus ingresos. Sin contar hipoteca, tu operación ya está en zona de pérdida de capital.`;
        eff_desc = `FACTOR CRÍTICO: Gastas ${factorX}x respecto a tus ingresos. Punto de quiebre detectado.`;
        
        premiumHeadline = `$${Math.abs(net_income * 12).toLocaleString('en-US')} USD / Año en Riesgo`;
        premiumHook = `Tu operación requiere una reestructuración inmediata. El reporte detallado identifica los focos de fuga exactos.`;
    } 
    else if (expense_ratio >= 45) { 
        riskLevel = "MEDIUM"; // Activa AMARILLO en Lovable
        headline = "AUDITORÍA: MARGEN OPERATIVO TENSO";
        argument = `Tu estructura de gastos es elevada (${expense_ratio}%). Tu rentabilidad es vulnerable.`;
        eff_desc = `FACTOR OPERATIVO: Gastas ${factorX}x de tus ingresos. Estás en zona de fatiga.`;
        
        premiumHeadline = `$${Math.round(total_costs * 0.15 * 12).toLocaleString('en-US')} USD Recuperables`;
        premiumHook = `Estás trabajando con un margen operativo ajustado. El reporte premium revela cómo optimizar costos y proteger tu utilidad.`;
    } 
    else { 
        riskLevel = "LOW"; // Activa VERDE en Lovable
        headline = "AUDITORÍA: ESTADO OPTIMIZADO";
        argument = `${scopeNote} Control ejemplar de gastos variables (${expense_ratio}%). Tienes la solvencia necesaria para cubrir costos fijos de propiedad con facilidad.`;
        eff_desc = `FACTOR DE ÉXITO: Tu gasto es de solo ${factorX}x. Máxima eficiencia operativa detectada.`;
        
        premiumHeadline = `$${Math.round(input.gross_income * 0.12 * 12).toLocaleString('en-US')} USD de Potencial`;
        premiumHook = `Eres un host eficiente. Tu siguiente paso es el Revenue Management dinámico para maximizar ingresos sin elevar costos.`;
    }

    return {
      meta: {
        email: formData.email || "malenasoloads@gmail.com",
        premium_locked: true,
        premium_cta: net_income <= 0 ? "Detener Pérdida de Dinero" : "Revelar Plan de Acción"
      },
      input_summary: {
        financials: { total_costs: total_costs, gross_income: input.gross_income }
      },
      free: {
        headline: headline,
        risk_level: riskLevel, // Variable clave para Lovable
        intro: argument,
        user_summary: {
          property_name: input.property_name,
          location: input.country ? `${input.city}, ${input.country}` : input.city,
          gross_income: input.gross_income,
          capacity: `${formData.Max_guest || 0} pax · ${formData.bedrooms || 0} hab · ${formData.bathrooms || 0} baños`,
          activity: `${input.occupied_nights} noches de ${input.available_nights} registradas`
        },
        efficiency_challenge: { title: "INDICADOR DE EFICIENCIA", description: eff_desc },
        metrics: {
          net_income: Math.round(net_income),
          avg_nightly_income: Math.round(avg_price),
          break_even_nights: Math.ceil(break_even_nights),
          margin_of_safety: Math.round(margin_of_safety),
          expense_ratio: expense_ratio
        }
      },
      premium: {
        savings_opportunity: premiumHeadline,
        hook_text: premiumHook
      }
    };
  };

  // 2. DISPARO DEL WEBHOOK A N8N ÚNICAMENTE EN PASO 4 (CTA FINAL) EN FORMATO URL-ENCODED
  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

    // El webhook a N8N se dispara única y exclusivamente en el Paso 3 (Email)
    if (currentStep !== 3) {
      nextStep();
      return;
    }

    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      showValidation('Ingresa tu correo electrónico para recibir el diagnóstico.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailTrimmed)) {
      showValidation('El correo ingresado no parece válido. Revisa el formato (ej. tu@email.com).');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const finalEmail = emailTrimmed;

    // Construcción del Payload Plano unificado y estricto
    const payload: Record<string, any> = {
      property_name: String(formData.property_name),
      country: String(formData.country || 'España'),
      city: String(formData.city || 'Madrid'),
      property_type: String(formData.property_type),
      market_type: String(formData.market_type || ''),
      Max_guest: Math.round(Number(formData.max_guests)),
      max_guests: Math.round(Number(formData.max_guests)),
      bedrooms: Math.round(Number(formData.bedrooms)),
      bathrooms: Math.round(Number(formData.bathrooms)),
      occupied_nights: Math.round(Number(formData.occupied_nights)),
      available_nights: Math.round(Number(formData.available_nights)),
      gross_income: Math.round(Number(formData.gross_income)),
      platfom_commission: 0,
      cleaning_cost: 0,
      services_cost: 0,
      maintenence_cost: 0,
      tax_cost: 0,
      Hidden_cost: Math.round(Number(formData.approximate_expenses || 1400)),
      competitive_adr: formData.competitive_adr !== '' ? Number(formData.competitive_adr) : '',
      stability_perception: String(formData.stability_perception),
      risk_perception: String(formData.risk_perception),
      no_major_risk: String(formData.no_major_risk),
      email: String(finalEmail)
    };

    console.log("PAYLOAD WEBHOOK ENVIADO A N8N DESDE PASO 4 (URL-ENCODED):", payload);

    try {
      // Transformamos el objeto plano en parámetros URL (urlencoded) para que N8N lo parsee de forma nativa en modo no-cors
      const searchParamsPayload = new URLSearchParams();
      Object.keys(payload).forEach(key => {
        searchParamsPayload.append(key, String(payload[key]));
      });

      // Avanzamos el paso y mostramos el estado de carga del reporte
      setCurrentStep(4);
      setIsFetchingReport(true);
      const submitTime = new Date(Date.now() - 30000).toISOString(); // 30s buffer for safety

      // Petición robusta con mode: 'no-cors' y content-type urlencoded
      await fetch("https://n8n.propiqdata.com/webhook/risk-radar-v3", {
        method: "POST",
        mode: 'no-cors',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: searchParamsPayload.toString()
      });

      console.log("Datos enviados con éxito en formato parseable. Consultando Supabase para reporte N8N...");
      
      let fetchedData = null;
      if (supabaseClient) {
        // Hacemos polling de hasta 4 intentos con un retardo de 2 segundos entre cada uno
        for (let attempt = 0; attempt < 4; attempt++) {
          console.log(`Intentando consultar Supabase (intento ${attempt + 1})...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data, error: sbError } = await supabaseClient
            .from('reports')
            .select('*')
            .eq('email', finalEmail)
            .order('created_at', { ascending: false })
            .limit(1)
            .single() as any;

          if (data && data.created_at && data.created_at >= submitTime) {
            let parsedObj = { ...data };
            try {
              if (parsedObj.report_data) {
                let raw = parsedObj.report_data;
                if (typeof raw === 'string') raw = JSON.parse(raw);
                if (typeof raw === 'string') raw = JSON.parse(raw);
                if (raw && raw.report_data && !raw.free) {
                  raw = raw.report_data;
                }
                parsedObj.report_data = raw;
              }
            } catch (e) {
              console.error('Error parsing report_data:', e);
            }
            fetchedData = parsedObj;
            console.log("Reporte obtenido exitosamente de Supabase:", fetchedData);
            break; // Salir del bucle si encontramos el reporte
          }
        }
      }

      if (fetchedData) {
        setN8nReport(fetchedData);

        // Enriquecer columnas planas para nurturing (riesgo, profit, perdida_potencial)
        if (supabaseClient && fetchedData.id) {
          const rd = fetchedData.report_data || {};
          const rawLevel: string = rd?.cabecera?.risk_level || rd?.free?.risk_level || '';
          const up = rawLevel.toUpperCase();
          const riesgoVal = (up === 'HIGH' || up.includes('CRÍTICO') || up.includes('CRITICO'))
            ? 'CRÍTICO'
            : (up === 'MEDIUM' || up.includes('VULNERABLE'))
              ? 'VULNERABLE'
              : 'SALUDABLE';
          const profitVal = rd?.free?.metrics?.net_income ?? null;
          const leaksTotalSB = Number(rd?.leak_analysis?.total_recoverable_monthly ?? 0);
          const ppSB = rd?.posicionamiento_precio;
          const pricingBonusSB = (ppSB?.disponible && ppSB?.estado === 'BAJO_MERCADO') ? Number(ppSB?.potencial_mensual || 0) : 0;
          const potencialVal = (leaksTotalSB + pricingBonusSB) > 0 ? (leaksTotalSB + pricingBonusSB) : (rd?.free?.hero_mensual ?? null);
          supabaseClient.from('reports').update({
            riesgo: riesgoVal,
            profit: profitVal,
            perdida_potencial: potencialVal,
            status: 'analyzed',
          }).eq('id', fetchedData.id).neq('status', 'confirmed').then(() => {});

          // Enviar email de nurturing (fire-and-forget, no bloquea el flujo)
          const scoreVal = rd?.free?.score ?? rd?.cabecera?.score ?? 0;
          fetch('/api/send-lead-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: finalEmail,
              property_name: String(formData.property_name),
              estado: riesgoVal,
              hero_mensual: potencialVal ?? 0,
              score: scoreVal,
            }),
          }).catch(() => {});
        }
      }
      
    } catch (error: any) {
      console.error("ERROR EN EL ENVÍO A N8N:", error);
      // Fallback de éxito incluso ante fallos silenciosos para no congelar la pantalla local
      console.log("Activando bypass visual ante error para evitar bucle de carga infinito.");
    } finally {
      setIsSubmitting(false);
      setIsFetchingReport(false);
    }
  };

  const results = calculateResults();

  // Dynamic calculations for Step 5 using the local variables suggested and N8N overrides
  const reportDataObj = n8nReport?.report_data || {};
  const n8nFree = reportDataObj?.free || n8nReport?.free || {};
  const n8nMetrics = n8nFree?.metrics || {};

  const hasN8nData = !!n8nReport;

  const commissionVal = hasN8nData 
    ? Number(n8nMetrics?.platfom_commission || reportDataObj?.platfom_commission || formData.platfom_commission || 450)
    : Number(formData.platfom_commission || 450);
  const cleaningVal = hasN8nData
    ? Number(n8nMetrics?.cleaning_cost || reportDataObj?.cleaning_cost || formData.cleaning_cost || 300)
    : Number(formData.cleaning_cost || 300);
  const servicesVal = hasN8nData
    ? Number(n8nMetrics?.services_cost || reportDataObj?.services_cost || formData.services_cost || 200)
    : Number(formData.services_cost || 200);
  const maintenanceVal = hasN8nData
    ? Number(n8nMetrics?.maintenence_cost || reportDataObj?.maintenence_cost || formData.maintenence_cost || 150)
    : Number(formData.maintenence_cost || 150);
  const taxVal = hasN8nData
    ? Number(n8nMetrics?.tax_cost || reportDataObj?.tax_cost || formData.tax_cost || 250)
    : Number(formData.tax_cost || 250);
  const hiddenVal = hasN8nData
    ? Number(n8nMetrics?.Hidden_cost || reportDataObj?.Hidden_cost || formData.Hidden_cost || 50)
    : Number(formData.Hidden_cost || 50);

  const totalCostsVal = commissionVal + cleaningVal + servicesVal + maintenanceVal + taxVal + hiddenVal;

  const rawRev = hasN8nData
    ? Number(n8nMetrics?.gross_income || reportDataObj?.user_summary?.gross_income || formData.gross_income || 2100)
    : Number(formData.gross_income || 2100);

  const activeOccupiedNights = (() => {
    const reportData = n8nReport?.report_data || n8nReport;
    const activity = reportData?.free?.user_summary?.activity;
    if (typeof activity === 'string') {
      const match = activity.match(/^(\d+)/);
      if (match) return Number(match[1]);
    }
    return Number(formData.occupied_nights || 17);
  })();

  const activeAvailableNights = (() => {
    const reportData = n8nReport?.report_data || n8nReport;
    const activity = reportData?.free?.user_summary?.activity;
    if (typeof activity === 'string' && activity.includes(" de ")) {
      const parts = activity.split(" de ");
      if (parts[1]) {
        const match = parts[1].match(/^(\d+)/);
        if (match) return Number(match[1]);
      }
    }
    return Number(formData.available_nights || 30);
  })();

  const occupationPct = Math.round((activeOccupiedNights / (activeAvailableNights || 30)) * 100);

  const statusFromUrl = searchParams.get('status');

  // Status mapping logic (Priority to URL param, otherwise DB/local value)
  let riskLevel = 'MEDIUM';
  if (statusFromUrl === 'saludable') {
    riskLevel = 'LOW';
  } else if (statusFromUrl === 'vulnerable' || statusFromUrl === 'medium' || statusFromUrl === 'tenso') {
    riskLevel = 'MEDIUM';
  } else if (statusFromUrl === 'critico' || statusFromUrl === 'critica' || statusFromUrl === 'critical' || statusFromUrl === 'high') {
    riskLevel = 'HIGH';
  } else {
    const riskRaw = (hasN8nData ? ((n8nReport?.report_data || n8nReport)?.cabecera?.risk_level || 'MEDIUM') : (results.free.risk_level || 'MEDIUM')).toString().toLowerCase();
    riskLevel = riskRaw.includes('low') || riskRaw.includes('bajo') || riskRaw.includes('optimo') || riskRaw.includes('optimizado') || riskRaw.includes('estable')
      ? 'LOW' 
      : riskRaw.includes('high') || riskRaw.includes('alto') || riskRaw.includes('critico') || riskRaw.includes('crítico')
        ? 'HIGH' 
        : 'MEDIUM';
  }

  const isMedium = riskLevel === 'MEDIUM';
  const isHigh = riskLevel === 'HIGH';
  const isLow = riskLevel === 'LOW';

  const accentColor = isHigh ? '#FF2D2D' : isMedium ? '#FFB800' : '#00B894';
  const accentText = isHigh ? 'text-[#FF2D2D]' : isMedium ? 'text-[#FFB800]' : 'text-[#00B894]';
  const glowColor = isHigh ? 'rgba(255, 45, 45, 0.4)' : isMedium ? 'rgba(255, 184, 0, 0.4)' : 'rgba(0, 184, 148, 0.4)';

  let breakEvenNoches = hasN8nData
    ? Number(n8nMetrics?.break_even_nights || 0)
    : (results.free.metrics.break_even_nights || 10);

  let activeBreakEven = breakEvenNoches;
  let activeNetIncome = Number(n8nMetrics?.net_income ?? (Number(formData.gross_income || 3000) - totalCostsVal));

  if (statusFromUrl && !hasN8nData) {
    if (statusFromUrl === 'saludable') {
      activeBreakEven = 14;
      activeNetIncome = 1600;
    } else if (statusFromUrl === 'vulnerable' || statusFromUrl === 'medium' || statusFromUrl === 'tenso') {
      activeBreakEven = 8;
      activeNetIncome = -1600;
    } else if (statusFromUrl === 'critico' || statusFromUrl === 'critica' || statusFromUrl === 'critical' || statusFromUrl === 'high') {
      activeBreakEven = 29;
      activeNetIncome = -4500;
    }
  }

  const calculatedData = {
    ahorroLimpieza: hasN8nData
      ? (Number(reportDataObj.oportunidades_rentabilidad?.ranking?.find((r: any) => String(r.tipo || r.pilar || '').toLowerCase().includes('limpieza'))?.impacto_mensual) || 0)
      : Math.round(cleaningVal * 0.25) || 75,
    porcentajeOta: hasN8nData
      ? (reportDataObj.radar_fugas?.tus_costos_pct?.[0] || 0)
      : Math.round((commissionVal / (rawRev || 1)) * 100) || 15,
    fugaComisiones: hasN8nData
      ? (Number(reportDataObj.oportunidades_rentabilidad?.ranking?.find((r: any) => String(r.tipo || r.pilar || '').toLowerCase().includes('comisiones'))?.impacto_mensual) || 0)
      : Math.round(commissionVal * 0.35) || 150,
    excesoServicios: hasN8nData
      ? (reportDataObj.radar_fugas?.tus_costos_pct?.[2] || 0)
      : Math.round((servicesVal / (totalCostsVal || 1)) * 100) || 12,
    recuperacionAnual: hasN8nData
      ? (reportDataObj.oportunidades_rentabilidad?.oportunidad_total_anual || n8nFree?.hero_anual || 0)
      : Math.round((cleaningVal * 0.25 + commissionVal * 0.35 + servicesVal * 0.15) * 12) || 3096,
    percentilActual: hasN8nData
      ? (reportDataObj.oportunidades_rentabilidad?.principal?.score_actual || (isLow ? 72 : isMedium ? 40 : 15))
      : (isLow ? 72 : isMedium ? 40 : 15),
    percentilObjetivo: hasN8nData
      ? (reportDataObj.oportunidades_rentabilidad?.principal?.score_maximo || (isLow ? 90 : isMedium ? 78 : 65))
      : (isLow ? 90 : isMedium ? 78 : 65),
    userOccupancy: hasN8nData
      ? (reportDataObj.oportunidades_rentabilidad?.ocupacion_actual || n8nMetrics?.ocupacion_pct || n8nMetrics?.occupancy_pct || 0)
      : Math.round(occupationPct)
  };

  const productionJson = {
    meta: {
      email: "malenasoloads@gmail.com",
      premium_locked: false,
      premium_cta: "Exportar Reporte a PDF"
    },
    estado: "TENSO",
    opportunity_engine: {
      total_potential_monthly: 808,
      total_potential_annual: 9696,
      distribution: {
        commercial_growth: {
          pct: 53,
          label: "Crecimiento Comercial (Ocupación + Pricing)",
          amount_annual: 5136,
          amount_monthly: 428
        },
        operational_efficiency: {
          pct: 47,
          label: "Eficiencia Operativa (Fugas Confirmadas)",
          amount_annual: 4560,
          amount_monthly: 380
        }
      }
    },
    free: {
      risk_level: "TENSO",
      noches_restantes: 11,
      impact_text: `Podrías estar rescatando hasta <span class="text-[#00D1B2] font-extrabold">$808 USD</span> al mes (o <span class="text-[#00D1B2] font-extrabold">$9,696 USD</span> al año) con el plan de acción si nivelas tu ocupación a la Zona Óptima de Rentabilidad (60% del mercado).`,
      hero_titulo: "Potencial Económico Identificado",
      hero_anual: 9696,
      hero_mensual: 808,
      hero_descripcion: "AIRLOCAL detectó fugas y brechas que limitan tu potencial.",
      user_summary: {
        property_name: formData.property_name || "Domingo",
        location: formData.country ? `${formData.city}, ${formData.country}` : "Dar Es Salam, TZ",
        gross_income: Number(formData.gross_income) || 3000,
        capacity: `${formData.Max_guest || 2} huéspedes · ${formData.bedrooms || 1} hab · ${formData.bathrooms || 1} baños`,
        activity: `${formData.occupied_nights || 20} noches vendidas este mes`
      },
      metrics: {
        net_income: Number(formData.gross_income || 3000) - totalCostsVal,
        avg_nightly_income: formData.occupied_nights > 0 ? Math.round(Number(formData.gross_income) / Number(formData.occupied_nights)) : 150,
        break_even_nights: breakEvenNoches,
        margin_of_safety: formData.occupied_nights - breakEvenNoches > 0 ? formData.occupied_nights - breakEvenNoches : 11,
        expense_ratio: totalCostsVal > 0 && Number(formData.gross_income) > 0 ? Math.round((totalCostsVal / Number(formData.gross_income)) * 100) : 47,
        base_cost_per_night: Math.round(totalCostsVal / 30) || 47
      }
    },
    simulador: {
      prioridad_1: {
        categoria: "Ocupación",
        impacto_mensual: 747,
        descripcion: "Te faltan 8 noches para alcanzar la ocupación objetivo."
      },
      prioridad_2: {
        categoria: "Servicios",
        impacto_mensual: 350,
        descripcion: "Tus gastos en servicios están muy por encima del benchmark."
      }
    },
    tacometro: {
      score: Math.max(10, 100 - (totalCostsVal > 0 && Number(formData.gross_income) > 0 ? Math.round((totalCostsVal / Number(formData.gross_income)) * 100) : 47)),
      score_final: Math.max(10, 100 - (totalCostsVal > 0 && Number(formData.gross_income) > 0 ? Math.round((totalCostsVal / Number(formData.gross_income)) * 100) : 47)),
      simulador_what_if: {
        escenario_precio: `Si subes $10 USD la noche y tu ocupación baja un 5%, tu ganancia neta mensual sube +$40 USD. Tu nuevo punto de equilibrio baja a ${Math.max(1, breakEvenNoches - 1)} noches.`,
        escenario_limpieza: `Si recortas el sobregasto detectado en limpieza frente al promedio de ${formData.city || "tu ciudad"}, liberas de inmediato +$${Math.round(cleaningVal * 0.15)} USD al mes de pura utilidad libre.`
      }
    },
    what_if: {
      prices: {
        diagnostic_label: "[Diagnóstico: Elasticidad Tarifaria]",
        description: `Si subes $10 USD la noche y tu ocupación baja un 5%, tu ganancia neta mensual sube +$40 USD. Tu nuevo punto de equilibrio baja a ${Math.max(1, breakEvenNoches - 1)} noches.`,
        net_gain_usd: "+$40 USD",
        new_break_even: Math.max(1, breakEvenNoches - 1)
      },
      tarjeta_2: {
        icon: "🧼",
        category_name: "LIMPIEZA",
        diagnostic_label: "[Diagnóstico: Desviación de Costo de Salida]",
        description: `Si recortas el sobregasto detectado en limpieza frente al promedio de ${formData.city || "tu ciudad"}, liberas de inmediato +$${Math.round(cleaningVal * 0.15)} USD al mes de pura utilidad libre.`,
        freed_cash_usd: `+$${Math.round(cleaningVal * 0.15)} USD`
      }
    },
    seccion_percepcion: {
      tiempo: {
        titulo: "Tu Tiempo Disponible",
        diagnostico: `Pasas horas controlando la unidad de ${formData.bedrooms || 1} habs. Automatizar la coordinación del equipo te devolverá la tranquilidad.`
      },
      precio: {
        titulo: "Tu Estrategia de Precios",
        diagnostico: `Tus noches se venden a un promedio de $${formData.occupied_nights > 0 ? Math.round(Number(formData.gross_income) / Number(formData.occupied_nights)) : 150} USD. Hay espacio para optimizar tu tarifa según la temporada.`
      },
      control: {
        titulo: "Tu Nivel de Control",
        diagnostico: `Tu nivel de gastos representa el ${totalCostsVal > 0 && Number(formData.gross_income) > 0 ? Math.round((totalCostsVal / Number(formData.gross_income)) * 100) : 47}% de tus ingresos. Este reporte te da la visibilidad exacta que necesitas.`
      }
    },
    radar_fugas: {
      labels: ["Comisiones", "Limpieza", "Servicios", "Mantenimiento", "Impuestos", "Otros"],
      tus_costos_pct: [
        Math.round((commissionVal / (rawRev || 1)) * 100) || 32,
        Math.round((cleaningVal / (rawRev || 1)) * 100) || 21,
        Math.round((servicesVal / (rawRev || 1)) * 100) || 47,
        Math.round((maintenanceVal / (rawRev || 1)) * 100) || 11,
        Math.round((taxVal / (rawRev || 1)) * 100) || 18,
        Math.round((hiddenVal / (rawRev || 1)) * 100) || 4
      ],
      benchmark_ideal_pct: [12, 20, 12, 5, 43, 5],
      detalles: {
        comision: { "monto": commissionVal, "nota": "Comisiones altas. Te conviene diversificar tus anuncios." },
        limpieza: { "monto": cleaningVal, "nota": "Revisa los turnos del equipo. Hay margen para optimizar la tarifa por salida." },
        servicios: { "monto": servicesVal, "nota": "Consumos estacionales inflados. Se puede mitigar el impacto fácilmente." },
        mantenimiento: { "monto": maintenanceVal, "nota": "Crea un fondo fijo mensual pequeño para evitar reparaciones de emergencia." }
      }
    },
    plan_accion_inteligente: {
      paso_1: {
        "titulo": "PASO 1: Impacto Inmediato (Días 1-30)",
        "hacer": "Estás pagando montos considerables en comisiones de plataformas. Potencia tu base de clientes recurrentes para ahorrarte las comisiones de las plataformas.",
        "beneficio": "+$528 USD / mes"
      },
      paso_2: {
        "titulo": "PASO 2: Corrección Estratégica (Días 31-60)",
        "hacer": "Tu costo de limpieza está absorbiendo demasiado margen en tu ciudad. Sincroniza tus calendarios de limpieza para evitar pagar horas extra innecesarias entre reservas.",
        "beneficio": "+$180 USD / mes"
      },
      paso_3: {
        "titulo": "PASO 3: Control Pasivo Continuo (Días 61-90)",
        "hacer": `Detectamos espacio de optimización en servicios públicos para una unidad de ${formData.bedrooms || 1} habs. Establece un límite de uso en los aires acondicionados mediante normas claras en la casa.`,
        "beneficio": "+$100 USD / mes"
      },
      resumen_anual: {
        "titulo": "Potencial Total de Recuperación",
        "hacer": `Implementando este mapa de ruta personalizado para ${formData.property_name || "tu propiedad"}, el motor de AIRLOCAL proyecta una recuperación de capital anualizada limpia para tu operación.`,
        "beneficio": "+$9,696 USD / año"
      }
    },
    oportunidades_rentabilidad: {
      principal_limitante: "fugas",
      occupancy_target: 65,
      ocupacion_actual: 33,
      adr_actual: 150,
      equivalente_noches: 11,
      impacto_mensual: 580,
      impacto_anual: 6960,
      noches_faltantes: 8,
      oportunidad: {
        titulo: "Optimizar Comisiones y Limpieza",
        descripcion: "Reduciendo la desviación detectada en comisiones de plataformas y optimizando los turnos de limpieza puedes recuperar flujo de caja.",
        valor_principal: 580,
        unidad: "USD/MES"
      },
      principal: {
        categoria: "Eficiencia de Costos",
        descripcion: "Las fugas operativas acumuladas representan la mayor desviación frente al benchmark de rentabilidad de tu zona.",
        que_intervenir: "Optimizar comisiones de OTA, renegociar tarifas de limpieza y regular consumos de climatización.",
        what_if: "Si reduces comisiones a la mitad y recortas 15% en limpieza, recuperarías $580 mensuales.",
        impacto_mensual: 580,
        impacto_anual: 6960
      },
      terciaria: {
        categoria: "Mantenimiento",
        impacto_mensual: 25,
        descripcion: "Tu gasto de mantenimiento supera el benchmark esperado."
      },
      lanes: [
        {
          categoria: "Comisiones",
          impacto_mensual: 300,
          accion: "Reducir el canal intermediado.",
          que_intervenir: "Incrementar la reserva directa para reducir la dependencia de comisiones de OTAs."
        },
        {
          categoria: "Limpieza",
          impacto_mensual: 180,
          accion: "Optimizar turnos.",
          que_intervenir: "Agrupar salidas y coordinar turnos del personal para evitar recargos."
        },
        {
          categoria: "Servicios Públicos",
          impacto_mensual: 100,
          accion: "Regular consumos.",
          que_intervenir: "Instalar termostatos inteligentes y sensores de presencia."
        }
      ]
    },
    cazafugas: {
      resumen: "Identificamos 3 pilares sólidos y 1 área con potencial de optimización.",
      conclusion: {
        tipo: "sin_fugas",
        titulo: "Estado de Fugas Operativas",
        mensaje: "El benchmark confirma que la estructura de costos no presenta desviaciones relevantes. La oportunidad económica detectada proviene de crecimiento comercial y no de eficiencia operativa.",
        subtitulo: "Todos los rubros evaluados están dentro del rango esperado."
      },
      leak_analysis_contexto: {
        contribucion: "0 fugas detectadas. El potencial identificado proviene principalmente de crecimiento comercial y optimización estratégica."
      },
      fortalezas: [
        {
          nombre: "Ocupación",
          pilar: "Ocupación",
          score: "25 / 25",
          estado: "SALUDABLE",
          metrica: "57% vs 50% objetivo"
        },
        {
          nombre: "Colchón Operativo",
          pilar: "Colchón Operativo",
          score: "15 / 15",
          estado: "SALUDABLE",
          metrica: "9 noches vs 6 noches ideal"
        },
        {
          nombre: "Rentabilidad Neta",
          pilar: "Rentabilidad Neta",
          score: "20 / 20",
          estado: "SALUDABLE",
          metrica: "53% vs 45% objetivo"
        }
      ],
      areas_atencion: [
        {
          nombre: "Eficiencia Operativa",
          pilar: "Eficiencia Operativa",
          score: "29.5 / 40",
          estado: "ATENCIÓN",
          metrica: "47% expense ratio vs 40% ideal",
          gap: "10.5",
          impacto: "Existe margen de mejora en eficiencia operativa, aunque no se detectan fugas recuperables frente al benchmark.",
          texto_impacto: "Existe margen de mejora en eficiencia operativa, aunque no se detectan fugas recuperables frente al benchmark."
        }
      ]
    },
    estratega: {
      titulo: "PRIORIDADES OPERATIVAS",
      introduccion: "Evaluamos los pilares que determinan la salud de tu operación para priorizar las intervenciones con mayor impacto económico.",
      intervenciones: [
        {
          prioridad: "Prioridad 1",
          categoria: "Comisiones",
          que_intervenir: "Desviar reservas de plataformas a tu canal directo propio.",
          metrica: `${Math.round(commissionVal || 800)} USD gastados en comisiones vs 15% ideal`,
          what_if: "Si desvías el 20% de las reservas a canal directo, reducirás la dependencia de OTAs.",
          impacto_mensual: Math.round((commissionVal || 800) * 0.2),
          impacto_anual: Math.round((commissionVal || 800) * 0.2) * 12
        },
        {
          prioridad: "Prioridad 2",
          categoria: "Limpieza",
          que_intervenir: "Coordinar turnos del personal y optimizar procesos de lavandería.",
          metrica: `${Math.round(cleaningVal || 500)} USD gastados en limpieza vs benchmark de la ciudad`,
          what_if: "Si logras agrupamientos eficientes y evitas horas extra, capturarás $180 adicionales.",
          impacto_mensual: 180,
          impacto_anual: 180 * 12
        },
        {
          prioridad: "Prioridad 3",
          categoria: "Servicios Públicos",
          que_intervenir: "Instalar termostatos inteligentes y sensores de presencia en climatización.",
          metrica: `${Math.round(servicesVal || 350)} USD gastados en energía para unidad de 1 habs`,
          what_if: "Si regulas el apagado automático tras el check-out, optimizarás $100 al mes.",
          impacto_mensual: 100,
          impacto_anual: 100 * 12
        }
      ],
      resumen_operativo: {
        total_frentes: 3,
        impacto_total_mensual: Math.round((commissionVal || 800) * 0.2) + 180 + 100,
        impacto_total_anual: (Math.round((commissionVal || 800) * 0.2) + 180 + 100) * 12,
        impacto_mensual_total: Math.round((commissionVal || 800) * 0.2) + 180 + 100,
        impacto_anual_total: (Math.round((commissionVal || 800) * 0.2) + 180 + 100) * 12,
        recomendacion: "Concentra el esfuerzo inicial en desviar reservas recurrentes a tu canal propio y estandarizar reglas de uso de aire acondicionado."
      }
    },
    guardian_conclusion: {
      kpis: {
        impacto_mensual_detectado: 808,
        impacto_anual_detectado: 9696
      },
      nota_transicion: "La auditoría del Cazafugas refinó la estimación inicial y confirmó un potencial recuperable de +$808 USD/mes. A partir de este punto, el reporte utiliza este valor confirmado.",
      puente: "El Cazafugas mostrará exactamente qué rubros presionan tu rentabilidad y El Estratega ordenará las acciones por impacto económico."
    }
  };

  const activeReport = n8nReport?.report_data || n8nReport || productionJson;
  const optRentabilidad = activeReport.oportunidades_rentabilidad || productionJson.oportunidades_rentabilidad;
  const principalLimitante = optRentabilidad.principal_limitante || "fugas";
  const whatIf = activeReport.what_if || activeReport.tacometro?.simulador_what_if || productionJson.what_if || productionJson.tacometro.simulador_what_if;
  const percepcion = activeReport.seccion_percepcion || productionJson.seccion_percepcion;
  const radar = activeReport.radar_fugas || productionJson.radar_fugas;
  const leakRadar = (activeReport.leak_analysis || {})?.radar || {};
  const planAccion = activeReport.plan_accion_inteligente || productionJson.plan_accion_inteligente;
  const cazafugas = activeReport.cazafugas || productionJson.cazafugas;
  const estratega = activeReport.estratega || productionJson.estratega || {};
  const intervenciones = estratega.intervenciones || [];
  const mainIntervention = intervenciones[0] || {};
  const secondaryInterventions = intervenciones.slice(1);

  const principal = optRentabilidad?.principal || {};
  const principalImpactoMensual = principal?.impacto_mensual || optRentabilidad?.impacto_mensual || 0;
  const principalImpactoAnual = principal?.impacto_anual || optRentabilidad?.impacto_anual || 0;

  const lanes = optRentabilidad.lanes || [];
  const normalizedLanes = lanes.map((lane: any, idx: number) => {
    if (typeof lane === 'object' && lane !== null) {
      return {
        categoria: lane.categoria || `Acción ${idx + 1}`,
        impacto_mensual: lane.impacto_mensual || 0,
        accion: lane.accion || '',
        que_intervenir: lane.que_intervenir || ''
      };
    }
    return {
      categoria: String(lane),
      impacto_mensual: 0,
      accion: '',
      que_intervenir: ''
    };
  });

  const getLaneIcon = (categoria: string) => {
    const norm = String(categoria).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (norm.includes("ocupacion")) return "📈";
    if (norm.includes("visibilidad")) return "👁️";
    if (norm.includes("pricing") || norm.includes("precio")) return "💵";
    if (norm.includes("comision")) return "📈";
    if (norm.includes("limpieza")) return "🧼";
    if (norm.includes("servicio")) return "🔌";
    if (norm.includes("mantenimiento")) return "🛠️";
    return "⚡";
  };

  const getBenchmarkText = (categoria: string) => {
    const normCat = String(categoria).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (normCat.includes("ocupacion")) {
      return `${optRentabilidad.ocupacion_actual || 33}% actual vs ${optRentabilidad.occupancy_target || 65}% objetivo`;
    }
    // Find index in radar labels
    const labelIndex = radar.labels.findIndex((l: string) => 
      l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normCat)
    );
    if (labelIndex !== -1) {
      const actual = radar.tus_costos_pct[labelIndex] ?? 0;
      const ideal = radar.benchmark_ideal_pct[labelIndex] ?? 0;
      return `${actual}% actual vs ${ideal}% benchmark`;
    }
    return "";
  };

  const sim = activeReport.simulador || productionJson.simulador || {};
  const priority1 = sim.prioridad_1 || {};
  const priority2 = sim.prioridad_2 || {};
  const tertiary = optRentabilidad.terciaria || {};

  const simulatorCards = [
    {
      categoria: priority1.categoria || "Ocupación",
      impacto_mensual: priority1.impacto_mensual != null ? priority1.impacto_mensual : 747,
      descripcion: priority1.descripcion || priority1.accion || "Te faltan 8 noches para alcanzar la ocupación objetivo."
    },
    {
      categoria: priority2.categoria || "Servicios",
      impacto_mensual: priority2.impacto_mensual != null ? priority2.impacto_mensual : 350,
      descripcion: priority2.descripcion || priority2.accion || "Tus gastos en servicios están muy por encima del benchmark."
    },
    {
      categoria: tertiary.categoria || "Mantenimiento",
      impacto_mensual: tertiary.impacto_mensual != null ? tertiary.impacto_mensual : 25,
      descripcion: tertiary.descripcion || tertiary.accion || "Tu gasto de mantenimiento supera el benchmark esperado."
    }
  ];

  const dynamicBrechaTitle = riskLevel === "HIGH" 
    ? "Brecha Operativa Detectada" 
    : riskLevel === "MEDIUM" 
      ? "Oportunidad de Crecimiento Detectada" 
      : "Potencial de Expansión Detectado";

  const stepList = lanes.length > 0
    ? lanes.map((lane: any, idx: number) => {
        const laneKey = typeof lane === 'object' && lane !== null ? lane.categoria : String(lane);
        const step = (planAccion as any)[laneKey] || (planAccion as any)[`paso_${idx + 1}`];
        if (!step) return null;
        return {
          titulo: step.titulo || `PASO ${idx + 1}: ${laneKey.toUpperCase()}`,
          hacer: step.hacer,
          beneficio: step.beneficio
        };
      }).filter(Boolean)
    : [planAccion.paso_1, planAccion.paso_2, planAccion.paso_3].filter(Boolean);

  // Cálculos globales para la jerarquía de categorías y fugas (Mapeo dinámico de n8n)
  const rankedCategories = radar.labels.map((label: string, idx: number) => {
    const userCost = Number(radar.tus_costos_pct[idx] || 0);
    const idealCost = Number(radar.benchmark_ideal_pct[idx] || 0);
    const gap = userCost - idealCost;

    const getDetailKey = (lbl: string): string => {
      const normalized = lbl.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes("comision")) return "comision";
      if (normalized.includes("limpieza")) return "limpieza";
      if (normalized.includes("servicio")) return "servicios";
      if (normalized.includes("mantenimiento")) return "mantenimiento";
      if (normalized.includes("impuesto")) return "impuestos";
      return normalized;
    };

    const detailKey = getDetailKey(label);
    const detailObj = radar.detalles?.[detailKey];
    const rawRecommendation = detailObj?.nota || `Se detectó desviación en ${label}. Hay margen sustancial para optimizar.`;
    const recommendation = gap <= 0 
      ? "Tu nivel de gasto está en rangos saludables de eficiencia." 
      : rawRecommendation;

    const getDollarCost = (key: string): number => {
      if (key === 'comision') return commissionVal;
      if (key === 'limpieza') return cleaningVal;
      if (key === 'servicios') return servicesVal;
      if (key === 'mantenimiento') return maintenanceVal;
      if (key === 'impuestos') return taxVal;
      return hiddenVal;
    };
    const dollarCost = getDollarCost(detailKey);

    return {
      label,
      userCost,
      idealCost,
      gap,
      recommendation,
      dollarCost
    };
  }).sort((a: any, b: any) => b.gap - a.gap);

  const leaks = rankedCategories.filter((cat: any) => cat.gap > 0);
  const efficientRubros = rankedCategories.filter((cat: any) => cat.gap <= 0);

  const topLeak = leaks[0];
  const otherLeaks = leaks.slice(1, 3);
  const remainingOrEfficient = [...leaks.slice(3), ...efficientRubros];

  const painType = activeReport.seccion_percepcion?.tiempo?.diagnostico 
    ? 'tiempo' 
    : (activeReport.seccion_percepcion?.precio?.diagnostico 
        ? 'precio' 
        : 'control');
  
  const cardTitle = painType === 'tiempo'
    ? `¿Cuánto tiempo más vas a esclavizarte operando ${activeReport.free?.user_summary?.property_name || 'tu propiedad'}?`
    : painType === 'precio'
      ? `¿Dejarás que el miedo a perder huéspedes siga frenando los ingresos de ${activeReport.free?.user_summary?.property_name || 'tu unidad'}?`
      : `Gestionar ${activeReport.free?.user_summary?.property_name || 'tu propiedad'} en ${activeReport.free?.user_summary?.location || 'tu ciudad'} a ciegas te está costando dinero real.`;

  const cardPainText = painType === 'tiempo'
    ? "Confirmado: La gestión diaria te está robando la tranquilidad. Automatizar la coordinación de tu equipo y centralizar tus procesos te devolverá tus horas libres."
    : painType === 'precio'
      ? "El simulador predictivo ya demostró que proteger tu ADR estratégico genera más flujo de caja trabajando menos días. Es hora de dejar de regalar tu valor al mercado."
      : `Tus costos actuales se están devorando el ${activeReport.free?.metrics?.expense_ratio || 45}% de tus ingresos en ${activeReport.free?.user_summary?.location || 'tu ubicación'}. Mantener este control de forma manual es insostenible.`;

  const scoreFinal = Number(activeReport.tacometro?.score_final ?? 53);
  const cabeceraRiskLevel = riskLevel;
  const activeScore = scoreFinal;
  const activeExpenseRatio = Number(activeReport.free?.metrics?.expense_ratio ?? 47);
  // activeNetIncome is already declared and initialized above with overrides
  
  const nightsSold = (() => {
    const activityStr = activeReport.free?.user_summary?.activity || "";
    const match = activityStr.match(/^(\d+)\s+noches/i);
    if (match) return Number(match[1]);

    const explicitVal = activeReport.free?.user_summary?.nights_sold ?? 
                        activeReport.property?.nights_sold ?? 
                        activeReport.free?.metrics?.nights_sold;
    if (explicitVal !== undefined && explicitVal !== null) {
      return Number(explicitVal);
    }

    return Number(formData.occupied_nights || 20);
  })();

  // activeBreakEven is already declared and initialized above with overrides
  const activeMargin = Math.max(0, nightsSold - activeBreakEven);
  const activeMarginOfSafety = Number(activeReport.free?.metrics?.margin_of_safety ?? activeMargin ?? 11);
  const activeBaseCostPerNight = Number(
    activeReport.free?.metrics?.base_cost_per_night ?? 
    n8nReport?.free?.metrics?.base_cost_per_night ?? 
    n8nReport?.report_data?.free?.metrics?.base_cost_per_night ?? 
    (Math.round(totalCostsVal / 30) || 47)
  );

  const userLocation = activeReport.free?.user_summary?.location || (formData.country ? `${formData.city}, ${formData.country}` : "Dar Es Salam, TZ");
  const userPropertyName = activeReport.free?.user_summary?.property_name || formData.property_name || "Domingo";
  const cleanEscenarioLimpieza = (whatIf?.escenario_limpieza || "").replace(/\bccs\b/gi, userLocation);

  const avgNightly = formData.occupied_nights > 0 ? Math.round(Number(formData.gross_income) / Number(formData.occupied_nights)) : 150;
  const dynamicIncrease = Math.round(avgNightly * 0.1) || 10;
  const dynamicNewPrice = avgNightly + dynamicIncrease;
  const dynamicNewOccupied = Math.max(1, Math.round(formData.occupied_nights * 0.95));
  const dynamicGain = Math.max(20, Math.round((dynamicNewOccupied * dynamicNewPrice) - Number(formData.gross_income)) || 40);
  const dynamicBreakEven = Math.max(1, Math.ceil(totalCostsVal / dynamicNewPrice)) || Math.max(1, activeBreakEven - 1);
  
  const dynamicPricesDescription = `Si subes $${dynamicIncrease} USD la noche y tu ocupación baja un 5%, tu ganancia neta mensual sube +$${dynamicGain} USD. Tu nuevo punto de equilibrio baja a ${dynamicBreakEven} ${dynamicBreakEven === 1 ? 'noche' : 'noches'}.`;
  const dynamicPricesNetGainUsd = `+$${dynamicGain} USD`;

  const isOptimized = activeReport.estado === "OPTIMIZADO" || 
                      String(activeReport.free?.risk_level).toUpperCase() === "OPTIMIZADO" || 
                      String(activeReport.free?.risk_level).toUpperCase() === "LOW" ||
                      riskLevel === 'LOW';

  const resultTextColor = isOptimized ? 'text-emerald-400 font-extrabold drop-shadow-[0_0_12px_rgba(52,211,153,0.35)]' : 'text-[#10b981]';

  const whatIfPricesCurrentAdr = Number(activeReport.what_if?.prices?.current_adr ?? n8nReport?.what_if?.prices?.current_adr ?? n8nReport?.report_data?.what_if?.prices?.current_adr ?? avgNightly);
  const activeNetMarginPerNight = whatIfPricesCurrentAdr - activeBaseCostPerNight;

  const nochesOcupadas = nightsSold;
  const nochesVacias = Math.max(0, 30 - nightsSold);
  const potencialUsd = nochesVacias * activeNetMarginPerNight;

  const whatIfPricesDiagnosticLabel = activeReport.what_if?.prices?.diagnostic_label || n8nReport?.what_if?.prices?.diagnostic_label || n8nReport?.report_data?.what_if?.prices?.diagnostic_label || '[Diagnóstico: Elasticidad Tarifaria]';
  const whatIfPricesDescription = activeReport.what_if?.prices?.description || n8nReport?.what_if?.prices?.description || n8nReport?.report_data?.what_if?.prices?.description || dynamicPricesDescription;
  
  const parsedNetGainNumber = (() => {
    const rawVal = activeReport.what_if?.prices?.net_gain_usd ?? n8nReport?.what_if?.prices?.net_gain_usd ?? n8nReport?.report_data?.what_if?.prices?.net_gain_usd;
    if (rawVal === undefined || rawVal === null) return null;
    const num = Number(String(rawVal).replace(/[^0-9.-]/g, ""));
    return isNaN(num) ? null : num;
  })();

  const whatIfPricesNetGainUsd = (() => {
    const targetNightsToRescue = Math.max(1, Math.round((30 - (Number(formData.occupied_nights) || 20)) * 0.1)) || 1;
    const computedGain = activeNetMarginPerNight * targetNightsToRescue;
    
    if (parsedNetGainNumber !== null && parsedNetGainNumber >= activeNetMarginPerNight) {
      return `+$${parsedNetGainNumber} USD`;
    }
    
    return `+$${computedGain} USD`;
  })();

  const whatIfPricesNewBreakEven = Number(activeReport.what_if?.prices?.new_break_even ?? n8nReport?.what_if?.prices?.new_break_even ?? n8nReport?.report_data?.what_if?.prices?.new_break_even ?? dynamicBreakEven);
  const whatIfPricesTargetAdr = Number(activeReport.what_if?.prices?.target_adr ?? n8nReport?.what_if?.prices?.target_adr ?? n8nReport?.report_data?.what_if?.prices?.target_adr ?? (avgNightly + dynamicIncrease));

  // Calculate which category has the highest deviation (user cost % vs benchmark ideal %) dynamically in the frontend
  const selectedCategory = (() => {
    const userComisionPct = (radar.tus_costos_pct && radar.tus_costos_pct[0] !== undefined) ? radar.tus_costos_pct[0] : (Math.round((commissionVal / (rawRev || 1)) * 100) || 0);
    const userLimpiezaPct = (radar.tus_costos_pct && radar.tus_costos_pct[1] !== undefined) ? radar.tus_costos_pct[1] : (Math.round((cleaningVal / (rawRev || 1)) * 100) || 0);
    const userServiciosPct = (radar.tus_costos_pct && radar.tus_costos_pct[2] !== undefined) ? radar.tus_costos_pct[2] : (Math.round((servicesVal / (rawRev || 1)) * 100) || 0);
    const userMantenimientoPct = (radar.tus_costos_pct && radar.tus_costos_pct[3] !== undefined) ? radar.tus_costos_pct[3] : (Math.round((maintenanceVal / (rawRev || 1)) * 100) || 0);
    const userImpuestosPct = (radar.tus_costos_pct && radar.tus_costos_pct[4] !== undefined) ? radar.tus_costos_pct[4] : (Math.round((taxVal / (rawRev || 1)) * 100) || 0);
    const userOtrosPct = (radar.tus_costos_pct && radar.tus_costos_pct[5] !== undefined) ? radar.tus_costos_pct[5] : (Math.round((hiddenVal / (rawRev || 1)) * 100) || 0);

    const categories = [
      { id: "comisiones", name: "COMISIONES", icon: "📈", label: "[Diagnóstico: Fuga en Comisiones]", val: commissionVal, pct: userComisionPct, benchmark: 12, description: `Tus comisiones de plataformas superan considerablemente el ideal del 12%. Optimizando canales de venta directa y estrategias de reserva directa, podrías recortar esta fuga y liberar flujo de caja de inmediato.` },
      { id: "limpieza", name: "LIMPIEZA", icon: "🧼", label: "[Diagnóstico: Desviación de Costo de Salida]", val: cleaningVal, pct: userLimpiezaPct, benchmark: 20, description: `Si recortas el sobregasto detectado en limpieza frente al promedio de ${userLocation}, liberas de inmediato pura utilidad libre.` },
      { id: "servicios", name: "SERVICIOS", icon: "🔌", label: "[Diagnóstico: Consumos Ineficientes]", val: servicesVal, pct: userServiciosPct, benchmark: 12, description: `Detectamos consumos estacionales inflados de energía/servicios en tu unidad. Implementando normas claras de uso y controles inteligentes de climatización, rescatas de inmediato utilidad pura al mes.` },
      { id: "mantenimiento", name: "MANTENIMIENTO", icon: "🛠️", label: "[Diagnóstico: Reparaciones Reactivas]", val: maintenanceVal, pct: userMantenimientoPct, benchmark: 8, description: `Tus costos de reparaciones y mantenimiento superan la media recomendada. Crear un plan preventivo mensual para tu unidad evitará gastos reactivos y de emergencia.` },
      { id: "impuestos", name: "IMPUESTOS", icon: "🏦", label: "[Diagnóstico: Fatiga Fiscal]", val: taxVal, pct: userImpuestosPct, benchmark: 43, description: `El impacto de los impuestos locales reduce tu rentabilidad. Reestructurando tus deducciones operativas permitidas, podrías optimizar tu utilidad al año.` },
      { id: "otros", name: "OTROS GASTOS", icon: "🏷️", label: "[Diagnóstico: Fugas Hormiga]", val: hiddenVal, pct: userOtrosPct, benchmark: 5, description: `Tus costos ocultos o gastos no identificados están erosionando tu margen. Identificando y reduciendo estas salidas hormiga, rescatas pura utilidad libre al mes.` }
    ];

    let maxExcess = -Infinity;
    let chosen = categories[2]; // Default fallback to SERVICIOS

    categories.forEach(cat => {
      // Exclude TAXES as it's non-operational in standard simulations
      if (cat.id === "impuestos") return;

      const excess = cat.pct - cat.benchmark;
      if (excess > maxExcess) {
        maxExcess = excess;
        chosen = cat;
      }
    });

    return chosen;
  })();

  const whatIfTarjeta2Icon = selectedCategory.icon;
  const whatIfTarjeta2CategoryName = selectedCategory.name;
  const whatIfTarjeta2DiagnosticLabel = selectedCategory.label;

  const whatIfTarjeta2FreedCashUsd = (() => {
    const categoryKey = selectedCategory.id;
    const specificFreedCash = activeReport.what_if?.[categoryKey]?.freed_cash_usd || 
                              activeReport.what_if?.[selectedCategory.name.toLowerCase()]?.freed_cash_usd ||
                              activeReport.what_if?.tarjeta_2?.[categoryKey]?.freed_cash_usd;
    
    if (specificFreedCash) return specificFreedCash;

    const tarjeta2Category = String(activeReport.what_if?.tarjeta_2?.category_name || '').toUpperCase();
    if (tarjeta2Category === selectedCategory.name) {
      return activeReport.what_if?.tarjeta_2?.freed_cash_usd;
    }

    if (categoryKey === "servicios") {
      const planBeneficio = activeReport.plan_accion_inteligente?.paso_3?.beneficio;
      if (planBeneficio) {
        const match = planBeneficio.match(/\+\$[0-9,]+/);
        if (match) return `${match[0]} USD`;
      }
      return `+$${Math.round(servicesVal * 0.2)} USD`;
    }
    
    if (categoryKey === "mantenimiento") {
      return `+$${Math.round(maintenanceVal * 0.15) || 45} USD`;
    }

    if (categoryKey === "limpieza") {
      const planBeneficio = activeReport.plan_accion_inteligente?.paso_2?.beneficio;
      if (planBeneficio) {
        const match = planBeneficio.match(/\+\$[0-9,]+/);
        if (match) return `${match[0]} USD`;
      }
      return `+$${Math.round(cleaningVal * 0.15)} USD`;
    }

    if (categoryKey === "comisiones") {
      return `+$${Math.round(commissionVal * 0.3)} USD`;
    }

    return `+$${Math.round(selectedCategory.val * 0.15) || 45} USD`;
  })();

  const whatIfTarjeta2Description = (() => {
    const categoryKey = selectedCategory.id;
    const specificDesc = activeReport.what_if?.[categoryKey]?.description || 
                         activeReport.what_if?.[selectedCategory.name.toLowerCase()]?.description;
    if (specificDesc) return specificDesc;

    const tarjeta2Category = String(activeReport.what_if?.tarjeta_2?.category_name || '').toUpperCase();
    if (tarjeta2Category === selectedCategory.name && activeReport.what_if?.tarjeta_2?.description) {
      return activeReport.what_if?.tarjeta_2?.description;
    }

    return `${selectedCategory.description} Si reduces esta fuga, liberas de inmediato ${whatIfTarjeta2FreedCashUsd} al mes de pura utilidad libre.`;
  })();

  const formatGain = (val: any) => {
    if (val === undefined || val === null) return '';
    const str = String(val);
    if (str.startsWith('+') || str.includes('$') || str.includes('USD')) {
      return str;
    }
    return `+${str} USD`;
  };

  const cleanFormatAmount = (val: any) => {
    if (val === undefined || val === null) return { value: '', suffix: '' };
    const str = String(val).toUpperCase();
    const numMatch = str.replace(/[^\d]/g, '');
    if (!numMatch) return { value: str, suffix: '' };
    return { value: `+$${Number(numMatch).toLocaleString()}`, suffix: 'USD/mes' };
  };

  const renderMainCard = (lane: any) => {
    if (!lane || !lane.categoria) return null;
    const numericMonthly = (() => {
      if (lane.impacto_mensual === undefined || lane.impacto_mensual === null) return 0;
      const str = String(lane.impacto_mensual);
      const cleaned = str.replace(/[^0-9.-]/g, '');
      const num = Number(cleaned);
      return isNaN(num) ? 0 : num;
    })();

    return (
      <div className="border border-[#161B26] bg-[#0E1218]/60 rounded-3xl p-8 flex flex-col justify-between h-full w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col justify-between h-full gap-6">
          <div>
            {lane.prioridad && (
              <span className="text-[11px] tracking-widest text-[#00D1B2] font-bold uppercase mb-4 block">
                — {lane.prioridad}
              </span>
            )}
            <h3 className="text-2xl font-black text-white tracking-tight mb-4 uppercase text-left">
              {lane.categoria}
            </h3>
            
            <div className="flex flex-col gap-4 text-left">
              {lane.que_intervenir && (
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider">
                    Qué intervenir
                  </span>
                  <p className="text-xs text-neutral-400 leading-relaxed font-semibold">
                    {lane.que_intervenir}
                  </p>
                </div>
              )}
              
              {lane.metrica && (
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider">
                    Métrica
                  </span>
                  <p className="text-xs text-neutral-400 leading-relaxed font-semibold">
                    {lane.metrica}
                  </p>
                </div>
              )}

              {lane.what_if && (
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider">
                    Escenario What If
                  </span>
                  <p className="text-xs text-neutral-400 leading-relaxed font-semibold italic">
                    "{lane.what_if}"
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {numericMonthly > 0 ? (
            <div className="mt-auto pt-6 border-t border-white/[0.03] flex flex-col gap-4 text-left">
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {lane.impacto_mensual !== undefined && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider mb-1">
                      Impacto Mensual
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-[#00D1B2] tracking-tight">
                        {typeof lane.impacto_mensual === 'number'
                          ? `+$${lane.impacto_mensual.toLocaleString()}`
                          : lane.impacto_mensual}
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        USD/mes
                      </span>
                    </div>
                  </div>
                )}
                
                {lane.impacto_anual !== undefined && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider mb-1">
                      Impacto Anual
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-[#00D1B2] tracking-tight">
                        {typeof lane.impacto_anual === 'number'
                          ? `+$${lane.impacto_anual.toLocaleString()}`
                          : lane.impacto_anual}
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        USD/año
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-auto pt-6 border-t border-white/[0.03] flex flex-col gap-1 text-left">
              <span className="text-[10px] md:text-xs font-black text-[#00D1B2] uppercase tracking-widest flex items-center gap-1.5">
                ✓ SIN FUGAS CONFIRMADAS
              </span>
              <span className="text-sm font-extrabold text-white uppercase tracking-wider mt-0.5">
                COLCHÓN OPERATIVO
              </span>
              <p className="text-xs text-neutral-400 font-semibold leading-relaxed mt-1">
                Mantener el margen de seguridad y seguir monitoreando la operación.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSecondaryCard = (lane: any) => {
    if (!lane || !lane.categoria) return null;
    const numericMonthly = (() => {
      if (lane.impacto_mensual === undefined || lane.impacto_mensual === null) return 0;
      const str = String(lane.impacto_mensual);
      const cleaned = str.replace(/[^0-9.-]/g, '');
      const num = Number(cleaned);
      return isNaN(num) ? 0 : num;
    })();

    return (
      <div className="border border-[#161B26] bg-[#0E1218]/60 rounded-3xl p-8 flex flex-col justify-between h-full w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col justify-between h-full gap-6">
          <div>
            {lane.prioridad && (
              <span className="text-[11px] tracking-widest text-[#00D1B2] font-bold uppercase mb-4 block">
                — {lane.prioridad}
              </span>
            )}
            <h3 className="text-2xl font-black text-white tracking-tight mb-4 uppercase text-left">
              {lane.categoria}
            </h3>

            <div className="flex flex-col gap-4 text-left">
              {lane.que_intervenir && (
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider">
                    Qué intervenir
                  </span>
                  <p className="text-xs text-neutral-400 leading-relaxed font-semibold">
                    {lane.que_intervenir}
                  </p>
                </div>
              )}

              {lane.metrica && (
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider">
                    Métrica
                  </span>
                  <p className="text-xs text-neutral-400 leading-relaxed font-semibold">
                    {lane.metrica}
                  </p>
                </div>
              )}

              {lane.what_if && (
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider">
                    Escenario What If
                  </span>
                  <p className="text-xs text-neutral-400 leading-relaxed font-semibold italic">
                    "{lane.what_if}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {numericMonthly > 0 ? (
            <div className="mt-auto pt-6 border-t border-white/[0.03] flex flex-col gap-4 text-left">
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {lane.impacto_mensual !== undefined && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider mb-1">
                      Impacto Mensual
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-[#00D1B2] tracking-tight">
                        {typeof lane.impacto_mensual === 'number'
                          ? `+$${lane.impacto_mensual.toLocaleString()}`
                          : lane.impacto_mensual}
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        USD/mes
                      </span>
                    </div>
                  </div>
                )}

                {lane.impacto_anual !== undefined && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider mb-1">
                      Impacto Anual
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-[#00D1B2] tracking-tight">
                        {typeof lane.impacto_anual === 'number'
                          ? `+$${lane.impacto_anual.toLocaleString()}`
                          : lane.impacto_anual}
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        USD/año
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-auto pt-6 border-t border-white/[0.03] flex flex-col gap-1 text-left">
              <span className="text-[10px] md:text-xs font-black text-[#00D1B2] uppercase tracking-widest flex items-center gap-1.5">
                ✓ SIN FUGAS CONFIRMADAS
              </span>
              <span className="text-sm font-extrabold text-white uppercase tracking-wider mt-0.5">
                COLCHÓN OPERATIVO
              </span>
              <p className="text-xs text-neutral-400 font-semibold leading-relaxed mt-1">
                Mantener el margen de seguridad y seguir monitoreando la operación.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Radial/Radar chart parameters and coordinate math
  const radarCenter = 150;
  const maxRadius = 100;
  const concentricLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getRadarPointUser = (index: number) => {
    const angle = (index * 60 - 90) * (Math.PI / 180);
    const userCost = (radar.tus_costos_pct && radar.tus_costos_pct[index] !== undefined) ? radar.tus_costos_pct[index] : 0;
    const idealCost = (radar.benchmark_ideal_pct && radar.benchmark_ideal_pct[index] !== undefined) ? radar.benchmark_ideal_pct[index] : 1;
    
    const deviation = userCost / (idealCost || 1);
    const R_ideal = 70;
    let r = R_ideal;
    
    if (deviation > 1) {
      // Exceeds benchmark: expand outwards proportional to excess, up to maxRadius (100)
      const excess = deviation - 1;
      r = R_ideal + (maxRadius - R_ideal) * Math.min(1.0, excess / 2.0);
    } else {
      // Within safe boundary: retract towards center proportional to deviation
      r = R_ideal * deviation;
    }
    
    const x = radarCenter + r * Math.cos(angle);
    const y = radarCenter + r * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const userPoints = (radar.tus_costos_pct || [32, 21, 14, 11, 18, 4])
    .map((_: number, idx: number) => getRadarPointUser(idx))
    .join(" ");

  const idealPoints = Array.from({ length: 6 }).map((_: unknown, idx: number) => {
    const angle = (idx * 60 - 90) * (Math.PI / 180);
    const r = 70; // Benchmark hexagon at fixed ideal R = 70
    const x = radarCenter + r * Math.cos(angle);
    const y = radarCenter + r * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const detailKeyMap: Record<string, string> = {
    "Comisiones": "comision",
    "Limpieza": "limpieza",
    "Servicios": "servicios",
    "Mantenimiento": "mantenimiento"
  };

  const activeReportObj = n8nReport?.report_data || n8nReport;

  let activeMarginOfSafetyVal = hasN8nData
    ? Number(activeReportObj?.free?.metrics?.margin_of_safety ?? 9)
    : activeMarginOfSafety;

  const isPremium = n8nReport?.report_level === 'premium' || isUnlocked;

  let heroMensualVal = hasN8nData
    ? Number(activeReportObj?.free?.hero_mensual ?? 808)
    : Number(productionJson.free?.hero_mensual ?? 808);

  let heroAnualVal = hasN8nData
    ? Number(activeReportObj?.free?.hero_anual ?? 9696)
    : Number(productionJson.free?.hero_anual ?? 9696);

  let colchonTitulo = activeReportObj?.cabecera?.colchon?.titulo;
  let colchonLabel = activeReportObj?.cabecera?.colchon?.label;

  if (statusFromUrl && !hasN8nData) {
    if (statusFromUrl === 'saludable') {
      activeMarginOfSafetyVal = 14;
      heroMensualVal = 1600;
      heroAnualVal = 19200;
      colchonTitulo = "Tienes 14 noches de colchón";
      colchonLabel = "PERO CADA DECISIÓN DE PRECIO O OCUPACIÓN DEFINE TU PRÓXIMA UNIDAD";
    } else if (statusFromUrl === 'vulnerable' || statusFromUrl === 'medium' || statusFromUrl === 'tenso') {
      activeMarginOfSafetyVal = 9;
      heroMensualVal = 327;
      heroAnualVal = 3924;
    } else if (statusFromUrl === 'critico' || statusFromUrl === 'critica' || statusFromUrl === 'critical' || statusFromUrl === 'high') {
      activeMarginOfSafetyVal = 0;
      heroMensualVal = 4500;
      heroAnualVal = 54000;
    }
  }

  const formatHeroValue = (val: any) => {
    if (val === undefined || val === null) return '0';
    const str = String(val);
    const cleaned = str.replace(/[^0-9.-]/g, '');
    const num = Number(cleaned);
    if (!isNaN(num) && cleaned !== '') {
      return num.toLocaleString('en-US');
    }
    return str.replace(/^\+?\$?/, '').replace(/\s*USD.*$/, '').replace(/\/.*$/, '').trim();
  };

  const formattedHeroMensual = formatHeroValue(heroMensualVal);
  const formattedHeroAnual = formatHeroValue(heroAnualVal);

  const getRiskNarrative = () => {
    let label = 'Nivel de Alerta Operativa: Medio';
    let accentColor = '#FFB800';
    let accentText = 'text-[#FFB800]';
    let glowColor = 'rgba(255, 184, 0, 0.4)';
    let icon = AlertTriangle;

    if (riskLevel === 'LOW') {
      label = 'Nivel de Alerta Operativa: Bajo';
      accentColor = '#00B894';
      accentText = 'text-[#00B894]';
      glowColor = 'rgba(0, 184, 148, 0.4)';
      icon = CheckCircle2;
    } else if (riskLevel === 'HIGH') {
      label = 'Nivel de Alerta Operativa: Alto';
      accentColor = '#FF2D2D';
      accentText = 'text-[#FF2D2D]';
      glowColor = 'rgba(255, 45, 45, 0.4)';
      icon = AlertTriangle;
    }

    const titleVal = statusFromUrl 
      ? (statusFromUrl === 'saludable' ? 'AUDITORÍA: OPERACIÓN SALUDABLE' : statusFromUrl === 'critico' || statusFromUrl === 'critica' || statusFromUrl === 'high' ? 'AUDITORÍA: RIESGO OPERATIVO CRÍTICO' : 'AUDITORÍA: MARGEN OPERATIVO TENSO') 
      : (hasN8nData ? (activeReportObj?.cabecera?.headline || '') : (results.free.headline || ''));

    const descVal = statusFromUrl
      ? (statusFromUrl === 'saludable' ? 'Tu propiedad se encuentra en un rango de control saludable.' : statusFromUrl === 'critico' || statusFromUrl === 'critica' || statusFromUrl === 'high' ? 'Tu operación actual no está logrando cubrir sus costos de manera consistente.' : 'Tu estructura de gastos es elevada (47%). Tu rentabilidad es vulnerable.')
      : (hasN8nData ? (activeReportObj?.cabecera?.intro || '') : (results.free.intro || ''));

    return {
      label,
      title: titleVal,
      desc: descVal,
      accentColor,
      accentText,
      glowColor,
      icon
    };
  };

  const narrative = getRiskNarrative();
  const AuditIcon = narrative.icon;
  const cleanHeadline = (hasN8nData ? (activeReportObj?.cabecera?.headline || narrative.title) : (activeReport.free?.headline || narrative.title)).replace(/^AUDITORÍA:\s*/i, "");

  const renderTitle = (titleRaw: string, accentText: string) => {
    const defaultPrefix = 'AUDITORÍA:';
    if (titleRaw.toUpperCase().startsWith(defaultPrefix)) {
      const rest = titleRaw.substring(defaultPrefix.length);
      return (
        <>
          <span className="text-white">{defaultPrefix}</span>
          <span className={accentText}>{rest}</span>
        </>
      );
    }
    return <span className={accentText}>{titleRaw}</span>;
  };

  return (
    <div className={`w-full mx-auto mb-12 ${currentStep === 4 ? 'max-w-none' : 'max-w-[800px]'}`}>
      
      {/* STEP 0 — Pantalla de bienvenida / puente */}
      {currentStep === 0 && (
        <div className="flex flex-col items-center justify-center text-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-[680px] mx-auto">
          <div className="inline-block px-3 py-1.5 rounded-full border border-[#00D1B2]/20 bg-[#00D1B2]/10 text-[#00D1B2] text-[10px] md:text-xs font-bold tracking-widest uppercase mb-8 shadow-[0_0_15px_rgba(0,209,178,0.1)]">
            DIAGNÓSTICO EXPRESS · GRATIS
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            Descubre si tu BNB realmente genera ganancias.
          </h1>
          <p className="text-base md:text-lg text-zinc-400 max-w-lg mx-auto leading-relaxed mb-10">
            Responde unas preguntas sobre tu operación y en 90 segundos verás exactamente dónde está tu dinero — y cuánto podrías estar dejando sobre la mesa.
          </p>
          <div className="flex flex-col gap-4 mb-10 text-left w-full max-w-sm mx-auto">
            {[
              { img: '/assets/icon-guardian.webp', text: 'Detecta si tu operación es saludable, vulnerable o crítica' },
              { img: '/assets/icon-cazafugas.webp', text: 'Analiza tus métricas frente al benchmark del mercado' },
              { img: '/assets/icon-estratega.webp', text: 'Prioriza la intervención con mayor impacto económico' },
            ].map(({ img, text }) => (
              <div key={text} className="flex items-center gap-4 text-zinc-300 text-sm">
                <img src={img} alt="" style={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setCurrentStep(1)}
            className="inline-flex items-center gap-3 bg-[#00D1B2] hover:bg-[#00bfa3] text-[#0B0B0C] font-bold text-base px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(0,209,178,0.3)]"
          >
            Empezar diagnóstico
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
          <p className="text-zinc-600 text-xs mt-5">Sin registro · Sin tarjeta · 90 segundos</p>
        </div>
      )}

      {/* 2. HERO SUPERIOR (Dinámico para pasos 1-3) */}
      {currentStep >= 1 && currentStep <= 3 && (
        <div className="text-center mb-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block px-3 py-1.5 rounded-full border border-[#00D1B2]/20 bg-[#00D1B2]/10 text-[#00D1B2] text-[10px] md:text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(0,209,178,0.1)] animate-pulse">
            DIAGNÓSTICO EXPRESS
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight max-w-2xl mx-auto">
            {currentStep === 1 && "Mientras no tengas claridad, tu operación es una apuesta."}
            {currentStep === 2 && "Aquí está exactamente dónde se escapa."}
            {currentStep === 3 && "Tu plan está listo."}
          </h1>
          <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed mb-6">
            {currentStep === 1 && "Responde 4 preguntas sobre tu operación. Te mostraré exactamente dónde está el agujero y cuánto puedes recuperar."}
            {currentStep === 2 && "Tus números revelan 3 oportunidades. El sistema prioriza por impacto económico. Mira cuál es tu mayor palanca."}
            {currentStep === 3 && "Tu diagnóstico inicial llegará en 1 minuto. Ahí verás exactamente dónde está tu dinero atrapado. Luego, desglosa tus gastos reales para ver el plan completo."}
          </p>
        </div>
      )}
      
      {/* BARRA DE PROGRESO PREMIUM (Solo visible en pasos de llenado 1-3) */}
      {currentStep >= 1 && currentStep <= 3 && (
        <div className="mb-10 px-4">
          <div className="flex justify-between items-center relative">
            {/* Línea de fondo */}
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-white/5 -translate-y-1/2 z-0"></div>
            {/* Línea de progreso activa */}
            <div 
              className="absolute top-1/2 left-0 h-[2px] bg-[#00D1B2] -translate-y-1/2 transition-all duration-500 ease-in-out z-0"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>

            {/* Pasos */}
            {[
              { step: 1, name: 'Identidad' },
              { step: 2, name: 'Diagnóstico' },
              { step: 3, name: 'Email' }
            ].map((item) => {
              const isActive = currentStep === item.step;
              const isCompleted = currentStep > item.step;
              return (
                <div key={item.step} className="flex flex-col items-center relative z-10">
                  <button
                    type="button"
                    onClick={() => {
                      // Solo permitir volver a pasos ya completados
                      if (item.step < currentStep) {
                        setCurrentStep(item.step);
                      }
                    }}
                    disabled={item.step > currentStep}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#0B0B0C] border-2 border-[#00D1B2] text-[#00D1B2] shadow-[0_0_15px_rgba(0,209,178,0.4)] scale-110'
                        : isCompleted
                          ? 'bg-[#00D1B2] text-[#0B0B0C] border-2 border-[#00D1B2]'
                          : 'bg-[#18181A] border-2 border-white/5 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? '✓' : item.step}
                  </button>
                  <span className={`text-[10px] md:text-xs uppercase font-bold tracking-widest mt-2 hidden sm:inline-block ${isActive ? 'text-[#00D1B2]' : 'text-zinc-500'}`}>
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="text-center sm:hidden mt-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#00D1B2]">
              Paso {currentStep} de 3: {[
                'Identificación de Propiedad',
                'Diagnóstico Rápido',
                'Email de Contacto'
              ][currentStep - 1]}
            </span>
          </div>
        </div>
      )}

      {currentStep === 4 && !isFetchingReport ? (
        /* PANTALLA 4: RESULTADOS CON REPORTE PREMIUM COMPLETO (NÍTIDO Y ACCIONABLE) - SIN TARJETA CONTENEDORA EXTERNA */
        !hasN8nData && !statusFromUrl ? (
          /* SIN DATOS: n8n no respondió y no hay URL params — estado de espera limpio */
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center animate-in fade-in duration-500">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-[#00D1B2]/20 border-t-[#00D1B2] rounded-full animate-spin" />
              <div className="absolute inset-0 rounded-full bg-[#00D1B2]/5 blur-lg animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#00D1B2] uppercase tracking-[0.15em] mb-2">
                Tu diagnóstico está siendo procesado
              </p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                Esto puede tomar unos segundos. Si la página no actualiza en 30 segundos, recárgala para ver tu reporte.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 border border-[#00D1B2]/30 hover:border-[#00D1B2]/60 text-[#00D1B2] text-xs font-bold uppercase tracking-widest rounded-full transition-all"
            >
              Recargar página
            </button>
          </div>
        ) : (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-left w-full">

            {/* CABECERA DE RESUMEN INICIAL */}
            <div className="w-full bg-gradient-to-b from-[#1A1D23] to-[#0B0C10] border border-[#2E333C]/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-zinc-700/50">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold text-[#00D1B2] uppercase tracking-widest">
                  PROPIEDAD AUDITADA
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                  {userPropertyName}
                </h2>
                <span className="text-xs text-zinc-400 font-medium">
                  📍 {userLocation}
                </span>
              </div>
              <div className="md:text-right flex flex-col gap-1">
                <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-widest md:text-right">
                  ESPECIFICACIONES DE OPERACIÓN
                </span>
                <p className="text-xs md:text-sm text-zinc-300 leading-relaxed font-semibold">
                  {activeReport.free?.user_summary?.capacity || `${formData.Max_guest || 2} huéspedes · ${formData.bedrooms || 1} hab · ${formData.bathrooms || 1} baños`} — {activeReport.free?.user_summary?.activity || `${formData.occupied_nights || 20} noches vendidas este mes`}
                </p>
              </div>
            </div>

            {/* 1. COMPONENTE METRICAS (Fijo) */}
            <div className="grid grid-cols-2 gap-4 w-full mb-6">
              <div className="bg-gradient-to-b from-[#1A1D23] to-[#0B0C10] border border-[#2E333C]/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 flex flex-col justify-between h-[140px] transition-all hover:border-zinc-700/50">
                <div className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mb-2">OCCUPANCY RATE</div>
                <div className="flex flex-col">
                  <div className="text-2xl font-black text-white">
                    <AnimatedNumber value={Math.round(occupationPct)} suffix="%" />
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-1">Ocupación real del mes</div>
                </div>
              </div>
              <div className="bg-gradient-to-b from-[#1A1D23] to-[#0B0C10] border border-[#2E333C]/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 flex flex-col justify-between h-[140px] transition-all hover:border-zinc-700/50">
                <div className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mb-2">ADR ACTUAL</div>
                <div className="flex flex-col">
                  <div className="text-2xl font-black text-white flex items-baseline gap-1">
                    <span className="text-sm font-bold text-zinc-500">$</span>
                    <AnimatedNumber value={Math.round(Number(activeReport.free?.metrics?.avg_nightly_income || 0))} />
                    <span className="text-[10px] uppercase font-bold text-zinc-500 ml-1 tracking-tighter">USD</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-medium mt-1">Tarifa promedio diaria</div>
                </div>
              </div>
            </div>

            {/* 1. CABECERA PREMIUM (MISMA LÓGICA QUE QUICK RESULT) */}
            <div 
              className="w-full bg-[#121318] border-2 rounded-[24px] p-8 mb-8 relative overflow-hidden transition-all duration-500 text-left"
              style={{ 
                borderColor: narrative.accentColor,
                boxShadow: `0 0 30px ${narrative.glowColor}`
              }}
            >
              <div className={`flex items-center gap-2 ${narrative.accentText} text-[11px] font-bold tracking-widest uppercase mb-4`}>
                 <AuditIcon className="w-4 h-4" /> {narrative.label}
              </div>

              <h2 className="text-2xl md:text-[28px] font-black text-white uppercase tracking-tight leading-tight mb-4">
                {renderTitle(narrative.title, narrative.accentText)}
              </h2>

              {isPremium ? (
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-medium">
                  {narrative.desc}
                </p>
              ) : (
                (hasN8nData ? activeReportObj?.free?.impact_text : productionJson.free?.impact_text) !== "" && (
                  <p
                    className="text-zinc-400 text-sm leading-relaxed mb-6 font-medium"
                    dangerouslySetInnerHTML={{ __html: ((hasN8nData ? activeReportObj?.free?.impact_text : productionJson.free?.impact_text) || narrative.desc).replace(/text-\[#[0-9A-Fa-f]{3,6}\]/g, narrative.accentText) }}
                  />
                )
              )}

              <div className="pt-6 border-t border-zinc-800/50 flex flex-col gap-4">
                {/* Bloque de noches: Visible en MEDIUM y LOW */}
                {(riskLevel === 'MEDIUM' || riskLevel === 'LOW') && (
                  <div className="flex flex-col">
                    <div className="text-white text-lg font-black tracking-tight">
                      {riskLevel === 'LOW' ? (
                        <>
                          {colchonTitulo || `Tienes ${activeMarginOfSafetyVal} noches de colchón`} / {colchonLabel || "DE MARGEN DE SEGURIDAD"}
                        </>
                      ) : (
                        <>
                          Estás a <span className="text-[#FFB800] font-black">{activeMarginOfSafetyVal}</span> noches / DE ENTRAR EN PÉRDIDA
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Bloque de Impacto Económico: Visible en todos los estados */}
                <div className="flex flex-col">
                  <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                    <TrendingUp className={`w-3.5 h-3.5 ${narrative.accentText}`} />
                    IMPACTO ECONÓMICO
                  </div>
                  <div className="text-xl md:text-2xl font-black text-white">
                    Potencial Económico Identificado:{" "}
                    {activeReportObj?.free?.hero_display ? (
                      <span className={`font-black ${narrative.accentText}`}>
                        {activeReportObj.free.hero_display}
                      </span>
                    ) : (
                      <>
                        <span className={`font-black ${narrative.accentText}`}>
                          +${formattedHeroMensual} USD/mes
                        </span>{" "}
                        (+${formattedHeroAnual} USD/año)
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SEPARADOR ELEGANTE ENTRE CABECERA Y FASES Y EL RESTO DEL REPORTE BLURREADO */}
            {showPlaceholderForm ? (
              /* FORMULARIO LARGO / AUDITORÍA COMPLETA PREMIUM */
              <div id="formulario-premium" className="w-full bg-[#121318] border border-[#00D1B2]/30 rounded-3xl p-8 md:p-12 text-left flex flex-col gap-8 animate-in fade-in duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="border-b border-white/5 pb-4">
                  <span className="text-[10px] font-black text-[#00D1B2] uppercase tracking-[0.15em] block mb-1">AUDITORÍA OPERATIVA COMPLETA</span>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                    Completa los Datos de tu Auditoría
                  </h3>
                  <p className="text-xs text-[#8e8e93] font-semibold mt-1">
                    No estás empezando de nuevo. Tus datos básicos ya han sido cargados. Completa los costos desglosados para desbloquear la segunda mitad del análisis.
                  </p>
                </div>

                {/* 1. SECCIÓN: DATOS GENERALES (PRECARGADOS Y EDITABLES) */}
                <div className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-4">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="text-[#00D1B2]">✓</span> Datos Precargados
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Nombre del Inmueble */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Nombre del inmueble</label>
                      <input
                        type="text"
                        name="property_name"
                        value={formData.property_name}
                        onChange={handleInputChange}
                        placeholder="Ej. Villa Coral, Apartamento Chacao..."
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                    {/* País */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">País</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Ej. España"
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                    {/* Ciudad */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Ciudad</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Ej. Barcelona"
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                    {/* Tipo de Propiedad */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tipo de propiedad</label>
                      <input
                        type="text"
                        name="property_type"
                        value={formData.property_type}
                        onChange={handleInputChange}
                        placeholder="Ej. Apartamento"
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                    {/* Tipo de Mercado */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tipo de mercado</label>
                      <select 
                        name="market_type"
                        value={formData.market_type}
                        onChange={handleInputChange}
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#00D1B2]"
                      >
                        <option value="urban">Urbano / Negocios</option>
                        <option value="vacacional">Vacacional / Turismo</option>
                      </select>
                    </div>
                    {/* Ingreso Mensual */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Ingreso mensual (USD)</label>
                      <input
                        type="number"
                        name="gross_income"
                        value={formData.gross_income}
                        onChange={handleInputChange}
                        placeholder="Ej. 3000"
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                    {/* Noches Ocupadas */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Noches ocupadas</label>
                      <input
                        type="number"
                        name="occupied_nights"
                        value={formData.occupied_nights}
                        onChange={handleInputChange}
                        placeholder="Ej. 17"
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                    {/* Noches Disponibles */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Noches disponibles</label>
                      <input
                        type="number"
                        name="available_nights"
                        value={formData.available_nights}
                        onChange={handleInputChange}
                        placeholder="Ej. 30"
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                    {/* Gastos Aproximados */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Gastos aproximados (USD)</label>
                      <input
                        type="number"
                        name="approximate_expenses"
                        value={formData.approximate_expenses}
                        onChange={handleInputChange}
                        placeholder="Ej. 1400"
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                    {/* Email */}
                    <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-3">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Email registrado</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Ej. usuario@gmail.com"
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-300 placeholder-zinc-500 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">
                    El dinero atrapado tiene una dirección.
                  </h3>
                  <p className="text-xs text-[#8e8e93] font-semibold mt-1">
                    Completa estos números. Vamos a mostrar exactamente dónde está tu mayor oportunidad — y en qué orden actuar para recuperarla.
                  </p>
                </div>

                {/* 2. SECCIÓN: DATOS DE COSTOS DESGLOSADOS (NUEVOS E IMPORTANTES) */}
                <div className="space-y-6">
                  <h4 className="text-xs font-black text-[#00D1B2] uppercase tracking-widest flex items-center gap-2">
                    <span>⚡</span> Costos Desglosados Necesarios
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Comisión OTA */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="platfom_commission_premium" className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-semibold">
                        Comisión OTA / Plataformas (USD)
                      </label>
                      <input 
                        type="number"
                        id="platfom_commission_premium"
                        name="platfom_commission"
                        value={formData.platfom_commission}
                        onChange={handleInputChange}
                        placeholder="Ej. 450"
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                    {/* Limpieza */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="cleaning_cost_premium" className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-semibold">
                        Limpieza Total (USD)
                      </label>
                      <input 
                        type="number"
                        id="cleaning_cost_premium"
                        name="cleaning_cost"
                        value={formData.cleaning_cost}
                        onChange={handleInputChange}
                        placeholder="Ej. 300"
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                    {/* Servicios */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="services_cost_premium" className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-semibold">
                        Servicios Básicos / Gas / Luz (USD)
                      </label>
                      <input 
                        type="number"
                        id="services_cost_premium"
                        name="services_cost"
                        value={formData.services_cost}
                        onChange={handleInputChange}
                        placeholder="Ej. 200"
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                    {/* Mantenimiento */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="maintenence_cost_premium" className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-semibold">
                        Mantenimiento / Reparaciones (USD)
                      </label>
                      <input 
                        type="number"
                        id="maintenence_cost_premium"
                        name="maintenence_cost"
                        value={formData.maintenence_cost}
                        onChange={handleInputChange}
                        placeholder="Ej. 150"
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                    {/* Impuestos */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="tax_cost_premium" className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-semibold">
                        Impuestos y Licencias (USD)
                      </label>
                      <input 
                        type="number"
                        id="tax_cost_premium"
                        name="tax_cost"
                        value={formData.tax_cost}
                        onChange={handleInputChange}
                        placeholder="Ej. 250"
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                    {/* Otros Gastos */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="Hidden_cost_premium" className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-semibold">
                        Otros Gastos Ocultos (USD)
                      </label>
                      <input 
                        type="number"
                        id="Hidden_cost_premium"
                        name="Hidden_cost"
                        value={formData.Hidden_cost}
                        onChange={handleInputChange}
                        placeholder="Ej. 50"
                        className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#00D1B2]"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Aviso dinámico: estimación vs desglose real ── */}
                {(() => {
                  const desglosadosSum =
                    Number(formData.platfom_commission || 0) +
                    Number(formData.cleaning_cost      || 0) +
                    Number(formData.services_cost      || 0) +
                    Number(formData.maintenence_cost   || 0) +
                    Number(formData.tax_cost           || 0) +
                    Number(formData.Hidden_cost        || 0);
                  const express = Number(formData.approximate_expenses || 0);
                  const show = express > 0 && desglosadosSum > 0 &&
                    desglosadosSum !== express;
                  if (!show) return null;
                  const isHigher = desglosadosSum > express;
                  const accent   = isHigher ? '#F0B432' : '#34F5C5';
                  const bgAlpha  = isHigher ? 'rgba(240,180,50,0.04)' : 'rgba(52,245,197,0.04)';
                  const bdAlpha  = isHigher ? 'rgba(240,180,50,0.18)' : 'rgba(52,245,197,0.16)';
                  return (
                    <div
                      className="rounded-xl flex gap-3 items-start px-4 py-3.5"
                      style={{ background: bgAlpha, border: `1px solid ${bdAlpha}`, borderLeft: `3px solid ${accent}` }}
                    >
                      <span className="text-base leading-tight pt-0.5 shrink-0">
                        {isHigher ? '⚠️' : '✅'}
                      </span>
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <p className="text-[13px] font-bold text-white leading-snug">
                          {isHigher
                            ? 'Tus gastos reales superan tu estimación inicial.'
                            : 'Tu operación es más eficiente de lo que estimaste.'}
                        </p>
                        <p className="text-[12px] text-zinc-400 leading-relaxed">
                          Ingresaste{' '}
                          <span className="text-zinc-200 font-semibold">${express.toLocaleString()}/mes</span>{' '}
                          al inicio — tus datos desglosados suman{' '}
                          <span className="font-bold" style={{ color: accent }}>${desglosadosSum.toLocaleString()}/mes</span>.
                          {' '}El diagnóstico operativo usará tus cifras desglosadas.
                        </p>
                        <p className="text-[10px] text-zinc-600 border-t border-white/[0.05] pt-2 mt-0.5 leading-relaxed">
                          Con datos exactos, el sistema detecta fugas reales — no promedios estimados.
                        </p>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex flex-col sm:flex-row gap-4 border-t border-white/5 pt-6 mt-4 w-full">
                  <button
                    type="button"
                    onClick={handleOpenCheckout}
                    className="flex-1 bg-gradient-to-r from-[#00D1B2] to-[#00FFD1] text-[#0B0B0C] font-black text-xs md:text-sm uppercase tracking-widest px-8 py-4 rounded-full shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <span>Desbloquear análisis completo ($47 USD)</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowPlaceholderForm(false)}
                    className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold uppercase tracking-wider rounded-full transition-all"
                  >
                    Volver al Reporte
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative w-full">
                {/* 
                  Blurred Content Container
                  If the report is not unlocked, we apply blur, low opacity, and prevent interactions.
                */}
                <div className={`transition-all duration-500 space-y-8 ${
                  !isUnlocked ? 'filter blur-[7px] pointer-events-none select-none opacity-25' : ''
                }`}>
                  <div className="w-full pt-8 mt-12 mb-8 border-t border-white/5 flex flex-col items-center gap-1 text-center select-none">
                    <span className="text-[10px] font-black tracking-[0.3em] text-white uppercase">
                      SECUENCIA DE AUDITORÍA OPERATIVA
                    </span>
              <div 
                className="w-12 h-[2px] rounded-full transition-colors duration-300"
                style={{ backgroundColor: narrative.accentColor }}
              />
            </div>

            {/* FIXED PROGRESS BAR (VISUAL GUIDE) */}
            <style dangerouslySetInnerHTML={{__html: `
              .no-scrollbar-inline::-webkit-scrollbar {
                display: none !important;
              }
            `}} />
            <div 
              className="sticky top-[72px] z-40 w-full bg-[#121318]/90 backdrop-blur-md border-2 rounded-2xl p-4 mb-12 flex items-center justify-between gap-4 text-left select-none overflow-x-auto no-scrollbar-inline transition-all duration-300"
              style={{
                borderColor: narrative.accentColor,
                boxShadow: `0 0 30px ${narrative.glowColor}`,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {[
                { num: 1, name: "DIAGNÓSTICO", sub: "Entiende tu estado actual" },
                { num: 2, name: "FUGAS", sub: "Encuentra el dinero perdido" },
                { num: 3, name: "ESTRATEGIA", sub: "Define el siguiente movimiento" },
                { num: 4, name: "PROYECCIÓN", sub: "Visualiza tu potencial" },
                { num: 5, name: "PLAN DE ACCIÓN", sub: "Ejecuta y mejora" }
              ].map((step, idx) => (
                <Fragment key={step.num}>
                  <div className="flex items-center gap-3 min-w-fit">
                    <div 
                      className="w-8 h-8 rounded-full border border-white/20 bg-white/5 text-white flex items-center justify-center text-xs font-black shrink-0 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                      style={{
                        boxShadow: `0 0 10px rgba(255, 255, 255, 0.05)`
                      }}
                    >
                      {step.num}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-wider text-white leading-none mb-1">
                        {step.name}
                      </span>
                      <span className="text-[10px] font-semibold text-zinc-400 leading-none">
                        {step.sub}
                      </span>
                    </div>
                  </div>
                  {idx < 4 && (
                    <div 
                      className="h-[1px] flex-1 min-w-[15px] max-w-[40px] hidden xl:block transition-all duration-300"
                      style={{
                        background: `linear-gradient(to right, rgba(255, 255, 255, 0.1), transparent)`
                      }}
                    ></div>
                  )}
                </Fragment>
              ))}
            </div>

            {/* 2. DIAGNÓSTICO OPERATIVO */}
            {/* CONTENEDOR GENERAL FASE 1 */}
            <div className="w-full border border-[#2A2F36] rounded-[20px] p-6 md:p-8 mb-12 bg-transparent text-left">
              {(() => {
                const totalMensual = activeReport.guardian_conclusion?.kpis?.impacto_mensual_detectado ?? 0;
                const totalAnual = activeReport.guardian_conclusion?.kpis?.impacto_anual_detectado ?? 0;

                const formatOpportunity = (val: any, defaultSuffix: string) => {
                  if (val === undefined || val === null) return `+$0 ${defaultSuffix}`;
                  const str = String(val);
                  if (str.startsWith('+') || str.includes('$')) return str;
                  const num = Number(str.replace(/[^0-9.-]/g, ''));
                  if (!isNaN(num)) {
                    return `+$${num.toLocaleString()} ${defaultSuffix}`;
                  }
                  return str;
                };

                const formattedTotalMensual = formatOpportunity(totalMensual, "USD / mes");
                const formattedTotalAnual = formatOpportunity(totalAnual, "USD / año");

                return (
                  <>
                    <AgentSectionHeader 
                      fase={1} 
                      agent="guardian" 
                      title="DIAGNÓSTICO OPERATIVO" 
                      description="Analizó tu estructura de costos y confirmó el potencial económico recuperable de tu operación." 
                    />

                    <section className="relative w-full overflow-hidden bg-[#0B0C10] px-4 md:px-6 py-12 rounded-3xl border border-[#2E333C]/40 mb-8 text-left">
                      <div className="pointer-events-none absolute -left-32 top-10 size-72 rounded-full bg-[#00D1B2]/[0.07] blur-[120px]" />
                      <div className="pointer-events-none absolute right-0 bottom-0 size-72 rounded-full bg-emerald-500/[0.05] blur-[120px]" />

                      <div className="relative mx-auto max-w-7xl w-full">
                        <header className="mb-12 text-left">
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00D1B2] block">
                            DIAGNÓSTICO COMPLETO
                          </span>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch w-full">
                          {/* COLUMNA A: TACÓMETRO SALUD OPERATIVA */}
                          <div className="flex flex-col items-center p-6 md:p-8 border border-[#161B26] rounded-2xl bg-[#0E1218]/60 h-full w-full">
                            <div className="w-full flex items-center gap-2 self-start mb-6">
                              <span className="h-[1px] w-5 bg-[#00D1B2]" />
                              <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300">
                                Score de Salud Operativa: {activeScore}/100
                              </span>
                            </div>

                            <div className="flex flex-col w-full items-center justify-center py-4">
                              <HealthGauge score={activeScore} riskLevel={riskLevel} />
                              
                              {/* ESTADO DE SALUD Interpretation */}
                              <div className="flex flex-col items-center mt-6 text-center">
                                <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase mb-1">
                                  ESTADO DE SALUD
                                </span>
                                <span className="text-sm font-semibold text-neutral-200">
                                  {activeScore >= 85
                                    ? 'Operación saludable con oportunidades de optimización.'
                                    : activeScore >= 70
                                      ? 'Operación estable. Requiere seguimiento periódico.'
                                      : activeScore >= 50
                                        ? 'Operación vulnerable. Existen áreas prioritarias de mejora.'
                                        : 'Operación en riesgo. Requiere intervención inmediata.'}
                                </span>
                              </div>

                              <p className="text-[11px] text-zinc-500 text-center leading-normal max-w-[280px] mt-6">
                                Calculado con ingresos y costos desglosados.
                              </p>
                            </div>
                          </div>

                          {/* COLUMNA B: POTENCIAL ECONÓMICO IDENTIFICADO */}
                          <div className="flex flex-col justify-between items-start p-6 md:p-8 border border-[#161B26] rounded-2xl bg-[#0E1218]/60 h-full w-full gap-8 text-left">
                            <div className="flex flex-col gap-6 w-full">
                              <div className="w-full flex items-center gap-2 self-start mb-2">
                                <span className="h-[1px] w-5 bg-[#00D1B2]" />
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-300">
                                  Potencial Económico Confirmado
                                </span>
                              </div>

                              {/* Bloque Narrativo */}
                              {activeReport.guardian_conclusion ? (
                                <div className="w-full flex flex-col">
                                  {/* CONCLUSIÓN DEL GUARDIÁN */}
                                  <div className="flex flex-col gap-1 w-full text-left">
                                    <span className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest">
                                      Conclusión del Guardián
                                    </span>
                                    <p className="text-neutral-200 text-sm leading-relaxed font-semibold">
                                      {activeReport.guardian_conclusion.diagnostico}
                                    </p>
                                  </div>

                                  {/* LIMITANTE PRINCIPAL */}
                                  {activeReport.guardian_conclusion.limitante_principal && (
                                    <div className="flex flex-col gap-1.5 w-full text-left mt-5">
                                      <span className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest">
                                        Limitante Principal
                                      </span>
                                      <div>
                                        <span 
                                          className="inline-block px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-md border"
                                          style={{ 
                                            borderColor: `${narrative.accentColor}30`, 
                                            color: narrative.accentColor,
                                            backgroundColor: `${narrative.accentColor}08`
                                          }}
                                        >
                                          {activeReport.guardian_conclusion.limitante_principal}
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* MENSAJE */}
                                  {activeReport.guardian_conclusion.mensaje && (
                                    <p className="text-neutral-300 text-sm leading-relaxed font-semibold italic border-l border-white/10 pl-3 mt-6">
                                      "{activeReport.guardian_conclusion.mensaje}"
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="w-full flex flex-col gap-4 text-left">
                                  <div className="flex flex-col gap-1 w-full">
                                    <span className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest">
                                      Conclusión del Guardián
                                    </span>
                                    <p className="text-neutral-200 text-sm leading-relaxed font-semibold">
                                      El Guardián completó el análisis operativo de esta propiedad.
                                    </p>
                                  </div>
                                  <p className="text-neutral-400 text-xs leading-relaxed">
                                    El Guardián identificó múltiples oportunidades de mejora priorizadas por impacto económico.
                                  </p>
                                </div>
                              )}

                              {/* VEREDICTO OPERATIVO */}
                              <div className="w-full py-6 my-2 text-left flex flex-col gap-2">
                                <span className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest">
                                  Veredicto Operativo
                                </span>
                                {(() => {
                                  const safety = activeMarginOfSafety;
                                  if (safety >= 15) {
                                    return (
                                      <p className="text-white text-base md:text-lg font-extrabold leading-relaxed">
                                        Tienes <span className={`font-black text-[18px] md:text-[20px] ${narrative.accentText}`}>{safety}</span> noches de colchón antes de entrar en pérdida.
                                      </p>
                                    );
                                  } else if (safety >= 6 && safety < 15) {
                                    return (
                                      <p className="text-white text-base md:text-lg font-extrabold leading-relaxed">
                                        Tu margen de seguridad es de <span className={`font-black text-[18px] md:text-[20px] ${narrative.accentText}`}>{safety}</span> noches.
                                      </p>
                                    );
                                  } else if (safety <= 0) {
                                    return (
                                      <p className="text-white text-base md:text-lg font-extrabold leading-relaxed">
                                        Tu operación <span className={`font-black text-[18px] md:text-[20px] ${narrative.accentText}`}>ya está en pérdida</span>. No hay colchón de seguridad.
                                      </p>
                                    );
                                  } else {
                                    return (
                                      <p className="text-white text-base md:text-lg font-extrabold leading-relaxed">
                                        Una reducción de apenas <span className={`font-black text-[18px] md:text-[20px] ${narrative.accentText}`}>{safety}</span> noches podría comprometer tu rentabilidad.
                                      </p>
                                    );
                                  }
                                })()}
                              </div>

                              {/* IMPACTO ECONÓMICO */}
                              <div className="w-full flex flex-col gap-4 pt-6 border-t border-white/[0.03]">
                                {/* Monto Mensual */}
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-widest">
                                    Impacto Mensual
                                  </span>
                                  <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className="text-4xl md:text-5xl font-black text-[#00D1B2] tracking-tight">
                                      {formattedTotalMensual}
                                    </span>
                                  </div>
                                </div>

                                {/* Monto Anual */}
                                <div className="flex flex-col gap-1.5">
                                  <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-widest">
                                    Impacto Anual
                                  </span>
                                  <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
                                      {formattedTotalAnual}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* NOTA DE TRANSICIÓN */}
                              {activeReport.guardian_conclusion?.nota_transicion && (
                                <div className="w-full text-left pt-6 mt-6 border-t border-white/[0.03] flex items-start gap-2 text-zinc-400">
                                  <CheckCircle2 className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                                  <p className="text-xs md:text-sm leading-relaxed font-medium">
                                    {activeReport.guardian_conclusion.nota_transicion}
                                  </p>
                                </div>
                              )}

                              {/* CIERRE / TRANSICIÓN */}
                              {activeReport.guardian_conclusion?.puente && (
                                <div className={`w-full text-left mt-6 ${activeReport.guardian_conclusion?.nota_transicion ? 'pt-2' : 'pt-6 border-t border-white/[0.03]'}`}>
                                  <p className="text-neutral-300 text-sm leading-relaxed font-semibold">
                                    → {activeReport.guardian_conclusion.puente}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </>
                );
              })()}

              {/* 3. MÉTRICAS DE SUPERVIVENCIA */}
              <div className="w-full">

                {/* Resumen de datos fuente — muestra de dónde vienen los números */}
                {activeReport.datos_entrada && (
                  <div className="mb-6 flex flex-wrap gap-4 px-1">
                    {[
                      { label: 'Facturación bruta', value: `$${Number(activeReport.datos_entrada.gross_income).toLocaleString()}` },
                      { label: 'Costos totales', value: `$${Number(activeReport.datos_entrada.total_costs).toLocaleString()}` },
                      { label: 'Ingreso neto', value: `$${Number(activeReport.datos_entrada.net_income).toLocaleString()}` },
                      { label: 'Noches vendidas', value: `${activeReport.datos_entrada.occupied_nights}` },
                    ].map(item => (
                      <div key={item.label} className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">{item.label}</span>
                        <span className="text-base font-black text-zinc-200 tabular-nums">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Posicionamiento de precio vs mercado */}
                {activeReport.posicionamiento_precio?.disponible && (() => {
                  const pp = activeReport.posicionamiento_precio;
                  const isBajo = pp.estado === "BAJO_MERCADO";
                  const isSobre = pp.estado === "SOBRE_MERCADO";
                  const color = isBajo ? '#F0B432' : isSobre ? '#FF4C4C' : '#00D1B2';
                  const bg = isBajo ? 'bg-[#F0B432]/[0.03]' : isSobre ? 'bg-[#FF4C4C]/[0.03]' : 'bg-[#00D1B2]/[0.03]';
                  const border = isBajo ? 'border-[#F0B432]/20' : isSobre ? 'border-[#FF4C4C]/20' : 'border-[#00D1B2]/20';
                  return (
                    <div className={`mb-6 rounded-2xl p-4 ${bg} border ${border} flex flex-col sm:flex-row sm:items-center gap-4`}>
                      <div className="flex gap-6 flex-wrap">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tu ADR</span>
                          <span className="text-lg font-black text-white tabular-nums">${pp.adr_usuario}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">ADR Zona</span>
                          <span className="text-lg font-black tabular-nums" style={{ color }}>${pp.adr_mercado}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Gap</span>
                          <span className="text-lg font-black tabular-nums" style={{ color }}>
                            {pp.gap_pct >= 0 ? '+' : ''}{pp.gap_pct}%
                          </span>
                        </div>
                        {isBajo && pp.potencial_mensual > 0 && (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Potencial precio</span>
                            <span className="text-lg font-black tabular-nums" style={{ color }}>+${pp.potencial_mensual.toLocaleString()}/mes</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed sm:border-l sm:border-white/10 sm:pl-4 max-w-xs">{pp.mensaje}</p>
                    </div>
                  );
                })()}

                <SurvivalFormula
                  breakEven={activeBreakEven}
                  margin={activeMargin}
                  baseCost={activeBaseCostPerNight}
                  marginOfSafety={activeReport.cabecera?.margin_of_safety ?? activeReport.free?.metrics?.margin_of_safety ?? activeMargin}
                />

                {/* Fila complementaria de métricas (Expense Ratio & Ingreso Neto) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:gap-6 w-full mt-4 md:mt-6">
                  {/* Expense Ratio Card — color dinámico por umbral */}
                  {(() => {
                    const er = activeExpenseRatio;
                    const erColor = er < 60 ? '#34F5C5' : er < 75 ? '#F0B432' : '#FF4C4C';
                    const erFactor = activeReport.datos_entrada?.gross_income > 0
                      ? (activeReport.datos_entrada.total_costs / activeReport.datos_entrada.gross_income * 100).toFixed(0)
                      : er;
                    return (
                      <div className="flex justify-between items-start p-5 rounded-2xl bg-[#0E1218]/60 border border-[#161B26] min-h-[130px] hover:border-neutral-700 transition-all duration-300 text-left">
                        <div className="flex flex-col gap-3 text-left max-w-[65%]">
                          <div className="w-8 h-8 rounded-lg bg-white/[0.02] flex items-center justify-center border border-white/5 shrink-0" style={{ color: erColor }}>
                            <BarChart3 className="h-4 w-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: erColor }}>
                              EXPENSE RATIO
                            </span>
                            <p className="mt-1 text-[10px] leading-normal text-neutral-500 font-medium">
                              Por cada $100 que ingresas, <strong style={{ color: erColor }}>${erFactor}</strong> van en costos operativos.
                            </p>
                          </div>
                        </div>
                        <div className="ml-auto flex items-baseline gap-1 pt-1 shrink-0">
                          <span className="font-sans text-4xl font-black tracking-tighter leading-none select-none" style={{ color: erColor }}>
                            {activeExpenseRatio}
                          </span>
                          <span className="text-[9px] font-bold select-none" style={{ color: erColor }}>%</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Net Income Card */}
                  <div className="flex justify-between items-start p-5 rounded-2xl bg-[#0E1218]/60 border border-[#161B26] min-h-[130px] hover:border-neutral-700 transition-all duration-300 text-left">
                    <div className="flex flex-col gap-3 text-left max-w-[65%]">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.02] flex items-center justify-center border border-white/5 text-neutral-400 shrink-0">
                        <Coins className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          INGRESO NETO
                        </span>
                        <p className="mt-1 text-[10px] leading-normal text-neutral-500 font-medium">
                          Utilidad neta mensual generada por la unidad.
                        </p>
                      </div>
                    </div>
                    <div className="ml-auto flex items-baseline gap-1 pt-1 shrink-0">
                      <span className="font-sans text-4xl font-black text-white tracking-tighter leading-none select-none">
                        ${Math.round(activeNetIncome).toLocaleString()}
                      </span>
                      <span className="text-[9px] font-bold text-[#0B0C10] uppercase select-none">
                        USD
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTENEDOR GENERAL FASE 2 */}
            <div className="w-full border border-white/[0.08] rounded-[20px] p-6 md:p-8 mb-12 bg-transparent text-left">
              {/* FASE 2: RADIOGRAFÍA OPERATIVA */}
              <AgentSectionHeader 
                fase={2} 
                agent="leakHunter" 
                agentName="El Cazafugas"
                title="Radiografía Operativa" 
                description="Evaluó los pilares que determinan la salud de tu operación." 
                subtitle="¿Cómo se compara tu operación frente a propiedades similares y qué revela ese análisis?"
              />

              {(() => {
                return (
                  <div className="w-full flex flex-col gap-8">
                    
                    {/* BLOQUE 1: POSICIÓN FRENTE AL BENCHMARK */}
                    <div className="w-full flex flex-col gap-4 text-left">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight">
                          POSICIÓN FRENTE AL BENCHMARK
                        </h3>
                        <p className="text-xs md:text-sm text-neutral-400 font-medium mt-1 leading-relaxed">
                          Así se compara la estructura operativa de esta propiedad frente a los valores recomendados por AIRLOCAL para propiedades similares.
                        </p>
                      </div>

                      {/* 2×2 grid: barras arriba-izq · dona arriba-der · contexto abajo-izq · conclusión abajo-der */}
                      <div className="w-full grid grid-cols-1 md:grid-cols-2 rounded-2xl bg-[#0E1218]/60 border border-[#161B26] overflow-hidden">

                        {/* ── Arriba izquierda: Barras ── */}
                        <div className="p-6 md:p-8 border-b border-white/[0.05] md:border-r">
                          <LeakBars
                            labels={radar?.labels}
                            actualPctRevenue={leakRadar?.actual_pct_of_revenue}
                            benchmarkPctRevenue={leakRadar?.benchmark_pct}
                            benchmarkIdealPct={radar?.benchmark_ideal_pct}
                          />
                        </div>

                        {/* ── Arriba derecha: Dona ── */}
                        <div className="p-6 md:p-8 border-b border-white/[0.05]">
                          <LeakDonut
                            tusCostosPct={radar?.tus_costos_pct}
                            labels={radar?.labels}
                            actualCosts={[commissionVal, cleaningVal, servicesVal, maintenanceVal, taxVal, hiddenVal]}
                          />
                        </div>

                        {/* ── Abajo izquierda: Contexto operativo ── */}
                        <div className="p-6 md:p-8 md:border-r border-white/[0.05]">
                          <span className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest block mb-3">
                            CONTEXTO OPERATIVO
                          </span>
                          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <p className="text-neutral-300 text-xs md:text-sm font-semibold leading-relaxed">
                              {cazafugas?.leak_analysis_contexto?.contribucion}
                            </p>
                          </div>
                        </div>

                        {/* ── Abajo derecha: Conclusión ejecutiva ── */}
                        <div className="p-6 md:p-8 flex flex-col gap-3 justify-center">
                          <span className="text-[10px] font-extrabold text-[#00D1B2] uppercase tracking-widest block">
                            CONCLUSIÓN EJECUTIVA
                          </span>
                          <p className="text-white text-lg md:text-xl lg:text-2xl font-bold leading-relaxed">
                            {cazafugas?.conclusion?.mensaje || cazafugas?.status_message || cazafugas?.resumen || ""}
                          </p>
                        </div>

                      </div>
                    </div>

                    {/* BLOQUE 2: ANÁLISIS POR PILARES */}
                    {(() => {
                      // New N8N sends all 4 pillars in fortalezas; deduplicate to avoid doubles
                      const _fromFortalezas = cazafugas?.fortalezas || [];
                      const _fromAtencion = cazafugas?.areas_atencion || [];
                      const _seen = new Set(_fromFortalezas.map((p: any) => p.pilar || p.nombre));
                      const allPilares = [
                        ..._fromFortalezas,
                        ..._fromAtencion.filter((p: any) => !_seen.has(p.pilar || p.nombre))
                      ];

                      const solidPilares = allPilares.filter((p: any) => {
                        const norm = getNormalizedState(p.estado);
                        return norm.label.includes("SÓLIDA");
                      });

                      const opportunityPilares = allPilares.filter((p: any) => {
                        const norm = getNormalizedState(p.estado);
                        return norm.label.includes("ATENCIÓN") || norm.label.includes("CRÍTICA");
                      });

                      return (
                        <div className="w-full bg-[#0E1218]/60 border border-[#161B26] rounded-2xl p-6 md:p-8 flex flex-col gap-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* COLUMNA IZQUIERDA: FORTALEZAS DE LA OPERACIÓN */}
                            <div className="flex flex-col gap-4 text-left">
                              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                                FORTALEZAS DE LA OPERACIÓN
                              </span>
                              <div className="flex flex-col gap-4">
                                {solidPilares.length === 0 && (
                                  <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                                    No se identificaron pilares saludables en esta operación. Todos los indicadores requieren atención prioritaria.
                                  </p>
                                )}
                                {solidPilares.map((fort: any) => {
                                  const normState = getNormalizedState(fort.estado);
                                  const formattedMetric = formatMetrica(fort.nombre || fort.pilar, fort.metrica);
                                  const rawImpact = fort.impacto || fort.texto_impacto || "";
                                  const potentialValue = parsePotencial(rawImpact);
                                  const isRealPotential = !!potentialValue;
                                  const showDescription = rawImpact && !isRealPotential && !rawImpact.toLowerCase().includes("sin ahorro");

                                  return (
                                    <div key={fort.nombre || fort.pilar} className="bg-[#0E1218]/60 border border-[#161B26]/30 rounded-2xl p-6 shadow-lg text-left flex flex-col gap-3 transition-all hover:border-[#2E333C]/30 relative overflow-hidden">
                                      <div className="flex justify-between items-start gap-4">
                                        <h4 className="text-base font-bold text-white uppercase">
                                          {fort.nombre || fort.pilar}
                                        </h4>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shrink-0 ${normState.className}`}>
                                          {normState.label}
                                        </span>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <span className="text-sm text-neutral-300 font-semibold leading-snug">
                                          {formattedMetric.line1}
                                        </span>
                                        {formattedMetric.line2 && (
                                          <span className="text-xs text-neutral-500 font-medium">
                                            {formattedMetric.line2}
                                          </span>
                                        )}
                                      </div>
                                      {isRealPotential && (
                                        <div className="mt-1 pt-3 border-t border-white/[0.03] flex flex-col gap-0.5">
                                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                                            {normState.label.includes("SÓLIDA") ? "Potencial identificado:" : "Potencial confirmado:"}
                                          </span>
                                          <span className="text-base font-mono font-black text-[#00D1B2]">
                                            {potentialValue}
                                          </span>
                                        </div>
                                      )}
                                      {showDescription && (
                                        <p className="text-xs text-neutral-400 leading-relaxed pt-2 border-t border-white/[0.03]">
                                          {rawImpact}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* COLUMNA DERECHA: ÁREAS CON OPORTUNIDAD DE OPTIMIZACIÓN */}
                            <div className="flex flex-col gap-4 text-left">
                              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                                ÁREAS CON OPORTUNIDAD DE OPTIMIZACIÓN
                              </span>
                              <div className="flex flex-col gap-4">
                                {opportunityPilares.map((area: any) => {
                                  const normState = getNormalizedState(area.estado);
                                  const formattedMetric = formatMetrica(area.nombre || area.pilar, area.metrica);
                                  const rawImpact = area.impacto || area.texto_impacto || "";
                                  const potentialValue = parsePotencial(rawImpact);
                                  const isRealPotential = !!potentialValue;
                                  const showDescription = rawImpact && !isRealPotential && !rawImpact.toLowerCase().includes("sin ahorro");

                                  return (
                                    <div key={area.nombre || area.pilar} className="bg-[#0E1218]/60 border border-[#161B26]/30 rounded-2xl p-6 shadow-lg text-left flex flex-col gap-3 transition-all hover:border-[#2E333C]/30 relative overflow-hidden">
                                      <div className="flex justify-between items-start gap-4">
                                        <h4 className="text-base font-bold text-white uppercase">
                                          {area.nombre || area.pilar}
                                        </h4>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shrink-0 ${normState.className}`}>
                                          {normState.label}
                                        </span>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <span className="text-sm text-neutral-300 font-semibold leading-snug">
                                          {formattedMetric.line1}
                                        </span>
                                        {formattedMetric.line2 && (
                                          <span className="text-xs text-neutral-500 font-medium">
                                            {formattedMetric.line2}
                                          </span>
                                        )}
                                      </div>
                                      {isRealPotential && (
                                        <div className="mt-1 pt-3 border-t border-white/[0.03] flex flex-col gap-0.5">
                                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                                            {normState.label.includes("SÓLIDA") ? "Potencial identificado:" : "Potencial confirmado:"}
                                          </span>
                                          <span className="text-base font-mono font-black text-[#00D1B2]">
                                            {potentialValue}
                                          </span>
                                        </div>
                                      )}
                                      {showDescription && (
                                        <p className="text-xs text-neutral-400 leading-relaxed pt-2 border-t border-white/[0.03]">
                                          {rawImpact}
                                        </p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}
            </div>

            {/* SECCIÓN 2: OPORTUNIDADES PRIORIZADAS */}
            <AgentSectionHeader 
              fase={3} 
              agent="strategist" 
              title={estratega.titulo || "PRIORIDADES OPERATIVAS"} 
              description="Priorizó las acciones con mayor impacto económico." 
              subtitle={estratega.introduccion || "¿Qué intervenciones generan el mayor impacto económico?"} 
            />

            {/* Layout Vertical — todas las intervenciones apiladas en orden de prioridad */}
            {intervenciones.length > 0 && (
              <div className="flex flex-col gap-6 w-full text-left mb-4">
                {intervenciones.map((lane: any, index: number) => (
                  <div key={index} className="w-full">
                    {renderMainCard(lane)}
                  </div>
                ))}
              </div>
            )}

            {/* Tarjeta de cierre — RESUMEN con 3 KPIs ancla */}
            {(() => {
              const leaksTotal = activeReport?.leak_analysis?.total_recoverable_monthly || 0;
              const pp = activeReport?.posicionamiento_precio;
              const pricingPotential = (pp?.disponible && pp?.estado === 'BAJO_MERCADO') ? (pp?.potencial_mensual || 0) : 0;
              const grandTotal = leaksTotal + pricingPotential;

              // KPI 1 — Score + estado
              const estadoLabel = riskLevel === 'HIGH' ? 'CRÍTICO' : riskLevel === 'MEDIUM' ? 'VULNERABLE' : 'SALUDABLE';
              const estadoColor = riskLevel === 'HIGH' ? 'text-red-400' : riskLevel === 'MEDIUM' ? 'text-[#F0B432]' : 'text-emerald-400';

              // KPI 3 — Posición tarifaria
              const ppDisponible = pp?.disponible;
              const ppEstado = pp?.estado;
              const ppGapPct = pp?.gap_pct;
              let tarifaLabel = '';
              let tarifaColor = 'text-zinc-500';
              if (!ppDisponible) {
                tarifaLabel = 'Sin datos de mercado';
              } else if (ppEstado === 'SOBRE_MERCADO') {
                tarifaLabel = `+${Math.abs(ppGapPct)}% sobre mercado ⚠`;
                tarifaColor = 'text-[#F0B432]';
              } else if (ppEstado === 'BAJO_MERCADO') {
                tarifaLabel = `${Math.abs(ppGapPct)}% bajo mercado ↗`;
                tarifaColor = 'text-[#00D1B2]';
              } else {
                tarifaLabel = 'Posicionamiento correcto ✓';
                tarifaColor = 'text-emerald-400';
              }

              return (
                <div className="bg-gradient-to-b from-[#1A1D23] to-[#0B0C10] border border-[#2E333C]/40 rounded-3xl p-6 mt-2 mb-8 relative overflow-hidden group text-left w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-[#00D1B2]/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-[#00D1B2]/8 animate-pulse" />

                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-extrabold bg-[#00D1B2]/10 border border-[#00D1B2]/20 text-[#00D1B2] tracking-widest uppercase w-fit mb-5">
                    RESUMEN OPERATIVO DE AUDITORÍA
                  </span>

                  <div className="flex flex-col gap-4 w-full">
                    {/* KPI 1: Score operativo */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-zinc-400">Score operativo</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[11px] font-extrabold uppercase tracking-wider ${estadoColor}`}>{estadoLabel}</span>
                        <span className="text-base font-black text-white tabular-nums">{scoreFinal}/100</span>
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-white/10" />

                    {/* KPI 2: Potencial recuperable */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-zinc-400">Potencial recuperable</span>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-2xl md:text-3xl font-black text-[#00D1B2] tabular-nums leading-none">
                          {grandTotal > 0 ? `+$${grandTotal.toLocaleString('en-US')}` : '$0'} USD/mes
                        </span>
                        {grandTotal > 0 && (
                          <span className="text-xs font-bold text-zinc-500 mt-0.5">+${(grandTotal * 12).toLocaleString('en-US')} USD/año</span>
                        )}
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-white/10" />

                    {/* KPI 3: Posición tarifaria */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-zinc-400">Posición tarifaria</span>
                      <span className={`text-sm font-extrabold tabular-nums shrink-0 ${tarifaColor}`}>{tarifaLabel}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* SECCIÓN 4: SIGUIENTE NIVEL CON FONDO DE MAPA ESTILO PROPIQDATA (FULL SCREEN BREAKOUT) */}
            <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden py-16 mt-8 bg-[#0B0B0C]">
              {/* Background Image Overlay */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <img 
                  src="/hero-map-bg.png" 
                  alt="Background Map" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/60"></div>
              </div>

              <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col items-center">
                <div className="flex flex-col items-center text-center gap-6 max-w-2xl py-8 animate-in fade-in duration-500">
                  <p className="text-base md:text-lg font-semibold text-neutral-400">
                    Ya tienes la foto completa de tu operación.
                  </p>
                  <h2 className="text-[26px] sm:text-[32px] md:text-[38px] font-black text-white leading-tight tracking-tight">
                    Ahora la pregunta es: ¿qué está haciendo tu competencia que tú todavía no ves?
                  </h2>
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsBetaModalOpen(true)}
                      className="bg-[#00D1B2] hover:bg-[#00D1B2]/90 text-[#0B0B0C] font-extrabold text-sm uppercase tracking-widest px-8 py-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-[1.02] font-sans"
                    >
                      Descubrir el punto ciego de mi competencia →
                    </button>
                    <span className="text-[9px] font-extrabold text-neutral-500 uppercase tracking-widest mt-1">
                      Powered by AIRLOCAL Revenue Intelligence
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!isUnlocked && (
            <div className="absolute inset-x-0 top-12 flex flex-col items-center justify-start z-30 px-4">
              <div className="w-full max-w-2xl text-center flex flex-col items-center gap-6 py-10 backdrop-blur-sm">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00D1B2]/20 bg-[#00D1B2]/10 text-[#00D1B2] text-[10px] font-bold tracking-widest uppercase">
                  🔒 CONTENIDO EXCLUSIVO
                </div>

                {/* Dynamic headline */}
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight max-w-lg leading-tight">
                  ENCONTRAMOS +${formattedHeroMensual} USD/MES ATRAPADOS.
                </h3>

                {/* Sub headline */}
                <div className="flex flex-col gap-1">
                  <p className="text-zinc-300 text-sm md:text-base font-semibold">La Auditoría EXPRESS te mostró el problema.</p>
                  <p className="text-[#00D1B2] text-sm md:text-base font-bold">La Auditoría Operativa te da el plan exacto.</p>
                </div>

                {/* Icon rows */}
                <div className="flex flex-col gap-5 w-full max-w-xs text-left">
                  {([
                    { img: '/assets/icon-guardian.webp', q: '¿es viable seguir así?' },
                    { img: '/assets/icon-cazafugas.webp', q: '¿dónde exactamente se pierde?' },
                    { img: '/assets/icon-estratega.webp', q: '¿qué mueves primero?' },
                  ] as { img: string; q: string }[]).map(({ img, q }) => (
                    <div key={q} className="flex items-center gap-4">
                      <img src={img} alt="" style={{ width: 48, height: 48, objectFit: 'contain', flexShrink: 0 }} />
                      <span className="text-zinc-200 text-sm font-semibold">{q}</span>
                    </div>
                  ))}
                </div>

                {/* CTA + microcopy + share */}
                <div className="flex flex-col items-center gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPlaceholderForm(true);
                      setTimeout(() => {
                        document.getElementById('formulario-premium')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 80);
                    }}
                    className="w-full max-w-md bg-[#00D1B2] hover:bg-[#00D1B2]/90 text-[#0B0B0C] font-extrabold text-xs md:text-sm uppercase tracking-widest px-8 py-4 rounded-full shadow-[0_0_30px_rgba(0,209,178,0.35)] transition-all duration-300 hover:scale-[1.02] font-sans"
                  >
                    VER MI DIAGNÓSTICO OPERATIVO →
                  </button>

                  <span className="text-[9px] font-extrabold text-neutral-500 uppercase tracking-widest">
                    ACCESO INSTANTÁNEO · DIAGNÓSTICO 100% PERSONALIZADO
                  </span>

                  {n8nReport?.id && (
                    <div className="mt-3 flex flex-col items-center gap-2">
                      <span className="text-zinc-500 text-xs">¿Quieres que otra persona sepa cómo está su BNB?</span>
                      <button
                        type="button"
                        onClick={async () => {
                          const url = `${window.location.origin}/r/${n8nReport.id}`;
                          try {
                            if (navigator.share) {
                              await navigator.share({ title: 'Mi Diagnóstico Express · AIRLOCAL', url });
                            } else {
                              await navigator.clipboard.writeText(url);
                              setLinkCopied(true);
                              setTimeout(() => setLinkCopied(false), 3000);
                            }
                          } catch {}
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#00D1B2]/30 bg-[#00D1B2]/5 hover:bg-[#00D1B2]/15 text-[#00D1B2] text-xs font-bold uppercase tracking-wider transition-all duration-200"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        {linkCopied ? 'Enlace copiado ✓' : 'Compartir mi resultado'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
        )
      ) : currentStep > 0 ? (
        /* FORM CONTAINER PARA PASOS 1-4 Y CARGA */
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Glow de fondo */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#00D1B2]/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#00D1B2]/5 rounded-full blur-[100px] pointer-events-none"></div>
          
          {isFetchingReport || isSubmitting ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
              <div className="relative w-20 h-20 mb-6 flex items-center justify-center mx-auto">
                <div className="w-12 h-12 border-4 border-[#00D1B2]/20 border-t-[#00D1B2] rounded-full animate-spin"></div>
                <div className="absolute inset-0 rounded-full bg-[#00D1B2]/5 blur-lg animate-pulse"></div>
              </div>
              <p className="text-sm font-extrabold text-[#00D1B2] uppercase tracking-[0.15em] mb-2">
                Conectando con AIRLOCAL...
              </p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                Estamos analizando tus datos reales para generar tu Reporte de Auditoría Premium 100% nítido y sin blur.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
            
            {/* PASO 1: IDENTIFICACIÓN Y TIPO */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-white/5 pb-4 mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-[#00D1B2] font-black">01.</span> Información General de la Propiedad
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">Identifica tu propiedad de alojamiento. Tu email se ha heredado silenciosamente del paso previo.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Property Name */}
                  <div className="flex flex-col gap-2 md:col-span-1">
                    <label htmlFor="property_name" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Nombre de la Propiedad <span className="text-[#00D1B2]">*</span>
                    </label>
                    <input
                      type="text"
                      id="property_name"
                      name="property_name"
                      value={formData.property_name}
                      onChange={handleInputChange}
                      required
                      placeholder="Ej. Villa Coral, Apartamento Chacao, Loft Centro..."
                      className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#00D1B2] focus:ring-1 focus:ring-[#00D1B2] transition-all"
                    />
                  </div>

                  {/* Country */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="country" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      País
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Ej. España"
                      className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#00D1B2] focus:ring-1 focus:ring-[#00D1B2] transition-all"
                    />
                  </div>

                  {/* City */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Ej. Barcelona"
                      className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#00D1B2] focus:ring-1 focus:ring-[#00D1B2] transition-all"
                    />
                  </div>
                </div>

                {/* Property Type Grid Selector */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Tipo de Propiedad
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {['Casa completa', 'Apartamento', 'Villa', 'Habitación', 'Otros'].map((type) => {
                      const isSelected = formData.property_type === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleSelectPropertyType(type)}
                          className={`py-3.5 px-2 rounded-xl border text-xs font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-[#00D1B2]/10 border-[#00D1B2] text-[#00D1B2] shadow-[0_0_15px_rgba(0,209,178,0.1)]'
                              : 'bg-[#18181A] border-white/5 text-zinc-400 hover:border-white/20'
                          }`}
                        >
                          <span>{type}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tipo de Mercado Grid Selector */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Tipo de Mercado
                    </label>
                    <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
                      ¿Qué tipo de demanda genera la mayor parte de tus reservas?
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "🏙️ Urbano / Negocios", value: "urban" },
                      { label: "🏖️ Vacacional / Turismo", value: "vacacional" }
                    ].map((opt) => {
                      const isSelected = formData.market_type === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSelectMarketType(opt.value)}
                          className={`py-3.5 px-4 rounded-xl border text-xs font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-[#00D1B2]/10 border-[#00D1B2] text-[#00D1B2] shadow-[0_0_15px_rgba(0,209,178,0.1)]'
                              : 'bg-[#18181A] border-white/5 text-zinc-400 hover:border-white/20'
                          }`}
                        >
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Huéspedes, Habitaciones, Baños */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Huéspedes */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="max_guests" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      ¿Cuántos huéspedes máximo?
                    </label>
                    <input
                      type="number"
                      id="max_guests"
                      name="max_guests"
                      value={formData.max_guests}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="Ej. 4"
                      className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#00D1B2] focus:ring-1 focus:ring-[#00D1B2] transition-all font-mono"
                    />
                  </div>

                  {/* Habitaciones */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="bedrooms" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      ¿Cuántas habitaciones?
                    </label>
                    <input
                      type="number"
                      id="bedrooms"
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="Ej. 2"
                      className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#00D1B2] focus:ring-1 focus:ring-[#00D1B2] transition-all font-mono"
                    />
                  </div>

                  {/* Baños */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="bathrooms" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      ¿Cuántos baños?
                    </label>
                    <input
                      type="number"
                      id="bathrooms"
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      required
                      min="1"
                      placeholder="Ej. 1"
                      className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#00D1B2] focus:ring-1 focus:ring-[#00D1B2] transition-all font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASO 2: DIAGNÓSTICO RÁPIDO */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-white/5 pb-4 mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-[#00D1B2] font-black">02.</span> Diagnóstico Rápido de la Propiedad
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Ingresa las cifras financieras y de ocupación aproximadas de tu propiedad para evaluar su salud operativa.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ingreso Mensual */}
                  <div className="flex flex-col gap-2 bg-[#18181A] p-4 rounded-xl border border-white/5">
                    <label htmlFor="gross_income" className="text-xs font-bold uppercase tracking-wider text-[#00D1B2]">
                      INGRESO MENSUAL ESTIMADO (USD)
                    </label>
                    <div className="relative flex items-center mt-1">
                      <span className="absolute left-4 text-zinc-500 font-bold">$</span>
                      <input
                        type="number"
                        id="gross_income"
                        name="gross_income"
                        min="0"
                        placeholder="Ej. 3000"
                        value={formData.gross_income}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        className="w-full bg-[#0B0B0C] border border-white/10 rounded-lg pl-8 pr-4 py-3 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-[#00D1B2] transition-all font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500">Suma total aproximada cobrada en reservas este mes.</span>
                  </div>

                  {/* Gastos Aproximados */}
                  <div className="flex flex-col gap-2 bg-[#18181A] p-4 rounded-xl border border-white/5">
                    <label htmlFor="approximate_expenses" className="text-xs font-bold uppercase tracking-wider text-[#00D1B2]">
                      GASTOS OPERATIVOS APROXIMADOS (USD)
                    </label>
                    <div className="relative flex items-center mt-1">
                      <span className="absolute left-4 text-zinc-500 font-bold">$</span>
                      <input
                        type="number"
                        id="approximate_expenses"
                        name="approximate_expenses"
                        min="0"
                        placeholder="Ej. 1400"
                        value={formData.approximate_expenses}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        className="w-full bg-[#0B0B0C] border border-white/10 rounded-lg pl-8 pr-4 py-3 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-[#00D1B2] transition-all font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500">Suma estimada de todos tus costos mensuales de operación.</span>
                  </div>

                  {/* competitive_adr */}
                  <div className="flex flex-col gap-2 bg-[#18181A] p-4 rounded-xl border border-white/5 md:col-span-2">
                    <label htmlFor="competitive_adr" className="text-xs font-bold uppercase tracking-wider text-[#00D1B2]">
                      ¿Precio promedio por noche en tu zona?
                    </label>
                    <div className="relative flex items-center mt-1">
                      <input
                        type="number"
                        id="competitive_adr"
                        name="competitive_adr"
                        min="0"
                        placeholder="Ej. 250"
                        value={formData.competitive_adr}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        className="w-full bg-[#0B0B0C] border border-white/10 rounded-lg px-4 py-3 text-base text-white focus:outline-none focus:border-[#00D1B2] transition-all font-mono"
                      />
                    </div>
                    <div className="mt-2 flex items-start gap-2 rounded-lg bg-[#F0B432]/10 border border-[#F0B432]/20 px-3 py-2">
                      <span className="text-[#F0B432] text-sm leading-none mt-0.5 shrink-0">⚠</span>
                      <span className="text-[11px] text-[#F0B432]/80 leading-relaxed">
                        Opcional, pero de alto impacto. Si lo completas, usa el precio real de propiedades similares en tu zona — un valor incorrecto puede distorsionar las conclusiones del reporte.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Occupied Nights */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="occupied_nights" className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex justify-between">
                      <span>Noches Ocupadas en el Período</span>
                      <span className="text-[#00D1B2] font-bold">{formData.occupied_nights} noches</span>
                    </label>
                    <input
                      type="range"
                      id="occupied_nights"
                      name="occupied_nights"
                      min="0"
                      max="31"
                      value={formData.occupied_nights}
                      onChange={handleInputChange}
                      className="w-full h-1.5 bg-[#18181A] rounded-lg appearance-none cursor-pointer accent-[#00D1B2] focus:outline-none"
                    />
                    <span className="text-[10px] text-zinc-500">Número de noches ocupadas estimadas en el mes.</span>
                  </div>

                  {/* Available Nights */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="available_nights" className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex justify-between">
                      <span>Noches Disponibles en el Período</span>
                      <span className="text-[#00D1B2] font-bold">{formData.available_nights} noches</span>
                    </label>
                    <input
                      type="range"
                      id="available_nights"
                      name="available_nights"
                      min="0"
                      max="31"
                      value={formData.available_nights}
                      onChange={handleInputChange}
                      className="w-full h-1.5 bg-[#18181A] rounded-lg appearance-none cursor-pointer accent-[#00D1B2] focus:outline-none"
                    />
                    <span className="text-[10px] text-zinc-500">Noches totales que estuvo disponible tu unidad.</span>
                  </div>
                </div>
              </div>
            )}

            {/* PASO 3: EMAIL */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-white/5 pb-4 mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-[#00D1B2] font-black">03.</span> Registro de Contacto
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Ingresa tu correo electrónico para recibir una copia del diagnóstico y guardar tu sesión.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Correo Electrónico <span className="text-[#00D1B2]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ej. usuario@propiqdata.com"
                    className="w-full bg-[#18181A] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#00D1B2] focus:ring-1 focus:ring-[#00D1B2] transition-all font-sans"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1">Nunca compartiremos tus datos con terceros.</span>
                </div>
              </div>
            )}

            {/* ERROR MESSAGE PANEL */}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs font-medium animate-pulse">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* BUTTONS NAVIGATION */}
            {currentStep > 0 && <div className="flex justify-between items-center pt-6 border-t border-white/5">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-white/10 hover:bg-white/5 text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Atrás
                </button>
              ) : (
                <div /> // Spacer
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-7 py-3 bg-[#00D1B2] text-[#0B0B0C] hover:bg-[#00FFD1] text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-[0_0_15px_rgba(0,209,178,0.2)] flex items-center gap-2"
                >
                  Siguiente →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-gradient-to-r from-[#00D1B2] to-[#00FFD1] text-[#0B0B0C] font-bold text-xs uppercase tracking-widest rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,209,178,0.3)] hover:scale-105 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#0B0B0C] border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    'Enviar diagnóstico a mi email'
                  )}
                </button>
              )}
            </div>}
          </div>
        )}
      </div>
      ) : null
    }
      {/* MODAL BETA DE TALLY / CAPTURA DE CORREO */}
      {isBetaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-[#1A1D23] border border-[#2E333C] rounded-2xl shadow-2xl shadow-black/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] p-6 md:p-8 text-left overflow-hidden">
            {/* Glow decorativo de fondo */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00B894]/10 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[9px] font-black text-[#00B894] bg-[#00B894]/10 px-2 py-0.5 rounded-full uppercase tracking-widest block mb-2 w-max">
                  🚀 LISTA DE ESPERA
                </span>
                <h3 className="text-lg md:text-xl font-black text-white leading-tight uppercase">
                  Acceso Exclusivo Beta
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setIsBetaModalOpen(false);
                  setIsBetaSubmitted(false);
                  setBetaEmail('');
                }}
                className="text-zinc-500 hover:text-white transition-colors p-1"
              >
                ✕
              </button>
            </div>

            {!isBetaSubmitted ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (betaEmail.trim()) {
                    setIsBetaSubmitted(true);
                    if (supabaseClient) {
                      supabaseClient
                        .from('beta_signups')
                        .insert([{ email: betaEmail, source: 'auditoria_radar', created_at: new Date().toISOString() }])
                        .then(
                          () => { console.log('Waitlist registered.'); },
                          (err: any) => { console.error(err); }
                        );
                    }
                  }
                }}
                className="flex flex-col gap-4"
              >
                <p className="text-xs md:text-sm text-neutral-400 leading-relaxed font-medium">
                  Sé parte de los primeros gestores en automatizar sus métricas y cerrar fugas financieras. Ingresa tu correo para recibir tu invitación de acceso prioritaria:
                </p>
                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Tu correo electrónico principal..."
                    value={betaEmail}
                    onChange={(e) => setBetaEmail(e.target.value)}
                    className="w-full bg-black/40 border border-[#2E333C] rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#00B894] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-6 py-3.5 bg-[#00B894] hover:bg-[#00B894]/90 text-[#0B0B0C] font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-[#00B894]/20 hover:scale-[1.01] duration-300"
                >
                  Confirmar mi Registro Prioritario
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-95 duration-300">
                <div className="w-12 h-12 rounded-full bg-[#00B894]/10 border border-[#00B894]/20 text-[#00B894] flex items-center justify-center mb-4">
                  ✓
                </div>
                <h4 className="text-base font-black text-white mb-2 uppercase">¡Registro Completado con Éxito!</h4>
                <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
                  Te hemos guardado un lugar preferencial en la lista de testers. Te notificaremos en cuanto liberemos las primeras invitaciones de conexión iCal.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsBetaModalOpen(false);
                    setIsBetaSubmitted(false);
                    setBetaEmail('');
                  }}
                  className="mt-6 px-5 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* POPUP VALIDACIÓN */}
      {validationMsg && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setValidationMsg('')}>
          <div
            className="relative w-full max-w-sm bg-[#121318] border border-[#00D1B2]/30 rounded-2xl p-6 shadow-[0_0_60px_rgba(0,209,178,0.15)] text-center animate-in fade-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-[#00D1B2]/10 border border-[#00D1B2]/20 flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00D1B2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-[#00D1B2] mb-2">Campo requerido</p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-6">{validationMsg}</p>
            <button
              onClick={() => setValidationMsg('')}
              className="w-full bg-[#00D1B2] hover:bg-[#00bfa3] text-[#0B0B0C] font-bold text-sm py-3 rounded-xl transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* MODAL CHECKOUT PAYPAL REPLICA */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-[460px] bg-[#F5F7FA] rounded-2xl shadow-2xl overflow-hidden text-left flex flex-col font-sans border border-zinc-200">
            {/* Header Close button */}
            <button 
              type="button"
              onClick={() => {
                setIsCheckoutModalOpen(false);
                setAccessCode('');
                setCheckoutError('');
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 transition-colors text-lg p-1.5"
            >
              ✕
            </button>

            {/* Content Container */}
            <div className="p-8 flex flex-col items-center">
              {/* Logo AIRLOCAL */}
              <div className="mb-6 flex items-center gap-1.5">
                <span className="text-xl font-black text-[#0B0B0C] tracking-tight uppercase">AIRLOCAL</span>
                <span className="h-4 w-[2px] bg-[#00D1B2]" />
                <span className="text-xs font-bold text-[#00D1B2] tracking-widest uppercase">RADAR</span>
              </div>

              {/* Title & Description */}
              <div className="w-full text-center mb-6">
                <h3 className="text-lg md:text-xl font-bold text-[#0B0B0C] tracking-tight">
                  Auditoría Operativa AIRLOCAL
                </h3>
                <p className="text-xs text-zinc-500 mt-2 font-medium leading-relaxed max-w-sm mx-auto">
                  Análisis completo de tu operación STR: desglose de fugas, oportunidades de rescate y plan de acción prioritario para los próximos 30 días.
                </p>
              </div>

              {/* Price Tag */}
              <div className="w-full bg-white border border-zinc-200 rounded-2xl p-5 mb-6 text-center shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <span className="text-zinc-500 text-xs font-semibold block mb-0.5 uppercase tracking-wider">TOTAL A PAGAR</span>
                <span className="text-3xl font-black text-zinc-400 tracking-tight block mb-1 line-through decoration-red-500 decoration-2">$47,00 USD</span>
                <span className="text-xs font-bold text-[#008F79] block mb-2">↓ Acceso gratuito con código beta</span>
                <span 
                  onClick={() => {
                    setAccessCode('BETA2026');
                    if (checkoutError) setCheckoutError('');
                  }}
                  className="text-[12px] font-bold text-[#008F79] bg-[#00D1B2]/10 border border-[#00D1B2]/20 rounded-full px-3.5 py-1 inline-block select-all cursor-pointer active:scale-[0.98] transition-all"
                >
                  Código de acceso beta: BETA2026
                </span>
              </div>

              {/* Checkout Form */}
              <div className="w-full flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="checkout_access_code" className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                    Código de acceso (beta testers)
                  </label>
                  <input
                    type="text"
                    id="checkout_access_code"
                    name="access_code"
                    placeholder="Ej: BETA2026"
                    required
                    autoComplete="off"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value);
                      if (checkoutError) setCheckoutError('');
                    }}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-3.5 text-base text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087] shadow-inner transition-all font-mono text-center tracking-widest font-bold"
                  />
                  {checkoutError && (
                    <span className="text-xs font-bold text-red-600 animate-pulse mt-0.5 text-center">
                      ⚠ {checkoutError}
                    </span>
                  )}
                </div>

                {/* Botón PayPal Style (amarillo/naranja grande o gris desactivado) */}
                <button
                  type="button"
                  onClick={handleConfirmCheckout}
                  className={`w-full font-black text-sm uppercase tracking-widest py-4 rounded-full transition-all flex items-center justify-center gap-2 mt-2 ${
                    accessCode.toUpperCase() === 'BETA2026'
                      ? 'bg-[#FFC439] hover:bg-[#F2B224] text-[#003087] shadow-[0_4px_14px_rgba(255,196,57,0.4)] hover:scale-[1.01]'
                      : 'bg-zinc-300 text-zinc-500 cursor-not-allowed opacity-75'
                  }`}
                >
                  Confirmar y acceder
                </button>

                {/* Card logos replica from image */}
                <div className="flex items-center justify-center gap-2 text-zinc-400 text-[10px] font-extrabold uppercase tracking-wider mt-2 select-none">
                  <span className="px-2.5 py-1 border border-zinc-200 rounded-md bg-white text-[#003087] text-[9px] font-black">PayPal</span>
                  <span className="px-2.5 py-1 border border-zinc-200 rounded-md bg-white text-[#1A1F71] text-[9px] font-black italic">VISA</span>
                  <span className="px-2.5 py-1 border border-zinc-200 rounded-md bg-white text-[#EB001B] text-[9px] font-black">MC</span>
                  <span className="text-[9px] font-bold text-zinc-500">+more</span>
                </div>

                {/* Cancel Link */}
                <button
                  type="button"
                  onClick={() => {
                    setIsCheckoutModalOpen(false);
                    setAccessCode('');
                    setCheckoutError('');
                  }}
                  className="text-xs font-bold text-[#003087]/70 hover:text-[#003087] hover:underline transition-colors mt-2 text-center"
                >
                  Cancelar y volver
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[#ECEFF1] border-t border-zinc-200 py-3 text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Versión beta - Acceso ilimitado
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuditoriaTestPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <style>{`
        .al-bg-layer{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
        .al-bg-grid{
          position:absolute;inset:-10%;
          background-image:linear-gradient(rgba(37,43,33,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(37,43,33,0.6) 1px,transparent 1px);
          background-size:64px 64px;opacity:0.18;
          mask-image:radial-gradient(ellipse 70% 60% at 50% 20%,black 40%,transparent 85%);
        }
        .al-bg-radar{
          position:absolute;top:-320px;left:50%;transform:translateX(-50%);
          width:1100px;height:1100px;border-radius:50%;
          border:1px solid rgba(37,43,33,0.9);opacity:0.55;
        }
        .al-bg-radar::before,.al-bg-radar::after{
          content:'';position:absolute;border-radius:50%;border:1px solid rgba(37,43,33,0.9);
        }
        .al-bg-radar::before{inset:140px;}
        .al-bg-radar::after{inset:280px;}
        .al-bg-sweep{
          position:absolute;top:-320px;left:50%;width:1100px;height:1100px;
          transform-origin:50% 50%;
          background:conic-gradient(from 0deg,rgba(52,245,197,0.18),transparent 22%);
          border-radius:50%;transform:translateX(-50%);
          animation:al-sweep 7s linear infinite;mix-blend-mode:screen;
          display:none;
        }
        body[data-auditoria-step="0"] .al-bg-sweep { display:block; }
        @keyframes al-sweep{to{transform:translateX(-50%) rotate(360deg);}}
        .al-bg-map{
          position:absolute;inset:0;background-size:cover;background-position:center;
          opacity:0.4;filter:saturate(0.9) contrast(1.05);
          mask-image:radial-gradient(ellipse 75% 65% at 50% 35%,black 30%,transparent 88%);
          -webkit-mask-image:radial-gradient(ellipse 75% 65% at 50% 35%,black 30%,transparent 88%);
        }
        .al-bg-map-scrim{
          position:absolute;inset:0;
          background:radial-gradient(ellipse 60% 55% at 50% 32%,rgba(11,11,12,0.82) 0%,rgba(11,11,12,0.45) 55%,rgba(11,11,12,0.05) 100%);
        }
        .al-form-fields input[placeholder]:not(:placeholder-shown){
          border-color:rgba(0,209,178,0.38) !important;
        }
        .al-form-fields input[placeholder]:focus{
          border-color:rgba(0,209,178,1) !important;
          box-shadow:0 0 0 1px rgba(0,209,178,0.22) !important;
          outline:none !important;
        }
      `}</style>
      <main className="min-h-screen bg-[#0B0B0C] text-[#eeeeee] font-sans selection:bg-[#00FFD1]/30 flex flex-col overflow-x-hidden">

        {/* FONDO: mapa satélite + grid + radar + sweep — idéntico a la landing */}
        <div className="al-bg-layer">
          <div className="al-bg-map" style={{backgroundImage:"url('/assets/hero-map-bg.webp')"}}></div>
          <div className="al-bg-map-scrim"></div>
          <div className="al-bg-grid"></div>
          <div className="al-bg-radar"></div>
          <div className="al-bg-sweep"></div>
        </div>

        {/* NAV */}
        <header style={{position:'sticky',top:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 6vw',borderBottom:'1px solid #252b21',backdropFilter:'blur(6px)',background:'rgba(10,12,10,0.85)'} as React.CSSProperties}>
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
            <img src="/assets/logo-mark.webp" alt="AIRLOCAL" style={{height:36,width:'auto',display:'block',filter:'drop-shadow(0 0 8px rgba(52,245,197,0.35))'}} />
            <div style={{display:'flex',flexDirection:'column',lineHeight:1.2}}>
              <span style={{fontFamily:'Montserrat,sans-serif',fontWeight:800,fontSize:14,letterSpacing:'0.03em',color:'#f3f5ef'}}>AIRLOCAL</span>
              <span style={{fontSize:10.5,color:'#98a190',letterSpacing:'0.03em'}}>Inteligencia operativa | BNB</span>
            </div>
          </Link>
          <Link href="/" style={{fontFamily:'Inter,sans-serif',fontWeight:600,fontSize:13,color:'#98a190',textDecoration:'none',letterSpacing:'0.02em'}}>← Inicio</Link>
        </header>

        {/* Outer content container */}
        <div className="al-form-fields flex-1 w-full max-w-[1440px] mx-auto flex flex-col pt-16 md:pt-24 pb-12 px-4 sm:px-8 lg:px-12" style={{position:'relative',zIndex:1}}>
          
          {/* 3. MULTI-STEP NATIVE FORM COMPONENT */}
          <AuditoriaFormContent />

        </div>

        {/* FOOTER */}
        <footer style={{position:'relative',zIndex:5,padding:'40px 6vw 30px',borderTop:'1px solid #252b21',background:'#0d100d'}}>
          <div style={{maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:18}}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <img src="/assets/logo-mark.webp" alt="AIRLOCAL" style={{height:26,width:'auto',display:'block',filter:'drop-shadow(0 0 8px rgba(52,245,197,0.35))'}} />
              <span style={{fontSize:12.5,color:'#98a190'}}>AIRLOCAL™ by propiqdata.com</span>
            </div>
            <div style={{display:'flex',gap:22,fontSize:12.5}}>
              <a href="#" style={{color:'#98a190',textDecoration:'none'}}>Términos</a>
              <a href="#" style={{color:'#98a190',textDecoration:'none'}}>Privacidad</a>
              <a href="mailto:soporte@propiqdata.com" style={{color:'#98a190',textDecoration:'none'}}>soporte@propiqdata.com</a>
            </div>
          </div>
          <div style={{maxWidth:1100,margin:'22px auto 0',paddingTop:18,borderTop:'1px solid #252b21',fontSize:11.5,color:'#666f60',textAlign:'center'}}>
            © 2026 AIRLOCAL
          </div>
        </footer>
      </main>
    </Suspense>
  );
}
