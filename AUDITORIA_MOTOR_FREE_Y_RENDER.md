# Auditoría estática — Motor Free + capa de render

> Rama: `redesign/funnel-auditoria` · Fecha: 2026-07-31
> Alcance de este documento: `rr_free_engine_code.js` (motor n8n Free) y su render en `src/app/auditoria-test/page.tsx`.
> Método: auditoría estática (sin correr producción). Los hallazgos marcados **CONFIRMADO** se verificaron leyendo el código exacto; los **A VERIFICAR** requieren corrida en vivo.

## Contexto de diseño (confirmado con la dueña)
- **Free** pide gastos **agregados** (un solo número) → diagnóstico aproximado por diseño. No puede señalar fugas por rubro.
- **Premium** pide gastos **desglosados** → aplica benchmarks → fugas reales.
- **Continuidad:** el Premium es el mismo reporte Free **desplegado hacia abajo** (Guardián se mantiene; se enriquece con Cazafugas + Estratega). El motor Free ya implementa esto bien: devuelve el mismo contrato JSON con las secciones premium bloqueadas (`PREMIUM_LOCKED_MESSAGE`, valores en 0).

## Misión que se valida
AIRLOCAL responde: **"¿Qué debo hacer para mejorar la rentabilidad de mi propiedad?"** — cada reporte debe entregar bien: punto de equilibrio, margen operativo real, fugas, dinero sobre la mesa, y **qué acción va primero** (priorización justificada por los números).

---

## ✅ Lo que está bien
- Continuidad Free→Premium correcta a nivel motor (mismo contrato JSON, secciones premium bloqueadas).
- Núcleo del Guardián correcto: neto, expense ratio, ADR, ocupación %, break-even, margen de seguridad.
- `market_type` manda `"vacacional"`/`"urban"` exactos → `occupancyTarget` (50/65) funciona. **Verificado.**

## 📐 Mapa de fórmulas (Guardián)
| Métrica | Fórmula | Estado |
|---|---|---|
| Neto | `gross − total_costs` | OK |
| Expense ratio | `round(costs/gross×100)` | OK |
| ADR | `gross/occupied` | OK |
| Ocupación % | `min(100, round(occ/avail×100))` | OK |
| Break-even noches | `round(costs/avg_price)` | OK (solo vs. costos operativos) |
| Margen seguridad | `net>0 ? max(0, occ−break_even) : 0` | OK |
| Target ocupación | `vacacional?50:65` | OK (verificado) |

---

## 🚩 Hallazgos por severidad

### 🔴 CRÍTICO-1 — "Potencial económico" negativo llega a pantalla · **CONFIRMADO**
- **Motor** (`rr_free_engine_code.js` L96-104): en el ramo de brecha de ocupación, `margen_neto_noche = net_income/occupied`. Si la propiedad pierde (net<0) con ocupación baja → potencial negativo.
- **Render** (`page.tsx` L1787 usa `?? 808`, que preserva negativos; L2082 hardcodea prefijo `+$`).
- **Escenario:** ingreso 2.000, gasto 2.500 (net −500), 10 noches/30, urbano → pantalla muestra literal: **`+$-500 USD/mes (+$-6.000 USD/año)`**.
- **Impacto:** el crítico —el que más lo necesita— ve un potencial negativo presentado como positivo. Rompe promesa y "solo agua".

### 🔴 CRÍTICO-2 (render) — Hero "NaN" en el camino de fallback sin n8n · **CONFIRMADO**
- Cuando `!hasN8nData` (n8n no respondió en el polling ~8s), `heroMensualVal = Number(productionJson.free.hero_mensual)`; pero `productionJson.free.hero_mensual` es el **string** `"+$808 USD / mes"` (L928-929) → `Number(...)` = **NaN** → pantalla muestra **`+$NaN USD/mes`**.
- Casi seguro el origen del `test_gauge_nan.js`.

### 🟠 ALTO-1 — Fallback local = reporte ficticio con números fijos · **CONFIRMADO**
- Si n8n falla, todo el reporte se pinta desde `productionJson` (page.tsx L898+): hero y `impact_text` con cifras fijas ($808/mes, $9.696/año — L926), pasos +$528/+$180/+$100, arrays de radar… **sin relación con el input del usuario**. Una caída de n8n no degrada con gracia: muestra un reporte plausible pero falso.

