// ════════════════════════════════════════════════════════════
// RR_FREE_ENGINE — Diagnóstico Inicial (AIRLOCAL)
// VERSIÓN B FINAL: Detección Híbrida + Competitive ADR
// ════════════════════════════════════════════════════════════

// 1. Extractor
const rawData = $json.body || $json;
const fields = rawData?.data?.fields || rawData?.fields || [];

const getFieldValue = (label) => {
  if (fields.length > 0) {
    const field = fields.find(f => f.label && f.label.toLowerCase() === label.toLowerCase());
    if (field && field.value !== undefined) return field.value;
  }
  if (rawData[label] !== undefined) return rawData[label];
  const alternativeKeys = {
    "hidden_costs": ["Hidden_cost", "hidden_costs", "hidden_cost"]
  };
  if (alternativeKeys[label]) {
    for (const altKey of alternativeKeys[label]) {
      if (rawData[altKey] !== undefined) return rawData[altKey];
    }
  }
  return null;
};

const safeNum = (val) => isNaN(Number(val)) ? 0 : Number(val);

const input = {
  property_name: getFieldValue("property_name") || "Mi Propiedad",
  city: getFieldValue("city") || "Tu Ciudad",
  country: getFieldValue("country") || "Tu País",
  market_type: getFieldValue("market_type") || "urban",
  max_guests: safeNum(getFieldValue("max_guests") || getFieldValue("Max_guest")),
  bedrooms: safeNum(getFieldValue("bedrooms")),
  bathrooms: safeNum(getFieldValue("bathrooms")),
  occupied_nights: safeNum(getFieldValue("occupied_nights")),
  available_nights: safeNum(getFieldValue("available_nights") || 30),
  gross_income: safeNum(getFieldValue("gross_income")),
  total_costs: safeNum(getFieldValue("hidden_costs")),
  competitive_adr: safeNum(getFieldValue("competitive_adr")) // NUEVO
};

// 2. Cálculos financieros
const total_costs = input.total_costs;
const net_income = input.gross_income - total_costs;
const expense_ratio = input.gross_income > 0 ? Math.round((total_costs / input.gross_income) * 100) : 0;
const avg_price = input.occupied_nights > 0 ? (input.gross_income / input.occupied_nights) : 0;
const ocupacion_pct = input.available_nights > 0 ? Math.min(100, Math.round((input.occupied_nights / input.available_nights) * 100)) : 0;
const occupancyTarget = input.market_type === "vacacional" ? 50 : 65;

const break_even_nights = avg_price > 0 ? Math.round(total_costs / avg_price) : 0;
const nochesParaPerdida = net_income > 0 ? Math.max(0, input.occupied_nights - break_even_nights) : 0;
const netMarginPct = input.gross_income > 0 ? (net_income / input.gross_income) * 100 : 0;

// 3. Estado de Salud
let tension;
if (net_income <= 0 || nochesParaPerdida <= 2) {
  tension = "CRITICO";
} else if (expense_ratio >= 45 || nochesParaPerdida <= 7) {
  tension = "VULNERABLE";
} else {
  tension = "SALUDABLE";
}

// 4. VERSIÓN B FINAL - DETECCIÓN HÍBRIDA CON COMPETITIVE ADR
const noches_objetivo = Math.round(input.available_nights * (occupancyTarget / 100));
const noches_faltantes = Math.max(0, noches_objetivo - input.occupied_nights);

// ELEMENTO 1: Potencial de FUGAS
// Benchmarks: Vacacional 50%, Urban 58% (validados contra STR industry standards)
const expense_ratio_frac = input.gross_income > 0 ? (total_costs / input.gross_income) : 0;
const benchmarkExpenseRatio = input.market_type === "vacacional" ? 0.50 : 0.58;
const excesoExpenseRatio = Math.max(0, expense_ratio_frac - benchmarkExpenseRatio);
const potencial_fugas = Math.round(input.gross_income * excesoExpenseRatio);

