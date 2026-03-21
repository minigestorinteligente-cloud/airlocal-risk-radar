# Documento 4: Arquitectura Técnica y Flujo de Datos

**Entrada de Datos:** Tally (Formularios de ingreso/gasto/limpieza).
**Orquestación:** n8n (Webhooks y lógica de procesamiento).
**Base de Datos:** Supabase (Almacenamiento de registros de propiedades y competencia).
**Enriquecimiento:** Scraping con IA (Firecrawl/Crawl4AI) para capturar competencia en Colombia/Argentina.
**Cerebro:** Gemini 1.5/2.0 Pro (Análisis predictivo y generación de reportes).
**Salida:** Reporte Web (Cursor/React) + Notificaciones WhatsApp.