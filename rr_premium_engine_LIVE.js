// 1. Extractor Híbrido Inteligente (Soporta Tally Estructurado y JSON Plano Directo) - INTACTO
const rawData = $json.body || $json;
const fields = rawData?.data?.fields || rawData?.fields || [];

const getFieldValue = (label) => {
  if (fields.length > 0) {
    const field = fields.find(f => f.label && f.label.toLowerCase() === label.toLowerCase());
    if (field && field.value !== undefined) return field.value;
  }
  if (rawData[label] !== undefined) return rawData[label];
  
  const alternativeKeys = {
    "platform_commission": ["platfom_commission", "platform_commission"],
    "cleaning_costs": ["cleaning_cost", "cleaning_costs"],
    "services_cost": ["services_cost", "Services_Cost"],
    "maintenance_costs": ["maintenence_cost", "maintenance_costs"],
    "tax_costs": ["tax_cost", "tax_costs"],
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

// 2. Mapeo Unificado de Variables - INTACTO
const input = {
  property_name: getFieldValue("property_name") || "Mi Propiedad",
  city: getFieldValue("city") || "Tu Ciudad",
  country: getFieldValue("country") || "Tu País",
  property_type: Array.isArray(getFieldValue("property_type")) ? getFieldValue("property_type")[0] : (getFieldValue("property_type") || ""),
  market_type:getFieldValue("market_type") || "urban",
  max_guests: safeNum(getFieldValue("max_guests") || getFieldValue("Max_guest")),
  bedrooms: safeNum(getFieldValue("bedrooms")),
  bathrooms: safeNum(getFieldValue("bathrooms")),
  occupied_nights: safeNum(getFieldValue("occupied_nights")),
  available_nights: safeNum(getFieldValue("available_nights") || 30),
  gross_income: safeNum(getFieldValue("gross_income")),
  costs: {
    comision: safeNum(getFieldValue("platform_commission")),
    limpieza: safeNum(getFieldValue("cleaning_costs")),
    servicios: safeNum(getFieldValue("services_cost")),
    mantenimiento: safeNum(getFieldValue("maintenance_costs")),
    impuestos: safeNum(getFieldValue("tax_costs")),
    otros: safeNum(getFieldValue("hidden_costs"))
  },
  stability: getFieldValue("Stability_Perception") || "", 
  perception: getFieldValue("risk_Perception") || "",
  major_fear: getFieldValue("no_major_risk") || ""
};

// 3. Bloque Consolidado de Cálculos Financieros
const total_costs = Object.values(input.costs).reduce((a, b) => a + b, 0);
const net_income = input.gross_income - total_costs;
const expense_ratio = input.gross_income > 0 ? Math.round((total_costs / input.gross_income) * 100) : 0;
const factorX = input.gross_income > 0 ? (total_costs / input.gross_income).toFixed(1) : "0.0";
const avg_price = input.occupied_nights > 0 ? (input.gross_income / input.occupied_nights) : 0;
const ocupacion_pct = Math.min(
  100, 
  Math.round((input.occupied_nights / input.available_nights) * 100));
const occupancyTarget =
input.market_type === "vacacional"
  ? 50
  : 65;

// UNIFICACIÓN ESTRICTA DE REDONDEOS (Evita que arriba diga 11 y abajo 10)
const break_even_nights = avg_price > 0 ? Math.round(total_costs / avg_price) : 0;
const margin_of_safety = net_income > 0 ? Math.max(0, input.occupied_nights - break_even_nights) : 0;
const nochesParaPerdida = Math.round(margin_of_safety);

const netMarginPct =
input.gross_income > 0
  ? (net_income / input.gross_income) * 100
  : 0;

const expenseScore =
Math.max(
  0,
  Math.min(
    40,
    40 - ((expense_ratio - 35) * 2)
  )
);

const occupancyScore =
Math.max(
  0,
  Math.min(
    25,
    Math.pow(ocupacion_pct / occupancyTarget, 1.5) * 25
  )
);

const marginScore =
Math.max(
  0,
  Math.min(
    20,
    (nochesParaPerdida / 12) * 20
  )
);

const netMarginScore =
Math.max(
  0,
  Math.min(
    15,
    (netMarginPct / 20) * 15
  )
);

const scoreSaludNuevo =
Math.round(
  expenseScore +
  occupancyScore +
  marginScore +
  netMarginScore
);

const scoreSalud = scoreSaludNuevo;

let riesgoFinanciero = 0;

if (expense_ratio >= 80) {
  riesgoFinanciero += 40;
}
else if (expense_ratio >= 70) {
  riesgoFinanciero += 30;
}
else if (expense_ratio >= 60) {
  riesgoFinanciero += 20;
}
else if (expense_ratio >= 50) {
  riesgoFinanciero += 10;
}

if (net_income <= 0) {
  riesgoFinanciero += 40;
}
else if (netMarginPct < 10) {
  riesgoFinanciero += 20;
}
else if (netMarginPct < 20) {
  riesgoFinanciero += 10;
}

if (nochesParaPerdida <= 2) {
  riesgoFinanciero += 20;
}
else if (nochesParaPerdida <= 5) {
  riesgoFinanciero += 10;
}

const scoreFinal =
Math.max(
  0,
  Math.min(
    100,
    scoreSalud - riesgoFinanciero
  )
);

// FASE 2: Será construido DESPUÉS de leak_analysis
let pilarSalud;
let lanes;

if (ocupacion_pct < occupancyTarget) {
  principal_limitante = "ocupacion";
} else {
  principal_limitante = "fugas";
}
const benchmarkLimpiezaMaxPct = 0.20; 
const costoIdealLimpieza = input.gross_income * benchmarkLimpiezaMaxPct;
const sobregastoLimpieza = Math.max(0, input.costs.limpieza - costoIdealLimpieza);
const ahorroLimpiezaReal = sobregastoLimpieza > 0 ? Math.round(sobregastoLimpieza) : Math.round(input.costs.limpieza * 0.15);

const ahorroComisiones = Math.round(input.costs.comision * 0.30); 
const ahorroServicios = Math.round(input.costs.servicios * 0.20); 
const ahorroMantenimiento = Math.round(input.costs.mantenimiento * 0.25); 
const benchmarkIdeal = {
  comisiones: 15,
  limpieza: 10,
  servicios: 12,
  mantenimiento: 5,
  impuestos: 18,
  otros: 3
};

const ahorroComisionesReal =
Math.max(
  0,
  input.costs.comision -
  (input.gross_income * benchmarkIdeal.comisiones / 100)
);

const ahorroServiciosReal =
Math.max(
  0,
  input.costs.servicios -
  (input.gross_income * benchmarkIdeal.servicios / 100)
);

const ahorroMantenimientoReal =
Math.max(
  0,
  input.costs.mantenimiento -
  (input.gross_income * benchmarkIdeal.mantenimiento / 100)
);

const ahorroImpuestosReal =
Math.max(
  0,
  input.costs.impuestos -
  (input.gross_income * benchmarkIdeal.impuestos / 100)
);

const ahorroOtrosReal =
Math.max(
  0,
  input.costs.otros -
  (input.gross_income * benchmarkIdeal.otros / 100)
);

// --- DETECCIÓN INTELIGENTE DE IMPACTO ---
let flujo_rescatable_mes = 0;
let argumento_rescate = "";


if (ocupacion_pct < occupancyTarget) {
  const noches_objetivo = Math.round(input.available_nights * (occupancyTarget / 100)
);
  const noches_faltantes = Math.max(0, noches_objetivo - input.occupied_nights);
  const costo_fijo_noche = input.occupied_nights > 0 ? (total_costs / input.occupied_nights) : 0;
  const margen_neto_noche = avg_price - costo_fijo_noche;
  
  flujo_rescatable_mes = noches_faltantes > 0 ? Math.round(noches_faltantes * margen_neto_noche) : 0;
  argumento_rescate =
`si alcanzas la ocupación objetivo de tu mercado (${occupancyTarget}% de Occupancy).`;
} else {
  // ESCENARIO FUGAS (Consolida los ahorros calculados para evitar discrepancias con el simulador)
  flujo_rescatable_mes =
Math.round(
  ahorroLimpiezaReal +
  ahorroComisionesReal +
  ahorroServiciosReal +
  ahorroMantenimientoReal
);
  argumento_rescate = "reduciendo fugas operativas en comisiones, optimización de servicios y gestión de limpieza.";
}

if (flujo_rescatable_mes <= 0) {
  flujo_rescatable_mes = Math.round(total_costs * 0.15);
  argumento_rescate = "con el plan de acción estratégico de optimización de tarifas y gastos.";
}

const recuperacionAnualTotal = flujo_rescatable_mes * 12;

// Cálculos del escenario predictivo - INTACTO
const nuevaTarifa = avg_price + 10;
const nuevasNochesOcupadas = Math.max(0, input.occupied_nights * 0.95);
const nuevoIngresoBruto = nuevaTarifa * nuevasNochesOcupadas;
const nuevoNetoTarifa = nuevoIngresoBruto - total_costs;
const impactoVariacionTarifa = Math.round(nuevoNetoTarifa - net_income);
const breakEvenNuevo = Math.ceil(break_even_nights * 0.95);

let headline, argument, eff_desc, riskLevel, premiumHeadline, premiumHook, introTexto;
let recComision, recLimpieza, recServicios, recMantenimiento;
let planPriorizadoTexto, planFugasTexto, planProyeccionTexto, planRankingTexto;

if (scoreFinal < 40) { 
    riskLevel = "CRÍTICO";
    headline = "AUDITORÍA: RIESGO OPERATIVO CRÍTICO";
    introTexto = net_income <= 0
      ? "Tu operación actual no está logrando cubrir sus costos de manera consistente."
      : "Tu operación es rentable, pero su margen de seguridad es crítico: estás al límite.";
    argument = `Análisis de costos en ${input.city}. Tus gastos se están comiendo el ${expense_ratio}% de todo lo que ingresa. Estás perdiendo dinero o trabajando al límite sin margen de seguridad.`;
    eff_desc = `¡Alerta! Estás gastando $${factorX} USD por cada $1 USD que intentas ganar. Tu rentabilidad está en peligro.`;
    
    premiumHeadline = `$${Math.abs(net_income * 12).toLocaleString()} USD / Año en Riesgo`;
    premiumHook = `Tu propiedad en ${input.city} necesita un freno de emergencia. Este reporte te dice exactamente en qué caja se está yendo el dinero y cómo recuperarlo hoy mismo.`;

    recComision = "Comisiones por encima del benchmark. Te conviene empujar canales de venta directa.";
    recLimpieza = "Tu costo por salida está muy por encima del promedio de tu zona.";
    recServicios = "Alerta de derroche. Los huéspedes consumen más luz/agua de lo normal.";
    recMantenimiento = "Gastos reactivos. Estás pagando reparaciones caras por no prevenir.";

    planPriorizadoTexto = `Ajusta el cobro de limpieza directo en la configuración de tus anuncios para que lo pague el huésped en su totalidad, liberando esta caja de inmediato.`;
    planFugasTexto = `Aplica un incremento estratégico de precio (Mark-up) del 12% exclusivamente en Booking para compensar su comisión abusiva frente a Airbnb.`;
    planProyeccionTexto = `Instala controles inteligentes básicos para cortar la luz de forma remota cuando la propiedad quede vacía.`;
    planRankingTexto = `Tu propiedad tiene números de alerta para el mercado de ${input.bedrooms} habitaciones. Necesitas aplicar estos 3 pasos de inmediato.`;
} 
else if (scoreFinal < 75) {
    riskLevel = "TENSO";
    headline = "AUDITORÍA: MARGEN OPERATIVO TENSO";
    introTexto = "Tu estructura de ingresos y gastos indica una operación vulnerable.";
    argument = `Análisis en ${input.city}. Tus gastos de funcionamiento consumen el ${expense_ratio}% del ingreso. Parece que ganas bien, pero al final del mes te queda muy poco colchón libre.`;
    eff_desc = `Gasto elevado: Gastas $${factorX} USD de cada $1 USD que entra. Zona de fatiga financiera.`;
    
    premiumHeadline = `$${Math.round(total_costs * 0.15 * 12).toLocaleString()} USD Recuperables`;
    premiumHook = `Tus márgenes están muy ajustados. Pequeños cambios en limpieza y comisiones desbloquearán dinero que hoy das por perdido.`;

    recComision = "Comisiones elevadas. Tu margen se optimiza diversificando tus canales de reserva directa.";
    recLimpieza = "Revisa los turnos del equipo. Hay margen para optimizar la tarifa por salida.";
    recServicios = "Consumos estacionales inflados. Se puede mitigar el impacto fácilmente.";
    recMantenimiento = "Crea un fondo fijo mensual pequeño para evitar reparaciones de emergencia.";

    planPriorizadoTexto = `Sincroniza tus calendarios de limpieza para evitar pagar horas extra innecesarias entre reservas.`;
    planFugasTexto = `Potencia tu base de clientes recurrentes para ahorrarte las comisiones de las plataformas.`;
    planProyeccionTexto = `Establece un límite de uso en los aires acondicionados mediante normas claras en la casa.`;
    planRankingTexto = `Estás en el promedio medio de rendimiento local. Ajustando estas dos fugas subes directo al grupo de cabeza.`;
} 
else { 
    riskLevel = "OPTIMIZADO";
    headline = "AUDITORÍA: OPERACIÓN SALUDABLE";
    introTexto = "Tu propiedad se encuentra en un rango de control saludable.";
    argument = `¡Excelente control en ${input.city}! Tus costos solo representan el ${expense_ratio}% de tus ingresos. Tienes una estructura limpia y muy buena salud financiera.`;
    eff_desc = `Operación eficiente: Tu gasto es de apenas $${factorX} USD por cada $1 USD ingresado.`;
    
    premiumHeadline = `$${Math.round(input.gross_income * 0.12 * 12).toLocaleString()} USD de Potencial`;
    premiumHook = `Eres un operador ordenado. Tu meta no es recortar más gastos, sino aprender a cobrar más caro en las noches de alta demanda.`;

    recComision = "Bajo control. Sigue monitoreando tus canales de venta preferidos.";
    recLimpieza = "Eficiente. Tu costo está alineado con el mercado local.";
    recServicios = "Buen manejo. Solo cuida los picos de consumo en temporadas altas.";
    recMantenimiento = "Excelente. Mantén tu libreta de mantenimiento preventivo al día.";

    planPriorizadoTexto = `Mantén tus costos actuales congelados y enfócate en subir tu tarifa promedio los fines de semana.`;
    planFugasTexto = `Abre un canal directo propio (WhatsApp o Web simple) ya que tus clientes valoran tu servicio.`;
    planProyeccionTexto = `Usa este excedente para crear ofertas especiales y rellenar los días libres de mitad de semana.`;
    planRankingTexto = `¡Felicidades! Tu unidad está entre las más eficientes. Lista para competir en el Top 10% del mercado.`;
}

// 5. Matriz Dinámica de Acciones - DOS MODOS (ocupacion / fugas)
const posiblesAcciones = [];

if (principal_limitante === "ocupacion") {

  posiblesAcciones.push({
    tipo: "ocupacion",
    monto_impacto: Math.round(flujo_rescatable_mes),
    beneficio_texto: `+$${Math.round(flujo_rescatable_mes)} USD / mes`,
    texto_accion: `Tu prioridad absoluta es capturar noches actualmente vacías. Estás operando por debajo del umbral mínimo de ocupación para tu mercado.`
  });

  posiblesAcciones.push({
    tipo: "visibilidad",
    monto_impacto: Math.round(flujo_rescatable_mes * 0.50),
    beneficio_texto: `+$${Math.round(flujo_rescatable_mes * 0.50)} USD / mes`,
    texto_accion: `Incrementa tu visibilidad en OTA y canales directos para acelerar la ocupación de las noches disponibles.`
  });

  posiblesAcciones.push({
    tipo: "pricing",
    monto_impacto: Math.round(flujo_rescatable_mes * 0.25),
    beneficio_texto: `+$${Math.round(flujo_rescatable_mes * 0.25)} USD / mes`,
    texto_accion: `Ajusta tarifas y promociones estratégicas para mejorar conversión sin deteriorar tu ADR.`
  });

}

if (principal_limitante === "fugas") {

  if (input.costs.limpieza > 0) {
    posiblesAcciones.push({
      tipo: "limpieza",
      monto_impacto: ahorroLimpiezaReal,
      beneficio_texto: `+$${ahorroLimpiezaReal} USD / mes`,
      texto_accion: `Tu costo de limpieza está absorbiendo demasiado margen en ${input.city}. ${planPriorizadoTexto}`
    });
  }

  if (input.costs.comision > 0) {
    posiblesAcciones.push({
      tipo: "comisiones",
      monto_impacto: Math.round(ahorroComisionesReal),
  beneficio_texto: `+$${Math.round(ahorroComisionesReal)} USD / mes`,
      texto_accion: `Estás pagando montos considerables en comisiones de plataformas. ${planFugasTexto}`
    });
  }

  if (input.costs.servicios > 0) {
    posiblesAcciones.push({
      tipo: "servicios",
      monto_impacto: Math.round(ahorroServiciosReal),
      beneficio_texto: `+$${Math.round(ahorroServiciosReal)} USD / mes`,
      texto_accion: `Detectamos espacio de optimización en servicios públicos para una unidad de ${input.bedrooms} habs. ${planProyeccionTexto}`
    });
  }

  if (input.costs.mantenimiento > 0) {
    posiblesAcciones.push({
      tipo: "mantenimiento",
      monto_impacto: Math.round(ahorroMantenimientoReal),
      beneficio_texto: `+$${Math.round(ahorroMantenimientoReal)} USD / mes`,
      texto_accion: `Tus gastos operativos de mantenimiento reflejan picos que se pueden prevenir. ${planRankingTexto}`
    });
  }

}

// FASE 2: lanes será construido DESPUÉS de leak_analysis

const equivalenteNoches =
principal_limitante === "ocupacion"
  ? null
  : (
      avg_price > 0
        ? Math.round(recuperacionAnualTotal / avg_price)
        : 0
    );

while (posiblesAcciones.length < 3) {
  posiblesAcciones.push({
    tipo: "general",
    monto_impacto: 50,
    beneficio_texto: "+$50 USD / mes",
    texto_accion: "Revisa las cuentas de gastos ocultos e imprevistos de este mes; hay micro-fugas erosionando tu utilidad neta."
  });
}

// 6. Diagnósticos de Percepción Personalizados
let diagnosticoTiempo = `Pasas horas controlando la unidad de ${input.bedrooms} habs. Automatizar la coordinación del equipo te devolverá la tranquilidad.`;
if (input.stability && input.stability.toLowerCase().includes("tiempo")) {
  diagnosticoTiempo = `Confirmado: Declaraste que la operación diaria te absorbe por completo. Tus $${total_costs} USD de gastos mensuales demuestran que estás pagando con tiempo lo que deberías solucionar con control operativo simple.`;
}

let diagnosticoPrecio = `Tus noches se venden a un ADR (Tarifa Promedio Diaria) de $${Math.round(avg_price)} USD. Hay espacio para optimizar tu estrategia según la temporada.`;
if (input.perception && input.perception.toLowerCase().includes("miedo")) {
  diagnosticoPrecio = `Mencionas que te da miedo perder clientes si subes precios. Sin embargo, el simulador predictivo demuestra que optimizando estratégicamente tu ADR proteges tu RevPAR Neto trabajando menos días.`;
}

let diagnosticoControl = `Tu nivel de gastos representa el ${expense_ratio}% de tus ingresos. Este reporte te da la visibilidad exacta que necesitas.`;
if (input.major_fear && input.major_fear.includes("ciegas")) {
  diagnosticoControl = `Identificaste que tu mayor temor es tomar decisiones a ciegas. Cruzando tu gasto real de $${total_costs} USD contra los benchmarks de la industria, la incertidumbre desaparece por completo.`;
}

// 6.5 Inteligencia de Oportunidad (Noches por capturar vs Fugas recuperables)
const noches_faltantes = Math.max(
  0,
  Math.round(
    (input.available_nights * occupancyTarget / 100)
    - input.occupied_nights
  )
);

let oportunidad; // Será definido después de leak_analysis

// 6.6 MATRIZ ÚNICA DE OPORTUNIDADES PRIORIZADAS POR IMPACTO ECONÓMICO
// (Reutiliza las fórmulas ya validadas; no recalcula nada desde cero)

// Impacto de ocupación usando la lógica existente de noches faltantes
const noches_objetivo_oportunidad = Math.round(input.available_nights * (occupancyTarget / 100));
const noches_faltantes_oportunidad = Math.max(0, noches_objetivo_oportunidad - input.occupied_nights);
const costo_fijo_noche_oportunidad = input.occupied_nights > 0 ? (total_costs / input.occupied_nights) : 0;
const margen_neto_noche_oportunidad = avg_price - costo_fijo_noche_oportunidad;
const impactoOcupacionMensual = noches_faltantes_oportunidad > 0
  ? Math.round(noches_faltantes_oportunidad * margen_neto_noche_oportunidad)
  : 0;

const oportunidades = [];

oportunidades.push({
  tipo: "ocupacion",
  categoria: "Ocupación",
  impacto_mensual: impactoOcupacionMensual,
  impacto_anual: impactoOcupacionMensual * 12,
  accion: `Tu prioridad absoluta es capturar noches actualmente vacías. Estás operando por debajo del umbral mínimo de ocupación para tu mercado.`,
  descripcion: `Te faltan ${noches_faltantes_oportunidad} noches para alcanzar la ocupación objetivo (${occupancyTarget}%) de tu mercado.`
});

oportunidades.push({
  tipo: "comisiones",
  categoria: "Comisiones",
  impacto_mensual: Math.round(ahorroComisionesReal),
  impacto_anual: Math.round(ahorroComisionesReal) * 12,
  accion: planFugasTexto,
  descripcion: recComision
});

oportunidades.push({
  tipo: "limpieza",
  categoria: "Limpieza",
  impacto_mensual: ahorroLimpiezaReal,
  impacto_anual: ahorroLimpiezaReal * 12,
  accion: planPriorizadoTexto,
  descripcion: recLimpieza
});

oportunidades.push({
  tipo: "servicios",
  categoria: "Servicios",
  impacto_mensual: Math.round(ahorroServiciosReal),
  impacto_anual: Math.round(ahorroServiciosReal) * 12,
  accion: planProyeccionTexto,
  descripcion: recServicios
});

oportunidades.push({
  tipo: "mantenimiento",
  categoria: "Mantenimiento",
  impacto_mensual: Math.round(ahorroMantenimientoReal),
  impacto_anual: Math.round(ahorroMantenimientoReal) * 12,
  accion: planRankingTexto,
  descripcion: recMantenimiento
});

oportunidades.push({
  tipo: "impuestos",
  categoria: "Impuestos",
  impacto_mensual: Math.round(ahorroImpuestosReal),
  impacto_anual: Math.round(ahorroImpuestosReal) * 12,
  accion: `Revisa la categorización fiscal y las deducciones disponibles para tu operación; tu carga impositiva supera el benchmark de la industria.`,
  descripcion: `Optimización fiscal frente al benchmark de mercado.`
});

oportunidades.push({
  tipo: "otros",
  categoria: "Otros",
  impacto_mensual: Math.round(ahorroOtrosReal),
  impacto_anual: Math.round(ahorroOtrosReal) * 12,
  accion: `Audita los gastos ocultos e imprevistos del mes; representan micro-fugas que erosionan tu utilidad neta.`,
  descripcion: `Gastos ocultos por encima del benchmark de la industria.`
});

// PASO 2: ordenar por impacto económico mensual (mayor a menor)
oportunidades.sort((a, b) => b.impacto_mensual - a.impacto_mensual);

// PASO 3: variables globales de priorización (será construido después de leak_analysis)
let oportunidadPrincipal;
let oportunidadSecundaria;
let oportunidadTerciaria;

// PASO 4: hero por impacto económico total (suma de todas las oportunidades positivas)
const oportunidadTotalMensual = oportunidades.reduce(
  (sum, item) => sum + (item.impacto_mensual > 0 ? item.impacto_mensual : 0),
  0
);
const oportunidadTotalAnual = oportunidadTotalMensual * 12;

// 6.7 LEAK ANALYSIS — Fugas recuperables estimadas vs benchmark
// Este bloque NO reemplaza variables existentes.
// Calcula la fuga recuperable conservadora por rubro usando:
// recoverable_amount = max(0, actual_cost - ideal_cost)

const leakCategoriesRaw = [
  {
    key: "comision",
    category: "Comisiones",
    actual_cost: input.costs.comision,
    benchmark_pct: benchmarkIdeal.comisiones,
    recommendation: recComision
  },
  {
    key: "limpieza",
    category: "Limpieza",
    actual_cost: input.costs.limpieza,
    benchmark_pct: benchmarkIdeal.limpieza,
    recommendation: recLimpieza
  },
  {
    key: "servicios",
    category: "Servicios",
    actual_cost: input.costs.servicios,
    benchmark_pct: benchmarkIdeal.servicios,
    recommendation: recServicios
  },
  {
    key: "mantenimiento",
    category: "Mantenimiento",
    actual_cost: input.costs.mantenimiento,
    benchmark_pct: benchmarkIdeal.mantenimiento,
    recommendation: recMantenimiento
  },
  {
    key: "impuestos",
    category: "Impuestos",
    actual_cost: input.costs.impuestos,
    benchmark_pct: benchmarkIdeal.impuestos,
    recommendation: "Optimización fiscal frente al benchmark operativo estimado."
  },
  {
    key: "otros",
    category: "Otros",
    actual_cost: input.costs.otros,
    benchmark_pct: benchmarkIdeal.otros,
    recommendation: "Audita gastos ocultos e imprevistos; pueden representar micro-fugas operativas."
  }
];

const leakCategoriesCalculated = leakCategoriesRaw.map(item => {
  const actualCost = Math.round(item.actual_cost || 0);
  const benchmarkPct = item.benchmark_pct || 0;

  const actualPct =
    input.gross_income > 0
      ? (actualCost / input.gross_income) * 100
      : 0;

  const idealCost =
    input.gross_income > 0
      ? input.gross_income * benchmarkPct / 100
      : 0;

  const recoverableAmount = Math.max(0, actualCost - idealCost);
  const deviationPct = actualPct - benchmarkPct;

  return {
    key: item.key,
    category: item.category,

    actual_cost: Math.round(actualCost),
    actual_pct_of_revenue: Number(actualPct.toFixed(1)),

    benchmark_pct: benchmarkPct,
    ideal_cost: Math.round(idealCost),

    recoverable_amount: Math.round(recoverableAmount),
    recoverable_annual: Math.round(recoverableAmount * 12),

    deviation_pct: Number(deviationPct.toFixed(1)),

    recommendation: item.recommendation,

    status: recoverableAmount > 0 ? "leak" : "efficient"
  };
});

const leakAnalysisLeaks = leakCategoriesCalculated
  .filter(item => item.status === "leak")
  .sort((a, b) => b.recoverable_amount - a.recoverable_amount);

const leakAnalysisEfficient = leakCategoriesCalculated
  .filter(item => item.status === "efficient")
  .sort((a, b) => a.deviation_pct - b.deviation_pct);

const leakAnalysisTotalMonthly = leakAnalysisLeaks.reduce(
  (sum, item) => sum + item.recoverable_amount,
  0
);

const leakAnalysisTotalAnnual = leakAnalysisTotalMonthly * 12;

const leakAnalysisTopLeak = leakAnalysisLeaks[0] || null;

const leak_analysis = {
  methodology: "estimated_variance_vs_operational_benchmark",
  description: "Fuga recuperable estimada frente al benchmark operativo AIRLOCAL. No representa ahorro garantizado.",

  total_recoverable_monthly: Math.round(leakAnalysisTotalMonthly),
  total_recoverable_annual: Math.round(leakAnalysisTotalAnnual),

  top_leak: leakAnalysisTopLeak,

  leaks: leakAnalysisLeaks,

  efficient_categories: leakAnalysisEfficient,

  all_categories: leakCategoriesCalculated,

  status_message: leakAnalysisTotalMonthly > 0 
    ? `Se detectaron $${leakAnalysisTotalMonthly}/mes en fugas recuperables frente al benchmark operativo.`
    : `No se detectaron fugas recuperables confirmadas frente al benchmark operativo. El potencial económico detectado parece venir de optimización estratégica (ocupación, pricing, mix de canales), no de gastos fuera de rango.`,

  radar: {
    labels: leakCategoriesCalculated.map(item => item.category),
    actual_pct_of_revenue: leakCategoriesCalculated.map(item => item.actual_pct_of_revenue),
    benchmark_pct: leakCategoriesCalculated.map(item => item.benchmark_pct),
    deviation_pct: leakCategoriesCalculated.map(item => item.deviation_pct)
  }
};

// 6.8 RECALCULAR principal_limitante con leak_analysis como fuente de verdad
if (leak_analysis.total_recoverable_monthly > 0) {
  principal_limitante = "fugas";
}
else if (ocupacion_pct < occupancyTarget) {
  principal_limitante = "ocupacion";
}
else if (scoreFinal >= 85) {
  principal_limitante = "optimizacion";
}
else {
  principal_limitante = "precio";
}

// principal_limitante es SOLO para narrativa, NO para modificar oportunidades
// Las oportunidades se mantienen en su forma original

// 6.9.5 OPPORTUNITY ENGINE V1 — Distribución de potencial económico entre palancas
// Fuente de verdad: total_potential = oportunidades_finales (ya calculado arriba)
// Distribución: operational_efficiency (leak_analysis) vs commercial_growth (resto)

const operationalEfficiencyMonthly = leak_analysis.total_recoverable_monthly;
const operationalEfficiencyAnnual = operationalEfficiencyMonthly * 12;

const commercialGrowthMonthly = Math.max(0, oportunidadTotalMensual - operationalEfficiencyMonthly);
const commercialGrowthAnnual = commercialGrowthMonthly * 12;

// Calcular porcentajes
const totalPotentialMonthly = oportunidadTotalMensual;
const totalPotentialAnnual = oportunidadTotalAnual;

const operationalEfficiencyPct = totalPotentialMonthly > 0 
  ? Number(((operationalEfficiencyMonthly / totalPotentialMonthly) * 100).toFixed(1))
  : 0;

const commercialGrowthPct = totalPotentialMonthly > 0
  ? Number(((commercialGrowthMonthly / totalPotentialMonthly) * 100).toFixed(1))
  : 0;

const opportunity_engine = {
  methodology: "two_source_opportunity_distribution",
  description: "Distribuye el potencial económico total entre eficiencia operativa (fugas confirmadas) y crecimiento comercial (ocupación + pricing).",

  total_potential_monthly: Math.round(totalPotentialMonthly),
  total_potential_annual: Math.round(totalPotentialAnnual),

  distribution: {
    operational_efficiency: {
      amount_monthly: Math.round(operationalEfficiencyMonthly),
      amount_annual: Math.round(operationalEfficiencyAnnual),
      pct: operationalEfficiencyPct,
      label: "Eficiencia Operativa (Fugas Confirmadas)"
    },
    commercial_growth: {
      amount_monthly: Math.round(commercialGrowthMonthly),
      amount_annual: Math.round(commercialGrowthAnnual),
      pct: commercialGrowthPct,
      label: "Crecimiento Comercial (Ocupación + Pricing)"
    }
  },
  
  // Variable narrativa para adaptación frontend (sin modificar cálculos)
  narrative_mode: scoreFinal < 60 
    ? "RECUPERACION" 
    : scoreFinal < 85 
    ? "MEJORA" 
    : "OPTIMIZACION"
};

// NUEVA LÓGICA: Priorización basada en debilidades de pilares del Score Salud
// Construye oportunidadPrincipal, secundaria, terciaria desde los 4 pilares
const pilaresDebilidadArray = [
  {
    pilar: "Ocupación",
    debilidad: occupancyScore < 25 ? (25 - occupancyScore) : 0,
    score: occupancyScore,
    peso_maximo: 25,
    impacto_mensual: noches_faltantes > 0 ? Math.round((noches_faltantes / noches_faltantes_oportunidad) * oportunidadTotalMensual) : 0,
    impacto_anual: 0,
    accion: `Capturar ${noches_faltantes} noches faltantes para alcanzar ocupación objetivo (${occupancyTarget}%).`,
    descripcion: `Tu ocupación actual es ${ocupacion_pct}% vs ${occupancyTarget}% objetivo. Ganancia potencial: +${noches_faltantes} noches.`
  },
  {
    pilar: "Eficiencia Operativa",
    debilidad: expenseScore < 40 ? (40 - expenseScore) : 0,
    score: expenseScore,
    peso_maximo: 40,
    impacto_mensual: leak_analysis.total_recoverable_monthly,
    impacto_anual: leak_analysis.total_recoverable_annual,
    accion: leak_analysis.total_recoverable_monthly > 0 
      ? `Reducir gastos operativos. Comisiones, limpieza y servicios están por encima del benchmark.`
      : `Tus costos operativos están alineados al benchmark de la industria.`,
    descripcion: leak_analysis.total_recoverable_monthly > 0
      ? `Tu expense_ratio es ${expense_ratio}%. Fugas detectadas: +$${leak_analysis.total_recoverable_monthly}/mes.`
      : `Tu expense_ratio es ${expense_ratio}%. Todos los rubros están dentro del rango esperado.`
  },
  {
    pilar: "Colchón Operativo",
    debilidad: marginScore < 20 ? (20 - marginScore) : 0,
    score: marginScore,
    peso_maximo: 20,
    impacto_mensual: nochesParaPerdida > 10 ? 0 : Math.round(avg_price * (10 - nochesParaPerdida)),
    impacto_anual: 0,
    accion: `Crear un colchón de seguridad. Estás a ${nochesParaPerdida} noches del breakeven.`,
    descripcion: `Tu margen de seguridad es ${nochesParaPerdida} noches. Necesitas ${Math.max(0, 10 - nochesParaPerdida)} más para estar cómodo.`
  },
  {
    pilar: "Rentabilidad Neta",
    debilidad: netMarginScore < 15 ? (15 - netMarginScore) : 0,
    score: netMarginScore,
    peso_maximo: 15,
    impacto_mensual: netMarginPct < 15 ? Math.round(input.gross_income * (15 - netMarginPct) / 100) : 0,
    impacto_anual: 0,
    accion: `Mejorar tu margen neto. Actualmente es ${netMarginPct.toFixed(1)}% vs 15% ideal.`,
    descripcion: `Tu net margin es ${netMarginPct.toFixed(1)}%. Consecuencia de los otros pilares.`
  }
];

// Ordenar por debilidad (mayor a menor)
pilaresDebilidadArray.sort((a, b) => b.debilidad - a.debilidad);

// Asignar principales desde pilares (NO desde ahorroXXXReal)
oportunidadPrincipal = {
  categoria: pilaresDebilidadArray[0].pilar,
  tipo: pilaresDebilidadArray[0].pilar.toLowerCase().replace(/\s+/g, '_'),
  impacto_mensual: Math.max(0, pilaresDebilidadArray[0].impacto_mensual),
  impacto_anual: Math.max(0, pilaresDebilidadArray[0].impacto_anual),
  accion: pilaresDebilidadArray[0].accion,
  descripcion: pilaresDebilidadArray[0].descripcion,
  debilidad_score: pilaresDebilidadArray[0].debilidad,
  score_actual: pilaresDebilidadArray[0].score,
  score_maximo: pilaresDebilidadArray[0].peso_maximo
};

oportunidadSecundaria = {
  categoria: pilaresDebilidadArray[1].pilar,
  tipo: pilaresDebilidadArray[1].pilar.toLowerCase().replace(/\s+/g, '_'),
  impacto_mensual: Math.max(0, pilaresDebilidadArray[1].impacto_mensual),
  impacto_anual: Math.max(0, pilaresDebilidadArray[1].impacto_anual),
  accion: pilaresDebilidadArray[1].accion,
  descripcion: pilaresDebilidadArray[1].descripcion,
  debilidad_score: pilaresDebilidadArray[1].debilidad,
  score_actual: pilaresDebilidadArray[1].score,
  score_maximo: pilaresDebilidadArray[1].peso_maximo
};

oportunidadTerciaria = {
  categoria: pilaresDebilidadArray[2].pilar,
  tipo: pilaresDebilidadArray[2].pilar.toLowerCase().replace(/\s+/g, '_'),
  impacto_mensual: Math.max(0, pilaresDebilidadArray[2].impacto_mensual),
  impacto_anual: Math.max(0, pilaresDebilidadArray[2].impacto_anual),
  accion: pilaresDebilidadArray[2].accion,
  descripcion: pilaresDebilidadArray[2].descripcion,
  debilidad_score: pilaresDebilidadArray[2].debilidad,
  score_actual: pilaresDebilidadArray[2].score,
  score_maximo: pilaresDebilidadArray[2].peso_maximo
};

// Definir oportunidad (para oportunidades_rentabilidad) DESPUÉS de leak_analysis y realineamiento
if (principal_limitante === "ocupacion") {
  oportunidad = {
    titulo: "Noches Disponibles por Capturar",
    descripcion: `Te faltan ${noches_faltantes} noches para alcanzar la ocupación objetivo de tu mercado.`,
    valor_principal: noches_faltantes,
    unidad: "noches"
  };
} else if (principal_limitante === "fugas") {
  oportunidad = {
    titulo: "Fugas Recuperables Estimadas",
    descripcion: "Se detectaron rubros por encima del benchmark operativo AIRLOCAL.",
    valor_principal: leak_analysis.total_recoverable_monthly,
    unidad: "usd_mes"
  };
} else if (principal_limitante === "precio") {
  oportunidad = {
    titulo: "Oportunidad de Optimización de Tarifa",
    descripcion: "Tu ocupación está en objetivo. La oportunidad está en optimizar ADR según temporada y competencia local.",
    valor_principal: 0,
    unidad: "usd_mes"
  };
} else if (principal_limitante === "optimizacion") {
  oportunidad = {
    titulo: "Operación Optimizada en Vigilancia",
    descripcion: "No se detectan fugas recuperables relevantes. Mantén monitoreo de KPIs y prepárate para expansión.",
    valor_principal: 0,
    unidad: "usd_mes"
  };
} else {
  oportunidad = {
    titulo: "Evaluación de Oportunidades",
    descripcion: "Análisis en progreso.",
    valor_principal: 0,
    unidad: "usd_mes"
  };
}

// PASO 7: prioridades para render dinámico del simulador
const simulador = {
  prioridad_1: {
    categoria: oportunidadPrincipal.categoria,
    tipo: oportunidadPrincipal.tipo,
    impacto_mensual: oportunidadPrincipal.impacto_mensual,
    impacto_anual: oportunidadPrincipal.impacto_anual,
    accion: oportunidadPrincipal.accion,
    descripcion: oportunidadPrincipal.descripcion
  },
  prioridad_2: {
    categoria: oportunidadSecundaria.categoria,
    tipo: oportunidadSecundaria.tipo,
    impacto_mensual: oportunidadSecundaria.impacto_mensual,
    impacto_anual: oportunidadSecundaria.impacto_anual,
    accion: oportunidadSecundaria.accion,
    descripcion: oportunidadSecundaria.descripcion
  }
};

// 6.7 CABECERA PREMIUM — REFACTORIZADA COMO ESPEJO DEL RR_FREE
// Usa tension y narrativa idénticos al Diagnóstico Inicial

// Cálculo de tension UNIFICADO por scoreFinal (antes: umbrales propios).
// Ahora la cabecera coincide con el headline (que ya usa scoreFinal) y con el Free.
let tension_cabecera;
if (scoreFinal < 40) { tension_cabecera = "CRITICO"; }
else if (scoreFinal < 75) { tension_cabecera = "VULNERABLE"; }
else { tension_cabecera = "SALUDABLE"; }

// Narrativa de cabecera (usando tension)
if (tension_cabecera === "CRITICO") {
  const enPerdida = net_income <= 0;
  cabeceraRiskLevel = "HIGH";
  cabeceraHeadline = "AUDITORÍA: RIESGO OPERATIVO CRÍTICO";
  cabeceraIntro = enPerdida
    ? "Tus costos operativos consumen la mayor parte de tus ingresos. Tu operación se encuentra en zona de pérdida."
    : "Tu operación genera utilidad, pero con un margen crítico: una pequeña caída de ingresos o subida de costos te empujaría a pérdida.";
  colchonTitulo = enPerdida ? "Tu operación ya está EN PÉRDIDA" : "Tu margen operativo está al límite";
  colchonLabel = enPerdida ? "CADA MES SIN AJUSTAR TE CUESTA DINERO" : "ESTÁS A UN PASO DE ENTRAR EN PÉRDIDA";
  colchonValor = null;
} else if (tension_cabecera === "VULNERABLE") {
  cabeceraRiskLevel = "MEDIUM";
  cabeceraHeadline = "AUDITORÍA: MARGEN OPERATIVO TENSO";
  cabeceraIntro = `Tu estructura de gastos es elevada (${expense_ratio}%). Tu rentabilidad es vulnerable.`;
  colchonTitulo = `Estás a ${nochesParaPerdida} noches`;
  colchonLabel = "DE ENTRAR EN PÉRDIDA";
  colchonValor = nochesParaPerdida;
} else {
  cabeceraRiskLevel = "LOW";
  cabeceraHeadline = "AUDITORÍA: OPERACIÓN SALUDABLE";
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

let guardianTipo = "";
let guardianDiagnostico = "";
let guardianLimitante = "";
let guardianMensaje = "";
let guardianPuente = "";

// Lógica basada en el NUEVO principal_limitante (que depende de leak_analysis)
if (principal_limitante === "fugas") {
  guardianTipo = "riesgo_critico";
  guardianLimitante = "FUGAS OPERATIVAS RECUPERABLES CONFIRMADAS";
  guardianDiagnostico = `${propiedadNombre} genera demanda suficiente, pero tiene fugas operativas confirmadas por desglose.`;
  guardianMensaje = `Se identificaron $${leak_analysis.total_recoverable_monthly.toLocaleString()} USD/mes en fugas recuperables confirmadas frente al benchmark operativo. Los rubros con mayor desviación son ${leak_analysis.leaks.slice(0, 2).map(l => l.category.toLowerCase()).join(" y ")}. Antes de buscar más reservas, necesitas optimizar esta estructura de costos.`;
  guardianPuente = "El Cazafugas mostrará exactamente qué rubros presionan tu rentabilidad y El Estratega ordenará las acciones por impacto económico.";
}
else if (principal_limitante === "ocupacion") {
  guardianTipo = "ocupacion";
  guardianLimitante = "OCUPACIÓN";
  guardianDiagnostico = `${propiedadNombre} necesita capturar más noches.`;
  guardianMensaje = `Tu ocupación actual es ${ocupacion_pct}% frente a un objetivo de ${occupancyTarget}%. Te faltan ${ocupacionGap} puntos de ocupación. El potencial económico detectado ($${oportunidadTotalMensual.toLocaleString()}/mes) viene principalmente de capturar estas noches faltantes. No hay fugas relevantes detectadas frente al benchmark.`;
  guardianPuente = "El Estratega priorizará las acciones para aumentar demanda sin deteriorar tu ADR.";
}
else if (principal_limitante === "precio") {
  guardianTipo = "precio";
  guardianLimitante = "OPTIMIZACIÓN DE TARIFA";
  guardianDiagnostico = `${propiedadNombre} tiene ocupación en objetivo sin fugas recuperables confirmadas.`;
  guardianMensaje = `Tu ocupación está en ${ocupacion_pct}%, en línea con el objetivo. Se detectó un potencial económico preliminar de $${oportunidadTotalMensual.toLocaleString()}/mes que no viene de fugas, sino de optimización estratégica en ADR, pricing dinámico y mix de canales. No hay desviaciones relevantes frente al benchmark operativo.`;
  guardianPuente = "El Estratega analizará elasticidad de demanda y posicionamiento competitivo para recomendaciones de tarifa.";
}
else if (principal_limitante === "optimizacion") {
  guardianTipo = "saludable";
  guardianLimitante = "OPERACIÓN OPTIMIZADA";
  guardianDiagnostico = `${propiedadNombre} muestra operación saludable sin fugas confirmadas.`;
  guardianMensaje = `Tu operación está optimizada (expense_ratio ${expense_ratio}%, ocupación ${ocupacion_pct}%, colchón ${nochesParaPerdida} noches). No se detectaron fugas recuperables confirmadas frente al benchmark. La prioridad es mantener control operativo y prepararse para expansión escalable.`;
  guardianPuente = "El análisis continuo monitoreará cambios de mercado. La próxima fase evaluará oportunidades de escalabilidad.";
}
else {
  guardianTipo = "vigilancia";
  guardianLimitante = "MARGEN DE SEGURIDAD";
  guardianDiagnostico = `${propiedadNombre} está rentable, pero requiere vigilancia.`;
  guardianMensaje = `Tu operación genera utilidad neta de $${Math.round(net_income).toLocaleString()} al mes con un colchón de ${nochesParaPerdida} noches antes de entrar en pérdida. Pequeños cambios en ocupación, precio o costos pueden afectar el resultado. No hay fugas relevantes detectadas.`;
  guardianPuente = "Monitorea continuamente tus KPIs y ajusta rápidamente si ves cambios en el mercado.";
}

const guardian_conclusion = {
  titulo: "Conclusión del Guardián",
  tipo: guardianTipo,
  diagnostico: guardianDiagnostico,
  limitante_principal: guardianLimitante,
  mensaje: guardianMensaje,
  puente: guardianPuente,
  potencial_economico_identificado: Math.round(totalPotentialMonthly),
  nota_transicion: `La auditoría del Cazafugas refinó la estimación inicial y confirmó un potencial recuperable de +$${leak_analysis.total_recoverable_monthly} USD/mes. A partir de este punto, el reporte utiliza este valor confirmado.`,
  kpis: {
    ocupacion_actual: ocupacion_pct,
    ocupacion_objetivo: occupancyTarget,
    gap_ocupacion: ocupacionGap,
    expense_ratio: expense_ratio,
    net_income: Math.round(net_income),
    margin_of_safety: nochesParaPerdida,
    impacto_mensual_detectado: leak_analysis.total_recoverable_monthly > 0 
      ? leak_analysis.total_recoverable_monthly 
      : Math.round(totalPotentialMonthly),
    impacto_anual_detectado: leak_analysis.total_recoverable_monthly > 0 
      ? leak_analysis.total_recoverable_annual 
      : Math.round(totalPotentialAnnual)
  }
};

// FASE 2: MAPA DE PILARES OPERATIVOS
// Clasifica cada pilar como SALUDABLE / ATENCIÓN / MONITOREO
// NO muestra categorías de gasto si leak_analysis = 0

// FASE 2: MAPA DE PILARES OPERATIVOS
// Clasifica cada pilar como SALUDABLE / ATENCIÓN / MONITOREO
// Construido DESPUÉS de leak_analysis para usar su información

pilarSalud = [
  {
    pilar: "Ocupación",
    score: occupancyScore,
    maximo: 25,
    pct: (occupancyScore / 25) * 100,
    metrica: `${ocupacion_pct}% vs ${occupancyTarget}% objetivo`,
    estado: occupancyScore >= 22 ? "SALUDABLE" : occupancyScore >= 15 ? "ATENCIÓN" : "CRÍTICO",
    color: occupancyScore >= 22 ? "green" : occupancyScore >= 15 ? "yellow" : "red"
  },
  {
    pilar: "Eficiencia Operativa",
    score: expenseScore,
    maximo: 40,
    pct: (expenseScore / 40) * 100,
    metrica: `${expense_ratio}% expense ratio vs 40% ideal`,
    estado: expenseScore >= 36 ? "SALUDABLE" : expenseScore >= 24 ? "ATENCIÓN" : "CRÍTICO",
    color: expenseScore >= 36 ? "green" : expenseScore >= 24 ? "yellow" : "red",
    detalle: leak_analysis.total_recoverable_monthly > 0 
      ? `Fugas detectadas: +$${leak_analysis.total_recoverable_monthly}/mes`
      : "Todos los rubros están dentro del benchmark"
  },
  {
    pilar: "Colchón Operativo",
    score: marginScore,
    maximo: 20,
    pct: (marginScore / 20) * 100,
    metrica: `${nochesParaPerdida} noches de margen vs 10 noches ideal`,
    estado: marginScore >= 18 ? "SALUDABLE" : marginScore >= 12 ? "MONITOREO" : "CRÍTICO",
    color: marginScore >= 18 ? "green" : marginScore >= 12 ? "yellow" : "red"
  },
  {
    pilar: "Rentabilidad Neta",
    score: netMarginScore,
    maximo: 15,
    pct: (netMarginScore / 15) * 100,
    metrica: `${netMarginPct.toFixed(1)}% net margin vs 15% ideal`,
    estado: netMarginScore >= 13 ? "SALUDABLE" : netMarginScore >= 9 ? "MONITOREO" : "CRÍTICO",
    color: netMarginScore >= 13 ? "green" : netMarginScore >= 9 ? "yellow" : "red"
  }
];

// Separar por estado
const pilaresFortalezas = pilarSalud.filter(p => p.estado === "SALUDABLE");
const pilaresAtención = pilarSalud.filter(p => p.estado === "ATENCIÓN" || p.estado === "CRÍTICO");
const pilaresMonitoreo = pilarSalud.filter(p => p.estado === "MONITOREO");

// LANES basado en pilares (NO en categorías de gasto)
lanes = pilarSalud
  .sort((a, b) => {
    // Orden: CRÍTICO > ATENCIÓN > MONITOREO > SALUDABLE
    const estadoOrder = { "CRÍTICO": 0, "ATENCIÓN": 1, "MONITOREO": 2, "SALUDABLE": 3 };
    return estadoOrder[a.estado] - estadoOrder[b.estado];
  })
  .slice(0, 3)
  .map(pilar => ({
    categoria: pilar.pilar,
    score: pilar.score,
    maximo: pilar.maximo,
    estado: pilar.estado,
    impacto_mensual: pilar.pilar === "Ocupación" && oportunidadTotalMensual > 0 
      ? oportunidadTotalMensual 
      : pilar.pilar === "Eficiencia Operativa" && leak_analysis.total_recoverable_monthly > 0
      ? leak_analysis.total_recoverable_monthly
      : 0,
    impacto_anual: pilar.pilar === "Ocupación" && oportunidadTotalMensual > 0 
      ? oportunidadTotalMensual * 12
      : pilar.pilar === "Eficiencia Operativa" && leak_analysis.total_recoverable_monthly > 0
      ? leak_analysis.total_recoverable_monthly * 12
      : 0,
    accion: pilar.pilar === "Ocupación" 
      ? `Capturar ${noches_faltantes} noches faltantes. Esto genera el mayor impacto económico.`
      : pilar.pilar === "Eficiencia Operativa"
      ? leak_analysis.total_recoverable_monthly > 0
        ? `Reducir gastos operativos. Se detectaron +$${leak_analysis.total_recoverable_monthly}/mes en fugas.`
        : `Mantener eficiencia. Todos los rubros están controlados.`
      : pilar.pilar === "Colchón Operativo"
      ? `Crear margen de seguridad. Actualmente a ${nochesParaPerdida} noches del breakeven.`
      : `Mejorar rentabilidad neta. Actualmente ${netMarginPct.toFixed(1)}% vs 15% ideal.`
  }));

// Cazafugas como MAPA DE PILARES (no como "fugas")
const cazafugas = {
  titulo: "MAPA DE SALUD OPERATIVA",
  resumen: (() => {
    const f = pilaresFortalezas.length;
    const a = pilaresAtención.length;
    const m = pilaresMonitoreo.length;
    
    if (f === 4 && a === 0 && m === 0) {
      return `Los 4 pilares operativos se encuentran dentro de rangos saludables.`;
    } else if (f === 3 && a === 1 && m === 0) {
      return `Identificamos 3 pilares sólidos y 1 área con potencial de optimización.`;
    } else if (f === 3 && a === 0 && m === 1) {
      return `Identificamos 3 pilares sólidos. 1 área requiere monitoreo continuo.`;
    } else if (f === 2 && a === 2 && m === 0) {
      return `Identificamos 2 pilares sólidos y 2 áreas que requieren atención.`;
    } else if (f === 2 && a === 1 && m === 1) {
      return `Identificamos 2 pilares sólidos, 1 área con potencial y 1 área a monitorear.`;
    } else if (f === 1 && a === 3 && m === 0) {
      return `Identificamos 1 fortaleza operativa y 3 áreas críticas que requieren intervención prioritaria.`;
    } else if (f === 1 && a === 2 && m === 1) {
      return `Identificamos 1 pilar sólido, 2 áreas con oportunidades y 1 área de monitoreo.`;
    } else if (f === 0 && a === 4 && m === 0) {
      return `Los 4 pilares requieren intervención inmediata. Situación operativa crítica.`;
    } else if (a === 0 && m === 0) {
      return `Tu Score Salud es ${scoreFinal}/100. Todos los pilares operativos se encuentran en estado saludable.`;
    } else if (a === 0) {
      return `Tu Score Salud es ${scoreFinal}/100. ${f} pilares saludables y ${m} área(s) a monitorear.`;
    } else if (m === 0) {
      return `Tu Score Salud es ${scoreFinal}/100. ${f} pilar(es) saludable(s) y ${a} área(s) con potencial de mejora.`;
    } else {
      return `Tu Score Salud es ${scoreFinal}/100. ${f} pilar(es) saludable(s), ${a} área(s) en atención y ${m} en monitoreo.`;
    }
  })(),
  
  fortalezas: pilaresFortalezas.map(p => ({
    pilar: p.pilar,
    score: Math.round(p.score),
    maximo: p.maximo,
    estado: "SALUDABLE",
    metrica: p.metrica
  })),
  
  areas_atencion: pilaresAtención.map(p => ({
    pilar: p.pilar,
    score: Math.round(p.score),
    maximo: p.maximo,
    estado: p.estado,
    metrica: p.metrica,
    gap: Math.round(p.maximo - p.score),
    impacto: p.pilar === "Ocupación" && oportunidadTotalMensual > 0 
      ? `Potencial: +$${oportunidadTotalMensual}/mes`
      : p.pilar === "Eficiencia Operativa" && leak_analysis.total_recoverable_monthly > 0
      ? `Potencial: +$${leak_analysis.total_recoverable_monthly}/mes`
      : p.pilar === "Eficiencia Operativa"
      ? "Sin ahorro cuantificable confirmado."
      : p.pilar === "Colchón Operativo"
      ? "Área bajo control. Continúa monitoreando."
      : "Área bajo control."
  })),
  
  areas_monitoreo: pilaresMonitoreo.map(p => ({
    pilar: p.pilar,
    score: Math.round(p.score),
    maximo: p.maximo,
    estado: "MONITOREO",
    metrica: p.metrica,
    recomendacion: "Mantén vigilancia. Un cambio en ocupación o gastos puede impactar rápidamente."
  })),
  
  leak_analysis_contexto: {
    fugas_detectadas: leak_analysis.total_recoverable_monthly > 0,
    total_recoverable_monthly: leak_analysis.total_recoverable_monthly,
    contribucion: leak_analysis.total_recoverable_monthly > 0 
      ? `$${leak_analysis.total_recoverable_monthly} de los $${oportunidadTotalMensual} potencial viene de fugas operativas`
      : "0 fugas detectadas. El potencial viene de crecimiento comercial."
  }
};

// FUENTE ÚNICA OFICIAL: guardian_conclusion.kpis
// Una vez que existe leak_analysis, estos valores se actualizan automáticamente
const potencial_oficial_mensual = rawData.free.hero_mensual;
const potencial_oficial_anual = rawData.free.hero_anual;

// 7. Retorno Estructurado Seguro
return [{
  json: {
    cabecera: cabecera,
    guardian_conclusion: guardian_conclusion,
    leak_analysis: leak_analysis,
    opportunity_engine: opportunity_engine,
    cazafugas: cazafugas,
    meta: {
      email: getFieldValue("email") || "usuario@dominio.com",
      premium_locked: false,
      premium_cta: "Exportar Reporte a PDF"
    },
    free: rawData.free,
    tacometro: {
      score: scoreSalud,
      score_final: scoreFinal,
      riesgo_financiero: riesgoFinanciero,
      simulador_what_if: {
        escenario_precio: impactoVariacionTarifa > 0 
          ? `Si optimizas tu ADR subiendo $10 USD y tu Occupancy baja un 5%, tu ganancia neta sube +$${impactoVariacionTarifa} USD/mes. Tu punto de equilibrio baja a ${breakEvenNuevo} noches.`
          : `Si subes $10 USD tu ADR y tu Occupancy baja un 5%, mantienes tu beneficio neto protegiendo el desgaste de la propiedad.`,
        escenario_limpieza: ahorroLimpiezaReal > 0
          ? `Si recortas el sobregasto detectado en limpieza frente al promedio de ${input.city}, liberas de inmediato +$${ahorroLimpiezaReal} USD al mes de pura utilidad libre.`
          : `Tus costos de limpieza están optimizados. Mantener esta línea te asegura un ahorro pasivo continuo.`
      }
    },
    seccion_percepcion: {
      tiempo: { titulo: "Tu Tiempo Disponible", diagnostico: diagnosticoTiempo },
      precio: { titulo: "Tu Estrategia de Precios", diagnostico: diagnosticoPrecio },
      control: { titulo: "Tu Nivel de Control", diagnostico: diagnosticoControl }
    },
    radar_fugas: {
      labels: ["Comisiones", "Limpieza", "Servicios", "Mantenimiento", "Impuestos", "Otros"],
      tus_costos_pct: [
        total_costs > 0 ? Math.round((input.costs.comision/total_costs)*100) : 0,
        total_costs > 0 ? Math.round((input.costs.limpieza/total_costs)*100) : 0,
        total_costs > 0 ? Math.round((input.costs.servicios/total_costs)*100) : 0,
        total_costs > 0 ? Math.round((input.costs.mantenimiento/total_costs)*100) : 0,
        total_costs > 0 ? Math.round((input.costs.impuestos/total_costs)*100) : 0,
        total_costs > 0 ? Math.round((input.costs.otros/total_costs)*100) : 0
      ],
      benchmark_ideal_pct: [15, 10, 12, 5, 18, 3], 
      detalles: {
        comision: { monto: input.costs.comision, nota: recComision },
        limpieza: { monto: input.costs.limpieza, nota: recLimpieza },
        servicios: { monto: input.costs.servicios, nota: recServicios },
        mantenimiento: { monto: input.costs.mantenimiento, nota: recMantenimiento }
      }
    },

oportunidades_rentabilidad: {
  principal_limitante: principal_limitante,

  occupancy_target: occupancyTarget,

  ocupacion_actual: ocupacion_pct,

  adr_actual: Math.round(avg_price),

  equivalente_noches: equivalenteNoches,

  impacto_mensual: flujo_rescatable_mes,

  impacto_anual: recuperacionAnualTotal,

  noches_faltantes: noches_faltantes,

  oportunidad: oportunidad,

  lanes: lanes,

  ranking: pilaresDebilidadArray,

  principal: oportunidadPrincipal,

  secundaria: oportunidadSecundaria,

  terciaria: oportunidadTerciaria,

  oportunidad_total_mensual: oportunidades.reduce((sum, item) => sum + (item.impacto_mensual || 0), 0),

  oportunidad_total_anual: oportunidades.reduce((sum, item) => sum + (item.impacto_anual || 0), 0)
},

simulador: simulador,

// ESTRATEGA: Priorizador de intervenciones (NO prescriptor)
// Ordena por impacto económico y sugiere qué auditar primero
estratega: {
  titulo: "MAPA DE INTERVENCIONES PRIORITARIAS",
  introduccion: "AIRLOCAL identifica qué frentes operativos revisar primero según su impacto económico esperado. No prescribe soluciones específicas: audita qué campos requieren análisis profundo.",
  
  intervenciones: (() => {
    // REGLA MAESTRA: Las prioridades deben construirse ÚNICAMENTE desde el origen REAL del potencial
    // REGLA 2: Acumular hasta exactamente potencial_oficial, truncando la última intervención si es necesario
    
    // Obtener el total potencial del potencial_oficial (la fuente de verdad dinámica)
    const total_potencial_mensual = potencial_oficial_mensual;
    const total_potencial_anual = potencial_oficial_anual;
    
    // REGLA 2: Si hay fugas, acumular hasta el potencial oficial
    if (leak_analysis.total_recoverable_monthly > 0 && leak_analysis.leaks && leak_analysis.leaks.length > 0) {
      const intervenciones_acumuladas = [];
      let acumulado = 0;
      
      // Ordenar leaks de mayor a menor recoverable_amount
      const leaks_ordenados = leak_analysis.leaks
        .filter(leak => leak.recoverable_amount > 0)
        .sort((a, b) => b.recoverable_amount - a.recoverable_amount);
      
      // Acumular hasta el potencial oficial
      for (let i = 0; i < leaks_ordenados.length && acumulado < total_potencial_mensual; i++) {
        const leak = leaks_ordenados[i];
        
        // Calcular el impacto de esta intervención
        const impacto_sin_truncar = leak.recoverable_amount;
        const restante = total_potencial_mensual - acumulado;
        const impacto_final = Math.min(impacto_sin_truncar, restante);
        
        let que_intervenir = "";
        switch(leak.key) {
          case "comisiones":
            que_intervenir = "Revisar la estructura de comisiones y validar los componentes que generan la desviación frente al benchmark.";
            break;
          case "limpieza":
            que_intervenir = "Analizar la composición del gasto de limpieza e identificar oportunidades de eficiencia.";
            break;
          case "servicios":
            que_intervenir = "Revisar el comportamiento de los costos de servicios frente al benchmark.";
            break;
          case "mantenimiento":
            que_intervenir = "Analizar el detalle del gasto de mantenimiento e identificar los conceptos que generan la desviación.";
            break;
          case "impuestos":
            que_intervenir = "Validar la estructura tributaria utilizada en la operación.";
            break;
          case "otros":
            que_intervenir = "Revisar los gastos clasificados como 'Otros' para identificar oportunidades de optimización.";
            break;
          default:
            que_intervenir = "Revisar este componente para identificar oportunidades de optimización.";
        }
        
        intervenciones_acumuladas.push({
          prioridad: intervenciones_acumuladas.length + 1,
          categoria: leak.category,
          tipo: leak.key,
          impacto_mensual: Math.round(impacto_final), // REGLA 2: puede estar truncado
          impacto_anual: Math.round(impacto_final * 12),
          metrica: `Benchmark: ${leak.benchmark_pct}% | Actual: ${leak.actual_pct_of_revenue.toFixed(1)}% | Desviación: ${leak.deviation_pct.toFixed(1)}%`,
          que_intervenir: que_intervenir,
          what_if: `Si esta brecha se elimina completamente, podrías recuperar hasta +$${Math.round(impacto_final).toLocaleString()} USD/mes (+$${Math.round(impacto_final * 12).toLocaleString()} USD/año).`
        });
        
        acumulado += impacto_final;
        
        // Si hemos alcanzado el potencial oficial, detenerse
        if (acumulado >= total_potencial_mensual) {
          break;
        }
      }
      
      // REGLA 2: Si las fugas no alcanzan el potencial oficial, agregar intervención de crecimiento comercial
      const potencial_comercial_restante = total_potencial_mensual - acumulado;
      if (potencial_comercial_restante > 0) {
        intervenciones_acumuladas.push({
          prioridad: intervenciones_acumuladas.length + 1,
          categoria: "Crecimiento Comercial",
          tipo: "comercial",
          impacto_mensual: Math.round(potencial_comercial_restante),
          impacto_anual: Math.round(potencial_comercial_restante * 12),
          metrica: "Oportunidades de ocupación, pricing y mix de canales",
          que_intervenir: "Revisar los factores operativos que limitan el crecimiento comercial frente al potencial del mercado.",
          what_if: `Si capturas las oportunidades comerciales identificadas, podrías recuperar hasta +$${Math.round(potencial_comercial_restante).toLocaleString()} USD/mes (+$${Math.round(potencial_comercial_restante * 12).toLocaleString()} USD/año).`
        });
      }
      
      return intervenciones_acumuladas;
    }
    
    // REGLA 1 + 2: Si NO hay fugas, usar SOLO principal_limitante y potencial_oficial
    // NUNCA incluir categorías de costos si ya fueron diagnosticadas como eficientes
    else if (leak_analysis.total_recoverable_monthly === 0 || !leak_analysis.leaks || leak_analysis.leaks.length === 0) {
      // Si el potencial viene de crecimiento comercial, SOLO reflejar comercial
      const intervenciones_comerciales = [];
      
      // Construir desde principal_limitante
      if (principal_limitante === "ocupacion" && noches_faltantes > 0) {
        // Usar el total_potencial como impacto (no dividir artificialmente)
        intervenciones_comerciales.push({
          prioridad: 1,
          categoria: "Ocupación",
          tipo: "ocupacion",
          impacto_mensual: Math.round(total_potencial_mensual),
          impacto_anual: Math.round(total_potencial_anual),
          metrica: `Ocupación actual: ${ocupacion_pct}% | Objetivo AIRLOCAL: ${occupancyTarget}% | Brecha: ${noches_faltantes} noches`,
          que_intervenir: "Revisar los factores operativos que limitan la ocupación frente al objetivo AIRLOCAL.",
          what_if: `Si captu ras las ${noches_faltantes} noches faltantes, podrías recuperar hasta +$${Math.round(total_potencial_mensual).toLocaleString()} USD/mes (+$${Math.round(total_potencial_anual).toLocaleString()} USD/año).`
        });
      } else if (principal_limitante === "precio") {
        // Usar el total_potencial como impacto
        intervenciones_comerciales.push({
          prioridad: 1,
          categoria: "Pricing",
          tipo: "precio",
          impacto_mensual: Math.round(total_potencial_mensual),
          impacto_anual: Math.round(total_potencial_anual),
          metrica: `ADR actual: $${avg_price.toFixed(2)} | Oportunidad de mejora: Ajuste de precios`,
          que_intervenir: "Revisar la estructura de precios y su alineación con el mercado objetivo.",
          what_if: `Si optimizas la estrategia de pricing, podrías recuperar hasta +$${Math.round(total_potencial_mensual).toLocaleString()} USD/mes (+$${Math.round(total_potencial_anual).toLocaleString()} USD/año).`
        });
      } else if (principal_limitante === "optimizacion") {
        // Usar el total_potencial como impacto
        intervenciones_comerciales.push({
          prioridad: 1,
          categoria: "Optimización Operativa",
          tipo: "optimizacion",
          impacto_mensual: Math.round(total_potencial_mensual),
          impacto_anual: Math.round(total_potencial_anual),
          metrica: "Tu operación es saludable. Monitorea cambios de mercado.",
          que_intervenir: "Mantener vigilancia en los componentes operativos clave.",
          what_if: `Continuando con la operación actual, podrías mantener o mejorar el beneficio de +$${Math.round(total_potencial_mensual).toLocaleString()} USD/mes.`
        });
      }
      
      // Agregar Colchón Operativo si es apropiado (sin contar en suma)
      if (nochesParaPerdida < 10 && nochesParaPerdida > 0 && intervenciones_comerciales.length > 0) {
        intervenciones_comerciales.push({
          prioridad: intervenciones_comerciales.length + 1,
          categoria: "Colchón Operativo",
          tipo: "colchon_operativo",
          impacto_mensual: 0,  // No suma al total (es monitoreo, no oportunidad económica)
          impacto_anual: 0,
          metrica: `Margen de seguridad: ${nochesParaPerdida} noches | Objetivo: 10+ noches`,
          que_intervenir: "Monitorear el margen de seguridad operativo y fortalecer su capacidad de absorción ante cambios del mercado.",
          what_if: "Fortaleciendo el colchón operativo, reduces el riesgo ante volatilidad del mercado."
        });
      }
      
      return intervenciones_comerciales.length > 0 
        ? intervenciones_comerciales 
        : [{
            prioridad: 1,
            categoria: "Evaluación General",
            tipo: "evaluacion",
            impacto_mensual: 0,
            impacto_anual: 0,
            metrica: "Tu operación no presenta desviaciones significativas frente a los benchmarks.",
            que_intervenir: "Realizar revisión periódica de los componentes operativos clave.",
            what_if: "Continúa monitoreando tu operación según los indicadores establecidos."
          }];
    }
    
    return [];
  })(),
  
  resumen_operativo: {
    total_frentes: leak_analysis.total_recoverable_monthly > 0 
      ? leak_analysis.leaks.filter(l => l.recoverable_amount > 0).length 
      : (principal_limitante === "optimizacion" ? 0 : 1),
    impacto_total_mensual: `+$${Math.round(potencial_oficial_mensual).toLocaleString()} USD/mes`, // REGLA 3: usa potencial_oficial
    impacto_total_anual: `+$${Math.round(potencial_oficial_anual).toLocaleString()} USD/año`, // REGLA 3: usa potencial_oficial
    origen_potencial: leak_analysis.total_recoverable_monthly > 0 
      ? `${leak_analysis.total_recoverable_monthly} USD/mes de fugas operativas`
      : "Crecimiento comercial (ocupación, pricing, mix de ingresos)",
    recomendacion: "Aborda los frentes en orden de prioridad. Cada auditoría debe verificar si la brecha calculada es cerrable o responde a factores de mercado."
  }
},
    

plan_accion_inteligente: {
  
      paso_1: { 
        titulo: "PASO 1: Impacto Inmediato (Días 1-30)", 
        hacer: oportunidadPrincipal.accion, 
        beneficio: `+$${oportunidadPrincipal.impacto_mensual.toLocaleString()} USD / mes` 
      },
      paso_2: { 
        titulo: "PASO 2: Corrección Estratégica (Días 31-60)", 
        hacer: oportunidadSecundaria.accion, 
        beneficio: `+$${oportunidadSecundaria.impacto_mensual.toLocaleString()} USD / mes` 
      },
      paso_3: { 
        titulo: "PASO 3: Control Pasivo Continuo (Días 61-90)", 
        hacer: oportunidadTerciaria.accion, 
        beneficio: `+$${oportunidadTerciaria.impacto_mensual.toLocaleString()} USD / mes` 
      },
      resumen_anual: { 
        titulo: "Potencial Total de Rescate", 
        hacer: `Implementando este mapa de ruta personalizado para ${input.property_name}, el motor de AIRLOCAL proyecta una recuperación de capital anualizada limpia para tu operación.`, 
        beneficio: `+$${Math.round(potencial_oficial_anual).toLocaleString()} USD / año`, // REGLA 3: usa potencial_oficial
        total_oportunidades: oportunidades.filter(o => o.impacto_mensual > 0).length
      }
    },
    
    // Variable narrativa para adaptación frontend (sin modificar cálculos)
    narrative_mode: scoreFinal < 60 
      ? "RECUPERACION" 
      : scoreFinal < 85 
      ? "MEJORA" 
      : "OPTIMIZACION"
  }
}];