// ELEMENTO 2: Potencial de OCUPACIÓN
const costo_fijo_noche = input.occupied_nights > 0 ? (total_costs / input.occupied_nights) : 0;
const margen_neto_noche = Math.max(0, avg_price - costo_fijo_noche);
const potencial_ocupacion = noches_faltantes > 0 
  ? Math.round(noches_faltantes * margen_neto_noche)
  : 0;

// ELEMENTO 3: Potencial de PRICING (con lógica competitive_adr)
let potencial_pricing = 0;
let argumento_pricing = "";

if (input.competitive_adr && input.competitive_adr > 0) {
  // Usuario proporcionó competitive ADR → calcular gap real
  const adr_gap = input.competitive_adr - avg_price;
  if (adr_gap > 0) {
    potencial_pricing = Math.round(adr_gap * input.occupied_nights);
    argumento_pricing = `subiendo tu precio $${Math.round(adr_gap)} USD por noche (tu ADR actual: $${Math.round(avg_price)} vs mercado: $${Math.round(input.competitive_adr)}).`;
  } else {
    potencial_pricing = 0;
    argumento_pricing = "tu precio ya está competitivo en el mercado.";
  }
} else {
  // Usuario NO proporcionó competitive ADR → usar 10% conservador
  if (ocupacion_pct >= occupancyTarget) {
    potencial_pricing = Math.round(input.gross_income * 0.10);
    argumento_pricing = "optimizando tu estrategia de precios en días de alta demanda.";
  }
}

// ESTRATEGIA: Máximo de los tres
let flujo_rescatable_mes = Math.max(
  potencial_fugas,
  potencial_ocupacion,
  potencial_pricing
);

// NARRATIVA: Identificar qué es el gancho
let argumento_rescate = "";
if (flujo_rescatable_mes === potencial_fugas && potencial_fugas > 0) {
  argumento_rescate = "reduciendo fugas operativas en comisiones, limpieza y servicios.";
} else if (flujo_rescatable_mes === potencial_ocupacion && potencial_ocupacion > 0) {
  argumento_rescate = `capturando las ${noches_faltantes} noches vacías faltantes para alcanzar ${occupancyTarget}% ocupación.`;
} else if (flujo_rescatable_mes === potencial_pricing && potencial_pricing > 0) {
  argumento_rescate = argumento_pricing;
} else {
  flujo_rescatable_mes = Math.round(total_costs * 0.10);
  argumento_rescate = "con ajustes estratégicos en tu estructura de ingresos y gastos.";
}

const recuperacionAnualTotal = flujo_rescatable_mes * 12;

// 5. Narrativa
let headline, introTexto, riskLevel, cabeceraRiskLevel, cabeceraHeadline, cabeceraIntro;
let colchonTitulo, colchonLabel, colchonValor;

if (tension === "CRITICO") {
  riskLevel = "high";
  cabeceraRiskLevel = "HIGH";
  headline = "AUDITORÍA: RIESGO OPERATIVO CRÍTICO";
  cabeceraHeadline = headline;
  introTexto = "Tu operación actual no está logrando cubrir sus costos de manera consistente.";
  cabeceraIntro = "Tus costos operativos consumen la mayor parte de tus ingresos. Tu operación se encuentra en zona de pérdida.";
  colchonTitulo = "Tu operación ya está EN PÉRDIDA";
  colchonLabel = "CADA MES SIN AJUSTAR TE CUESTA DINERO";
  colchonValor = null;
} else if (tension === "VULNERABLE") {
  riskLevel = "medium";
  cabeceraRiskLevel = "MEDIUM";
  headline = "AUDITORÍA: MARGEN OPERATIVO TENSO";
  cabeceraHeadline = headline;
  introTexto = "Tu estructura de ingresos y gastos indica una operación vulnerable.";
  cabeceraIntro = `Tu estructura de gastos es elevada (${expense_ratio}%). Tu rentabilidad es vulnerable.`;
  colchonTitulo = `Estás a ${nochesParaPerdida} noches`;
  colchonLabel = "DE ENTRAR EN PÉRDIDA";
  colchonValor = nochesParaPerdida;
} else {
  riskLevel = "low";
  cabeceraRiskLevel = "LOW";
  headline = "AUDITORÍA: OPERACIÓN SALUDABLE";
  cabeceraHeadline = headline;
  introTexto = "Tu propiedad se encuentra en un rango de control saludable.";
  cabeceraIntro = "Tu operación genera utilidad. Pero antes de escalar a una segunda propiedad, asegura que entiendes dónde se filtra el dinero en ésta.";
  colchonTitulo = `Tienes ${nochesParaPerdida} noches de colchón`;
  colchonLabel = "PERO CADA DECISIÓN DE PRECIO O OCUPACIÓN DEFINE TU PRÓXIMA UNIDAD";
  colchonValor = nochesParaPerdida;
}

