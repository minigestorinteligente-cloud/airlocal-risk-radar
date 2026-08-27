'use client';

import { useState, useEffect, useRef } from 'react';

const RING_CIRC = 2 * Math.PI * 42;
const CAROUSEL_MS = 2800;

type StateKey = 'saludable' | 'vulnerable' | 'critico';

const KEYS: StateKey[] = ['saludable', 'vulnerable', 'critico'];

type StateData = {
  property: string; specs: string; occ: string; adr: string;
  levelText: string; titleAccent: string; desc: string; lineHtml: string;
  potMonthly: string; potAnnual: string;
  score: number; margin: string; potencial: string;
  compareLabel: string; compareVal: string; compareWidth: number; compareTag: string;
  priorityTitle: string; priorityDesc: string; priorityVal: string;
};

const STATES: Record<StateKey, StateData> = {
  saludable: {
    property: 'Villa Coral · Cancún, MX',
    specs: '3 huéspedes · 2 hab · 1 baños — 24 noches vendidas este mes',
    occ: '80%', adr: '$210',
    levelText: 'NIVEL DE ALERTA OPERATIVA: BAJO',
    titleAccent: 'OPERACIÓN SALUDABLE',
    desc: 'Tu operación genera utilidad. Pero antes de escalar a una segunda propiedad, asegura que entiendes dónde se filtra el dinero.',
    lineHtml: 'Tienes <b>14 noches</b> de colchón operativo.',
    potMonthly: '+$420 USD/mes', potAnnual: '(+$5,040 USD/año)',
    score: 86, margin: '38%', potencial: '+$420/mes',
    compareLabel: 'Servicios', compareVal: '10% tuyo · 12% ideal', compareWidth: 40, compareTag: 'bajo el ideal — margen de holgura',
    priorityTitle: 'Comisiones OTA', priorityDesc: 'Mayor impacto económico inmediato.', priorityVal: '+$180/mes',
  },
  vulnerable: {
    property: 'Villa · Bogotá, Colombia',
    specs: '2 huéspedes · 1 hab · 1 baños — 17 noches vendidas este mes',
    occ: '57%', adr: '$176',
    levelText: 'NIVEL DE ALERTA OPERATIVA: MEDIO',
    titleAccent: 'MARGEN OPERATIVO TENSO',
    desc: 'Tu estructura de gastos es elevada. Tu rentabilidad es vulnerable.',
    lineHtml: 'Estás a <b>9 noches</b> de entrar en pérdida.',
    potMonthly: '+$282 USD/mes', potAnnual: '(+$3,384 USD/año)',
    score: 58, margin: '14%', potencial: '+$282/mes',
    compareLabel: 'Comisiones OTA', compareVal: '18% tuyo · 15% ideal', compareWidth: 68, compareTag: 'fuga +3 pts frente al benchmark',
    priorityTitle: 'Precio sin optimizar', priorityDesc: 'Tu tarifa base necesita ajuste.', priorityVal: '+$140/mes',
  },
  critico: {
    property: 'Loft Reforma · CDMX, MX',
    specs: '4 huéspedes · 1 hab · 1 baños — 26 noches vendidas este mes',
    occ: '87%', adr: '$77',
    levelText: 'NIVEL DE ALERTA OPERATIVA: ALTO',
    titleAccent: 'RIESGO OPERATIVO CRÍTICO',
    desc: 'Tu operación genera utilidad, pero con un margen crítico: una pequeña caída de ingresos o subida de costos te empujaría a pérdida.',
    lineHtml: 'Estás a <b>2 noches</b> de entrar en pérdida.',
    potMonthly: '+$640 USD/mes', potAnnual: '(+$7,680 USD/año)',
    score: 31, margin: '3%', potencial: '+$640/mes',
    compareLabel: 'Otros gastos', compareVal: '20% tuyo · 3% ideal', compareWidth: 92, compareTag: 'fuga +17 pts frente al benchmark',
    priorityTitle: 'Otros gastos', priorityDesc: 'Revisar esta categoría primero.', priorityVal: '+$340/mes',
  },
};

const DSC_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');

.dsc-wrap{
  --bg:#0a0c0a;--bg-2:#0d100d;--surface:#12160f;--surface-2:#171c14;
  --border:#252b21;--border-bright:rgba(52,245,197,0.35);
  --lima:#34f5c5;--lima-dim:#00d1b2;--teal:#3ea293;
  --text:#f3f5ef;--muted:#98a190;--muted-2:#666f60;
  --emerald:#2FAE73;--amber:#C89B4A;--crimson:#C1453D;
}

