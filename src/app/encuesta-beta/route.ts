export const dynamic = 'force-dynamic';

export async function GET() {
  const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AIRLOCAL — Encuesta Beta</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<style>
  :root{
    --brand-lime:#92E83F; --brand-lime-600:#74C42D;
    --brand-teal:#58bdc2; --brand-teal-600:#01545e;
    --charcoal:#494C4B;
    --healthy:#92E83F; --vulnerable:#F5B53D; --critical:#F0544F;
    --bg:#0D0F0E; --surface:#161A19; --surface-2:#1D2220;
    --border:#2A302E; --text:#F2F5F4; --text-muted:#8A928F;
  }
  *{box-sizing:border-box;}
  body{
    margin:0; background:var(--bg); color:var(--text);
    font-family:'Inter',Arial,sans-serif; min-height:100vh;
    background-image: radial-gradient(circle at 15% 0%, rgba(88,189,194,0.07), transparent 40%);
  }
  .wrap{max-width:640px; margin:0 auto; padding:40px 20px 80px;}
  .brand{display:flex; align-items:baseline; gap:8px; margin-bottom:6px;}
  .brand-name{font-family:'Montserrat',sans-serif; font-weight:900; font-size:20px; letter-spacing:0.5px;}
  .brand-name span{color:var(--brand-teal);}
  .brand-sub{font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--text-muted); margin-bottom:36px;}
  h1{font-family:'Montserrat',sans-serif; font-weight:800; font-size:26px; line-height:1.25; margin:0 0 8px;}
  .lede{color:var(--text-muted); font-size:14.5px; line-height:1.6; margin:0 0 32px;}
  .card{background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:24px; margin-bottom:16px;}
  .q-label{font-size:13px; font-weight:700; color:var(--text); margin-bottom:4px; display:block;}
  .q-num{color:var(--brand-teal); font-family:'JetBrains Mono',monospace; font-size:12px; margin-right:6px;}
  .q-hint{font-size:12px; color:var(--text-muted); margin-bottom:14px;}
  input[type=text], textarea{
    width:100%; background:var(--surface-2); border:1px solid var(--border); border-radius:10px;
    color:var(--text); font-family:'Inter',sans-serif; font-size:14px; padding:12px 14px; resize:vertical;
  }
  input[type=text]:focus, textarea:focus{outline:none; border-color:var(--brand-teal);}
  .scale{display:flex; gap:8px; flex-wrap:wrap;}
  .scale button, .choice button{
    background:var(--surface-2); border:1px solid var(--border); color:var(--text);
    border-radius:10px; padding:10px 14px; font-family:'Inter',sans-serif; font-size:13px; font-weight:600;
    cursor:pointer; transition:all .15s ease;
  }
  .scale button.sel, .choice button.sel{
    background:rgba(88,189,194,0.12); border-color:var(--brand-teal); color:var(--brand-teal);
  }
  .scale button:hover, .choice button:hover{border-color:var(--brand-teal);}
  .scale.stars{gap:4px;}
  .scale.stars button{background:transparent; border:none; padding:2px; font-size:22px; color:var(--border); line-height:1; box-shadow:none;}
  .scale.stars button.sel{background:transparent; border:none; color:var(--brand-lime);}
  .scale.stars button:hover{border:none; color:var(--brand-lime); opacity:0.7;}
  .choice{display:flex; gap:8px; flex-wrap:wrap;}
  .nps-row{display:flex; gap:6px; flex-wrap:wrap;}
  .nps-row button{width:36px; height:36px; padding:0; display:flex; align-items:center; justify-content:center; font-family:'JetBrains Mono',monospace;}
  .nps-labels{display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted); margin-top:6px;}
  .submit-btn{
    width:100%; background:var(--brand-teal); color:#04211f; border:none; border-radius:12px;
    padding:16px; font-family:'Montserrat',sans-serif; font-weight:800; font-size:14px;
    letter-spacing:0.5px; text-transform:uppercase; cursor:pointer; margin-top:8px;
  }
  .submit-btn:hover{background:#6fc9ce;}
  .submit-btn:disabled{opacity:.4; cursor:not-allowed;}
  .err{color:var(--critical); font-size:12px; margin-top:8px;}
  .thanks{text-align:center; padding:60px 20px;}
  .thanks .icon{font-size:40px; margin-bottom:16px;}
  .thanks h2{font-family:'Montserrat',sans-serif; font-weight:800; font-size:22px; margin:0 0 10px;}
  .thanks p{color:var(--text-muted); font-size:14px; line-height:1.6;}
  .hidden{display:none !important;}
  .footer-link{text-align:center; margin-top:30px; font-size:11px; color:var(--border);}
  .footer-link a{color:var(--border); text-decoration:none;}
  .stat-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:12px; margin-bottom:24px;}
  .stat-box{background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:16px;}
  .stat-box .label{font-size:10.5px; letter-spacing:1px; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px;}
  .stat-box .value{font-family:'Montserrat',sans-serif; font-weight:900; font-size:28px; color:var(--brand-teal);}
  .stat-box .value.lime{color:var(--brand-lime);}
  .resp-card{background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:18px; margin-bottom:12px;}
  .resp-head{display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;}
  .resp-name{font-weight:700; font-size:14px;}
  .resp-date{font-size:11px; color:var(--text-muted); font-family:'JetBrains Mono',monospace;}
  .resp-row{font-size:12.5px; color:var(--text-muted); margin-bottom:4px; line-height:1.5;}
  .resp-row b{color:var(--text); font-weight:600;}
  .badge{display:inline-block; padding:2px 8px; border-radius:20px; font-size:10.5px; font-weight:700;}
  .badge.yes{background:rgba(146,232,63,0.15); color:var(--brand-lime);}
  .badge.no{background:rgba(240,84,79,0.15); color:var(--critical);}
  .empty-state{text-align:center; padding:60px 20px; color:var(--text-muted);}