const cabecera = {
  risk_level: cabeceraRiskLevel,
  headline: cabeceraHeadline,
  intro: cabeceraIntro,
  impacto_mensual: Math.abs(Math.round(net_income)),
  margin_of_safety: nochesParaPerdida,
  break_even_nights: break_even_nights,
  colchon: {
    titulo: colchonTitulo,
    label: colchonLabel,
    valor: colchonValor,
    mostrar: true
  }
};

const propiedadNombre = input.property_name || "esta propiedad";
const ocupacionGap = Math.max(0, occupancyTarget - ocupacion_pct);

const PREMIUM_LOCKED_MESSAGE = "Este análisis requiere el formulario Operativo completo.";
const CATEGORIAS_NEUTRAS = ["Comisiones", "Limpieza", "Servicios", "Mantenimiento", "Impuestos", "Otros"];
const CATEGORIAS_KEYS = ["comision", "limpieza", "servicios", "mantenimiento", "impuestos", "otros"];

const categoriaVacia = (key, categoria) => ({
  key: key,
  category: categoria,
  actual_cost: 0,
  actual_pct_of_revenue: 0,
  benchmark_pct: 0,
  ideal_cost: 0,
  recoverable_amount: 0,
  recoverable_annual: 0,
  deviation_pct: 0,
  recommendation: PREMIUM_LOCKED_MESSAGE,
  status: "pending"
});
const categoriasNeutras = CATEGORIAS_KEYS.map((k, i) => categoriaVacia(k, CATEGORIAS_NEUTRAS[i]));

const oportunidadVacia = () => ({
  categoria: "Pendiente",
  tipo: "pendiente",
  impacto_mensual: 0,
  impacto_anual: 0,
  accion: PREMIUM_LOCKED_MESSAGE,
  descripcion: PREMIUM_LOCKED_MESSAGE,
  debilidad_score: 0,
  score_actual: 0,
  score_maximo: 0
});
const prioridadVacia = () => ({
  categoria: "Pendiente",
  tipo: "pendiente",
  impacto_mensual: 0,
  impacto_anual: 0,
  accion: PREMIUM_LOCKED_MESSAGE,
  descripcion: PREMIUM_LOCKED_MESSAGE
});

const guardian_conclusion = {
  titulo: "Conclusión del Guardián",
  tipo: "diagnostico_inicial",
  diagnostico: `${propiedadNombre} completó el Diagnóstico Inicial.`,
  limitante_principal: "PENDIENTE_DE_DESGLOSE",
  mensaje: `Tu operación se clasifica según tu Expense Ratio (${expense_ratio}%), utilidad neta ($${Math.round(net_income).toLocaleString()}/mes) y margen de seguridad (${nochesParaPerdida} noches).`,
  puente: "El reporte Operativo desglosa tus gastos por categoría e identifica fugas específicas.",
  potencial_economico_identificado: 0,
  nota_transicion: null,
  kpis: {
    ocupacion_actual: ocupacion_pct,
    ocupacion_objetivo: occupancyTarget,
    gap_ocupacion: ocupacionGap,
    expense_ratio: expense_ratio,
    net_income: Math.round(net_income),
    margin_of_safety: nochesParaPerdida,
    impacto_mensual_detectado: 0,
    impacto_anual_detectado: 0
  }
};