.dsc-wrap .section{position:relative;z-index:5;padding:8vw 6vw;}
.dsc-wrap .section-head{max-width:680px;margin:0 auto 48px;text-align:center;}
.dsc-wrap .section-eyebrow{font-family:'Montserrat',Inter,sans-serif;font-size:.65rem;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:var(--lima-dim);margin-bottom:12px;}
.dsc-wrap h2.display{font-family:'Montserrat',Inter,sans-serif;font-size:clamp(1.6rem,4vw,2.6rem);font-weight:900;line-height:1.15;color:var(--text);margin:0 0 16px;}
.dsc-wrap .section-head p{font-size:1rem;color:var(--muted);max-width:520px;margin:0 auto;}

.dsc-wrap .reveal{opacity:0;transform:translateY(20px);transition:opacity .7s ease,transform .7s ease;}
.dsc-wrap .reveal.in{opacity:1;transform:none;}

.dsc-wrap .state-switch{display:flex;justify-content:center;gap:10px;margin-bottom:28px;flex-wrap:wrap;}
.dsc-wrap .state-btn{font-family:'Montserrat',Inter,sans-serif;font-size:.62rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:8px 20px;border-radius:100px;border:1px solid var(--border);background:var(--surface);color:var(--muted);cursor:pointer;transition:all .2s ease;display:flex;align-items:center;gap:6px;}
@keyframes dsc-pulse-s{0%,100%{box-shadow:0 0 0 0 rgba(47,174,115,0);}50%{box-shadow:0 0 14px 3px rgba(47,174,115,0.38);}}
@keyframes dsc-pulse-v{0%,100%{box-shadow:0 0 0 0 rgba(200,155,74,0);}50%{box-shadow:0 0 14px 3px rgba(200,155,74,0.38);}}
@keyframes dsc-pulse-c{0%,100%{box-shadow:0 0 0 0 rgba(193,69,61,0);}50%{box-shadow:0 0 14px 3px rgba(193,69,61,0.38);}}
.dsc-wrap .state-btn.active{background:var(--surface-2);color:var(--text);}
.dsc-wrap .state-btn[data-state="saludable"].active{border-color:var(--emerald);animation:dsc-pulse-s 1.5s ease-in-out infinite;}
.dsc-wrap .state-btn[data-state="vulnerable"].active{border-color:var(--amber);animation:dsc-pulse-v 1.5s ease-in-out infinite;}
.dsc-wrap .state-btn[data-state="critico"].active{border-color:var(--crimson);animation:dsc-pulse-c 1.5s ease-in-out infinite;}
.dsc-wrap .sw-dot{width:6px;height:6px;border-radius:50%;background:var(--muted-2);transition:background .2s,opacity .2s;opacity:0.45;}
.dsc-wrap .state-btn[data-state="saludable"] .sw-dot{background:var(--emerald);}
.dsc-wrap .state-btn[data-state="vulnerable"] .sw-dot{background:var(--amber);}
.dsc-wrap .state-btn[data-state="critico"] .sw-dot{background:var(--crimson);}
.dsc-wrap .state-btn.active .sw-dot{opacity:1;}

.dsc-wrap .dash{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px 28px 24px;max-width:760px;margin:0 auto;transition:border-color .4s ease;}
.dsc-wrap .dash.state-saludable{--state:var(--emerald);--state-bg:rgba(47,174,115,0.08);--state-border:rgba(47,174,115,0.35);}
.dsc-wrap .dash.state-vulnerable{--state:var(--amber);--state-bg:rgba(200,155,74,0.09);--state-border:rgba(200,155,74,0.4);}
.dsc-wrap .dash.state-critico{--state:var(--crimson);--state-bg:rgba(193,69,61,0.09);--state-border:rgba(193,69,61,0.4);}
.dsc-wrap .dash{border-color:var(--state-border,var(--border));}

.dsc-wrap .dash-title{font-family:'Montserrat',Inter,sans-serif;font-size:.58rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:var(--muted-2);margin-bottom:6px;}
.dsc-wrap .dash-property{font-family:'Montserrat',Inter,sans-serif;font-size:1.15rem;font-weight:800;color:var(--text);margin-bottom:4px;}
.dsc-wrap .dash-specs{font-size:.78rem;color:var(--muted);margin-bottom:20px;}

