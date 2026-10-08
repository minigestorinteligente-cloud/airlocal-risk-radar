// Micrositio de campaña "¿Cuánto quedó?": página HTML independiente,
// no usa el layout ni los estilos globales del sitio.
import { html } from "./html";

export const dynamic = "force-static";

export function GET() {
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