const leak_analysis = {
  methodology: "locked_requires_premium_form",
  description: PREMIUM_LOCKED_MESSAGE,
  total_recoverable_monthly: 0,
  total_recoverable_annual: 0,
  top_leak: null,
  leaks: [],
  efficient_categories: categoriasNeutras,
  all_categories: categoriasNeutras,
  status_message: PREMIUM_LOCKED_MESSAGE,
  radar: {
    labels: CATEGORIAS_NEUTRAS,
    actual_pct_of_revenue: [0, 0, 0, 0, 0, 0],
    benchmark_pct: [15, 10, 12, 5, 18, 3],
    deviation_pct: [0, 0, 0, 0, 0, 0]
  }
};

const opportunity_engine = {
  methodology: "locked_requires_premium_form",
  description: PREMIUM_LOCKED_MESSAGE,
  total_potential_monthly: 0,
  total_potential_annual: 0,
  distribution: {
    operational_efficiency: { amount_monthly: 0, amount_annual: 0, pct: 0, label: "Eficiencia Operativa" },
    commercial_growth: { amount_monthly: 0, amount_annual: 0, pct: 0, label: "Crecimiento Comercial" }
  },
  narrative_mode: "RECUPERACION"
};

const cazafugas = {
  titulo: "MAPA DE SALUD OPERATIVA",
  resumen: PREMIUM_LOCKED_MESSAGE,
  fortalezas: [],
  areas_atencion: [],
  areas_monitoreo: [],
  leak_analysis_contexto: {
    fugas_detectadas: false,
    total_recoverable_monthly: 0,
    contribucion: PREMIUM_LOCKED_MESSAGE
  }
};

const oportunidades_rentabilidad = {
  principal_limitante: "pendiente_de_desglose",
  occupancy_target: occupancyTarget,
  ocupacion_actual: ocupacion_pct,
  adr_actual: Math.round(avg_price),
  equivalente_noches: 0,
  impacto_mensual: 0,
  impacto_anual: 0,
  noches_faltantes: noches_faltantes,
  oportunidad: {
    titulo: "Diagnóstico Inicial",
    descripcion: "El reporte Operativo cuantifica el impacto económico exacto.",
    valor_principal: 0,
    unidad: "usd_mes"
  },
  lanes: [],
  ranking: [],
  principal: oportunidadVacia(),
  secundaria: oportunidadVacia(),
  terciaria: oportunidadVacia(),
  oportunidad_total_mensual: 0,
  oportunidad_total_anual: 0
};

const simulador = {
  prioridad_1: prioridadVacia(),
  prioridad_2: prioridadVacia()
};

const estratega = {
  titulo: "MAPA DE INTERVENCIONES PRIORITARIAS",
  introduccion: PREMIUM_LOCKED_MESSAGE,
  intervenciones: [],
  resumen_operativo: {
    total_frentes: 0,
    impacto_total_mensual: "+$0 USD/mes",
    impacto_total_anual: "+$0 USD/año",
    origen_potencial: PREMIUM_LOCKED_MESSAGE,
    recomendacion: PREMIUM_LOCKED_MESSAGE
  }
};

const plan_accion_inteligente = {
  paso_1: { titulo: "PASO 1: Impacto Inmediato", hacer: "Completa el Diagnóstico Operativo.", beneficio: "+$0 USD / mes" },
  paso_2: { titulo: "PASO 2: Corrección Estratégica", hacer: PREMIUM_LOCKED_MESSAGE, beneficio: "+$0 USD / mes" },
  paso_3: { titulo: "PASO 3: Control Pasivo Continuo", hacer: PREMIUM_LOCKED_MESSAGE, beneficio: "+$0 USD / mes" },
  resumen_anual: {
    titulo: "Potencial Total de Rescate",
    hacer: PREMIUM_LOCKED_MESSAGE,
    beneficio: "+$0 USD / año",
    total_oportunidades: 0
  }
};