</style>
</head>
<body>
<div id="app" class="wrap"></div>
<script>
var supabase = window.supabase.createClient('${SB_URL}', '${SB_KEY}');

var state = {
  view: 'form',
  answers: { name:'', q1:null, q2:null, q3:null, q3_detail:'', q4:null, q5:null, q6:'', q7:'',
             feat_precios:null, feat_whatsapp:null, feat_reportes:null, q8:null },
  submitting: false,
  error: ''
};

function render(){
  var app = document.getElementById('app');
  if (location.hash === '#resultados') { state.view = 'results'; }
  if (state.view === 'form') app.innerHTML = renderForm();
  else if (state.view === 'thanks') app.innerHTML = renderThanks();
  else if (state.view === 'results') { app.innerHTML = renderResultsShell(); loadResults(); }
  attachHandlers();
}

function header(){
  return '<div class="brand"><span class="brand-name">AIRLOCAL<span>™</span></span></div>' +
         '<div class="brand-sub">Inteligencia Operativa · BNB</div>';
}

function btns(field, vals, cur, isNum){
  return vals.map(function(v){
    var sel = isNum ? cur===v : cur===v;
    return '<button type="button" data-val="' + v + '" class="' + (sel?'sel':'') + '">' + v + '</button>';
  }).join('');
}
function stars(field, cur, vals){
  return vals.map(function(v){
    return '<button type="button" data-val="' + v + '" class="' + (cur>=v?'sel':'') + '">★</button>';
  }).join('');
}

