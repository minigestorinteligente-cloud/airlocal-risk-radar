# Documento 2: Estructura del Ecosistema (Líneas de Negocio)

**Property Intelligence (El Motor):**
* **SmartPrices:** Comparador de mercado (Airbnb/Zonaprop/Finca Raíz). Es el motor de búsqueda que alimenta todo el sistema.
* **Fuentes de Datos:** Scraping de competencia en Argentina (Zonaprop/Airbnb) y Colombia (Finca Raíz/Airbnb).
* **Capas de Análisis Predictivo:**
  1. **Capa de Eventos:** Detección de fechas de alta demanda (conciertos, ferias, festivos) para sugerir aumentos de precio anticipados.
  2. **Capa de Competencia (Factor X):** Identificación de "Anfitriones Débiles" (fotos malas, precios planos, estancias mínimas rígidas) basado en el método Sean Rakidzich para capturar cuota de mercado.
  3. **Capa Geográfica:** Comparables en un radio de X km para definir el ADR real.

**Host Tools (La Operación):**
* **SmartGuide:** Guía digital para huéspedes.
* **TurnoSync™:** Sincronización de equipos de limpieza.
* **Inventario Vivo™:** Control de stock y lista de compras automática (ReStock AI™). Detección de mermas en insumos y estado físico de la propiedad post-checkout.