const tacometro = {
  score: 0,
  score_final: 0,
  riesgo_financiero: 0,
  simulador_what_if: {
    escenario_precio: "Disponible en el reporte Operativo.",
    escenario_limpieza: "Disponible en el reporte Operativo."
  }
};

const seccion_percepcion = {
  tiempo: { titulo: "Tu Tiempo Disponible", diagnostico: `${input.occupied_nights} noches vendidas.` },
  precio: { titulo: "Tu Estrategia de Precios", diagnostico: `ADR: $${Math.round(avg_price)} USD.` },
  control: { titulo: "Tu Nivel de Control", diagnostico: `Gastos: ${expense_ratio}% de ingresos.` }
};

const radar_fugas = {
  labels: CATEGORIAS_NEUTRAS,
  tus_costos_pct: [0, 0, 0, 0, 0, 0],
  benchmark_ideal_pct: [15, 10, 12, 5, 18, 3],
  detalles: {
    comision: { monto: 0, nota: PREMIUM_LOCKED_MESSAGE },
    limpieza: { monto: 0, nota: PREMIUM_LOCKED_MESSAGE },
    servicios: { monto: 0, nota: PREMIUM_LOCKED_MESSAGE },
    mantenimiento: { monto: 0, nota: PREMIUM_LOCKED_MESSAGE }
  }
};

// 6. Retorno
return [{
  json: {
    cabecera: cabecera,
    guardian_conclusion: guardian_conclusion,
    leak_analysis: leak_analysis,
    opportunity_engine: opportunity_engine,
    cazafugas: cazafugas,
    meta: {
      email: getFieldValue("email") || "usuario@dominio.com",
      premium_locked: true,
      premium_cta: "Desbloquear Reporte Operativo Completo"
    },
    free: {
      risk_level: riskLevel,
      noches_restantes: nochesParaPerdida,
      headline: headline,
      intro: introTexto,
      impact_text: flujo_rescatable_mes > 0 
        ? `AIRLOCAL identificó un potencial económico inicial de <span class="text-[#FFB800]">$${Math.round(flujo_rescatable_mes).toLocaleString()} USD</span> al mes.`
        : "",
      hero_titulo: "POTENCIAL ECONÓMICO IDENTIFICADO",
      hero_mensual: Math.round(flujo_rescatable_mes),
      hero_anual: Math.round(recuperacionAnualTotal),
      hero_display: flujo_rescatable_mes > 0 
        ? `+$${Math.round(flujo_rescatable_mes).toLocaleString()} USD/mes (+$${Math.round(recuperacionAnualTotal).toLocaleString()} USD/año)`
        : "El diagnóstico inicial no detectó pérdidas evidentes. La Auditoría Operativa profundiza en cada categoría de gasto.",
      hero_descripcion: "Estimación inicial. Precisión completa en Auditoría Operativa.",
      user_summary: {
        property_name: input.property_name,
        location: `${input.city}, ${input.country}`,
        gross_income: input.gross_income,
        capacity: `${input.max_guests} huéspedes · ${input.bedrooms} hab · ${input.bathrooms} baños`,
        activity: `${input.occupied_nights} noches vendidas este mes`
      },
      metrics: {
        net_income: Math.round(net_income),
        avg_nightly_income: Math.round(avg_price),
        break_even_nights: break_even_nights,
        margin_of_safety: nochesParaPerdida,
        expense_ratio: expense_ratio
      },
      desglose_potencial: {
        total_mensual: 0,
        desde_fugas: 0,
        desde_comercial: 0,
        narrativa: "Desglose por origen disponible en reporte Operativo."
      }
    },
    tacometro: tacometro,
    seccion_percepcion: seccion_percepcion,
    radar_fugas: radar_fugas,
    oportunidades_rentabilidad: oportunidades_rentabilidad,
    simulador: simulador,
    estratega: estratega,
    plan_accion_inteligente: plan_accion_inteligente,
    narrative_mode: "RECUPERACION"
  }
}];