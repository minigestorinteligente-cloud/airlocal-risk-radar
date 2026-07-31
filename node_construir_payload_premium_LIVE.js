// Construye el payload histórico exacto que espera RR_ENGINE_PREMIUM_25JUN,
// combinando TODOS los campos del formulario FREE (recuperados de Supabase
// vía input_data) con los costos desglosados del segundo formulario.
// AGREGADO: Transporta el objeto `free` del reporte FREE sin modificarlo.
// No modifica RR_ENGINE_PREMIUM_25JUN. No modifica RR_FREE_ENGINE.

const registro = $input.first().json; // fila recuperada de Supabase (Buscar registro FREE)
const segundoFormulario = $('Webhook /airlocal/risk-radar').item.json.body;

let inputOriginal = {};
try {
  let rawInputData = registro.input_data;
  // Blindaje: si por cualquier motivo llega con un "=" residual al inicio
  // (símbolo de expresión de n8n mal ubicado), se limpia antes de parsear.
  if (typeof rawInputData === 'string') {
    rawInputData = rawInputData.trim();
    if (rawInputData.startsWith('=')) {
      rawInputData = rawInputData.slice(1).trim();
    }
  }
  inputOriginal = typeof rawInputData === 'string'
    ? JSON.parse(rawInputData)
    : (rawInputData || {});
} catch (e) {
  inputOriginal = {};
}

// Combina TODOS los campos originales del FREE (spread, sin lista blanca) con
// los 6 campos de costos del segundo formulario, que son los únicos que se reemplazan.
// AGREGADO: Incluye el objeto `free` del reporte FREE almacenado en Supabase
const payloadHistorico = {
  ...inputOriginal,
  platfom_commission: segundoFormulario.platform_commission ?? segundoFormulario.platfom_commission,
  cleaning_cost: segundoFormulario.cleaning_cost,
  services_cost: segundoFormulario.services_cost,
  maintenence_cost: segundoFormulario.maintenance_cost ?? segundoFormulario.maintenence_cost,
  tax_cost: segundoFormulario.tax_cost,
  Hidden_cost: segundoFormulario.hidden_cost ?? segundoFormulario.Hidden_cost,
  free: registro.report_data.free  // ← AGREGADO: Diagnóstico Inicial completo del FREE
};

return [{
  json: {
    body: payloadHistorico,
    __assessment_code: segundoFormulario.assessment_code || registro.assessment_code
  }
}];