function renderForm(){
  var a = state.answers;
  var nps = Array.from({length:11},function(_,n){
    return '<button type="button" data-val="' + n + '" class="' + (a.q5===n?'sel':'') + '">' + n + '</button>';
  }).join('');

  return header() +
    '<h1>Fuiste una de las 10 personas que elegimos para esto. Gracias.</h1>' +
    '<p class="lede">Tu opinión de los próximos 2 minutos no se queda en un cajón — literalmente decide qué construimos después. Y de paso, nos ayudas a construir algo mejor para tu propia operación.</p>' +

    '<div class="card"><span class="q-label"><span class="q-num">00</span>Tu nombre o propiedad</span>' +
    '<input type="text" id="f-name" placeholder="Ej: Carlos / Apto Bogotá" value="' + (a.name||'') + '"></div>' +

    '<div class="card"><span class="q-label"><span class="q-num">01</span>¿Qué tan claro fue el resultado de tu diagnóstico?</span>' +
    '<div class="q-hint">1 = confuso · 5 = totalmente claro</div>' +
    '<div class="scale" data-field="q1">' + btns('q1',[1,2,3,4,5],a.q1,true) + '</div></div>' +

    '<div class="card"><span class="q-label"><span class="q-num">02</span>¿El resultado reflejó la realidad de tu operación?</span>' +
    '<div class="choice" data-field="q2">' + btns('q2',['Sí','Parcialmente','No'],a.q2,false) + '</div></div>' +

    '<div class="card"><span class="q-label"><span class="q-num">03</span>¿Descubriste algo sobre tu propiedad que no sabías?</span>' +
    '<div class="choice" data-field="q3" style="margin-bottom:12px;">' + btns('q3',['Sí','No'],a.q3,false) + '</div>' +
    (a.q3==='Sí' ? '<input type="text" id="f-q3detail" placeholder="¿Qué descubriste?" value="' + (a.q3_detail||'') + '">' : '') +
    '</div>' +

    '<div class="card"><span class="q-label"><span class="q-num">04</span>¿Qué tan fácil fue usar la plataforma, de principio a fin?</span>' +
    '<div class="q-hint">1 = difícil · 5 = muy fácil</div>' +
    '<div class="scale" data-field="q4">' + btns('q4',[1,2,3,4,5],a.q4,true) + '</div></div>' +

    '<div class="card"><span class="q-label"><span class="q-num">05</span>Del 0 al 10, ¿qué tan probable es que lo recomiendes?</span>' +
    '<div class="nps-row" data-field="q5">' + nps + '</div>' +
    '<div class="nps-labels"><span>Nada probable</span><span>Seguro que sí</span></div></div>' +

    '<div class="card"><span class="q-label"><span class="q-num">06</span>Ya viste lo que hace este diagnóstico. Si tuvieras que pagarlo hoy, ¿cuánto te parecería justo?</span>' +
    '<textarea id="f-q6" rows="2" placeholder="Ej: Unos $30-40 por el diagnóstico">' + (a.q6||'') + '</textarea></div>' +

    '<div class="card"><span class="q-label"><span class="q-num">07</span>¿Qué le falta o qué cambiarías?</span>' +
    '<textarea id="f-q7" rows="3" placeholder="Sé tan honesto/a como quieras">' + (a.q7||'') + '</textarea></div>' +

    '<div class="card"><span class="q-label"><span class="q-num">08</span>Estamos decidiendo qué construir después. Califica del 1 al 5 qué tanto te ayudaría cada una:</span>' +
    '<div class="q-hint">1 = no me sirve · 5 = me ayudaría muchísimo</div>' +
    '<div style="margin-bottom:18px;"><div class="q-hint" style="font-weight:700;color:var(--text);font-size:13px;margin-bottom:8px;">📊 Ver los precios de la competencia cerca de mi propiedad</div>' +
    '<div class="scale stars" data-field="feat_precios">' + stars('feat_precios',a.feat_precios,[1,2,3,4,5]) + '</div></div>' +
    '<div style="margin-bottom:18px;"><div class="q-hint" style="font-weight:700;color:var(--text);font-size:13px;margin-bottom:8px;">💬 Registrar mis gastos e ingresos por WhatsApp, sin planillas</div>' +
    '<div class="scale stars" data-field="feat_whatsapp">' + stars('feat_whatsapp',a.feat_whatsapp,[1,2,3,4,5]) + '</div></div>' +
    '<div><div class="q-hint" style="font-weight:700;color:var(--text);font-size:13px;margin-bottom:8px;">📄 Recibir un reporte de cierre listo para mostrar (propiedad o portafolio)</div>' +
    '<div class="scale stars" data-field="feat_reportes">' + stars('feat_reportes',a.feat_reportes,[1,2,3,4,5]) + '</div></div></div>' +

    '<div class="card"><span class="q-label"><span class="q-num">09</span>Si tu experiencia le sirve a otro anfitrión para animarse a probar esto, ¿nos dejas contarla con tu nombre?</span>' +
    '<div class="q-hint">Te destacamos como uno de los primeros en confiar en AIRLOCAL.</div>' +
    '<div class="choice" data-field="q8">' + btns('q8',['Sí, con mi nombre','Sí, pero anónimo','No'],a.q8,false) + '</div></div>' +

    '<button class="submit-btn" id="btn-submit"' + (state.submitting?' disabled':'') + '>' +
    (state.submitting?'Enviando…':'Enviar respuestas') + '</button>' +
    (state.error ? '<div class="err">' + state.error + '</div>' : '') +
    '<div class="footer-link">AIRLOCAL™ · Encuesta beta interna</div>';
}