### 🟠 ALTO-2 — Umbrales de estado distintos: motor n8n vs. fallback local · **CONFIRMADO**
- Motor Free: `CRÍTICO` si `net≤0 || margin≤2`; `VULNERABLE` si `ratio≥45 || margin≤7`; si no `SALUDABLE`.
- Fallback local (`calculateResults`): `HIGH` si `ratio≥75 || net≤0`; `MEDIUM` si `ratio≥45`; si no `LOW`.
- **Escenario:** net +300, ratio 30%, margin 2 → motor **CRÍTICO**, fallback **LOW**. Veredicto opuesto según si n8n respondió.

### 🟠 ALTO-3 — Narrativa "EN PÉRDIDA" para propiedades rentables · **CONFIRMADO**
- Motor L77: `nochesParaPerdida ≤ 2` dispara CRÍTICO incluso con `net_income > 0`. El texto CRÍTICO (L115-119) afirma "no está logrando cubrir sus costos" / "Tu operación ya está EN PÉRDIDA".
- **Escenario:** net +300/mes, margen 1 noche → le dice que está en pérdida. Falso, contradice sus números.

### 🟡 MEDIO-1 — "15% de los costos" como potencial concreto (falsa precisión)
- Motor L100: si ocupación ≥ target, `flujo = costs × 0.15`. Supuesto fijo presentado como USD duro sin desglose. Justo el riesgo de "solo agua". Sugerencia: rango o rótulo de estimación acotada.

### 🟡 MEDIO-2 — `cabecera.impacto_mensual = abs(net_income)` cambia de significado
- Motor L146: en CRÍTICO = magnitud de pérdida; en SALUDABLE = utilidad. Mismo campo, dos sentidos → si el render usa etiqueta fija, rotula mal uno.

### 🟡 MEDIO-3 — Benchmarks en el Free + paridad con Premium
- Motor L234/L336: Free manda `benchmark=[15,10,12,5,18,3]` con actuals en `[0,0,0,0,0,0]`. Verificar cómo renderiza (radar vacío) y si esos benchmarks coinciden con los del motor Premium. `limpieza 10%` aquí vs `15-25%` del doc `03_Logica_Premium` → reconciliar.

### 🟡 MEDIO-4 — Inconsistencia de precio en la UI
- Botón "Desbloquear análisis completo (**$45 USD**)" (L2341) vs. landing "valor real **$47**" vs. docs "**$49-97**". Tres precios distintos flotando. Reconciliar para un funnel de pago.

### 🟢 BAJO-1 — La pregunta #3 del motor no se responde
- El encabezado promete "¿Qué tan resistente es ante una caída de ocupación?" y calcula `resistencia_ocupacion_pct` (L73), pero **nunca la devuelve**. `netMarginPct` (L69) también queda muerta.

### 🟢 BAJO-2 — Break-even solo vs. costos operativos
- Excluye fijos/hipoteca (coherente con scope "operativo"), pero la narrativa debería aclararlo.

---

## ↩️ Retractado (corrección honesta)
- **CRÍTICO-2 original (bloque `calculatedData` con `|| 72/40/15`)**: el objeto `calculatedData` (page.tsx L871-896) está **definido pero nunca se usa** en el render — es **código muerto**. NO fabrica números en pantalla. Se retira la afirmación de que resucita ceros bloqueados. (El riesgo real de números falsos es ALTO-1: el `productionJson` en el camino de fallback.)

## ⚠️ Nota de testing importante
El camino `?status=critico|vulnerable|saludable` (page.tsx L1797-1813) inyecta **valores demo limpios** (4500/54000, etc.). Probar con ese parámetro **enmascara** los bugs reales (NaN y negativo), que solo aparecen por el camino de datos n8n real o el fallback puro. Para pruebas fieles, usar el flujo real del formulario, no el `?status=`.

---

## Próximos pasos sugeridos
1. Corregir los 2 críticos (negativo + NaN) — clamp del hero a `max(0, …)` y parsear `productionJson` como números, no strings.
2. Unificar umbrales de estado (una sola fuente de verdad, idealmente el motor; el fallback local debería replicar exactamente o eliminarse).
3. Auditar el motor **Premium** (`rr_engine_premium_code.js`) para cerrar paridad de benchmarks y validar la lógica de priorización (promesa #5).
4. Definir la matriz de escenarios y correrla contra el sistema vivo (con email de prueba dedicado y limpieza de filas en `reports`).
