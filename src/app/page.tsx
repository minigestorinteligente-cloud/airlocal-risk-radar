'use client';

import { useEffect } from 'react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');

:root{
  --bg:#0a0c0a;
  --bg-2:#0d100d;
  --surface:#12160f;
  --surface-2:#171c14;
  --border:#252b21;
  --border-bright:rgba(52,245,197,0.35);
  --lima:#34f5c5;
  --lima-dim:#00d1b2;
  --teal:#3ea293;
  --charcoal:#494c4b;
  --text:#f3f5ef;
  --muted:#98a190;
  --muted-2:#666f60;
}
*{box-sizing:border-box; margin:0; padding:0;}
html{background:var(--bg); scroll-behavior:smooth;}
body{
  background:var(--bg);
  color:var(--text);
  font-family:'Inter',sans-serif;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
@media (prefers-reduced-motion: reduce){
  *{animation-duration:0.001ms !important; animation-iteration-count:1 !important; transition-duration:0.001ms !important;}
}

:root{
  --emerald:#2FAE73;
  --amber:#C89B4A;
  --crimson:#C1453D;
}
.float-icon-img{
  position:absolute; z-index:2; object-fit:contain;
  pointer-events:none; user-select:none;
  animation:drift 8s ease-in-out infinite;
  filter:drop-shadow(0 8px 24px rgba(0,0,0,0.5));
}
.fi-key{ top:9%; left:16%; width:164px; height:164px; animation-delay:0s; }
.fi-house{ top:11%; right:14%; width:154px; height:154px; animation-delay:1.4s; }
.fi-calendar{ top:46%; left:9%; width:144px; height:144px; animation-delay:2.6s; }
.fi-suitcase{ top:57%; right:8%; width:164px; height:164px; animation-delay:0.8s; }
.fi-coin{ top:4%; left:41%; width:136px; height:136px; animation-delay:3.4s; }
.fi-star{ bottom:18%; left:16%; width:144px; height:144px; animation-delay:1.9s; }

@media (max-width:1100px){
  .fi-key{ left:10%; width:130px; height:130px; }
  .fi-house{ right:8%; width:120px; height:120px; }
  .fi-calendar{ left:5%; width:112px; height:112px; }
  .fi-suitcase{ right:4%; width:130px; height:130px; }
  .fi-coin{ width:110px; height:110px; }
  .fi-star{ left:10%; width:114px; height:114px; }
}
@media (max-width:900px){
  .fi-key{ left:5%; width:96px; height:96px; }
  .fi-house{ right:4%; width:88px; height:88px; }
  .fi-calendar{ left:2%; width:80px; height:80px; }
  .fi-suitcase{ right:2%; width:96px; height:96px; }
  .fi-coin{ width:80px; height:80px; }
  .fi-star{ left:5%; width:82px; height:82px; }
}
@media (max-width:600px){
  .float-icon-img{ display:none; }
}

.brand-logo{ height:42px; width:auto; display:block; filter:drop-shadow(0 0 10px rgba(62,162,147,0.25)); }

.dash-specs{ font-size:13px; color:var(--muted); margin-top:6px; }

.mini-stats{ display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:26px 0; }
.mini-stat{ background:var(--bg-2); border:1px solid var(--border); border-radius:14px; padding:18px 20px; }
.mini-label{ font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:0.08em; color:var(--muted-2); text-transform:uppercase; margin-bottom:10px; }
.mini-val{ font-family:'JetBrains Mono',monospace; font-weight:700; font-size:1.7rem; color:var(--text); }
.mini-val span{ font-size:0.9rem; color:var(--muted); font-weight:500; }
.mini-sub{ font-size:11.5px; color:var(--muted-2); margin-top:4px; }

.alert-box{
  border:1px solid var(--state-border, rgba(47,174,115,0.35));
  background:var(--state-bg, rgba(47,174,115,0.06));
  border-radius:18px; padding:26px 26px 24px; margin-bottom:28px;
  box-shadow:0 0 40px -18px var(--state, var(--emerald));
  transition:all .4s ease;
}
.alert-level{
  display:flex; align-items:center; gap:7px;
  font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.08em;
  color:var(--state, var(--emerald)); text-transform:uppercase; margin-bottom:14px;
}
.alert-title{ font-family:'Montserrat',sans-serif; font-weight:800; font-size:1.35rem; color:var(--text); margin-bottom:12px; }
.alert-title span{ color:var(--state, var(--emerald)); }
.alert-desc{ font-size:14.5px; color:var(--muted); line-height:1.55; margin-bottom:16px; }
.alert-line{ font-family:'Montserrat',sans-serif; font-weight:700; font-size:1rem; color:var(--text); padding-top:16px; border-top:1px solid var(--border); margin-bottom:16px; }
.alert-line b{ color:var(--state, var(--emerald)); }
.alert-impact-label{ font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:0.08em; color:var(--muted-2); text-transform:uppercase; margin-bottom:8px; }
.alert-impact{ font-size:15px; color:var(--text); }
.alert-impact span{ font-family:'JetBrains Mono',monospace; font-weight:700; color:var(--state, var(--emerald)); }
.alert-impact-annual{ font-size:13px; opacity:0.85; }

.problem-section .section-head p b{ color:var(--text); font-weight:600; }
.problem-grid{
  max-width:980px; margin:0 auto; display:grid;
  grid-template-columns:repeat(2, 1fr); gap:1px;
  background:var(--border); border:1px solid var(--border); border-radius:20px; overflow:hidden;
}
.problem-card{ background:var(--bg-2); padding:36px 32px; }
.problem-icon{
  width:46px; height:46px; border-radius:13px; margin-bottom:20px;
  background:var(--surface-2); border:1px solid var(--border);
  display:flex; align-items:center; justify-content:center; color:var(--teal);
}
.problem-icon svg{ width:23px; height:23px; }
.problem-card h3{ font-family:'Montserrat',sans-serif; font-weight:700; font-size:1.15rem; line-height:1.3; margin-bottom:10px; color:var(--text); }
.problem-card p{ font-size:14px; color:var(--muted); line-height:1.6; }
.problem-closer{
  text-align:center; max-width:520px; margin:48px auto 0;
  font-family:'Montserrat',sans-serif; font-weight:700; font-size:1.15rem; color:var(--text);
}
@media (max-width:720px){
  .problem-grid{ grid-template-columns:1fr; }
}

.report-preview{ position:relative; margin-top:8px; }
.rp-section{ padding:24px 0; border-top:1px solid var(--border); }
.rp-section:first-child{ border-top:none; padding-top:4px; }
.rp-section-head{ display:flex; gap:16px; align-items:flex-start; margin-bottom:18px; }
.rp-icon{ width:52px; height:52px; flex:none; display:flex; align-items:center; justify-content:center; }
.rp-icon img{ width:100%; height:100%; object-fit:contain; }
.rp-eyebrow{
  font-family:'JetBrains Mono',monospace; font-size:11.5px; letter-spacing:0.1em; text-transform:uppercase;
  color:var(--state, var(--emerald)); font-weight:700; margin-bottom:8px; transition:color .4s ease;
}
.rp-question{ font-family:'Montserrat',sans-serif; font-weight:700; font-size:1.08rem; line-height:1.35; color:var(--text); max-width:44ch; }
.rp-sub{ font-size:13px; color:var(--muted); margin-top:8px; line-height:1.5; max-width:46ch; }

.rp-visual{ display:flex; align-items:center; gap:24px; padding-left:56px; flex-wrap:wrap; }
.rp-mini-gauge{ position:relative; width:96px; height:96px; flex:none; }
.rp-mini-gauge svg{ width:100%; height:100%; transform:rotate(-90deg); }
.rp-gauge-track{ fill:none; stroke:var(--border); stroke-width:9; }
.rp-gauge-fill{
  fill:none; stroke:var(--state, var(--emerald)); stroke-width:9; stroke-linecap:round;
  stroke-dasharray:264; stroke-dashoffset:264;
  transition:stroke-dashoffset 1s cubic-bezier(.16,.84,.44,1), stroke .4s ease;
}
.rp-mini-gauge-num{
  position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  font-family:'JetBrains Mono',monospace; font-weight:700; font-size:1.3rem; color:var(--text);
}
.rp-chip-col{ display:flex; flex-direction:column; gap:10px; }
.rp-chip{ display:flex; align-items:baseline; gap:10px; }
.rp-chip-label{ font-size:12.5px; color:var(--muted); min-width:150px; }
.rp-chip-val{ font-family:'JetBrains Mono',monospace; font-weight:700; font-size:1rem; color:var(--state, var(--emerald)); transition:color .4s ease; }

.rp-compare{ padding-left:56px; }
.rp-compare-top{ display:flex; justify-content:space-between; font-size:13.5px; color:var(--text); margin-bottom:8px; }
.rp-compare-top span:last-child{ font-family:'JetBrains Mono',monospace; color:var(--muted); font-size:12.5px; }
.rp-compare-track{ height:8px; border-radius:100px; background:var(--border); overflow:hidden; }
.rp-compare-fill{ height:100%; border-radius:100px; background:var(--state, var(--emerald)); transition:width 1s cubic-bezier(.16,.84,.44,1), background .4s ease; }
.rp-compare-tag{ font-family:'JetBrains Mono',monospace; font-size:11.5px; color:var(--state, var(--emerald)); margin-top:8px; transition:color .4s ease; }

.rp-priority{
  margin-left:56px; display:flex; align-items:center; gap:16px;
  background:var(--bg-2); border:1px solid var(--border); border-radius:14px; padding:16px 18px;
}
.rp-priority-num{
  width:26px; height:26px; border-radius:50%; flex:none;
  background:var(--state-bg, rgba(47,174,115,0.1)); border:1px solid var(--state-border, rgba(47,174,115,0.35));
  color:var(--state, var(--emerald)); font-family:'JetBrains Mono',monospace; font-weight:700; font-size:12.5px;
  display:flex; align-items:center; justify-content:center; transition:all .4s ease;
}
.rp-priority-body{ flex:1; }
.rp-priority-title{ font-family:'Montserrat',sans-serif; font-weight:700; font-size:14.5px; color:var(--text); }
.rp-priority-desc{ font-size:12.5px; color:var(--muted); margin-top:2px; }
.rp-priority-val{ font-family:'JetBrains Mono',monospace; font-weight:700; font-size:1rem; color:var(--state, var(--emerald)); flex:none; transition:color .4s ease; }

.cta-wrap{ display:flex; flex-direction:column; align-items:center; gap:10px; margin-top:30px; padding-top:26px; border-top:1px solid var(--border); }

@media (max-width:560px){
  .rp-visual, .rp-compare, .rp-priority{ padding-left:0; margin-left:0; }
  .rp-priority{ flex-wrap:wrap; }
}

.locked-cta{
  display:inline-flex; align-items:center; justify-content:center;
  font-family:'Inter',sans-serif; font-weight:700; font-size:15px;
  color:#0a0c0a; background:linear-gradient(135deg, var(--teal), var(--lima));
  padding:16px 32px; border-radius:100px; text-decoration:none;
  box-shadow:0 0 34px rgba(62,162,147,0.3);
  transition:transform .3s ease, box-shadow .3s ease;
}
.locked-cta:hover{ transform:translateY(-2px) scale(1.02); box-shadow:0 0 50px rgba(62,162,147,0.45); }
.locked-micro{ font-size:11.5px; color:var(--muted-2); margin-top:14px; letter-spacing:0.02em; }

@media (max-width:640px){
  .mini-stats{ grid-template-columns:1fr; }
}

.state-switch{ display:flex; gap:8px; justify-content:center; margin-bottom:22px; flex-wrap:wrap; }
.state-btn{
  font-family:'JetBrains Mono',monospace; font-size:11.5px; letter-spacing:0.06em; text-transform:uppercase;
  padding:9px 16px; border-radius:100px; border:1px solid var(--border); background:var(--surface);
  color:var(--muted); cursor:pointer; transition:all .25s ease; display:flex; align-items:center; gap:7px;
}
.state-btn .sw-dot{ width:7px; height:7px; border-radius:50%; background:var(--muted-2); }
.state-btn.active{ color:var(--text); border-color:var(--sbc, var(--border-bright)); background:var(--sbg, rgba(52,245,197,0.06)); }
.state-btn.active .sw-dot{ background:var(--sbc, var(--lima)); box-shadow:0 0 8px var(--sbc, var(--lima)); }
.state-btn[data-state="saludable"].active{ --sbc: var(--emerald); --sbg: rgba(47,174,115,0.1); }
.state-btn[data-state="vulnerable"].active{ --sbc: var(--amber); --sbg: rgba(200,155,74,0.1); }
.state-btn[data-state="critico"].active{ --sbc: var(--crimson); --sbg: rgba(193,69,61,0.1); }

.dash{ transition:box-shadow .5s ease, border-color .5s ease; }
.dash::before{ transition:background .5s ease; }

.mono{font-family:'JetBrains Mono',monospace;}
.display{font-family:'Montserrat',sans-serif; font-weight:800; letter-spacing:-0.02em;}

.bg-layer{position:fixed; inset:0; z-index:0; pointer-events:none; overflow:hidden;}
.bg-grid{
  position:absolute; inset:-10%;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size:64px 64px;
  opacity:0.16;
  mask-image:radial-gradient(ellipse 70% 60% at 50% 20%, black 40%, transparent 85%);
}
.bg-radar{
  position:absolute; top:-320px; left:50%; transform:translateX(-50%);
  width:1100px; height:1100px; border-radius:50%;
  border:1px solid var(--border); opacity:0.5;
}
.bg-radar::before, .bg-radar::after{
  content:''; position:absolute; border-radius:50%; border:1px solid var(--border);
}
.bg-radar::before{ inset:140px; }
.bg-radar::after{ inset:280px; }
.bg-sweep{
  position:absolute; top:-320px; left:50%; width:1100px; height:1100px;
  transform-origin:50% 50%;
  background:conic-gradient(from 0deg, rgba(52,245,197,0.18), transparent 22%);
  border-radius:50%;
  transform:translateX(-50%);
  animation:sweep 7s linear infinite;
  mix-blend-mode:screen;
}
@keyframes sweep{ to{ transform:translateX(-50%) rotate(360deg);} }

.bg-map{
  position:absolute; inset:0;
  background-size:cover; background-position:center;
  opacity:0.4; filter:saturate(0.9) contrast(1.05);
  mask-image:radial-gradient(ellipse 75% 65% at 50% 35%, black 30%, transparent 88%);
  -webkit-mask-image:radial-gradient(ellipse 75% 65% at 50% 35%, black 30%, transparent 88%);
}
.bg-map-scrim{
  position:absolute; inset:0;
  background:radial-gradient(ellipse 60% 55% at 50% 32%, rgba(10,12,10,0.78) 0%, rgba(10,12,10,0.42) 55%, rgba(10,12,10,0.05) 100%);
}

nav{
  position:relative; z-index:10;
  display:flex; align-items:center; justify-content:space-between;
  padding:26px 6vw;
  border-bottom:1px solid var(--border);
  backdrop-filter:blur(6px);
}
.brand{display:flex; align-items:center; gap:10px;}
.brand-text{display:flex; flex-direction:column; line-height:1.2; justify-content:center;}
.brand-text .brand-name{font-family:'Montserrat',sans-serif; font-weight:800; font-size:14px; letter-spacing:0.03em; color:var(--text);}
.brand-text .brand-sub{font-size:10.5px; color:var(--muted); letter-spacing:0.03em;}
.nav-cta{
  font-family:'Inter',sans-serif; font-weight:600; font-size:14px;
  color:#0a0c0a; background:var(--lima);
  padding:11px 20px; border-radius:100px; text-decoration:none;
  transition:box-shadow .3s ease, transform .3s ease;
}
.nav-cta:hover{ box-shadow:0 0 28px rgba(52,245,197,0.45); transform:translateY(-1px); }

.hero{
  position:relative; z-index:5;
  padding:9vw 6vw 8vw;
  display:flex; flex-direction:column; align-items:center; text-align:center;
  min-height:88vh; justify-content:center;
}
.eyebrow{
  display:inline-flex; align-items:center; gap:8px;
  font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.12em;
  color:var(--lima); text-transform:uppercase; margin-bottom:26px;
  border:1px solid var(--border-bright); padding:7px 16px; border-radius:100px;
  background:rgba(52,245,197,0.05);
}
.eyebrow .dot{width:6px; height:6px; border-radius:50%; background:var(--lima); box-shadow:0 0 10px var(--lima); animation:pulse 1.8s ease-in-out infinite;}
@keyframes pulse{ 0%,100%{opacity:1;} 50%{opacity:0.35;} }

h1{
  font-size:clamp(2.4rem, 6vw, 5.2rem);
  line-height:1.05;
  max-width:16ch;
  text-wrap:balance;
}
h1 .accent{ color:var(--lima); }
h1 .fade{ color:var(--muted-2); }

.hero-sub{
  font-size:clamp(1rem, 1.6vw, 1.2rem);
  color:var(--muted); max-width:52ch; margin:26px 0 40px; line-height:1.55; font-weight:400;
}
.hero-sub b{color:var(--text); font-weight:600;}

.cta-primary{
  font-family:'Inter',sans-serif; font-weight:700; font-size:16px;
  color:#0a0c0a; background:var(--lima);
  padding:18px 34px; border-radius:100px; text-decoration:none;
  display:inline-flex; align-items:center; gap:10px;
  box-shadow:0 0 40px rgba(52,245,197,0.25);
  transition:transform .3s ease, box-shadow .3s ease;
}
.cta-primary:hover{ transform:translateY(-2px) scale(1.02); box-shadow:0 0 60px rgba(52,245,197,0.4); }
.trust-line{ margin-top:18px; font-size:12.5px; color:var(--muted-2); letter-spacing:0.02em; }

@keyframes drift{
  0%,100%{ transform:translateY(0px) rotate(0deg); }
  50%{ transform:translateY(-18px) rotate(4deg); }
}

.stat-pill{
  position:relative; z-index:5;
  display:grid; grid-template-columns:repeat(4,1fr);
  gap:1px; background:var(--border);
  border:1px solid var(--border);
  margin-top:64px; max-width:920px; width:100%;
  border-radius:16px; overflow:hidden;
}
.stat-cell{ background:var(--bg-2); padding:24px 14px; text-align:center; }
.stat-divider{ display:none; }
.stat-num{ font-family:'JetBrains Mono',monospace; font-weight:700; font-size:clamp(1.5rem,2.6vw,2.1rem); color:var(--lima); }
.stat-label{ font-size:11.5px; color:var(--muted); margin-top:6px; letter-spacing:0.01em; }
@media (max-width:640px){
  .stat-pill{ grid-template-columns:1fr 1fr; }
}

.section{ position:relative; z-index:5; padding:8vw 6vw; }
.section-head{ text-align:center; max-width:640px; margin:0 auto 56px; }
.section-eyebrow{
  font-family:'JetBrains Mono',monospace; font-size:12px; letter-spacing:0.12em;
  color:var(--teal); text-transform:uppercase; margin-bottom:14px;
}
.section-head h2{ font-size:clamp(1.9rem,3.6vw,3rem); line-height:1.1; }
.section-head p{ color:var(--muted); margin-top:16px; font-size:1.05rem; line-height:1.6; }

.dash{
  max-width:760px; margin:0 auto;
  background:linear-gradient(180deg, var(--surface), var(--surface-2));
  border:1px solid var(--border); border-radius:24px;
  padding:36px 30px; position:relative; overflow:hidden;
  box-shadow:0 40px 100px -30px rgba(0,0,0,0.7);
}
.dash::before{
  content:''; position:absolute; top:-2px; left:10%; right:10%; height:2px;
  background:linear-gradient(90deg, transparent, var(--state, var(--emerald)), transparent);
  opacity:0.7; transition:background .4s ease;
}
.dash-title{ font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--muted-2); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:6px;}
.dash-property{ font-family:'Montserrat',sans-serif; font-weight:700; font-size:22px; margin-bottom:2px; }

