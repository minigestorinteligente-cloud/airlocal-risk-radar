# Diseño — Núcleo compartido (fuente única de verdad)

> Rama: `redesign/funnel-auditoria` · Fecha: 2026-07-31 · Estado: **propuesta de diseño (sin código)**
> Objetivo: eliminar las divergencias Free↔Premium documentadas en `AUDITORIA_MOTOR_FREE_Y_RENDER.md` creando un único núcleo que calcula la capa base **una sola vez**, consumido igual por ambos motores.

---

## 1. El problema (recap)
Hoy `rr_free_engine_code.js` y `rr_engine_premium_code.js` son **motores independientes** ("no comparte código, no comparte fórmulas" — dice el propio Free). Consecuencias probadas:
- El **estado** (cabecera) se clasifica con fórmulas distintas → puede saltar de rojo a verde al desbloquear Premium.
- El **radar** mezcla denominadores (% de costos vs % de ingreso).
- Coexisten **3 "potencial total"** distintos; el hero Free puede dar **negativo** o **NaN**.
- Hay **2 priorizaciones** que compiten.

Todo esto nace de la misma raíz: **no hay una única fuente de verdad**.

## 2. Principio de diseño
Un solo módulo — el **Núcleo** — calcula la **capa base** con los datos que **ambos** motores tienen garantizados (ingreso, ocupación, costo total). Free y Premium **consumen el mismo núcleo**:

```
                 ┌────────────────────────────┐
   inputs  ──▶   │   NÚCLEO (capa base)       │
                 │  estado · break-even ·     │
                 │  margen · potencial base   │
                 └────────────┬───────────────┘
                              │  (idéntico para ambos)
              ┌───────────────┴────────────────┐
              ▼                                 ▼
      FREE (Guardián)                 PREMIUM (Guardián + capas)
   base + upsell bloqueado      base IDÉNTICA + Cazafugas + Estratega
   "solo agua"                  (desglose por rubro, benchmarks)
```

**Regla de oro:** el Guardián (estado, break-even, margen, neto) **nunca cambia** al pasar Free→Premium. Premium solo **añade** capas hacia abajo; jamás recalcula el estado con otra fórmula.

## 3. Qué calcula el Núcleo (única fuente de verdad)

### 3.1 Financieros base (idénticos en ambos, ya coinciden hoy)
`net_income`, `expense_ratio`, `avg_price` (ADR), `ocupacion_pct`, `occupancy_target`, `break_even_nights`, `margin_of_safety`, `net_margin_pct`. Estas fórmulas **ya son iguales** en los dos motores; solo hay que extraerlas a un solo lugar.

### 3.2 Estado unificado — LA unificación clave
Un solo `score_final` (0-100) y una sola función `clasificarEstado(score)`:

```
score_salud = expenseScore(0-40) + occupancyScore(0-25)
            + marginScore(0-20) + netMarginScore(0-15)
riesgo_financiero = penalizaciones por ratio, neto y margen
score_final = clamp(0, 100, score_salud - riesgo_financiero)

estado = score_final < 40 ? CRÍTICO
       : score_final < 70 ? TENSO (vulnerable)
       : SALUDABLE
```

**Por qué esto resuelve la continuidad:** el `score_final` se calcula **solo con agregados** (ingreso, ocupación, costo total, margen) — datos que el **Free también tiene**. Por lo tanto Free y Premium producen **el mismo score con los mismos inputs** → el estado **no puede saltar**. (Hoy Premium ya usa este score; el cambio es que Free lo adopte en lugar de sus umbrales propios.)

Beneficios extra: alimenta el tacómetro/gauge con un número suave, y **corrige de paso** el bug de "CRÍTICO / EN PÉRDIDA" para propiedades rentables (una propiedad con neto positivo pero margen fino cae en TENSO, no en CRÍTICO con narrativa de pérdida).

### 3.3 Ruptura por rubro (denominador único)
El Núcleo define el cálculo canónico por rubro:
```
pct_de_ingreso(rubro) = costo_rubro / gross_income * 100   ← para comparar vs benchmark
pct_de_costos(rubro)  = costo_rubro / total_costs * 100    ← para la dona (composición)
recuperable(rubro)    = max(0, costo_rubro - gross_income * benchmark_rubro/100)
```
- El **benchmark siempre se compara contra % de ingreso** (nunca % de costos) → mata el "peras con manzanas".
- La **dona** usa `pct_de_costos` (composición).
- Free no tiene el desglose → no puede calcular esto; su Cazafugas queda bloqueado (correcto). Premium lo llena.

### 3.4 Benchmark único — POR TIPO DE MERCADO (resuelto)
Un solo set de benchmarks (% de ingreso), **diferenciado por `market_type`**, usado en TODO el reporte (radar, leak_analysis, oportunidades). Elimina el doble benchmark de limpieza (era market-dependent, no un error).

| Rubro | Urbano/Negocios | Vacacional/Turismo |
|---|---|---|
| comisiones | 12 | 12 |
| limpieza | 9 | 15 |
| servicios | 8 | 11 |
| mantenimiento | 5 | 8 |
| impuestos | 6 | 6 |
| otros | 4 | 4 |
| **total ideal** | **~44%** | **~56%** |