function renderThanks(){
  return header() +
    '<div class="thanks"><div class="icon">✓</div>' +
    '<h2>Gracias por tu tiempo.</h2>' +
    '<p>Tu respuesta ya quedó guardada. Esto es exactamente lo que necesitamos<br>para decidir qué construir después de la beta.</p></div>';
}

function renderResultsShell(){
  return header() +
    '<h1>Resultados — Beta Testers</h1>' +
    '<p class="lede">Vista interna. No compartir este link con testers.</p>' +
    '<div id="results-content"><div class="empty-state">Cargando respuestas…</div></div>';
}

async function loadResults(){
  var content = document.getElementById('results-content');
  try {
    var res = await supabase.from('beta_survey_responses').select('*').order('submitted_at',{ascending:false});
    if (res.error) throw res.error;
    var all = res.data || [];
    if (!all.length){ content.innerHTML = '<div class="empty-state">Todavía no hay respuestas.</div>'; return; }

    function avg(arr){ return arr.length ? arr.reduce(function(s,v){return s+v;},0)/arr.length : 0; }
    var q1s = all.map(function(r){return r.q1;}).filter(function(v){return typeof v==='number';});
    var q4s = all.map(function(r){return r.q4;}).filter(function(v){return typeof v==='number';});
    var q5s = all.map(function(r){return r.q5;}).filter(function(v){return typeof v==='number';});
    var promoters = q5s.filter(function(v){return v>=9;}).length;
    var detractors = q5s.filter(function(v){return v<=6;}).length;
    var nps = q5s.length ? Math.round(((promoters-detractors)/q5s.length)*100) : 0;
    var yesReal = all.filter(function(r){return r.q2==='Sí';}).length;
    var testimonios = all.filter(function(r){return r.q8 && r.q8.startsWith('Sí');}).length;
    var fp = avg(all.map(function(r){return r.feat_precios;}).filter(function(v){return typeof v==='number';}));
    var fw = avg(all.map(function(r){return r.feat_whatsapp;}).filter(function(v){return typeof v==='number';}));
    var fr = avg(all.map(function(r){return r.feat_reportes;}).filter(function(v){return typeof v==='number';}));
    var fm = Math.max(fp,fw,fr);

    var statsHtml =
      '<div class="stat-grid">' +
        '<div class="stat-box"><div class="label">Respuestas</div><div class="value">' + all.length + '</div></div>' +
        '<div class="stat-box"><div class="label">Claridad prom.</div><div class="value">' + avg(q1s).toFixed(1) + '</div></div>' +
        '<div class="stat-box"><div class="label">Facilidad prom.</div><div class="value">' + avg(q4s).toFixed(1) + '</div></div>' +
        '<div class="stat-box"><div class="label">NPS</div><div class="value lime">' + nps + '</div></div>' +
        '<div class="stat-box"><div class="label">Reflejó realidad</div><div class="value">' + (all.length?Math.round(yesReal/all.length*100):0) + '%</div></div>' +
        '<div class="stat-box"><div class="label">Dan testimonio</div><div class="value lime">' + testimonios + '</div></div>' +
      '</div>' +
      '<div class="stat-grid" style="grid-template-columns:repeat(3,1fr);">' +
        '<div class="stat-box"><div class="label">📊 Precios competencia</div><div class="value ' + (fp===fm&&fm>0?'lime':'') + '">' + fp.toFixed(1) + '</div></div>' +
        '<div class="stat-box"><div class="label">💬 Gastos por WhatsApp</div><div class="value ' + (fw===fm&&fm>0?'lime':'') + '">' + fw.toFixed(1) + '</div></div>' +
        '<div class="stat-box"><div class="label">📄 Reportes de cierre</div><div class="value ' + (fr===fm&&fm>0?'lime':'') + '">' + fr.toFixed(1) + '</div></div>' +
      '</div>';

    var rowsHtml = all.map(function(r){
      return '<div class="resp-card">' +
        '<div class="resp-head">' +
          '<span class="resp-name">' + esc(r.name||'Sin nombre') + '</span>' +
          '<span class="resp-date">' + new Date(r.submitted_at).toLocaleString('es-CO',{dateStyle:'short',timeStyle:'short'}) + '</span>' +
        '</div>' +
        '<div class="resp-row"><b>Claridad:</b> ' + r.q1 + '/5 &nbsp;·&nbsp; <b>Facilidad:</b> ' + r.q4 + '/5 &nbsp;·&nbsp; <b>NPS:</b> ' + r.q5 + '/10</div>' +
        '<div class="resp-row"><b>Reflejó realidad:</b> ' + esc(r.q2||'—') + ' &nbsp;·&nbsp; <b>Descubrió algo:</b> ' + esc(r.q3||'—') + (r.q3_detail?' — '+esc(r.q3_detail):'') + '</div>' +
        '<div class="resp-row"><b>Pagaría:</b> ' + esc(r.q6||'—') + '</div>' +
        '<div class="resp-row"><b>Precios:</b> ' + (r.feat_precios||'—') + '/5 &nbsp;·&nbsp; <b>WhatsApp:</b> ' + (r.feat_whatsapp||'—') + '/5 &nbsp;·&nbsp; <b>Reportes:</b> ' + (r.feat_reportes||'—') + '/5</div>' +
        '<div class="resp-row"><b>Qué falta:</b> ' + esc(r.q7||'—') + '</div>' +
        '<div class="resp-row"><b>Testimonio:</b> <span class="badge ' + (r.q8&&r.q8.startsWith('Sí')?'yes':'no') + '">' + esc(r.q8||'—') + '</span></div>' +
      '</div>';
    }).join('');

    content.innerHTML = statsHtml + rowsHtml;
  } catch(e){
    content.innerHTML = '<div class="empty-state">No se pudieron cargar las respuestas. Intenta recargar.</div>';
  }
}