#dashCard.state-saludable{ --state:var(--emerald); --state-bg:rgba(47,174,115,0.08); --state-border:rgba(47,174,115,0.35); }
#dashCard.state-vulnerable{ --state:var(--amber); --state-bg:rgba(200,155,74,0.09); --state-border:rgba(200,155,74,0.4); }
#dashCard.state-critico{ --state:var(--crimson); --state-bg:rgba(193,69,61,0.09); --state-border:rgba(193,69,61,0.4); }

.reveal{ opacity:0; transform:translateY(28px); transition:opacity .8s ease, transform .8s ease; }
.reveal.in{ opacity:1; transform:translateY(0); }

.trust-band{ position:relative; z-index:5; padding:64px 6vw; background:var(--bg-2); border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
.trust-grid{ max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:32px; }
.trust-item{ display:flex; flex-direction:column; align-items:flex-start; gap:14px; }
.trust-icon{
  width:40px; height:40px; border-radius:11px; flex:none;
  background:var(--surface-2); border:1px solid var(--border);
  display:flex; align-items:center; justify-content:center; color:var(--lima);
}
.trust-icon svg{ width:20px; height:20px; }
.trust-item h4{ font-family:'Montserrat',sans-serif; font-weight:700; font-size:0.98rem; color:var(--text); margin-bottom:6px; }
.trust-item p{ font-size:13px; color:var(--muted); line-height:1.5; }
@media (max-width:860px){ .trust-grid{ grid-template-columns:1fr 1fr; } }
@media (max-width:560px){ .trust-grid{ grid-template-columns:1fr; } }

.founder-section{ padding-top:9vw; padding-bottom:9vw; }
.manifesto{
  text-align:center; max-width:16ch; margin:0 auto 64px;
  font-family:'Montserrat',sans-serif; font-weight:900; letter-spacing:-0.02em;
  font-size:clamp(2rem, 5vw, 3.4rem); line-height:1.12; color:var(--text);
}
.accent-underline{ color:var(--lima); text-decoration:underline; text-decoration-color:rgba(52,245,197,0.35); text-decoration-thickness:3px; text-underline-offset:8px; }

.founder-grid{ max-width:1080px; margin:0 auto; display:grid; grid-template-columns:0.9fr 1.1fr; gap:64px; align-items:start; }
.founder-copy p{ font-size:15.5px; color:var(--muted); line-height:1.7; margin-top:16px; }
.founder-copy p:first-of-type{ margin-top:14px; }

.founder-consequences{ display:flex; flex-direction:column; gap:20px; }
.consequence-row{
  display:flex; gap:14px; align-items:flex-start;
  background:var(--bg-2); border:1px solid var(--border); border-radius:14px; padding:18px 20px;
}
.consequence-icon{ width:38px; height:38px; flex:none; margin-top:-4px; object-fit:contain; }
.consequence-row p{ font-size:14px; color:var(--text); line-height:1.55; }
@media (max-width:820px){ .founder-grid{ grid-template-columns:1fr; gap:40px; } }

.final-cta{ position:relative; padding:11vw 6vw; text-align:center; overflow:hidden; border-top:1px solid var(--border); background:transparent; }
.final-cta-inner{ position:relative; z-index:2; max-width:640px; margin:0 auto; }
.final-cta-inner h2{ font-size:clamp(1.8rem,3.4vw,2.6rem); line-height:1.15; margin-bottom:20px; }
.final-sub{ color:var(--muted); font-size:1.05rem; line-height:1.6; margin-bottom:34px; }
.final-sub b{ color:var(--text); font-weight:600; }
.final-cta .trust-line{ margin-top:20px; }

.site-footer{ position:relative; z-index:5; padding:40px 6vw 30px; border-top:1px solid var(--border); }
.footer-inner{ max-width:1100px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:18px; }
.brand-mark-img{ height:28px; width:auto; display:block; filter:drop-shadow(0 0 8px rgba(52,245,197,0.35)); }
.footer-brand{ display:flex; align-items:center; gap:12px; }
.footer-brand .brand-mark-img{ height:26px; }
.footer-tagline{ font-size:12.5px; color:var(--muted); }
.footer-links{ display:flex; gap:22px; font-size:12.5px; }
.footer-links a{ color:var(--muted); text-decoration:none; }
.footer-links a:hover{ color:var(--text); }
.footer-copy{ max-width:1100px; margin:22px auto 0; padding-top:18px; border-top:1px solid var(--border); font-size:11.5px; color:var(--muted-2); text-align:center; }
`;

export default function Home() {
  useEffect(() => {
    function animateCount(el: Element, target: number) {
      const dur = 1400, start = performance.now();
      const dataset = (el as HTMLElement).dataset;
      const prefix = dataset.prefix || '', suffix = dataset.suffix || '';
      function step(now: number) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(target * eased);
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    const statEls = document.querySelectorAll('.stat-pill [data-count]');
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target, parseInt((entry.target as HTMLElement).dataset.count || '0', 10));
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    statEls.forEach(el => statObserver.observe(el));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    type StateData = {
      property: string; specs: string; occ: string; adr: string;
      levelText: string; titleAccent: string; desc: string; lineHtml: string;
      potMonthly: string; potAnnual: string;
      score: number; margin: string; potencial: string;
      compareLabel: string; compareVal: string; compareWidth: number; compareTag: string;
      priorityTitle: string; priorityDesc: string; priorityVal: string;
    };

    const STATES: Record<string, StateData> = {
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
        priorityTitle: 'Comisiones OTA', priorityDesc: 'Mayor impacto económico inmediato.', priorityVal: '+$180/mes'
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
        priorityTitle: 'Precio sin optimizar', priorityDesc: 'Tu tarifa base necesita ajuste.', priorityVal: '+$140/mes'
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
        priorityTitle: 'Otros gastos', priorityDesc: 'Revisar esta categoría primero.', priorityVal: '+$340/mes'
      }
    };

    const dashCard = document.getElementById('dashCard');
    const RING_CIRC = 2 * Math.PI * 42;

    function applyState(key: string) {
      const s = STATES[key];
      if (!dashCard || !s) return;
      dashCard.classList.remove('state-saludable', 'state-vulnerable', 'state-critico');
      dashCard.classList.add('state-' + key);

      (document.getElementById('dashProperty') as HTMLElement).textContent = s.property;
      (document.getElementById('dashSpecs') as HTMLElement).textContent = s.specs;
      (document.getElementById('occVal') as HTMLElement).textContent = s.occ;
      (document.getElementById('adrVal') as HTMLElement).innerHTML = s.adr + ' <span>USD</span>';
      const alertLevelText = document.getElementById('alertLevelText');
      if (alertLevelText) alertLevelText.textContent = s.levelText;
      (document.getElementById('alertTitleAccent') as HTMLElement).textContent = s.titleAccent;
      (document.getElementById('alertDesc') as HTMLElement).textContent = s.desc;
      (document.getElementById('alertLine') as HTMLElement).innerHTML = s.lineHtml;
      (document.getElementById('potMonthly') as HTMLElement).textContent = s.potMonthly;
      (document.getElementById('potAnnual') as HTMLElement).textContent = s.potAnnual;

      const rpScoreRing = document.getElementById('rpScoreRing') as SVGCircleElement | null;
      if (rpScoreRing) rpScoreRing.style.strokeDashoffset = String(RING_CIRC - (s.score / 100) * RING_CIRC);
      (document.getElementById('rpScoreNum') as HTMLElement).textContent = String(s.score);
      (document.getElementById('rpMargin') as HTMLElement).textContent = s.margin;
      (document.getElementById('rpPotencial') as HTMLElement).textContent = s.potencial;

      (document.getElementById('rpCompareLabel') as HTMLElement).textContent = s.compareLabel;
      (document.getElementById('rpCompareVal') as HTMLElement).textContent = s.compareVal;
      (document.getElementById('rpCompareBar') as HTMLElement).style.width = s.compareWidth + '%';
      (document.getElementById('rpCompareTag') as HTMLElement).textContent = s.compareTag;

      (document.getElementById('rpPriorityTitle') as HTMLElement).textContent = s.priorityTitle;
      (document.getElementById('rpPriorityDesc') as HTMLElement).textContent = s.priorityDesc;
      (document.getElementById('rpPriorityVal') as HTMLElement).textContent = s.priorityVal;

      document.querySelectorAll('.state-btn').forEach(btn => {
        btn.classList.toggle('active', (btn as HTMLElement).dataset.state === key);
      });
    }

    document.querySelectorAll('.state-btn').forEach(btn => {
      btn.addEventListener('click', () => applyState((btn as HTMLElement).dataset.state || 'critico'));
    });

    const rpScoreRing = document.getElementById('rpScoreRing') as SVGCircleElement | null;
    if (rpScoreRing) rpScoreRing.style.strokeDasharray = String(RING_CIRC);
    applyState('critico');

    return () => { io.disconnect(); };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="bg-layer">
        <div className="bg-map" style={{backgroundImage:"url('/assets/hero-map-bg.webp')"}}></div>
        <div className="bg-map-scrim"></div>
        <div className="bg-grid"></div>
        <div className="bg-radar"></div>
        <div className="bg-sweep"></div>
      </div>

      <nav>
        <div className="brand">
          <img className="brand-mark-img" src="/assets/logo-mark.webp" alt="AIRLOCAL" />
          <div className="brand-text">
            <span className="brand-name">AIRLOCAL</span>
            <span className="brand-sub">Inteligencia operativa | BNB</span>
          </div>
        </div>
        <a className="nav-cta" href="/auditoria-test">Auditar mi operación</a>
      </nav>

      <section className="hero">
        <img className="float-icon-img fi-key" src="/assets/icon-key.webp" alt="" aria-hidden="true" />
        <img className="float-icon-img fi-house" src="/assets/icon-house.webp" alt="" aria-hidden="true" />
        <img className="float-icon-img fi-calendar" src="/assets/icon-calendar.webp" alt="" aria-hidden="true" />
        <img className="float-icon-img fi-suitcase" src="/assets/icon-suitcase.webp" alt="" aria-hidden="true" />
        <img className="float-icon-img fi-coin" src="/assets/icon-coin.webp" alt="" aria-hidden="true" />
        <img className="float-icon-img fi-star" src="/assets/icon-star.webp" alt="" aria-hidden="true" />

        <div className="eyebrow"><span className="dot"></span>Para propietarios de alquiler vacacional · BNB</div>

        <h1 className="display">¿Tu BNB realmente genera <span className="accent">ganancias</span> <span className="fade">o solo ingresos?</span></h1>

        <p className="hero-sub">La mayoría de propietarios con buena ocupación <b>nunca ha verificado si realmente gana dinero.</b> No es culpa tuya — los números que ves no son los que importan.</p>

        <a className="cta-primary" href="/auditoria-test">
          Descubrir la verdad de mi operación
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
        <div className="trust-line">Sin instalación · Sin compromiso · 90 segundos</div>

        <div className="stat-pill">
          <div className="stat-cell"><div className="stat-num mono" data-count="90" data-suffix="s">0</div><div className="stat-label">y lo tienes</div></div>
          <span className="stat-divider"></span>
          <div className="stat-cell"><div className="stat-num mono" data-count="3" data-suffix="">0</div><div className="stat-label">ángulos de análisis</div></div>
          <span className="stat-divider"></span>
          <div className="stat-cell"><div className="stat-num mono" data-count="1" data-suffix="">0</div><div className="stat-label">Plan de acción</div></div>
          <span className="stat-divider"></span>
          <div className="stat-cell"><div className="stat-num mono">∞</div><div className="stat-label">Decisiones mejores</div></div>
        </div>
      </section>

      <section className="section problem-section">
        <div className="section-head reveal">
          <div className="section-eyebrow">El problema real</div>
          <h2 className="display">El problema no es tu ocupación.</h2>
          <p>Es que <b>sin los números correctos</b>, cada decisión es una apuesta. No un plan.</p>
        </div>

        <div className="problem-grid">
          <div className="problem-card reveal" style={{ transitionDelay: '0s' }}>
            <div className="problem-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v18"/><path d="M5 7h14"/><path d="M5 7l-3 6a4 4 0 008 0l-3-6"/><path d="M19 7l-3 6a4 4 0 008 0l-3-6"/></svg>
            </div>
            <h3>No sabes tu punto de equilibrio real</h3>
            <p>Cuántas noches mínimas necesitas para no perder dinero este mes. Sin eso, no sabes qué tan cerca del filo estás operando.</p>
          </div>

          <div className="problem-card reveal" style={{ transitionDelay: '0.08s' }}>
            <div className="problem-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 10 8 10 8a17.7 17.7 0 01-2.16 3.19M6.61 6.61C3.13 8.94 2 12 2 12s3 8 10 8a9.27 9.27 0 005.39-1.61"/><path d="M14.12 14.12a3 3 0 11-4.24-4.24"/><path d="M1 1l22 22"/></svg>
            </div>
            <h3>Tienes costos que no estás midiendo</h3>
            <p>Comisiones, limpieza, mantenimiento, impuestos. Cada uno erosiona el margen en silencio, mes a mes.</p>
          </div>

          <div className="problem-card reveal" style={{ transitionDelay: '0.16s' }}>
            <div className="problem-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><rect x="7" y="13" width="3" height="5"/><rect x="12" y="9" width="3" height="9"/><rect x="17" y="5" width="3" height="13"/></svg>
            </div>
            <h3>No puedes compararte con el mercado</h3>
            <p>Sin benchmark, no sabes si tu gasto operativo es eficiente o si estás regalando margen sin darte cuenta.</p>
          </div>

          <div className="problem-card reveal" style={{ transitionDelay: '0.24s' }}>
            <div className="problem-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.8" fill="currentColor"/></svg>
            </div>
            <h3>Optimizas lo visible. Ignoras lo que duele</h3>
            <p>La ocupación se ve. Las fugas de rentabilidad no. Ahí está exactamente el dinero que se pierde.</p>
          </div>
        </div>

        <p className="problem-closer reveal">Cada mes sin esta claridad es dinero que ya no vuelve.</p>
      </section>

      <section className="section">
        <div className="section-head reveal">
          <div className="section-eyebrow">Comienza con la Auditoría</div>
          <h2 className="display">Toda operación tiene un estado. Descubre cuál es el de la tuya.</h2>
          <p>Este es el tipo de diagnóstico personalizado que recibirás al completar tu Auditoría EXPRESS.</p>
        </div>

        <div className="state-switch reveal">
          <button className="state-btn" data-state="saludable"><span className="sw-dot"></span>Saludable</button>
          <button className="state-btn" data-state="vulnerable"><span className="sw-dot"></span>Vulnerable</button>
          <button className="state-btn active" data-state="critico"><span className="sw-dot"></span>Crítico</button>
        </div>

        <div className="dash reveal state-critico" id="dashCard">
          <div className="dash-title">Propiedad auditada</div>
          <div className="dash-property" id="dashProperty">Loft Reforma · CDMX, MX</div>
          <div className="dash-specs" id="dashSpecs">4 huéspedes · 1 hab · 1 baños — 26 noches vendidas este mes</div>

          <div className="mini-stats">
            <div className="mini-stat">
              <div className="mini-label">Occupancy rate</div>
              <div className="mini-val" id="occVal">87%</div>
              <div className="mini-sub">Ocupación real del mes</div>
            </div>
            <div className="mini-stat">
              <div className="mini-label">ADR actual</div>
              <div className="mini-val" id="adrVal">$77 <span>USD</span></div>
              <div className="mini-sub">Tarifa promedio diaria</div>
            </div>
          </div>

          <div className="alert-box" id="alertBox">
            <div className="alert-level" id="alertLevel">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
              <span id="alertLevelText">NIVEL DE ALERTA OPERATIVA: ALTO</span>
            </div>
            <div className="alert-title">AUDITORÍA: <span id="alertTitleAccent">RIESGO OPERATIVO CRÍTICO</span></div>
            <p className="alert-desc" id="alertDesc">Tu operación genera utilidad, pero con un margen crítico: una pequeña caída de ingresos o subida de costos te empujaría a pérdida.</p>
            <div className="alert-line" id="alertLine">Estás a <b>2 noches</b> de entrar en pérdida.</div>
            <div className="alert-impact-label">Impacto económico</div>
            <div className="alert-impact">Potencial económico identificado: <span id="potMonthly">+$640 USD/mes</span> <span className="alert-impact-annual" id="potAnnual">(+$7,680 USD/año)</span></div>
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
                    <circle className="rp-gauge-track" cx="50" cy="50" r="42"/>
                    <circle className="rp-gauge-fill" id="rpScoreRing" cx="50" cy="50" r="42"/>
                  </svg>
                  <div className="rp-mini-gauge-num" id="rpScoreNum">31</div>
                </div>
                <div className="rp-chip-col">
                  <div className="rp-chip"><span className="rp-chip-label">Margen neto</span><span className="rp-chip-val" id="rpMargin">3%</span></div>
                  <div className="rp-chip"><span className="rp-chip-label">Potencial recuperable</span><span className="rp-chip-val" id="rpPotencial">+$640/mes</span></div>
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
                  <span id="rpCompareLabel">Otros gastos</span>
                  <span id="rpCompareVal">20% tuyo · 3% ideal</span>
                </div>
                <div className="rp-compare-track"><div className="rp-compare-fill" id="rpCompareBar" style={{ width: '0%' }}></div></div>
                <div className="rp-compare-tag" id="rpCompareTag">fuga +17 pts frente al benchmark</div>
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
                  <div className="rp-priority-title" id="rpPriorityTitle">Otros gastos</div>
                  <div className="rp-priority-desc" id="rpPriorityDesc">Revisar esta categoría primero.</div>
                </div>
                <div className="rp-priority-val" id="rpPriorityVal">+$340/mes</div>
              </div>
            </div>
          </div>

          <div className="cta-wrap">
            <a className="locked-cta" href="/auditoria-test">Descubrir dónde se pierde el dinero</a>
            <div className="locked-micro">Acceso instantáneo · Auditoría 100% personalizada</div>
          </div>
        </div>
      </section>

      <section className="trust-band">
        <div className="trust-grid">
          <div className="trust-item reveal" style={{ transitionDelay: '0s' }}>
            <div className="trust-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/></svg>
            </div>
            <div>
              <h4>Tus datos son privados</h4>
              <p>No compartimos ni vendemos tu información operativa. Se usa solo para calcular tu diagnóstico.</p>
            </div>
          </div>
          <div className="trust-item reveal" style={{ transitionDelay: '0.08s' }}>
            <div className="trust-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
            </div>
            <div>
              <h4>Sin instalaciones, sin integraciones</h4>
              <p>Solo necesitas responder unas preguntas sobre tu operación.</p>
            </div>
          </div>
          <div className="trust-item reveal" style={{ transitionDelay: '0.16s' }}>
            <div className="trust-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            </div>
            <div>
              <h4>90 segundos, no 90 minutos</h4>
              <p>Sin conectar sistemas ni subir archivos. Solo respondes lo que ya sabes.</p>
            </div>
          </div>
          <div className="trust-item reveal" style={{ transitionDelay: '0.24s' }}>
            <div className="trust-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.8" fill="currentColor"/></svg>
            </div>
            <div>
              <h4>Auditoría 100% tuya</h4>
              <p>Cada resultado se calcula con tus números — no con promedios genéricos del mercado.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section founder-section">
        <p className="manifesto reveal">Sin data, no se toman <span className="accent-underline">buenas decisiones.</span></p>

        <div className="founder-grid">
          <div className="founder-copy reveal">
            <div className="section-eyebrow">Por qué existe AIRLOCAL</div>
            <p>Antes de construir AIRLOCAL, operé propiedades de alquiler vacacional. Vi de cerca cómo una buena ocupación puede esconder una operación que pierde dinero — y lo caro que sale enterarte tarde.</p>
            <p>AIRLOCAL existe porque la mayoría de los propietarios decide con la única cifra que sí ve todos los días: la ocupación. Y esa cifra, sola, no dice si estás ganando o perdiendo.</p>
          </div>

          <div className="founder-consequences">
            <div className="consequence-row reveal" style={{ transitionDelay: '0s' }}>
              <img className="consequence-icon" src="/assets/icon-tagdown.webp" alt="" loading="lazy" />
              <p>Bajas el precio pensando que subirá la ocupación — y solo bajas tu margen.</p>
            </div>
            <div className="consequence-row reveal" style={{ transitionDelay: '0.08s' }}>
              <img className="consequence-icon" src="/assets/icon-receipt.webp" alt="" loading="lazy" />
              <p>Sigues con el mismo proveedor de limpieza dos años, sin saber que subió 40% sus tarifas.</p>
            </div>
            <div className="consequence-row reveal" style={{ transitionDelay: '0.16s' }}>
              <img className="consequence-icon" src="/assets/icon-twohouses.webp" alt="" loading="lazy" />
              <p>Escalas a una segunda propiedad con una que nunca fue rentable — y duplicas el problema.</p>
            </div>
            <div className="consequence-row reveal" style={{ transitionDelay: '0.24s' }}>
              <img className="consequence-icon" src="/assets/icon-piggybank.webp" alt="" loading="lazy" />
              <p>Descubres que estabas en pérdida — cuando ya es tarde para corregir a tiempo.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="final-cta-inner reveal">
          <h2 className="display">Comprueba si existe un problema real en tu operación.</h2>
          <p className="final-sub">No prometemos ahorrarte dinero. <b>Prometemos mostrarte la verdad operativa.</b><br />Una vez la veas, el siguiente paso se hace solo evidente.</p>
          <a className="cta-primary" href="/auditoria-test">
            Descubrir mi diagnóstico operativo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
          <div className="trust-line">Sin registro · Sin compromiso · BNB en Latinoamérica</div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <img className="brand-mark-img" src="/assets/logo-mark.webp" alt="AIRLOCAL" />
            <div className="footer-tagline">AIRLOCAL™ by propiqdata.com</div>
          </div>
          <div className="footer-links">
            <a href="#">Términos</a>
            <a href="#">Privacidad</a>
            <a href="mailto:soporte@propiqdata.com">soporte@propiqdata.com</a>
          </div>
        </div>
        <div className="footer-copy">© 2026 AIRLOCAL</div>
      </footer>
    </>
  );
}
