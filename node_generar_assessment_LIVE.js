// Genera assessment_code y uuid para el registro FREE nuevo.
// No toca el body original; solo agrega dos identificadores para Supabase.
const original = $json.body || $json;

function randomCode(len) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

return [{
  json: {
    body: original,
    __assessment_code: 'AR-' + randomCode(8),
    __uuid: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : randomCode(32)
  }
}];