function esc(s){
  var d = document.createElement('div'); d.innerText = s; return d.innerHTML;
}

function attachHandlers(){
  document.querySelectorAll('[data-field]').forEach(function(group){
    var field = group.getAttribute('data-field');
    group.querySelectorAll('button').forEach(function(btn){
      btn.onclick = function(){
        var val = btn.getAttribute('data-val');
        if (['q1','q4','q5','feat_precios','feat_whatsapp','feat_reportes'].indexOf(field)!==-1) val = parseInt(val,10);
        state.answers[field] = val;
        render();
      };
    });
  });
  var el;
  el = document.getElementById('f-name');    if(el) el.oninput = function(e){state.answers.name=e.target.value;};
  el = document.getElementById('f-q3detail');if(el) el.oninput = function(e){state.answers.q3_detail=e.target.value;};
  el = document.getElementById('f-q6');      if(el) el.oninput = function(e){state.answers.q6=e.target.value;};
  el = document.getElementById('f-q7');      if(el) el.oninput = function(e){state.answers.q7=e.target.value;};
  el = document.getElementById('btn-submit');if(el) el.onclick = handleSubmit;
}

async function handleSubmit(){
  var a = state.answers;
  var required = ['name','q1','q2','q3','q4','q5','feat_precios','feat_whatsapp','feat_reportes','q8'];
  var missing = required.filter(function(k){return a[k]===null||a[k]==='';});
  if (missing.length){ state.error='Falta responder algunas preguntas antes de enviar.'; render(); return; }
  state.submitting = true; state.error = ''; render();
  try {
    var res = await supabase.from('beta_survey_responses').insert({
      name:a.name, q1:a.q1, q2:a.q2, q3:a.q3, q3_detail:a.q3_detail,
      q4:a.q4, q5:a.q5, q6:a.q6, q7:a.q7,
      feat_precios:a.feat_precios, feat_whatsapp:a.feat_whatsapp, feat_reportes:a.feat_reportes,
      q8:a.q8, submitted_at:new Date().toISOString()
    });
    if (res.error) throw res.error;
    state.view = 'thanks'; state.submitting = false; render();
  } catch(e){
    state.submitting = false;
    state.error = 'Hubo un problema guardando tu respuesta. Intenta de nuevo.';
    render();
  }
}

window.addEventListener('hashchange', render);
render();
</script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