.dsc-wrap .mini-stats{display:flex;gap:12px;margin-bottom:20px;}
.dsc-wrap .mini-stat{flex:1;background:var(--bg-2);border:1px solid var(--border);border-radius:12px;padding:14px 16px;}
.dsc-wrap .mini-label{font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted-2);margin-bottom:4px;}
.dsc-wrap .mini-val{font-family:'Montserrat',Inter,sans-serif;font-size:1.5rem;font-weight:900;color:var(--text);line-height:1;}
.dsc-wrap .mini-val span{font-size:.9rem;color:var(--muted);font-weight:500;}
.dsc-wrap .mini-sub{font-size:.65rem;color:var(--muted-2);margin-top:4px;}

.dsc-wrap .alert-box{border:1px solid var(--state-border,var(--border));background:var(--state-bg,transparent);border-radius:14px;padding:18px 20px;margin-bottom:20px;transition:border-color .4s,background .4s;}
.dsc-wrap .alert-level{display:flex;align-items:center;gap:6px;font-size:.6rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--state,var(--emerald));margin-bottom:8px;}
.dsc-wrap .alert-title{font-family:'Montserrat',Inter,sans-serif;font-size:.9rem;font-weight:900;letter-spacing:.04em;color:var(--text);margin-bottom:10px;}
.dsc-wrap .alert-title span{color:var(--state,var(--emerald));transition:color .4s;}
.dsc-wrap .alert-desc{font-size:.82rem;color:var(--muted);line-height:1.55;margin:0 0 10px;}
.dsc-wrap .alert-line{font-size:.82rem;color:var(--text);font-weight:600;margin-bottom:14px;}
.dsc-wrap .alert-line b{color:var(--state,var(--emerald));font-weight:800;}
.dsc-wrap .alert-impact-label{font-size:.58rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted-2);margin-bottom:5px;}
.dsc-wrap .alert-impact{font-size:.85rem;color:var(--muted);}
.dsc-wrap .alert-impact span{color:var(--state,var(--emerald));font-weight:700;transition:color .4s;}
.dsc-wrap .alert-impact-annual{font-size:.75rem;color:var(--muted-2) !important;font-weight:500 !important;}

.dsc-wrap .report-preview{display:flex;flex-direction:column;gap:12px;margin-bottom:20px;}
.dsc-wrap .rp-section{background:var(--bg-2);border:1px solid var(--border);border-radius:12px;padding:16px 18px;}
.dsc-wrap .rp-section-head{display:flex;gap:12px;align-items:flex-start;margin-bottom:12px;}
.dsc-wrap .rp-icon{width:32px;height:32px;flex-shrink:0;border-radius:8px;overflow:hidden;background:var(--surface-2);}
.dsc-wrap .rp-icon img{width:100%;height:100%;object-fit:cover;}
.dsc-wrap .rp-eyebrow{font-size:.58rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--lima-dim);margin-bottom:3px;}
.dsc-wrap .rp-question{font-size:.8rem;font-weight:600;color:var(--text);line-height:1.4;}
.dsc-wrap .rp-sub{font-size:.75rem;color:var(--muted);line-height:1.4;margin:4px 0 0;}