> **v1** basado en investigación de industria (Awning, Global Property Guide) + ajuste LATAM. Pendiente: calibrar con la data real (`all_malena_reports.json` / Supabase `reports`).
> **Coherencia:** como el benchmark total difiere por mercado (~44% vs ~56%), el **objetivo de expense ratio del `score_final` también debe ser market-type-aware** (hoy es fijo 40%). Si no, un vacacional siempre se vería "peor" injustamente.

### 3.5 Potencial único (con guardas)
Un solo `potencial_total = suma de oportunidades positivas` (brecha de ocupación + fugas confirmadas), **siempre ≥ 0**. Guardas obligatorias:
- Nunca negativo (`Math.max(0, …)`).
- Nunca `NaN` (los valores base son números, nunca strings — corrige el bug del `productionJson`).
- Nunca **$0 crudo** en pantalla → si el potencial es 0, **se narra** (ver §5).

Free entrega una **estimación acotada** (rango o "hasta $X", framing "solo agua"); Premium entrega el valor **confirmado** por desglose. La transición ya está bien narrada hoy con `nota_transicion` ("estimación inicial → valor confirmado").

### 3.6 Priorización única
**Un solo criterio: impacto económico mensual descendente.** Se elimina la priorización paralela por "debilidad de score". "Qué hacer primero" = mayor $ recuperable. Una sola respuesta.

## 4. Cómo consume cada motor

| Capa | Free (Guardián) | Premium (Guardián + despliegue) |
|---|---|---|
| Estado, break-even, margen, neto | ✅ del Núcleo | ✅ del Núcleo (idéntico) |
| Potencial | estimación acotada, ≥0, narrada | valor confirmado por desglose |
| Dona (composición) | 🔒 bloqueada (no hay desglose) | ✅ `pct_de_costos` |
| Cazafugas (fugas vs benchmark) | 🔒 bloqueada | ✅ `recuperable` + `pct_de_ingreso` |
| Estratega (plan priorizado 30/60/90) | 🔒 bloqueada | ✅ orden por impacto |

El contrato JSON sigue siendo el mismo para ambos (como hoy) — Premium desbloquea secciones, no cambia estructura.

## 5. Reglas de conversión (tu contexto)
Baked into el Núcleo/narrativa:
- **SALUDABLE = trigger, no felicitación.** Si no hay fugas, el potencial se redirige a la palanca correcta ("tu meta no es recortar gastos, es cobrar más caro en alta demanda / cerrar la brecha de ocupación"). El número mostrado **nunca es $0 crudo**: si no hay fugas, se muestra el potencial comercial (pricing/ocupación) con su propio encuadre.
- **CRÍTICO nunca muestra ceros crudos.** Si una sección da 0, se narra como diagnóstico ("no hay fugas por rubro; tu problema es ocupación / margen"), nunca como "$0" pelado que parezca falla del sistema. La magnitud en juego (p. ej. la pérdida anual) se muestra como el "stake".
- **Coherencia gancho↔número:** el `premiumHeadline` (gancho) y el `potencial_total` (número del guardián) deben salir de la **misma** cuenta. Hoy están desconectados (el gancho usa 12% del ingreso; el guardián usa la suma de oportunidades).

## 6. Migración no destructiva (cuando se implemente)
1. Crear el Núcleo como módulo puro (funciones sin efectos), con tests de escenarios.
2. Cablear **Premium** al Núcleo primero (ya usa casi toda esta lógica) y validar contra reportes actuales.
3. Cablear **Free** al Núcleo (adopta el score unificado) y validar la continuidad con la matriz de escenarios.
4. Recién entonces, arreglar el render (`page.tsx`): quitar el `productionJson` ficticio, parsear números (no strings), quitar `calculatedData` muerto, y separar el radar en dona + barras.
5. Todo en la rama; `main` intacto hasta validar.

## 7. Decisiones (resueltas 2026-07-31)
- **Decisión #1 — Benchmarks:** por **tipo de mercado** (ver §3.4). v1 propuesto; se calibrará con data real. *(Pendiente confirmación final de la tabla v1.)*
- **Decisión #2 — Estado unificado:** se adopta el **modelo de score del Premium** (`score_final`: CRÍTICO <40 / TENSO 40-69 / SALUDABLE ≥70). El Free **abandona** su lógica propia (`net≤0 || margen≤2`) y adopta el score (que puede calcular con agregados). Es la única forma de garantizar que el estado no salte Free→Premium. *(Pendiente confirmación.)* Nota: el target de expense ratio del score debe volverse market-type-aware (ver §3.4).
- **Decisión #3 — RESUELTO:** el estado y los totales base se **fijan desde el Free**; el Premium **no los recalcula**, solo añade el desglose (Cazafugas/Estratega). Prioriza credibilidad sobre precisión del desglose.
- **Decisión #4 — RESUELTO:** precio oficial **$47 USD**. Unificar en todo el copy (hoy aparece $45 en `page.tsx` L2341, "$47" en landing, "$49-97" en docs).