.dsc-wrap .rp-visual{display:flex;align-items:center;gap:16px;}
.dsc-wrap .rp-mini-gauge{position:relative;width:80px;height:80px;flex-shrink:0;}
.dsc-wrap .rp-mini-gauge svg{width:100%;height:100%;transform:rotate(-90deg);}
.dsc-wrap .rp-gauge-track{fill:none;stroke:var(--border);stroke-width:9;}
.dsc-wrap .rp-gauge-fill{fill:none;stroke:var(--state,var(--emerald));stroke-width:9;stroke-linecap:round;stroke-dasharray:264;stroke-dashoffset:264;transition:stroke-dashoffset 1s cubic-bezier(.16,.84,.44,1),stroke .4s ease;}
.dsc-wrap .rp-mini-gauge-num{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Montserrat',Inter,sans-serif;font-size:1.1rem;font-weight:900;color:var(--text);}
.dsc-wrap .rp-chip-col{display:flex;flex-direction:column;gap:8px;flex:1;}
.dsc-wrap .rp-chip{display:flex;justify-content:space-between;align-items:center;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px 12px;}
.dsc-wrap .rp-chip-label{font-size:.65rem;color:var(--muted);font-weight:500;}
.dsc-wrap .rp-chip-val{font-family:'Montserrat',Inter,sans-serif;font-size:.75rem;font-weight:900;color:var(--text);}

.dsc-wrap .rp-compare{display:flex;flex-direction:column;gap:6px;}
.dsc-wrap .rp-compare-top{display:flex;justify-content:space-between;font-size:.72rem;color:var(--muted);}
.dsc-wrap .rp-compare-track{height:6px;background:var(--border);border-radius:100px;overflow:hidden;}
.dsc-wrap .rp-compare-fill{height:100%;background:var(--state,var(--emerald));border-radius:100px;transition:width .8s ease,background .4s;}
.dsc-wrap .rp-compare-tag{font-size:.65rem;color:var(--muted-2);}

.dsc-wrap .rp-priority{display:flex;align-items:center;gap:12px;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px 14px;}
.dsc-wrap .rp-priority-num{font-family:'Montserrat',Inter,sans-serif;font-size:.8rem;font-weight:900;color:var(--state,var(--emerald));min-width:16px;}
.dsc-wrap .rp-priority-body{flex:1;}
.dsc-wrap .rp-priority-title{font-size:.8rem;font-weight:700;color:var(--text);}
.dsc-wrap .rp-priority-desc{font-size:.7rem;color:var(--muted);}
.dsc-wrap .rp-priority-val{font-family:'Montserrat',Inter,sans-serif;font-size:.75rem;font-weight:900;color:var(--state,var(--emerald));white-space:nowrap;}

.dsc-wrap .cta-wrap{display:flex;flex-direction:column;align-items:center;gap:8px;padding-top:4px;}
.dsc-wrap .locked-cta{font-family:'Montserrat',Inter,sans-serif;font-size:.7rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase;background:var(--lima);color:#060807;padding:13px 32px;border-radius:100px;text-decoration:none;transition:opacity .2s;}
.dsc-wrap .locked-cta:hover{opacity:.88;}
.dsc-wrap .locked-micro{font-size:.6rem;color:var(--muted-2);letter-spacing:.08em;}
`;

export default function DiagnosticShowcase({ descriptionText }: { descriptionText: string }) {
  const [active, setActive] = useState<StateKey>('critico');
  const [cardIn, setCardIn] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const s = STATES[active];
  const ringOffset = RING_CIRC - (s.score / 100) * RING_CIRC;

  // Carousel: starts when card enters viewport, always runs (no hover-pause)
  useEffect(() => {
    if (!cardIn) return;
    timerRef.current = setInterval(() => {
      setActive(prev => KEYS[(KEYS.indexOf(prev) + 1) % KEYS.length]);
    }, CAROUSEL_MS);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [cardIn]);

  const handleClick = (key: StateKey) => {
    setActive(key);
    // Reset timer so it doesn't jump right after a manual click
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(prev => KEYS[(KEYS.indexOf(prev) + 1) % KEYS.length]);
    }, CAROUSEL_MS);
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    // Reveal for static elements (section-head, state-switch) — imperative is safe
    // because React never changes their className
    const staticIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          staticIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    wrap.querySelectorAll('.section-head, .state-switch').forEach(el => staticIo.observe(el));

    // Reveal for the dash card — use React state to avoid className conflict on re-renders
    const card = cardRef.current;
    if (card) {
      const cardIo = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setCardIn(true);
          cardIo.disconnect();
        }
      }, { threshold: 0.15 });
      cardIo.observe(card);
      return () => { staticIo.disconnect(); cardIo.disconnect(); };
    }
    return () => staticIo.disconnect();
  }, []);

  return (
    <div className="dsc-wrap" ref={wrapRef}>
      <style dangerouslySetInnerHTML={{ __html: DSC_CSS }} />

      <section className="section">
        <div className="section-head reveal">
          <div className="section-eyebrow">Comienza con tu Diagnóstico Express</div>
          <h2 className="display">Toda operación tiene un estado. Descubre cuál es el tuyo...</h2>
          {descriptionText && <p>{descriptionText}</p>}
        </div>

        <div className="state-switch reveal">
          <button
            data-state="saludable"
            className={`state-btn${active === 'saludable' ? ' active' : ''}`}
            onClick={() => handleClick('saludable')}
          >
            <span className="sw-dot" />Saludable
          </button>
          <button
            data-state="vulnerable"
            className={`state-btn${active === 'vulnerable' ? ' active' : ''}`}
            onClick={() => handleClick('vulnerable')}
          >
            <span className="sw-dot" />Vulnerable
          </button>
          <button
            data-state="critico"
            className={`state-btn${active === 'critico' ? ' active' : ''}`}
            onClick={() => handleClick('critico')}
          >
            <span className="sw-dot" />Crítico
          </button>
        </div>

        <div ref={cardRef} className={`dash reveal${cardIn ? ' in' : ''} state-${active}`}>
          <div className="dash-title">Propiedad auditada</div>
          <div className="dash-property">{s.property}</div>
          <div className="dash-specs">{s.specs}</div>

          <div className="mini-stats">
            <div className="mini-stat">
              <div className="mini-label">Occupancy rate</div>
              <div className="mini-val">{s.occ}</div>
              <div className="mini-sub">Ocupación real del mes</div>
            </div>
            <div className="mini-stat">
              <div className="mini-label">ADR actual</div>
              <div className="mini-val">{s.adr} <span>USD</span></div>
              <div className="mini-sub">Tarifa promedio diaria</div>
            </div>
          </div>

          <div className="alert-box">
            <div className="alert-level">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
              <span>{s.levelText}</span>
            </div>
            <div className="alert-title">AUDITORÍA: <span>{s.titleAccent}</span></div>
            <p className="alert-desc">{s.desc}</p>
            <div className="alert-line" dangerouslySetInnerHTML={{ __html: s.lineHtml }} />
            <div className="alert-impact-label">Impacto económico</div>
            <div className="alert-impact">
              Potencial económico identificado: <span>{s.potMonthly}</span>{' '}
              <span className="alert-impact-annual">{s.potAnnual}</span>
            </div>
          </div>

          <div className="report-preview">
            <div className="rp-section">
              <div className="rp-section-head">
                <div className="rp-icon"><img src="/assets/icon-guardian.webp" alt="" loading="lazy" /></div>
                <div>
                  <div className="rp-eyebrow">Detecta</div>
                  <div className="rp-question">¿Qué tan saludable está tu operación y cuánto dinero estás dejando sobre la mesa?</div>
                </div>
              </div>
              <div className="rp-visual">
                <div className="rp-mini-gauge">
                  <svg viewBox="0 0 100 100">
                    <circle className="rp-gauge-track" cx="50" cy="50" r="42" />
                    <circle
                      className="rp-gauge-fill"
                      cx="50" cy="50" r="42"
                      style={{ strokeDasharray: RING_CIRC, strokeDashoffset: ringOffset }}
                    />
                  </svg>
                  <div className="rp-mini-gauge-num">{s.score}</div>
                </div>
                <div className="rp-chip-col">
                  <div className="rp-chip">
                    <span className="rp-chip-label">Margen neto</span>
                    <span className="rp-chip-val">{s.margin}</span>
                  </div>
                  <div className="rp-chip">
                    <span className="rp-chip-label">Potencial recuperable</span>
                    <span className="rp-chip-val">{s.potencial}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rp-section">
              <div className="rp-section-head">
                <div className="rp-icon"><img src="/assets/icon-cazafugas.webp" alt="" loading="lazy" /></div>
                <div>
                  <div className="rp-eyebrow">Analiza</div>
                  <div className="rp-question">¿Cómo se compara tu operación frente a propiedades similares y qué revela ese análisis?</div>
                </div>
              </div>
              <div className="rp-compare">
                <div className="rp-compare-top">
                  <span>{s.compareLabel}</span>
                  <span>{s.compareVal}</span>
                </div>
                <div className="rp-compare-track">
                  <div className="rp-compare-fill" style={{ width: s.compareWidth + '%' }} />
                </div>
                <div className="rp-compare-tag">{s.compareTag}</div>
              </div>
            </div>

            <div className="rp-section">
              <div className="rp-section-head">
                <div className="rp-icon"><img src="/assets/icon-estratega.webp" alt="" loading="lazy" /></div>
                <div>
                  <div className="rp-eyebrow">Prioriza</div>
                  <div className="rp-question">¿Qué debes corregir primero para proteger tu rentabilidad?</div>
                  <p className="rp-sub">Identifica qué frentes operativos revisar primero, ordenados por impacto económico.</p>
                </div>
              </div>
              <div className="rp-priority">
                <span className="rp-priority-num">1</span>
                <div className="rp-priority-body">
                  <div className="rp-priority-title">{s.priorityTitle}</div>
                  <div className="rp-priority-desc">{s.priorityDesc}</div>
                </div>
                <div className="rp-priority-val">{s.priorityVal}</div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
